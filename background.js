//background.js
let tabSwitcherActivated = false;
chrome.browserAction.onClicked.addListener(function(tab){
	//send message to active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"message":"clicked_browser_action", content: tabs});
	})
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.type === 'init_tab_switcher'){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			var activeTab = tabs[0];
			chrome.tabs.sendMessage(activeTab.id, {"message":message});
		})
		tabSwitcherActivated = true;
	}else if(message.type === 'close_tab_switcher'){
		tabSwitcherActivated = false;
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			var activeTab = tabs[0];
			chrome.tabs.sendMessage(activeTab.id, {"message":message});
		})
	}else if(message.type === 'search_buffer'){
		if(tabSwitcherActivated){
			//list matching tabs and show it in popup.html
			chrome.tabs.query({currentWindow: true}, function(tabs){
				let urls = [];
				let titles = [];
				tabs.map(tab => {
					urls.push(tab.url);
					titles.push(tab.title);
				});
				//chrome.tabs.sendMessage(activeTab.id, {'urls': urls, 'titles':titles});
				let indices = filterBasedOnKeyWords(urls, titles,message.search_buffer);
				chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
					let activeTab = tabs[0];
					//alert(activeTab.id);
					chrome.tabs.sendMessage(activeTab.id, {'indices': indices});
				})
			});
		}
	}
  //send message to active tab
});
/*
// background.js

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"clicked_browser_action"});
  });
});
*/
function filterBasedOnKeyWords(array1, array2, keyWord){
	let indices = [];
	let searchIndexInArray = -1;
	array1.map((array1Element, index) => {
		searchIndexInArray = array1Element.toLowerCase().indexOf(keyWord.toLowerCase());
		if(searchIndexInArray != -1){
			indices.push(index);
		}
	});
	array2.map((array2Element, index) => {
		searchIndexInArray = array2Element.toLowerCase().indexOf(keyWord.toLowerCase());
		if(searchIndexInArray != -1){
			if(indices.indexOf(index) === -1){
				indices.push(index);
			}
		}
	});
	return indices;
}