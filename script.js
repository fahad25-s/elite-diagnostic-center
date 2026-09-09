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
            alert("নেটওয়ার্ক সমস্যা! টিকেট জেনারেট করা যাচ্ছে না।");
        } else if (committed) {
            const currentSerial = snapshot.val();
            const formattedSerial = '#' + String(currentSerial).padStart(3, '0');
            
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
            const formattedDateTime = now.toLocaleString('bn-BD', options);

            const numElem = document.getElementById('ticket-number');
            const timeElem = document.getElementById('ticket-time');

            if (numElem) numElem.innerText = formattedSerial;
            if (timeElem) timeElem.innerText = formattedDateTime;

            // অডিও এবং ভয়েস প্লে করার পর প্রিন্ট কমান্ড রান হবে
            playToneAndVoice(currentSerial, () => {
                window.print();
            });
        }
    });
}

function playToneAndVoice(serialNumber, callback) {
    // অডিও ওয়েবসাইট পেজে কোনো বাধা ছাড়া তৈরি করা
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // ১. একটি বিফ/টোন সাউন্ড তৈরি করা (কোনো এক্সটার্নাল ফাইলের ওপর নির্ভরতা ছাড়া)
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5 note
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.3); // ০.৩ সেকেন্ডের সুন্দর টোন

    // ২. টোন বাজার পর ভয়েস দেওয়া
    setTimeout(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const text = `আপনার টিকেট নম্বর ${serialNumber}`;
            const utterance = new SpeechSynthesisUtterance(text);
            
            // ভাষা সেটআপ
            utterance.lang = 'bn-BD';
            utterance.rate = 0.8;

            // ভয়েস শেষ হলে প্রিন্ট অপশন চালু হবে
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
    }, 400);
}
