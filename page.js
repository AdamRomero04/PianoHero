class Key{
    constructor(midiNum, noteName, sampler) {
        this.midiNum = midiNum;
        this.noteName = noteName;
        this.sampler = sampler;
        this.keyObject = null;
        this.isAnimating = false;
        this.noteQueue = [];
    }

    addKeyObject(keyObject){
        this.keyObject = keyObject;
    }

    playAutomatedNote(duration, time, color1) {
        const currTime = Tone.now();
        const note = Tone.Frequency(this.midiNum, "midi").toNote();
        this.sampler.triggerAttackRelease(note, duration, time);
        calculateScore(currTime, time);
        if(this.isAnimating == true){
            return;
        }
        this.isAnimating = true;
        
        let colorSave = "";  
        const boundingBox = new THREE.Box3().setFromObject(this.keyObject);
        const keyWidth = boundingBox.max.x - boundingBox.min.x;

        if (keyWidth > .4){
            colorSave = "#FFFFFF";
            this.keyObject.material.color.set(color1);
        }
        else{
            colorSave = '#080808';
            this.keyObject.material.color.set(darkenColor(color1, .5));
        }
    
        setTimeout(() => {
            this.keyObject.material.color.set(colorSave); 
        }, 100);
    
        const prism = this.keyObject;
    
        const tween = new TWEEN.Tween(prism.position)
            .to({ y: prism.position.y - .25 }, 50)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                const tween2 = new TWEEN.Tween(prism.position)
                .to({ y: prism.position.y + .25 }, 50)
                .easing(TWEEN.Easing.Linear.None)
                .start()
                .onComplete(() =>{
                    this.isAnimating = false;
                });
            });
    
        tween.start();
    }

    playRealNote(color1) { 
        const currTime = Tone.now();
        const possibleNotes = this.noteQueue;
        let keyColor = "";
        console.log(currTime);
        console.log(possibleNotes);

        if(possibleNotes.length == 0){
            keyColor = "#FF0000";
            this.keyAnimate(keyColor);
            return; 
        }

        for (let i = 0; i < possibleNotes.length; i++) {
            const timeDistance = Math.abs(possibleNotes[i][1] - currTime);
            if (timeDistance > .2){
                continue;
            }
            else{
                keyColor = color1;
                const note = Tone.Frequency(this.midiNum, "midi").toNote();
                this.sampler.triggerAttackRelease(note, possibleNotes[i][0].duration, Tone.now());
                this.keyAnimate(keyColor);
                calculateScore(currTime, possibleNotes[i][1]);
                possibleNotes.splice(i, 1);
                return;
            }
        }

        keyColor = "#FF0000";
        this.keyAnimate(keyColor);
    }

    keyAnimate(keyColor){
        if(this.isAnimating == true){
            return;
        }
        this.isAnimating = true;
        let colorSave = "";  
        const boundingBox = new THREE.Box3().setFromObject(this.keyObject);
        const keyWidth = boundingBox.max.x - boundingBox.min.x;

        if (keyWidth > .4){
            colorSave = "#FFFFFF";
            this.keyObject.material.color.set(keyColor);
        }
        else{
            colorSave = '#080808';
            this.keyObject.material.color.set(darkenColor(keyColor, .5));
        }
    
        setTimeout(() => {
            this.keyObject.material.color.set(colorSave); 
        }, 100);
    
        const prism = this.keyObject;
    
        const tween = new TWEEN.Tween(prism.position)
            .to({ y: prism.position.y - .25 }, 50)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                const tween2 = new TWEEN.Tween(prism.position)
                .to({ y: prism.position.y + .25 }, 50)
                .easing(TWEEN.Easing.Linear.None)
                .start()
                .onComplete(() =>{
                    this.isAnimating = false;
                });
            });
    
        tween.start();
    }
}

