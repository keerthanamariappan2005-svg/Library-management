function handleLogin() {
    var u = document.getElementById('user').value.trim();
    var p = document.getElementById('pass').value.trim();
    if(!u || !p) { alert("Please enter details!"); return; }

    var storedPass = localStorage.getItem("pw_" + u);
    if (storedPass === null) {
        localStorage.setItem("pw_" + u, p);
        sessionStorage.setItem("activeUser", u);
        alert("Hello " + u + "! Welcome to our website.");
        proceedLogin(u);
    } else if (storedPass === p) {
        sessionStorage.setItem("activeUser", u);
        proceedLogin(u);
    } else {
        document.getElementById('error-msg').innerText = "Wrong Password!";
    }
}

function proceedLogin(username) {
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('user-welcome').innerText = "Welcome back, " + username + "!";
    updateUI();
}

function showDetails(id) {
    var el = document.getElementById(id);
    el.style.display = (el.style.display === "block") ? "none" : "block";
}

function borrowBook(event, bookID) {
    event.stopPropagation();
    var user = sessionStorage.getItem("activeUser");
    var rDate = localStorage.getItem(user + "_date");
    
    if(rDate && new Date() > new Date(rDate)) {
        alert("🚨 OVERDUE ALERT: Return your book first!");
        return;
    }
    if(localStorage.getItem(user + "_book")) {
        alert("Limit Reached: You already have 1 book borrowed.");
        return;
    }

    var dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); 
    localStorage.setItem(user + "_book", bookID);
    localStorage.setItem(user + "_date", dueDate.toISOString());

    alert("Book Borrowed! Due: " + dueDate.toDateString());
    updateUI();
}

function updateUI() {
    var user = sessionStorage.getItem("activeUser");
    var badges = document.getElementsByClassName('status-badge');
    
    for(var i=0; i<badges.length; i++) {
        badges[i].innerText = "Available";
        badges[i].className = "status-badge status-available";
    }

    var borrowed = localStorage.getItem(user + "_book");
    var dDate = localStorage.getItem(user + "_date");

    if(borrowed) {
        var badgeId = "badge-" + borrowed;
        var badgeElement = document.getElementById(badgeId);
        if(badgeElement) {
            badgeElement.innerText = "HELD BY YOU (Due: " + new Date(dDate).toLocaleDateString() + ")";
            badgeElement.className = "status-badge status-borrowed";
        }
    }
}

function logout() { 
    sessionStorage.removeItem("activeUser");
    location.reload(); 
}
