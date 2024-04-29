if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

document.getElementById('startBtn').addEventListener('click', toggleStartPause);
document.getElementById('refreshBtn').addEventListener('click', refreshApp);

let isRunning = false;
let currentLap = 0;
let numLaps = 5; // Total number of laps - adjustable as needed
let numbersPerLap = 10; // Numbers per lap - adjustable as needed
let lapIntervalId = null;
let restTimeoutId = null;

function toggleStartPause() {
    if (!isRunning) {
        document.getElementById('startBtn').textContent = 'Pause';
        isRunning = true;
        startNextLap();
    } else {
        document.getElementById('startBtn').textContent = 'Start';
        pauseLaps();
        isRunning = false;
    }
}

function startNextLap() {
    if (currentLap < numLaps) {
        currentLap++;
        speakNumbersInLap(numbersPerLap, () => {
            if (currentLap < numLaps) {
                let restDuration = 30000; // Rest duration in milliseconds - adjustable as needed
                restTimeoutId = setTimeout(startNextLap, restDuration);
            } else {
                console.log("Completed all laps.");
            }
        });
    }
}

function speakNumbersInLap(count, completedCallback) {
    let numberCount = 0;
    let interval = 1000; // Time between numbers in milliseconds - adjustable as needed

    function speakNumber() {
        if (numberCount < count) {
            const randomNumber = Math.floor(Math.random() * 5) + 1;
            document.getElementById('number-display').textContent = randomNumber;
            const utterance = new SpeechSynthesisUtterance(randomNumber.toString());
            window.speechSynthesis.speak(utterance);
            numberCount++;
        }
        if (numberCount >= count) {
            clearInterval(lapIntervalId);
            completedCallback();
        }
    }

    lapIntervalId = setInterval(speakNumber, interval);
}

function pauseLaps() {
    clearInterval(lapIntervalId);
    clearTimeout(restTimeoutId);
}

function refreshApp() {
    clearInterval(lapIntervalId);
    clearTimeout(restTimeoutId);
    isRunning = false;
    currentLap = 0;
    document.getElementById('startBtn').textContent = 'Start';
    document.getElementById('number-display').textContent = '';
    console.log("Application has been reset to initial state.");
}


let debounceTimer;
const buttonClickHandler = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    // Your button click functionality here
    console.log("Button clicked");
  }, 300); // Adjust the delay as needed to improve responsiveness
};

document.getElementById('startBtn').addEventListener('click', buttonClickHandler);
document.getElementById('refreshBtn').addEventListener('click', buttonClickHandler);

