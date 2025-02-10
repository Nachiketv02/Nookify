const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Model/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/nookify";
main().then(() => {
    console.log("Database connection successful!!!");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany();
    initData.data = initData.data.map((obj) => ({...obj, owner: "66f6fb8c02fe074ac0da285a"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized!!");
};

initDB();