import { LightningElement, wire } from 'lwc';

// step 1: Import all the fields needed to show on the screen
import PARTNER_NAME from '@salesforce/schema/Account.Name';
import PARTNER_CON_STARTDATE from '@salesforce/schema/Account.Partner_Contract_Start_Date__c';
import PARTNER_CON_ENDDATE from '@salesforce/schema/Account.Partner_Contract_End_Date__c';
import PARTNER_POC_NAME from '@salesforce/schema/Account.Partner_Primary_POC__c';

import partnerbudget from '@salesforce/schema/Account.Partner_Budget__c';
import partnerTrainned from '@salesforce/schema/Account.Number_of_trained_Partner_contacts__c';
import partneractivepipeline from '@salesforce/schema/Account.Partner_Active_Pipeline_Value__c';
import PartnerTotalSales from '@salesforce/schema/Account.Partner_Total_Sales_Revenue__c';
import PARTNER_Lat from '@salesforce/schema/Account.Partner_Geo_Location__Latitude__s';
import PARTNER_Lon from '@salesforce/schema/Account.Partner_Geo_Location__Longitude__s';


import {NavigationMixin } from 'lightning/navigation';


// Step 1: Message channels > Get imports done
// import message channels
import PARTNER_CHANNEL from '@salesforce/messageChannel/PartnerAccountDataMessageChannel__c';

// import default functions to publish & subscribe message channels
import { publish, subscribe, MessageContext, unsubscribe } from 'lightning/messageService';




export default class PartnerDetail extends NavigationMixin(LightningElement) {

    objectApiName = 'Account';
    //recordId = '0015j00000wgxP7AAI';

    showReviews = false;

    subscription; // to hold subscription value

    partnerAccountId; // to hold data from channel
    partnerAccountName; // to hold data from channel
    partnerChannelName; // to hold data from channel

     // Step 2: Message channels > Get imports done >  make a wire call and get MessageContext populated with publisher details
     @wire(MessageContext) // will carry info abt publisher and subscriber
     messageContext;

    // Step 2: Have a property to hold field value
    partner_Name = PARTNER_NAME;
    partner_ContractStartDate =  PARTNER_CON_STARTDATE;
    partner_ContractEndDate =  PARTNER_CON_ENDDATE;
    partner_POC = PARTNER_POC_NAME;
    partner_budget = partnerbudget;
    partner_Trainned = partnerTrainned;
    partner_activepipeline = partneractivepipeline;
    partner_totalSales= PartnerTotalSales;
    partner_lat = PARTNER_Lat;
    partner_long = PARTNER_Lon;


    OpenPartnerReviewFlow()
    {
        const inputParams = {
            type: 'standard__webPage',
            attributes: {
                url:'/flow/Rate_Partner_Performance?partnerAccountId=' + this.recordId
            }
        };

        this[NavigationMixin.Navigate](inputParams, false); // replace current page in the brower  with the URL if it is set to true
    }

    ShowContactLocation()
    {
        this.showReviews = true;
    }

    connectedCallback()
    {

        if(this.subscription)
            return;

        this.subscription = subscribe(this.messageContext,PARTNER_CHANNEL, (message) =>{ this.processMessageAndReadChannelData(message)});
    }

    processMessageAndReadChannelData(message)
    {
        this.partnerAccountId = message.selectedpartneraccountId;
        this.partnerAccountName = message.selectedpartneraccountName;
        this.partnerChannelName = message.name;
    }


    disconnectedCallback()
    {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    get IsPartnerSelected()
    {
        if(this.partnerAccountId == null  || this.partnerAccountId.length ===0)
        {
            return false;
        }
        return true;

    }


}