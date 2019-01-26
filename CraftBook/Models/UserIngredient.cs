using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CraftBook.Models
{
    public class UserIngredient
    {
        public string Name { get; set; }
        public string UnitName { get; set; }
        public string UnitShortName { get; set; }
        public double? Quantity { get; set; }
        public int ID { get; set; }

        /// <summary>
        /// Конструктор по умолчанию чтоб можно было через фигурные скобочки заполнять
        /// </summary>
        public UserIngredient()
        {}

        /// <summary>
        /// Конструктор от обычного ингредиента
        /// </summary>
        /// <param name="igr"></param>
        public UserIngredient(IngredientQuantity igr)
        {
            Name = igr.Ingredient.Name;
            UnitName = igr.Ingredient.Unit.Name;
            UnitShortName = igr.Ingredient.Unit.ShortName;
            Quantity = igr.Volume;
            ID = igr.Ingredient.ID;
        }

        /// <summary>
        /// проверка ингредиента на корректность
        /// </summary>
        /// <returns></returns>
        public ErrorMessage IsIncorrect()
        {
            if (Name == null)
                return new ErrorMessage("Название не задано");
            if (UnitName == null)
                return new ErrorMessage("Не задано название единиц измерения");
            if (UnitShortName == null)
                return new ErrorMessage("Не задано краткое название единиц измерения");
            if ((Quantity ?? 1)<= 0)
                return new ErrorMessage("Ой, кажется, количество отрицательно или даже равно нулю!");
            return new ErrorMessage();
        }
    }
}
