// content.js

let tabSwitcherInitialized = false;
let searchBuffer = '';
let keyPressBuffer = new Array(2);
chrome.runtime.onMessage.addListener(function(request, sender, response){
	console.log(request);
	if(request.message === 'clicked_browser_action'){
		console.log(request);
	}
});
window.addEventListener('keydown', function(e){
	if(tabSwitcherInitialized){
		if((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122) ){
			searchBuffer += String.fromCharCode(e.keyCode);
			console.log(searchBuffer);
			chrome.runtime.sendMessage({
				type:'search_buffer',
				search_buffer: searchBuffer
			});
		}
	}
	keyPressBuffer.shift();
	keyPressBuffer.push(e.keyCode);
	if(keyPressBuffer[0] === 17 && keyPressBuffer[1] === 192 ){
		tabSwitcherInitialized = true;
		chrome.runtime.sendMessage({
			type:'init_tab_switcher'
		});
	}else if(e.keyCode === 27){
		if(!tabSwitcherInitialized){
			return;
		}
		searchBuffer = '';
		tabSwitcherInitialized = false;
		//emit closeTabSwitcher
		chrome.runtime.sendMessage({
			type:'close_tab_switcher'
		});
		return;
	}

})
/*
// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      console.log('hey');
    }
  }
);

*/