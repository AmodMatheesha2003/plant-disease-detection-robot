import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC8dKSLSurlgo0pXkqIcVVz1xcaz5x_CQM",
    authDomain: "leaf-guard-bce3b.firebaseapp.com",
    databaseURL: "https://leaf-guard-bce3b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "leaf-guard-bce3b",
    storageBucket: "leaf-guard-bce3b.firebasestorage.app",
    messagingSenderId: "628893507596",
    appId: "1:628893507596:web:6dc1c748bd2166d9684e29",
    measurementId: "G-GN1W968K07"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Humidity = ref(database, 'sensor_data/humidity');
const Temperature = ref(database, 'sensor_data/temperature');

const plant1name = ref(database, 'Station/plant1/name');
const plant2name = ref(database, 'Station/plant2/name');

const plant1status = ref(database, 'Station/plant1/status');
const plant2status = ref(database, 'Station/plant2/status');

const plant1lastcheck = ref(database, 'Station/plant1/lastcheck');
const plant2lastcheck = ref(database, 'Station/plant2/lastcheck');

function updateElement(id, snapshot) {
    document.getElementById(id).innerHTML = snapshot.val();
}

onValue(Humidity, (snapshot) => updateElement("humidity", snapshot));
onValue(Temperature, (snapshot) => updateElement("temperature", snapshot));

onValue(plant1name, (snapshot) => updateElement("plant1_name", snapshot));
onValue(plant2name, (snapshot) => updateElement("plant2_name", snapshot));

onValue(plant1status, (snapshot) => updateElement("plant1_status", snapshot));
onValue(plant2status, (snapshot) => updateElement("plant2_status", snapshot));

onValue(plant1lastcheck, (snapshot) => updateElement("plant1_last_check", snapshot));
onValue(plant2lastcheck, (snapshot) => updateElement("plant2_last_check", snapshot));

onValue(plant1name, (snapshot) => updateElement("plant1_name_hide", snapshot));
onValue(plant2name, (snapshot) => updateElement("plant2_name_hide", snapshot));

onValue(plant1lastcheck, (snapshot) => updateElement("plant1_last_check_hide", snapshot));
onValue(plant2lastcheck, (snapshot) => updateElement("plant2_last_check_hide", snapshot));

document.addEventListener("DOMContentLoaded", function () {
    function updatePlantStatus(elementId, status) {
        let element = document.getElementById(elementId);

        if (element) {
            if (status === "Healthy") {
                element.innerHTML = `<p class="healthy">Healthy</p>`;
            } else if (status === "Rust" || status === "Powdery Mildew") {
                element.innerHTML = `<p class="warning">Warning</p>`;
            }
        }
    }

    onValue(plant1status, (snapshot) => {
        const status = snapshot.val();
        updatePlantStatus("plant1_status_alert", status);
        updatePlantStatus("plant1_status_alert_hide", status);
    });

    onValue(plant2status, (snapshot) => {
        const status = snapshot.val(); 
        updatePlantStatus("plant2_status_alert", status);
        updatePlantStatus("plant2_status_alert_hide", status);
    });
});

let statusText = document.getElementById("status");
let statuscircle = document.getElementById("statuscircle");

window.updateSelectedPlant = function(value) {
    set(ref(database, 'robotNavigation/user_selected_plant'), value)
    .then(() => {
        console.log("Updated user_selected_plant to:", value);

        if (value === 1) {
            stationOneCheck();
        } else if (value === 2) {
            stationTwoCheck();
        } else if (value === 0) {
            backMainStation();
        }
    })
    .catch((error) => {
        console.error("Error updating database:", error);
    });
};

function resetStations() {
    document.querySelectorAll(".station").forEach(station => station.classList.remove("active"));
    statusText.innerText = "Robot Idle";
    statuscircle.classList.remove("motion", "idle");
    statuscircle.classList.add("idle");
}

function stationOneCheck() {
    resetStations();
    statusText.innerText = "Robot in Motion...";
    statuscircle.classList.remove("idle");
    statuscircle.classList.add("motion");

    setTimeout(() => {
        resetStations();
        let station1 = document.getElementById("station-1");
        station1.classList.add("active");
        statusText.innerText = "IDLE : Station 01";
    }, 5000); 
}

function stationTwoCheck() {
    resetStations();
    statusText.innerText = "Robot in Motion...";
    statuscircle.classList.remove("idle");
    statuscircle.classList.add("motion");

    setTimeout(() => {
        resetStations();
        let station2 = document.getElementById("station-2");
        station2.classList.add("active");
        statusText.innerText = "IDLE : Station 02";
    }, 5000); 
}

function backMainStation() {
    statusText.innerText = "Robot in Motion...";
    statuscircle.classList.remove("idle");
    statuscircle.classList.add("motion");

    setTimeout(() => {
        resetStations();
        document.getElementById("main-station").classList.add("active");
        statusText.innerText = "Robot Idle";
        statuscircle.classList.remove("motion");
        statuscircle.classList.add("idle");
    }, 5000); 
}

document.getElementById('saveData-button').addEventListener('click', async function() {
    const u_select_plantRef = ref(database, 'robotNavigation/user_selected_plant');
    try {
        const snapshot = await get(u_select_plantRef);
        if (snapshot.exists()) {
            const uvalue = snapshot.val();
            const classification = document.getElementById("classification").innerText;
            const currentTime = new Date().toLocaleString();
            
            if (uvalue == 1) {
                set(ref(database, 'Station/plant1/status'), classification);
                set(ref(database, 'Station/plant1/lastcheck'), currentTime);
            } else if (uvalue == 2) {
                set(ref(database, 'Station/plant2/status'), classification);
                set(ref(database, 'Station/plant2/lastcheck'), currentTime);
            }
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});


