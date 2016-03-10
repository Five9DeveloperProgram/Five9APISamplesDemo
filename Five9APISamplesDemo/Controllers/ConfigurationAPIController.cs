using Five9APISamplesDemo.com.five9.configapi;
using Five9APISamplesDemo.DataContexts;
using Five9APISamplesDemo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using CTIWEBFIVE9.Helpers;
using System.Collections.ObjectModel;
using System.Collections;
using System.Text.RegularExpressions;
using System.Diagnostics;
using Five9APISamplesDemo.Filters;


namespace Five9APISamplesDemo.Controllers
{
    [SessionExpireRedirectAttribute]
    public class ConfigurationAPIController : Controller
    {

        public ConfigurationAPIController()
            
        {
            this.ApplicationDbContext = new IdentityDb();
            this.db = new APIDb();
            
        }




        protected APIDb db { get; set; }
        protected IdentityDb ApplicationDbContext { get; set; }
        // GET: ConfigurationAPI
        public ActionResult DnisAssignments()
        {

            try
            {
                //get the user

                string currentUserId = User.Identity.GetUserId();
                ApplicationUser currentUser = ApplicationDbContext.Users.FirstOrDefault(x => x.Id == currentUserId);

               

                Five9APIUser five9APIUser = db.ApiUsers.FirstOrDefault(u => u.UserName == currentUser.UserName);

                List<DNISAssignment> theDNISAssignments = new List<DNISAssignment>();


                if (five9APIUser == null)
                {
                    return View(theDNISAssignments);
                }
                com.five9.configapi.WsAdminServiceV2 theProxy = new com.five9.configapi.WsAdminServiceV2();
                com.five9.configapi.getCampaigns theGetCampaignParam = new getCampaigns();
                theGetCampaignParam.campaignNamePattern = ".*";


                // Setup credentials
                System.Net.CredentialCache serviceCredentials = new System.Net.CredentialCache();
                //NetworkCredential netCredentials = new NetworkCredential("PennyMacWebServiceAPIConfig", "Summer$1");
                NetworkCredential netCredentials = new NetworkCredential(five9APIUser.AdminUsername, five9APIUser.AdminPW);

                serviceCredentials.Add(new Uri(theProxy.Url), "Basic", netCredentials);
                theProxy.Credentials = netCredentials.GetCredential(new Uri(theProxy.Url), "Basic");
                theProxy.PreAuthenticate = true;


                campaign[] theCampaigns = theProxy.getCampaigns(theGetCampaignParam);
                getCampaignDNISList theCDLParam = new getCampaignDNISList();

                
                DNISAssignment theDNISAssignment;
                for (int i = 0; i < theCampaigns.Length; i++)
                {
                    if (theCampaigns[i].type.ToString() == "INBOUND")
                    {


                        theCDLParam.campaignName = theCampaigns[i].name;
                        string[] theDNIS = theProxy.getCampaignDNISList(theCDLParam);

                        for (int j = 0; j < theDNIS.Length; j++)
                        {

                            theDNISAssignment=new DNISAssignment();
                            theDNISAssignment.Campaign=theCDLParam.campaignName;
                            theDNISAssignment.DNIS=theDNIS[j].ToString();
                            //Console.WriteLine(theDNIS[j].ToString() + " , " + theCDLParam.campaignName);
                            theDNISAssignments.Add(theDNISAssignment);

                        }
                    }
                }




                com.five9.configapi.getDNISList theDNISList = new getDNISList();
                theDNISList.selectUnassigned = true;
                theDNISList.selectUnassignedSpecified = true;
                string[] theDNIS2 = theProxy.getDNISList(theDNISList);

                for (int i = 0; i < theDNIS2.Length; i++)
                {
                    var obj = theDNISAssignments.FirstOrDefault(x => x.DNIS == theDNIS2[i].ToString());
                    if (obj == null)
                    {
                        theDNISAssignment = new DNISAssignment();
                        theDNISAssignment.Campaign = "Unassigned";
                        theDNISAssignment.DNIS = theDNIS2[i].ToString();
                        theDNISAssignments.Add(theDNISAssignment);

                    }

                    
                }

                return View(theDNISAssignments);
            }



            catch (Exception ex)
            {

                return View();
            }
            
        }

