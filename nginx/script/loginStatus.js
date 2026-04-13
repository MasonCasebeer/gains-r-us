//file: loginSatus.js -- used on index
// script should be included and DEFERed on all pages requiring user to be logged-in for access
// requires an element named userStatus - replaces the text with either login or logout links

function setupLoginTrigger() {
    const modal = document.getElementById("loginModal");
    const loginTrigger = document.getElementById("loginTrigger");
    
    if (loginTrigger) {
        loginTrigger.style.cursor = "pointer";
        loginTrigger.onclick = () => {
            modal.style.display = "block";
        };
    }
}

const modal = document.getElementById("loginModal");
const closeBtn = document.getElementsByClassName("close")[0];
const form = document.getElementById("loginForm");

if (closeBtn) {
    closeBtn.onclick = () => {
        modal.style.display = "none";
    };
}

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

if (form) {
    form.onsubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password})
        });

        if (response.ok) {
            alert("Login Successful");
            window.location.href = "index.html";
            modal.style.display = "none";
        } else {
            alert("Login failed. Check username/password.");
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred.");
    }
    };
}

async function checkLoginStatus() {
    try {
        const response = await fetch("/api/session");
        const data = await response.json();
        const userStatus = document.getElementById("user-status");

        if (data.loggedIn) {
            userStatus.innerHTML = 'Logged in as: <strong>' + data.user.username + '</strong> (<a href="/logout.html">Logout</a>)';
        } else {
            userStatus.innerHTML = '<a class="login" id="loginTrigger"> Login </a> | <a href="/register.html">Register</a>';
            setupLoginTrigger();
        }
    } catch (error) {
        console.error("Error while checking login status:", error);
    }
}

checkLoginStatus();