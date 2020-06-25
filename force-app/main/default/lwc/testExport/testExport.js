import { LightningElement ,track} from 'lwc';
import getAccountList from '@salesforce/apex/getExport.getData';
import getList from '@salesforce/apex/getExport.getAllData';
const columns = [{
    label: 'Field 1',
    fieldName: 'field1__c',
    
},
{
    label: 'Field 2',
    fieldName: 'field2__c',
    
},
{
    label: 'Field 3',
    fieldName: 'field3__c',
    
},
{
    label: 'Status',
    fieldName: 'Status__c',
    wrapText: true
},
{
    label: 'Error',
    fieldName: 'Error__c',
    wrapText: true
},
];
export default class TestExport extends LightningElement {
    @track allData=[]
    @track showSpinner=true
    data = [];
    @track page = 1;
    perpage = 20;
    @track pages = [];
    set_size = 5;
    columns = columns
    renderedCallback() {
        this.renderButtons();
    }
    renderButtons = () => {
        this.template.querySelectorAll('button').forEach((but) => {
            but.style.backgroundColor = this.page === parseInt(but.dataset.id, 10) ? 'dodgerblue' : 'white';
            but.style.color = this.page === parseInt(but.dataset.id, 10) ? 'white' : 'black';
        });
    }
    get pagesList() {
        let mid = Math.floor(this.set_size / 2) + 1;
        if (this.page > mid) {
            return this.pages.slice(this.page - mid, this.page + mid - 1);
        }
        return this.pages.slice(0, this.set_size);
    }
    async connectedCallback() {
        this.data = await getAccountList();
        this.setPages(this.data);
        this.showSpinner=false
       // loadHandler()
        getList()
        .then(result=>{ 
            this.allData=result})  
    }
    /*loadHandler()
    {
        getList()
        .then(result=>{ 
            this.allData=result})     
    }*/
    pageData = () => {
        let page = this.page;
        let perpage = this.perpage;
        let startIndex = (page * perpage) - perpage;
        let endIndex = (page * perpage);
        return this.data.slice(startIndex, endIndex);
    }
    setPages = (data) => {
        let numberOfPages = Math.ceil(data.length / this.perpage);
        for (let index = 1; index <= numberOfPages; index++) {
            this.pages.push(index);
        }
    }
    get hasPrev() {
        return this.page > 1;
    }
    get hasNext() {
        return this.page < this.pages.length
    }
    onNext = () => {
        ++this.page;
    }
    onPrev = () => {
        --this.page;
    }
    onPageClick = (e) => {
        this.page = parseInt(e.target.dataset.id, 10);
    }
    get currentPageData() {
        return this.pageData();
    }
    downloadCSVFile() { 
       
        let rowEnd = '\n';
        let csvString = '';
        // this set elminates the duplicates if have any duplicate keys
        let rowData = new Set();

        // getting keys from data
        this.allData.forEach(function (record) {
            Object.keys(record).forEach(function (key) {
                rowData.add(key);
            });
        });

        // Array.from() method returns an Array object from any object with a length property or an iterable object.
        rowData = Array.from(rowData);
        rowData=rowData.splice(1)
        console.log('array-->'+rowData

        )
        // splitting using ','
        csvString += rowData.join(',');
        csvString += rowEnd;

        // main for loop to get the data based on key value
        for(let i=0; i < this.allData.length; i++){
            let colValue = 0;

            // validating keys in data
            for(let key in rowData) {
                if(rowData.hasOwnProperty(key)) {
                    // Key value 
                    // Ex: Id, Name
                    let rowKey = rowData[key];
                    // add , after every value except the first.
                    if(colValue > 0){
                        csvString += ',';
                    }
                    // If the column is undefined, it as blank in the CSV file.
                    let value = this.allData[i][rowKey] === undefined ? '' : this.allData[i][rowKey];
                    csvString += '"'+ value +'"';
                    colValue++;
                }
            }
            csvString += rowEnd;
        }

        // Creating anchor element to download
        let downloadElement = document.createElement('a');

        // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = 'Data.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click(); 
    }

}