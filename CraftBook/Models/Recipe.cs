using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CraftBook.Models
{
    public class Recipe
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Instruction { get; set; }
        public byte[] Image { get; set; }

        public List<IngredientQuantity> Ingredients{ get; set; }

        public Recipe()
        {
            Ingredients = new List<IngredientQuantity>();
        }
    }
}
