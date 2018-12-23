using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CraftBook.Models
{
    /// <summary>
    /// пока этот класс считается устаревшим..
    /// А жаль, он получился красивеньким)
    /// </summary>
    public static class Measurement
    {
        public enum Units
        {
            /// <summary>
            /// Литр
            /// </summary>
            Litre,
            /// <summary>
            /// Килограмм
            /// </summary>
            Kilogram,
            /// <summary>
            /// Грамм
            /// </summary>
            Gram,
            /// <summary>
            /// Секунда
            /// </summary>
            Second,
            /// <summary>
            /// Метр
            /// </summary>
            Metre,
            /// <summary>
            /// Штука
            /// </summary>
            Piece,
        }

        public static String ToString(Units unit)
        {
            switch (unit)
            {
                case (Units.Gram):
                    return "г.";
                case (Units.Kilogram):
                    return "кг.";
                case (Units.Litre):
                    return "л.";
                case (Units.Metre):
                    return "м.";
                case (Units.Piece):
                    return "шт.";
                case (Units.Second):
                    return "с.";
                default:
                    return "not found";
            }
        }
    }
}
