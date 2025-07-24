const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const mongo_url = "mongodb://127.0.0.1:27017/wandurlust";
main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}

 const initDb = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ ...obj , owner : "68761ac29756a39d86058cb0"}));
    await Listing.insertMany(initData.data);
    console.log("data was inserted successfully");
 }
 initDb();
