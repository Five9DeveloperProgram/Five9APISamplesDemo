using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Five9APISamplesDemo.Models
{
    public class ViewModelFive9CallBackInfo
    {
        [DisplayName("First Name")]
        public string firstname { get; set; }
        [DisplayName("Last Name")]
        public string lastname { get; set; }
        [DisplayName("Contact Phone")]
        [Required(ErrorMessage = "Telephone number is required")]
        //[StringLength(10, MinimumLength = 10, ErrorMessage = "Phone Number Must be 10 numbers.")]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$",ErrorMessage = "Phone format is not valid.")]
        public string phone1 { get; set; }
        [DisplayName("List Name")]
        public string F9List { get; set; }
        [DisplayName("Call NOW!")]
        public bool F9CallASAP { get; set; }

        [DisplayName("Alt Phone")]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Phone format is not valid.")]
        public string phone2 { get; set; }

        [DisplayName("Alt Phone 2")]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Phone format is not valid.")]
        public string phone3 { get; set; }

        [DisplayName("Lead ID")]
        public string LeadId { get; set; }
        


    }
}