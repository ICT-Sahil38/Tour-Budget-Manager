function validate_restro_name(){
    let restro_name = document.getElementById("bill_name").value;
    if(restro_name.length < 1){
        document.getElementById("bill_name").style.color = "red";
        return false;
    }
    else{
        document.getElementById("bill_name").style.color = "green";
        return true;
    }
}
function validate_restro_desc(){
    let restro_desc = document.getElementById("bill_description").value;
    if(restro_desc.length < 1){
        document.getElementById("bill_description").style.color = "red";
        return false;
    }
    else{
        document.getElementById("bill_description").style.color = "green";
        return true;
    }
}
function validate_restro_bill(){
    let restro_bill = document.getElementById("bill_amount").value;
    if(restro_bill < 0){
        document.getElementById("bill_amount").style.color = "red";
        return false;
    }
    else{
        document.getElementById("bill_amount").style.color = "green";
        return true;
    }
}

function validate_bill_group(){
    let group_bill = document.getElementById("bill_group").value;
    if(group_bill === "Select Catagory..."){
        document.getElementById("bill_group").style.color = "red";
        return false;
    }
    else{
        document.getElementById("bill_group").style.color = "green";
        return true;
    }
}

function add_bill(){
    if(validate_restro_name() && validate_restro_desc() && validate_restro_bill() && validate_bill_group()){
        let restro_name = document.getElementById("bill_name").value;
        let restro_desc = document.getElementById("bill_description").value;
        let restro_bill = document.getElementById("bill_amount").value;
        let group_bill = document.getElementById("bill_group").value;

        data={
            name : localStorage.getItem('Name'),
            email : localStorage.getItem('Email'),
            password : localStorage.getItem('Password'),
            restaurant : restro_name,
            bill_description : restro_desc,
            group_bill : group_bill,
            amount:restro_bill
        }
        let for_return = false;
        fetch("/add_bill",{
            method : 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body : JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                if(data.success){
                    toastr.success("Bill Added");
                    for_return = true;
                    setTimeout(() => window.location.reload(),2000);
                }
                else{
                    toastr.error("Bill Not Added");
                    for_return = false;
                    // setTimeout(() => window.location.reload(),2000);
                }
            }).catch(e => {
                console.log("Error: ",e);
            })
        return for_return;
    }
}