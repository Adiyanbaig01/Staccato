let currentAudio = null; // Stores the reference to the current audio element
let intervalId = null; // Stores the interval ID for updating the current time
let progressBar = document.getElementById('progressBar');
let mouseDownOnSlider = false;
let isFirstLoad = true; // Flag to check if it is the first time the page loads
let songs = [
  {
    url: '',
    name: 'No Track Playing',
    imgUrl: 'Images/null.png', // Add image URL for the song
    artist:'Pick Your Song' // Add artist name for the song
  },
  {
    url: 'Songs/Dancing With Your Ghost.mp3',
    name: 'Dancing with your ghost',
    imgUrl: 'https:/'+'/i.scdn.co/image/ab67616d0000b273141cf717cd3993690358a60c',
    artist:'Sasha Alex Sloan'
  },
  {
    url: 'Songs/Rema, Selena Gomez - Calm Down.mp3',
    name: 'Calm Down',
    imgUrl: 'https:/'+'/i1.sndcdn.com/artworks-hvuPC7OQC2OBPDov-V1Ht2A-t500x500.jpg',  
    artist:'Rema, Selena Gomez'
  },
  {
    url: 'Songs/Lord Huron - The Night We Met.mp3',
    name: 'The Night We Met',
    imgUrl: 'https:/'+'/virtualpiano.net/wp-content/uploads/2020/11/The-Night-We-Met-13-Reasons-Why-Lord-Huron-Best-Online-Piano-Keyboard-Virtual-Piano.jpg',  
    artist:'Lord Huron'
  },
  {
    url: 'Songs/Harry Styles - Sign of the Times.mp3',
    name: 'Sign of the Times',
    imgUrl: 'https:/'+'/i1.sndcdn.com/artworks-J3lCZyx8keOpfR1y-PAzksA-t500x500.jpg',  
    artist:'Harry Styles'
  },
  {
    url: 'Songs/Wiz Khalifa - See You Again ft. Charlie Puth.mp3',
    name: 'See You Again',
    imgUrl:'https:/'+'/i1.sndcdn.com/artworks-000116177725-alap1o-t500x500.jpg',  
    artist:'Wiz Khalifa ft. Charlie Puth'
  },
  {
    url: 'Songs/One Direction - Night Changes.mp3',
    name: 'Night Changes',
    imgUrl:'https:/'+'/preview.redd.it/night-changes-has-now-surpassed-1-billion-streams-on-v0-7zn2xd70u7ua1.jpg?width=640&crop=smart&auto=webp&s=d1a2172d731d137d933b00348baa083046243414',  
    artist:'One Direction'
  },
  {
    url: 'Songs/Steal My Girl - One Direction.mp3',
    name: 'Steal My Girl',
    imgUrl:'https:/'+'/i1.sndcdn.com/artworks-000132598634-ui94jo-t500x500.jpg',  
    artist:'One Direction'

  },
  {
    url: 'Songs/JVKE - golden hour (official music video).mp3',
    name: 'Golden Hour',
    imgUrl:'https:/'+'/resources.tidal.com/images/24df3cde/8158/43c3/81d8/af526b318696/750x750.jpg',  
    artist:' JVKE '
  },
  {
    url: 'Songs/JVKE - this is what falling in love feels like (Official Video).mp3',
    name: 'This Is What Falling In Love Feels Like',
    imgUrl:'https:/'+'/is2-ssl.mzstatic.com/image/thumb/Music122/v4/33/9d/f2/339df25b-1f4c-2715-bc07-eb9c144c96ba/5056167176534_1.jpg/1200x1200bb.jpg',  
    artist:' JVKE '
  },
  {
    url: 'Songs/Jawan_ Chaleya.mp3',
    name: 'Chaleya',
    imgUrl:'https:/'+'/c.saavncdn.com/026/Chaleya-From-Jawan-Hindi-2023-20230814014337-500x500.jpg',  
    artist:'Arijit Singh and Shilpa Rao'
  },
  {
    url: 'Songs/Taylor Swift - All Too Well.mp3',
    name: 'All Too Well',
    imgUrl:'https:/'+'/glasgowguardian.co.uk/wp-content/uploads/sites/2/2021/12/R.png',  
    artist:'Taylor Swift'
  },
  {
    url: 'Songs/TaylorSwift-Enchanted.mp3',
    name: 'Enchanted',
    imgUrl:'https:/'+'/img.buzzfeed.com/buzzfeed-static/static/2018-04/16/10/asset/buzzfeed-prod-web-04/sub-buzz-16652-1523887341-1.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto',  
    artist:'Taylor Swift'

  },
  {
    url: 'Songs/LoveStory.mp3',
    name: 'Love Story',
    imgUrl:'https:/'+'/t2.genius.com/unsafe/425x425/https%3A%2F%2Fimages.genius.com%2Fefccf69ab98db616b9c315e632383028.600x600x1.jpg',  
    artist:'Taylor Swift'
  },
  {
    url: 'Songs/TaylorSwift-Style.mp3',
    name: 'Taylor Swift - Style',
    imgUrl:'https:/'+'/i.pinimg.com/originals/a1/49/8d/a1498d7006fe729cde733e554229fcd7.jpg',  
    artist:'Taylor Swift'
  },
  {
    url: 'Songs/Taylor Swift - Cruel Summer.mp3',
    name: 'Cruel Summer',
    imgUrl:'https:/'+'/images.squarespace-cdn.com/content/v1/5c462fd0c3c16a9eac57b7ca/1683482334138-8WU0VWN3H0T9Q402LSFX/20230610_CruelSummer_Square.jpg',  
    artist:'Taylor Swift'
  },
  {
    url: 'Songs/TaylorSwift-IKnewYouWereTrouble.mp3',
    name: 'I Knew You Were Trouble',
    imgUrl:'https:/'+'/upload.wikimedia.org/wikipedia/en/7/70/I_Knew_You_Were_Trouble.png',  
    artist:'Taylor Swift'
  },
  {
    url: 'Songs/Taylor Swift - Blank Space.mp3',
    name: 'Blank Space',
    imgUrl:'https:/'+'/pbs.twimg.com/media/EV1n5ARWoAMqQgc.jpg:large',  
    artist:'Taylor Swift'
  },
  {
    url: 'Songs/TaylorSwift-willow.mp3',
    name: 'Taylor Swift - willow',
    imgUrl:'https:/'+'/i.scdn.co/image/ab67616d0000b27325751b4b32829d6bbfe6be7f',  
    artist:'Taylor Swift'
  },
  {
    url: 'Songs/Taylor Swift - Shake It Off.mp3',
    name: 'Shake It Off',
    imgUrl:'https:/'+'/i.pinimg.com/736x/68/40/d0/6840d0fdf5e62e492fb6ef2d8341399a.jpg',  
    artist:'Taylor Swift'
  },
  {
    url: 'Songs/Taylor Swift - Anti-Hero.mp3',
    name: 'Anti-Hero',
    imgUrl:'https:/'+'/pbs.twimg.com/media/Ff6oM20XEAExqha.jpg',  
    artist:'Taylor Swift'
  },
  {
    url: 'Songs/Apna Bana Le.mp3',
    name: 'Apna Bana Le',
    imgUrl:'https:/'+'/i0.wp.com/99lyricstore.com/wp-content/uploads/2022/11/Apna-Bana-Le-Lyrics-Arijit-Singh.jpg',  
    artist:' Arijit singh '
  },
  {
    url: 'Songs/hawayein.mp3',
    name: 'Arijit Singh - Hawayein',
    imgUrl:'https:/'+'/i.scdn.co/image/ab67616d0000b2730f29b052ea18eb757ec7ca9a',  
    artist:' Arijit singh '
  },
  {
    url: 'Songs/Ik Vaari Aa.mp3',
    name: 'Ek Vaari Aa',
    imgUrl:'https:/'+'/i.scdn.co/image/ab67616d00001e02ece89c7bf7d8141a1e8eef42',  
    artist:' Arijit singh '
  },
  {
    url: 'Songs/Khairiyat.mp3',
    name: 'Khairiyat',
    imgUrl:'https:/'+'/m.media-amazon.com/images/M/MV5BN2Y0YjJkMTctNjNmMC00MDkyLTkzZDktMWZmNTdmN2YyNWNmXkEyXkFqcGdeQXVyMTA5NzIyMDY5._V1_.jpg',  
    artist:' Arijit singh '
  },
  {
    url: 'Songs/Kesariya.mp3',
    name: 'Arijit Singh - Kesariya',
    imgUrl:'https:/'+'/c.saavncdn.com/191/Kesariya-From-Brahmastra-Hindi-2022-20220717092820-500x500.jpg',  
    artist:' Arijit singh '
  },
  {
    url: 'Songs/Shayad.mp3',
    name: ' Arijit Singh - Shayad ',
    imgUrl:'https:/'+'/c.saavncdn.com/172/Shayad-Film-Version-From-Love-Aaj-Kal--Hindi-2021-20210325204139-500x500.jpg',  
    artist:' Arijit singh '
  },
  {
    url: 'Songs/Zaalima.mp3',
    name: 'Arijit Singh - Zaalima ',
    imgUrl:'https:/'+'/upload.wikimedia.org/wikipedia/en/9/9b/Zaalima_Raees_Cover.jpg',  
    artist:' Arijit singh '
  },
  {
    url: 'Songs/Arijit Singh_ Phir Aur Kya Chahiye.mp3',
    name: 'Phir Aur Kya Chahiye',
    imgUrl:'https:/'+'/i1.sndcdn.com/artworks-f48j8UFVEcQIocrq-sHMNbw-t500x500.jpg',  
    artist:' Arijit singh '
  },
  {
    url: 'Songs/BLACKPINK - Dont know what to do MV.mp3',
    name: 'Dont know what to do',
    imgUrl:'https:/'+'/i1.sndcdn.com/artworks-000543859353-fvedxx-t500x500.jpg',  
    artist:' BLACKPINK '
  },
  {
    url: 'Songs/BlackPink-Stay.mp3',
    name: 'BlackPink - Stay',
    imgUrl:'https:/'+'/i.pinimg.com/736x/45/f5/9d/45f59d3d3881f672b67e7a41f8058273.jpg',  
    artist:' BLACKPINK '
  },
  {
    url: 'Songs/As If Its Your Last - BlackPink.mp3',
    name: 'As If Its Your Last',
    imgUrl:'https:/'+'/wallpapercave.com/wp/wp4463369.jpg',  
    artist:' BLACKPINK '
  },
  {
    url: 'Songs/BLACKPINK Pink Venom.mp3',
    name: 'Pink Venom',
    imgUrl:'https:/'+'/blackpink.cafe/wp-content/uploads/2022/08/blackpink-220825-pink-venom-official-merch-lisa.jpg',  
    artist:' BLACKPINK '
  },
  {
    url: 'Songs/The Happiest Girl.mp3',
    name: 'The Happiest Girl',
    imgUrl:'https:/'+'/qph.cf2.quoracdn.net/main-qimg-f09ed3ef95e24d44edb1fb76352e9559',  
    artist:' BLACKPINK '
  },
  {
    url: 'Songs/BlackPink - Forever Young.mp3',
    name: 'Forever Young',
    imgUrl:'https:/'+'/ih1.redbubble.net/image.1328737274.7617/st,small,507x507-pad,600x600,f8f8f8.jpg',  
    artist:' BLACKPINK '
  },
  {
    url: 'Songs/Tally.mp3',
    name: 'Blackpink - Tally',
    imgUrl:'https:/'+'/i1.sndcdn.com/artworks-GdlO3nipcLdcaqRI-2UhFUg-t500x500.jpg',  
    artist:' BLACKPINK '
  },
  {
    url: 'Songs/BLACKPINK Crazy Over You.mp3',
    name: 'Crazy Over You',
    imgUrl:'https:/'+'/i1.sndcdn.com/artworks-3sQZWeESgRKR5MqT-Zu0WGQ-t500x500.jpg',  
    artist:' BLACKPINK '
  },
  {
    url: 'Songs/Tu Pehla Pehla Pyar hai Mera.mp3',
    name: 'Pehla Pyaar',
    imgUrl:'https:/'+'/i1.sndcdn.com/artworks-000558108219-h0hfs6-t500x500.jpg',  
    artist:' Armaan Malik '
  },
  {
    url: 'songs/BOL DO NA ZARA.mp3',
    name: 'Bol-Do-Na-Zara',
    imgUrl:'https:/'+'/c.saavncdn.com/709/Bol-Do-Na-Zara-Instrumental-Hindi-2018-20181221231527-500x500.jpg',  
    artist:' Armaan Malik '
  },
  {
    url: 'Songs/Ghar Se Nikalte Hi.mp3',
    name: 'Ghar Se Nikalte Hi',
    imgUrl:'https:/'+'/c.saavncdn.com/098/Ghar-Se-Nikalte-Hi-Hindi-2018-20180407081907-500x500.jpg',  
    artist:' Armaan Malik '
  },
  {
    url: 'Songs/SAB TERA.mp3',
    name: 'Sab Tera',
    imgUrl:'https:/'+'/i1.sndcdn.com/artworks-000151944028-4wrwk3-t500x500.jpg',  
    artist:' Armaan Malik '
  },
  {
    url: 'Songs/WAJAH TUM HO.mp3',
    name: 'Wajha Tum Ho',
    imgUrl:'https:/'+'/c.saavncdn.com/590/Wajah-Tum-Ho-Hindi-2016-500x500.jpg',  
    artist:' Armaan Malik '
  },
  {
    url: 'Songs/Hua Hain Aaj Pehli Baar.mp3',
    name: 'Hua Hain Aaj Pehli Baar',
    imgUrl:'https:/'+'/encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA_5KIFuz7X_XFipxTXBip9QQX1uv1YaFapwq-iyzkHIlv6YXSzmYJHv3tpad62TceXj0&usqp=CAU',  
    artist:' Armaan Malik '
  },
  {
    url: 'Songs/CHALE AANA.mp3',
    name: 'Chale Aana',
    imgUrl:'https:/'+'/c.saavncdn.com/082/Chale-Aana-From-De-De-Pyaar-De-Hindi-2019-20190503065702-500x500.jpg',  
    artist:' Armaan Malik '
  },
  {
    url: 'Songs/Kehta Hai Pal Pal.mp3',
    name: 'Kehta Hai Pal Pal',
    imgUrl:'https:/'+'/c.saavncdn.com/706/Kehta-Hai-Pal-Pal-Hindi-2017-500x500.jpg',  
    artist:' Armaan Malik '
  },
  {
    url: 'Songs/Dil Ibadat.mp3',
    name: 'Dil Ibadat',
    imgUrl:'https:/'+'/c.saavncdn.com/749/Dil-Ibaadat-Lofi-Mix-Hindi-2021-20211118142308-500x500.jpg',  
    artist:' KK '
  },
  {
    url: 'Songs/Piya Aye Na.mp3',
    name: 'Piya Aye Na',
    imgUrl:'https:/'+'/encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Qv37IqOB2kTd9MbvmY8LNQrkBBZBLOjMEA&usqp=CAU',  
    artist:' KK '
  },
  {
    url: 'Songs/Haan Tu Hain.mp3',
    name: 'Haan Tu Hain',
    imgUrl:'https:/'+'/i.scdn.co/image/ab67616d0000b273cbf9868f67bc58511b48af2a',  
    artist:' KK '
  },
  {
    url: 'Songs/KHUDA JAANE.mp3',
    name: 'Khuda Jaane',
    imgUrl:'https:/'+'/resources.tidal.com/images/90da7927/e040/4b92/8ea2/1a342c94a449/750x750.jpg',  
    artist:' KK '
  },
  {
    url: 'Songs/Zara Sa Audio Song.mp3',
    name: 'Zara Sa',
    imgUrl:'https:/'+'/is1-ssl.mzstatic.com/image/thumb/Music126/v4/17/47/fd/1747fd5c-354b-6dc5-c43c-a0e8fa9b8943/cover.jpg/400x400cc.jpg',  
    artist:' KK '
  },
  {
    url: 'Songs/Tu Hi Meri Shab Hai.mp3',
    name: 'Tu Hi Mera Shab Hai',
    imgUrl:'https:/'+'/i0.wp.com/99lyricstore.com/wp-content/uploads/2021/04/Tu2Bhi2Bmeri2Bshab2Bhai2BHindi2BLove2BSong2BLyrics252C2BSung2BBy2BK.K.jpg',  
    artist:' KK '
  },
  {
    url: 'Songs/Tu Jo Mila Lyrical Song.mp3',
    name: 'Tu Jo Mila',
    imgUrl:'https:/'+'/c-cl.cdn.smule.com/smule-gg-s-sf-bck2/arr/9c/d4/54d47378-d960-482b-9395-f13ac5e3395d_1024.jpg',  
    artist:' KK '
  },
  {
    url: 'Songs/TUJHE SOCHTA HOON.mp3',
    name: 'Tujhe Sochta Hoon',
    imgUrl:'https:/'+'/c-cl.cdn.smule.com/rs-s78/arr/49/ac/8ab30b9f-0dcf-4d23-a03c-7a6bf9e076a0.jpg',  
    artist:' KK '
  },
];
let currentSongIndex = 0;

