import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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

    // Listen for changes in plant1 status
    onValue(plant1status, (snapshot) => {
        const status = snapshot.val(); // Get actual value
        updatePlantStatus("plant1_status_alert", status);
        updatePlantStatus("plant1_status_alert_hide", status);
    });

    // Listen for changes in plant2 status
    onValue(plant2status, (snapshot) => {
        const status = snapshot.val(); // Get actual value
        updatePlantStatus("plant2_status_alert", status);
        updatePlantStatus("plant2_status_alert_hide", status);
    });
});

