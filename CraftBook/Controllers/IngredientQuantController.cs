using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CraftBook.Data;
using CraftBook.Models;

namespace CraftBook.Controllers
{
    public class IngredientQuantController : Controller
    {
        private readonly CraftBookContext _context;
        
        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="context">Контекст базы данных</param>
        public IngredientQuantController(CraftBookContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Возвращает представление списка ингредиентов с их количествои
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> Index()
        {
            var craftBookContext = _context.IngredientQuantities.Include(i => i.Ingredient).Include(i => i.Recipe);
            return View(await craftBookContext.ToListAsync());
        }        

        /// <summary>
        /// Возвращает ингредиент с его количеством в виде json,
        /// если он существует(он - ингредиент)
        /// </summary>
        /// <param name="ingredientName">Название ингредиента</param>
        /// <param name="volume">Количество</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult FindName(string ingredientName, double volume)
        {
            Ingredient ing = _context.Ingredients.Include(i => i.Unit).FirstOrDefault(i => i.Name == ingredientName);

            if (ing == null)
                return Json(new ErrorMessage { Message = "Ингредиент не найден" });

            UserIngredient ingredient = new UserIngredient
            {
                Name = ing.Name,
                UnitName = ing.Unit.Name,
                UnitShortName = ing.Unit.ShortName,
                Quantity = volume,
                ID = ing.ID,
            };

            ErrorMessage message = ingredient.IsCorrect();
            if(message)
                return Json(message);

            return Json(ingredient);
        }

    }
}
