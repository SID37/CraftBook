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
    public class IngredientsController : Controller
    {
        private readonly CraftBookContext _context;

        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="context">Контекст базы данных</param>
        public IngredientsController(CraftBookContext context)
        {
            _context = context;
        }

        /// <summary>
        /// POST Запрос, да, надо было выбрать другое имя(не Index), но он возвращает
        /// представление списка ингредиентов, ничинающихся на сстроку
        /// </summary>
        /// <param name="nameChip">Начало названия ингредиента для поиска</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Index(string nameChip)
        {
            return PartialView("View", _context.FindIngredients(nameChip, 5));
        }
        
        /// <summary>
        /// Страничка создания ингредиента
        /// </summary>
        /// <returns></returns>
        public IActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// POST Запрос на создание ингредиента
        /// </summary>
        /// <param name="ingredient">Ингредиент</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Create([FromBody]UserAbstractIngredient ingredient)
        {
                if (ingredient == null)
                    return Json(new ErrorMessage("Вы хотите создать ингредиент? И где он тогда?"));
                ErrorMessage error = _context.AddIngredient(ref ingredient);
                if (error)
                    return Json(error);
                return Json(ingredient);
        }

        /// <summary>
        /// Страничка удаления ингредиента
        /// </summary>
        /// <param name="id">Его ID</param>
        /// <returns></returns>
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ingredient = await _context.Ingredients
                .Include(i => i.Unit)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (ingredient == null)
            {
                return NotFound();
            }

            return View(ingredient);
        }

        /// <summary>
        /// POST Запрос на удаление ингредиента
        /// </summary>
        /// <param name="id">Его ID</param>
        /// <returns></returns>
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var ingredient = await _context.Ingredients.FindAsync(id);
            _context.Ingredients.Remove(ingredient);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool IngredientExists(int id)
        {
            return _context.Ingredients.Any(e => e.ID == id);
        }
    }
}
