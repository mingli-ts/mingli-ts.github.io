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

let isRunning = false;
let currentLap = 0;
let numLaps = null; // Total number of laps - adjustable as needed
let numbersPerLap = null; // Numbers per lap - adjustable as needed
let lapIntervalId = null;
let restTimeoutId = null;
let nextLapTimeoutId = null;

function addText(text) {
    document.getElementById('number-display').textContent += ("\n" + text);

}

function toggleStartPause() {
    if (!isRunning) {
        document.getElementById('startBtn').textContent = 'Reset';
        isRunning = true;
        startNextLap();
    } else {
        document.getElementById('startBtn').textContent = 'Start';
        resetApp();
        isRunning = false;
    }
}

function startNextLap() {
    const numLaps = parseInt(document.getElementById('num-laps').value, 10);
    const restDuration = parseInt(document.getElementById('rest-duration').value, 10) * 1000;
    const numbersPerLap = parseInt(document.getElementById('hits-per-lap').value, 10);
    if (currentLap < numLaps) {
        currentLap++;
        addText("Lap " + currentLap);
        speakNumbersInLap(numbersPerLap, () => {
            if (currentLap < numLaps) {
                addText("Rest");
                window.speechSynthesis.speak(new SpeechSynthesisUtterance("Rest"));
                console.log("Resting...");
                restTimeoutId = setTimeout(() => {
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Get ready"));
                    addText("Get ready")
                }, restDuration - 5000);
                nextLapTimeoutId = setTimeout(startNextLap, restDuration);
            } else {
                console.log("Completed all laps.");
                addText("All done");
            }
        });
    }
}

function speakNumbersInLap(count, completedCallback) {
    let numberCount = 0;
    const interval = parseInt(document.getElementById('interval-selector').value, 10);
    const numberTargets = parseInt(document.getElementById('numbers-of-targets').value, 10);

    function speakNumber() {
        if (numberCount < count) {
            const randomNumber = Math.floor(Math.random() * numberTargets) + 1;
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

function resetApp() {
    clearInterval(lapIntervalId);
    clearTimeout(restTimeoutId);
    clearTimeout(nextLapTimeoutId);
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

