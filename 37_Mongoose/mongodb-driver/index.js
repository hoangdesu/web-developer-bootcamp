const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.7.";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");

    const db = client.db('league');
    const champs = db.collection('champs');
    
    const zedQuery = { name: 'Zed'};
    const midQuery = { roles: { $in: ['mid'] }}
    const cursor = await champs.find();
    // console.log('ONECHAMP:', oneChamp);

    await cursor.forEach(champ => {
        console.log('-', champ.name, champ.roles);
    })

    // await champs.insertOne({ name: 'Teemo', roles: 'top' });
    // await champs.deleteMany({ name: 'Teemo' })

    // const r = await champs.insertOne({ name: 'Yasuo', roles: ['mid', 'top', 'jungle', 'adc', 'support']})
    // console.log(r);

    // const allChamps = await champs.find();
    // console.log(allChamps);

    // const result = await champs.replaceOne(
    //     { name: 'Yasuo' },
    //     { roles: ['mid', 'top', 'jungle', 'adc', 'support'] }
    // );

    // console.log(result);

    // await champs.deleteOne({name: 'Yasuo'})
    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
