import { LightningElement, api, wire } from 'lwc';

// get leaflet accessed from static resource
import LEAFLET from '@salesforce/resourceUrl/leaflet'; 

// get load script and load style methods imported 
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

// use getRecord method to fetch a record's data from the Database
import { getRecord } from 'lightning/uiRecordApi'; // Step 1 : import getRecord 

export default class PartnerContactLocation extends LightningElement {

    leafletMap; 

    // enable public property so that partner account id will be received from partner Detail component 
    @api partnerAccountId;// = '0015j00000wgxP7AAI'; // TODO: Remove hard coding record ID value
    partnerDBResult;

    partnerPOCLocationLat;
    partnerPOCLocationLong;


    // Step 2 : import getRecord > use wire function and make a call to DB
    @wire(getRecord, {
        recordId: '$partnerAccountId',
        fields: ['Account.Name', 'Account.Partner_Geo_Location__Latitude__s', 'Account.Partner_Geo_Location__Longitude__s']
    })
    processWireOutput({data, error})
    {
        if(data)
        {
            this.partnerDBResult = data;
            console.log('this.partnerDBResult::' + JSON.stringify(this.partnerDBResult));

            // store values from DB to local properties
            this.partnerPOCLocationLat = this.partnerDBResult.fields.Partner_Geo_Location__Latitude__s.value;
            this.partnerPOCLocationLong = this.partnerDBResult.fields.Partner_Geo_Location__Longitude__s.value;

            console.log('Partner_Geo_Location__Latitude__s::' +   this.partnerPOCLocationLat);
            console.log('Partner_Geo_Location__Longitude__s::' +   this.partnerPOCLocationLong);
            

        }
        else if(error)
        {
            console.log('Error::' + e.body.message);
        }

    }

    connectedCallback()
    {

        // load both style and css from leaflet lib

        Promise.all([loadStyle(this, LEAFLET + '/leaflet.css'), loadScript(this, LEAFLET + '/leaflet.js')])
        .then(() => this.plotMap()) // on success
        .catch(() => { console.log('Libs did not load !!!')}); // on failure

        
    }


    plotMap()
    {
        console.log('Plot the map !!!');


      // find the div wherew we wanted to plot the map
        const map = this.template.querySelector('.map');

        if(map)
        {
            this.leafletMap = L.map(map, {zoomControl:true}).setView([51.505, -0.09], 13);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {attribution : 'Contact Location'}).addTo(this.leafletMap);

        }

        const location = [this.partnerPOCLocationLat, this.partnerPOCLocationLong];
        const leafletMarker = L.marker(location); // pin the location on the map
        leafletMarker.addTo(this.leafletMap);
        this.leafletMap.setView(location);
    }


}