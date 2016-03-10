using Five9APISamplesDemo.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Five9APISamplesDemo.Controllers
{
    [SessionExpireRedirectAttribute]
    public class CTIWSAPIController : Controller
    {

         
        // GET: CTIWSAPI
        public ActionResult CallControl()
        {
            return View();
        }

        public ActionResult CallEventMonitor()
        {
            return View();
        }

        public ActionResult UpdateCAV()
        {
            return View();
        }
    }
}