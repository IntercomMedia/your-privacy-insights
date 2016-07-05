/*	======================================

		YOU TUBE

========================================== */


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function getYouTubeId(url) {
	var you_regex = /http:\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#\!)v=)([\w-]{11}).*/gi;
	var video_id = you_regex.exec(url);
	return match[0];
}

//**Event
function videoModalClickEvent(event) {	
	var attr = event.target.getAttribute('data-video-url');
	var player;
	function onYouTubeIframeAPIReady() {
		player = new YT.Player('youtube-video-player', {
			videoId: '',
			height: '1080',
			width: '1920',
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}
	player.loadVideoById('sqBCNjYKMI0');
	modalOpen(attr);
	event.preventDefault();
}

// Close video
function videoClose(element, index){
	element.addEventListener('click',videoCloseEvent);
}

//**Event
function videoCloseEvent(event) {	
		modalClose();
		document.getElementById('youtube-video-player').innerHTML = '';
		event.preventDefault();
}