auth.onAuthStateChanged(async (user) => {
    if (!user) { auth.signInAnonymously(); return; }
    
    let dID = localStorage.getItem('mk_device_id') || "MK-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    localStorage.setItem('mk_device_id', dID);
    document.getElementById('displayID').innerText = dID;

    const userRef = db.collection("users").doc(dID);
    const snap = await userRef.get();
    if (!snap.exists()) {
        await userRef.set({ uid: user.uid, deviceId: dID, status: "free", expiry: 0 });
    }
    runVerification();
});

async function runVerification() {
    const dID = localStorage.getItem('mk_device_id');
    const netTime = await getNetTime();
    const snap = await db.collection("users").doc(dID).get();
    
    if (snap.exists()) {
        const data = snap.data();
        const exp = data.expiry;
        const box = document.getElementById('statusBox');
        
        if (exp === 'lifetime' || exp > netTime) {
            box.className = "red-border green-border"; // চালকি করলাম নাম বদলে
            document.getElementById('uiStatus').innerText = "PREMIUM";
            document.getElementById('uiStatus').style.color = "#00ff00";
            document.getElementById('uiBadge').innerText = "PREMIUM ACTIVE";
            if(exp !== 'lifetime') {
                const diff = exp - netTime;
                document.getElementById('uiTimeLeft').innerText = Math.floor(diff/(1000*60*60)) + "h";
                document.getElementById('uiExpire').innerText = new Date(exp).toLocaleDateString();
            }
        }
    }
}

document.getElementById('verifyBtn').onclick = () => { notify("Synchronizing with server..."); runVerification(); };
document.getElementById('copyBtn').onclick = () => {
    const txt = document.getElementById('displayID').innerText;
    navigator.clipboard.writeText(txt); notify("ID Copied!");
};
