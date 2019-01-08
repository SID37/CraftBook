using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CraftBook.Models
{
    public class Recipe
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Instruction { get; set; }
        public byte[] Image { get; set; }

        public List<IngredientQuantity> Ingredients{ get; set; }

        public Recipe()
        {
            Ingredients = new List<IngredientQuantity>();
        }

        /// <summary>
        /// Возвращает количество ингредиента в рецепте или 0, если такого ингредиента нет
        /// </summary>
        /// <param name="igrID">Его ID</param>
        /// <returns></returns>
        public double CountOfIgr(int igrID)
        {
            foreach (IngredientQuantity iq in Ingredients)
                if (iq.IngredientID == igrID)
                    return iq.Volume ?? 0;
            return 0;
        }
    }
}
