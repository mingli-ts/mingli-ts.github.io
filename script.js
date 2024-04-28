document.getElementById('startBtn').addEventListener('click', startLaps);
document.getElementById('stopBtn').addEventListener('click', stopProcess);

let mainIntervalId = null;
let lapIntervalId = null;
let restTimeoutId = null;
let readyTimeoutId = null;

function startLaps() {
    const numLaps = parseInt(document.getElementById('num-laps').value, 10);
    let currentLap = 0;

    function nextLap() {
        if (currentLap < numLaps) {
            currentLap++;
            document.getElementById('number-display').textContent = document.getElementById('number-display').textContent + "\nLap: " + currentLap;
            speakNumbersInLap(() => {
                if (currentLap < numLaps) {
                    scheduleRest();
                } else {
                    console.log("Completed all laps.");
                }
            });
        }
    }

    function scheduleRest() {
        const restDuration = parseInt(document.getElementById('rest-duration').value, 10) * 1000;
        console.log("Lap completed. Resting...");
        document.getElementById('number-display').textContent = document.getElementById('number-display').textContent + "\nRest";
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Rest"));
        restTimeoutId = setTimeout(() => {
            document.getElementById('number-display').textContent = document.getElementById('number-display').textContent + "\nGet ready";
            window.speechSynthesis.speak(new SpeechSynthesisUtterance("Get ready"));
            readyTimeoutId = setTimeout(nextLap, 5000); // Schedule next lap to start after "Get ready"
        }, restDuration - 5000); // Trigger "Get ready" 5 seconds before rest ends
    }

    nextLap(); // Start the first lap immediately
}

function speakNumbersInLap(completedCallback) {
    const numbersPerLap = parseInt(document.getElementById('numbers-per-lap').value, 10);
    const interval = parseInt(document.getElementById('interval-selector').value, 10);
    let count = 0;

    function speakNumber() {
        if (count < numbersPerLap) {
            const randomNumber = Math.floor(Math.random() * 5) + 1;
            const utterance = new SpeechSynthesisUtterance(randomNumber.toString());
            utterance.onend = () => {
                if (++count < numbersPerLap) {
                    setTimeout(speakNumber, interval); // Wait the interval before speaking the next number
                } else {
                    completedCallback(); // All numbers spoken, call the completion callback
                }
            };
            // document.getElementById('number-display').textContent = randomNumber;
            window.speechSynthesis.speak(utterance);
        }
    }

    speakNumber();
}

function stopProcess() {
    clearInterval(lapIntervalId);
    clearTimeout(restTimeoutId);
    clearTimeout(readyTimeoutId);
    document.getElementById('number-display').textContent = "Stopped";
    console.log("Process stopped by user.");
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
document.getElementById('stopBtn').addEventListener('click', buttonClickHandler);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