function playSong(songUrl, songName, artistName, imgUrl) {
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

  // Update the artist name using marquee
  document.getElementById('songArtist').textContent = artistName;

  // Update the song image dynamically
  document.getElementById('songLogo').src = imgUrl;

  audio.addEventListener('loadedmetadata', function () {
    // Get the duration of the audio in seconds
    const duration = audio.duration;

    // Convert the duration to minutes and seconds
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    // Display the song length on the webpage
    document.getElementById('songLength').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Display the song name on the webpage
    document.getElementById('songName').textContent = songName;

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

// Below Program is for Volume Control of the website ----- >>


let progressBarVolume = document.getElementById('progressBarVolume');
let volumeIcon = document.getElementById('volumeIcon');

function updateVolumeIcon() {
  if (currentAudio.muted || progressBarVolume.value == 0) {
    volumeIcon.src = 'assets/VolumeCut.svg';  // Replace with the actual path to your no volume icon
  } else {
    volumeIcon.src = 'assets/Volume.svg';  // Replace with the actual path to your volume icon
  }
}
// Add the event listener for the volume icon click event
volumeIcon.addEventListener('click', function () {
  if (currentAudio) {
    if (currentAudio.muted || progressBarVolume.value == 0) {
      progressBarVolume.value = 100;
    } else {
      progressBarVolume.value = 0;
    }
    updateVolumeIcon();
  }
});
// Add the event listener for the progressBarVolume input event
progressBarVolume.addEventListener('input', function () {
  const volume = progressBarVolume.value / 100;
  currentAudio.volume = volume;
  updateVolumeIcon();
});
// Add the event listener for the progressBarVolume change event
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
  updateVolumeIcon();
});
volumeIcon.addEventListener('click', function () {
  console.log("Clicked on volume icon");

  if (currentAudio) {
    // Toggle between mute and unmute
    currentAudio.muted = !currentAudio.muted;

    // Set volume slider value accordingly
    progressBarVolume.value = currentAudio.muted ? 0 : 100;

    // Update the volume icon
    updateVolumeIcon();
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
let isRaining = false;
let rainToggle;

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateDrops();
  
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
      if (sparklines.length < 5) { // Limit the number of sparklines
        sparklines.push(new Sparkline());
        backgroundBrightness = 100;
      }
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

function generateDrops() {
  for (let i = 0; i < 100; i++) {
    drops.push(new Drop());
  }
}

class Drop {
  constructor() {
    this.x = random(width);
    this.y = random(-500, -50);
    this.z = random(0, 20);
    this.len = map(this.z, 0, 20, 10, 30);
    this.yspeed = map(this.z, 0, 20, 1, 20);
    this.dropWidth = map(this.z, 0, 20, 1, 4);
    this.dropHeight = map(this.z, 0, 20, 10, 30);
  }

  fall() {
    this.y += this.yspeed;

    let grav = map(this.z, 0, 20, 0, 0.2);
    this.yspeed += grav;

    if (this.y > height) {
      this.resetDrop();
    }
  }

  resetDrop() {
    this.y = random(-200, -100);
    this.yspeed = map(this.z, 0, 20, 1, 20);
  }

  display() {
    noStroke();
    fill(150, 150, 255);
    ellipse(this.x, this.y, this.dropWidth, this.dropHeight);
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
    generateDrops();
    thunderTime = 0;
    sparklines = [];
    backgroundBrightness = 0;
  } else {
    drops = [];
    sparklines = [];
    backgroundBrightness = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateDrops();
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



function playNextSong() {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }
  const song = songs[currentSongIndex];
  playSong(song.url, song.name, song.artist, song.imgUrl); // Pass image URL and artist name to playSong
}

function playPreviousSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  const song = songs[currentSongIndex];
  playSong(song.url, song.name, song.artist, song.imgUrl); // Pass image URL and artist name to playSong
}

const initialSong = songs[currentSongIndex];
playSong(initialSong.url, initialSong.name, initialSong.artist, initialSong.imgUrl);


// Add event listener to the window for keydown event
window.addEventListener('keydown', function(event) {

  // Prevent default behavior for space bar key
  if (event.key === " ") {
    event.preventDefault();
  }
  // Check if the pressed key is the left arrow key
  if (event.key === "ArrowLeft") {
    // Call the playPreviousSong function
    playPreviousSong();
  }
  // Check if the pressed key is the right arrow key
  else if (event.key === "ArrowRight") {
    // Call the playNextSong function
    playNextSong();
  }
  // Check if the pressed key is the space bar
  else if (event.key === " ") {
    // Call the togglePlayPause function
    togglePlayPause();
  }
});

// Code for scrolling the cards 

function makeListScrollable(list) {
  let isGrabbing = false;
  let startX;
  let scrollLeft;

  list.addEventListener('mousedown', handleStart);
  list.addEventListener('touchstart', handleStart);

  function handleStart(e) {
    isGrabbing = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    scrollLeft = list.scrollLeft;

    list.addEventListener('mousemove', handleMove);
    list.addEventListener('touchmove', handleMove);
    list.addEventListener('mouseup', handleEnd);
    list.addEventListener('touchend', handleEnd);
    list.addEventListener('mouseleave', handleEnd);
  }

  function handleMove(e) {
    if (!isGrabbing) return;
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const walk = (x - startX) * 1; // Adjust scroll speed if needed
    list.scrollLeft = scrollLeft - walk;
  }

  function handleEnd() {
    isGrabbing = false;
    list.removeEventListener('mousemove', handleMove);
    list.removeEventListener('touchmove', handleMove);
    list.removeEventListener('mouseup', handleEnd);
    list.removeEventListener('touchend', handleEnd);
    list.removeEventListener('mouseleave', handleEnd);
  }
}

// Apply the scroll functionality to all lists with the 'list' class
const lists = document.querySelectorAll('.list');
lists.forEach(makeListScrollable);








// Code for searching Songs 

function filterPlaylists() {
  var input, filter, playlists, item, title, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  playlists = document.querySelectorAll(".item");

  playlists.forEach(function (item) {
    title = item.querySelector("h4");
    txtValue = title.textContent || title.innerText;

    // Check if the playlist title contains the filter text
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });

  // Hide or show the playlist headings based on the search filter
  var headings = document.querySelectorAll(".spotify-playlists h2");
  headings.forEach(function (heading) {
    var playlistItems = heading.nextElementSibling.querySelectorAll(".item");
    var visiblePlaylists = Array.from(playlistItems).filter(
      (item) => item.style.display !== "none"
    );

    if (visiblePlaylists.length > 0) {
      heading.style.display = "";
    } else {
      heading.style.display = "none";
    }
  });
}



function toggleSearch() {
  var searchInput = document.getElementById("searchInput");
  var searchContainer = document.getElementById("searchContainer");

  // Toggle the display of the search input
  searchInput.style.display = (searchInput.style.display === "none" || searchInput.style.display === "") ? "block" : "none";

  // If the search input is displayed, focus on it; otherwise, hide it
  if (searchInput.style.display === "block") {
    searchInput.focus();
  } else {
    searchContainer.blur();
  }
}
function hideSearchInput() {
  var searchInput = document.getElementById("searchInput");
  searchInput.style.display = "none";
}


 // JavaScript function to scroll smoothly to the top
 function scrollToTop() {
  document.body.scrollTop = 0;         // For Safari
  document.documentElement.scrollTop = 0;  // For Chrome, Firefox, IE, and Opera
}


document.addEventListener('DOMContentLoaded', function () {
  // Get references to loader elements
  var loaderContainer = document.getElementById('loaderContainer');
  var loadingElement = document.getElementById('loadingElement');

  // Listen for the 'animationend' event on the loading element
  loadingElement.addEventListener('animationend', function () {
    // Hide the loader when the animation ends
    loaderContainer.style.display = 'none';
  });
});


document.addEventListener('DOMContentLoaded', function () {
  var loaderBg = document.querySelector('.loaderbg');

  // Trigger the fade-out effect after a delay
  setTimeout(function () {
    loaderBg.classList.add('fade-out');
  }, 2000); // 2000 milliseconds (2 seconds) in this example

  // Remove loader after transition ends
  loaderBg.addEventListener('transitionend', function () {
    loaderBg.style.display = 'none';
  });
});
