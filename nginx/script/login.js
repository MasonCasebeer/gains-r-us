const modal = document.getElementById("loginModal");
const loginTrigger = document.getElementById("loginTrigger");
const closeBtn = document.getElementsByClassName("close")[0];
const form = document.getElementById("loginForm");

loginTrigger.onclick = () => {
    modal.style.display = "block";
};

closeBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

form.onsubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password})
        });

        if (response.ok) {
            alert("Login Successful");
            modal.style.display = "none";
        } else {
            alert("Login failed. Check username/password.");
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred.");
    }
};