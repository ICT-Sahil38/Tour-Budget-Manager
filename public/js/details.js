function paid(groups,member){
    let for_return = false;
    x = {
        group:groups,
        member: member,
        email: localStorage.getItem('Email'),
        password: localStorage.getItem('Password'),
        name: localStorage.getItem('Name')
    }
    fetch('/paid',{
        method: 'POST',
        headers:{ 'content-type':'application/json' },
        body: JSON.stringify(x)
    }).then(response => response.json())
        .then(data => {
            if(data.success){
                toastr.success("Paid Success");
                for_return = true;
                setTimeout(() => window.location.reload(),2000);
            }
            else{
                toastr.error('Unpaid');
                for_return = false;
            }
        })
        .catch(e => {
            console.log("Error: ",e);
        })
    return for_return;
}

function group_paid(group,member){
    let for_return = false;
    x={
        email:localStorage.getItem('Email'),
        password:localStorage.getItem('Password'),
        name:localStorage.getItem('Name'),
        member:member,
        group:group
    }
    fetch('/group_paid',{
        method: 'POST',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify(x)
    }).then(response => response.json())
        .then(data => {
            if(data.success){
                toastr.success("Paid Success");
                for_return = true;
                setTimeout(() => window.location.reload(),2000);
            }
            else{
                toastr.error('Unpaid');
                for_return = false;
            }
        })
        .catch(e => {
            console.log("Error: ",e);
        })
    return for_return;
}

function load_details_in_group(group){
    let for_return = false;
    x = {
        group: group,
        email: localStorage.getItem('Email'),
        password: localStorage.getItem('Password'),
        name: localStorage.getItem('Name')
    }
    fetch('/group_data',{
        method: 'POST',
        headers:{ 'content-type':'application/json' },
        body: JSON.stringify(x)
    }).then(response => response.json())
        .then(data => {
            // grpName=data.groupName;
            // grpDestination=data.groupDestination;
            // grpDate=data.groupDate;
            // grpMember=data.member;
            field = data.fields;
            s=``;
            if(field){
                t = field.grp_name; 
                s+=`<div class="card mx-2 my-3 fields"
                style="background-image: linear-gradient(to right,#a5a5fe,white,#a5a5fe);">
                  <div class="row text-center mx-2">
                    <div class="text-center">
                        <a><b>Destination:</b></a>
                        <a>${field.grp_destination}</a>
                    </div>
                  </div>
                  <div class="row justify-content-center">
                    <div class="col-auto">
                        <a><b>Group:</b></a>
                        <a>${field.grp_name}</a>
                    </div>
                    <div class="col-auto">
                        <a><b>Date:</b></a>
                        <a style="color: #a2a396;">${field.date}</a>
                    </div>
                  </div>`
                    for(var i=0 ;i<field.grp_members.length;i++){
                        s+=`<div class="row justify-content-center">
                        <div class="col-auto my-2">
                        <a><b>Member:</b></a>
                        <a>${field.grp_members[i].member_name}</a>
                        </div>
                        <div class="col-auto my-2">
                        <a><b>Amount:</b></a>
                        <a style="color: rgb(0, 0, 0);">${field.grp_members[i].member_amount}</a>
                        </div>
                        <div class="col-auto my-2">
                        <a><b>Status:</b></a>
                        <a style="color: #000000;">${field.grp_members[i].amount_status}</a>
                        </div>
                        <div class="col-auto my-2">
                            <button class="paid_button" id="${field.grp_members[i].member_name}_Button" type="button" style="color: white; border-radius:25px;width:100px;" onclick="group_paid('${field.grp_name}','${field.grp_members[i].member_name}')">✔</button>
                        </div>
                    </div> `
                     }
                s+=`</div>`
            }
            document.getElementById("body_bills").innerHTML = s;
            document.getElementById("billss").innerHTML = t;
        })
        .catch(e => {
            console.log("Error: ",e);
        })
    return for_return;
}

function delete_group(group){
    let result = confirm(`Are you sure you want to delete this group ${group}?`);
    if(result){
        let x = {
            email : localStorage.getItem('Email'),
            password : localStorage.getItem('Password'),
            name : localStorage.getItem('Name'),
            group:group
        }
        fetch('/delete_group',{
            method : 'POST',
            headers: { 'content-type':'application/json' },
            body: JSON.stringify(x)
        }).then(response => response.json())
            .then(data => {
                if (data.delete_success) {
                    toastr.success("Category deleted successfully!");
                    setTimeout(() => window.location.reload(),2000);
                } else {
                    toastr.error("Category delete failed!");
                    setTimeout(() => window.location.reload(),2000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}
