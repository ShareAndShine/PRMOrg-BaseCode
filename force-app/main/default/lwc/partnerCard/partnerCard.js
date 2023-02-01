import { LightningElement, api, wire } from 'lwc';

// Step 1: Message channels > Get imports done
// import message channels
import PARTNER_CHANNEL from '@salesforce/messageChannel/PartnerAccountDataMessageChannel__c';

import OPP_CHANNEL from '@salesforce/messageChannel/OppDataMessageChannel__c';


// import default functions to publish & subscribe message channels
import { publish, subscribe, MessageContext } from 'lightning/messageService';


export default class PartnerCard extends LightningElement {

    // Exposing a public property 
    @api partnerProfile;

    userImg;
    partnerTheme;
    partnerTitleTheme; 


    // Step 2: Message channels > Get imports done >  make a wire call and get MessageContext populated with publisher details
    @wire(MessageContext) // will carry info abt publisher and subscriber
    messageContext;


    connectedCallback() {
        this.getUserImage(this.partnerProfile.Partner_Primary_POC__r.Salutation);
        this.getPartnerTheme(this.partnerProfile.Partner_Type_Lookup__r.Name);
    }

    getUserImage(title) {
        const randomId = Math.floor(Math.random() * 100);

        switch (title) {
            case 'Mr.':
                this.userImg = `https://randomuser.me/api/portraits/med/men/${randomId}.jpg`;
                break;
            case 'Ms.':
                this.userImg = `https://randomuser.me/api/portraits/med/women/${randomId}.jpg`
                break;
            default:
                this.userImg = 'https://www.lightningdesignsystem.com/assets/images/avatar2.jpg'
                break;
        }
    }

    getPartnerTheme(PartnerType) {
        switch (PartnerType) {
            case "Technology Partner":
                this.partnerTheme = 'slds-theme_success pointer';
                this.partnerTitleTheme = 'slds-align_absolute-center title'

                break;
            case "Marketing Partner":
                this.partnerTheme = 'slds-theme_info pointer';
                this.partnerTitleTheme = 'titleStyleForMarketingPartner slds-align_absolute-center title'
                break;
            case "Affiliates":
                this.partnerTheme = 'slds-theme_warning pointer';
                this.partnerTitleTheme = 'slds-align_absolute-center title'

                break;
            case "Client Advocates":
                this.partnerTheme = 'slds-theme_error pointer';
                this.partnerTitleTheme = 'slds-align_absolute-center title'

                break;
            default:
                this.partnerTheme = 'slds-theme_offline pointer';
                this.partnerTitleTheme = 'slds-align_absolute-center title'

                break;
        }
    }


    handleSelectedPartnerClick(event)
    {
        const partnerAccountId = this.partnerProfile.Id; // read partner account id from partner profile


        // Step 3: Message channels > Get imports done >  make a wire call and get MessageContext populated with publisher details >> unpack msg channel and add data into it

        const msgToPublish = {

            name:"Partner Account",
            selectedpartneraccountId:partnerAccountId,
            selectedpartneraccountName: this.partnerProfile.Name
        };

        //publish
        publish(this.messageContext, PARTNER_CHANNEL,msgToPublish);


        const msgOppToPublish = {

            oppName:"Opportuntity data",
            oppId:'0x1111',
            oppStage: 'Closed-won'
        };

        //publish
        publish(this.messageContext, OPP_CHANNEL,msgOppToPublish);


    }






}