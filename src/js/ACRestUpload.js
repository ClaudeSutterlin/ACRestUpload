	$j = jQuery.noConflict();

	// uploader class for controlling uploads
	function ACRestUpload(params){
		var self = this;

		// set up some variables
		self.id = null;
		self.manualUpload = false;
		self.fileArray = [];
		self.fileCnt = 0;
		self.uploadingFileCnt = 0; // number of files uploading now
		self.data = null;
		self.html5Form = {};
		self.dropZone = {};
		self.uploadList = {};
		self.hiddenInput = {};
		self.sf_sessionId = '';
		self.finishedCallback = null;
		self.fileUploadCallback = null;
		self.finished = false;
		self.useProxy = true;
		self.uploadLimit = 999;
		
		self.init = function(params){
			// we need the id of the div
			self.id = params.selector;

			// grab our visual elements
			self.html5Form = $j(self.id).children('.html5form');			
			self.dropZone = $j(self.html5Form).children('.dropZone');
			self.hiddenInput = $j(self.html5Form).children('.hidden_input');
			self.uploadList = $j(self.html5Form).children('.uploadList');

			// session id needs to be passed
			self.sf_sessionId = params.session;
			self.instanceUrl = params.instanceUrl;
		}

		self.setData = function(data){
			self.data = data;
		}

		self.prepareUpload = function(params){			
			// store these locally
			self.data = params.data;
			
			if (params.uploadLimit){
				self.uploadLimit = params.uploadLimit;
				self.applyUploadLimit();
			}

			// convert the callback strings to functions
			var cb_tmp = window[params.fileUploadCallback];
			if (typeof cb_tmp === 'function'){
				self.fileUploadCallback = cb_tmp;
			}
			
			cb_tmp = window[params.finishedCallback];
			if (typeof cb_tmp === 'function') {
	    		self.finishedCallback = cb_tmp;
			}

			self.bindEvents();

			// check if we are using a manual upload process
			if (params.manualUpload){
				self.manualUpload = params.manualUpload;
			}		

			// clear out data in case this is just switching objects
			self.fileArray = [];
			self.fileCnt = 0;
			$j(self.uploadList).empty();   	
		}
		
		self.applyUploadLimit = function(){
			var fileText = 'file' + ((self.uploadLimit>1) ? "s" : "");

			$j(self.html5Form).find('.uploadLimitLbl').text('max. ' + self.uploadLimit + ' ' + fileText);
		}

		self.startManualUpload = function(){
			self.startUploads();
		}

		// delayed upload for manual uploads
		self.startUploads = function(){
			if (self.fileArray.length==0){
				self.finishedCallback();
			}
			else{
				for (u in self.fileArray){
					var file = self.fileArray[u];
					file.upload();
					self.uploadingFileCnt++;
				}	
			}		
		}

		self.handleFileSelect = function(evt) {
			$j('#drop_zone').removeClass('dropZoneHovering');
		
			evt.stopPropagation();
			evt.preventDefault();
			var files = evt.originalEvent.dataTransfer.files; // Filest object.
						
			self.handleFiles(files);
		}
		
		self.handleFiles = function(files){
			self.finished = false;
			// files is a FileList of File objects. List some properties.
			for (var i = 0, f; f = files[i]; i++) {
				if (self.fileCnt < self.uploadLimit){
					var upload = new FileUpload(f, self.fileCnt, self);
					self.fileArray.push(upload);
					self.fileCnt++;

					// only start it if we're doing automatic uploads
					if (!self.manualUpload){
						upload.upload();
						self.uploadingFileCnt++;
					}
				}
				else{
					var fileText = 'file' + ((self.uploadLimit>1) ? "s" : "");
					alert('You may only upload ' + self.uploadLimit + ' ' + fileText);
					return;
				}
			}
		}

		self.fileUploaded = function(file){
			self.uploadingFileCnt--;

			if (self.fileUploadCallback){
				self.fileUploadCallback(file.fileName);
			}

			if ((self.uploadingFileCnt==0)&&(self.finishedCallback)){
				self.finished = true;
				self.finishedCallback();
			}
		}

		self.handleDragLeave = function(evt) {
			$j('#drop_zone').removeClass('dropZoneHovering');
		}

		self.handleDragOver = function(evt) {
			$j('#drop_zone').addClass('dropZoneHovering');
			
			evt.stopPropagation();
			evt.preventDefault();
			evt.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		}
		
		self.handleHiddenInputChange = function(){
			var files = this.files;
			if(files.length){
				self.handleFiles(files);
			}
		}
		
		self.handleClick = function(e){
			e.preventDefault();
			self.hiddenInput.click();
		}

		/*
			Bind all events
			Using the event name spaces to allow for unbinding without consequences			
		*/
		self.bindEvents = function(){
			self.dropZone.unbind('dragover.ACRestUpload');
			self.dropZone.unbind('dragleave.ACRestUpload');
			self.dropZone.unbind('drop.ACRestUpload');
			self.dropZone.unbind('click.ACRestUpload');
			self.hiddenInput.unbind('change.ACRestUpload');

			self.dropZone.bind('dragover.ACRestUpload', self.handleDragOver);
			self.dropZone.bind('dragleave.ACRestUpload', self.handleDragLeave);
			self.dropZone.bind('drop.ACRestUpload', self.handleFileSelect);	
			self.dropZone.bind('click.ACRestUpload', self.handleClick);
			self.hiddenInput.bind('change.ACRestUpload', self.handleHiddenInputChange);
		}
    	
    	self.fileClicked = function(file){
    		if (file.result.response=='success'){
				// open the file in a new window if a document id was assigned
				if (file.result.documentId!==''){
					window.open(self.getInstanceUrl() + '/' + file.result.documentId, 'Document');
				}			
			}			
			else if (file.result.response=='error'){
				alert('Error: ' + file.result.error);
			}		
    	}
    	
    	// the instance url is used to build the REST path, qhich should simply be the instance at salesforce
    	self.getInstanceUrl = function(){
            return self.instanceUrl;
		}

		// The proxy URL has to have the community name and custom domain name
		self.getProxyUrl = function(){
			var proxyUrl = location.protocol + '//' + location.host;

			// check for community
			var pathComponents = location.pathname.split('/');
			if ((pathComponents.length>1)&&(pathComponents[1]!='apex')){
				proxyUrl += '/' + pathComponents[1];
			}

			proxyUrl += "/services/proxy";

			return proxyUrl;
		}
	
		// finally, initialize
		self.init(params);		
		return self;
	}		
	
	// my fileUpload class handles the UI and file uploads
	function FileUpload(file, id, uploader){
		var self = this;
		
		self.dom_id = 'thumb_'+id;
		self.contentId = -1;
		self.file = file;
		self.fileName = this.file.name;
		self.chunkSize = 180000;
		self.start = 0;
		self.stop = this.chunkSize-1;
		self.reader = new FileReader();
		self.thumb = {};
		self.$container = {};
		self.$thumbnail = {};
		self.$progressbar = {};
		self.uploader = uploader;
		self.result = {};
		
		self.init = function(){
			self.createContainer();
			self.generateThumbnail();
			self.bindEvents();
		}
		
		self.bindEvents = function(){
			$j(self.$container).css('cursor', 'pointer');
			$j(self.$container).click(function(){self.uploader.fileClicked(self)});
		}
		
		self.createContainer = function(){
			var div = '<div id="'+self.dom_id+'" class="uploadContainer"><div class="success">✔</div><div class="error">✕</div><div class="thumbnailContainer"><span class="fileName">'+self.fileName+'</span></div><div class="progressBar"><div class="percent" align="center">Waiting...</div></div></div>';
			$j(self.uploader.uploadList).prepend(div);
			self.$container = $j('#'+self.dom_id);	
			self.$progressbar = self.$container.children('.progressBar');			
		}
		
		self.generateThumbnail = function(){
			// Grab thumbnails for images only
			if (!file.type.match('image.*')) {
		      return;
		    }

		    var thumbReader = new FileReader();

		    // Closure to capture the file information.
		    thumbReader.onload = (function(theFile) {
		      return function(e) {
		        // Render thumbnail.
		        var img = '<img class="thumb" src="' + e.target.result + '" title="' + escape(theFile.name) + '"/>';
		    	// add it to the dom
		        $j(self.$container).children('.thumbnailContainer').append(img);
		        // keep a reference to the thumb
		        self.$thumbnail = $j(self.$container).children('.thumb');
		      };
		    })(self.file);

		    // Read in the image file as a data URL.
		    thumbReader.readAsDataURL(file);
		}
		
		self.documentCreated = function(result, event){
			if (event.status) {
				self.contentId = result;
				self.processNextChunk();
			}
			else{
				$j(self.$progressbar).children('.percent').text('Error'); //event.message
			}
		}
		
		self.upload = function(){				
			self.reader.onload = self.fileLoaded;
			self.reader.onprogress = self.fileProgress;
			self.reader.readAsArrayBuffer(self.file);
		}

		//Loading progress, offset by 50% for file loading vs file uploading
		self.fileProgress = function(evt){
			// evt is an ProgressEvent.
		    if (evt.lengthComputable) {
		      var pct = Math.round((evt.loaded / evt.total) * 100);
		      self.updateProgress(pct);
		    }
		}
		
		self.fileLoaded = function(evt) {		
			var file =  evt.target.result;
			var url = uploader.getInstanceUrl() + '/services/apexrest/ContentUploadHandler';		
			var proxyUrl = uploader.getProxyUrl();

			$j.ajax({
			    type: 'POST',
			    dataType: 'json',
			    url: proxyUrl,
			    cache: false,
			    async: true,
			    data: file,
			    processData: false,
			    contentType: false,
			    error: function (xhr, ajaxOptions, thrownError) {
			        self.errored(xhr.responseText);
			    },
			    xhr: function () {
			    	var xhr = new window.XMLHttpRequest();
			        xhr.upload.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
			                var percentComplete = Math.round(evt.loaded / evt.total * 100);
			                self.updateProgress(percentComplete);
			            }
			        }, false);
			        xhr.addEventListener("progress", function (evt) {
			            if (evt.lengthComputable) {
			                var percentComplete = Math.round(evt.loaded / evt.total * 100);
			                self.updateProgress(percentComplete);
			            }
			        }, false);
			        return xhr;
			    },
			    beforeSend: function (xhr) {
			        xhr.setRequestHeader('SalesforceProxy-Endpoint', url);
		 			xhr.setRequestHeader("Accept", "application/json");
				    xhr.setRequestHeader("Cache-Control", "no-cache");
				    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				    xhr.setRequestHeader("X-File-Name", self.fileName);
		            xhr.setRequestHeader("Authorization", "OAuth " + self.uploader.sf_sessionId);
		            xhr.setRequestHeader('X-User-Agent', 'salesforce-toolkit-rest-javascript/v27.0');
		            xhr.setRequestHeader('upload_filename', self.fileName);
		            xhr.setRequestHeader('data', JSON.stringify(self.uploader.data));
			    },
			    complete: function () {
			        self.updateProgress(100);
			    },
			    success: function (json) {
			    	self.updateProgress(100);
			        self.completed();
			    }
			});
		}; 			
		
		self.updateProgress = function(pct){		
			$j(self.$progressbar).css('width', pct+'%');
			$j(self.$progressbar).children('.percent').text(pct+'%');
		}
		
		self.errored = function(error){
			$j(self.$container).children('.error').show();
			$j(self.$progressbar).children('.percent').text('Error');				    
		    self.uploader.fileUploaded(self);
		}
		
		self.completed = function(){
			$j(self.$container).children('.success').show();
			self.uploader.fileUploaded(self);
		}

		self.init();
		return self;
	}