        public ActionResult AgentSkills2()
        {
            try
            {
                //get the user

                string currentUserId = User.Identity.GetUserId();
                ApplicationUser currentUser = ApplicationDbContext.Users.FirstOrDefault(x => x.Id == currentUserId);



                Five9APIUser five9APIUser = db.ApiUsers.FirstOrDefault(u => u.UserName == currentUser.UserName);

                IEnumerable<Five9UserInfo> theFive9UserInfo = new List<Five9UserInfo>();


                if (five9APIUser == null)
                {
                    return View(theFive9UserInfo);
                }
                com.five9.configapi.WsAdminServiceV2 theProxy = new com.five9.configapi.WsAdminServiceV2();
                // Setup credentials
                System.Net.CredentialCache serviceCredentials = new System.Net.CredentialCache();
                //NetworkCredential netCredentials = new NetworkCredential("PennyMacWebServiceAPIConfig", "Summer$1");
                NetworkCredential netCredentials = new NetworkCredential(five9APIUser.AdminUsername, five9APIUser.AdminPW);

                serviceCredentials.Add(new Uri(theProxy.Url), "Basic", netCredentials);
                theProxy.Credentials = netCredentials.GetCredential(new Uri(theProxy.Url), "Basic");
                theProxy.PreAuthenticate = true;


                //get all user info
                com.five9.configapi.userInfo[] theUsers;
                com.five9.configapi.getUsersInfo theUsersInfo = new com.five9.configapi.getUsersInfo();

                theUsersInfo.userNamePattern = ".*";
                theUsers = theProxy.getUsersInfo(theUsersInfo);

                 //delete all skills and users
                

                //remoce any pending removed skills if they exist in the refreshed data
                db.Database.ExecuteSqlCommand("DELETE [Five9UserSkill]");
                db.Database.ExecuteSqlCommand("DELETE [Five9UserInfo]");
                
                
                foreach (com.five9.configapi.userInfo theUser in theUsers)
                {
                    
                        //add or update user to database:

                        var userInfo = new Five9UserInfo
                        {
                            canChangePW = theUser.generalInfo.canChangePassword,
                            email = theUser.generalInfo.EMail,
                            IEXScheduled = theUser.generalInfo.IEXScheduled,
                            extension = theUser.generalInfo.extension,
                            firstName = theUser.generalInfo.firstName,
                            fullName = theUser.generalInfo.fullName,
                            isActive = theUser.generalInfo.active,
                            lastName = theUser.generalInfo.lastName,
                            mustChangePW = theUser.generalInfo.mustChangePassword,
                            osLogin = theUser.generalInfo.osLogin,
                            password = theUser.generalInfo.password,
                            startDate = DateTime.Now,
                            userID = theUser.generalInfo.id,
                            userName = theUser.generalInfo.userName,
                            userProfileName = theUser.generalInfo.userProfileName
                        };
                        //create new skill object to hold values
                        userInfo.skills = new Collection<Five9UserSkill>();
                        //loop through all skills and add to user object
                        if (theUser.skills != null)
                        {
                            foreach (var theSkill in theUser.skills)
                            {

                                //add skill to user:
                                var userSkill = new Five9UserSkill
                                {
                                    skillID = theSkill.id,
                                    skillLevel = theSkill.level,
                                    skillName = theSkill.skillName,
                                    userName = theSkill.userName
                                };
                                userInfo.skills.Add(userSkill);
                            }
                        }
                        //add user to db
                        db.Five9Users.Add(userInfo);
                        //commit after each record
                        db.SaveChanges();
                    }

                theFive9UserInfo = db.Five9Users.ToList();

                return View(theFive9UserInfo);
            }



            catch (Exception ex)
            {

                return View();
            }
        }


