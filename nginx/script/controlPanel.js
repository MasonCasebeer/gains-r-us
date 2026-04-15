
const display = document.getElementById("display");
const displayArea = document.getElementById("display-area");
const addWorkoutBtn = document.getElementById("add-workout");
const logDiv = document.querySelector(".log");

console.log("controlPanel.js loaded");
alert("controlPanel.js loaded");

async function displayUsers() {
    console.log("displayUsers called");
    const response = await fetch("/api/user-workouts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const users = await response.json();
    console.log("users:", users);
    displayArea.replaceChildren();

    if (users.length === 0) {
        displayArea.textContent = "No workouts found.";
        return;
    }

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["User ID", "Username", "Workout ID", "Routine ID", "Workout Name"].forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        th.style.border = "1px solid #ddd";
        th.style.padding = "8px";
        th.style.backgroundColor = "#f2f2f2";
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    users.forEach((user, index) => {
        const row = document.createElement("tr");
        row.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#e0e0e0";
        const values = [
            user.userid || "N/A",
            user.username || "N/A",
            user.workoutid || "N/A",
            user.routineid || "N/A",
            user.workout_name || "N/A"
        ];
        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            td.style.border = "1px solid #ddd";
            td.style.padding = "8px";
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    displayArea.appendChild(table);
}

display.addEventListener("click", () => {
    console.log("display button clicked");
    displayUsers();
});

addWorkoutBtn.addEventListener("click", () => {
    console.log("add workout button clicked");
    logDiv.style.display = "block";
});
