using Five9APISamplesDemo.com.five9.statsapi;
using Five9APISamplesDemo.DataContexts;
using Five9APISamplesDemo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data;
using System.Collections;
using Five9APISamplesDemo.Filters;

namespace Five9APISamplesDemo.Controllers
{
    [SessionExpireRedirectAttribute]
    public class StatisticsAPIController : Controller
    {

        public StatisticsAPIController()
            
        {
            this.ApplicationDbContext = new IdentityDb();
            this.db = new APIDb();
            
        }




        protected APIDb db { get; set; }
        protected IdentityDb ApplicationDbContext { get; set; }



         
        // GET: StatisticsAPI
        public ActionResult ACDStatistics()
        {
            var theProxy = Session["StatsProxy"] as WsSupervisorService;

            DataTable ACDData = null;
            //objects for get stats
            getStatisticsResponse theResponseGetStat;
            getStatistics theParamsGetStat = new getStatistics();


            ACDData = new DataTable();

            //TESTTESTTEST
            row theColumnNAMES = new Five9APISamplesDemo.com.five9.statsapi.row();
            //string[] theValues = { "Full Name", "Username" };
            //theColumnNAMES.values[0] = "Full Name";
            //theColumnNAMES.values[1] = "Username";

            theColumnNAMES.values = null;
            theParamsGetStat.columnNames = theColumnNAMES;
            //TESTTESTTEST

            //get stats

            // theParamsGetStat.statisticType = statisticType.AgentStatistics;
            theParamsGetStat.statisticType = statisticType.ACDStatus;
            theParamsGetStat.statisticTypeSpecified = true;
            theResponseGetStat = theProxy.getStatistics(theParamsGetStat);
            //theLastUpdate = theResponseGetStat.@return.timestamp;

            //convert data to enumerable
            ArrayList myList = new ArrayList();
            myList.Add(theResponseGetStat.@return.columns);
            ArrayList myList2 = new ArrayList();
            myList2.Add(theResponseGetStat.@return.rows);

            //return xml string
            //string theXML = XMLUtility.SerializeObjectToXML(theResponseGetStat.@return.columns);
            //string theXML2 = XMLUtility.SerializeObjectToXML(theResponseGetStat.@return.rows);
            //return (theXML+ theXML2);

            //build datatable
            foreach (row theRow in myList)
            {

                foreach (string theColumn in theRow.values)
                {

                    ACDData.Columns.Add(theColumn);
                }

            }

            //add field for marking which skills the current user is in



            foreach (row[] theRow2 in myList2)
            {


                foreach (row theData in theRow2)
                {


                    ACDData.Rows.Add(theData.values);

                }



            }

            //return the DataTable to Listener 
            //return ACDData;


            return View(ACDData);
        }

        public ActionResult AgentAvailability()
        {
            var theProxy = Session["StatsProxy"] as WsSupervisorService;

            DataTable ACDData = null;
            //objects for get stats
            getStatisticsResponse theResponseGetStat;
            getStatistics theParamsGetStat = new getStatistics();


            ACDData = new DataTable();

            //TESTTESTTEST
            row theColumnNAMES = new Five9APISamplesDemo.com.five9.statsapi.row();
            //string[] theValues = { "Full Name", "Username" };
            //theColumnNAMES.values[0] = "Full Name";
            //theColumnNAMES.values[1] = "Username";

            theColumnNAMES.values = null;
            theParamsGetStat.columnNames = theColumnNAMES;
            //TESTTESTTEST

            //get stats

            // theParamsGetStat.statisticType = statisticType.AgentStatistics;
            theParamsGetStat.statisticType = statisticType.AgentState;
            theParamsGetStat.statisticTypeSpecified = true;
            theResponseGetStat = theProxy.getStatistics(theParamsGetStat);
            //theLastUpdate = theResponseGetStat.@return.timestamp;

            //convert data to enumerable
            ArrayList myList = new ArrayList();
            myList.Add(theResponseGetStat.@return.columns);
            ArrayList myList2 = new ArrayList();
            myList2.Add(theResponseGetStat.@return.rows);

            //return xml string
            //string theXML = XMLUtility.SerializeObjectToXML(theResponseGetStat.@return.columns);
            //string theXML2 = XMLUtility.SerializeObjectToXML(theResponseGetStat.@return.rows);
            //return (theXML+ theXML2);

            //build datatable
            foreach (row theRow in myList)
            {

                foreach (string theColumn in theRow.values)
                {

                    ACDData.Columns.Add(theColumn);
                }

            }

            //add field for marking which skills the current user is in



            foreach (row[] theRow2 in myList2)
            {


                foreach (row theData in theRow2)
                {


                    ACDData.Rows.Add(theData.values);

                }



            }

            //return the DataTable to Listener 
            //return ACDData;


            return View(ACDData);
        }

        public ActionResult BroadcastMessage()
        {
            return View();
        }

        [HttpPost]
        public ActionResult sendBroadcastMessage(string theMessage)
        {
            try
            {

                var theProxy = Session["StatsProxy"] as WsSupervisorService;
                sendBroadcastMessages theMessages=new sendBroadcastMessages();
                sendBroadcastMessagesResponse theMessagesResp;
                theMessages.type=broadcastType.ALL;
                theMessages.typeSpecified=true;
                
                theMessages.text=theMessage;
                theMessagesResp=theProxy.sendBroadcastMessages(theMessages);





                return Json(new { theMessagesResp });

                

            }
            catch (Exception)
            {
                return Json(new { });
            }
           
        }


        public ActionResult StartStatisticsSession()
        {
            try
            {
                string currentUserId = User.Identity.GetUserId();
                ApplicationUser currentUser = ApplicationDbContext.Users.FirstOrDefault(x => x.Id == currentUserId);
                Five9APIUser five9APIUser = db.ApiUsers.FirstOrDefault(u => u.UserName == currentUser.UserName);


                if (five9APIUser == null)
                {
                    return View();
                }

               
                WsSupervisorService theProxy;
                System.Net.CredentialCache serviceCredentials;
                NetworkCredential netCredentials;
                setSessionParametersResponse theResponseSession;
                setSessionParameters theParamsSession;
                getStatisticsResponse theResponseGetStat;
                getStatistics theParamsGetStat;
                viewSettings theViewSetting;

                theProxy = new WsSupervisorService();
                // Setup credentials
                serviceCredentials = new System.Net.CredentialCache();
                netCredentials = new NetworkCredential(five9APIUser.SuperUsername, five9APIUser.SuperPW);
                serviceCredentials.Add(new Uri(theProxy.Url), "Basic", netCredentials);
                theProxy.Credentials = netCredentials.GetCredential(new Uri(theProxy.Url), "Basic");
                theProxy.PreAuthenticate = true;

                theParamsSession = new setSessionParameters();
                theParamsGetStat = new getStatistics();
                theViewSetting = new viewSettings();
                theViewSetting.timeZone = 28800000;
                theViewSetting.statisticsRange = statisticsRange.CurrentDay;
                theViewSetting.statisticsRangeSpecified = true;
                theViewSetting.rollingPeriod = rollingPeriod.Today;
                theViewSetting.rollingPeriodSpecified = true;
                theParamsSession.viewSettings = theViewSetting;
                theResponseSession = theProxy.setSessionParameters(theParamsSession);
                theProxy.Timeout = 3600000;

                Session["StatsProxy"] = theProxy;

                return View();
            }
            catch (Exception)
            {

                return View();
            }
        }
    }
}