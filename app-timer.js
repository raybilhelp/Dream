import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBi89t5QO6YejicqBoE-JFBBWcaaEYygFA",
    authDomain: "tapzoearn.firebaseapp.com",
    projectId: "tapzoearn",
    storageBucket: "tapzoearn.firebasestorage.app",
    messagingSenderId: "29421959058",
    appId: "1:29421959058:web:56be0c351b82396b1d334b",
    measurementId: "G-06V17MJMHB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Global notification function
window.notify = (msg, col = "#00e5ff") => {
    const t = document.getElementById('notification-toast');
    t.innerText = msg; t.style.borderColor = col;
    t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000);
};

async function getNetworkTime() {
    try {
        const res = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        const data = await res.json();
        return new Date(data.utc_datetime).getTime();
    } catch(e) { return Date.now(); }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        let deviceID = localStorage.getItem('mk_device_id');
        if (!deviceID) {
            deviceID = "MK-" + Math.random().toString(36).substring(2, 10).toUpperCase();
            localStorage.setItem('mk_device_id', deviceID);
        }
        document.getElementById('displayID').innerText = deviceID;

        const userRef = doc(db, "users", deviceID);
        try {
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
                await setDoc(userRef, { 
                    uid: user.uid, deviceId: deviceID, 
                    status: "free", expiry: 0, createdAt: serverTimestamp() 
                });
            } else if (snap.data().uid !== user.uid) {
                // Security check: If someone else owns the ID, regenerate
                localStorage.removeItem('mk_device_id');
                location.reload();
            }
        } catch (e) {
            // Permission error handled by regenerating ID
            localStorage.removeItem('mk_device_id');
            location.reload();
        }
        verify();
    } else { signInAnonymously(auth); }
});

async function verify() {
    const id = localStorage.getItem('mk_device_id');
    if(!id) return;
    const btn = document.getElementById('verifyBtn');
    btn.disabled = true; btn.innerText = "Syncing Cloud...";

    const netTime = await getNetworkTime();
    const userRef = doc(db, "users", id);
    const snap = await getDoc(userRef);
    
    if(snap.exists()){
        const d = snap.data();
        const exp = d.expiry;
        const status = d.status;

        if(status === "premium" && (exp === 'lifetime' || exp > netTime)){
            updateUI("premium", exp, netTime);
        } else {
            updateUI("free");
            // Premium-to-Free Only (Hard Security Logic)
            if(status === "premium") {
                try {
                    await updateDoc(userRef, { status: "free" });
                    notify("License Expired!", "#ff3131");
                } catch (e) { console.log("Self-downgrade ready."); }
            }
        }
    }
    btn.disabled = false; btn.innerText = "Verify Access Status";
}

function updateUI(status, exp, now) {
    const box = document.getElementById('statusBox');
    const st = document.getElementById('uiStatus');
    const badge = document.getElementById('uiBadge');
    if(status === "premium") {
        box.className = "neon-box green-border";
        st.innerText = "ACTIVE / PREMIUM"; st.style.color = "var(--neon-green)";
        badge.innerText = "PREMIUM ACTIVE"; badge.style.borderColor = "var(--neon-green)";
        if(exp === 'lifetime') {
            document.getElementById('uiExpire').innerText = "Lifetime";
            document.getElementById('uiTimeLeft').innerText = "Infinity";
        } else {
            const diff = exp - now;
            document.getElementById('uiExpire').innerText = new Date(exp).toLocaleDateString();
            document.getElementById('uiTimeLeft').innerText = Math.floor(diff/(1000*60*60)) + "h : " + Math.floor((diff%(1000*60*60))/(1000*60)) + "m";
        }
    } else {
        box.className = "neon-box red-border";
        st.innerText = "FREE / EXPIRED"; st.style.color = "var(--neon-red)";
        badge.innerText = "FREE STATUS"; badge.style.borderColor = "#444";
        document.getElementById('uiExpire').innerText = "N/A";
        document.getElementById('uiTimeLeft').innerText = "00h : 00m";
    }
}

// Event Listeners
document.getElementById('verifyBtn').addEventListener('click', verify);
document.getElementById('copyBtn').addEventListener('click', () => {
    const id = document.getElementById('displayID').innerText;
    const el = document.createElement('textarea'); el.value = id; document.body.appendChild(el);
    el.select(); document.execCommand('copy'); document.body.removeChild(el);
    notify("ID Copied: " + id);
});
