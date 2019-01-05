﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CraftBook.Models;
using System.Text.RegularExpressions;

namespace CraftBook.Data
{
    public class CraftBookContext : DbContext
    {
        public CraftBookContext(DbContextOptions<CraftBookContext> options) : base(options)
        {

        }

        public List<Ingredient> FindIngredients(string nameChip, int n)
        {
            Regex regex = new Regex(@"^" + nameChip, RegexOptions.Compiled);
            return Ingredients.Include(i => i.Unit).Where(i => regex.IsMatch(i.Name)).Take(n).ToList();
        }

        public List<Recipe> FindRecipes(List<UserIngredient> ingredients)
        {
            return this.Recipe
                .Include(r => r.Ingredients)
                .ThenInclude(iq => iq.Ingredient)
                .ThenInclude(i => i.Unit)
                .Where(r => r.Ingredients.All(iq => ingredients.Select(igr => igr.ID).Contains(iq.ID)))
                .ToList();
        }

        public List<Recipe> FindRecipes(string searchString)
        {
            Regex regex = new Regex(searchString, RegexOptions.Compiled);

            return this.Recipe
                .Include(r => r.Ingredients)
                .ThenInclude(iq => iq.Ingredient)
                .ThenInclude(i => i.Unit)
                .Where(r => regex.IsMatch(r.Name) || regex.IsMatch(r.Description))
                .ToList();
        }

        public DbSet<Recipe> Recipe { get; set; }
        public DbSet<IngredientQuantity> IngredientQuantities { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<UnitOfMeasurement> UnitOfMeasurement { get; set; }
    }
}