        public ActionResult AgentSkills()
        {
            try
            {
                //get the user

                string currentUserId = User.Identity.GetUserId();
                ApplicationUser currentUser = ApplicationDbContext.Users.FirstOrDefault(x => x.Id == currentUserId);



                Five9APIUser five9APIUser = db.ApiUsers.FirstOrDefault(u => u.UserName == currentUser.UserName);

                List<ViewModelFive9UsersSkills> theFive9UserInfo = new List<ViewModelFive9UsersSkills>();


                if (five9APIUser == null)
                {
                    return View(theFive9UserInfo);
                }
                com.five9.configapi.WsAdminServiceV2 theProxy = new com.five9.configapi.WsAdminServiceV2();
                // Setup credentials
                System.Net.CredentialCache serviceCredentials = new System.Net.CredentialCache();
                //NetworkCredential netCredentials = new NetworkCredential("PennyMacWebServiceAPIConfig", "Summer$1");
                NetworkCredential netCredentials = new NetworkCredential(five9APIUser.AdminUsername, five9APIUser.AdminPW);

                serviceCredentials.Add(new Uri(theProxy.Url), "Basic", netCredentials);
                theProxy.Credentials = netCredentials.GetCredential(new Uri(theProxy.Url), "Basic");
                theProxy.PreAuthenticate = true;


                //get all user info
                com.five9.configapi.userInfo[] theUsers;
                com.five9.configapi.getUsersInfo theUsersInfo = new com.five9.configapi.getUsersInfo();

                theUsersInfo.userNamePattern = ".*";
                theUsers = theProxy.getUsersInfo(theUsersInfo);

                //delete all skills and users


                //remoce any pending removed skills if they exist in the refreshed data
                db.Database.ExecuteSqlCommand("DELETE [Five9UserSkill]");
                db.Database.ExecuteSqlCommand("DELETE [Five9UserInfo]");


                foreach (com.five9.configapi.userInfo theUser in theUsers)
                {

                    //add or update user to database:

                    var userInfo = new Five9UserInfo
                    {
                        canChangePW = theUser.generalInfo.canChangePassword,
                        email = theUser.generalInfo.EMail,
                        IEXScheduled = theUser.generalInfo.IEXScheduled,
                        extension = theUser.generalInfo.extension,
                        firstName = theUser.generalInfo.firstName,
                        fullName = theUser.generalInfo.fullName,
                        isActive = theUser.generalInfo.active,
                        lastName = theUser.generalInfo.lastName,
                        mustChangePW = theUser.generalInfo.mustChangePassword,
                        osLogin = theUser.generalInfo.osLogin,
                        password = theUser.generalInfo.password,
                        startDate = DateTime.Now,
                        userID = theUser.generalInfo.id,
                        userName = theUser.generalInfo.userName,
                        userProfileName = theUser.generalInfo.userProfileName
                    };
                    //create new skill object to hold values
                    userInfo.skills = new Collection<Five9UserSkill>();
                    //loop through all skills and add to user object
                    if (theUser.skills != null)
                    {
                        foreach (var theSkill in theUser.skills)
                        {

                            //add skill to user:
                            var userSkill = new Five9UserSkill
                            {
                                skillID = theSkill.id,
                                skillLevel = theSkill.level,
                                skillName = theSkill.skillName,
                                userName = theSkill.userName
                            };
                            userInfo.skills.Add(userSkill);
                        }
                    }
                    //add user to db
                    db.Five9Users.Add(userInfo);
                    //commit after each record
                    db.SaveChanges();
                }
                List<Five9UserInfo> theList = db.Five9Users.ToList();
                ViewModelFive9UsersSkills theViewItem;
                foreach (Five9UserInfo user in  theList)
                {
                    if (user.skills == null) { 
                    theViewItem = new ViewModelFive9UsersSkills();
                    theViewItem.firstName = user.firstName;
                    theViewItem.fullName = user.fullName;
                    theViewItem.isActive = user.isActive;
                    theViewItem.lastName = user.lastName;
                    theViewItem.userID = user.userID;
                    theViewItem.userName = user.userName;
                    theViewItem.skillName = "none";
                    theViewItem.skillLevel = 0;
                    theFive9UserInfo.Add(theViewItem);
                    }
                    else
                    {
                        foreach (Five9UserSkill skill in user.skills)
                        {
                            theViewItem = new ViewModelFive9UsersSkills();
                            theViewItem.firstName = user.firstName;
                            theViewItem.fullName = user.fullName;
                            theViewItem.isActive = user.isActive;
                            theViewItem.lastName = user.lastName;
                            theViewItem.userID = user.userID;
                            theViewItem.userName = user.userName;
                            theViewItem.skillName = skill.skillName;
                            theViewItem.skillLevel =skill.skillLevel;
                            theFive9UserInfo.Add(theViewItem);
                            
                        }

                    }
                    
                }
                

                return View(theFive9UserInfo);
            }



            catch (Exception ex)
            {

                return View();
            }
        }


