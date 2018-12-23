using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CraftBook.Models
{
    public class IngredientQuantity
    {
        public int ID { get; set; }

        public double? Volume { get; set; }

        public int RecipeID { get; set; }
        public Recipe Recipe { get; set; }

        public int IngredientID { get; set; }
        public Ingredient Ingredient { get; set; }
    }
}
