using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Five9APISamplesDemo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult TestBeginForm()
        {
            return View();
        }
        public PartialViewResult InsertText(string text)
        {
            ViewBag.TextToDisplay = text;
            return PartialView();
        }
        public ActionResult GetText(string q)
        {
            ViewBag.TheText = q;
            return PartialView();
        }
        public ActionResult NewInsert(string textToInsert)
        {
            ViewBag.TheText = textToInsert;
            return PartialView();
        }
        [HttpPost]
        public ActionResult PostInsert(string p)
        {
            ViewBag.TheText = p;
            return PartialView();
        }  
    }
}