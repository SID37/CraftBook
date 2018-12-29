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

        public IngredientQuantController(CraftBookContext context)
        {
            _context = context;
        }

        // GET: IngredientQuant
        public async Task<IActionResult> Index()
        {
            var craftBookContext = _context.IngredientQuantities.Include(i => i.Ingredient).Include(i => i.Recipe);
            return View(await craftBookContext.ToListAsync());
        }

        // GET: IngredientQuant/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ingredientQuantity = await _context.IngredientQuantities
                .Include(i => i.Ingredient)
                .Include(i => i.Recipe)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (ingredientQuantity == null)
            {
                return NotFound();
            }

            return View(ingredientQuantity);
        }

        // GET: IngredientQuant/Create
        public IActionResult Create()
        {
            ViewData["IngredientID"] = new SelectList(_context.Ingredients, "ID", "ID");
            ViewData["RecipeID"] = new SelectList(_context.Recipe, "ID", "ID");
            return View();
        }

        // POST: IngredientQuant/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Volume,RecipeID,IngredientID")] IngredientQuantity ingredientQuantity)
        {
            if (ModelState.IsValid)
            {
                _context.Add(ingredientQuantity);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["IngredientID"] = new SelectList(_context.Ingredients, "ID", "ID", ingredientQuantity.IngredientID);
            ViewData["RecipeID"] = new SelectList(_context.Recipe, "ID", "ID", ingredientQuantity.RecipeID);
            return View(ingredientQuantity);
        }

        // GET: IngredientQuant/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ingredientQuantity = await _context.IngredientQuantities.FindAsync(id);
            if (ingredientQuantity == null)
            {
                return NotFound();
            }
            ViewData["IngredientID"] = new SelectList(_context.Ingredients, "ID", "ID", ingredientQuantity.IngredientID);
            ViewData["RecipeID"] = new SelectList(_context.Recipe, "ID", "ID", ingredientQuantity.RecipeID);
            return View(ingredientQuantity);
        }

        // POST: IngredientQuant/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,Volume,RecipeID,IngredientID")] IngredientQuantity ingredientQuantity)
        {
            if (id != ingredientQuantity.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(ingredientQuantity);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!IngredientQuantityExists(ingredientQuantity.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["IngredientID"] = new SelectList(_context.Ingredients, "ID", "ID", ingredientQuantity.IngredientID);
            ViewData["RecipeID"] = new SelectList(_context.Recipe, "ID", "ID", ingredientQuantity.RecipeID);
            return View(ingredientQuantity);
        }

        // GET: IngredientQuant/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ingredientQuantity = await _context.IngredientQuantities
                .Include(i => i.Ingredient)
                .Include(i => i.Recipe)
                .FirstOrDefaultAsync(m => m.ID == id);
            if (ingredientQuantity == null)
            {
                return NotFound();
            }

            return View(ingredientQuantity);
        }

        // POST: IngredientQuant/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var ingredientQuantity = await _context.IngredientQuantities.FindAsync(id);
            _context.IngredientQuantities.Remove(ingredientQuantity);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool IngredientQuantityExists(int id)
        {
            return _context.IngredientQuantities.Any(e => e.ID == id);
        }

        [HttpPost]
        public IActionResult FindName(string ingredientName, double volume)
        {
            Ingredient ing = _context.Ingredients.Include(i => i.Unit).FirstOrDefault(i => i.Name == ingredientName);

            if (ing == null)
            {
                return NotFound();
            }

            return PartialView("Item", new IngredientQuantity
            {
                Ingredient = ing,
                IngredientID = ing.ID,
                Volume = volume
            });
        }

    }
}
