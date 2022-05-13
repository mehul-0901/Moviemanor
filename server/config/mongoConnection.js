require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;


const settings = {
    mongoConfig: {
      serverUrl: `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.ATLAS_DATABASE_NO_CAPS}.amazq.mongodb.net/`,
      database: `${process.env.ATLAS_DATABASE}`
    }
  };
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://vatsal007:<password>@moviemanor.amazq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
