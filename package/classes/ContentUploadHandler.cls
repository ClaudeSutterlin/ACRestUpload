@RestResource(urlMapping='/ContentUploadHandler/*')
global with sharing class ContentUploadHandler{
	
	@HttpPost
	global static UploadResult getService(){
		RestRequest req = RestContext.request;
    	RestResponse res = RestContext.response;
    	
    	// grab the data we need
		String name = req.headers.get('upload_filename');
		Blob body = req.requestBody;
    	String jsondata = req.headers.get('data');
    	
    	Map<String, Object> jsonMap = (Map<String, Object>)JSON.deserializeUntyped(jsondata);
    	
    	// pass it to the shared function
    	return addContent(name, jsonMap, body);    	
	}
	
	/*
		This is the function you'll want to alter to handle your file uploads.
		You'll end up getting a name, contents and whatever data you passed in 
		when you called the dialog. It's a JSON object.
	*/
	global static UploadResult addContent(String name, Map<String, Object> jsonMap, Blob content){
		UploadResult r = new UploadResult();
		try{
			// grab whatever you need to out of data
			String entityId='';
			String entityType='';	
			String contentDocumentId = '';	
			if (jsonMap!=null){
				if(jsonMap.containskey('entityId')){
					entityId = (String)jsonMap.get('entityId');
				}
				if(jsonMap.containskey('entityType')){
					entityType = (String)jsonMap.get('entityType');
				}
				if(jsonMap.containskey('contentDocument')){
					contentDocumentId = (String)jsonMap.get('contentDocument');
				}
			}
			
			// create a new content version
			ContentVersion newDoc = new ContentVersion();		
		    newDoc.versionData = content;
		    newDoc.PathOnClient = name;

		    // when you insert a new version, it creates a new document 
		    insert newDoc;
		    
		    // null out the content
		    content = null;

			r.response = 'success';
		   	r.documentId = (String)newDoc.id;
		}
		catch (Exception e) {
			r.response = 'error: ';
			r.error = e.getMessage(); 
		}
	    
		return r;
	}
	
	global class UploadResult {
        global String response{get;set;}
        global String documentId{get;set;}
        global String error{get;set;}
    }
	
	
}