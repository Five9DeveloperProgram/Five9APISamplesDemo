using Five9APISamplesDemo.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Five9APISamplesDemo.DataContexts
{
    

    public class IdentityDb : IdentityDbContext<ApplicationUser>
    {
        public IdentityDb()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
            //Database.SetInitializer(new MigrateDatabaseToLatestVersion<IdentityDb, DataContexts.IdentityMigrations.Configuration>());
        }

        public static IdentityDb Create()
        {
            return new IdentityDb();
        }
    }
}