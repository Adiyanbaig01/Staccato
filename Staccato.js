let currentAudio = null; // Stores the reference to the current audio element
let intervalId = null; // Stores the interval ID for updating the current time
let progressBar = document.getElementById('progressBar');
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
    const duration = audio.duration;

    // Convert the duration to minutes and seconds
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    // Display the song length on the webpage
    document.getElementById('songLength').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Display the song name on the webpage
    document.getElementById('songName').textContent = `Now Playing: ${songName}`;

    // Reset the progress bar slider
    progressBar.value = 0;
  });

  function displayCurrentTime() {
    const currentTime = audio.currentTime;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('currentTime').textContent = formattedTime;

    // Update the progress bar
    if (!mouseDownOnSlider) {
      const pct = (currentTime / audio.duration) * 100;
      progressBar.value = pct;
    }
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

// Add event listener for the progress bar slider
progressBar.addEventListener("input", () => {
  const pct = progressBar.value;
  const currentTime = (currentAudio.duration / 100) * pct;
  currentAudio.currentTime = currentTime;
});

progressBar.addEventListener("mousedown", () => {
  mouseDownOnSlider = true;
});

progressBar.addEventListener("mouseup", () => {
  mouseDownOnSlider = false;
});


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

    // SLider Logic for the Website 

// Get the song list container element
const songListContainer = document.querySelector('.list');

// Get the previous and next buttons
const prevButton = document.querySelector('.fa-chevron-left');
const nextButton = document.querySelector('.fa-chevron-right');

// Calculate the width of each song item
const songItemWidth = document.querySelector('.item').offsetWidth;

// Set the initial scroll position to 0
let scrollPosition = 0;

// Add click event listener to the previous button
prevButton.addEventListener('click', () => {
  // Calculate the new scroll position by subtracting the song item width
  scrollPosition -= songItemWidth;

  // Check if the new scroll position is less than 0 (reached the beginning)
  if (scrollPosition < 0) {
    // Set the scroll position to 0
    scrollPosition = 0;
  }

  // Apply the new scroll position to the song list container
  songListContainer.scrollTo({
    top: 0,
    left: scrollPosition,
    behavior: 'smooth',
  });
});

// Add click event listener to the next button
nextButton.addEventListener('click', () => {
  // Calculate the new scroll position by adding the song item width
  scrollPosition += songItemWidth;

  // Calculate the maximum scroll position
  const maxScrollPosition = songListContainer.scrollWidth - songListContainer.clientWidth;

  // Check if the new scroll position is greater than the maximum scroll position (reached the end)
  if (scrollPosition > maxScrollPosition) {
    // Set the scroll position to the maximum scroll position
    scrollPosition = maxScrollPosition;
  }

  // Apply the new scroll position to the song list container
  songListContainer.scrollTo({
    top: 0,
    left: scrollPosition,
    behavior: 'smooth',
  });
});

