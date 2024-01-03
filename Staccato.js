let currentAudio = null; // Stores the reference to the current audio element
let intervalId = null; // Stores the interval ID for updating the current time
let progressBar = document.getElementById('progressBar');
let mouseDownOnSlider = false;
let isFirstLoad = true; // Flag to check if it is the first time the page loads
let songs = [
  {
    url: 'Songs/Dancing With Your Ghost.mp3',
    name: 'Dancing with your ghost'
  },
  {
    url: 'Songs/Rema, Selena Gomez - Calm Down.mp3',
    name: 'Calm Down'
  },
  {
    url: 'Songs/Lord Huron - The Night We Met.mp3',
    name: 'The Night We Met'
  },
  {
    url: 'Songs/Harry Styles - Sign of the Times.mp3',
    name: 'Sign of the Times'
  },
  {
    url: 'Songs/Wiz Khalifa - See You Again ft. Charlie Puth.mp3',
    name: 'See You Again'
  },
  {
    url: 'Songs/One Direction - Night Changes.mp3',
    name: 'Night Changes'
  },
  {
    url: 'Songs/Steal My Girl - One Direction.mp3',
    name: 'Steal My Girl'
  },
  {
    url: 'Songs/JVKE - golden hour (official music video).mp3',
    name: 'Golden Hour'
  },
  {
    url: 'Songs/JVKE - this is what falling in love feels like (Official Video).mp3',
    name: 'This Is What Falling In Love Feels Like'
  },
  {
    url: 'Songs/Jawan_ Chaleya.mp3',
    name: 'Chaleya'
  },
  {
    url: 'Songs/Taylor Swift - All Too Well.mp3',
    name: 'All Too Well'
  },
  {
    url: 'Songs/TaylorSwift-Enchanted.mp3',
    name: 'Enchanted'
  },
  {
    url: 'Songs/LoveStory.mp3',
    name: 'Love Story'
  },
  {
    url: 'Songs/TaylorSwift-Style.mp3',
    name: 'Taylor Swift - Style'
  },
  {
    url: 'Songs/Taylor Swift - Cruel Summer.mp3',
    name: 'Cruel Summer'
  },
  {
    url: 'Songs/TaylorSwift-IKnewYouWereTrouble.mp3',
    name: 'I Knew You Were Trouble'
  },
  {
    url: 'Songs/Taylor Swift - Blank Space.mp3',
    name: 'Blank Space'
  },
  {
    url: 'Songs/TaylorSwift-willow.mp3',
    name: 'Taylor Swift - willow'
  },
  {
    url: 'Songs/Taylor Swift - Shake It Off.mp3',
    name: 'Shake It Off'
  },
  {
    url: 'Songs/Apna Bana Le.mp3',
    name: 'Apna Bana Le'
  },
  {
    url: 'Songs/hawayein.mp3',
    name: 'Arijit Singh - Hawayein'
  },
  {
    url: 'Songs/Ik Vaari Aa.mp3',
    name: 'Ek Vaari Aa'
  },
  {
    url: 'Songs/Khairiyat.mp3',
    name: 'Khairiyat'
  },
  {
    url: 'Songs/Kesariya.mp3',
    name: 'Arijit Singh - Kesariya'
  },
  {
    url: 'Songs/Shayad.mp3',
    name: ' Arijit Singh - Shayad '
  },
  {
    url: 'Songs/Zaalima.mp3',
    name: 'Arijit Singh - Zaalima '
  },
  {
    url: 'Songs/Arijit Singh_ Phir Aur Kya Chahiye.mp3',
    name: 'Phir Aur Kya Chahiye'
  },
  {
    url: 'Songs/BLACKPINK - Dont know what to do MV.mp3',
    name: 'Dont know what to do'
  },
  {
    url: 'Songs/BlackPink-Stay.mp3',
    name: 'BlackPink - Stay'
  },
  {
    url: 'Songs/As If Its Your Last - BlackPink.mp3',
    name: 'As If Its Your Last'
  },
  {
    url: 'Songs/BLACKPINK Pink Venom.mp3',
    name: 'Pink Venom'
  },
  {
    url: 'Songs/The Happiest Girl.mp3',
    name: 'The Happiest Girl'
  },
  {
    url: 'Songs/BlackPink - Forever Young.mp3',
    name: 'Forever Young'
  },
  {
    url: 'Songs/Tally.mp3',
    name: 'Blackpink - Tally'
  },
  {
    url: 'Songs/BLACKPINK Crazy Over You.mp3',
    name: 'Crazy Over You'
  },
  {
    url: 'Songs/Tu Pehla Pehla Pyar hai Mera.mp3',
    name: 'Pehla Pyaar'
  },
  {
    url: 'songs/BOL DO NA ZARA.mp3',
    name: 'Bol-Do-Na-Zara'
  },
  {
    url: 'Songs/Ghar Se Nikalte Hi.mp3',
    name: 'Ghar Se Nikalte Hi'
  },
  {
    url: 'Songs/SAB TERA.mp3',
    name: 'Sab Tera'
  },
  {
    url: 'Songs/WAJAH TUM HO.mp3',
    name: 'Wajha Tum Ho'
  },
  {
    url: 'Songs/Hua Hain Aaj Pehli Baar.mp3',
    name: 'Hua Hain Aaj Pehli Baar'
  },
  {
    url: 'Songs/CHALE AANA.mp3',
    name: 'Chale Aana'
  },
  {
    url: 'Songs/Kehta Hai Pal Pal.mp3',
    name: 'Kehta Hai Pal Pal'
  },
  {
    url: 'Songs/Dil Ibadat.mp3',
    name: 'Dil Ibadat'
  },
  {
    url: 'Songs/Piya Aye Na.mp3',
    name: 'Piya Aye Na'
  },
  {
    url: 'Songs/Haan Tu Hain.mp3',
    name: 'Haan Tu Hain'
  },
  {
    url: 'Songs/KHUDA JAANE.mp3',
    name: 'Khuda Jaane'
  },
  {
    url: 'Songs/Zara Sa Audio Song.mp3',
    name: 'Zara Sa'
  },
  {
    url: 'Songs/Tu Hi Meri Shab Hai.mp3',
    name: 'Tu Hi Mera Shab Hai'
  },
  {
    url: 'Songs/Tu Jo Mila Lyrical Song.mp3',
    name: 'Tu Jo Mila'
  },
  {
    url: 'Songs/TUJHE SOCHTA HOON.mp3',
    name: 'Tujhe Sochta Hoon'
  },
];
let currentSongIndex = 0;

