using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CraftBook.Models
{
    public class UserLink
    {
        public string Link { get; set; }

        public UserLink(string Link)
        {
            this.Link = Link;
        }
    }
}
