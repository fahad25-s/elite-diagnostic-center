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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// বাংলা ডিজিট কনভার্টার
function getBanglaNumber(num) {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => banglaDigits[digit] || digit).join('');
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

    // ফরম্যাটিং (যেমন: #001)
    const formattedSerial = '#' + String(currentSerial).padStart(3, '0');
    
    // তারিখ ও সময়
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDateTime = now.toLocaleString('bn-BD', options);

    // টিকেটের এলিমেন্টে ডাটা বসানো
    document.getElementById('ticket-number').innerText = formattedSerial;
    document.getElementById('ticket-time').innerText = formattedDateTime;

    // ১. ফায়ারবেস ডাটাবেজে মোট টিকেট ও অবজেক্ট সেভ
    database.ref('queue/total_issued').set(currentSerial);

    // ২. প্রিন্ট কমান্ড
    window.print();
}
