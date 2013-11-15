public with sharing class UploadTestPageController {
	public List<String> items {get; set;}
	public Map<integer, List<String>> itemMap {get; set;}
	
	public integer counter {get; set;}
	
	public UploadTestPageController(){
		counter = 0;
		
		itemMap = new Map<integer, List<String>>();
		List<String> list1 = new List<String>();
		list1.add('a');
		list1.add('b');
		list1.add('c');
		
		itemMap.put(1, list1);
		
		List<String> list2 = itemMap.get(1);
		list2.add('d');
		list2.add('e');
		
		items = itemMap.get(1);
		
	}
	
	public void doSomething(){
		counter++;
	}

}