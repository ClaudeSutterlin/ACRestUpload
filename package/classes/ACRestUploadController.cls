global with sharing class ACRestUploadController {
	public string jsName;
  public string instanceUrl;
	
	public void setJsName (String s) {
		jsName = s;
  	}
  	
  	public string getJsName(){
  		if ((jsName!=null)&&(jsName!='')){
  			return jsName;
  		}
  		else{
  			return 'ACRestUploader'; 
  		}
  	}
}