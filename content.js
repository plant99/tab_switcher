// content.js

let tabSwitcherInitialized = false;

let keyPressBuffer = new Array(2);
chrome.runtime.onMessage.addListener(function(request, sender, response){
	console.log(tabSwitcherInitialized);
	if(request.message === 'clicked_browser_action'){
		console.log(request);
	}
});

window.addEventListener('keydown', function(e){
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