async function getNetTime() {
    try {
        const res = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        const data = await res.json();
        return new Date(data.utc_datetime).getTime();
    } catch(e) { return Date.now(); }
}
