const mongoose = require("mongoose");

const db = "mongooseRelationshipsDemo";
const URI = `mongodb://localhost:27017/${db}`;

mongoose.set("strictQuery", true);

mongoose
  .connect(URI)
  .then(() => {
    console.log(`🚀 Connected to ${db} db`);
  })
  .catch((err) => {
    console.error(err);
  });

const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  addresses: [
    {
      _id: { _id: false }, // to disable separate id created for each address
      street: String,
      city: String,
      country: String,
    },
  ],
});

// create model from a schema
const User = mongoose.model("User", userSchema);

const makeUser = async () => {
  // await User.deleteMany({});

  const user = new User({
    first: "Mai Anh",
    last: "Phạm",
  });

  user.addresses.push({
    street: "26 đường 24 khu Trung Sơn",
    city: "Ho Chi Minh",
    country: "Viet Nam",
  });

  const res = await user.save();
  console.log(res);
};

// makeUser();

const addAddress = async (id, address) => {
  try {
    const user = await User.findById(id);
    user.addresses.push(address);
    const res = await user.save();
    console.log(res);
  } catch (e) {
    console.log("error:", e);
  }
};

const userId = "64b3b80f24f192e43de4497b"; // get from DB
const userAddress = {
  street: "my house",
  city: "Tokyo",
  country: "Japan",
};
addAddress(userId, userAddress);

// console.log("Done");
// mongoose.connection.close();
