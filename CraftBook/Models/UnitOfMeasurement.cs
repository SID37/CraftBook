using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CraftBook.Models
{
    public class UnitOfMeasurement
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
    }
}
