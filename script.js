// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCSAWE6NYMb1jeGpUoDA03Ak3ZqargJemo",
  authDomain: "elite-diagnostic-abf78.firebaseapp.com",
  databaseURL: "https://elite-diagnostic-abf78-default-rtdb.firebaseio.com",
  projectId: "elite-diagnostic-abf78",
  storageBucket: "elite-diagnostic-abf78.firebasestorage.app",
  messagingSenderId: "631961470012",
  appId: "1:631961470012:web:7cdd1ed8e39455b15d2f39"
};

// Initialize Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

function generateTicket() {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem('lastTicketDate');
    let currentSerial = parseInt(localStorage.getItem('currentSerial') || '0', 10);

    if (lastDate !== today) {
        currentSerial = 1;
        localStorage.setItem('lastTicketDate', today);
    } else {
        currentSerial += 1;
    }

    localStorage.setItem('currentSerial', currentSerial);

    const formattedSerial = '#' + String(currentSerial).padStart(3, '0');
    
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDateTime = now.toLocaleString('bn-BD', options);

    const ticketNumElem = document.getElementById('ticket-number');
    const ticketTimeElem = document.getElementById('ticket-time');

    if (ticketNumElem) ticketNumElem.innerText = formattedSerial;
    if (ticketTimeElem) ticketTimeElem.innerText = formattedDateTime;

    if (typeof firebase !== 'undefined') {
        firebase.database().ref('queue').update({
            total_issued: currentSerial
        });
    }

    window.print();
}

// DOM লোড হওয়ার পর বাটন কানেক্ট
document.addEventListener("DOMContentLoaded", function() {
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', generateTicket);
  }
});
