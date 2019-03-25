using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CraftBook.Models
{
    public class UserListIdPage
    {
        public int[] recipes { get; set; }
        public int pageNumber { get; set; }
    }
}
