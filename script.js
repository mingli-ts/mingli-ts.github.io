document.getElementById('startBtn').addEventListener('click', startRandomNumbers);
document.getElementById('stopBtn').addEventListener('click', stopRandomNumbers);

let intervalId = null;

function startRandomNumbers() {
    if (intervalId !== null) return; // Prevent multiple intervals if already started
    intervalId = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * 5) + 1;
        // document.getElementById('number-display').textContent = randomNumber;
        speakNumber(randomNumber);
    }, 1000);
}

function stopRandomNumbers() {
    clearInterval(intervalId);
    intervalId = null;
}

function speakNumber(number) {
    const speech = new SpeechSynthesisUtterance(number.toString());
    window.speechSynthesis.speak(speech);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
