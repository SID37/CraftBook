using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CraftBook.Models;

namespace CraftBook.Data
{
    public class CraftBookContext : DbContext
    {
        public CraftBookContext(DbContextOptions<CraftBookContext> options) : base(options)
        {

        }

        public DbSet<Recipe> Recipe { get; set; }
        public DbSet<IngredientQuantity> IngredientQuantities { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<UnitOfMeasurement> UnitOfMeasurement { get; set; }
    }
}
