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
        private static int PageSize = 2;

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
        public async Task<IActionResult> Create([Bind("ID,Name,Description,Instruction,Image")] Recipe recipe)
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
        public async Task<IActionResult> Edit(int id, [Bind("ID,Name,Description,Instruction,Image")] Recipe recipe)
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

        /// <summary>
        /// POST Запрос, возвращает требуемую страницу с результами
        /// поиска рецепта по ингредиентам
        /// </summary>
        /// <param name="request">Список ингредиентов и номер страницы</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult SearchByIngredients([FromBody] UserSearchByIngredientsPage request)
        {
            if (request.ingredients.Any(ui => ui.IsIncorrect()))
            {
                return Redirect("~/Error/Code400/?message=- one or more ingredients are not correct");
            }

            var found = _context.FindRecipes(request.ingredients);
            UserRecipesPage result = new UserRecipesPage
            {
                Title = "Найденные рецепты",
                Recipes = CutList(found, request.pageNumber, PageSize),
                PageNumber = request.pageNumber,
                PageCount = (found.Count > PageSize) ? ((found.Count - 1) / PageSize + 1) : 1,
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
            UserRecipesPage result = new UserRecipesPage
            {
                Title = (searchString != null)?"Найденные рецепты":"Рецепты",
                Recipes = CutList(found, PageNumber, PageSize),
                PageNumber = PageNumber,
                PageCount = (found.Count > PageSize) ? ((found.Count - 1) / PageSize + 1) : 1,
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
        private List<UserRecipe> CutList(List<UserRecipe> Recips, int PageNumber, int PageSize)
        {
            return Recips.Skip((PageNumber - 1) * PageSize).Take(PageSize).ToList();
        }
    }
}