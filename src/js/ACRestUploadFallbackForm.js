    $j = jQuery.noConflict();

    function ACRestUploadFallbackForm(params){
		var self = this;
		self.selector='';
		self.uploadLimit = 999;
		self.uploadMoreBtn = null;
        self.uploadBtn = null;
		self.uploadFieldsVisible = 1;
        self.uploadFinished = false;

        // call back, get's set by the apex
        self.startManualUpload = null;

		// constants
		self.inputFileCnt = 10;

		self.init = function(params){
			// we need the id of the div
			self.selector = params.selector;

			if (params.uploadCnt){
				self.inputFileCnt = params.maxUploads;
			}

            // By default we can upload as many files as we have input elements
            self.uploadLimit = self.inputFileCnt;

			// grab our visual elements
			self.uploadMoreBtn = $j(self.selector).children('.uploadMoreBtn');
			$j(self.uploadMoreBtn).bind('click', self.uploadMore);

            self.uploadBtn = $j(self.selector).find("[id$='uploadBtn']");
		}	

		self.setUploadLimit = function(limit){
            if (limit < self.inputFileCnt){
                self.uploadLimit = limit;    
            }			

			if (self.uploadLimit<=1){
				$j(self.uploadMoreBtn).hide();
			}				
		}

		self.uploadMore = function(e){
            e.preventDefault();    
    		
			if (self.uploadFieldsVisible+3 < self.uploadLimit){
				self.uploadFieldsVisible += 3;
			}
			else{
				self.uploadFieldsVisible = self.uploadLimit;
			}

            if ((self.uploadFieldsVisible == self.inputFileCnt)||(self.uploadFieldsVisible == self.uploadLimit)){
                $j(self.uploadMoreBtn).hide();
            }
			 
			// iterate over our inputs and make more visible
			var i = 0;    			
			$j(self.selector).children('.inputFile').each(function(){
				if ($j(this).is(":visible")){
					i++;		
				}
				else if (i<self.uploadFieldsVisible){
					$j(this).removeClass('hidden');
					i++;
				}
				else{
					return;
				}
			});  		
    	}

        self.hideUploadButton = function(){
            $j(self.uploadBtn).hide();
        }

        self.init(params);
		return self;
	}
