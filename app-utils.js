// HTML এর ২য় পার্ট এখানেই লুকিয়ে রাখা হয়েছে
const uiTemplate = `
    <div id="toast" style="position:fixed;top:-100px;left:50%;transform:translateX(-50%);transition:0.5s;background:#111;border:1px solid #00e5ff;padding:15px;border-radius:10px;z-index:10000;width:80%;text-align:center;font-size:0.8rem"></div>
    <div class="main-card">
        <div id="uiBadge" class="status-badge">SYNCING...</div>
        <div class="premium-title">MK PREMUIM AI</div>
        <div class="purple-border" id="copyBtn" style="padding:15px;margin:15px 0;border-radius:10px">
            <div id="displayID" style="color:#00e5ff;font-weight:bold;font-size:1.1rem">LOADING...</div>
            <div style="font-size:0.6rem;color:#ff00ff">CLICK TO COPY</div>
        </div>
        <div id="statusBox" class="neon-box red-border" style="padding:15px;border-radius:10px;margin-bottom:15px">
            <div class="info-row"><span>STATUS:</span><span id="uiStatus" style="color:#ff3131">FREE</span></div>
            <div class="info-row"><span>EXPIRE:</span><span id="uiExpire">N/A</span></div>
            <div class="info-row"><span>REMAINING:</span><span id="uiTimeLeft">00:00</span></div>
        </div>
        <button class="btn-cyan" id="verifyBtn">Verify Access</button>
    </div>
`;
document.getElementById('root').innerHTML = uiTemplate;

function notify(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg; t.style.top = "20px";
    setTimeout(() => t.style.top = "-100px", 3000);
}
