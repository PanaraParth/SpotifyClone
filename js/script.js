console.log('first')


async function getSongs() {
    let songAPI = await fetch("http://127.0.0.1:5500/song/")
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
    console.log(songs)
}

main()