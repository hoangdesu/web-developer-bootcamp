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
      minLength: 6,
      
      // -- testing constraints
      // maxLength: 5
      // enum: ['iPhone', 'MacBook']
      // lowercase: true,
      // uppercase: true,
      // immutable: true,
      // match: /iphone/i
      // enum: { values: ['Coffee', 'Tea'], message: '{VALUE} is not supported' }
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
      // max: [10, 'Value {VALUE} must be less than 10']
    },
    onSale: {
      type: Boolean,
      default: false
    },
    qty: {
      online: {
        type: Number,
        default: 0
      },
      inStore: {
        type: Number,
        default: 0
      }
    },
    model: {
      type: String,
      enum: ['Mini', 'Base', 'Pro', 'Pro Max'],
      default: 'Pro'
    }
  });

  // model == collection
  const Product = mongoose.model("Product", productSchema); // db in mongo: "products"

  // drop table
  // await Product.deleteMany({});

  const iPhone = new Product({
    name: "iPhone 12 Pro",
    price: 16000000,
    color: "black", // not defined in schema, won't be saved to db
    onSale: true,
    qty: {
      online: 2,
      inStore: 3
    },
  });

  iPhone
    .save()
    .then((data) => console.log("saved iphone:", data))
    .catch((err) => console.error("Error:", err));


  Product.find({}).then((p) => console.log("- all products:", p));

  // validating updates
  Product.findOneAndUpdate({ name: 'iPhone 12 Pro' }, { price: 26.02 }, { new: true, runValidators: true })
    .then(data => console.log('new data', data)); // error, price < 0

}


// node REPL
// .load product.js
