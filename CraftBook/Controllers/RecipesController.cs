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
        private static int PageSize = 5;

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

            UserRecipe recipe = await _context.GetRecipeAsync(id ?? 0);

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
        public JsonResult Create([FromBody]UserRecipe recipe)
        {
            ErrorMessage error = _context.AddRecipe(ref recipe);
            if (error)
                return Json(error);
            return Json(new UserLink($"/Recipes/Details/?id={recipe.ID}"));
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

            UserRecipe recipe = await _context.GetRecipeAsync(id ?? 0);

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
        public JsonResult Edit([FromBody]UserRecipe recipe)
        {
            try
            {
                ErrorMessage error = _context.UpdateRecipe(recipe);
                if (error)
                    return Json(error);
            }
            catch (DbUpdateConcurrencyException)
            {
                return Json(new ErrorMessage("Что-то пошло не так, пожалуйста, повторите попытку."));
            }

            return Json(new UserLink($"/Recipes/Details/?id={recipe.ID}"));
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

            UserRecipe recipe = await _context.GetRecipeAsync(id ?? 0);

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