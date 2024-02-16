function validate_grp_name(){
    let grp_name = document.getElementById("group_name").value;
    if(grp_name.length < 1){
        document.getElementById("grp_name").style.color = "red";
        return false;
    }
    else{
        // document.getElementById("grp_name").style.color = "green";
        return true;
    }
}

function validate_grp_destination(){
    let destination = document.getElementById("destination").value;
    if(destination.length < 1){
        document.getElementById("destination").style.color = "red";
        return false;
    }
    else{
        // document.getElementById("destination").style.color = "green";
        return true;
    }
}

function validate_date() {
    let date = document.getElementById("date").value;
    if (date.length < 1) {
        document.getElementById("date").style.borderColor = "red";
        return false;
    } else {
        // document.getElementById("date").style.borderColor = "green";
        return true;
    }
}

function add_group(){
    if(validate_grp_name() && validate_grp_destination() && validate_date()){
        let grp_name = document.getElementById("group_name").value;
        let destination = document.getElementById("destination").value;
        let date = document.getElementById("date").value;

        // console.log("Group Name ",grp_name)
        // console.log("destination ",destination)
        // console.log("date ",date)

        data={
            name : localStorage.getItem('Name'),
            email : localStorage.getItem('Email'),
            password : localStorage.getItem('Password'),
            group_name : grp_name,
            destination : destination,
            date : date
        }
        // console.log("Dta", data)
        let for_return = false;
        fetch("/add_group",{
            method: "POST",
            headers:{ "Content-type":"application/json" },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                console.log(data.success);
                console.log(data.success,true);
                if(data.success){
                    toastr.success('Group Added');
                    for_return = true;
                    setTimeout(() => window.location.reload(),2000);
                    // window.location.reload();
                }
                else{
                    toastr.error("Group Already Exist!!")
                    for_return = false;
                }
            })
            .catch(error => {
                console.log("Error ",error)
            });
            console.log("Added!");
        return for_return;
    }
    else{
        return false;
    }
}

function validate_grp_member_name(){
    let grp_member_name = document.getElementById("grp_member_name").value;
    if(grp_member_name.length < 1){
        document.getElementById("grp_member_name").style.color = "red";
        return false;
    }
    else{
        // document.getElementById("grp_name").style.color = "green";
        return true;
    }
}
function validate_grp_memberSide_name(){
    let group_memberSide_name = document.getElementById("group_memberSide_name").value;
    if(group_memberSide_name === "Select Catagory..."){
        document.getElementById("group_memberSide_name").style.color = "red";
        return false;
    }
    else{
        // document.getElementById("grp_name").style.color = "green";
        return true;
    }
}

function add_members(){
    if(validate_grp_member_name() && validate_grp_memberSide_name()){
        let member_name = document.getElementById('grp_member_name').value;
        let member_group = document.getElementById('group_memberSide_name').value;

        console.log("member name ",member_name);
        console.log("member group ",member_group);

        data={
            name : localStorage.getItem('Name'),
            email : localStorage.getItem('Email'),
            password : localStorage.getItem('Password'),
            member_name : member_name,
            member_grp : member_group
        }
        // console.log(data);
        let for_return = false;

        fetch("/member",{
            method: "POST",
            headers:{ "Content-type":"application/json" },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                console.log(data.success);
                console.log(data.success,true);
                if(data.success){
                    toastr.success("Member Added!");
                    for_return = true;
                    setTimeout(() => window.location.reload(),2000);
                }
                else{
                    toastr.error("not added!!")
                    for_return = false;
                }
            })
            .catch(e => {
                console.log("Error: ",e);
            })
            console.log("Member Added!");
        return for_return;
    }
    else{
        for_return = false;
        return for_return;
    }
}