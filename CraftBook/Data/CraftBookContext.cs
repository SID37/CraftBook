﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CraftBook.Models;
using System.Text.RegularExpressions;

namespace CraftBook.Data
{
    public class CraftBookContext : DbContext
    {
        /// <summary>
        /// Конструктор контекста
        /// </summary>
        /// <param name="options"></param>
        public CraftBookContext(DbContextOptions<CraftBookContext> options) : base(options)
        {
            Database.Migrate();
        }

        /// <summary>
        /// Поиск первых n ингредиентов, начинающихся на строку 
        /// </summary>
        /// <param name="nameChip">Строка - начало</param>
        /// <param name="n">Число нужных ингредиентов</param>
        /// <returns></returns>
        public List<Ingredient> FindIngredients(string nameChip, int n)
        {
            nameChip = Regex.Escape(nameChip ?? "");
            Regex regex = new Regex(@"(^|\s)" + nameChip, RegexOptions.Compiled | RegexOptions.IgnoreCase);
            return Ingredients.Include(i => i.Unit).Where(i => regex.IsMatch(i.Name)).Take(n).ToList();
        }

        /// <summary>
        /// Находит рецепты, соответствующие набору ингредиентов
        /// </summary>
        /// <param name="ingredients">Набор ингредиентов</param>
        /// <returns></returns>
        public List<UserRecipe> FindRecipes(List<UserIngredient> ingredients)
        {
            //  тут отбрасываются рецепты, которые не подходят совсем
            var filter = this.Recipe
                .Include(r => r.Ingredients)
                .ThenInclude(iq => iq.Ingredient)
                .ThenInclude(i => i.Unit)
                .ToList() //  тут я сдался и сделал вместо запросов к БД обычный список, так оно ещё и оказалось быстрее!
                .Where(r => ingredients.Any(ui => r.Ingredients.Select(iq => iq.IngredientID).Contains(ui.ID)));

            //  сортировака по соответствию списку ингредиентов
            var ingredSort = filter
                .OrderBy(r =>
                {
                    int count = ingredients                     //  ингредиенты пользователя
                        .Where(ui => r.CountOfIgr(ui.ID) > 0)   //  которые нужны для рецепта
                        .Count();                               //  их количество
                    return r.Ingredients.Count - count;         //  количество тех, которые остались(не хватает для приготовления)
                })
                .ThenBy(r =>
                {
                    double[] percent = ingredients                                  //  ингредиенты пользователя
                        .Where(ui => r.CountOfIgr(ui.ID) > 0)                       //  которые содержатся в рецепте
                        .Select(ui => Percent(ui.Quantity ?? 0, r.CountOfIgr(ui.ID)))    //  На сколько их у пользователя хватает
                        .ToArray();                                                 //  пихаем в массив
                    return 1 - percent.Sum() / percent.Length;
                });

            return ingredSort
                .Select(r => new UserRecipe(r))
                .ToList();
        }

        public List<UnitOfMeasurement> GetUnitList()
        {
            return UnitOfMeasurement.ToList();
        }
        
        /// <summary>
        /// Возвращает ингредиент с заданным именем или ничего, если ингредиент не найден
        /// </summary>
        /// <param name="name">Его название</param>
        /// <returns></returns>
        public UserAbstractIngredient GetINgredient(string name)
        {
            Ingredient ingredient = Ingredients.Include(igr => igr.Unit).FirstOrDefault(igr => igr.Name == name);
            if (ingredient != null)
                return new UserAbstractIngredient(ingredient);
            else
                return null;
        }

        public List<UserRecipe> FindRecipes(int[] recipes)
        {
            var unloadRecipec = this.Recipe
                     .Where(r => recipes.Contains(r.ID))
                     .Include(r => r.Ingredients)
                     .ThenInclude(iq => iq.Ingredient)
                     .ThenInclude(i => i.Unit);
            return unloadRecipec.Select(r => new UserRecipe(r)).ToList();
        }

        /// <summary>
        /// Возвращает часть, занимаемую quantity в requiredQuantity или 1 если quantity больше
        /// </summary>
        /// <param name="quantity">часть</param>
        /// <param name="requiredQuantity">необходимое количество</param>
        /// <returns></returns>
        private double Percent(double quantity, double requiredQuantity)
        {
            return quantity >= requiredQuantity ? 1 : quantity / requiredQuantity;
        }

        /// <summary>
        /// Находит рецепты, соответствующие строке поиска
        /// </summary>
        /// <param name="searchString">Строка поиска</param>
        /// <returns></returns>
        public List<UserRecipe> FindRecipes(string searchString)
        {
            var unloadRecipec = this.Recipe
                     .Include(r => r.Ingredients)
                     .ThenInclude(iq => iq.Ingredient)
                     .ThenInclude(i => i.Unit).ToList();

            // рецепты на странице при входе, пока просто возвращаются все, 
            // TODO надо что-то типа сортировки по популярности, когда будет статистика
            if (searchString == null)
            {
                return unloadRecipec
                     .Select(r => new UserRecipe(r))
                     .ToList();
            }

            searchString = Regex.Escape(searchString);
            List<UserRecipe> result = new List<UserRecipe>();
            if (searchString.Length > 100)
                return result;

            while (result.Count == 0 && searchString.Length > 0)
            {
                Regex regex = new Regex(@"(^|\s)" + searchString, RegexOptions.Compiled | RegexOptions.IgnoreCase);

                result = unloadRecipec
                     .Where(r => regex.IsMatch(r.Name) || regex.IsMatch(r.Description))
                     .Select(r => new UserRecipe(r))
                     .ToList();
                searchString = Regex.Replace(searchString, @".$", "");
            }

            return result;
        }
        
