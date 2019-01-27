using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CraftBook.Data;
using CraftBook.Models;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace CraftBook.Controllers
{
    public class ImagesController : Controller
    {
        private readonly CraftBookContext _context;

        /// <summary>
        /// Конструктор контроллера
        /// </summary>
        /// <param name="context">контекст базы данных</param>
        public ImagesController(CraftBookContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Возвращает картинку в виде представления
        /// </summary>
        /// <param name="id">Её ID</param>
        /// <returns></returns>
        public async Task<IActionResult> View(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var image = await _context.Images
                .FirstOrDefaultAsync(m => m.ID == id);
            if (image == null)
            {
                return NotFound();
            }

            return View("View", image);
        }

        /// <summary>
        /// POST запрос на создание картинки
        /// </summary>
        /// <param name="image">картинка</param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult Create(IFormFile image)
        {
            Image entity = new Image();
            if (image != null)
            {
                byte[] imageData = null;
                // считываем переданный файл в массив байтов
                using (var binaryReader = new BinaryReader(image.OpenReadStream()))
                {
                    imageData = binaryReader.ReadBytes((int)image.Length);
                }
                // установка массива байтов
                entity.Data = imageData;
            }
            else
            {
                return Json(new ErrorMessage("Ваша картинка не попала на сервер, попробуйте загрузить её ещё раз"));
            }
            _context.Images.Add(entity);

            return Json(new UserLink($"/Images/View/?id={entity.ID}"));
        }

        /// <summary>
        /// POST запрос на удаление картинки
        /// </summary>
        /// <param name="id">Её ID</param>
        /// <returns></returns>
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var image = await _context.Images.FindAsync(id);
            _context.Images.Remove(image);
            await _context.SaveChangesAsync();
            return RedirectToAction("Home");
        }

        private bool ImageExists(int id)
        {
            return _context.Images.Any(e => e.ID == id);
        }
    }
}
