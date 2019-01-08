using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CraftBook.Models
{
    public class UserSearchByIngredientsPage
    {
        public List<UserIngredient> ingredients { get; set; }
        public int pageNumber { get; set; }
    }
}
