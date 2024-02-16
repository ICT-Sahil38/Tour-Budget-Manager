document.getElementById("logout").addEventListener("click", () => {
    data = {
        email: localStorage.getItem("Email"),
        name: localStorage.getItem("Name"),
        password: localStorage.getItem("Password")
    }
    fetch('/logout',{
        method: 'POST',
        headers:{ "content-type":"application/json" },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            console.log(data.logout_success, " data.logout_success");
            if(data.logout_success){
                localStorage.removeItem("Email");
                localStorage.removeItem("Name");
                localStorage.removeItem("Password");
                // localStorage.removeItem("reload");
                localStorage.removeItem("nav_active");

                action = "/";
                document.getElementById("navbar_from").action = action;
                document.getElementById("navbar_from").submit();
            }
            else {
                alert("Logout failed!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        }); 
});

document.getElementById("home").addEventListener("click", () => {
    // localStorage.removeItem('reload');
    action = "/home";
    localStorage.setItem('nav_active', "home");
    document.getElementById("navbar_from").action = action;
    document.getElementById("navbar_from").submit();
});

document.getElementById("details").addEventListener("click", () => {
    // localStorage.removeItem('reload');
    action = "/details";
    localStorage.setItem('nav_active', "details");
    document.getElementById("navbar_from").action = action;
    document.getElementById("navbar_from").submit();
});

window.addEventListener("load", () => {
    let elements = document.getElementsByClassName("active");
    console.log(elements);
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');
    }
    document.getElementById(localStorage.getItem('nav_active')).classList.add('active');
});