/**
	Test class for ACRestUploaderController

	@author	Claude Sutterlin	<csutterlin@acumensolutions.com>
	@since	2013-09-19
*/
@IsTest public with sharing class ACRestUploadControllerTest {
   	static testMethod void testInit() {
        ACRestUploadController controller = new ACRestUploadController();
        // make sure the jsName defaults properly
        System.assertEquals(controller.getJsName(), 'ACRestUploader');
        controller.setJsName('Uploader2');
        System.assertEquals(controller.getJsName(), 'Uploader2');                                   
    }    
}