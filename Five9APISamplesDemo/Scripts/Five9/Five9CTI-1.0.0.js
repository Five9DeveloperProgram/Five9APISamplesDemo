/*
 * Copyright (c) 2014 Five9, Inc. The content presented herein may not, under any
 * circumstances, be reproduced in whole or in any part or form without written
 * permission from Five9, Inc.
 *
 * This program is distributed in the hope that it will be useful, but without
 * any warranty. It is provided "as is" without warranty of any kind, either expressed
 * or implied, including, but not limited to, the implied warranties of merchantability
 * and fitness for a particular purpose. The entire risk as to the quality and performance
 * of the program is with you. Should the program prove defective, you assume the cost of
 * all necessary servicing, repair or correction.
 *
 * Base: Five9 CTI Web Services 8.2.25 WEBAGENT {20140708_0929}
 */

var Five9CTI = (function () {

    /**
     * Constructor
     *
     * @param url
     */
    var cls = function (url) {

        this.DEBUG_LOG = false;
        this.USE_STATELESS_MODEL = false;

        /**
         * Enables Five9CTI debug logging
         *
         * @param enabled
         */
        this.setDebug = function (enabled) {
            this.DEBUG_LOG = !!enabled;
        };

        /**
         * Enables CTI WS stateless model
         *
         * @param enabled
         */
        this.setUseStatelessModel = function (enabled) {
            this.USE_STATELESS_MODEL = !!enabled;
        };

        this.x2js = new X2JS();

        $.support.cors = true;

        if (!!url) {
            this.url = url;
        } else {
            this.url = "http://localhost:8080/agent/v2";
        }

        this.Connected = false;

        // Private properties
        this.listenerId = undefined;
        this.ctiEventListeners = [];

        // request / response / event complex types
        var event = [ // base event type
            { key: 'timestamp', type: 'string' }
        ];

        var callInfo = [
            { key: 'agentInitiated', type: 'boolean' },
            { key: 'ani', type: 'string' },
            { key: 'autoRecord', type: 'boolean' },
            { key: 'avgSessionTime', type: 'long' },
            { key: 'callSessionId', type: 'string' },
            { key: 'callType', type: 'int' },
            { key: 'callbackId', type: 'long_id' },
            { key: 'campaignId', type: 'long_id' },
            { key: 'comments', type: 'string' },
            { key: 'consult', type: 'boolean' },
            { key: 'dnis', type: 'string' },
            { key: 'inboundPause', type: 'int' },
            { key: 'internalReceiver', type: 'boolean' },
            { key: 'number', type: 'string' },
            { key: 'transfer', type: 'boolean' },
            { key: 'userTransferringId', type: 'long_id' }
        ];
        var agentBridgeStatus = [
            { key: 'callConnected', type: 'boolean' },
            { key: 'currentCall', type: [ callInfo ] },
            { key: 'loggedIn', type: 'boolean' },
            { key: 'onCall', type: 'boolean' },
            { key: 'ready', type: 'boolean' },
            { key: 'restarting', type: 'boolean' }
        ];
        var agentInfo = [
            { key: 'agentId', type: 'long_id' },
            { key: 'name', type: 'string' }
        ];
        var agentPermission = [
            { key: 'canAddDNC', type: 'boolean' },
            { key: 'canChangePassword', type: 'boolean' },
            { key: 'canCreateCallbacks', type: 'boolean' },
            { key: 'canCreateChat', type: 'boolean' },
            { key: 'canCreateConference', type: 'boolean' },
            { key: 'canDeleteVoicemailSession', type: 'boolean' },
            { key: 'canDialDNC', type: 'boolean' },
            { key: 'canEditCRMSessions', type: 'boolean' },
            { key: 'canMakeCalls', type: 'boolean' },
            { key: 'canMakeInternalCalls', type: 'boolean' },
            { key: 'canMakeRecordings', type: 'boolean' },
            { key: 'canMakeTestCalls', type: 'boolean' },
            { key: 'canManageSkillAvailability', type: 'boolean' },
            { key: 'canPlayPromptToCaller', type: 'boolean' },
            { key: 'canProcessVoicemail', type: 'boolean' },
            { key: 'canRejectCalls', type: 'boolean' },
            { key: 'canRemoveCRMData', type: 'boolean' },
            { key: 'canSendMessages', type: 'boolean' },
            { key: 'canSkipNumbersInPreview', type: 'boolean' },
            { key: 'canTransfer', type: 'boolean' },
            { key: 'canTransferVoicemail', type: 'boolean' },
            { key: 'canUseConnectors', type: 'boolean' },
            { key: 'reasonCodesEnabled', type: 'boolean' },
            { key: 'canHold', type: 'boolean' },
            { key: 'canWrapUpCalls', type: 'boolean' },
            { key: 'canPark', type: 'boolean' },
            { key: 'canPickSalesforceObjectForCallLog', type: 'boolean' },
            { key: 'canTransferToAgents', type: 'boolean' },
            { key: 'canTransferToSkills', type: 'boolean' },
            { key: 'canCreateConferenceWithAgents', type: 'boolean' },
            { key: 'canCreateConferenceUsingSkills', type: 'boolean' },
            { key: 'canConfigureAutoAnswer', type: 'boolean' },
            { key: 'canSelectSysRecycleDisposition', type: 'boolean' }
        ];
        var agentPromptValue = [
            { key: 'description', type: 'string' },
            { key: 'description_is_set', type: 'boolean' },
            { key: 'duration', type: 'long' },
            { key: 'duration_is_set', type: 'boolean' },
            { key: 'id', type: 'long_id' },
            { key: 'id_is_set', type: 'boolean' },
            { key: 'name', type: 'string' },
            { key: 'name_is_set', type: 'boolean' }
        ];
        var agentState = [
            { key: 'agentId', type: 'long_id' },
            { key: 'state', type: 'int' }
        ];
        var agentStateValue = [
            { key: 'agentId', type: 'long_id' },
            { key: 'state', type: 'string' },
            { key: 'fullname', type: 'string' },
            { key: 'stateSince', type: 'string' },
            { key: 'callType', type: 'int' },
            { key: 'availableSkills', type: 'long_id', isarray: true }
        ];
        var answerCriteriaValue = [
            { key: 'questionToJumpTo', type: 'string' },
            { key: 'questionType', type: 'int' },
            { key: 'valueToCheck', type: 'string' }
        ];
        var callbackInfo = [
            { key: 'agent', type: 'long_id' },
            { key: 'CRMId', type: 'long_id' },
            { key: 'campaignId', type: 'long_id' },
            { key: 'comments', type: 'string' },
            { key: 'dueDate', type: 'long' },
            { key: 'flags', type: 'flags' },
            { key: 'id', type: 'long_id' },
            { key: 'number', type: 'string' },
            { key: 'userGroup', type: 'long_id' }
        ];
        var campaignInfo = [
            { key: 'id', type: 'long_id' },
            { key: 'name', type: 'string' },
            { key: 'flags', type: 'flags' },
            { key: 'state', type: 'int' },
            { key: 'mode', type: 'int' },
            { key: 'extension', type: 'string' }
        ];
        var cavFullValue = [
            { key: 'applyToAllDispositions', type: 'boolean' },
            { key: 'CCF', type: 'boolean' },
            { key: 'cavGroupId', type: 'long_id' },
            { key: 'defaultValue', type: 'string' },
            { key: 'description', type: 'string' },
            { key: 'groupName', type: 'string' },
            { key: 'id', type: 'long_id' },
            { key: 'name', type: 'string' },
            { key: 'systemId', type: 'long_id' },
            { key: 'type', type: 'long' },
            { key: 'value', type: 'string' }
        ];
        var cavViewFullValue = [
            { key: 'cavId', type: 'long_id' },
            { key: 'editable', type: 'boolean' },
            { key: 'id', type: 'long_id' },
            { key: 'name', type: 'string' },
            { key: 'order', type: 'int' },
            { key: 'type', type: 'int' },
            { key: 'width', type: 'int' }
        ];
        var checkLocalTimeResult = [
            { key: 'ok', type: 'boolean' },
            { key: 'localTime', type: 'long' },
            { key: 'serverTime', type: 'long' }
        ];
        var connectorValue = [
            { key: 'className', type: 'string' },
            { key: 'description', type: 'string' },
            { key: 'dispositionIds', type: 'long_id', isarray: true },
            { key: 'flags', type: 'flags' },
            { key: 'id', type: 'long_id' },
            { key: 'name', type: 'string' },
            { key: 'url', type: 'string' }
        ];
        var crmFieldRestrictionType = [
            { key: 'optional', type: 'boolean' },
            { key: 'value', type: 'string' }
        ];
        var crmFieldDataType = [
            { key: 'id', type: 'long_id' },
            { key: 'name', type: 'string' },
            { key: 'restrictions', type: crmFieldRestrictionType, isarray: true }
        ];
        var dispositionValue = [
            { key: 'description', type: 'string' },
            { key: 'flags', type: 'flags' },
            { key: 'id', type: 'long_id' },
            { key: 'name', type: 'string' }
        ];
        var dispositionValue2 = [
            { key: 'description', type: 'string' },
            { key: 'flags', type: 'flags' },
            { key: 'id', type: 'long_id' },
            { key: 'name', type: 'string' },
            { key: 'timeout', type: 'long' }
        ];
        var participantInfo = [
            { key: 'callSessionId', type: 'string' },
            { key: 'campaignId', type: 'long_id' },
            { key: 'customerTitle', type: 'string' }
        ];
        var dispositionsInfo = [
            { key: 'conferenceDispositioning', type: 'long' },
            { key: 'dispositionValue', type: dispositionValue2, isarray: true },
            { key: 'participants', type: participantInfo, isarray: true }
        ];
        var liveCallbackInfo = [
            { key: 'callSessionId', type: 'string' },
            { key: 'campaignId', type: 'long_id' },
            { key: 'number', type: 'string' },
            { key: 'callbackNumber', type: 'string' },
            { key: 'offerId', type: 'long_id' },
            { key: 'skillId', type: 'long_id' },
            { key: 'transferModule', type: 'string' }
        ];
        var loginInfo = [
            { key: 'password', type: 'string' },
            { key: 'stationId', type: 'string' },
            { key: 'stationtype', type: 'string' },
            { key: 'username', type: 'string' }
        ];
        var manualCallsConfig = [
            { key: 'defCampaign', type: 'long_id' },
            { key: 'maySelect', type: 'boolean' },
            { key: 'maySelectNone', type: 'boolean' }
        ];
        var mapValue = [
            { key: 'key', type: 'string' },
            { key: 'value', type: 'string' }
        ];
        var map = [
            { key: 'attributes', type: mapValue, isarray: true }
        ];
        var numberRestrictionValue = [
            { key: 'dialrestricted', type: 'boolean' },
            { key: 'number', type: 'int' }
        ];
        var parkedCallInfo = [
            { key: 'address', type: 'string' },
            { key: 'addressType', type: 'int' },
            { key: 'callSessionId', type: 'string' },
            { key: 'campaignId', type: 'long_id' },
            { key: 'number', type: 'string' },
            { key: 'worksheetFinished', type: 'boolean' }
        ];
        var passwordPolicy = [
            { key: 'aspect', type: 'string' },
            { key: 'count', type: 'long' },
            { key: 'description', type: 'string' }
        ];
        var questionRestriction = [
            { key: 'id', type: 'long_id' },
            { key: 'optional', type: 'boolean' },
            { key: 'restrictionType', type: 'int' },
            { key: 'value', type: 'string' }
        ];
        var questionValue = [
            { key: 'answerCriteria', type: answerCriteriaValue, isarray: true },
            { key: 'dataViewType', type: 'int' },
            { key: 'description', type: 'string' },
            { key: 'fieldViewType', type: 'int' },
            { key: 'id', type: 'long_id' },
            { key: 'idx', type: 'int' },
            { key: 'name', type: 'string' },
            { key: 'options', type: mapValue, isarray: true },
            { key: 'restrictions', type: questionRestriction, isarray: true },
            { key: 'type', type: 'int' }
        ];
        var queuedCall = [
            { key: 'callSessionId', type: 'string' },
            { key: 'campaignId', type: 'long_id' },
            { key: 'created', type: 'long' },
            { key: 'customer', type: 'string' },
            { key: 'personal', type: 'boolean' },
            { key: 'priority', type: 'int' }
        ];
        var readyStateValue = [
            { key: 'id', type: 'long_id' },
            { key: 'name', type: 'string' }
        ];
        var reasonCodeValue = [
            { key: 'id', type: 'long_id' },
            { key: 'name', type: 'string' }
        ];
        var recordingValue = [
            { key: 'callSessionId', type: 'string' },
            { key: 'campaignId', type: 'long_id' },
            { key: 'created', type: 'long' },
            { key: 'filename', type: 'string' },
            { key: 'flags', type: 'flags' },
            { key: 'id', type: 'long_id' },
            { key: 'length', type: 'long' },
            { key: 'name', type: 'string' },
            { key: 'number', type: 'string' }
        ];
        var skillInfo = [
            { key: 'name', type: 'string' },
            { key: 'skillId', type: 'long_id' }
        ];
        var skillGroup = [
            { key: 'skillId', type: 'long_id' },
            { key: 'userIds', type: 'long_id', isarray: true }
        ];
        var speedDialInfo = [
            { key: 'code', type: 'string' },
            { key: 'description', type: 'string' },
            { key: 'id', type: 'long_id' },
            { key: 'number', type: 'string' }
        ];
        var userDetails = [
            { key: 'domain', type: 'string' },
            { key: 'domainId', type: 'long_id' },
            { key: 'extension', type: 'string' },
            { key: 'flags', type: 'flags' },
            { key: 'fullName', type: 'string' },
            { key: 'station', type: 'string' },
            { key: 'stationType', type: 'string' },
            { key: 'username', type: 'string' }
        ];
        var userInfo = [
            { key: 'id', type: 'long_id' },
            { key: 'name', type: 'string' },
            { key: 'role', type: 'string' },
            { key: 'uniqueId', type: 'string' }
        ];

        // This array defines the parameters that need to be converted for request/response handlers.
        // Only need to define requests/events/parameters that require conversion, all others are passed w/o conversion.
        this.responseTypes = {};
        this.responseTypes['checkCanCreateConferenceWith'] = [
            { key: 'return', type: 'boolean' }
        ];
        this.responseTypes['checkCanMakeCallsTo'] = [
            { key: 'return', type: 'boolean' }
        ];
        this.responseTypes['checkCanTransferTo'] = [
            { key: 'return', type: 'boolean' }
        ];
        this.responseTypes['checkLocalTime'] = [
            { key: 'return', type: checkLocalTimeResult }
        ];
        this.responseTypes['getAgentPermissions'] = [
            { key: 'return', type: agentPermission }
        ];
        this.responseTypes['getAgentStates'] = [
            { key: 'return', type: agentState, isarray: true }
        ];
        this.responseTypes['getAgentStateValues'] = [
            { key: 'return', type: agentStateValue, isarray: true }
        ];
        this.responseTypes['getAllSkills'] = [
            { key: 'return', type: skillInfo, isarray: true }
        ];
        this.responseTypes['getSkillGroups'] = [
            { key: 'return', type: skillGroup, isarray: true }
        ];
        this.responseTypes['getAvailableSkills'] = [
            { key: 'return', type: skillInfo, isarray: true }
        ];
        this.responseTypes['getAvailableCampaigns'] = [
            { key: 'return', type: campaignInfo, isarray: true }
        ];
        this.responseTypes['getCampaigns'] = [
            { key: 'return', type: campaignInfo, isarray: true }
        ];
        this.responseTypes['getCampaignInfo'] = [
            { key: 'return', type: campaignInfo }
        ];
        this.responseTypes['getAvailableAgents'] = [
            { key: 'return', type: agentInfo, isarray: true }
        ];
        this.responseTypes['getAgentInfo'] = [
            { key: 'return', type: agentInfo }
        ];
        this.responseTypes['getCampaignDispositions'] = [
            { key: 'return', type: dispositionValue, isarray: true }
        ];
        this.responseTypes['getCampaignDispositions2'] = [
            { key: 'return', type: dispositionValue2, isarray: true }
        ];
        this.responseTypes['getDispositionsInfo'] = [
            { key: 'return', type: dispositionsInfo }
        ];
        this.responseTypes['getReasonCodes'] = [
            { key: 'return', type: reasonCodeValue, isarray: true }
        ];
        this.responseTypes['getNotReadyReasonCodes'] = [
            { key: 'return', type: reasonCodeValue, isarray: true }
        ];
        this.responseTypes['getStatus'] = [
            { key: 'return', type: agentBridgeStatus }
        ];
        this.responseTypes['getUserDetails'] = [
            { key: 'return', type: userDetails }
        ];
        this.responseTypes['getSoftphoneInputDevices'] = [
            { key: 'return', type: 'string', isarray: true }
        ];
        this.responseTypes['getSoftphoneOutputDevices'] = [
            { key: 'return', type: 'string', isarray: true }
        ];
        this.responseTypes['getSoftphoneDevices'] = [
            { key: 'return', type: 'int', isarray: true }
        ];
        this.responseTypes['getSoftphoneSpeakerVolume'] = [
            { key: 'return', type: 'int' }
        ];
        this.responseTypes['getSoftphoneMicrophoneLevel'] = [
            { key: 'return', type: 'int' }
        ];
        this.responseTypes['getSoftphoneMicrophoneAgc'] = [
            { key: 'return', type: 'boolean' }
        ];
        this.responseTypes['getPreviewSkipDispositions'] = [
            { key: 'return', type: dispositionValue, isarray: true }
        ];
        this.responseTypes['getPreviewSkipDispositions2'] = [
            { key: 'return', type: dispositionValue2, isarray: true }
        ];
        this.responseTypes['getCallbacks'] = [
            { key: 'return', type: callbackInfo, isarray: true }
        ];
        this.responseTypes['requestWorksheet'] = [
            { key: 'return', type: questionValue, isarray: true }
        ];
        this.responseTypes['getWorksheetAnswers'] = [
            { key: 'return', type: map }
        ];
        this.responseTypes['isWorksheetComplete'] = [
            { key: 'return', type: 'boolean' }
        ];
        this.responseTypes['hasWorksheet'] = [
            { key: 'return', type: 'boolean' }
        ];
        this.responseTypes['requestConnectors'] = [
            { key: 'return', type: connectorValue, isarray: true }
        ];
        this.responseTypes['getSpeedDials'] = [
            { key: 'return', type: speedDialInfo, isarray: true }
        ];
        this.responseTypes['getSoftphoneAutoHungup'] = [
            { key: 'return', type: 'boolean' }
        ];
        this.responseTypes['isAddressValid'] = [
            { key: 'return', type: 'boolean' }
        ];
        this.responseTypes['isSoftphoneAnswerRequired'] = [
            { key: 'return', type: 'boolean' }
        ];
        this.responseTypes['getLoggedUsers'] = [
            { key: 'return', type: userInfo, isarray: true }
        ];
        this.responseTypes['getSelfInfo'] = [
            { key: 'return', type: userInfo }
        ];
        this.responseTypes['getAudioPlayerVolume'] = [
            { key: 'return', type: 'float' }
        ];
        this.responseTypes['getSkillPrompts'] = [
            { key: 'return', type: agentPromptValue, isarray: true }
        ];
        this.responseTypes['getCRMForCallbackId'] = [
            { key: 'return', type: map }
        ];
        this.responseTypes['getCRMMap'] = [
            { key: 'return', type: map }
        ];
        this.responseTypes['getCallAttachedVariables'] = [
            { key: 'return', type: cavFullValue, isarray: true }
        ];
        this.responseTypes['getCAVFieldViews'] = [
            { key: 'return', type: cavViewFullValue, isarray: true }
        ];
        this.responseTypes['getForceCavView'] = [
            { key: 'return', type: 'boolean' }
        ];
        this.responseTypes['getCrmFieldDataTypes'] = [
            { key: 'return', type: crmFieldDataType, isarray: true }
        ];
        this.responseTypes['getManualCallsConfig'] = [
            { key: 'return', type: manualCallsConfig }
        ];
        this.responseTypes['getAddressType'] = [
            { key: 'return', type: 'int' }
        ];

        this.eventTypes = {};
        // prefix all eventTypes with 'event' wsdl extension
        this.eventTypes['activeSkillsChanged'] = event.concat([
            { key: 'activeSkills', type: 'long_id', isarray: true }
        ]);
        this.eventTypes['answerCallIncoming'] = event.concat([
            { key: 'flag', type: 'boolean' }
        ]);
        this.eventTypes['bridgeConnected'] = event.concat([ ]);
        this.eventTypes['bridgeDisconnected'] = event.concat([ ]);
        this.eventTypes['bridgeForcedLogout'] = event.concat([ ]);
        this.eventTypes['callAbandoned'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['modelChanged'] = event.concat([
            { key: 'jsonData', type: 'string' }
        ]);
        this.eventTypes['callbackAdded'] = event.concat([
            { key: 'info', type: callbackInfo }
        ]);
        this.eventTypes['callbackOverdue'] = event.concat([
            { key: 'id', type: 'long_id' },
            { key: 'time', type: 'long' }
        ]);
        this.eventTypes['callbackRemoved'] = event.concat([
            { key: 'id', type: 'long_id' }
        ]);
        this.eventTypes['callbacksChanged'] = event.concat([
            { key: 'info', type: callbackInfo, isarray: true },
            { key: 'operation', type: 'int' }
        ]);
        this.eventTypes['callCRMRecordChanged'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'record', type: map }
        ]);
        this.eventTypes['callEnded'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'party', type: 'int' }
        ]);
        this.eventTypes['callEndedByACW'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'dispositionId', type: 'long_id' },
            { key: 'timeout', type: 'long' }
        ]);
        this.eventTypes['callError'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'cause', type: 'string' },
            { key: 'operation', type: 'string' }
        ]);
        this.eventTypes['callFinished'] = event.concat([
            { key: 'callHandleTime', type: 'long' },
            { key: 'callLength', type: 'long' },
            { key: 'callSessionId', type: 'string' },
            { key: 'callStarted', type: 'long' },
            { key: 'callWrapupTime', type: 'long' }
        ]);
        this.eventTypes['callInitiated'] = event.concat([
            { key: 'number', type: 'string' },
            { key: 'type', type: 'int' }
        ]);
        this.eventTypes['callOffHold'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['callOnHold'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['callParked'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['callReparked'] = event.concat([
            { key: 'callinfo', type: callInfo }
        ]);
        this.eventTypes['callsQueueUpdated'] = event.concat([
            { key: 'calls', type: queuedCall, isarray: true }
        ]);
        this.eventTypes['callStarted'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['callUpdated'] = event.concat([
            { key: 'callinfo', type: callInfo }
        ]);
        this.eventTypes['callWrapupTimerStarted'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'timeout', type: 'long' }
        ]);
        this.eventTypes['campaignUpdate'] = event.concat([
            { key: 'campaignId', type: 'long_id' }
        ]);
        this.eventTypes['chatEnded'] = event.concat([
            { key: 'chatId', type: 'string' }
        ]);
        this.eventTypes['chatHelpRequested'] = event.concat([
            { key: 'who', type: userInfo }
        ]);
        this.eventTypes['chatInvite'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'request', type: 'boolean' },
            { key: 'requestor', type: userInfo }
        ]);
        this.eventTypes['chatInviteCancelled'] = event.concat([
            { key: 'chatId', type: 'string' }
        ]);
        this.eventTypes['chatKickedFrom'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'userInfo', type: userInfo }
        ]);
        this.eventTypes['chatKilled'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'userInfo', type: userInfo }
        ]);
        this.eventTypes['chatLoggedUsersUpdated'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'users', type: userInfo, isarray: true }
        ]);
        this.eventTypes['chatMessage'] = event.concat([
            { key: 'message', type: 'string' },
            { key: 'senderId', type: 'long_id' },
            { key: 'senderRole', type: 'string' }
        ]);
        this.eventTypes['chatMessageDialog'] = event.concat([
            { key: 'from', type: 'string' },
            { key: 'msg', type: 'string' },
            { key: 'sent', type: 'string' },
            { key: 'type', type: 'string' }
        ]);
        this.eventTypes['chatMessageReceived'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'from', type: userInfo },
            { key: 'message', type: 'string' }
        ]);
        this.eventTypes['chatParticipantStarted'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'requestor', type: userInfo }
        ]);
        this.eventTypes['chatParticipantUpdated'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'participants', type: userInfo, isarray: true }
        ]);
        this.eventTypes['chatUserDeclined'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'userInfo', type: userInfo }
        ]);
        this.eventTypes['chatUserDidNotRespond'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'userInfo', type: userInfo }
        ]);
        this.eventTypes['chatUserJoined'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'userInfo', type: userInfo }
        ]);
        this.eventTypes['chatUserLeft'] = event.concat([
            { key: 'chatId', type: 'string' },
            { key: 'userInfo', type: userInfo }
        ]);
        this.eventTypes['click2DialInitiated'] = event.concat([
            { key: 'number', type: 'string' }
        ]);
        this.eventTypes['conferenceCompleted'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['conferenceCreateFailed'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'reason', type: 'string' },
            { key: 'errorCode', type: 'int' }
        ]);
        this.eventTypes['conferenceError'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'cause', type: 'string' },
            { key: 'operation', type: 'string' }
        ]);
        this.eventTypes['conferenceParticipantAdded'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'info', type: participantInfo }
        ]);
        this.eventTypes['conferenceParticipantRemoved'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'info', type: participantInfo }
        ]);
        this.eventTypes['consultCallDisconnected'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['endOfPreviewingFailed'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['failedAddingNumberToDNC'] = event.concat([
            { key: 'cause', type: 'string' },
            { key: 'number', type: 'string' }
        ]);
        this.eventTypes['ExecuteAgentCallback'] = event.concat([
            { key: 'data', type: 'string' }
        ]);
        this.eventTypes['forceSelfLogout'] = event.concat([
            { key: 'loginInfo', type: loginInfo }
        ]);
        this.eventTypes['incomingCall'] = event.concat([
            { key: 'callinfo', type: callInfo }
        ]);
        this.eventTypes['incomingCallInfo'] = event.concat([
            { key: 'callinfo', type: callInfo }
        ]);
        this.eventTypes['invalidVersionEvent'] = event.concat([ ]); // event
        this.eventTypes['liveCallbackEnded'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'offerId', type: 'long_id' }
        ]);
        this.eventTypes['liveCallbackInitiating'] = event.concat([
            { key: 'info', type: liveCallbackInfo },
            { key: 'autoAnswer', type: 'boolean' }
        ]);
        this.eventTypes['liveCallbackInitiatingFailed'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'offerId', type: 'long_id' }
        ]);
        this.eventTypes['liveCallbackCRMRecordChanged'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'offerId', type: 'long_id' },
            { key: 'record', type: map }
        ]);
        this.eventTypes['loginProcessFinished'] = event.concat([
            { key: 'message', type: 'string' },
            { key: 'stationNumber', type: 'string' },
            { key: 'stationType', type: 'string' },
            { key: 'successfull', type: 'boolean' },
            { key: 'user', type: 'string' }
        ]);
        this.eventTypes['optionsUpdated'] = event.concat([
            { key: 'options', type: map }
        ]);
        this.eventTypes['loginProcessStarted'] = event.concat([
            { key: 'user', type: 'string' }
        ]);
        this.eventTypes['logoutProcessFinished'] = event.concat([ ]); // event
        this.eventTypes['maintenanceAnounce'] = event.concat([
            { key: 'when', type: 'int' }
        ]);
        this.eventTypes['maintenanceCanceled'] = event.concat([ ]);
        this.eventTypes['maintenanceCompleted'] = event.concat([ ]);
        this.eventTypes['maintenanceNotice'] = event.concat([
            { key: 'annotation', type: 'string' },
            { key: 'id', type: 'long_id' },
            { key: 'text', type: 'string' }
        ]);
        this.eventTypes['maintenanceRelogin'] = event.concat([
            { key: 'force', type: 'boolean' }
        ]);
        this.eventTypes['maintenanceStarted'] = event.concat([ ]);
        this.eventTypes['maintenanceStateChanged'] = event.concat([
            { key: 'hostType', type: 'int' },
            { key: 'remainingTime', type: 'int' }
        ]);
        this.eventTypes['makeCallFailed'] = event.concat([
            { key: 'campaignId', type: 'long_id' },
            { key: 'cause', type: 'string' },
            { key: 'errorCode', type: 'int' },
            { key: 'number', type: 'string' },
            { key: 'callbackId', type: 'long_id' }
        ]);
        this.eventTypes['openURL'] = event.concat([
            { key: 'newTab', type: 'boolean' },
            { key: 'url', type: 'string' }
        ]);
        this.eventTypes['parkedCallDisconnected'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['parkedCallsChanged'] = event.concat([
            { key: 'parkedCalls', type: parkedCallInfo, isarray: true }
        ]);
        this.eventTypes['parkError'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'cause', type: 'string' },
            { key: 'operation', type: 'string' }
        ]);
        this.eventTypes['passwordChangeRequired'] = event.concat([
            { key: 'cause', type: 'string' },
            { key: 'manadatory', type: 'boolean' },
            { key: 'policy', type: passwordPolicy, isarray: true }
        ]);
        this.eventTypes['permissionsUpdated'] = event.concat([
            { key: 'permissions', type: agentPermission }
        ]);
        this.eventTypes['previewCallInitiated'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['previewCRMRecordChanged'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'record', type: map },
            { key: 'restriction', type: numberRestrictionValue, isarray: true }
        ]);
        this.eventTypes['previewDialingStarted'] = event.concat([
            { key: 'callinfo', type: callInfo }
        ]);
        this.eventTypes['previewEnded'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'party', type: 'int' }
        ]);
        this.eventTypes['previewInitiated'] = event.concat([
            { key: 'callinfo', type: callInfo }
        ]);
        this.eventTypes['previewRenewed'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['previewWaitDisposition'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'dispositionId', type: 'long_id' }
        ]);
        this.eventTypes['readyStateChanged'] = event.concat([
            { key: 'forced', type: 'boolean' },
            { key: 'id', type: 'long_id' },
            { key: 'reasonCodeId', type: 'long_id' },
            { key: 'whoForced', type: 'int' }
        ]);
        this.eventTypes['readyStatesUpdated'] = event.concat([
            { key: 'states', type: readyStateValue, isarray: true }
        ]);
        this.eventTypes['reasonCodesEnabled'] = event.concat([
            { key: 'enabled', type: 'boolean' }
        ]);
        this.eventTypes['recordingAdded'] = event.concat([
            { key: 'recording', type: recordingValue }
        ]);
        this.eventTypes['recordingPlayFinished'] = event.concat([
            { key: 'duration', type: 'long' }
        ]);
        this.eventTypes['recordingsChanged'] = event.concat([
            { key: 'recordings', type: recordingValue, isarray: true }
        ]);
        this.eventTypes['recordingStarted'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'autoRecording', type: 'boolean' }
        ]);
        this.eventTypes['recordingStopped'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['recordRestrictionsChanged'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'restriction', type: numberRestrictionValue, isarray: true }
        ]);
        this.eventTypes['restartStationStarted'] = event.concat([ ]);
        this.eventTypes['restartStationDone'] = event.concat([ ]);
        this.eventTypes['restartStationFailed'] = event.concat([
            { key: 'cause', type: 'string' }
        ]);
        this.eventTypes['setSoftphoneStatus'] = event.concat([
            { key: 'status', type: 'string' }
        ]);
        this.eventTypes['skillPromptDownloadCancelled'] = event.concat([ ]);
        this.eventTypes['skillPromptDownloaded'] = event.concat([
            { key: 'filename', type: 'string' }
        ]);
        this.eventTypes['skillPromptDownloadFailed'] = event.concat([
            { key: 'details', type: 'string' }
        ]);
        this.eventTypes['skillPromptDownloadProgress'] = event.concat([
            { key: 'progress', type: 'double' }
        ]);
        this.eventTypes['skillPromptPauseFailed'] = event.concat([
            { key: 'details', type: 'string' }
        ]);
        this.eventTypes['skillPromptPlayFailed'] = event.concat([
            { key: 'details', type: 'string' }
        ]);
        this.eventTypes['skillPromptsChanged'] = event.concat([ ]);
        this.eventTypes['skillPromptsPermissionChanged'] = event.concat([ ]);
        this.eventTypes['skillPromptStopFailed'] = event.concat([
            { key: 'details', type: 'string' }
        ]);
        this.eventTypes['skillsChanged'] = event.concat([
            { key: 'skills', type: skillInfo, isarray: true }
        ]);
        this.eventTypes['skillsInitialized'] = event.concat([
            { key: 'activeSkills', type: 'long_id', isarray: true },
            { key: 'skills', type: skillInfo, isarray: true }
        ]);
        this.eventTypes['skillsStatusChanged'] = event.concat([
            { key: 'skills', type: skillInfo, isarray: true }
        ]);
        this.eventTypes['skillAdded'] = event.concat([
            { key: 'name', type: 'string' }
        ]);
        this.eventTypes['softphoneError'] = event.concat([
            { key: 'message', type: 'string' }
        ]);
        this.eventTypes['softphoneVolumeChanged'] = event.concat([
            { key: 'microphone', type: 'boolean' },
            { key: 'speaker', type: 'boolean' },
            { key: 'value', type: 'int' }
        ]);
        this.eventTypes['stationDisconnected'] = event.concat([ ]);
        this.eventTypes['switchToBDC'] = event.concat([
            { key: 'reason', type: 'string' }
        ]);
        this.eventTypes['switchToPDC'] = event.concat([
            { key: 'reason', type: 'string' }
        ]);
        this.eventTypes['timeAdjustmentChanged'] = event.concat([
            { key: 'timeAdjustment', type: 'long' }
        ]);
        this.eventTypes['timeout'] = event.concat([
            { key: 'operation', type: 'string' }
        ]);
        this.eventTypes['transferCallDisconnected'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['transferCompleted'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['transferError'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'cause', type: 'string' },
            { key: 'errorCode', type: 'int' }
        ]);
        this.eventTypes['transferStarted'] = event.concat([
            { key: 'callSessionId', type: 'string' }
        ]);
        this.eventTypes['updateStatus'] = event.concat([
            { key: 'status', type: agentBridgeStatus }
        ]);
        this.eventTypes['userUpdate'] = event.concat([
            { key: 'flags', type: 'flags' }
        ]);
        this.eventTypes['voicemailAccepted'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'callSkillId', type: 'long_id' },
            { key: 'callType', type: 'int' },
            { key: 'campaignId', type: 'long_id' },
            { key: 'created', type: 'long' },
            { key: 'customerTitle', type: 'string' },
            { key: 'holdTime', type: 'long' },
            { key: 'initialComments', type: 'string' },
            { key: 'length', type: 'long' },
            { key: 'offerId', type: 'long_id' },
            { key: 'ourNumber', type: 'string' },
            { key: 'queueTime', type: 'long' },
            { key: 'remoteNumber', type: 'string' },
            { key: 'transferModule', type: 'string' },
            { key: 'transferUserId', type: 'long_id' },
            { key: 'voicemailId', type: 'long_id' }
        ]);
        this.eventTypes['voicemailAdded'] = event.concat([
            { key: 'value', type: recordingValue }
        ]);
        this.eventTypes['voicemailCRMRecordChanged'] = event.concat([
            { key: 'record', type: map },
            { key: 'voicemailId', type: 'long_id' }
        ]);
        this.eventTypes['voicemailDelivered'] = event.concat([
            { key: 'campaignId', type: 'long_id' },
            { key: 'created', type: 'long' },
            { key: 'initialComments', type: 'string' },
            { key: 'length', type: 'long' },
            { key: 'remoteNumber', type: 'string' },
            { key: 'voicemailId', type: 'long_id' }
        ]);
        this.eventTypes['voicemailEnded'] = event.concat([
            { key: 'voicemailId', type: 'long_id' }
        ]);
        this.eventTypes['voicemailPostponed'] = event.concat([
            { key: 'voicemailId', type: 'long_id' }
        ]);
        this.eventTypes['voicemailResumed'] = event.concat([
            { key: 'voicemailId', type: 'long_id' }
        ]);
        this.eventTypes['voicemailStateChanged'] = event.concat([
            { key: 'callSessionId', type: 'string' },
            { key: 'callSkillId', type: 'long_id' },
            { key: 'callType', type: 'int' },
            { key: 'campaignId', type: 'long_id' },
            { key: 'created', type: 'long' },
            { key: 'customerTitle', type: 'string' },
            { key: 'holdTime', type: 'long' },
            { key: 'initialComments', type: 'string' },
            { key: 'length', type: 'long' },
            { key: 'offerId', type: 'long_id' },
            { key: 'ourNumber', type: 'string' },
            { key: 'queueTime', type: 'long' },
            { key: 'remoteNumber', type: 'string' },
            { key: 'transferModule', type: 'string' },
            { key: 'transferUserId', type: 'long_id' },
            { key: 'voicemailId', type: 'long_id' }
        ]);
        this.eventTypes['chatBroadcastMessageReceived'] = event.concat([
            { key: 'from', type: 'string' },
            { key: 'type', type: 'long_id' },
            { key: 'message', type: 'long_id' }
        ]);
    };

    cls.prototype = {

        /**
         * Adds a listener for cti events
         *
         * @param listener
         */
        addCTIEventListener: function (listener) {
            this.ctiEventListeners.push(listener);
        },

        /**
         * Notifies listeners of cti events
         *
         * @param eventName
         * @param ctiEvent
         * @private
         */
        notifyCTIEventListeners: function (eventName, ctiEvent) {
            for (var i = 0; i < this.ctiEventListeners.length; i++) {
                try {
                    this.ctiEventListeners[i].onCTIEvent(eventName, ctiEvent);
                } catch (e) {
                    console.error('notifyCTIEventListeners: ' + eventName + ' error: ' + e);
                }
            }
        },

        /**
         * Make a synchronous XHR SOAP request
         *
         * @param soapEnv
         * @returns {*}
         * @private
         */
        syncRequest: function (soapEnv) {
            if (this.DEBUG_LOG) console.log('Five9CTI.syncRequest: soapEvn: ' + soapEnv);
            /*
             Return empty string as default because some downstream code
             interprets null or undefined as an error condition when the
             expected response is an empty response.
             */
            var retobj = '';

            var me = this;
            this.xmlHttpRequest(
                function (xml, status, jqXHR) {
                    try {
                        var jsonResp = me.x2js.xml2json(xml);
                        var body = jsonResp['Envelope']['Body'];

                        for (var elementName in body) {
                            if (!body.hasOwnProperty(elementName)) continue;
                            var responseIndex = elementName.lastIndexOf('Response');
                            if (responseIndex > -1) {
                                var response = body[elementName];
                                var requestName = elementName.substr(0, responseIndex); // trim 'Response'
                                var parameters = me.responseTypes[requestName];
                                if (parameters !== undefined) {
                                    // handle typed parameters, otherwise its empty response
                                    response = me.convertTypes(parameters, response);
                                }
                                // return the 'return' response
                                if ('return' in response) {
                                    retobj = response['return'];
                                }
                                break;
                            }
                        }
                    } catch (e) {
                        console.error('Five9CTI.syncRequest: status: ' + status + ' error: ' + e);
                        retobj = e.message;
                    }
                },

                function (jqXHR, status, error) {
                    try {
                        var xml = jqXHR.responseText;
                        var body, faultcode, faultstring;
                        try {
                            var jsonResp = me.x2js.xml_str2json(xml);
                            body = jsonResp['Envelope']['Body'];
                            if ('Fault' in body) {
                                faultcode = body['Fault']['faultcode'];
                                faultstring = body['Fault']['faultstring'];
                            }
                        } catch (e) {
                        }

                        console.error('Five9CTI.syncRequest: status: ' + status + ' error: ' + error + ' faultstring: ' + faultstring);
                        retobj = faultstring;

                    } catch (e) {
                        console.error('Five9CTI.syncRequest: status: ' + status + ' error: ' + e);
                        retobj = e.message;
                    }
                },
                this,
                soapEnv,
                false // synchronous
            );

            if (this.DEBUG_LOG) console.log('Five9CTI.syncRequest: return: ' + JSON.stringify(retobj));

            return retobj;
        },

        /**
         * Sends a XMLHttpRequest using jQuery ajax
         *
         * @param fnSuccess
         * @param fnError
         * @param context
         * @param soapxml
         * @param async
         * @private
         */
        xmlHttpRequest: function (fnSuccess, fnError, context, soapxml, async) {

            if (async === undefined) {
                async = true;
            }

            $.ajax({
                type: "POST",
                url: this.url,
                async: async,
                data: soapxml,
                contentType: "text/xml",
                dataType: "xml",
                success: fnSuccess,
                error: fnError,
                context: context,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("SOAPAction", "");
                }
            });
        },

        /**
         * Generates the SOAP envelope for given header and body
         *
         * @param header
         * @param body
         * @returns {*}
         * @private
         */
        generateSoapEnv: function (header, body) {
            return this.x2js.json2xml_str({
                Envelope: {
                    __prefix: 'soapenv',
                    '_xmlns:soapenv': "http://schemas.xmlsoap.org/soap/envelope/",
                    '_xmlns:urn': "urn:core_v2.agent.api.five9.com",
                    'soapenv:Header': header,
                    'soapenv:Body': body
                }
            });
        },

        /**
         *  Performs recursive parameter type replacement in a JSON object
         *
         * @param parameters
         * @param response
         * @returns {*}
         * @private
         */
        convertTypes: function (parameters, response) {
            var me = this;

            if (!(parameters instanceof Array)) return response;

            $.each(parameters, function (index, element) {
                if (typeof element === 'object') {
                    // handle typed parameters
                    var key = element.key;         // object key, the JSON key name
                    var type = element.type;       // object type, primative or class
                    var isarray = element.isarray; // boolean flag, return an array
                    var values;                    // temp response array

                    if (!!response && key in response) {
                        if (type instanceof Array) {
                            // custom types (array)
                            values = me.x2js.asArray(response[key]);
                            $.each(values, function (index, element) {
                                values[index] = me.convertTypes(type, element);
                            });
                            response[key] = (isarray ? values : values[0]); // single value
                        } else {
                            // primitive types (string)
                            var fn;
                            switch (type) {
                                case 'boolean':
                                    fn = function (v) {
                                        return me.convertToBoolean(v);
                                    };
                                    break;
                                case 'long': // long data type: non-id will not exceed MAX_SAFE_INTEGER
                                case 'int':
                                    fn = function (v) {
                                        return parseInt(v, 10);
                                    };
                                    break;
                                case 'double':
                                case 'float':
                                    fn = function (v) {
                                        return parseFloat(v);
                                    };
                                    break;
                                case 'long_id': // long data type: id as string due to precision
                                case 'string':
                                    // nothing to do, already a string
                                    break;
                                case 'flags':
                                    // special type for Java long bitmapped flags
                                    fn = function (v) {
                                        return new Flags(v);
                                    };
                                    break;
                                default:
                                    // unknown type parameter
                                    break;
                            }
                            if (fn instanceof Function) {
                                values = me.x2js.asArray(response[key]);
                                $.each(values, function (index, element) {
                                    values[index] = fn.call(me, element);
                                });
                                response[key] = (isarray ? values : values[0]); // single value}
                            }
                        }
                    } else {
                        // key !exist in response
                        if (isarray) {
                            // handle case for empty response array to fix issue
                            // with undefined array.length references
                            response[key] = [ ];
                        }
                    }
                }
            });
            return response;
        },

        /**
         * Convert boolean string or number to boolean type
         *
         * @param obj The boolean string value to test
         * @returns {Boolean|boolean}
         * @private
         */
        convertToBoolean: function (obj) {
            if (typeof obj === 'boolean') {
                return obj;
            } else if (typeof obj === 'number') {
                return !!obj;
            } else if (typeof obj === 'string') {
                return (obj.toLowerCase() === 'true');
            } else {
                return false;
            }
        },

        /**
         * Initializes Five9CTI and adds CTI WS API listener
         */
        connect: function () {
            if (this.DEBUG_LOG) console.log("+++Five9CTI.connect");

            if (!!this.listenerId) {
                if (this.DEBUG_LOG) console.log("---Five9CTI.connect: connected");
                return;
            }

            var listenername = "Five9CTI-" + new Date().getTime();
            // handle stateless model
            if (!!this.USE_STATELESS_MODEL) {
                listenername = "StatelessOpenCTIMain_" + listenername;
            }

            this.xmlHttpRequest(
                function (data) {
                    if (this.DEBUG_LOG) console.log("+++Five9CTI.connect success");

                    var jsonResp = this.x2js.xml2json(data);
                    this.listenerId = jsonResp['Envelope']['Body']['addListenerResponse']['return'];
                    this.Connected = true;
                    this.notifyCTIEventListeners('connected', null);
                    this._scheduleCheckEvent();

                    if (this.DEBUG_LOG) console.log("---Five9CTI.connect: listenerId: " + this.listenerId);
                },
                function (jqXHR, status, error) {
                    if (this.DEBUG_LOG) console.log("+++Five9CTI.connect: status: " + status + " error: " + error);

                    this.listenerId = undefined;
                    this.Connected = false;
                    this.notifyCTIEventListeners('disconnected', null);

                    var me = this;
                    setTimeout(function () {
                        me.connect();
                    }, 5000);

                    if (this.DEBUG_LOG) console.log("---Five9CTI.connect error");
                },
                this,
                this.getAddListenerSoapEnv(listenername),
                true);

            if (this.DEBUG_LOG) console.log("---Five9CTI.connect");
        },

        /**
         * Disconnects from CTI WS, removes listener
         */
        disconnect: function () {
            if (this.DEBUG_LOG) console.log("+++Five9CTI.disconnect");

            if (!this.listenerId) {
                if (this.DEBUG_LOG) console.log("---Five9CTI.disconnect: disconnected");
                return;
            }

            this.xmlHttpRequest(
                function (data, status, jqXHR) {
                    if (this.DEBUG_LOG) console.log("+++Five9CTI.disconnect success");

                    this.listenerId = undefined;
                    this.Connected = false;
                    this.notifyCTIEventListeners('disconnected', null);

                    if (this.DEBUG_LOG) console.log("---Five9CTI.disconnect success");
                },
                function (jqXHR, status, error) {
                    if (this.DEBUG_LOG) console.log("+++Five9CTI.disconnect: status: " + status + " error: " + error);
                    if (this.DEBUG_LOG) console.log("---Five9CTI.disconnect error");
                },
                this,
                this.getRemoveListenerSoapEnv(this.listenerId),
                true);

            if (this.DEBUG_LOG) console.log("---Five9CTI.disconnect");
        },

        _scheduleCheckEvent: function () {
            var me = this;
            setTimeout(function () {
                try {
                    me._doCheckEvent();
                } catch (e) {
                    console.warn('Five9CTI.scheduleCheckEvent error: ' + e);
                }
            }, 10);
        },

        _doCheckEvent: function () {
            if (!this.listenerId) {
                console.log("Five9CTI.doCheckEvent: listener exiting");
                return;
            }

            this.xmlHttpRequest(
                function (data, status, jqXHR) {
                    try {
                        var jsonResp = this.x2js.xml2json(data);
                        var ctiEvent = jsonResp['Envelope']['Body']['checkEventResponse']['return'];
                        var eventName = ctiEvent['_xsi:type'].substring(4); // drop ns4: prefix

                        if (eventName !== 'timeout') {
                            var parameters = this.eventTypes[eventName];
                            if (parameters instanceof Array) {
                                // handle typed parameters
                                ctiEvent = this.convertTypes(parameters, ctiEvent);
                            }
                            if (this.DEBUG_LOG) console.log("Five9CTI.doCheckEvent: " + eventName + ' - ' + JSON.stringify(ctiEvent));
                            this.notifyCTIEventListeners(eventName, ctiEvent);
                        }
                    } catch (e) {
                        console.error('Five9CTI.doCheckEvent status: ' + status + ' error: ' + e);
                    } finally {
                        this._scheduleCheckEvent();
                    }
                },
                function (jqXHR, status, e) {
                    if (this.DEBUG_LOG) console.log("+++Five9CTI.doCheckEvent error");

                    console.error("ctiEvent >> status: " + status + ' error: ' + e);

                    var wasConnected = this.Connected;
                    this.listenerId = undefined;
                    this.Connected = false;
                    this.notifyCTIEventListeners('disconnected', null);

                    if (wasConnected) {
                        var me = this;
                        setTimeout(function () {
                            me.connect();
                        }, 5000);
                    }
                    if (this.DEBUG_LOG) console.log("---Five9CTI.doCheckEvent error");
                },
                this,
                this.getCheckEventSoapEnv(this.listenerId, 5000),
                true);
        },

        /*
         Private CTI Requests (used internally by Five9CTI)
         */

        /**
         * Generates addListener SOAP Envelope
         * @param name
         * @returns {*}
         * @private
         */
        getAddListenerSoapEnv: function (name) {
            return this.generateSoapEnv(null, {
                addListener: {
                    __prefix: 'urn',
                    name: name
                }
            });
        },

        /**
         * Generates removeListener SOAP Envelope
         * @param listenerId
         * @returns {*}
         * @private
         */
        getRemoveListenerSoapEnv: function (listenerId) {
            return this.generateSoapEnv(null, {
                removeListener: {
                    __prefix: 'urn',
                    listenerId: listenerId
                }
            });
        },

        /**
         * Generates checkEvent SOAP Envelope
         * @param listenerId
         * @param timeout
         * @returns {*}
         * @private
         */
        getCheckEventSoapEnv: function (listenerId, timeout) {
            return this.generateSoapEnv(null, {
                checkEvent: {
                    __prefix: 'urn',
                    listenerId: listenerId,
                    timeout: timeout
                }
            });
        },

        /*
         Public CTI Requests
         */

        acceptChatRequest: function (chatId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                acceptChatRequest: {
                    __prefix: 'urn',
                    chatId: chatId
                }
            }));
        },

        acceptVoicemail: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                acceptVoicemail: {
                    __prefix: 'urn'
                }
            }));
        },

        acknowledgeNotice: function (noticeid, accept) {
            return this.syncRequest(this.generateSoapEnv(null, {
                acknowledgeNotice: {
                    __prefix: 'urn',
                    noticeid: noticeid,
                    accept: accept
                }
            }));
        },

        addCallback: function (number, duedate, comments) {
            return this.syncRequest(this.generateSoapEnv(null, {
                addCallback: {
                    __prefix: 'urn',
                    number: number,
                    duedate: duedate,
                    comments: comments
                }
            }));
        },

        addCallback2: function (number, duedate, comments, campaignId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                addCallback2: {
                    __prefix: 'urn',
                    number: number,
                    duedate: duedate,
                    comments: comments,
                    campaignId: campaignId
                }
            }));
        },

        addCallback3: function (number, duedate, comments, campaignId, associateCRMRecord) {
            return this.syncRequest(this.generateSoapEnv(null, {
                addCallback3: {
                    __prefix: 'urn',
                    number: number,
                    duedate: duedate,
                    comments: comments,
                    campaignId: campaignId,
                    associateCRMRecord: associateCRMRecord
                }
            }));
        },

        addNumberToDnc: function (number) {
            return this.syncRequest(this.generateSoapEnv(null, {
                addNumberToDnc: {
                    __prefix: 'urn',
                    number: number
                }
            }));
        },

        addToConference: function (callSessionId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                addToConference: {
                    __prefix: 'urn',
                    callSessionId: callSessionId
                }
            }));
        },

        answerLiveCallback: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                answerLiveCallback: {
                    __prefix: 'urn'
                }
            }));
        },

        cachedLogin: function (password) {
            return this.syncRequest(this.generateSoapEnv(null, {
                cachedLogin: {
                    __prefix: 'urn',
                    password: password
                }
            }));
        },

        cancelConference: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                cancelConference: {
                    __prefix: 'urn'
                }
            }));
        },

        cancelDownloadSkillPrompt: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                cancelDownloadSkillPrompt: {
                    __prefix: 'urn'
                }
            }));
        },

        cancelTransfer: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                cancelTransfer: {
                    __prefix: 'urn'
                }
            }));
        },

        changePassword: function (newPassword) {
            return this.syncRequest(this.generateSoapEnv(null, {
                changePassword: {
                    __prefix: 'urn',
                    newPassword: newPassword
                }
            }));
        },

        checkAndFilterCallback: function (number) {
            return this.syncRequest(this.generateSoapEnv(null, {
                checkAndFilterCallback: {
                    __prefix: 'urn',
                    number: number
                }
            }));
        },

        checkCanCreateConferenceWith: function (type) {
            return this.syncRequest(this.generateSoapEnv(null, {
                checkCanCreateConferenceWith: {
                    __prefix: 'urn',
                    type: type
                }
            }));
        },

        checkCanMakeCallsTo: function (type) {
            return this.syncRequest(this.generateSoapEnv(null, {
                checkCanMakeCallsTo: {
                    __prefix: 'urn',
                    type: type
                }
            }));
        },

        checkCanTransferTo: function (type) {
            return this.syncRequest(this.generateSoapEnv(null, {
                checkCanTransferTo: {
                    __prefix: 'urn',
                    type: type
                }
            }));
        },

        checkLocalTime: function (initial) {
            return this.syncRequest(this.generateSoapEnv(null, {
                checkLocalTime: {
                    __prefix: 'urn',
                    initial: initial
                }
            }));
        },

        completeConference: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                completeConference: {
                    __prefix: 'urn'
                }
            }));
        },

        completeTransfer: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                completeTransfer: {
                    __prefix: 'urn'
                }
            }));
        },

        conferenceIn: function (numberToConference, isWarmTransfer, checkDnc) {
            return this.syncRequest(this.generateSoapEnv(null, {
                conferenceIn: {
                    __prefix: 'urn',
                    numberToConference: numberToConference,
                    isWarmTransfer: isWarmTransfer,
                    checkDnc: checkDnc
                }
            }));
        },

        continuePreview: function (dispositionId, dialAgain) {
            return this.syncRequest(this.generateSoapEnv(null, {
                continuePreview: {
                    __prefix: 'urn',
                    dispositionId: dispositionId,
                    dialAgain: dialAgain
                }
            }));
        },

        createChat: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                createChat: {
                    __prefix: 'urn'
                }
            }));
        },

        createChatSession: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                createChatSession: {
                    __prefix: 'urn'
                }
            }));
        },

        deleteVoicemail: function (comments) {
            return this.syncRequest(this.generateSoapEnv(null, {
                deleteVoicemail: {
                    __prefix: 'urn',
                    comments: comments
                }
            }));
        },

        disconnectCall: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                disconnectCall: {
                    __prefix: 'urn'
                }
            }));
        },

        disconnectParkedcalls: function (callSessionId, silent) {
            return this.syncRequest(this.generateSoapEnv(null, {
                disconnectParkedcalls: {
                    __prefix: 'urn',
                    callSessionId: callSessionId,
                    silent: silent
                }
            }));
        },

        dismissCallback: function (callbackId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                dismissCallback: {
                    __prefix: 'urn',
                    id: callbackId
                }
            }));
        },

        endChat: function (chatId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                endChat: {
                    __prefix: 'urn',
                    chatId: chatId
                }
            }));
        },

        endPreviewCall: function (dispositionId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                endPreviewCall: {
                    __prefix: 'urn',
                    dispositionId: dispositionId
                }
            }));
        },

        exitChat: function (chatId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                exitChat: {
                    __prefix: 'urn',
                    chatId: chatId
                }
            }));
        },

        finishCall: function (disposition, comments) {
            return this.syncRequest(this.generateSoapEnv(null, {
                finishCall: {
                    __prefix: 'urn',
                    disposition: disposition,
                    comments: comments
                }
            }));
        },

        finishCall2: function (disposition, comments, timeout) {
            return this.syncRequest(this.generateSoapEnv(null, {
                finishCall2: {
                    __prefix: 'urn',
                    disposition: disposition,
                    comments: comments,
                    timeout: timeout
                }
            }));
        },

        getAddressType: function (number) {
            return this.syncRequest(this.generateSoapEnv(null, {
                getAddressType: {
                    __prefix: 'urn',
                    number: number
                }
            }));
        },

        getAgentInfo: function (agentId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                getAgentInfo: {
                    __prefix: 'urn',
                    agentId: agentId
                }
            }));
        },

        getAgentPermissions: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getAgentPermissions: {
                    __prefix: 'urn'
                }
            }));
        },

        getAgentStates: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getAgentStates: {
                    __prefix: 'urn'
                }
            }));
        },

        getAgentStateValues: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getAgentStateValues: {
                    __prefix: 'urn'
                }
            }));
        },

        getAllSkills: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getAllSkills: {
                    __prefix: 'urn'
                }
            }));
        },

        getAudioPlayerVolume: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getAudioPlayerVolume: {
                    __prefix: 'urn'
                }
            }));
        },

        getAvailableAgents: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getAvailableAgents: {
                    __prefix: 'urn'
                }
            }));
        },

        getAvailableCampaigns: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getAvailableCampaigns: {
                    __prefix: 'urn'
                }
            }));
        },

        getAvailableSkills: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getAvailableSkills: {
                    __prefix: 'urn'
                }
            }));
        },

        getCallAttachedVariables: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCallAttachedVariables: {
                    __prefix: 'urn'
                }
            }));
        },

        getCallbacks: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCallbacks: {
                    __prefix: 'urn'
                }
            }));
        },

        getCampaignDispositions: function (campaignId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCampaignDispositions: {
                    __prefix: 'urn',
                    campaignId: campaignId
                }
            }));
        },

        getCampaignDispositions2: function (campaignId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCampaignDispositions2: {
                    __prefix: 'urn',
                    campaignId: campaignId
                }
            }));
        },

        getCampaignInfo: function (campaignId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCampaignInfo: {
                    __prefix: 'urn',
                    campaignId: campaignId
                }
            }));
        },

        getCampaigns: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCampaigns: {
                    __prefix: 'urn'
                }
            }));
        },

        getCAVFieldViews: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCAVFieldViews: {
                    __prefix: 'urn'
                }
            }));
        },

        getCrmFieldDataTypes: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCrmFieldDataTypes: {
                    __prefix: 'urn'
                }
            }));
        },

        getCRMForCallbackId: function (callbackId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCRMForCallbackId: {
                    __prefix: 'urn',
                    id: callbackId
                }
            }));
        },

        getCRMMap: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCRMMap: {
                    __prefix: 'urn'
                }
            }));
        },

        getCurrentWebserver: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getCurrentWebserver: {
                    __prefix: 'urn'
                }
            }));
        },

        getDispositionsInfo: function (campaignId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                getDispositionsInfo: {
                    __prefix: 'urn',
                    campaignId: campaignId
                }
            }));
        },

        getForceCavView: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getForceCavView: {
                    __prefix: 'urn'
                }
            }));
        },

        getLoggedUsers: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getLoggedUsers: {
                    __prefix: 'urn'
                }
            }));
        },

        getManualCallsConfig: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getManualCallsConfig: {
                    __prefix: 'urn'
                }
            }));
        },

        getNotReadyReasonCodes: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getNotReadyReasonCodes: {
                    __prefix: 'urn'
                }
            }));
        },

        getOption: function (option) {
            return this.syncRequest(this.generateSoapEnv(null, {
                getOption: {
                    __prefix: 'urn',
                    option: option
                }
            }));
        },

        getPreviewSkipDispositions: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getPreviewSkipDispositions: {
                    __prefix: 'urn'
                }
            }));
        },

        getPreviewSkipDispositions2: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getPreviewSkipDispositions2: {
                    __prefix: 'urn'
                }
            }));
        },

        getReasonCodes: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getReasonCodes: {
                    __prefix: 'urn'
                }
            }));
        },

        getSelfInfo: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSelfInfo: {
                    __prefix: 'urn'
                }
            }));
        },

        getSkillGroups: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSkillGroups: {
                    __prefix: 'urn'
                }
            }));
        },

        getSkillPrompts: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSkillPrompts: {
                    __prefix: 'urn'
                }
            }));
        },

        getSoftphoneAutoHungup: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSoftphoneAutoHungup: {
                    __prefix: 'urn'
                }
            }));
        },

        getSoftphoneDevices: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSoftphoneDevices: {
                    __prefix: 'urn'
                }
            }));
        },

        getSoftphoneInputDevices: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSoftphoneInputDevices: {
                    __prefix: 'urn'
                }
            }));
        },

        getSoftphoneMicrophoneAgc: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSoftphoneMicrophoneAgc: {
                    __prefix: 'urn'
                }
            }));
        },

        getSoftphoneMicrophoneLevel: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSoftphoneMicrophoneLevel: {
                    __prefix: 'urn'
                }
            }));
        },

        getSoftphoneOutputDevices: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSoftphoneOutputDevices: {
                    __prefix: 'urn'
                }
            }));
        },

        getSoftphoneSpeakerVolume: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSoftphoneSpeakerVolume: {
                    __prefix: 'urn'
                }
            }));
        },

        getSpeedDials: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getSpeedDials: {
                    __prefix: 'urn'
                }
            }));
        },

        getStatus: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getStatus: {
                    __prefix: 'urn'
                }
            }));
        },

        getUserDetails: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getUserDetails: {
                    __prefix: 'urn'
                }
            }));
        },

        getVersion: function (componentName) {
            return this.syncRequest(this.generateSoapEnv(null, {
                getVersion: {
                    __prefix: 'urn',
                    componentName: componentName
                }
            }));
        },

        getWorksheetAnswers: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                getWorksheetAnswers: {
                    __prefix: 'urn'
                }
            }));
        },

        hasWorksheet: function (campaignId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                hasWorksheet: {
                    __prefix: 'urn',
                    campaignId: campaignId
                }
            }));
        },

        inviteUserToChat: function (chatId, userInfo) {
            return this.syncRequest(this.generateSoapEnv(null, {
                inviteUserToChat: {
                    __prefix: 'urn',
                    chatId: chatId,
                    userInfo: {
                        id: userInfo.id,
                        name: userInfo.name,
                        role: userInfo.role,
                        uniqueId: userInfo.uniqueId
                    }
                }
            }));
        },

        isAddressValid: function (number) {
            return this.syncRequest(this.generateSoapEnv(null, {
                isAddressValid: {
                    __prefix: 'urn',
                    number: number
                }
            }));
        },

        isSoftphoneAnswerRequired: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                isSoftphoneAnswerRequired: {
                    __prefix: 'urn'
                }
            }));
        },

        isWorksheetComplete: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                isWorksheetComplete: {
                    __prefix: 'urn'
                }
            }));
        },

        kickUserFromChat: function (chatId, userInfo) {
            return this.syncRequest(this.generateSoapEnv(null, {
                kickUserFromChat: {
                    __prefix: 'urn',
                    chatId: chatId,
                    userInfo: {
                        id: userInfo.id,
                        name: userInfo.name,
                        role: userInfo.role,
                        uniqueId: userInfo.uniqueId
                    }
                }
            }));
        },

        leaveConference: function (dispositionId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                leaveConference: {
                    __prefix: 'urn',
                    dispositionId: dispositionId
                }
            }));
        },

        leaveConference2: function (dispositionId, redialTimeout) {
            return this.syncRequest(this.generateSoapEnv(null, {
                leaveConference2: {
                    __prefix: 'urn',
                    dispositionId: dispositionId,
                    redialTimeout: redialTimeout
                }
            }));
        },

        leaveConference3: function (dispositionId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                leaveConference3: {
                    __prefix: 'urn',
                    dispositionId: dispositionId
                }
            }));
        },

        login: function (userName, password, stationId, stationType) {
            return this.syncRequest(this.generateSoapEnv(null, {
                login: {
                    __prefix: 'urn',
                    userName: userName,
                    password: password,
                    stationId: stationId,
                    stationType: stationType
                }
            }));
        },

        loginAsync: function (userName, password, stationId, stationType) {
            return this.syncRequest(this.generateSoapEnv(null, {
                loginAsync: {
                    __prefix: 'urn',
                    userName: userName,
                    password: password,
                    stationId: stationId,
                    stationType: stationType
                }
            }));
        },

        loginAsync2: function (userName, password, stationId, stationType, force) {
            return this.syncRequest(this.generateSoapEnv(null, {
                loginAsync2: {
                    __prefix: 'urn',
                    userName: userName,
                    password: password,
                    stationId: stationId,
                    stationType: stationType,
                    force: force
                }
            }));
        },

        loginAsync3: function (userName, password, stationId, stationType, force, integrationType) {
            return this.syncRequest(this.generateSoapEnv(null, {
                loginAsync3: {
                    __prefix: 'urn',
                    userName: userName,
                    password: password,
                    stationId: stationId,
                    stationType: stationType,
                    force: force,
                    integrationType: integrationType
                }
            }));
        },

        logout: function (reasonId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                logout: {
                    __prefix: 'urn',
                    reasonId: reasonId
                }
            }));
        },

        logoutAndExit: function (reasonId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                logoutAndExit: {
                    __prefix: 'urn',
                    reasonId: reasonId
                }
            }));
        },

        makeAnswerOnHungup: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                makeAnswerOnHungup: {
                    __prefix: 'urn'
                }
            }));
        },

        makeCall: function (number, campaignId, checkDnc, callbackId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                makeCall: {
                    __prefix: 'urn',
                    number: number,
                    campaignId: campaignId,
                    checkDnc: checkDnc,
                    callbackId: callbackId
                }
            }));
        },

        makePreviewCall: function (number) {
            return this.syncRequest(this.generateSoapEnv(null, {
                makePreviewCall: {
                    __prefix: 'urn',
                    number: number
                }
            }));
        },

        makeTestCall: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                makeTestCall: {
                    __prefix: 'urn'
                }
            }));
        },

        openBrowser: function (url) {
            return this.syncRequest(this.generateSoapEnv(null, {
                openBrowser: {
                    __prefix: 'urn',
                    url: url
                }
            }));
        },

        parkCall: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                parkCall: {
                    __prefix: 'urn'
                }
            }));
        },

        parkConferenceParticipant: function (callSessionId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                parkConferenceParticipant: {
                    __prefix: 'urn',
                    callSessionId: callSessionId
                }
            }));
        },

        pauseAudioPlaying: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                pauseAudioPlaying: {
                    __prefix: 'urn'
                }
            }));
        },

        pauseSkillPrompt: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                pauseSkillPrompt: {
                    __prefix: 'urn'
                }
            }));
        },

        playFile: function (filename) {
            return this.syncRequest(this.generateSoapEnv(null, {
                playFile: {
                    __prefix: 'urn',
                    filename: filename
                }
            }));
        },

        playRecording: function (voicemailId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                playRecording: {
                    __prefix: 'urn',
                    voicemailId: voicemailId
                }
            }));
        },

        playSkillPrompt: function (id) {
            return this.syncRequest(this.generateSoapEnv(null, {
                playSkillPrompt: {
                    __prefix: 'urn',
                    id: id
                }
            }));
        },

        playVoicemail: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                playVoicemail: {
                    __prefix: 'urn'
                }
            }));
        },

        processChatInvite: function (chatId, accept) {
            return this.syncRequest(this.generateSoapEnv(null, {
                processChatInvite: {
                    __prefix: 'urn',
                    chatId: chatId,
                    accept: accept
                }
            }));
        },

        processConnector: function (campaignId, connectorId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                processConnector: {
                    __prefix: 'urn',
                    campaignId: campaignId,
                    connectorId: connectorId
                }
            }));
        },

        processVoicemail: function (comments) {
            return this.syncRequest(this.generateSoapEnv(null, {
                processVoicemail: {
                    __prefix: 'urn',
                    comments: comments
                }
            }));
        },

        reconnect: function (forced) {
            return this.syncRequest(this.generateSoapEnv(null, {
                reconnect: {
                    __prefix: 'urn',
                    forced: forced
                }
            }));
        },

        recordCall: function (flag) {
            return this.syncRequest(this.generateSoapEnv(null, {
                recordCall: {
                    __prefix: 'urn',
                    flag: flag
                }
            }));
        },

        rejectCall: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                rejectCall: {
                    __prefix: 'urn'
                }
            }));
        },

        rejectLiveCallback: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                rejectLiveCallback: {
                    __prefix: 'urn'
                }
            }));
        },

        rejectVoicemail: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                rejectVoicemail: {
                    __prefix: 'urn'
                }
            }));
        },

        removeCallback: function (callbackId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                removeCallback: {
                    __prefix: 'urn',
                    id: callbackId
                }
            }));
        },

        removeConferenceParticipant: function (callSessionId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                removeConferenceParticipant: {
                    __prefix: 'urn',
                    callSessionId: callSessionId
                }
            }));
        },

        removeRecording: function (voicemailId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                removeRecording: {
                    __prefix: 'urn',
                    voicemailId: voicemailId
                }
            }));
        },

        renewPreviewCall: function (dispositionId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                renewPreviewCall: {
                    __prefix: 'urn',
                    dispositionId: dispositionId
                }
            }));
        },

        requestConnectors: function (campaignId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                requestConnectors: {
                    __prefix: 'urn',
                    campaignId: campaignId
                }
            }));
        },

        requestHelpChat: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                requestHelpChat: {
                    __prefix: 'urn'
                }
            }));
        },

        requestRecordings: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                requestRecordings: {
                    __prefix: 'urn'
                }
            }));
        },

        requestScript: function (campaignId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                requestScript: {
                    __prefix: 'urn',
                    campaignId: campaignId
                }
            }));
        },

        requestWorksheet: function (campaignId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                requestWorksheet: {
                    __prefix: 'urn',
                    campaignId: campaignId
                }
            }));
        },

        resetGreeting: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                resetGreeting: {
                    __prefix: 'urn'
                }
            }));
        },

        resetRemindedCallback: function (callbackId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                resetRemindedCallback: {
                    __prefix: 'urn',
                    id: callbackId
                }
            }));
        },

        restartStation: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                restartStation: {
                    __prefix: 'urn'
                }
            }));
        },

        resumeAudioPlaying: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                resumeAudioPlaying: {
                    __prefix: 'urn'
                }
            }));
        },

        retrieveCall: function (callSessionId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                retrieveCall: {
                    __prefix: 'urn',
                    callSessionId: callSessionId
                }
            }));
        },

        runVoiceConnectivityTest: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                runVoiceConnectivityTest: {
                    __prefix: 'urn'
                }
            }));
        },

        saveRecording: function (voicemailId, path) {
            return this.syncRequest(this.generateSoapEnv(null, {
                saveRecording: {
                    __prefix: 'urn',
                    voicemailId: voicemailId,
                    path: path
                }
            }));
        },

        saveVoicemail: function (path) {
            return this.syncRequest(this.generateSoapEnv(null, {
                saveVoicemail: {
                    __prefix: 'urn',
                    path: path
                }
            }));
        },

        saveWorksheetAnswers: function (values) {
            return this.syncRequest(this.generateSoapEnv(null, {
                saveWorksheetAnswers: {
                    __prefix: 'urn',
                    values: values
                }
            }));
        },

        sendBroadcastMessage: function (message) {
            return this.syncRequest(this.generateSoapEnv(null, {
                sendBroadcastMessage: {
                    __prefix: 'urn',
                    message: message
                }
            }));
        },

        sendChatMessage: function (chatId, message) {
            return this.syncRequest(this.generateSoapEnv(null, {
                sendChatMessage: {
                    __prefix: 'urn',
                    chatId: chatId,
                    message: message
                }
            }));
        },

        sendDTMF: function (digit) {
            return this.syncRequest(this.generateSoapEnv(null, {
                sendDTMF: {
                    __prefix: 'urn',
                    digit: digit
                }
            }));
        },

        sendHttpServerMessage: function (message) {
            return this.syncRequest(this.generateSoapEnv(null, {
                sendHttpServerMessage: {
                    __prefix: 'urn',
                    message: message
                }
            }));
        },

        sendSkillBroadcastMessage: function (skill, message) {
            return this.syncRequest(this.generateSoapEnv(null, {
                sendSkillBroadcastMessage: {
                    __prefix: 'urn',
                    skill: {
                        id: skill.id,
                        name: skill.name,
                        role: skill.role,
                        uniqueId: skill.uniqueId
                    },
                    message: message
                }
            }));
        },

        sendUserMessage: function (user, message) {
            return this.syncRequest(this.generateSoapEnv(null, {
                sendUserMessage: {
                    __prefix: 'urn',
                    user: {
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        uniqueId: user.uniqueId
                    },
                    message: message
                }
            }));
        },

        setActiveSkills: function (skills) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setActiveSkills: {
                    __prefix: 'urn',
                    skills: skills
                }
            }));
        },

        setAudioPlayerVolume: function (volume) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setAudioPlayerVolume: {
                    __prefix: 'urn',
                    volume: volume
                }
            }));
        },

        setAudioPlayingPosition: function (position) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setAudioPlayingPosition: {
                    __prefix: 'urn',
                    position: position
                }
            }));
        },

        setCallAttachedVariable: function (id, value) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setCallAttachedVariable: {
                    __prefix: 'urn',
                    id: id,
                    value: value
                }
            }));
        },

        setMute: function (mute) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setMute: {
                    __prefix: 'urn',
                    mute: mute
                }
            }));
        },

        setNotReadyState: function (reasonId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setNotReadyState: {
                    __prefix: 'urn',
                    reasonId: reasonId
                }
            }));
        },

        setOption: function (option, value) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setOption: {
                    __prefix: 'urn',
                    option: option,
                    value: value
                }
            }));
        },

        setReadyState: function (stateId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setReadyState: {
                    __prefix: 'urn',
                    stateId: stateId
                }
            }));
        },

        setSoftphoneAutoHungup: function (value) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setSoftphoneAutoHungup: {
                    __prefix: 'urn',
                    value: value
                }
            }));
        },

        setSoftphoneDevices: function (ringDevice, speakerDevice, microphoneDevice, micAgc) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setSoftphoneDevices: {
                    __prefix: 'urn',
                    ringDevice: ringDevice,
                    speakerDevice: speakerDevice,
                    microphoneDevice: microphoneDevice,
                    micAgc: micAgc
                }
            }));
        },

        setSoftphoneMicrophoneAgc: function (agc) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setSoftphoneMicrophoneAgc: {
                    __prefix: 'urn',
                    agc: agc
                }
            }));
        },

        setSoftphoneMicrophoneLevel: function (level) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setSoftphoneMicrophoneLevel: {
                    __prefix: 'urn',
                    level: level
                }
            }));
        },

        setSoftphoneSpeakerVolume: function (volume) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setSoftphoneSpeakerVolume: {
                    __prefix: 'urn',
                    volume: volume
                }
            }));
        },

        skipPreviewCall: function (dispositionId) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setSkipPreviewCall: {
                    __prefix: 'urn',
                    dispositionId: dispositionId
                }
            }));
        },

        skipPreviewCall2: function (dispositionId, timeout) {
            return this.syncRequest(this.generateSoapEnv(null, {
                setSkipPreviewCall2: {
                    __prefix: 'urn',
                    dispositionId: dispositionId,
                    timeout: timeout
                }
            }));
        },

        snoozeCallback: function (callbackId, time) {
            return this.syncRequest(this.generateSoapEnv(null, {
                snoozeCallback: {
                    __prefix: 'urn',
                    id: callbackId,
                    time: time
                }
            }));
        },

        softphoneHangupPhone: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                softphoneHangupPhone: {
                    __prefix: 'urn'
                }
            }));
        },

        softphonePickupPhone: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                softphonePickupPhone: {
                    __prefix: 'urn'
                }
            }));
        },

        startClick2Dial: function (arg0) {
            return this.syncRequest(this.generateSoapEnv(null, {
                startClick2Dial: {
                    __prefix: 'urn',
                    arg0: arg0
                }
            }));
        },

        startDownloadSkillPrompt: function (id) {
            return this.syncRequest(this.generateSoapEnv(null, {
                startDownloadSkillPrompt: {
                    __prefix: 'urn',
                    id: id
                }
            }));
        },

        stopAudioPlaying: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                stopAudioPlaying: {
                    __prefix: 'urn'
                }
            }));
        },

        stopPlayingRecording: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                stopPlayingRecording: {
                    __prefix: 'urn'
                }
            }));
        },

        stopSkillPrompt: function () {
            return this.syncRequest(this.generateSoapEnv(null, {
                stopSkillPrompt: {
                    __prefix: 'urn'
                }
            }));
        },

        toggleHold: function (flag) {
            return this.syncRequest(this.generateSoapEnv(null, {
                toggleHold: {
                    __prefix: 'urn',
                    flag: flag
                }
            }));
        },

        transferCall: function (callSessionId, number, timeout, dispositionId, warm, checkDnc) {
            return this.syncRequest(this.generateSoapEnv(null, {
                transferCall: {
                    __prefix: 'urn',
                    callSessionId: callSessionId,
                    number: number,
                    timeout: timeout,
                    dispositionId: dispositionId,
                    warm: warm,
                    checkDnc: checkDnc
                }
            }));
        },

        transferCall2: function (callSessionId, number, timeout, dispositionId, warm, redialTimeout) {
            return this.syncRequest(this.generateSoapEnv(null, {
                transferCall2: {
                    __prefix: 'urn',
                    callSessionId: callSessionId,
                    number: number,
                    timeout: timeout,
                    dispositionId: dispositionId,
                    warm: warm,
                    redialTimeout: redialTimeout
                }
            }));
        },

        transferVoicemail: function (number) {
            return this.syncRequest(this.generateSoapEnv(null, {
                transferVoicemail: {
                    __prefix: 'urn',
                    number: number
                }
            }));
        },

        updateCallback: function (info) {
            return this.syncRequest(this.generateSoapEnv(null, {
                updateCallback: {
                    __prefix: 'urn',
                    info: {
                        agent: info.agent,
                        CRMId: info.CRMId,
                        campaignId: info.campaignId,
                        comments: info.comments,
                        dueDate: info.dueDate,
                        flags: info.flags,
                        id: info.id,
                        number: info.number,
                        userGroup: info.userGroup
                    }
                }
            }));
        },

        updateWorksheetAnswers: function (id, answer) {
            return this.syncRequest(this.generateSoapEnv(null, {
                updateWorksheetAnswers: {
                    __prefix: 'urn',
                    id: id,
                    answer: answer
                }
            }));
        },

        uploadGreeting: function (arg0) {
            return this.syncRequest(this.generateSoapEnv(null, {
                uploadGreeting: {
                    __prefix: 'urn',
                    arg0: arg0
                }
            }));
        }
    };

    return cls;
})();

