const express = require('express');
const app = express();
const routes = express.Router();
const bodyparser = require("body-parser");
var jsonparser = bodyparser.json();
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(process.env.URL);

// Load login page at start
routes.get("/", async (req, res) => {
    res.render("login");
});

routes.post("/login_check",jsonparser,async (req,res)=>{
    let login_success = false;
    success_data = {
        name :null,
        email :null,
        password :null
    };
    try{
        await client.connect();
        if(req.body.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email :req.body.email});
            if(req.body.password === item.password){
                login_success = true;
                success_data.name = item.name;
                success_data.email = item.email;
                success_data.password = item.password;

                req.session.name = item.name;
                req.session.email = item.email;
                req.session.password = item.password;
            }
        }
    }
    catch(e){
        console.log(e);
    }
    finally{
        await client.close();
    }
    data = {
        message: "msg from Login check",
        success: login_success,
        email: success_data.email,
        password: success_data.password,
        name: success_data.name
    };
    res.send(data);
})

routes.get("/signup", async (req, res) => {
    res.render("signup");
});

routes.post('/signup_check' , jsonparser, async (req,res) => {
    let signup_success = false;
    const for_insert = {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    }
    try{
        await client.connect();
        if(req.body.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).insertOne(for_insert);
            if(item.acknowledged){
                const for_insert2 = {
                    _id : "Group",
                    group:["void"]
                };
                const status = await client.db(process.env.DB_NAME).collection(req.body.email).insertOne(for_insert2);
                if(status.acknowledged){
                    signup_success = item.acknowledged;
                    req.session.email = req.body.email;
                    req.session.name = req.body.name;
                    req.session.password = req.body.password;
                }
            }
        }
    }
    catch(e){
        console.log("Errorrrr ",e);
    }
    finally {
        await client.close();
    }
    data = {
        message: "msg from signup check",
        success: signup_success,
        email: for_insert.email,
        password: for_insert.password,
        name: for_insert.name
    };
    res.send(data);
})

routes.get("/home",async (req, res) => {
    let req_for_home = false;
    let leader = null;
    let Group = null;
    let members = null;
    let destination = null;
    let group_single = null;
    let date = null;
    // let field_members = null;
    try{
        await client.connect();
        if(req.session.email){
            item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.session.email});
            if(req.session.password === item.password){
                req_for_home = true;
                leader = item.name;

                let group_ = await client.db(process.env.DB_NAME).collection(item.email).findOne({_id:"Group"});
                let fields = await client.db(process.env.DB_NAME).collection(item.email).find({_id:{$ne:"Group"}}).toArray();
                if(fields.length === 0){
                    res.render("home", { email: req.session.email, leader: leader, group: Group, fieldsEmpty: true, message:"Create Group First" });
                    return;
                }
                else{
                    let dateObject = fields.reduce((latest,group)=>{
                        const currentDate = new Date(group.date);
                        const latestDate = latest ? new Date(latest.date) : null;
                        if(!latestDate || currentDate > latestDate){
                            return group;
                        }
                        else{
                            return latest;
                        }
                    },null);
                    if(dateObject){
                        destination = dateObject.grp_destination;
                        group_single = dateObject.grp_name;
                        date = dateObject.date;
                        members = dateObject.grp_members.map((member) => {
                            return{
                                member_name : member.member_name,
                                member_amount : member.member_amount,
                                member_status : member.amount_status
                            }
                        });

                    }
                }
                Group = group_.group.filter(group => group !== "void");
            }
        }
    }
    catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    res.render("home", { email: req.session.email, leader: leader, group: Group, members: members,destination:destination,grpSingle:group_single,date:date, fieldsEmpty: false });
});

