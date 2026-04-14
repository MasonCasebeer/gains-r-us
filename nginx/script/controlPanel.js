
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
        userDiv.textContent = `Username: ${user.username}, Email: ${user.email}, Role: ${user.role}, id: ${user.userid}, routine: ${user.routineid}`;
        displayArea.appendChild(userDiv);
    }

}

display.addEventListener("click", () => {
    displayUsers();
});
