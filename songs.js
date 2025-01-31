function playClick(button){
    const songName = button.closest('.song').querySelector('.songName').innerText;
    const artistName = button.closest('.song').querySelector('.songArtist').innerText;
    console.log('Playing:', songName);
    const element = button.closest('.song').querySelector('.leftColor');
    const gradient = element.style.background;
    const colors = gradient.match(/rgb\([^\)]+\)/g);
    console.log(colors);

    const encodedSongName = encodeURIComponent(songName);
    const encodedArtistName = encodeURIComponent(artistName);
    window.location.href = `page.html?song=${encodedSongName}&artist=${encodedArtistName}&speed=${1}&showcase=${0}`;
}
function showcaseClick(button){
    const songName = button.closest('.song').querySelector('.songName').innerText;
    const artistName = button.closest('.song').querySelector('.songArtist').innerText;
    console.log('Playing:', songName);
    const element = button.closest('.song').querySelector('.leftColor');
    const gradient = element.style.background;
    const colors = gradient.match(/rgb\([^\)]+\)/g);
    console.log(colors);

    const encodedSongName = encodeURIComponent(songName);
    const encodedArtistName = encodeURIComponent(artistName);
    window.location.href = `page.html?song=${encodedSongName}&artist=${encodedArtistName}&speed=${1}&showcase=${1}`;
}

function practiceClick(button){
    const songName = button.closest('.song').querySelector('.songName').innerText;
    const artistName = button.closest('.song').querySelector('.songArtist').innerText;
    const selectedSong = document.querySelector('.songSelected');
    const selectedArtist = document.querySelector('.artistSelected');
    selectedSong.innerText = songName;
    selectedArtist.innerText = artistName;
    const back = document.querySelector('.darkBackground');
    back.style.display = 'flex';
    const popup = document.querySelector('.practicePopup');
    popup.style.display = 'flex';
}

function startPracticeSong(button){
    let songSpeed = button.closest('.practicePopup').querySelector('.value').innerText;
    songSpeed = songSpeed.replace('%', '');
    console.log(songSpeed);   
    const realSpeed = convertRange(songSpeed);
    const songName = button.closest('.practicePopup').querySelector('.songSelected').innerText;
    const artistName = button.closest('.practicePopup').querySelector('.artistSelected').innerText;
    const perfectRunCheckbox = document.getElementById('perfectRun');
    const isPerfectRun = perfectRunCheckbox.checked;
    console.log(songName);
    console.log(artistName);
    const encodedSongName = encodeURIComponent(songName);
    const encodedArtistName = encodeURIComponent(artistName);
    window.location.href = `page.html?song=${encodedSongName}&artist=${encodedArtistName}&speed=${realSpeed}&perfectrun=${isPerfectRun}`;
}

function convertRange(value) {
    const minInput = 1;
    const maxInput = 100;
    const minOutput = 0.01;
    const maxOutput = 1;
  
    return minOutput + ((value - minInput) / (maxInput - minInput)) * (maxOutput - minOutput);
  }

function openPopUp(){
    const back = document.querySelector('.darkBackground');
    back.style.display = 'flex';
    const popup = document.querySelector('.songPopup');
    popup.style.display = 'flex';
    const name = document.getElementById('songName');
    name.value = "";
    const artist = document.getElementById('artistName');
    artist.value = "";
    const file = document.querySelector('span');
    console.log(file)
    file.innerHTML = "No file selected";

}

function closePopUp(){
    const back = document.querySelector('.darkBackground');
    back.style.display = 'none';
    const popup = document.querySelector('.songPopup');
    popup.style.display = 'none';
}

function closeSpeedPopup(){
    const back = document.querySelector('.darkBackground');
    back.style.display = 'none';
    const popup = document.querySelector('.practicePopup');
    popup.style.display = 'none';
}