        public ActionResult CustomerCallBack()
        {

            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult CustomerCallBack([Bind(Include = "firstname,lastname,phone1,phone2,phone3,LeadId,F9List,F9CallASAP")]ViewModelFive9CallBackInfo callbackinfo)
        {



            try
            {
                //get the user

                string currentUserId = User.Identity.GetUserId();
                ApplicationUser currentUser = ApplicationDbContext.Users.FirstOrDefault(x => x.Id == currentUserId);
                Five9APIUser five9APIUser = db.ApiUsers.FirstOrDefault(u => u.UserName == currentUser.UserName);

              
                if (five9APIUser == null)
                {
                    return View(callbackinfo);
                }
                
                com.five9.configapi.WsAdminServiceV2 theProxy = new com.five9.configapi.WsAdminServiceV2();

               

                // Setup credentials
                System.Net.CredentialCache serviceCredentials = new System.Net.CredentialCache();
                //NetworkCredential netCredentials = new NetworkCredential("PennyMacWebServiceAPIConfig", "Summer$1");
                NetworkCredential netCredentials = new NetworkCredential(five9APIUser.AdminUsername, five9APIUser.AdminPW);

                serviceCredentials.Add(new Uri(theProxy.Url), "Basic", netCredentials);
                theProxy.Credentials = netCredentials.GetCredential(new Uri(theProxy.Url), "Basic");
                theProxy.PreAuthenticate = true;


                asyncAddRecordsToList req = new asyncAddRecordsToList();
                req.listName = callbackinfo.F9List;
                req.listUpdateSettings = new listUpdateSettings();

                req.listUpdateSettings.allowDataCleanupSpecified = true;
                req.listUpdateSettings.allowDataCleanup=true;
                //req.listUpdateSettings.cleanListBeforeUpdate = false;


                


                if (callbackinfo.F9CallASAP)
                {
                    req.listUpdateSettings.callNowMode = callNowMode.ANY;
                }
                else
                {
                    req.listUpdateSettings.callNowMode = callNowMode.NONE;
                }
                req.listUpdateSettings.callNowModeSpecified = true;

                req.listUpdateSettings.crmAddMode = crmAddMode.ADD_NEW;
                req.listUpdateSettings.crmAddModeSpecified = true;

                req.listUpdateSettings.crmUpdateMode = crmUpdateMode.UPDATE_FIRST;
                req.listUpdateSettings.crmUpdateModeSpecified = true;

                req.listUpdateSettings.listAddMode = listAddMode.ADD_FIRST;
                req.listUpdateSettings.listAddModeSpecified = true;

                req.listUpdateSettings.fieldsMapping = new fieldEntry[6];

                req.listUpdateSettings.fieldsMapping[0] = new fieldEntry();
                req.listUpdateSettings.fieldsMapping[0].columnNumber = 1;
                req.listUpdateSettings.fieldsMapping[0].fieldName = "number1";
                req.listUpdateSettings.fieldsMapping[0].key = false;

                req.listUpdateSettings.fieldsMapping[1] = new fieldEntry();
                req.listUpdateSettings.fieldsMapping[1].columnNumber = 2;
                req.listUpdateSettings.fieldsMapping[1].fieldName = "first_name";
                req.listUpdateSettings.fieldsMapping[1].key = false;

                req.listUpdateSettings.fieldsMapping[2] = new fieldEntry();
                req.listUpdateSettings.fieldsMapping[2].columnNumber = 3;
                req.listUpdateSettings.fieldsMapping[2].fieldName = "last_name";
                req.listUpdateSettings.fieldsMapping[2].key = false;

                req.listUpdateSettings.fieldsMapping[3] = new fieldEntry();
                req.listUpdateSettings.fieldsMapping[3].columnNumber = 4;
                req.listUpdateSettings.fieldsMapping[3].fieldName = "number2";
                req.listUpdateSettings.fieldsMapping[3].key = false;

                req.listUpdateSettings.fieldsMapping[4] = new fieldEntry();
                req.listUpdateSettings.fieldsMapping[4].columnNumber = 5;
                req.listUpdateSettings.fieldsMapping[4].fieldName = "number3";
                req.listUpdateSettings.fieldsMapping[4].key = false;

                req.listUpdateSettings.fieldsMapping[5] = new fieldEntry();
                req.listUpdateSettings.fieldsMapping[5].columnNumber = 6;
                req.listUpdateSettings.fieldsMapping[5].fieldName = "LeadId";
                req.listUpdateSettings.fieldsMapping[5].key = true;



                string theLeadData = "Number,FirstName,LastName,Phone2,Phone3,LeadID\r\n" + callbackinfo.phone1 + "," + callbackinfo.firstname + "," + callbackinfo.lastname + "," + callbackinfo.phone2 + "," + callbackinfo.phone3 + "," + callbackinfo.LeadId + "\r\n";
                req.importData = buildImportData(theLeadData);

                asyncAddRecordsToListResponse resp = theProxy.asyncAddRecordsToList(req);

                //MessageBox.Show("Operation submitted.  Click OK to wait for results.", "Operation", MessageBoxButton.OK);

                string jobId = resp.@return.identifier;

                bool done = false;
                while (!done)
                {
                    isImportRunning reqRunning = new isImportRunning();
                    reqRunning.identifier = new importIdentifier();
                    reqRunning.identifier.identifier = jobId;
                    reqRunning.waitTime = 15;
                    reqRunning.waitTimeSpecified = true;

                    isImportRunningResponse respRunning = theProxy.isImportRunning(reqRunning);
                    done = !respRunning.@return;

                }

                getListImportResult reqResults = new getListImportResult();
                reqResults.identifier = new importIdentifier();
                reqResults.identifier.identifier = jobId;
                getListImportResultResponse respResults = theProxy.getListImportResult(reqResults);
                listImportResult theResult = respResults.@return;
                return View("CustomerCallBackResult", theResult);
                //ShowListImportResult(respResults.@return);
            }
            catch (Exception exc)
            {
                //MessageBox.Show(exc.Message);
                return View(callbackinfo);
            }
        }

        public string[][] buildImportData(string csvData)
        {
            ArrayList al = new ArrayList();

            string exp = "(\\S*)$*";

            Match match = Regex.Match(csvData, exp);

            while (match.Success)
            {
                Debug.WriteLine("" + match.Index + " - " + match.Length + " - " + match.Value);

                if (match.Length > 1)
                {
                    Debug.WriteLine(match.Value);
                    al.Add(match.Value);
                }

                match = match.NextMatch();
            }

            // We need to manually skip the header record here for the async operations.
            string[][] ret = new string[al.Count - 1][];

            for (int i = 0; i < al.Count - 1; i++)
            {
                string csv = (string)al[i + 1];

                ret[i] = csv.Split(",".ToCharArray());
            }

            return ret;
        }

        
        
        
        
        
        public ActionResult GetCSVDNISList()
        {

            try
            {
                //get the user

                string currentUserId = User.Identity.GetUserId();
                ApplicationUser currentUser = ApplicationDbContext.Users.FirstOrDefault(x => x.Id == currentUserId);



                Five9APIUser five9APIUser = db.ApiUsers.FirstOrDefault(u => u.UserName == currentUser.UserName);

                List<DNISAssignment> theDNISAssignments = new List<DNISAssignment>();


                if (five9APIUser == null)
                {
                    return View(theDNISAssignments);
                }
                com.five9.configapi.WsAdminServiceV2 theProxy = new com.five9.configapi.WsAdminServiceV2();
                com.five9.configapi.getCampaigns theGetCampaignParam = new getCampaigns();
                theGetCampaignParam.campaignNamePattern = ".*";


                // Setup credentials
                System.Net.CredentialCache serviceCredentials = new System.Net.CredentialCache();
                //NetworkCredential netCredentials = new NetworkCredential("PennyMacWebServiceAPIConfig", "Summer$1");
                NetworkCredential netCredentials = new NetworkCredential(five9APIUser.AdminUsername, five9APIUser.AdminPW);

                serviceCredentials.Add(new Uri(theProxy.Url), "Basic", netCredentials);
                theProxy.Credentials = netCredentials.GetCredential(new Uri(theProxy.Url), "Basic");
                theProxy.PreAuthenticate = true;


                campaign[] theCampaigns = theProxy.getCampaigns(theGetCampaignParam);
                getCampaignDNISList theCDLParam = new getCampaignDNISList();


                DNISAssignment theDNISAssignment;
                for (int i = 0; i < theCampaigns.Length; i++)
                {
                    if (theCampaigns[i].type.ToString() == "INBOUND")
                    {


                        theCDLParam.campaignName = theCampaigns[i].name;
                        string[] theDNIS = theProxy.getCampaignDNISList(theCDLParam);

                        for (int j = 0; j < theDNIS.Length; j++)
                        {

                            theDNISAssignment = new DNISAssignment();
                            theDNISAssignment.Campaign = theCDLParam.campaignName;
                            theDNISAssignment.DNIS = theDNIS[j].ToString();
                            //Console.WriteLine(theDNIS[j].ToString() + " , " + theCDLParam.campaignName);
                            theDNISAssignments.Add(theDNISAssignment);

                        }
                    }
                }




                com.five9.configapi.getDNISList theDNISList = new getDNISList();
                theDNISList.selectUnassigned = true;
                theDNISList.selectUnassignedSpecified = true;
                string[] theDNIS2 = theProxy.getDNISList(theDNISList);

                for (int i = 0; i < theDNIS2.Length; i++)
                {
                    var obj = theDNISAssignments.FirstOrDefault(x => x.DNIS == theDNIS2[i].ToString());
                    if (obj == null)
                    {
                        theDNISAssignment = new DNISAssignment();
                        theDNISAssignment.Campaign = "Unassigned";
                        theDNISAssignment.DNIS = theDNIS2[i].ToString();
                        theDNISAssignments.Add(theDNISAssignment);

                    }


                }
                return new CsvActionResult<DNISAssignment>(theDNISAssignments, "DNISListExport.csv");
                
            }



            catch (Exception ex)
            {

                return View();
            }
            
        }

        public ActionResult GetCSVSkillList()
        {

            try
            {
                

               
                List<ViewModelFive9UsersSkills> theFive9UserInfo = new List<ViewModelFive9UsersSkills>();


                List<Five9UserInfo> theList = db.Five9Users.ToList();
                ViewModelFive9UsersSkills theViewItem;
                foreach (Five9UserInfo user in theList)
                {
                    if (user.skills == null)
                    {
                        theViewItem = new ViewModelFive9UsersSkills();
                        theViewItem.firstName = user.firstName;
                        theViewItem.fullName = user.fullName;
                        theViewItem.isActive = user.isActive;
                        theViewItem.lastName = user.lastName;
                        theViewItem.userID = user.userID;
                        theViewItem.userName = user.userName;
                        theViewItem.skillName = "none";
                        theViewItem.skillLevel = 0;
                        theFive9UserInfo.Add(theViewItem);
                    }
                    else
                    {
                        foreach (Five9UserSkill skill in user.skills)
                        {
                            theViewItem = new ViewModelFive9UsersSkills();
                            theViewItem.firstName = user.firstName;
                            theViewItem.fullName = user.fullName;
                            theViewItem.isActive = user.isActive;
                            theViewItem.lastName = user.lastName;
                            theViewItem.userID = user.userID;
                            theViewItem.userName = user.userName;
                            theViewItem.skillName = skill.skillName;
                            theViewItem.skillLevel = skill.skillLevel;
                            theFive9UserInfo.Add(theViewItem);

                        }

                    }

                }



                return new CsvActionResult<ViewModelFive9UsersSkills>(theFive9UserInfo, "SkillsListExport.csv");

            }



            catch (Exception ex)
            {

                return View();
            }

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