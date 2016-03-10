using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Five9APISamplesDemo.Models
{
    public class Five9UserSkill
    {
        [Key, Column(Order = 1)]
        public long skillID { get; set; }
        [DisplayName("Skill Level")]
        public int skillLevel { get; set; }
        [DisplayName("Skill Name")]
        public string skillName { get; set; }
        [Key, Column(Order = 0)]
        [DisplayName("User Name")]
        public string userName { get; set; }
    }
}