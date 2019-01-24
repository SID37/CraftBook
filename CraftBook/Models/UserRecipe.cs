using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CraftBook.Models
{
    public class UserRecipe
    {
        public int ID { get; }
        public string Name { get;  }
        public string Description { get; }
        public string Instruction { get; }
        public byte[] Image { get;  }
        public string Time { get; }

        public List<UserIngredient> Ingredients { get; }

        public UserRecipe(Recipe recipe)
        {
            ID = recipe.ID;
            Name = recipe.Name;
            Description = recipe.Description;
            Instruction = recipe.Instruction;
            Image = recipe.Image;
            Time = "10 минуточек";

            Ingredients = recipe
                .Ingredients
                .Select(igr => new UserIngredient(igr))
                .ToList();
        }
    }
}
