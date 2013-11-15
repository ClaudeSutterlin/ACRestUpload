@isTest
private class ContentUploadHandlerTest {
 
    static testMethod void testAddContent() {
    	// create an entity to link against
		Account a = new Account();
		a.Name = 'TestAccount';
		insert a;
		
		Account a2 = new Account();
		a2.Name = 'TestAccount2';
		insert a2;
		
		// entity info
		Map<String, object> jsonMap = new Map<String, object>();
		jsonMap.put('entityId', a.id);
		jsonMap.put('entityType', 'Account');
		
		// create a dummy file
		Blob contents = Blob.valueOf('Unit test blob');
		String fileName = 'name.txt';

		//test.startTest();
			// upload content and ensure it's successful
			ContentUploadHandler.UploadResult res = ContentUploadHandler.addContent(fileName, jsonMap, contents);
			system.assertEquals(res.response, 'success');
			
			// and ensure the content exists
			List<ContentDocument> docs = [Select c.Title, c.SystemModstamp, c.PublishStatus, c.ParentId, c.OwnerId, c.LatestPublishedVersionId, c.LastModifiedDate, c.LastModifiedById, c.IsDeleted, c.IsArchived, c.Id, c.CreatedDate, c.CreatedById, c.ArchivedDate, c.ArchivedById 
										  From ContentDocument c];
			system.assertEquals(docs.size(), 1);
			
			// check the file name
			ContentDocument doc = docs[0];
			system.assertEquals(doc.title, 'name');
			
			// upload a new version
			contents = Blob.valueOf('Unit test blob, new version');
			fileName = 'name2.txt';
			jsonMap.put('contentDocument', doc.id);
			
			res = ContentUploadHandler.addContent(fileName, jsonMap, contents);
			system.assertEquals(res.response, 'success');
			
			// see how many content versions we have
			List<ContentVersion> versions = [Select c.VersionNumber, c.VersionData, c.Title, c.TagCsv, c.SystemModstamp, c.ReasonForChange, c.RatingCount, c.PublishStatus, c.PositiveRatingCount, c.PathOnClient, c.OwnerId, c.Origin, c.NegativeRatingCount, c.LastModifiedDate, c.LastModifiedById, c.IsLatest, c.IsDeleted, c.Id, c.FirstPublishLocationId, c.FileType, c.FeaturedContentDate, c.FeaturedContentBoost, c.Description, c.CreatedDate, c.CreatedById, c.ContentUrl, c.ContentSize, c.ContentModifiedDate, c.ContentModifiedById, c.ContentDocumentId, c.Checksum 
											From ContentVersion c
											Where ContentDocumentId=:doc.id];
			system.assertEquals(versions.size(), 2);
			
			// upload a named content document and see if it works
			String contentTitle = 'TitleTest';
			Map<String, object> jsonMap2 = new Map<String, object>();
			jsonMap2.put('contentTitle', contentTitle);
			jsonMap2.put('entityId', a2.id);
			jsonMap2.put('entityType', 'Account');
			
			res = ContentUploadHandler.addContent(fileName, jsonMap2, contents);
			system.assertEquals(res.response, 'success');

		//test.stopTest();
	}
}