        /// <summary>
        /// Находит рецепт в базе данных, если такого рецепта нет, возвращает null
        /// </summary>
        /// <param name="id">Его ID</param>
        /// <returns></returns>
        private async Task<Recipe> GetDatabaseRecipeAsync(int id)
        {
            Recipe recipe = await Recipe
                .Include(r => r.Ingredients)
                .ThenInclude(iq => iq.Ingredient)
                .ThenInclude(i => i.Unit).FirstOrDefaultAsync(r => r.ID == id);
            return recipe;
        }

        /// <summary>
        /// Возвращает рецепт с данным ID или null если ничего не найдено
        /// </summary>
        /// <param name="id">Его ID</param>
        /// <returns></returns>
        public async Task<UserRecipe> GetRecipeAsync(int id)
        {
            Recipe recipe = await GetDatabaseRecipeAsync(id);
            return (recipe == null) ? null : new UserRecipe(recipe);
        }

        /// <summary>
        /// Проверяет на корректность сам рецепт, его составляющие, и наличие в базе ингредиентов
        /// </summary>
        /// <param name="recipe">Рецепт</param>
        /// <returns></returns>
        public ErrorMessage CheckRecipe(UserRecipe recipe)
        {
            ErrorMessage error = recipe.IsIncorrect();
            if (error)
                return error;

            if (recipe.Ingredients != null && recipe.Ingredients.Any(ui => !Ingredients.Select(i => i.ID).Contains(ui.ID)))
                return new ErrorMessage("Кажется, вы пытаетесь добавить ингредиент, о котором мы не знаем.. Перестаньте.");

            return new ErrorMessage();
        }

        /// <summary>
        /// Добавляет рецепт в базу данных, возвращает ошибку если добавить не получилось
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        public ErrorMessage AddRecipe(ref UserRecipe recipe)
        {
            ErrorMessage error = CheckRecipe(recipe);
            if (error)
                return error;

            Recipe entity = recipe.ToRecipe();
            Add(entity);
            SaveChanges();

            recipe.ID = entity.ID;

            return new ErrorMessage();
        }

        /// <summary>
        /// Обновляет рецеп в базе
        /// </summary>
        /// <param name="recipe">Рецепт</param>
        /// <returns></returns>
        public ErrorMessage UpdateRecipe(UserRecipe recipe)
        {
            ErrorMessage error = CheckRecipe(recipe);
            if (error)
                return error;

            Recipe entity = recipe.ToRecipe();
            Update(entity);
            SaveChanges();

            return new ErrorMessage();
        }
        
        /// <summary>
        /// Удвляет рецепт из базы
        /// </summary>
        /// <returns></returns>
        public async Task<ErrorMessage> DeleteRecipeAsync(int id)
        {
            Recipe recipe = await GetDatabaseRecipeAsync(id);
            if (recipe == null)
                return new ErrorMessage("Попытка удалить рецепт, которого в базе нет, но то, что мертво, умереть не может");

            recipe.Ingredients.ForEach(iq => IngredientQuantities.Remove(iq));
            Recipe.Remove(recipe);

            return new ErrorMessage();
        }

        /// <summary>
        /// Проверяет на корректность сам ингредиент, его составляющие, и отсутствие в базе
        /// </summary>
        /// <param name="ingredient">ингредиент</param>
        /// <returns></returns>
        public ErrorMessage CheckIngredient(UserAbstractIngredient ingredient)
        {
            ErrorMessage error = ingredient.IsIncorrect();
            if (error)
                return error;

            if (Ingredients.Any(igr => igr.Name == ingredient.Name))
                return new ErrorMessage("Данный ингредиент у нас уже есть");

            return new ErrorMessage();
        }


        /// <summary>
        /// Добавляет ингредиент в базу данных
        /// </summary>
        /// <param name="ingredient">собственно ингредиент</param>
        /// <returns></returns>
        public ErrorMessage AddIngredient(ref UserAbstractIngredient ingredient)
        {
            ingredient.Name = ingredient.Name.ToLower();

            ErrorMessage error = CheckIngredient(ingredient);
            if (error)
                return error;
            
            Ingredient entity = ingredient.ToIngredient();
            Add(entity);
            SaveChanges();

            entity.Unit = UnitOfMeasurement.FirstOrDefault(u => u.ID == entity.UnitID);
            ingredient = new UserAbstractIngredient(entity);

            return new ErrorMessage();
        }

        public DbSet<Recipe> Recipe { get; set; }
        public DbSet<IngredientQuantity> IngredientQuantities { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<UnitOfMeasurement> UnitOfMeasurement { get; set; }
        public DbSet<Image> Images { get; set; }
    }
}
