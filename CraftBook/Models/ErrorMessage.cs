using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CraftBook.Models
{
    public class ErrorMessage
    {
        public string Message { get; set; }

        /// <summary>
        /// Конструктор с сообщением об ошибке
        /// </summary>
        /// <param name="Message"></param>
        public ErrorMessage(string Message)
        {
            this.Message = Message;
            if (!this)
                this.Message = "Error 0: the stupid programmer";
        }

        /// <summary>
        /// Конструктор для сообщения без ошибки
        /// </summary>
        public ErrorMessage()
        {
            this.Message = null;
        }

        public static implicit operator bool(ErrorMessage v)
        {
            return v.Message != null;
        }
    }
}
