import { LightningElement, wire, api } from 'lwc';
import getPartnerReviews from '@salesforce/apex/partnerReviewController.getPartnerReviews';
//import getAllPartnerReviews from '@salesforce/apex/partnerReviewController.getAllPartnerReviews';

import { NavigationMixin } from 'lightning/navigation';

// import publisher methods and message channels
import { MessageContext, subscribe, unsubscribe, APPLICATION_SCOPE } from 'lightning/messageService'

// import message channels
import PARTNER_CHANNEL from '@salesforce/messageChannel/PartnerAccountDataMessageChannel__c';


export default class ViewPartnerReview extends NavigationMixin(LightningElement) {

    
    subscription; // property to hold subscription
    partnerAccountId;
    channelname;
    partnerAccountName;
    AccountId ;//= '0011y00000WM2w7AAD' ;
    partnerAccountReviews = null;

    recordIndex = 0;
    partner; // variable to show partner review

    // Step 2: After import, make a wire call to populate message context
    @wire(MessageContext) // Will carry information about publisher & subscriber details
    messageContext;


   @wire(getPartnerReviews, {partnerAccountId: '$partnerAccountId'})
    processOutput ({error, data}) {
        console.log("AccountId::" + this.partnerAccountId);
        if (error) {
            // TODO: Error handling
            console.log('Error::' + error.body.message)
        } else if (data) {
            // TODO: Data handling
            this.partnerAccountReviews = data;
            console.log("Partner reviews::" + JSON.stringify(this.partnerAccountReviews)); 
            if(this.partnerReviewsFound)
            {
                this.getCurrentPartnerReview();
            }
        }
    }

    connectedCallback()
    {
        // subscribe to the channel only if it hasnt been done before
        if(this.subscription)
        {
            return;
        }

        this.subscription =
            subscribe(this.messageContext, PARTNER_CHANNEL, (message) => {this.processMessage(message)}, { scope: APPLICATION_SCOPE });



        

    }

    renderedCallback()
    {
        // Get Partner Reviews
        //this.getPartnerReviewsFromDB();
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }


    getPartnerReviewsFromDB()
    {
        getPartnerReviews({partnerAccountId: this.partnerAccountId})
        .then((result) => {
            this.partnerAccountReviews = result;
            if(this.partnerReviewsFound)
            {
                this.getCurrentPartnerReview();
            }
            console.log("Partner reviews::" + JSON.stringify(this.partnerAccountReviews)); 
        })
        .catch((error) => {
            console.log('Error::' + error.body.message)
        });

    }

    getCurrentPartnerReview()
    {
        this.partner = this.partnerAccountReviews[this.recordIndex];
    }


    navigateNextReview()
    {
        this.recordIndex++;
        this.getCurrentPartnerReview();
    }

    navigatepreviousReview()
    {
        this.recordIndex = this.recordIndex - 1;
        this.getCurrentPartnerReview();
    }


    processMessage(message)
    {

        // unpack the message and read the content
        this.partnerAccountId = message.selectedpartneraccountId;
        this.channelname  = message.name;
        this.partnerAccountName = message.selectedpartneraccountName;
       

    }

    

    get partnerReviewsFound()
    {
        if(this.partnerAccountReviews != null && this.partnerAccountReviews.length > 0){
            return true;
        }
        return false;
    }

    get IsPartnerSelected()
    {
        if(this.partnerAccountId ==null || this.partnerAccountId.length === 0)
        {
            return false;
        }
        return true;
    }

     // Navigation to Custom Tab
     addReview() {

        this[ NavigationMixin.Navigate ]( {
            type: 'standard__webPage',
            attributes: {
                url: '/flow/Rate_Partner_Performance?partnerAccountId=' + this.partnerAccountId                
            }
        },
        false // Replaces the current page in your browser history with the URL if set to true
        );
    }


}