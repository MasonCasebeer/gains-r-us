const admin = document.getElementById("admin-link");

async function checkAdminStatus() {
    try {
        const response = await fetch("/api/session");
        const data = await response.json();

        if (data.loggedIn && data.user.role === "admin") {
            admin.innerHTML = `<a href="/admin.html">Admin Page</a>`;
        } else {
            admin.innerHTML = "";
        }
    } catch (error) {
        console.error("Error while checking admin status:", error);
    }
}

// window.onload = checkAdminStatus;
checkAdminStatus();