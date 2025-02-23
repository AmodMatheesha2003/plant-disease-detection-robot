let statusText = document.getElementById("status");

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

document.getElementById('classify-button').addEventListener('click', async function() {
    const capturedImage = document.getElementById('captured').src;

    if (capturedImage === 'loading.jpg') {
        alert('Please capture an image first!');
        return;
    }

    try {
        const formData = new FormData();
        const response = await fetch(capturedImage, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Error fetching the image');
        }

        const imageBlob = await response.blob();
        formData.append('file', imageBlob, 'captured.jpg');

        const apiResponse = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: formData
        });

        const data = await apiResponse.json();

        if (apiResponse.ok) {
            document.getElementById('classification').innerText = `Classification: ${data.classification} (Confidence: ${data.confidence})`;
        } else {
            document.getElementById('classification').innerText = 'Error: Unable to classify image';
        }
    } catch (error) {
        document.getElementById('classification').innerText = 'Error: ' + error.message;
    }
});
