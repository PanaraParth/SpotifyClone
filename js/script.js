// console.log('first')
let currentSong = new Audio();
let songs;

function formatTime(seconds) {
  // Calculate minutes and seconds
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  // Add leading zero if necessary
  var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

  // Return formatted time
  return formattedMinutes + ':' + formattedSeconds;
}

// Example usage
var seconds = 72; // Example seconds
var formattedTime = formatTime(seconds);
console.log(formattedTime); // Output: "01:12"

async function getSongs() {
    let songAPI = await fetch("http://127.0.0.1:5500/songs/")
    let responce = await songAPI.text();
    // console.log(responce)
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")
    let songs= [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

let playMusic= (track , pause=false)=>{
  currentSong.src =  "/songs/"+ track
  if(!pause) {
    currentSong.play()
    play.src="svgs/pause.svg"
  }
  document.querySelector(".songInfo").innerHTML=decodeURI(track)
  document.querySelector(".playTime").innerHTML="00:00 / 00:00"
}

async function main() {
    songs = await getSongs()
    let currentSongIndex = 0;
    // let audio = new Audio(songs[3]);
    let songUl= document.querySelector(".songsList").getElementsByTagName("ul")[0];
    playMusic(songs[0], true)
    
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      songUl.innerHTML += `<li>
          <div class="songName flex">
              <img class="invert" src="svgs/playlist.svg" alt="">
              <div class="songDetails">
                  <h5>${song.replaceAll("%20"," ")}</h5>
                  <h6>Artist Name</h6>
              </div>
          </div>
          <div class="playNow">
              <span>Play Now</span>
              <img class="invert" src="svgs/play.svg" alt="">
          </div>
      </li>`;
  }

  const songListItems = document.querySelectorAll(".songsList li");

  // Add event listeners to song list items
  songListItems.forEach((songListItem, index) => {
      songListItem.addEventListener("click", () => {
          playMusic(songs[index]); // Play the selected song
          currentSongIndex = index; // Update the index of the currently playing song
          updateCurrentlyPlayingStyle(); // Update the border style
      });
  });

  // Function to update the border style of the currently playing song
  function updateCurrentlyPlayingStyle() {
      // Remove the border style from all song list items
      songListItems.forEach(songListItem => {
          songListItem.style.border = 'none';
      });
      // Add the border style to the currently playing song list item
      songListItems[currentSongIndex].style.border = '0.5px solid #00d66b';
  }

  // Call the function to update the border style initially
  updateCurrentlyPlayingStyle();

    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", element=>{
        console.log(e.getElementsByTagName("h5")[0].innerHTML)
        playMusic(e.getElementsByTagName("h5")[0].innerHTML)
        // e.style.border = '1px solid #00d66b'
      })
      // document.querySelector(".songsList").document.getElementsByTagName("li").addEventListener("click", (e)=>{
      //   e.style.border = '1px solid #00d66b';
      // })
    });

    play.addEventListener("click",()=>{
      if (currentSong.paused) {
        currentSong.play()
        play.src="svgs/pause.svg"
      }else{
        currentSong.pause()
        play.src="svgs/play.svg"
      }
    })

    currentSong.addEventListener("timeupdate", ()=>{
      // console.log(currentSong.currentTime, currentSong.duration)
      document.querySelector(".playTime").innerHTML=`${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
      document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click" ,(e)=>{
      let parcent = (e.offsetX /e.target.getBoundingClientRect().width*100)
        document.querySelector(".circle").style.left=parcent + "%"
        currentSong.currentTime = ((currentSong.duration)*parcent)/100
    })

    // document.getElementById("prev").addEventListener("click", ()=>{
    //   console.log("Prev Click")
    //   console.log(currentSong.src)
    //   console.log(songs)
    // })

    // document.getElementById("next").addEventListener("click", ()=>{
    //   console.log("Next Click")
    //   console.log(currentSong.src)
    // })

    document.getElementById("prev").addEventListener("click", () => {
      // Find the index of the current song
      const currentIndex = songs.indexOf(currentSong.src.split("/songs/")[1]);
      
      // If the current song is not the first one, play the previous one
      if (currentIndex > 0) {
        const prevSong = songs[currentIndex - 1];
        playMusic(prevSong);
        currentSongIndex = currentIndex - 1; // Update the index of the currently playing song
        updateCurrentlyPlayingStyle(); // Update the border style 
      }
    });
    
    document.getElementById("next").addEventListener("click", () => {
      // Find the index of the current song
      const currentIndex = songs.indexOf(currentSong.src.split("/songs/")[1]);
      
      // If the current song is not the last one, play the next one
      if (currentIndex < songs.length - 1) {
        const nextSong = songs[currentIndex + 1];
        playMusic(nextSong);
        currentSongIndex = currentIndex + 1; // Update the index of the currently playing song
        updateCurrentlyPlayingStyle(); // Update the border style
      }
    });
}

document.addEventListener("keydown", (event) => {
  // Check if the pressed key is the spacebar (keyCode 32)
  if (event.keyCode === 32) {
      // Prevent default behavior of spacebar (scrolling the page)
      event.preventDefault();
      
      // If the song is paused, play it; if it's playing, pause it
      if (currentSong.paused) {
          currentSong.play();
          play.src = "svgs/pause.svg";
      } else {
          currentSong.pause();
          play.src = "svgs/play.svg";
      }
  }
});

document.querySelector(".circle").addEventListener("mousedown", (event) => {
  // Prevent default behavior of dragging elements
  event.preventDefault();

  // Add mousemove event listener when mouse is pressed down on the circle
  document.addEventListener("mousemove", mouseMoveHandler);

  // Add mouseup event listener to stop tracking when mouse is released
  document.addEventListener("mouseup", mouseUpHandler);
});

function mouseMoveHandler(event) {
  // Calculate the new position of the circle relative to the seekbar
  const seekbarRect = document.querySelector(".seekbar").getBoundingClientRect();
  const newPosition = event.clientX - seekbarRect.left;
  
  // Ensure the new position is within the bounds of the seekbar
  const minPosition = 0;
  const maxPosition = seekbarRect.width;
  const boundedPosition = Math.max(minPosition, Math.min(newPosition, maxPosition));

  // Calculate the percentage position of the circle
  const percentagePosition = (boundedPosition / maxPosition) * 100;

  // Update the position of the circle and the seekbar
  document.querySelector(".circle").style.left = `${percentagePosition}%`;
  currentSong.currentTime = (percentagePosition / 100) * currentSong.duration;
}

function mouseUpHandler() {
  // Remove mousemove and mouseup event listeners
  document.removeEventListener("mousemove", mouseMoveHandler);
  document.removeEventListener("mouseup", mouseUpHandler);
}
currentSong.addEventListener("ended", () => {
  // Find the index of the current song
  const currentIndex = songs.indexOf(currentSong.src.split("/songs/")[1]);
  
  // If the current song is not the last one, play the next one
  if (currentIndex < songs.length - 1) {
      const nextSong = songs[currentIndex + 1];
      playMusic(nextSong);
  } else {
      // If the current song is the last one, loop back to the first song
      playMusic(songs[0]);
  }
});



main()

