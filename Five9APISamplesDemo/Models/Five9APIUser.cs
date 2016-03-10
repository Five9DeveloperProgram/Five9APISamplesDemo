using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Five9APISamplesDemo.Models
{
    public class Five9APIUser
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string AdminUsername { get; set; }
        public string AdminPW { get; set; }
        public string SuperUsername { get; set; }
        public string SuperPW { get; set; }
        public string SessionID { get; set; }
        public string UserName { get; set; }
    }
}