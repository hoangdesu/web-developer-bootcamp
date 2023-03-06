const mongoose = require("mongoose");

const db = "shopAppDB";
const URI = "mongodb://localhost:27017/:db".replace(/:db/i, db);

mongoose.set("strictQuery", true);

mongoose
  .connect(URI)
  .then(() => {
    console.log(`Connected to ${db} 🚀`);
  })
  .catch((err) => {
    console.error(err);
  });

main().catch((err) => console.error(err));

async function main() {
  const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    onSale: {
      type: Boolean,
      default: false
    },
  });

  // model == collection
  const Product = mongoose.model("Product", productSchema); // db in mongo: "products"

  // drop table
  await Product.deleteMany({});

  const iPhone = new Product({
    name: "iPhone 12 Pro",
    price: 16000000,
    color: "black", // not defined in schema, won't be saved to db
  });

  iPhone
    .save()
    .then((data) => console.log("saved iphone:", data))
    .catch((err) => console.error("Error:", err));

  Product.find({}).then((p) => console.log("- all products:", p));
}



// node REPL
// .load product.js
