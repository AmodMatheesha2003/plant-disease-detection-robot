let statusText = document.getElementById("status");
let statuscircle = document.getElementById("statuscircle");

function resetStations() {
    document.querySelectorAll(".station").forEach(station => station.classList.remove("active"));
    statusText.innerText = "Robot Idle";
    
    statuscircle.classList.remove("motion", "idle");
    statuscircle.classList.add("idle");
}

function handleStationCheck(stationNumber) {
    statusText.innerText = "Robot in Motion..."; 
    statuscircle.classList.remove("idle");
    statuscircle.classList.add("motion"); 

    setTimeout(() => {
        resetStations(); 
        let station = document.getElementById(`station-${stationNumber}`);
        station.classList.add("active"); 
        statusText.innerText = `Checking Station ${stationNumber}`;
        
        setTimeout(() => {
            resetStations();
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
    
        }, 5000); 

    }, 5000); 
}


function handleNormalCheck() {
    statusText.innerText = "Robot In Motion..."; 
    statuscircle.classList.remove("idle", "checking");
    statuscircle.classList.add("motion"); 

    setTimeout(() => {
        resetStations(); 
        let station1 = document.getElementById("station-1");
        station1.classList.add("active"); 
        statusText.innerText = "Checking Station 01"; 

        setTimeout(() => {
            resetStations(); 
            statusText.innerText = "Robot In Motion..."; 
            statuscircle.classList.remove("motion");
            statuscircle.classList.add("idle"); 

            setTimeout(() => {
                let station2 = document.getElementById("station-2");
                station2.classList.add("active"); 
                statusText.innerText = "Checking Station 02"; 

                setTimeout(() => {
                    resetStations(); 
                    statusText.innerText = "Robot In Motion..."; 
                    statuscircle.classList.remove("motion");
                    statuscircle.classList.add("idle"); 

                    setTimeout(() => {
                        resetStations(); 
                    }, 2000); 
                }, 2000); 
            }, 2000); 
        }, 2000); 
    }, 2000); 
}


let infoIcon = document.getElementById("station1-info");
let popup = document.querySelector(".popup-box");

infoIcon.addEventListener("mouseenter", () => {
    popup.style.display = "block";
});

infoIcon.addEventListener("mouseleave", () => {
    popup.style.display = "none";
});



document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".info-status p").forEach((element) => {
        let statusText = element.textContent.trim().toLowerCase();

        if (statusText === "healthy") {
            element.classList.add("healthy");
        } else if (statusText === "warning") {
            element.classList.add("warning");
        }
    });
});

function captureImage() {
    const esp32IP = "192.168.157.138";
    const captureURL = `http://${esp32IP}/capture`;
    document.getElementById("captured").src = captureURL + "?t=" + new Date().getTime();
}