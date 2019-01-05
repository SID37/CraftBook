using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CraftBook.Models
{
    public class UserIngredient
    {
        public string Name { get; set; }
        public string UnitName { get; set; }
        public string UnitShortName { get; set; }
        public double Quantity { get; set; }
        public int ID { get; set; }
    }
}
