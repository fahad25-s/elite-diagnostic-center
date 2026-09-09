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

            // অডিও সাউন্ড এবং ভয়েস প্লে
            playAudioSequence(currentSerial);

            // টিকেট প্রিন্ট সংকেত
            window.print();
        }
    });
}

function playAudioSequence(serialNumber) {
    // সাউন্ড বেল প্লে করা
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    
    audio.play().then(() => {
        // বেল বাজার পর ভয়েস
        setTimeout(() => {
            speakBengali(serialNumber);
        }, 600);
    }).catch(err => {
        console.warn("Audio autoplay error, playing speech directly:", err);
        // সাউন্ড ব্লক থাকলে সরাসরি ভয়েস অ্যানাউন্স করবে
        speakBengali(serialNumber);
    });
}

function speakBengali(serialNumber) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // আগের কোনো বক্তব্য থাকলে ক্লিয়ার করা
        
        const utterance = new SpeechSynthesisUtterance(`আপনার টিকেট নম্বর ${serialNumber}`);
        utterance.lang = 'bn-BD';
        utterance.rate = 0.85;

        window.speechSynthesis.speak(utterance);
    }
}
