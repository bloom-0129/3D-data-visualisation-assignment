// console.log("Script loaded");

let sheetLoaded = false;
let userLoggedIn = false;
window._sceneInitialized = false;

// Data from Google Sheet
let peopleData = []; 



// ------------------------
// GOOGLE LOGIN
// ------------------------
window.handleLogin = (response) => {
    const data = JSON.parse(atob(response.credential.split(".")[1]));
    alert("Logged in as: " + data.email);

    document.querySelector(".g_id_signin").style.display = "none";
    document.getElementById("container").style.display = "block";
    document.getElementById("menu").style.display = "block";

    userLoggedIn = true;

    if (sheetLoaded && !window._sceneInitialized) {
        init();
        animate();
        window._sceneInitialized = true;
    }
};



// ------------------------
// THREE IMPORTS
// ------------------------
import * as THREE from "three";
import TWEEN from "three/addons/libs/tween.module.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";



// ------------------------
// GLOBALS
// ------------------------
let camera, scene, renderer, controls;
const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };



// ------------------------
// LOAD SHEET
// ------------------------
async function loadSheetData() {
    const url =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSK9W1YBPru4itlUuJ9eLInp7UoWqNmlDZ2seD1JBdh4_D7Pq2Aq7Wb7RLqstbGSON4aKca3zS6LEHv/pub?output=tsv";

    const response = await fetch(url);
    const text = await response.text();

    const rows = text.trim().split("\n").map(r => r.split("\t"));
    rows.shift(); 

    return rows.map((row, index) => ({
        name: row[0],
        photo: row[1],
        age: row[2],
        country: row[3],
        interest: row[4],
        networth: row[5],

        autoX: 1 + (index % 20),    
        autoY: 1 + Math.floor(index / 20),
        col: (index % 18) + 1
    }));
}

loadSheetData().then(data => {
    peopleData = data;
    sheetLoaded = true;

    if (userLoggedIn && !window._sceneInitialized) {
        init();
        animate();
        window._sceneInitialized = true;
    }
});



// ------------------------
// INIT 3D SCENE
// ------------------------
function init() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3200; // slightly further so layouts breathe more

    scene = new THREE.Scene();


    // --- CREATE ELEMENTS ---
    for (let i = 0; i < peopleData.length; i++) {
        const p = peopleData[i];
        const { name, photo, age, interest, networth, autoX, autoY } = p;
        
        const el = document.createElement("div");
        el.className = "element";

        // --- FIXED NETWORTH COLOUR LOGIC ---
        console.log("NETWORTH RAW:", networth);

        let rawWorth = networth || "";
        let numericWorth = parseFloat(rawWorth.replace(/[$,]/g, ""));

        if (isNaN(numericWorth)) numericWorth = 0;

        // Keep original formatting:
        let formattedWorth = rawWorth;

        // Colours:
        if (numericWorth < 100000) {
            el.style.backgroundColor = "rgba(255, 0, 0, 0.6)";   // RED
        }
        else if (numericWorth > 200000) {
            el.style.backgroundColor = "rgba(0, 200, 0, 0.6)";   // GREEN
        }
        else {
            el.style.backgroundColor = "rgba(255, 165, 0, 0.6)"; // ORANGE
        }


        // --- PHOTO ---
        if (photo) {
            const img = document.createElement("img");
            img.src = photo;
            img.style.width = "100%";
            img.style.height = "320px";
            img.style.objectFit = "cover";
            el.appendChild(img);
        }


        // DETAILS
        const details = document.createElement("div");
        details.className = "details";
        details.innerHTML = `
            <b>${name || "Unknown"}</b><br>
            Age: ${age || "-"}<br>
            Interest: ${interest || "-"}<br>
            Net Worth: ${formattedWorth}
        `;
        el.appendChild(details);


        // CSS3D Object
        const cssObj = new CSS3DObject(el);
        cssObj.position.x = Math.random() * 4000 - 2000;
        cssObj.position.y = Math.random() * 4000 - 2000;
        cssObj.position.z = Math.random() * 4000 - 2000;

        scene.add(cssObj);
        objects.push(cssObj);


        // --- FIXED TABLE POSITION (20 x 10, centred) ---
        const obj = new THREE.Object3D();
        obj.position.x = (autoX - 10.5) * 200;
        obj.position.y = -(autoY - 5.5) * 280;

        targets.table.push(obj);
    }


    // ----- SPHERE -----
    const vector = new THREE.Vector3();
    for (let i = 0, l = objects.length; i < l; i++) {
        const phi = Math.acos(-1 + (2 * i) / l);
        const theta = Math.sqrt(l * Math.PI) * phi;

        const obj = new THREE.Object3D();
        obj.position.setFromSphericalCoords(1300, phi, theta);

        vector.copy(obj.position).multiplyScalar(2);
        obj.lookAt(vector);

        targets.sphere.push(obj);
    }

    // ----- HELIX -----
    for (let i = 0, l = objects.length; i < l; i++) {

    const obj = new THREE.Object3D();

    // index for each vertical step (two tiles per step)
    const base = Math.floor(i / 2);

    // tighter rotation (smaller angle gap)
    const thetaBase = base * 0.18;       // ← tighter angle → tighter spacing

    // tighter vertical spacing
    const y = (base * 22) - (l * 6);      // ← smaller vertical gap

    // two strands (180 degrees apart)
    const theta = (i % 2 === 0)
        ? thetaBase
        : thetaBase + Math.PI;

    // wider radius but not too large (prevents tower look)
    obj.position.setFromCylindricalCoords(1500, theta, y);

    // make cards face outward
    const vector = new THREE.Vector3(
        obj.position.x * 2,
        obj.position.y,
        obj.position.z * 2
    );
    obj.lookAt(vector);

    targets.helix.push(obj);
}

    // ----- GRID (5 x 4 x 10) -----
    for (let i = 0; i < objects.length; i++) {
        const obj = new THREE.Object3D();

        const x = i % 5;
        const y = Math.floor(i / 5) % 4;
        const z = Math.floor(i / 20);

        obj.position.x = (x * 300) - 600;
        obj.position.y = -(y * 300) + 450;
        obj.position.z = (z * 700) - 3500;

        targets.grid.push(obj);
    }


    // ----- RENDERER -----
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(renderer.domElement);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener("change", render);


    // BUTTONS
    document.getElementById("table").addEventListener("click", () => transform(targets.table, 2000));
    document.getElementById("sphere").addEventListener("click", () => transform(targets.sphere, 2000));
    document.getElementById("helix").addEventListener("click", () => transform(targets.helix, 2000));
    document.getElementById("grid").addEventListener("click", () => transform(targets.grid, 2000));

    transform(targets.table, 2000);

    window.addEventListener("resize", onWindowResize);
}



// ------------------------
// TRANSFORMS
// ------------------------
function transform(targets, duration) {
    TWEEN.removeAll();

    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const target = targets[i];

        new TWEEN.Tween(object.position)
            .to({ x: target.position.x, y: target.position.y, z: target.position.z },
                Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
            .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
                Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }

    new TWEEN.Tween({})
        .to({}, duration * 2)
        .onUpdate(render)
        .start();
}



// ------------------------
// WINDOW RESIZE
// ------------------------
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}



// ------------------------
// RENDER + ANIMATE
// ------------------------
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}





