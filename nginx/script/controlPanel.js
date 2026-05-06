import {getLoginStatus} from './loginStatus.js';
const addWorkoutBtn = document.getElementById("add-workout");
const logDiv = document.querySelector(".log");
const display = document.getElementById("display");
const displayArea = document.getElementById("display-area");
const exitAddBtn = document.getElementById("exit-add");

// Initially hide the display area
if (displayArea) {
    displayArea.style.display = 'none';
}

//display user table for admin page 
async function displayUsers(name = "All", editable = false) {

    console.log("displayUsers called");
    var response;
    if(name == "All") {
        response = await fetch("/api/user-workouts", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    }
    else if (isNaN(name)) {
        console.log(`Fetching workouts for user: ${name}`);
        response = await fetch(`/api/user-workouts?user=${name}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    } else {
        console.log(`Fetching workouts for userid: ${name}`);
        response = await fetch(`/api/user-workouts?userid=${name}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    }

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
            if (editable) td.setAttribute('contenteditable', 'true');
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    displayArea.appendChild(table);
    
}

//pretty display of user data for users
async function displayUsersRich() {

    const data = await getLoginStatus();
    const username = data.user.username;
    const userid = data.user.userid;
    displayArea.replaceChildren();

    var response;
    response = await fetch(`/api/user-workouts?user=${username}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    
    const users = await response.json();

    var workoutInfo;
    workoutInfo = await fetch(`/api/user/workout-sets/?userid=${userid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const workouts = await workoutInfo.json();

        // console.log(workouts);

    if (users.length === 0) {
        displayArea.textContent = "No workouts found.";
        return;
    }    

    const list = document.createElement("ul");
    const tbody = document.createElement("tbody");

    users.forEach((user, index) => {
        const setInfo = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = `Expand Sets:`;
        setInfo.appendChild(summary);

        const setList = document.createElement("ul");
        // Filter workouts to only show sets for this specific workout
        const workoutSets = workouts.filter(w => w.workoutid === user.workoutid);
        workoutSets.forEach((workout) => {
            const listItem = document.createElement("li");
            listItem.textContent = `Exercise: ${workout.exercise_name}, Set: ${workout.sets}, Reps: ${workout.reps}, Weight: ${workout.weight}`;
            setList.appendChild(listItem);
        });
        setInfo.appendChild(setList);
        
        // console.log(workouts);
        const row = document.createElement("tr");
        
        // Workout name cell
        const titleTd = document.createElement("td");
        const title = user.workout_name || "Workout"
        titleTd.textContent = `${title}`;
        titleTd.style.border = "1px solid #ddd";
        titleTd.style.padding = "8px";
        row.appendChild(titleTd);
        
        // Expandable sets cell
        const setsTd = document.createElement("td");
        setsTd.appendChild(setInfo);
        setsTd.style.border = "1px solid #ddd";
        setsTd.style.padding = "8px";
        row.appendChild(setsTd);
        
        tbody.appendChild(row);
    });
    
    tbody.setAttribute("class", "workout-table");
    list.appendChild(tbody);
    displayArea.appendChild(list);
    displayArea.style.display = 'block';
}

if (display) {
    display.addEventListener("click", async (event) => {
        const currentPage = document.body.getAttribute("data-page");
        if(currentPage === "index") {
            try {
                displayUsersRich();
            } catch (error) {
                console.error("Error fetching session data:", error);
            }
        }
        else if(currentPage === "admin") {
            if (displayArea.style.display === 'none') {
                displayArea.style.display = 'block';
                displayUsers("All", false);
            } else {
                displayArea.style.display = 'none';
            }
        }
    });
}

if (addWorkoutBtn) {
    addWorkoutBtn.addEventListener("click", () => {
        const userValue = document.getElementById("user").value.trim();
        if (userValue) {
            displayUsers(userValue, true);
            if (logDiv) logDiv.style.display = "block";
        } else {
            alert("Please enter a userid");
        }
    });
}

if (exitAddBtn) {
    exitAddBtn.addEventListener("click", () => {
        if (logDiv) logDiv.style.display = "none";
    });
}

window.addEventListener('workoutSubmitted', (e) => {
    const currentPage = document.body.getAttribute("data-page");
    if(currentPage === "admin") {
        const userValue = document.getElementById("user").value.trim();
        if (userValue) {
            displayUsers(userValue, true);
        } else {
            displayUsers("All", false);
        }
    } else {
        displayUsersRich();
    }
});

