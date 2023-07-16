const mongoose = require("mongoose");
const { Schema } = mongoose;

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

const productSchema = new Schema({
  name: String,
  price: Number,
  season: {
    type: String,
    enum: ["Spring", "Summer", "Fall", "Winter"],
  },
});

const Product = mongoose.model("Product", productSchema);

const insertProducts = async () => {
  // await Product.deleteMany({});

  const res = await Product.insertMany([
    { name: "Tomato", price: 2, season: "Summer" },
    { name: "Potato", price: 1, season: "Spring" },
    { name: "Carrot", price: 3, season: "Fall" },
    { name: "Watermelon", price: 4, season: "Winter" },
  ]);
  console.log(res);
};

// insertProducts();

const farmSchema = new Schema({
  name: String,
  city: String,
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const Farm = mongoose.model("Farm", farmSchema);

const makeFarm = async () => {
  await Farm.deleteMany({});

  const farm = new Farm({
    name: "Harvest Moon",
    city: "Nintendo",
  });
  const product = await Product.findOne({ name: "Potato" });
  farm.products.push(product);
  console.log("Farm:", farm);
  await farm.save();
};

// makeFarm();

const addProduct = async () => {
  const farm = await Farm.findOne({ name: "Harvest Moon" });
  const carrot = await Product.findOne({ name: "Carrot" });
  farm.products.push(carrot);
  const res = await farm.save();
  console.log("saved farm:", res);
};

// addProduct();

Farm.findOne({ name: /moon/i })
  .populate("products")
  .exec()
  .then((farm) => {
    console.log(farm);
  });