class Piano{
    constructor() {
        this.keys = {};
        this.sampler = new Tone.Sampler({
            urls: {
                A0: "A0.mp3",
                C1: "C1.mp3",
                "D#1": "Ds1.mp3",
                "F#1": "Fs1.mp3",
                A1: "A1.mp3",
                C2: "C2.mp3",
                "D#2": "Ds2.mp3",
                "F#2": "Fs2.mp3",
                A2: "A2.mp3",
                C3: "C3.mp3",
                "D#3": "Ds3.mp3",
                "F#3": "Fs3.mp3",
                A3: "A3.mp3",
                C4: "C4.mp3",
                "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3",
                A4: "A4.mp3",
                C5: "C5.mp3",
                "D#5": "Ds5.mp3",
                "F#5": "Fs5.mp3",
                A5: "A5.mp3",
                C6: "C6.mp3",
                "D#6": "Ds6.mp3",
                "F#6": "Fs6.mp3",
                A6: "A6.mp3",
                C7: "C7.mp3",
                "D#7": "Ds7.mp3",
                "F#7": "Fs7.mp3",
                A7: "A7.mp3",
                C8: "C8.mp3"
            },
            release: 1,
            baseUrl: "https://tonejs.github.io/audio/salamander/",
        }).toDestination();
        this.initKeys();
    }

    initKeys() {
        for (let midiNum = 21; midiNum <= 108; midiNum++) {
            const realNote = noteConvert(midiNum);
            this.keys[realNote] = new Key(midiNum, realNote, this.sampler);
        }
    }
}

