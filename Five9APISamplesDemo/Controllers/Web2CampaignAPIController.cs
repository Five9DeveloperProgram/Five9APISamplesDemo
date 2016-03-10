using Five9APISamplesDemo.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Five9APISamplesDemo.Controllers
{
    [SessionExpireRedirectAttribute]
    public class Web2CampaignAPIController : Controller
    {

       
        // GET: Web2CampaignAPI
        public ActionResult CustomerCallBack()
        {
            return View();
        }
    }
}