const video = document.getElementById("video");
const audio = document.getElementById("audio");

video.addEventListener('play', () => {
    audio.play();
});

video.addEventListener('pause', () => {
    audio.pause();
});

video.addEventListener('playing', () => {
    audio.currentTime = video.currentTime;
});

video.addEventListener('volumechange', () => {
    if (video.muted) {
        audio.muted = true;
    } else {
        audio.muted = false;
    }
});

video.addEventListener('ratechange', () => {
    audio.playbackRate = video.playbackRate;
});