function generalSetup(scene){

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 20).normalize();
    scene.add(light);
    renderer.shadowMap.enabled = true;
    light.castShadow = true;
    
    
    const light2 = new THREE.DirectionalLight(0xffffff, .97); 
    light2.position.set(0, 6, 2); 
    light2.target.position.set(0, 0, 0); 
    
    light2.castShadow = true;
    
    light2.shadow.mapSize.width = 2048;
    light2.shadow.mapSize.height = 2048;
    light2.shadow.camera.near = 0.1;
    light2.shadow.camera.far = 50;
    light2.shadow.camera.left = -10;
    light2.shadow.camera.right = 10;
    light2.shadow.camera.top = 10;
    light2.shadow.camera.bottom = -10;
    
    scene.add(light2);
    scene.add(light2.target);

    const planeGeometry = new THREE.PlaneGeometry(80, 20);
    const planeMaterial= new THREE.MeshStandardMaterial({
                        color: 0x111111,
                        metalness: .5,   
                        roughness: 0,
                    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    plane.position.set(0, 0, 0);
    scene.add(plane);

    const light3 = new THREE.DirectionalLight(color1, 10);
    light3.position.set(0, -10, -1);
    light3.target.position.set(0, 0, 0);
    light3.castShadow = true;

    scene.add(light3);
    scene.add(light3.target);
}

function pianoSetup(scene, piano){
    const loader = new THREE.GLTFLoader();
    loader.load(
        'piano.glb',  // Make sure this path points to your actual GLB file
        (gltf) => {
            const pianoObj = gltf.scene;
            scene.add(gltf.scene);
            pianoObj.position.x = -.026;
            pianoObj.position.y = 2.82;
            pianoObj.position.z = 4.95;
            const meshChildren = [];
            pianoObj.traverse((child) => {
                if (child.isMesh) {
                    meshChildren.push(child);
                }
            });
            meshChildren.sort((a, b) => a.position.x - b.position.x);
            for(let i = 0; i < meshChildren.length; i++){
                if (meshChildren[i].name == "topbar"){
                    meshChildren.splice(i, 1);
                    i--;
                }
            }
    
            keysArr = Object.entries(piano.keys);
            for(let i = 0; i < keysArr.length; i++){
                piano.keys[keysArr[i][0]].addKeyObject(meshChildren[i]);
            }
            //console.log(piano.keys);
            meshChildren.forEach((child) => {
                //console.log(child);
                child.material.side = THREE.DoubleSide;
                const scale = child.scale;
                child.material = new THREE.MeshStandardMaterial({
                    metalness: 0.1,        // Fully metallic
                    roughness: 0.55,      // Slightly polished surface
                    envMapIntensity: 1.5 // Boost reflections if you have an environment map
                });
    
                if (Math.abs(scale.x - 0.9009504318237305) < 0.0001 && scale.y === 1 && scale.z === 1) {
                    child.material.color.set(0xffffff); 
                }
                else if(child.name === 'Backplate' || child.name === 'Blocker'){
                    child.material.color.set(0x0f0f0f); 
                }
                else {
                    child.material.color.set(0x080808); 
                }
            });
            console.log('GLB loaded successfully!');
            console.log(gltf.scene);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('Error loading GLB:', error);
        }
    );
}

const piano = new Piano;
const scene = new THREE.Scene();
let notes = "";
let color1 = getRandomColor();

const camera = new THREE.PerspectiveCamera(
    45, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.z = 5; 

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('three-canvas'), 
    antialias: true 
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
document.body.appendChild(renderer.domElement);

setUpStartCard();
generalSetup(scene);
pianoSetup(scene, piano);

// Position the camera
camera.position.set(0, 20, 0);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

async function playMidi(piano) {
    await Tone.start();

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const songName = urlParams.get('song');
        const supabaseUrl = 'https://iedoduvyiqxhoswanhfr.supabase.co';
        const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZG9kdXZ5aXF4aG9zd2FuaGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMjAzODMsImV4cCI6MjA1MTY5NjM4M30.0vCnu1pskeMMHhdvxlxrSOQmMHZwsIxcR5MxBo3IV-0';
        const supabaseClient = supabase.createClient(supabaseUrl, anonKey);
        
        const {data, error} = await supabaseClient.from('songs').select('*').eq('song_name', songName).single();
        if (error) {
            console.error('Error fetching songs:', error);
        }     
        
        const midi = data.content;
        const speed = urlParams.get('speed');
        notes = midi.tracks[0].notes;
        completedNotes = new Set();
        const notesConst = notes[0].time;
        const alteredNotesConst = notes[0].time / speed;
        const noteShift = notesConst - alteredNotesConst;
        
        for (const note of notes){
            note.time /= speed;
            note.time += noteShift;
            note.duration /= speed; 
        }
        console.log("MIDI Loaded:", notes);

        Tone.Transport.stop();
        Tone.Transport.cancel(); 
        Tone.Transport.position = 0;

        const startTime = Tone.now() + 3; 
        midi.tracks[0].notes.forEach((note) => {
            const noteName = note.name;
            const duration = note.duration;
            const time = note.time + startTime - notesConst;
            const prismTime = time - 3;
            Tone.Transport.scheduleOnce((scheduledTime) => {
                //console.log(scheduledTime + 3);
                const add = [note, scheduledTime + 3];
                piano.keys[noteName].noteQueue.push(add);
                const canvas = document.createElement('canvas');
                canvas.width = 256;
                canvas.height = 256;
                const ctx = canvas.getContext('2d');

                const boundingBox = new THREE.Box3().setFromObject(piano.keys[noteName].keyObject);
                const keyWidth = boundingBox.max.x - boundingBox.min.x;
                
                const gradient = ctx.createLinearGradient(0, 0, 0, 256);
                
                const gradientTexture = new THREE.CanvasTexture(canvas);
                
                const loader = new THREE.GLTFLoader();
                let modelName = "";

                if (keyWidth > .4){
                    modelName = "bigkey.glb";
                    gradient.addColorStop(0, color1); 
                    gradient.addColorStop(1, lightenColor(color1)); 
                }
                else{
                    modelName = "smallkey.glb";
                    gradient.addColorStop(0, darkenColor(color1, .98)); 
                    gradient.addColorStop(1, color1); 
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const material = new THREE.MeshStandardMaterial({
                    map: gradientTexture,
                    emissive: 0x000000,
                    emissiveIntensity: 0
                });

                loader.load(modelName, (gltf) => {

                const prism = gltf.scene;
                prism.children[0].material = material;

                let worldPosition = new THREE.Vector3();
                piano.keys[noteName].keyObject.getWorldPosition(worldPosition);

                let adjustedPosition = worldPosition.clone();
                adjustedPosition.z = -8.85; //- geometry.parameters.depth / 2;
                if(modelName == "smallkey.glb"){
                    adjustedPosition.y -= .1;
                }
                adjustedPosition.y -= .16;
                prism.position.copy(adjustedPosition);

                const speed = 12.485 / 3250;
                const tween = new TWEEN.Tween(prism.position)
                    .to({}, 3250) 
                    .easing(TWEEN.Easing.Linear.None)  
                    .onUpdate(() => {
                        prism.position.z += speed * 16.67;
                    })
                    .onComplete(() => {
                        scene.remove(prism);
                    });
                
                scene.add(prism);    
                tween.start(); 
                });
            }, prismTime);

            Tone.Transport.scheduleOnce((scheduledTime) => {
                const perfect = urlParams.get('perfectrun');
                if (perfect === 'true'){
                    piano.keys[noteName].playAutomatedNote(duration, scheduledTime, color1);
                }
            }, time);
        });

        Tone.Transport.start(startTime);

        function animate() {
            requestAnimationFrame(animate);
            TWEEN.update(); 
            renderer.render(scene, camera);
        }

        animate();
    } catch (error) {
        console.error("Error loading MIDI or sampler:", error);
    }
}

function requestMIDIConnection() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess()
            .then(onMIDISuccess, onMIDIFailure);
    } else {
        console.error("MIDI is not supported in this browser.");
    }
}

