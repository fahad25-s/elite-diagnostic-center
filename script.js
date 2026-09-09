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

    // দিন পরিবর্তন হলে সিরিয়াল ১ থেকে শুরু হবে
    if (lastDate !== today) {
        currentSerial = 1;
        localStorage.setItem('lastTicketDate', today);
    } else {
        currentSerial += 1;
    }

    localStorage.setItem('currentSerial', currentSerial);

    // ফরম্যাটিং (#001, #002)
    const formattedSerial = '#' + String(currentSerial).padStart(3, '0');
    
    // তারিখ ও সময়
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDateTime = now.toLocaleString('bn-BD', options);

    // টিকেটে তথ্য বসানো
    document.getElementById('ticket-number').innerText = formattedSerial;
    document.getElementById('ticket-time').innerText = formattedDateTime;

    // ফায়ারবেসে আপডেট পাঠানো
    if (typeof firebase !== 'undefined') {
        firebase.database().ref('queue').update({
            total_issued: currentSerial
        }).then(() => {
            console.log("Firebase Updated Successfully!");
        }).catch((err) => {
            console.error("Firebase Error:", err);
        });
    }

    // প্রিন্ট কমান্ড
    window.print();
}
