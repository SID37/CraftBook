using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CraftBook.Models
{
    public class Ingredient
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int UnitID { get; set; }
        public UnitOfMeasurement Unit { get; set; }
    }
}