function playSong(songUrl, songName) {
  if (currentAudio) {
    currentAudio.pause(); // Pause the previous song
    clearInterval(intervalId); // Clear the interval for updating the current time
  }

  const audio = new Audio(songUrl);
  // Check if it is the first time the page loads
  if (!isFirstLoad) {
    audio.play();
  }
  currentAudio = audio;

  // finds the index of the currently playing song in the songs array and updates the currentSongIndex
  currentSongIndex = songs.findIndex(song => song.url === songUrl);

  audio.addEventListener('ended', playNextSong);


  document.getElementById('songName').textContent = songName;



  audio.addEventListener('loadedmetadata', function () {
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

  // Reset the isFirstLoad flag after the first load
  isFirstLoad = false;
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
progressBarVolume.addEventListener('input', function () {
  const volume = progressBarVolume.value / 100;
  currentAudio.volume = volume;
});

// Add the event listener for the progressBar change event
progressBarVolume.addEventListener('change', function () {
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




// Program for The Droplets 

let drops = [];
let thunderTime = 0;
let sparklines = [];
let backgroundBrightness = 0;
let isRaining = true;
let rainToggle;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 100; i++) {
    drops.push(new Drop());
  }

  rainToggle = document.getElementById('rainToggle');
  rainToggle.addEventListener('change', toggleRain);
}

function draw() {
  background(backgroundBrightness);

  if (isRaining) {
    for (let i = 0; i < drops.length; i++) {
      drops[i].fall();
      drops[i].display();
    }

    if (millis() - thunderTime > random(5000, 6000)) {
      thunderTime = millis();
      sparklines.push(new Sparkline());
      backgroundBrightness = 100;
    }

    for (let i = sparklines.length - 1; i >= 0; i--) {
      sparklines[i].display();
      if (sparklines[i].isFinished()) {
        sparklines.splice(i, 1);
      }
    }

    backgroundBrightness -= 1;
  }
}

class Drop {
  constructor() {
    this.x = random(width);
    this.y = random(-500, -50);
    this.z = random(0, 20);
    this.len = map(this.z, 0, 20, 10, 30);
    this.yspeed = map(this.z, 0, 20, 1, 20);
  }

  fall() {
    this.y += this.yspeed;

    let grav = map(this.z, 0, 20, 0, 0.2);
    this.yspeed += grav;

    if (this.y > height) {
      this.y = random(-200, -100);
      this.yspeed = map(this.z, 0, 20, 1, 20);
    }
  }

  display() {
    let dropWidth = map(this.z, 0, 20, 1, 4);
    let dropHeight = map(this.z, 0, 20, 10, 30);

    noStroke();
    fill(150, 150, 255);
    ellipse(this.x, this.y, dropWidth, dropHeight);
  }
}

class Sparkline {
  constructor() {
    this.x = random(width);
    this.y = random(height / 2);
    this.length = random(20, 100);
    this.alpha = 255;
    this.fadeSpeed = random(2, 4);
  }

  display() {
    stroke(50, 50, 255, this.alpha);
    strokeWeight(2);
    line(this.x, this.y, this.x + this.length, this.y - this.length);
    this.alpha -= this.fadeSpeed;
  }

  isFinished() {
    return this.alpha <= 0;
  }
}

function toggleRain() {
  isRaining = !isRaining;

  if (isRaining) {
    // Regenerate drops
    drops = [];
    for (let i = 0; i < 100; i++) {
      drops.push(new Drop());
    }

    // Reset thunder time, sparklines, and background brightness
    thunderTime = 0;
    sparklines = [];
    backgroundBrightness = 0;
  } else {
    // Clear existing drops and sparklines
    drops = [];
    sparklines = [];
    backgroundBrightness = 0;
  }
}




// This is for the footer Names 
const creators = [
  "Adiyan Baig",
  "Saniya Sayyad",
  "Sharvari Dekre",
  "Nikhil Pahanpate",
  "Yash Giradkar",
  "Saheba Sayyad"
];

const creatorsElement = document.getElementById("creators");
const cursorElement = document.querySelector(".cursor");
let currentIndex = 0;
let currentText = "";
let isDeleting = false;
let typingSpeed = 50; // Speed in milliseconds
let deletionSpeed = 20; // Speed of deleting characters

function type() {
  const currentCreator = creators[currentIndex];
  if (isDeleting) {
    currentText = currentCreator.substring(0, currentText.length - 1);
    typingSpeed = deletionSpeed; // Set deletion speed
  } else {
    currentText = currentCreator.substring(0, currentText.length + 1);
    typingSpeed = 50; // Set typing speed
  }

  creatorsElement.textContent = currentText;

  if (!isDeleting && currentText === currentCreator) {
    isDeleting = true;
    typingSpeed = 1000; // Pause at the end
  } else if (isDeleting && currentText === "") {
    isDeleting = false;
    currentIndex = (currentIndex + 1) % creators.length;
    typingSpeed = 50; // Typing speed after deletion
  }

  setTimeout(type, typingSpeed);
}
// Initial typing start
setTimeout(type, 1000);



// Code For the falling Lines 
const container = document.getElementById("falling-lines");

function createFallingLine() {
  const line = document.createElement("div");
  line.classList.add("falling-line");
  line.style.left = Math.random() * 100 + "%";
  container.appendChild(line);

  line.addEventListener("animationend", () => {
    container.removeChild(line);
  });
}

setInterval(createFallingLine, 300); // Create new falling line every 200 milliseconds





function playNextSong() {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }
  const song = songs[currentSongIndex];
  playSong(song.url, song.name);
}

function playPreviousSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  const song = songs[currentSongIndex];
  playSong(song.url, song.name);
}
const initialSong = songs[currentSongIndex];
playSong(initialSong.url, initialSong.name);
