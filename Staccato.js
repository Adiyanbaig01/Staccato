let currentAudio = null; // Stores the reference to the current audio element
let intervalId = null; // Stores the interval ID for updating the current time
const progressBar = document.getElementById('progressBar');
let mouseDownOnSlider = false;

function playSong(songUrl, songName) {
  if (currentAudio) {
    currentAudio.pause(); // Pause the previous song
    clearInterval(intervalId); // Clear the interval for updating the current time
  }

  const audio = new Audio(songUrl);
  audio.play();
  currentAudio = audio;

  audio.addEventListener('loadedmetadata', function() {
    // Get the duration of the audio in seconds
    let duration = audio.duration;

    // Convert the duration to minutes and seconds
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    // Display the song length on the webpage
    document.getElementById('songLength').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Display the song name on the webpage
    document.getElementById('songName').textContent = `Now Playing : ${songName}`;

    // Reset the progress bar slider and current time
    progressBar.value = 0;
    progressBar.max = duration;
    audio.currentTime = 0;
    

    // Update the progress bar as the song progresses
    progressBar.addEventListener('input', function() {
      audio.currentTime = progressBar.value;
    });
    
    // Update the progress bar value periodically
    intervalId = setInterval(function() {
      progressBar.value = audio.currentTime;
    }, 100);
    });
    
   function displayCurrentTime() {
    const currentTime = audio.currentTime;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('currentTime').textContent = formattedTime;

     
  }

  // Call the displayCurrentTime function periodically
  intervalId = setInterval(displayCurrentTime, 100);
}

function togglePlayPause() {
  if (currentAudio.paused) {
    currentAudio.play();
    updatePlayPauseIcon('play');
  } else {
    currentAudio.pause();
    updatePlayPauseIcon('pause');
  }
}

function updatePlayPauseIcon(state) {
  const playPauseIcon = document.getElementById('playPauseIcon');
  if (state === 'play') {
    playPauseIcon.src = 'assets/Pause.svg';
  } else {
    playPauseIcon.src = 'assets/Play.svg';
  }
}
 // Add the event listener for the progressBar input event
    progressBarVolume.addEventListener('input', function() {
      const volume = progressBarVolume.value / 100;
      currentAudio.volume = volume;
    });

    // Add the event listener for the progressBar change event
    progressBarVolume.addEventListener('change', function() {
      const volume = progressBarVolume.value / 100;
      currentAudio.volume = volume;

      if (progressBarVolume.value == 0) {
        // Mute the audio
        currentAudio.muted = true;
      } else {
        // Unmute the audio
        currentAudio.muted = false;
      }
    });
