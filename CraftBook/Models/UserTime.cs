using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CraftBook.Models
{
    public class UserTime
    {
        public int Minutes { get; set; }
        public int Hours { get; set; }
        public int Days { get; set; }

        /// <summary>
        /// Конструктор по умолчанию
        /// </summary>
        public UserTime()
        { }

        /// <summary>
        /// Конструктор, генерирующий время из минут
        /// </summary>
        public UserTime(int minutes)
        {
            Days = minutes / (24 * 60);
            Hours = (minutes / 60) % 24;
            Minutes = minutes % 60;
        }

        /// <summary>
        /// Превращает время в минуты
        /// </summary>
        public int ToMinutes()
        {
            return Minutes + 60 * (Hours + 24 * (Days));
        }

        /// <summary>
        /// Проверка на корректность
        /// </summary>
        /// <returns></returns>
        public ErrorMessage IsIncorrect()
        {
            if (Minutes < 0 || Minutes >= 60)
                return new ErrorMessage("Минуты заданы неправильно.");
            if (Hours < 0 || Hours >= 24)
                return new ErrorMessage($"Кажется, {Hours} - не самое подходящее количество часов.");
            if (Days < 0)
                return new ErrorMessage("Оно делается за отрицательное количество дней? Тогда зачем нам рецепт того, что у нас уже есть?");
            if (Minutes + Hours + Days == 0)
                return new ErrorMessage("Как это, совсем не нужно тратить времени на приготовление?");
            return new ErrorMessage();
        }
    }
}
