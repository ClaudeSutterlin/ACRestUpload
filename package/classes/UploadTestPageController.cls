public with sharing class UploadTestPageController {
	public List<String> items {get; set;}
	public Map<integer, List<String>> itemMap {get; set;}
	
	public integer counter {get; set;}
	
	public UploadTestPageController(){
		counter = 0;	
	}
	
	public void doSomething(){
		counter++;
	}

}