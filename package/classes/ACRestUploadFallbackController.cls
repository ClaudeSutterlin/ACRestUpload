public with sharing class ACRestUploadFallbackController {
	public List<UploadWrapper> files{get;set;}	
	public boolean fallbackUploaded {get;set;}
	public static final integer inputCnt = 10;
	public string redirect {get;set{this.redirect=value;}}
	public string jsonData {get;set;}
	
	public ACRestUploadFallbackController(){	
		initialize();			
	}
	
	public void initialize(){
		//initialize my array with upload wrappers
		fallbackUploaded = false;
		files = new List<UploadWrapper>();
		for (integer i=0; i<inputCnt;i++){
			UploadWrapper u = new UploadWrapper(); 
			files.add(u);
		}
	}
	
	public void uploadDocuments(){
		Map<String, Object> jsonMap = (Map<String, Object>)JSON.deserializeUntyped(jsonData);
		
		boolean errors = false;
		//run through once to check file sizes
		for (integer i=0; i<inputCnt;i++){ 
			if ((files[i].size>10485760)){   
				ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,'File ('+i+') is over 10MB.'));
	        	errors = true;
			}
		}
		
		if (errors){return;}
		
		// if all is well then upload
		for (integer i=0; i<inputCnt;i++){ 
			if ((files[i].content!=null)&&(files[i].content.size()>0)){      
	        	ContentUploadHandler.addContent(files[i].name, jsonMap, files[i].content);
			}
			// null out the contents afterwards or we'll get a viewstate size error
			files[i].content = null;
		}
		
		initialize();
		fallbackUploaded = true;
	}	
	
	public class UploadWrapper{
		public Blob content{get;set;}
		public String name{get;set;}
		public integer size{get;set;}
		
		public UploadWrapper(){
			name='';
			size=0;
		}		
	}
}