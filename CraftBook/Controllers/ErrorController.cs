using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CraftBook.Controllers
{
    public class ErrorController : Controller
    {
        public string Code404(string message = "")
        {
            return "Error 404: Page not found     " + message;
        }

        public string Code400(string message = "")
        {
            return "Error 400: Bad Request     " + message;
        }
    }
}