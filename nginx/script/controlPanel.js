
const display = document.getElementById("display");
const displayArea = document.getElementById("display-area");

async function displayUsers() {
    const response = await fetch("/api/user-workouts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const users = await response.json();
    console.log(users);
    displayArea.replaceChildren();

    for (const user of users) {
        const userDiv = document.createElement("div");
        console.log(user);
        userDiv.textContent = `User ID: ${workout.userid}, Name: ${workout.name}, Workout ID: ${workout.workoutid}, Routine: ${workout.routineid}`;
        displayArea.appendChild(userDiv);
    }

}

display.addEventListener("click", () => {
    displayUsers();
});
