var five9cti;
var matchCAVID = 0;//used for call attached variable id
function initialize() {
    try {
        five9cti = new Five9CTI("http://localhost:8080/agent/v2");
        five9cti.setDebug(false);
        five9cti.addCTIEventListener(this);
        five9cti.connect();
    } catch (e) {
        console.error('initialize() error: ' + e);
    }
}
function disconnect() {
    five9cti.disconnect();
}

function spawnNotification(theBody, theIcon, theTitle) {
    var options = {
        body: theBody,
        icon: theIcon
    }
    var n = new Notification(theTitle, options);
}


var notifyMe = function (themessage) {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification('Five9 Alert!', {
            icon: 'https://Five9APISamplesDemo.azurewebsites.net/Five9Logos/five9-logo.jpg',
            body: themessage,
        });

        //notification.onclick = function () {
        //    window.open("http://www.five9.com");
        //};

    }

};

function onCTIEvent(eventName, ctiEvent) {

    
    if (eventName != 'modelChanged')  $('#callEventDiv').prepend('CTIEvent: ' + eventName + '<br/>');


    if (eventName === 'connected') {
        // Five9CTI is connected
        console.log('onCTIEvent: ' + eventName);
    }
    else if (eventName === 'disconnected') {
        // Five9CTI is disconnected
        console.log('onCTIEvent: ' + eventName);

    } else if (eventName === 'callStarted') {
        // Five9CTI call Started
        //var opt={
        //    type:"basic",
        //    title:"Call Started!",
        //    message:"New FIVE9 Call Started " +eventName + "!",
        //    iconUrl: "~/Five9Logos/five9-logo.jpg"
        //};
        //chrome.notifications.create('callStarted', opt, function () { });
        //spawnNotification("New FIVE9 Call Started " + eventName + "!", '~/Five9Logos/five9-logo.jpg', 'Call Started!');
        $("#hangUp").show();
        $("#makecall").hide();
        notifyMe('Call Started!');

        console.log('onCTIEvent: ' + eventName);



    } else if (eventName === 'callInitiated') {
       
        $("#hangUp").show();
        $("#makecall").hide();
        notifyMe('Call Initiated!');
        
        console.log('onCTIEvent: ' + eventName);
    
    } else if (eventName === 'callEnded') {
       
        $("#hangUp").hide();
        notifyMe('Call Ended!');
        console.log('onCTIEvent: ' + eventName);

    } else if (eventName === 'callFinished') {
        

        //$("#hangUp").hide();
        $("#makecall").show();
        notifyMe('Call Dispositioned!');
        console.log('onCTIEvent: ' + eventName);



    } else {
        // handle all other CTI events, like LoginProcessFinished, etc.
        console.log('onCTIEvent: ' + eventName);
        if (ctiEvent) {
            // handle event properties
            console.log('ctiEvent: ' + JSON.stringify(ctiEvent));
            if (eventName == 'loginProcessFinished') {
                notifyMe('Logged In!');
                $("#signin").hide();
                $("#signout").show();
                $("#hangUp").hide();
                $("#makecall").show();
            } else if (eventName == 'logoutProcessFinished') {
                notifyMe('Logged Out!');
                $("#signin").show();
                $("#signout").hide();
                $("#hangUp").hide();
                $("#makecall").hide();
            }
        }
    }
}
// example properties and methods into Five9CTI
function isAvailable() {
    return five9cti.Connected;
}
function login(userName, password, stationId, stationType) {
    return five9cti.login(userName, password, stationId, stationType);
}
function loginAsync2(userName, password, stationId, stationType, force) {
    return five9cti.loginAsync2(userName, password, stationId, stationType, force);
}
function logout(reasonId) {
    return five9cti.logout(reasonId);
}
function makeCall(number, campaignId, checkDnc, callbackId) {
    return five9cti.makeCall(number, campaignId, checkDnc, callbackId);
}

function finishCall() {
    return five9cti.finishCall(1130800, 'Call Ended By Code');//call ended dispo
}
// add additional stub methods ...
function updateCallAttachedVariable(matchCAV, crmid) {
    try {
        //if the ID for the CAV field is not set then find it
        if (matchCAVID == 0 || !matchCAVID || matchCAVID == "") {
            var theCAV = five9cti.getCallAttachedVariables();
            //console.log('CAVs: ' + JSON.stringify(theCAV));
            matchCAVID = $.grep(theCAV, function (obj) {
                return obj.name === matchCAV;
            })[0].id;
            $('#callEventDiv').prepend('Updated CRMLinkID Field ID: ' + matchCAVID.toString() + '<br/>');
            console.log('Updated CRMLinkID Field ID: ' + matchCAVID.toString());
        }
        else {
            $('#callEventDiv').prepend('CRMLinkID Field ID Already Set to: ' + matchCAVID.toString() + '<br/>');
            console.log('CRMLinkID Field ID Already Set to: ' + matchCAVID.toString());
        }

        //update the CAV
        five9cti.setCallAttachedVariable(matchCAVID, crmid);

        //write success to log
        $('#callEventDiv').prepend("Updated Call Variable " + matchCAV + " = " + crmid + '<br/>');
        console.log("Updated Call Variable " + matchCAV + " = " + crmid);

        


    }
    catch (e) {
        $('#callEventDiv').prepend('Updated Call Variable Error ' + e + '<br/>');
        console.error('Updated Call Variable Error ' + e);

    }

}


$("#signout").hide();
$("#signin").bind('click', function () {
    var username = $("#username").val();
    var password = $("#password").val();
    var stationid = $("#stationid").val();
    var stationtype = $("input:radio[name='stationtype']:checked").val();
    if (!username || !password || !stationid) {
        alert('Username, password, and station id are required.');
    } else {
        loginAsync2(username, password, stationid, stationtype, true);
        //login(username, password, stationid, stationtype);
    }
});
$("#signout").bind('click', function () {
    logout(0);
});

$(function () {

    initialize();

    $('#updatecav').click(function () {
        updateCallAttachedVariable($('#CAVName').val(), $('#CAVValue').val());
        return false;
    });

    $('#makecall').click(function () {
        makeCall($('#callVal').val(), 1137597, false, '');
        return false;
    });

    $('#hangUp').click(function () {
        finishCall();
        return false;
    });

    $("#hangUp").hide();
    $("#makecall").hide();
});