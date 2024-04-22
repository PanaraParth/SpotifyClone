console.log('first')


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
            songs.push(element.href)
        }
    }
    return songs
}

async function main() {
    let songs = await getSongs()
    let audio = new Audio(songs[3]);
    audio.play();
    
    setInterval(() => {
        audio.addEventListener("loadeddata", () => {
            let duration = audio.duration;
            console.log(duration)
        })
    }, 1);
          
}


main()