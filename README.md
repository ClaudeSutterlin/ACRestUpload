#ACRestUpload
============

Salesforce multiple file upload with progress bars.

##Features

* Drag and drop uploads
* Progress bar on upload
* Multiple files simultaneously
* 50MB Limit (rather than <apex:inputFile> 10MB limit)
* Automatic fallback for old browsers
* Configurable

![ScreenShot](acrestupload.gif?raw=true)

##Installation

1. Copy the files within `./package/` into the respective folders in your project.
2. Upload the static resource to your org.
--* 1. Log into Salesforce
--* 2. Go into Setup->Static Resources
--* 3. Click `New`
--* 4. Enter 'ACRestUpload' for the name, choose ./package/staticresources/ACRestUpload.zip for the File. 
--* 5. Click `Save`
3. Add your org's subdomain to your remote site settings.
--* 1. Go to Setup->Remote Site Settings
--* 2. Click `New Remote Site`
--* 3. Enter 'ACRestUpload' for Site Name, and the base of your orgs URL (ex: https://cs11.salesforce.com) in Remote Site URL.
--* 4. Click `Save`

##Example
See ACRestUploadExample.page for an example of usage

##Configuration
`ACRestUploader.prepareUpload({finishedCallback: 'uploadFinished',
                                            data: {entityId: parentId, 
                                      			 entityType: type}},
                                      		forceFallback: false,
                                      		manualUpload: true,
                                      		uploadLimit: 10);`

forceFallback - Forces the fallback version of the uploader, regardless of browser compatibility.
manualUpload - Does not start uploads immediately, requires you to call ACRestUploader.startManualUpload();
uploadLimit - Sets a limit to the number of files that can be uploaded, defaults to 999.

Note: if you need multiple uploaders on one page you may use `<c:ACRestUpload name="Uploader2"/>`, where Uploader2 is the javascript object name for use with that uploader.

##Callbacks
finishedCallback - When all files have completely uploaded.
fileUploadCallback - When a single file has uploaded.

##Sample usage
- Include the component and set the base URL of your instance
`<c:ACRestUpload instanceUrl="https://na15.salesforce.com"/>`

- Initialize it with any data you want passed to ContentUploadHandler
`ACRestUploader.prepareUpload({finishedCallback: 'uploadFinished',
                                                    data: {entityId: parentId, 
                                              entityType: type}});`


In this scenario, two values are passed in the data parameter. EntityId and entityType will both be accessible inside the ContentUploadHandler class.

See the example upload page 'UploadTestPage.page' for further examples.

#Build Static Resources
============
You could just zip the files in ./src/ then upload those to static resources.

However, this project also utilizes Grunt for automated packaging and deployment. With Node.js installed, setup the Grunt command line tool by running:
sudo npm install -g grunt-cli

Then simply run `npm install` from the command line while inside the root directory of the plugin. This will install Grunt and all necessary grunt plugins. 

Once that finishes, run `grunt` to minify and zip the project for use as a SalesForce static resource (./package/staticresources/).

