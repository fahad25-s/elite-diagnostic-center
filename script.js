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
    const doctorSelect = document.getElementById('doctorSelect');
    
    if (!doctorSelect) {
        alert("ডাক্তার সিলেক্ট করার অপশন পাওয়া যায়নি!");
        return;
    }

    const doctorKey = doctorSelect.value; // যেমন: doctor_1
    const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text; // ডাক্তারের নাম

    // সিলেক্ট করা ডাক্তারের নির্দিষ্ট পাথে কাউন্ট ট্রানজেকশন (যেমন: queue/doctor_1/total_issued)
    db.ref(`queue/${doctorKey}/total_issued`).transaction((currentValue) => {
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
            const formattedDateTime = now.toLocaleString('bn-BD', options); // বাংলা ডেট ফরম্যাট

            // টিকেটে ডাটা বসানো
            const docElem = document.getElementById('ticket-doctor');
            const numElem = document.getElementById('ticket-number');
            const timeElem = document.getElementById('ticket-time');

            if (docElem) docElem.innerText = doctorName;
            if (numElem) numElem.innerText = formattedSerial;
            if (timeElem) timeElem.innerText = formattedDateTime;

            // ডাক্তারের নাম ফায়ারবেসে সেভ রাখা
            db.ref(`queue/${doctorKey}/name`).set(doctorName);

            // কোনো সাউন্ড ছাড়া সরাসরি নিঃশব্দে প্রিন্ট
            window.print();
        }
    });
}
