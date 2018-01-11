// content.js

let tabSwitcherInitialized = false;
let searchBuffer = '';
let keyPressBuffer = new Array(2);


let html = `
	<div class="popup_tab_switcher">
		<p class="preview_search_buffer">Your search will appear here</p>
		<select auto class="select_tab_switcher">

		</select>
	</div>
	<style type="text/css">
		.popup_tab_switcher{
			color:white;
			position:fixed;
			top:0px;
			left: 0px;
			z-index: 999999;
		}
	</style>
`;
let divDummy = document.createElement('div');
divDummy.style.display = 'none';
//might be unnecessary divDummy.setAttribute('class', 'tab_switcher_popup_container');
divDummy.innerHTML = html;
document.body.appendChild(divDummy);

let selectTabSwitcher = document.querySelector('.select_tab_switcher');
let textPreview = document.querySelector('.preview_search_buffer');
chrome.runtime.onMessage.addListener(function(request, sender, response){
	console.log(request);
	if(request.message === 'clicked_browser_action'){
		console.log(request);
	}
	if(request.indices){
		if(request.indices.length){
			divDummy.style.display = "block";
			let optionsHtmlString = '';
			request.indices.map(index => {
				let option = `<option value=${index}>${request.titles[index]}</option>`;
				optionsHtmlString += option;
			});
			selectTabSwitcher.innerHTML = optionsHtmlString;
			selectTabSwitcher.focus();
		}else{
			divDummy.style.display = "none";
		}
	}
});
window.addEventListener('keydown', function(e){
	console.log(e.keyCode);
	if(tabSwitcherInitialized){
		if(e.keyCode === 8){
			searchBuffer = searchBuffer.slice(0, searchBuffer.length-1);
			return;
		}
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
	textPreview.innerHTML = searchBuffer;
	if(keyPressBuffer[0] === 17 && keyPressBuffer[1] === 192 ){
		divDummy.style.display = 'block';
		tabSwitcherInitialized = true;
		chrome.runtime.sendMessage({
			type:'init_tab_switcher'
		});
	}else if(e.keyCode === 27){
		divDummy.style.display = 'none';
		if(!tabSwitcherInitialized){
			return;
		}
		searchBuffer = '';
		tabSwitcherInitialized = false;
		//emit closeTabSwitcher
		let selectedIndex = selectTabSwitcher.value;
		console.log(selectedIndex);
		chrome.runtime.sendMessage({
			type:'close_tab_switcher',
			selectedIndex
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