function onMIDISuccess(midiAccess) {
    console.log("MIDI Access granted!");
    for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = handleMIDIMessage;
        console.log(`Connected: ${input.name}`);
    }
}

function onMIDIFailure() {
    console.error("Failed to get MIDI access.");
}

function handleMIDIMessage(message) {
    //console.log(notes);
    const [status, note, velocity] = message.data;

    if (status === 144 && velocity > 0) {
        piano.keys[noteConvert(note)].playRealNote(color1);
    }
} 

function noteConvert(midiNumber){
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const note = noteNames[midiNumber % 12];
    const octave = Math.floor(midiNumber / 12) - 1;
    return note + octave;
}

window.addEventListener('load', async () => {
    await playMidi(piano);
    requestMIDIConnection();
});

function openPopUp(){
    const back = document.querySelector('.darkBackground');
    back.style.display = 'flex';
    const popUpMenu = document.querySelector('.menuPopup');
    popUpMenu.style.display = 'flex'; 
}

function closePopUp(){
    const back = document.querySelector('.darkBackground');
    back.style.display = 'none';
    const popUpMenu = document.querySelector('.menuPopup');
    popUpMenu.style.display = 'none'; 
}

function restartSong(){
    window.location.reload();
}

function goToMenu(){
    window.location.href = `songs.html`;
}

function getRandomColor() {
    const rainbowColors = [ 
        '#FF7F00', 
        '#00FF00',
        '#0000FF', 
        '#4B0082', 
        '#8B00FF'
    ];

    const randomIndex = Math.floor(Math.random() * rainbowColors.length); 
    return rainbowColors[randomIndex];
}

function lightenColor(color) {
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    r = Math.min(255, Math.floor(r + (255 - r) * .25));
    g = Math.min(255, Math.floor(g + (255 - g) * .25));
    b = Math.min(255, Math.floor(b + (255 - b) * .25));

    return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(color, amount) {
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    r = Math.max(0, Math.floor(r - r * amount)); 
    g = Math.max(0, Math.floor(g - g * amount)); 
    b = Math.max(0, Math.floor(b - b * amount));

    return `rgb(${r}, ${g}, ${b})`;
}

function setUpStartCard(){
    const urlParams = new URLSearchParams(window.location.search);
    const startCard = document.createElement('div');
    startCard.classList.add('startCard');
    const song = document.createElement('div');
    song.classList.add('songName');
    const artist = document.createElement('div');
    artist.classList.add('artistName');
    song.innerText = urlParams.get('song');
    artist.innerText = urlParams.get('artist');
    startCard.appendChild(song);
    startCard.appendChild(artist);
    document.body.appendChild(startCard);
    setTimeout(() => {
        startCard.classList.add('hidden');
    }, 1);
}

function calculateScore(timePressed, perfectTimePressed){
    const score = document.querySelector('.scoreNum');
    let currScore = parseInt(score.innerText, 10);
    let scoreAdd = 0;
    const diff = Math.abs(perfectTimePressed - timePressed)
    if (diff <= .1){
        scoreAdd = 100;
    }
    else if(diff <= .2){
        const maxPoints = 100;
        const minPoints = 50;
        const maxDiff = 0.2;
        const minDiff = 0.11;
    
        scoreAdd = Math.round(maxPoints - ((diff - minDiff) / (maxDiff - minDiff)) * (maxPoints - minPoints));
    }
    else{
        scoreAdd = 0;
    }
    currScore += scoreAdd;
    score.innerText = currScore;
}

function reduceScore(){
    const score = document.querySelector('.scoreNum');
    let currScore = parseInt(score.innerText, 10);
    currScore -= 50;
    score.innerText = currScore;
}


