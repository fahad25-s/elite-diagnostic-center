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

            // অটোমেটিক টিউন ও ভয়েস অ্যানাউন্সমেন্ট
            playToneAndVoice(currentSerial);

            // টিকেট প্রিন্ট সংকেত
            window.print();
        }
    });
}

// সাউন্ড ও ভয়েস প্লে করার ফাংশন
function playToneAndVoice(serialNumber) {
    const bellAudio = document.getElementById('bellSound');
    
    // ১. প্রথমে টিউন বাজানো
    if (bellAudio) {
        bellAudio.currentTime = 0;
        bellAudio.play().then(() => {
            // টিউন শেষ হলে ভয়েস কল
            setTimeout(() => {
                speakSerial(serialNumber);
            }, 800);
        }).catch(() => {
            // সাউন্ড প্লে না হলে সরাসরি ভয়েস
            speakSerial(serialNumber);
        });
    } else {
        speakSerial(serialNumber);
    }
}

// বাংলায় ভয়েস অ্যানাউন্সমেন্ট ফাংশন
function speakSerial(serialNumber) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // আগের কোনো অ্যানাউন্সমেন্ট থাকলে তা বন্ধ করা

        const speechText = `আপনার টিকেট নম্বর ${serialNumber}`;
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = 'bn-BD';
        utterance.rate = 0.85; // সাবলীল গতি

        window.speechSynthesis.speak(utterance);
    }
}
