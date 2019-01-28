using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CraftBook.Models
{
    public class UserRecipe
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Instruction { get; set; }
        public string Image { get; set; }
        public string CookingTime { get; set; }

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
            Instruction = recipe.Instruction;
            Image = recipe.Image;
            CookingTime = "10 минуточек";

            Ingredients = recipe
                .Ingredients
                .Select(igr => new UserIngredient(igr))
                .ToList();
        }
    }
}
