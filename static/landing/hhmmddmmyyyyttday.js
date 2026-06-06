var date;
var time;

function updateTime() {
    date = new Date();
    time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
    });

    document.getElementById("HHMM_Box").textContent = time;
}

updateTime();
setInterval(updateTime, 1000);

function updateDateDay() {
    document.getElementById("DDMMYYYY_Box").textContent = date.toLocaleDateString("en-GB").replace(/\//g, ":");
    document.getElementById("DAY_Box").textContent = date.toLocaleDateString("en-US", { weekday: "short" });
}

updateDateDay();
setInterval(updateDateDay, 60000);

