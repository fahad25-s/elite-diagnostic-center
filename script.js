const firebaseConfig = {
  apiKey: "AIzaSyCSAWE6NYMb1jeGpUoDA03Ak3ZqargJemo",
  authDomain: "elite-diagnostic-abf78.firebaseapp.com",
  databaseURL: "https://elite-diagnostic-abf78-default-rtdb.firebaseio.com",
  projectId: "elite-diagnostic-abf78",
  storageBucket: "elite-diagnostic-abf78.firebasestorage.app",
  messagingSenderId: "631961470012",
  appId: "1:631961470012:web:7cdd1ed8e39455b15d2f39"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

document.addEventListener("DOMContentLoaded", function() {
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', generateTicket);
    }
});

function generateTicket() {
    db.ref('queue/total_issued').transaction((currentValue) => {
        return (currentValue || 0) + 1;
    }, (error, committed, snapshot) => {
        if (error) {
            console.error("Transaction failed: ", error);
            alert("Network error! Could not generate ticket.");
        } else if (committed) {
            const currentSerial = snapshot.val();
            const formattedSerial = '#' + String(currentSerial).padStart(3, '0');
            
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
            const formattedDateTime = now.toLocaleString('en-US', options);

            const numElem = document.getElementById('ticket-number');
            const timeElem = document.getElementById('ticket-time');

            if (numElem) numElem.innerText = formattedSerial;
            if (timeElem) timeElem.innerText = formattedDateTime;

            // সাউন্ড বাজানো এবং ইংরেজি ভয়েস বলা
            playToneAndVoice(currentSerial, () => {
                window.print();
            });
        }
    });
}

function playToneAndVoice(serialNumber, callback) {
    // ১. দুই ধাপের সুন্দর ডিং-ডং (Ding-Dong) টোন তৈরি
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // ১ম সুর (Ding)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
    gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.5);

    // ২য় সুর (Dong)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, audioCtx.currentTime + 0.3); // C5
    gain2.gain.setValueAtTime(0.3, audioCtx.currentTime + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.9);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(audioCtx.currentTime + 0.3);
    osc2.stop(audioCtx.currentTime + 0.9);

    // ২. ডিং-ডং টোন শেষ হলে ইংরেজিতে ডিক্লেয়ার করবে: "Next 1", "Next 2"...
    setTimeout(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const text = `Next ${serialNumber}`;
            const utterance = new SpeechSynthesisUtterance(text);
            
            utterance.lang = 'en-US'; // ইংরেজি ভয়েস
            utterance.rate = 0.85;    // স্বাভাবিক সুন্দর গতি

            utterance.onend = function() {
                if (callback) callback();
            };

            utterance.onerror = function() {
                if (callback) callback();
            };

            window.speechSynthesis.speak(utterance);
        } else {
            if (callback) callback();
        }
    }, 900);
}
