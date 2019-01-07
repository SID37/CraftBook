using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CraftBook.Models
{
    public class UserRecipes
    {
        public string Title { get; set; }
        public List<Recipe> Recipes { get; set; }
        public int PageNumber { get; set; }
        public int PageCount { get; set; }
    }
}