routes.post("/add_group",jsonparser,async (req,res) => {
    let add_success = false;
    try{
        await client.connect();
        if(req.body.email) {
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.body.email});
            if(req.body.password === item.password){
                const status = await client.db(process.env.DB_NAME).collection(req.body.email).findOne({_id:"Group" , group:req.body.group_name});
                if(status){
                    add_success = false;
                }
                else{
                    const enter = client.db(process.env.DB_NAME).collection(req.body.email).updateOne({_id:"Group"} ,{$push:{group:req.body.group_name}})
                    for_insertion={
                        grp_name : req.body.group_name,
                        grp_destination : req.body.destination,
                        grp_members : [{member_name : item.name,
                                    member_amount : 0,
                                    amount_status : "paid"}],
                        date : req.body.date
                    };
                    const result = await client.db(process.env.DB_NAME).collection(req.body.email).insertOne(for_insertion);
                    add_success = true;
                }
            }
        }
        else{
            toastr.error("EMAIL NOT found: ");
        }
    }
    catch(e){
        console.log("Error : ",e);
    }
    finally{
        await client.close();
    }
    
    data = {
        success: add_success,
    };
    res.send(data);
});

routes.post('/member',jsonparser,async (req,res) => {
    let add_success = false;
    try{
        await client.connect();
        if(req.body.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.body.email});
            if(item.password === req.body.password){
                entry = {
                    member_name : req.body.member_name,
                    member_amount : 0,
                    amount_status : "unpaid"
                };
                const filter = {
                    grp_name : req.body.member_grp
                };
                const update = {
                    $push : {
                        grp_members :entry
                    }
                };
                const result = await client.db(process.env.DB_NAME).collection(req.body.email).updateOne(filter,update);
                add_success = true;
            }
        }
    }
    catch(err){
        console.log("Error ",err);
    }
    finally{
        await client.close();
    }

    data = {
        success : add_success
    }
    res.send(data);
});

routes.post('/add_bill', jsonparser , async (req,res)=>{
    let add_success = false;
    try{
        await client.connect();
        if(req.body.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.body.email});
            if(item.password === req.body.password){
                const count_bill = await client.db(process.env.DB_NAME).collection(req.body.email).findOne({grp_name : req.body.group_bill});
                let no_people = count_bill.grp_members.length;
                const final_amount = Math.ceil(req.body.amount/no_people);

                const result = await client.db(process.env.DB_NAME).collection(req.body.email);
                const docToUpdate = await result.find({ grp_name: req.body.group_bill }).toArray();
                for(const doc of docToUpdate){
                    const updateMember = doc.grp_members.map(member => ({
                        ...member,
                        member_amount: member.member_amount + final_amount
                    }));
                    await result.updateOne({ grp_name: req.body.group_bill },{ $set : { grp_members: updateMember } })
                }
                add_success = true;
            }
        }
    }
    catch(err){
        console.log("Error ",err);
    }
    finally{
        await client.close();
    }

    data = {
        success : add_success
    }
    res.send(data);
})

routes.post('/logout', jsonparser, async (req, res) => {
    let logout_success = false;
    try {
        req.session.destroy();
        logout_success = true;
    } catch (e) {
        console.error(e);
        logout_success = false;
    } finally {
        await client.close();
    }
    data = {
        logout_success: logout_success
    }
    res.send(data);
});

routes.get("/details", async (req, res) => {
    let Group=null;
    let group_name=null;
    let group_destination=null;
    let group_date = null;
    let member = null;
    try{
        await client.connect();
        if(req.session.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.session.email});
            if(item.password === req.session.password){
                const group_ = await client.db(process.env.DB_NAME).collection(item.email).findOne({_id:"Group"});
                Group = group_.group.filter(grp => grp !== 'void');

                const fields = await client.db(process.env.DB_NAME).collection(item.email).find({_id:{$ne:"Group"}}).toArray();
                if(fields.length === 0 || Group.length === 0){
                    res.render("details", { groupEmpty:true , fieldsEmpty: true, message:"Create Group First" });
                    return;
                }
                else{
                    let dateObject = fields.reduce((latest,group)=>{
                        const currentDate = new Date(group.date);
                        const latestDate = latest ? new Date(latest.date) : null;
                        if(!latestDate || currentDate > latestDate){
                            return group;
                        }
                        else{
                            return latest;
                        }
                    },null);
                    if(dateObject){
                        group_destination = dateObject.grp_destination;
                        group_name = dateObject.grp_name;
                        group_date = dateObject.date;
                        member = dateObject.grp_members.map((member) => {
                            return{
                                member_name : member.member_name,
                                member_amount : member.member_amount,
                                member_status : member.amount_status,
                                inside_group_name : dateObject.grp_name
                            }
                        });
                    }
                }
                
            }
        }
    }
    catch (e) {
        console.error(e);
        logout_success = false;
    } finally {
        await client.close();
    }
    res.render("details",{group:Group,members: member,destination:group_destination,grpSingle:group_name,date:group_date, fieldsEmpty: false});
});

