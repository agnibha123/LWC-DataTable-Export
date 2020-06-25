public with sharing class getExport {
    @AuraEnabled
    public static List<TestObject__c> getData(){
       return [select id,field1__c,field2__c,field3__c,Error__c,Status__c from TestObject__c];
    }
    @AuraEnabled
    public static List<TestObject__c> getAllData(){
       return [select id,field1__c,field2__c,field3__c,field4__c,field5__c,field6__c,field7__c,field8__c,field9__c,field10__c,Status__c,Error__c,TestField11__c,TestField12__c,TestField13__c,TestField14__c,TestField15__c,TestField16__c,TestField17__c,TestField18__c,TestField19__c,TestField20__c,TestField21__c,TestField22__c,TestField23__c,TestField24__c,TestField25__c,TestField26__c,TestField27__c,TestField28__c,TestField29__c,TestField30__c from TestObject__c];
    }
}