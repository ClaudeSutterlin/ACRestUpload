/**
	Test class for ACRestUploaderFallbackController

	@author	Claude Sutterlin	<csutterlin@acumensolutions.com>
	@since	2013-09-19
*/
@isTest
private class ACRestUploadFallbackControllerTest {

    static testMethod void testInit() {
        ACRestUploadFallbackController controller = new ACRestUploadFallbackController();
        
        // make sure we initialize properly
        system.assertEquals(controller.fallbackUploaded, false);
        system.assertEquals(controller.files.size(), ACRestUploadFallbackController.inputCnt);
        
        // test the file upload wrapper
        ACRestUploadFallbackController.UploadWrapper w = controller.files[0];
        system.assertEquals(w.name, '');
        system.assertEquals(w.size, 0);
    }
    
    static testMethod void testUpload() {
        ACRestUploadFallbackController controller = new ACRestUploadFallbackController();
        
        // create an account to link the content to
        Account testAccount = new Account(name = 'Test');
        insert testAccount;
                        
        // json parameters for testing
        Map<String, String> jsonData = new Map<String, String>();
        jsonData.put('entityType', 'Account');
        jsonData.put('entityId', testAccount.Id);
        
        controller.jsonData = JSON.serialize(jsonData);
        
        // create a dummy file
        ACRestUploadFallbackController.UploadWrapper w = controller.files[0];
		w.content = Blob.valueOf('Unit test blob');
		w.name = 'name.txt';
		w.size = w.content.size();
		controller.files[0] = w;
		
		//upload it
		controller.uploadDocuments();
		
		// ensure my flag changes and the blob gets nulled out
		system.assertEquals(controller.fallbackUploaded, true);
		system.assertEquals(controller.files[0].content, null);
		
		// ensure the file exists in either content document or attachments (because implementation inside ContentUploadHandler may vary)
		List<ContentDocument> docs = [select title from ContentDocument];
		List<Attachment> attachments = [select name from Attachment];
		system.assertNotEquals(docs.size()+attachments.size(), 0);
    }
}