async function addSong(){
    const songName = document.getElementById('songName').value;
    const artistName = document.getElementById('artistName').value;

    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];
    console.log(file.name);
    if (file.type === 'audio/midi' || file.name.endsWith('.mid') || file.name.endsWith('.midi')) {
        try{
           const arrayBuffer = await file.arrayBuffer();
           const midi = new Midi(arrayBuffer); 
           console.log('MIDI File Parsed:', midi);

           const supabaseUrl = 'https://iedoduvyiqxhoswanhfr.supabase.co';
           const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZG9kdXZ5aXF4aG9zd2FuaGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMjAzODMsImV4cCI6MjA1MTY5NjM4M30.0vCnu1pskeMMHhdvxlxrSOQmMHZwsIxcR5MxBo3IV-0';
           const supabaseClient = supabase.createClient(supabaseUrl, anonKey);
       
           const {data, error} = await supabaseClient.from('songs').insert([{ song_name: songName, artist_name: artistName, content: midi }]);
       
           if (error) {
               console.error('Error inserting song:', error);
           } 
        }
        catch(error){
            alert("Please upload a MIDI file");
        }
    }

    const songsContainer = document.querySelector('.songArea');
    const songTemplate = document.querySelector('.song');
    const songClone = songTemplate.cloneNode(true);
    songClone.querySelector('.songName').textContent = songName;
    songClone.querySelector('.songArtist').textContent = artistName;
    songClone.querySelector('.play').onclick = () => playClick(songClone);
    songClone.style.display = 'flex';
    songClone.querySelector('.leftColor').style.background = `linear-gradient(90deg, ${getRandomColor()}, #6d42d1)`;
    songsContainer.appendChild(songClone);
    closePopUp();
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function createSongs(){
    const supabaseUrl = 'https://iedoduvyiqxhoswanhfr.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZG9kdXZ5aXF4aG9zd2FuaGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMjAzODMsImV4cCI6MjA1MTY5NjM4M30.0vCnu1pskeMMHhdvxlxrSOQmMHZwsIxcR5MxBo3IV-0';
    const supabaseClient = supabase.createClient(supabaseUrl, anonKey);

    const {data, error} = await supabaseClient.from('songs').select('*');
    if (error) {
        console.error('Error fetching songs:', error);
    }
    console.log(data);

    const songsContainer = document.querySelector('.songArea');
    const songTemplate = document.querySelector('.song');
    for(const song of data){
        const songClone = songTemplate.cloneNode(true);
        songClone.querySelector('.songName').textContent = song.song_name;
        songClone.querySelector('.songArtist').textContent = song.artist_name;
        songClone.querySelector('.play').onclick = () => playClick(songClone);
        songClone.style.display = 'flex';
        songClone.querySelector('.leftColor').style.background = `linear-gradient(90deg, ${getRandomColor()},rgb(104, 61, 204))`;
        songsContainer.appendChild(songClone);
    }
    console.log(songsContainer);

}

const fileInput = document.getElementById('fileUpload');
const fileText = document.querySelector('.fileText');

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileUpload');
    const fileText = document.querySelector('.fileText');

    fileInput.addEventListener('change', function () {
        fileText.textContent = fileInput.files.length > 0 
            ? fileInput.files[0].name 
            : 'No file selected';
    });
});

window.onload = function () {
    sliderLogic();
    searchBarLogic();
};

function sliderLogic(){
    const slider = document.getElementById('slider');
    const sliderValue = document.querySelector('.value');
    
    sliderValue.textContent = slider.value + "%";

    slider.addEventListener('input', () => {
      sliderValue.textContent = slider.value + "%";
    });
}

function searchBarLogic(){
    document.querySelector('.searchBar').addEventListener('input', function(event) {
        const inputValue = event.target.value.toLowerCase();
        const songs = document.querySelectorAll('.songArea .song');
        songs.forEach(song => {
            songName = song.querySelector('.songName').textContent.toLowerCase();
            console.log(songName);
            if(songName == "sample never display"){
                song.style.display = 'none';
            }
            else{
                if(songName.includes(inputValue)){
                    song.style.display = 'flex';
                }
                else{
                    song.style.display = 'none';
                }
            }
        });
    });
}

createSongs();