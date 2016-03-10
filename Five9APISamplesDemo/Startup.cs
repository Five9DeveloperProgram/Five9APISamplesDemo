using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Five9APISamplesDemo.Startup))]
namespace Five9APISamplesDemo
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
