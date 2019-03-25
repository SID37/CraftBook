using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CraftBook.Models
{
    public class UserAbstractIngredient
    {
        public string Name { get; set; }
        public string UnitName { get; set; }
        public string UnitShortName { get; set; }
        public int UnitID { get; set; }
        public int ID { get; set; }

        /// <summary>
        /// Конструктор по умолчанию чтоб можно было через фигурные скобочки заполнять
        /// </summary>
        public UserAbstractIngredient()
        { }

        /// <summary>
        /// Конструктор из датабазного ингредиента
        /// </summary>
        /// <param name="ingredient">Сам ингредиент</param>
        public UserAbstractIngredient(Ingredient ingredient)
        {
            Name = ingredient.Name;
            UnitName = ingredient.Unit.Name;
            UnitShortName = ingredient.Unit.ShortName;
            UnitID = ingredient.Unit.ID;
            ID = ingredient.ID;
        }

        public Ingredient ToIngredient()
        {
            return new Ingredient {Name = Name, UnitID = UnitID };
        }

        /// <summary>
        /// проверка ингредиента на корректность
        /// </summary>
        /// <returns></returns>
        public ErrorMessage IsIncorrect()
        {
            if (Name == null)
                return new ErrorMessage("Название не задано");
            return new ErrorMessage();
        }
    }
}
