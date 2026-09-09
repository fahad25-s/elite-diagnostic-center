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

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Data Arrays
var ms_business = [
  "Outlook::https://outlook.office.com::outlook.png", 
  "OneDrive::https://www.office.com/launch/onedrive::onedrive.png", 
  "Word::https://www.office.com/launch/word::word.png", 
  "Excel::https://www.office.com/launch/excel::excel.png", 
  "Teams::https://teams.microsoft.com::teams.png", 
  "Office::https://www.office.com::office.png"
];

var ms_personal = [
  "Outlook::https://outlook.live.com/mail::outlook.png", 
  "OneDrive::https://onedrive.live.com::onedrive.png", 
  "Word::https://www.office.com/launch/word?auth=1::word.png", 
  "Excel::https://www.office.com/launch/excel?auth=1::excel.png", 
  "Teams::https://teams.live.com/_?utm_source=OfficeWeb::teams.png"
];

// List Generator Function
function makeMsList(msUrlList, msType) {
  if (!msUrlList) msUrlList = ms_business;
  
  var msHtmlData = "";
  for (let i = 0; i < msUrlList.length; i++) {
    var msName = msUrlList[i].split("::")[0] || "";
    var msUrl = msUrlList[i].split("::")[1] || "";
    var msImage = msUrlList[i].split("::")[2] || "";
    msHtmlData += "<a class='link' href='" + msUrl + "' target='_blank'><img src='images/" + msImage + "' /><br>" + msName + "</a>";
  }

  const listContainer = document.getElementById("ms_list");
  if (listContainer) {
    listContainer.innerHTML = msHtmlData;
  }
}

// Event Listeners (Safe DOM Loading)
document.addEventListener("DOMContentLoaded", function() {
  const businessBtn = document.getElementById("ms_type_business");
  const personalBtn = document.getElementById("ms_type_personal");

  if (businessBtn) {
    businessBtn.addEventListener("click", function() {
      makeMsList(ms_business, "business");
    });
  }

  if (personalBtn) {
    personalBtn.addEventListener("click", function() {
      makeMsList(ms_personal, "personal");
    });
  }

  // ডিফল্ট লিস্ট লোড
  makeMsList(ms_business, "business");
});
