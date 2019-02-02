using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using MarkdownSharp;

namespace CraftBook.Models
{
    public class UserRecipe
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Instruction { get; set; }
        public string Image { get; set; }
        public UserTime CookingTime { get; set; }

        public List<UserIngredient> Ingredients { get; set; }

        /// <summary>
        /// Конструктор по умолчанию
        /// </summary>
        public UserRecipe()
        {

        }

        /// <summary>
        /// Конструктор из обычного рецепта
        /// </summary>
        /// <param name="recipe"></param>
        public UserRecipe(Recipe recipe)
        {
            ID = recipe.ID;
            Name = recipe.Name;
            Description = recipe.Description;
            Instruction = ReplaceTags(recipe.Instruction);
            Image = recipe.Image;
            CookingTime = new UserTime(recipe.CookingTime);

            Ingredients = recipe
                .Ingredients
                .Select(igr => new UserIngredient(igr))
                .ToList();
        }

        /// <summary>
        /// Экранирует html теги, заменяет markdown теги на html(именно в таком порядке) в строке
        /// </summary>
        /// <param name="s">собственно, строка</param>
        /// <returns></returns>
        private string ReplaceTags(string s)
        {
            s = Regex.Replace(s, @"&", @"&amp;");
            s = Regex.Replace(s, @"<", @"&lt;");
            s = Regex.Replace(s, @">", @"&gt;");
            s = Regex.Replace(s, @"'", @"&#39;");
            s = Regex.Replace(s, "\"", @"&quot;");
            return new Markdown().Transform(s);
        }

        /// <summary>
        /// проверка рецепта на корректность
        /// </summary>
        /// <returns></returns>
        public ErrorMessage IsIncorrect()
        {
            if (Name == null)
                return new ErrorMessage("Не задано рецепта");
            if (Description == null)
                return new ErrorMessage("Кажется, вы забыли дать описание рецепта");
            if (Instruction == null)
                return new ErrorMessage($"{Name}, звучит аппетитно, но а как же его готовить?");
            ErrorMessage error;
            if (Ingredients != null)
                foreach(UserIngredient ui in Ingredients)
                {
                    error = ui.IsIncorrect();
                    if (error)
                        return error;
                }
            error = CookingTime.IsIncorrect();
            if (error)
                return error;

            return new ErrorMessage();
        }

        /// <summary>
        /// Возвращает обычный датабазный рецепт, сгенерированный по образу и подобию себя
        /// </summary>
        /// <returns></returns>
        public Recipe ToRecipe()
        {
            Recipe result = new Recipe
            {
                ID = ID,
                Name = Name,
                Image = Image,
                Description = Description,
                Instruction = Instruction,
                CookingTime = CookingTime.ToMinutes(),
                Ingredients = Ingredients == null ? new List<IngredientQuantity>() :
                    Ingredients.Select(ui => new IngredientQuantity { IngredientID = ui.ID, Volume = ui.Quantity }).ToList(),
            };

            return result;
        }
    }
}
