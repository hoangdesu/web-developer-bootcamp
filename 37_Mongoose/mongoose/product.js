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

  // subdocuments
  const categorySchema = new mongoose.Schema({
    name: String,
    onTrending: {
      type: Boolean,
      default: true
    }
  });

  const inHouseProductionSchema = new mongoose.Schema({
    name: {
      type: String,
      default: 'In-house production company name'
    },
    producing: {
      type: Number,
      default: 100
    },
    estimatedDeliveryDate: {
      type: Date,
      default: new Date('2023-02-26')
    }
  });


  // parent schema
  const productSchema = new mongoose.Schema(
    // schema definition
    {
      name: {
        type: String,
        required: true,
        minLength: 6,
        unique: true,

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
        min: [0, "Price cannot be negative"],
        // max: [10, 'Value {VALUE} must be less than 10']
      },
      onSale: {
        type: Boolean,
        default: false,
      },
      qty: {
        online: {
          type: Number,
          default: 0,
        },
        inStore: {
          type: Number,
          default: 0,
        },
        // more levels of nesting
        manufacturing: {
          outSource: {
            type: Number,
            default: 0
          },
          inHouse: { 
            type: inHouseProductionSchema, // nested subdocument
            default: {}
          }
        }
      },
      model: {
        type: String,
        enum: ["Mini", "Base", "Pro", "Pro Max"],
        default: "Pro",
      },
      categories: {
        type: [categorySchema], // array of subdocuments
        default: [{ name: 'electronics' }, { name: 'gadgets' }]
      } 
    },
    // options
    {
      // 1. define custom instance methods in schema's "options" object
      methods: {
        sayHi() {
          console.log(`-- ${this.name} saying hi from schema options`);
        },
        setName(newName) {
          this.name = newName;
          return this.save(); // return a thennable (promise-like) to await outside
        }
      },
      statics: {
        findByCategory(cat) {
          return this.find({ 'categories.name': cat }); // accessing subfields
        },
        findByName(name) {
          return this.find({ name: new RegExp(name, 'i') });
        }
      }
    }
  );

  // 2. define custom instance methods from schema's "methods" property
  // NOTE: has to be defined BEFORE creating MODEL
  productSchema.methods.sayHello = function() {
    console.log(`-- product ${this.name} saying hello!`);
  };

  productSchema.methods.toggleOnSale = async function() {
    this.onSale = !this.onSale;
    // make sure calling this to take effect
    await this.save();
  }


  // Model static methods
  productSchema.statics.fireSale = function() {
    // this: refers to the model "Product" created later using this schema
    return this.updateMany({}, { price: 0, onSale: true }, { runValidators: true });
  };

  productSchema.static('changeModel', function(oldModel, newModel) {
    return this.updateMany({ model: oldModel }, { model: newModel }, { runValidators: true });
  });


  // model == collection
  const Product = mongoose.model("Product", productSchema); // db in mongo: "products"


  // drop table
  await Product.deleteMany({});


  const iPhone = new Product({
    name: "iPhone 12 Pro",
    price: 16000000,
    color: "black", // not defined in schema, won't be saved to db
    onSale: true,
    qty: {
      online: 2,
      inStore: 3,
    },
    categories: [{name: 'phone'}]
  });

  iPhone.save()
    .then((data) => console.log("saved iphone:", data))
    .catch((err) => console.error("Error:", err));


  const laptop = new Product({
    name: 'Macbook Pro',
    price: 20000000,
    categories: [{ name: 'laptop' }],
    model: 'Base'
  });
  await laptop.save();


  // validating updates
  // Product.findOneAndUpdate({ name: 'iPhone 12 Pro' }, { price: 26.02 }, { new: true, runValidators: true })
  //   .then(data => console.log('new data', data)); // error, price < 0


  // custom instance methods
  iPhone.sayHello();
  iPhone.sayHi();
  laptop.sayHello();
  laptop.sayHi();

  Product.findOne({ name: /macbook/i }).then(data => console.log('ONSALE BEFORE: ', data.onSale));
  await laptop.toggleOnSale();


  // useful when not using top level async main
  const findLaptop = async () => {
    const foundProduct = await Product.findOne({ name: /macbook/i });
    foundProduct.sayHello();
    console.log('Found Laptop:', foundProduct);
    console.log('ONSALE AFTER:', foundProduct.onSale);
  };

  await findLaptop();
  

  const changeName = async () => {
    let foundProduct = await Product.findOne({ name: /macbook/i });
    console.log('NAME BEFORE: ', foundProduct.name);
    await laptop.setName('MacBook Pro M2 14"');

    // find again after setting
    foundProduct = await Product.findOne({ name: /macbook/i });
    console.log('NAME AFTER: ', foundProduct.name);
  };

  await changeName();

  // custom model static methods
  await Product.fireSale().then(res => console.log('fireSale:', res));
  await Product.findByCategory('laptop').then(p => console.log('-- LAPTOP category', p));
  await Product.changeModel('Pro', 'Pro Max');
  await Product.findByName('book').then(p => console.log('FIND BY NAME:', p));

  Product.find({}).then((p) => console.log("- all products:", p));
}


// node REPL
// .load product.js
