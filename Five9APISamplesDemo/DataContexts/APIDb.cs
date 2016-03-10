using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using Five9APISamplesDemo.Models;
namespace Five9APISamplesDemo.DataContexts
{
    public class APIDb: DbContext
    {

        public APIDb()
            : base("DefaultConnection")
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<APIDb, DataContexts.APIdbMigrations.Configuration>());
        }


        public DbSet<Five9APIUser> ApiUsers { get; set; }
        public DbSet<Five9UserInfo> Five9Users { get; set; }
        public DbSet<Five9UserSkill> Five9UserSkills { get; set; }
    }
}