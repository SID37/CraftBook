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
    public class RecipesController : Controller
    {
        private readonly CraftBookContext _context;

        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="context">Контекст базы данных</param>
        public RecipesController(CraftBookContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Собственно страничка рецепта
        /// </summary>
        /// <param name="id">Его ID</param>
        /// <returns></returns>
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipe
                .Include(r => r.Ingredients)
                .ThenInclude(iq => iq.Ingredient)
                .ThenInclude(i => i.Unit)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (recipe == null)
            {
                return NotFound();
            }

            return View(recipe);
        }

        /// <summary>
        /// Страничка создания рецепта
        /// </summary>
        /// <returns></returns>
        public IActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// POST Запрос на создание рецепта
        /// </summary>
        /// <param name="recipe">Собственно рецепт</param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Name,Description,Instruction,Image")]
            Recipe recipe)
        {
            if (ModelState.IsValid)
            {
                _context.Add(recipe);
                await _context.SaveChangesAsync();
                return Redirect("~/Home/Index");
            }

            return View(recipe);
        }

        /// <summary>
        /// Страничка изменения рецепта
        /// </summary>
        /// <param name="id">Его ID</param>
        /// <returns></returns>
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipe.FindAsync(id);
            if (recipe == null)
            {
                return NotFound();
            }

            return View(recipe);
        }

        /// <summary>
        /// POST Запрос на изменение рецепта
        /// </summary>
        /// <param name="id">Его ID</param>
        /// <param name="recipe">Новые значения параметров</param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,Name,Description,Instruction,Image")]
            Recipe recipe)
        {
            if (id != recipe.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(recipe);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RecipeExists(recipe.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Redirect("~/Home/Index");
            }

            return View(recipe);
        }

        /// <summary>
        /// Страничка удаления рецепта
        /// </summary>
        /// <param name="id">Его ID</param>
        /// <returns></returns>
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipe
                .FirstOrDefaultAsync(m => m.ID == id);
            if (recipe == null)
            {
                return NotFound();
            }

            return View(recipe);
        }

        /// <summary>
        /// POST Запрос на удаление рецепта
        /// </summary>
        /// <param name="id">Его ID</param>
        /// <returns></returns>
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var recipe = await _context.Recipe.FindAsync(id);
            _context.Recipe.Remove(recipe);
            await _context.SaveChangesAsync();
            return Redirect("~/Home/Index");
        }

        /// <summary>
        /// Проверка на существование рецепта с данным ID
        /// </summary>
        /// <param name="id">Его ID</param>
        /// <returns></returns>
        private bool RecipeExists(int id)
        {
            return _context.Recipe.Any(e => e.ID == id);
        }

        //TODO Сергей, перепрячь, пожалуйста
        //M - значит message
        public class M
        {
            public List<UserIngredient> ingredients { get; set; }
            public int pageNumber { get; set; }
        }

        /// <summary>
        /// POST Запрос, возвращает требуемую страницу с результами
        /// поиска рецепта по ингредиентам
        /// </summary>
        /// <param name="ingredients">Список ингредиентов</param>
        /// <param name="pageNumber">Номер страницы</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult SearchByIngredients([FromBody] M message)
        {
            var found = _context.FindRecipes(message.ingredients);
            UserRecipes result = new UserRecipes
            {
                Title = "Найденные рецепты",
                Recipes = CutList(found, message.pageNumber),
                PageNumber = message.pageNumber,
                PageCount = found.Count,
            };
            return PartialView("Index", result);
        }

        /// <summary>
        /// POST Запрос, возвращает требуемую страницу с результами
        /// поиска рецепта по строке
        /// </summary>
        /// <param name="searchString">Строка</param>
        /// <param name="PageNumber">Номер страницы</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult SearchByString(string searchString, int PageNumber = 1)
        {
            var found = _context.FindRecipes(searchString);
            UserRecipes result = new UserRecipes
            {
                Title = "Найденные рецепты",
                Recipes = CutList(found, PageNumber),
                PageNumber = PageNumber,
                PageCount = found.Count,
            };
            return PartialView("Index", result);
        }

        /// <summary>
        /// Возвращает список рецептов на даной странице
        /// </summary>
        /// <param name="Recips">Список всех рецептов</param>
        /// <param name="PageNumber">номер страницы</param>
        /// <param name="PageSize">размер каждой страницы</param>
        /// <returns></returns>
        private List<Recipe> CutList(List<Recipe> Recips, int PageNumber, int PageSize = 2)
        {
            return Recips.Skip((PageNumber - 1) * PageSize).Take(PageSize).ToList();
        }
    }
}