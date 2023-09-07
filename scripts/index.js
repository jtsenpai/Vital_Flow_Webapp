import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, GeoPoint, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
    apiKey: "AIzaSyBCnsX0mKYMAAhhwMmkJLstCC24j9mOhnw",
    authDomain: "vital-flow-fc471.firebaseapp.com",
    databaseURL: "https://vital-flow-fc471-default-rtdb.firebaseio.com",
    projectId: "vital-flow-fc471",
    storageBucket: "vital-flow-fc471.appspot.com",
    messagingSenderId: "697531931632",
    appId: "1:697531931632:web:79cbed030b3a3267795b35"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);




/* -------------------------- REFERENCES -------------------------- */
let IdBoxEl = document.getElementById('Idbox');
let NameBoxEl = document.getElementById("Namebox");
let PhoneBoxEl = document.getElementById("Phonebox");
let GenoBoxEl = document.getElementById("Genobox");

let insBtnEl = document.getElementById("Insbtn");
let selBtnEl = document.getElementById("Selbtn");
let updBtnEl = document.getElementById("Updbtn");
let delBtnEl = document.getElementById("Delbtn");

const geoPoint = new GeoPoint(6.429642, 3.410242);


GenoBoxEl.selectedIndex = -1;

function clearTextInput() {
    IdBoxEl.value = "";
    NameBoxEl.value = "";
    PhoneBoxEl.value = "";
    GenoBoxEl.selectedIndex = -1;

    location.reload();
}

/* ------------------- ADDING DOCUMENT ------------------- */


async function AddDocument_CustomID() {
    var ref = doc(db, "patients", IdBoxEl.value);

    await setDoc(
        ref, {
        id: IdBoxEl.value,
        patientName: NameBoxEl.value,
        contactNo: PhoneBoxEl.value,
        bloodGroup: GenoBoxEl.value,
        location: geoPoint
    }
    ).then(() => {
        alert('Data added successfully');
    }).catch((error) => {
        alert('Unsuccessful operation, error: ' + error);
    });

    clearTextInput();

}

/* ------------------- ADDING DOCUMENT ------------------- */
async function GetDocument() {
    var ref = doc(db, "patients", IdBoxEl.value);
    const docSnap = await getDoc(ref)

    if (docSnap.exists()) {
        NameBoxEl.value = docSnap.data().patientName;
        PhoneBoxEl.value = docSnap.data().contactNo;
        GenoBoxEl.value = docSnap.data().bloodGroup;
    } else {
        alert("No such document")
    }
}

/* ------------------- UPDATING DOCUMENT ------------------- */
async function UpdateFieldsInADocument() {
    var ref = doc(db, "patients", IdBoxEl.value);

    await updateDoc(
        ref, {
        patientName: NameBoxEl.value,
        contactNo: PhoneBoxEl.value,
        bloodGroup: GenoBoxEl.value,
        location: geoPoint
    }
    ).then(() => {
        alert('Data updated successfully');
    }).catch((error) => {
        alert('Unsuccessful operation, error: ' + error);
    });

    clearTextInput();
}

/* ------------------- UPDATING DOCUMENT ------------------- */
async function DeleteDocument() {
    var ref = doc(db, "patients", IdBoxEl.value);
    const docSnap = await getDoc(ref);

    if (!docSnap.exists()) {
        alert('Document does not exist')
        return;
    }

    await deleteDoc(ref)
        .then(() => {
            alert('data deleted successfully');
        }).catch((err) => {
            alert("Unsuccessful operation, error: " + err);
        });
}

insBtnEl.addEventListener('click', AddDocument_CustomID);
selBtnEl.addEventListener('click', GetDocument);
updBtnEl.addEventListener("click", UpdateFieldsInADocument);
delBtnEl.addEventListener("click", DeleteDocument);

var patNo = 0;
var tbody = document.getElementById("patientTable");
function AddItemToTable(patientName, contactNo, bloodGroup, location) {
    let trow = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");

    td1.innerHTML = ++patNo;
    td2.innerHTML = patientName;
    td3.innerHTML = contactNo;
    td4.innerHTML = bloodGroup;
    td5.innerHTML = location;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);

    tbody.appendChild(trow);
}


function AddAllItemsToTable(ThePatient) {
    patNo = 0;
    tbody.innerHTML = "";
    ThePatient.forEach(element => {
        AddItemToTable(element.id, element.patientName, element.contactNo, 'Adeola Odeku', element.bloodGroup);
    });
}

async function displayData() {
    const querySnapshot = await getDocs(collection(db, 'patients'))

    var patients = [];
    querySnapshot.forEach(doc => {
        patients.push(doc.data());
    });

    AddAllItemsToTable(patients);
}

window.onload = displayData;
