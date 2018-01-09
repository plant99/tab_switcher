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

			chrome.tabs.query({currentWindow: true}, function(tabs){
				let urls = [];
				tabs.map(tab => {
					urls.push(tab.url);
				});
				chrome.tabs.sendMessage(activeTab.id, {'urls': urls});
			});
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