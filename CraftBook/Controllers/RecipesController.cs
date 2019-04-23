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
        private static int PageSize = 10;

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

            ViewData["HeaderTitle"] = recipe.Name;
            return View(recipe);
        }

        /// <summary>
        /// Страничка создания рецепта
        /// </summary>
        /// <returns></returns>
        public IActionResult Create()
        {
            ViewData["HeaderTitle"] = "Создаём рецепт";
            ViewData["InventoryTitle"] = "Ингредиенты";
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
            if (recipe == null)
                return Json(new ErrorMessage("В попытке создать рецепт вы забыли.. послать ним сам рецепт.."));
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
            return NotFound();

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
            UserRecipesPage result;
            if (found.Count == 0)
                result = new UserRecipesPage { Title = "Ничего не найдено", Recipes = new List<UserRecipe>(), PageNumber = 0, PageCount = 0 };
            else
                result = new UserRecipesPage
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
            UserRecipesPage result;
            if (found.Count == 0)
                result = new UserRecipesPage { Title = "По вашему запросу ничего не найдено", Recipes = new List<UserRecipe>(), PageNumber = 0, PageCount = 0 };
            else
                result = new UserRecipesPage
                {
                    Title = (searchString != null) ? "Найденные рецепты" : "Рецепты",
                    Recipes = CutList(found, PageNumber, PageSize),
                    PageNumber = PageNumber,
                    PageCount = (found.Count > PageSize) ? ((found.Count - 1) / PageSize + 1) : 1,
                };
            return PartialView("Index", result);
        }

        /// <summary>
        /// POST запрос, возвращаеттребуемую страницу с рецептами из списка
        /// </summary>
        /// <param name="request">Список рецептов со страницей</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult PageInListId([FromBody]UserListIdPage request)
        {
            var found = _context.FindRecipes(request.recipes);
            UserRecipesPage result;
            if (found.Count == 0)
                result = new UserRecipesPage { Title = "Здесь ппока ничего нет", Recipes = new List<UserRecipe>(), PageNumber = 0, PageCount = 0 };
            else
                result = new UserRecipesPage
                {
                    Title = "Рецепты",
                    Recipes = CutList(found, request.pageNumber, PageSize),
                    PageNumber = request.pageNumber,
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