routes.post('/group_data', jsonparser, async (req, res) => {
    data={
        // groupName: null,
        // groupDestination: null,
        // groupDate : null,\
        fields:null,
        // member:null
    }
    try {
        await client.connect();
        if (req.body.email) {
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({ email: req.body.email });
            if (req.body.password === item.password) {
                let fields = await client.db(process.env.DB_NAME).collection(item.email).findOne({ _id: { $ne: "Group" }, grp_name: req.body.group });
                if (fields.length == 0) {
                    fields.empty = true;
                }
                // let groupName = fields.grp_name;
                // let groupDestination = fields.destination;
                // let groupDate = fields.date;
                // let member = fields.grp_members.map((member)=>{
                //     return{
                //         member_name : member.member_name,
                //         member_amount : member.member_amount,
                //         member_status : member.amount_status,
                //         inside_group_name : fields.grp_name
                //     }
                // });
                // data.groupName = groupName;
                // data.groupDestination = groupDestination;
                // data.groupDate = groupDate;
                // data.member = member;
                data.fields=fields;
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    res.send(data);
});

routes.post('/paid', jsonparser , async (req,res) => {
    let add_success = false;
    try{
        await client.connect();
        if(req.body.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.body.email});
            if(item.password){
                const filter = {
                    grp_name:req.body.group,
                    'grp_members.member_name': req.body.member
                };
                const update = {
                    $set: {
                        'grp_members.$.member_amount': 0
                    }
                };
                const status = await client.db(process.env.DB_NAME).collection(req.body.email).updateOne(filter,update);
                add_success = true;
            }
        }
    }
    catch(err){
        console.log("Error ",err);
    }
    finally{
        await client.close();
    }

    data = {
        success : add_success
    }
    res.send(data);
})

routes.post('/group_paid', jsonparser , async (req,res)=>{
    let add_success = false;
    try{
        await client.connect();
        if(req.body.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.body.email});
            if(item.password === req.body.password){
                const filter = {
                    grp_name : req.body.group,
                    'grp_members.member_name': req.body.member
                }
                const update = {
                    $set : {
                        'grp_members.$.member_amount': 0
                    }
                };
                const status = await client.db(process.env.DB_NAME).collection(req.body.email).updateOne(filter,update);
                add_success = true
            }
        }
    }
    catch(err){
        console.log("Error ",err);
    }
    finally{
        await client.close();
    }

    data = {
        success : add_success
    }
    res.send(data);
})

routes.post('/delete_group',jsonparser,async (req,res) => {
    let delete_success = false;
    try{
        await client.connect();
        if(req.body.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.body.email});
            if(item.password === req.body.password){
                const filter = {
                    grp_name:req.body.group
                }
                const pull_group = {
                    $pull : {
                        group:req.body.group
                    }
                };
                const status = await client.db(process.env.DB_NAME).collection(req.body.email).deleteOne(filter);
                const grp_array = await client.db(process.env.DB_NAME).collection(req.body.email).updateOne({_id:"Group"},pull_group);
                delete_success = true;
            }
        }
    }
    catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    data = {
        delete_success: delete_success,
    };
    res.send(data);
})

module.exports = routes ;