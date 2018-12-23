using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CraftBook.Models;

namespace CraftBook.Data
{
    public static class DbInitializer
    {
        public static void Initialize(CraftBookContext context)
        {
            context.Database.EnsureCreated();

            if (context.UnitOfMeasurement.Any())
                return;

            List<UnitOfMeasurement> units = new List<UnitOfMeasurement>
            {
                new UnitOfMeasurement{ Name = "Грамм", ShortName = "г." },
                new UnitOfMeasurement{ Name = "Килограмм", ShortName = "кг." },
                new UnitOfMeasurement{ Name = "Литр", ShortName = "л." },
                new UnitOfMeasurement{ Name = "Миллилитр", ShortName = "мл." },
                new UnitOfMeasurement{ Name = "Метр", ShortName = "м." },
                new UnitOfMeasurement{ Name = "Штука", ShortName = "шт." },
                new UnitOfMeasurement{ Name = "Секунда", ShortName = "с." },
            };

            context.UnitOfMeasurement.AddRange(units);
            context.SaveChanges();
            
            if (context.Ingredients.Any())
                return;

            List<Ingredient> ingredients = new List<Ingredient>
            {
                new Ingredient{ Name = "чёрный чай", UnitID = units.Find(u => u.Name == "Грамм").ID },
                new Ingredient{ Name = "вода", UnitID = units.Find(u => u.Name == "Миллилитр").ID },
                new Ingredient{ Name = "чашка", UnitID = units.Find(u => u.Name == "Штука").ID },
                new Ingredient{ Name = "ложка", UnitID = units.Find(u => u.Name == "Штука").ID },
                new Ingredient{ Name = "бумага А4", UnitID = units.Find(u => u.Name == "Штука").ID },
            };

            context.Ingredients.AddRange(ingredients);
            context.SaveChanges();
            
            if (context.Recipe.Any())
                return;

            List<Recipe> recipes = new List<Recipe>
            {
                new Recipe
                {
                    Name = "Чаёк",
                    Description = "Чашечка вкусного чёрного чая",
                    Instruction = "Кладём чай в чашку, заливаем горячей водой, размешиваем, ждём 5 минут, и чай готов!",
                    Ingredients = new List<IngredientQuantity>
                    {
                         new IngredientQuantity{ IngredientID = ingredients[0].ID, Volume = 5},
                         new IngredientQuantity{ IngredientID = ingredients[1].ID, Volume = 500},
                         new IngredientQuantity{ IngredientID = ingredients[2].ID, Volume = 1},
                         new IngredientQuantity{ IngredientID = ingredients[3].ID, Volume = 1},
                    }
                },

                new Recipe
                {
                    Name = "Бумжный самолётик",
                    Description = "самолёт из бумаги!",
                    Instruction = "Берём лист бумаги, складываем в самолётик.",
                    Ingredients = new List<IngredientQuantity>
                    {
                         new IngredientQuantity{ IngredientID = ingredients[4].ID, Volume = 1},
                    }
                },

                new Recipe
                {
                    Name = "Водяная бомбочка",
                    Description = "Небольшой бумажный шарик, наполненный водой",
                    Instruction = "Оквадрачиваем листик, сворачиваем по схеме \"водяная бомбочка\", наливаем воды",
                    Ingredients = new List<IngredientQuantity>
                    {
                         new IngredientQuantity{ IngredientID = ingredients[1].ID, Volume = 300},
                         new IngredientQuantity{ IngredientID = ingredients[4].ID, Volume = 1},
                    }
                },
            };

            context.Recipe.AddRange(recipes);
            context.SaveChanges();
            
        }
    }
}
