using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Five9APISamplesDemo.DataContexts;
using Five9APISamplesDemo.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Five9APISamplesDemo.Filters;

namespace Five9APISamplesDemo.Controllers
{

    [SessionExpireRedirectAttribute]
    public class Five9APIUserController : Controller
    {

        public Five9APIUserController()
            
        {
            this.ApplicationDbContext = new IdentityDb();
            this.db = new APIDb();
            
        }




        protected APIDb db { get; set; }
        protected IdentityDb ApplicationDbContext { get; set; }

        // GET: Five9APIUser
        public async Task<ActionResult> Index()
        {
            string currentUserId = User.Identity.GetUserId();
            ApplicationUser currentUser = ApplicationDbContext.Users.FirstOrDefault(x => x.Id == currentUserId);


            var theModel = await db.ApiUsers.Where(i => i.UserName == currentUser.UserName).ToListAsync();
            //return View(await db.ApiUsers.ToListAsync());
            return View(theModel);
            
            

        }

        // GET: Five9APIUser/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Five9APIUser five9APIUser = await db.ApiUsers.FindAsync(id);
            if (five9APIUser == null)
            {
                return HttpNotFound();
            }
            return View(five9APIUser);
        }

        // GET: Five9APIUser/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Five9APIUser/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "ID,AdminUsername,AdminPW,SuperUsername,SuperPW")] Five9APIUser five9APIUser)
        {

            string currentUserId = User.Identity.GetUserId();
            ApplicationUser currentUser = ApplicationDbContext.Users.FirstOrDefault(x => x.Id == currentUserId);
            five9APIUser.UserName = currentUser.UserName;
            //five9APIUser.SessionID = HttpContext.Session.SessionID;
            if (ModelState.IsValid)
            {
                db.ApiUsers.Add(five9APIUser);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(five9APIUser);
        }

        // GET: Five9APIUser/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Five9APIUser five9APIUser = await db.ApiUsers.FindAsync(id);
            if (five9APIUser == null)
            {
                return HttpNotFound();
            }
            return View(five9APIUser);
        }

        // POST: Five9APIUser/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "ID,AdminUsername,AdminPW,SuperUsername,SuperPW")] Five9APIUser five9APIUser)
        {
            string currentUserId = User.Identity.GetUserId();
            ApplicationUser currentUser = ApplicationDbContext.Users.FirstOrDefault(x => x.Id == currentUserId);
            five9APIUser.UserName = currentUser.UserName;


            if (ModelState.IsValid)
            {
                db.Entry(five9APIUser).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(five9APIUser);
        }

        // GET: Five9APIUser/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Five9APIUser five9APIUser = await db.ApiUsers.FindAsync(id);
            if (five9APIUser == null)
            {
                return HttpNotFound();
            }
            return View(five9APIUser);
        }

        // POST: Five9APIUser/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            Five9APIUser five9APIUser = await db.ApiUsers.FindAsync(id);
            db.ApiUsers.Remove(five9APIUser);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
                ApplicationDbContext.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
