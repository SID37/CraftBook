using System;
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

        }

        /// <summary>
        /// Поиск первых n ингредиентов, начинающихся на строку 
        /// </summary>
        /// <param name="nameChip">Строка - начало</param>
        /// <param name="n">Число нужных ингредиентов</param>
        /// <returns></returns>
        public List<Ingredient> FindIngredients(string nameChip, int n)
        {
            Regex regex = new Regex(@"^|s" + nameChip, RegexOptions.Compiled);
            return Ingredients.Include(i => i.Unit).Where(i => regex.IsMatch(i.Name)).Take(n).ToList();
        }

        /// <summary>
        /// Находит рецепты, соответствующие набору ингредиентов
        /// </summary>
        /// <param name="ingredients">Набор ингредиентов</param>
        /// <returns></returns>
        public List<Recipe> FindRecipes(List<UserIngredient> ingredients)
        {
            //  тут отбрасываются рецепты, которые не подходят совсем
            var filter = this.Recipe
                .Include(r => r.Ingredients)
                .ThenInclude(iq => iq.Ingredient)
                .ThenInclude(i => i.Unit)
                .Where(r => ingredients.Any(ui => r.Ingredients.Select(iq => iq.IngredientID).Contains(ui.ID)))
                .ToList();  //  тут я сдался и сделал вместо запросов к БД обычный список

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
                        .Select(ui => Percent(ui.Quantity, r.CountOfIgr(ui.ID)))    //  На сколько их у пользователя хватает
                        .ToArray();                                                 //  пихаем в массив
                    return 1 - percent.Sum() / percent.Length;
                });

            return ingredSort
                .ToList();
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
        public List<Recipe> FindRecipes(string searchString)
        {
            Regex regex = new Regex(searchString, RegexOptions.Compiled);

            return this.Recipe
                .Include(r => r.Ingredients)
                .ThenInclude(iq => iq.Ingredient)
                .ThenInclude(i => i.Unit)
                .Where(r => regex.IsMatch(r.Name) || regex.IsMatch(r.Description))
                .ToList();
        }

        public DbSet<Recipe> Recipe { get; set; }
        public DbSet<IngredientQuantity> IngredientQuantities { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<UnitOfMeasurement> UnitOfMeasurement { get; set; }
    }
}
