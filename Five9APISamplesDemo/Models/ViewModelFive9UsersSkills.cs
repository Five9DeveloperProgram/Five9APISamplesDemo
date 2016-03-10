using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace Five9APISamplesDemo.Models
{
    public class ViewModelFive9UsersSkills
    {

        [DisplayName("Skill Level")]
        public int skillLevel { get; set; }
        [DisplayName("Skill Name")]
        public string skillName { get; set; }
        [DisplayName("User ID")]
        public long userID { get; set; }
        public bool isActive { get; set; }
        [DisplayName("First Name")]
        public string firstName { get; set; }
        [DisplayName("Last Name")]
        public string lastName { get; set; }
        [DisplayName("Full Name")]
        public string fullName { get; set; }
        [DisplayName("User Name")]
        public string userName { get; set; }
        
       


    }
}