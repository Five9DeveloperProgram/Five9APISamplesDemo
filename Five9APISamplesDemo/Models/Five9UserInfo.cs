using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Five9APISamplesDemo.Models
{
    public class Five9UserInfo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [DisplayName("User ID")]
        public long userID { get; set; }
        public bool isActive { get; set; }
        public bool canChangePW { get; set; }
        public bool mustChangePW { get; set; }
        public bool IEXScheduled { get; set; }
        public string email { get; set; }
        public string osLogin { get; set; }
        [DisplayName("Phone Extension")]
        public int extension { get; set; }
        [DisplayName("First Name")]
        public string firstName { get; set; }
        [DisplayName("Last Name")]
        public string lastName { get; set; }
        [DisplayName("Full Name")]
        public string fullName { get; set; }
        [DisplayName("User Name")]
        public string userName { get; set; }
        public string password { get; set; }
        public string userProfileName { get; set; }
        [DisplayName("Start Date")]
        public DateTime startDate { get; set; }
        [DisplayName("Active Skills")]
        public virtual ICollection<Five9UserSkill> skills { get; set; }
       
    }
}