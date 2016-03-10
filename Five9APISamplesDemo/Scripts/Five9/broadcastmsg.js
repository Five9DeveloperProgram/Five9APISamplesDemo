$(function () {


    //when change userid- get data for user and populate fields for static login
    $('#sendBroadcast').click(function () {

        var theMessage = $('#broadcastVal').val();
        $.ajax({
            url: '/StatisticsAPI/sendBroadcastMessage',
            type: 'POST',
            data: { "theMessage": theMessage },
            dataType: 'json',
            success: function (response) {
                try {

                    //alert(response);
                    //$('#DomainName').val(response.theUser.DomainName);
                    //$('#DomainID').val(response.theUser.DomainID);
                    //$('#EffectiveCID').val(response.theUser.EffectiveCID);
                    //$('#SIPExtension').val(response.theUser.SIPExtension);
                    //$('#RestrictToIPs').val(response.theUser.RestrictToIPs);
                    //$('#SIPPassword').val(response.theUser.SIPPassword);
                    //$('#VMPassword').val(response.theUser.VMPassword);
                    //$('#EffectiveCNAME').val(response.theUser.EffectiveCNAME);
                    //$('#OutboundCID').val(response.theUser.OutboundCID);
                    //$('#OutboundCNAME').val(response.theUser.OutboundCNAME);
                    //$('#AccountCode').val(response.theUser.AccountCode);
                    //$('#ContextID').val(response.theUser.ContextID);
                    //$('#ContextName').val(response.theUser.ContextName);
                    //$('#Location').val(response.theUser.LocationName);
                } catch (e) { alert(e.description) }

            },
            error: function (error) {
                alert(error.statusText)
            }
        });
    });
});


