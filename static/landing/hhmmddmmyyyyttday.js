var date;
var time;

function updateTime() {
    date = new Date();
    time = date.toLocaleTimeString();
    
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    document.getElementById("HHMM_Box").textContent = `${hour}::${minute}`;
}

updateTime();
setInterval(updateTime, 1000);

function updateDateDay() {
    document.getElementById("DDMMYYYY_Box").textContent = date.toLocaleDateString("en-GB").replace(/\//g, ":");
    document.getElementById("DAY_Box").textContent = date.toLocaleDateString("en-US", { weekday: "short" });
}

updateDateDay();
setInterval(updateDateDay, 60000);

function onclickChangeTempUnit() {
    const temp_box = document.getElementById("TEMPERATURE_Box");
    var unit = temp_box.textContent.charAt(temp_box.textContent.length-1);
    var temp = temp_box.textContent.substring(0, temp_box.textContent.length-2);
    if (unit === 'c') {
        // change to Fahreinheight
        temp = (temp * (9/5)) + 32;
        unit = "f";
    } else {
        // change to celsius
        temp = (temp - 32) * (5/9);
        unit = "c";
    }
    // re-write the temperature in DOM
    temp_box.textContent = temp.toString() + "\u00B0" + unit;
}
