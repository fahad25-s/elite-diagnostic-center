function generateTicket() {
    // ১. আজকের তারিখ বের করা (YYYY-MM-DD ফরম্যাটে)
    let today = new Date().toISOString().slice(0, 10);
    
    // LocalStorage থেকে আগের সেভ করা তারিখ ও সিরিয়াল নম্বর পড়া
    let lastSavedDate = localStorage.getItem('lastTicketDate');
    let currentNumber = localStorage.getItem('lastTicketNum') || 0;

    // ২. তারিখ চেক করা: আজকের তারিখ যদি আগের সেভ করা তারিখের সমান না হয় (নতুন দিন হয়)
    if (lastSavedDate !== today) {
        currentNumber = 0; // নতুন দিন হলে সিরিয়াল রসেট করে ০ করে দেওয়া
        localStorage.setItem('lastTicketDate', today); // নতুন তারিখ সেভ করা
    }

    // ৩. সিরিয়াল নম্বর ১ বাড়ানো
    currentNumber = parseInt(currentNumber) + 1;

    // ৪. আপডেট করা তথ্য LocalStorage-এ সেভ করা
    localStorage.setItem('lastTicketNum', currentNumber);

    // ৫. টিকেট ফরম্যাট করা (#001, #002...)
    let formattedNum = "#" + String(currentNumber).padStart(3, '0');
    document.getElementById('ticket-number').innerText = formattedNum;

    // ৬. টিকেটে বর্তমান সময় ও বাংলা তারিখ প্রিন্ট করা
    let now = new Date();
    let dateStr = now.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) + " | " + now.toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    document.getElementById('ticket-time').innerText = dateStr;

    // ৭. ব্রাউজারের প্রিন্ট ডায়ালগ চালু করা
    window.print();
}