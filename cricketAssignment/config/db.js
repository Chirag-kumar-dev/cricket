// db.js
  
  const mongoose = require('mongoose');
  const config = require('config');
  // const db = config.get('mongoURI');
  const { MongoClient } = require("mongodb");
  const url="mongodb+srv://chiragKumarMongoDb:999Mongodb@cluster0.tjvbj.mongodb.net/?retryWrites=true&w=majority" 
  const client = new MongoClient(url);
  const dbName="cricket"
  
  let connected;
  const connectDB = async () => {
    try {
      if(connected){
        return
      }
      await client.connect();
      console.log('MongoDB is Connected...');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };
  db = client.db(dbName);
  let col = db.collection("matches");
  let matches;

  async function getAllMatches(){
    matches=await col.find().toArray();
    return matches;
  }

  async function getMatchById(matchId){
    const matches=await col.findOne({match_Id:matchId});
    return matches;
  }
  async function getMatchesByDateRange(startDate,endDate){
    const matches=await col.find({ 
      matchdate_gmt: {
            $gte: startDate,
            $lt: endDate
             }
      })
    return matches;
  }
  // getAllMatches();
  module.exports = connectDB;
  module.exports=getAllMatches;
  module.exports=getMatchById
  module.exports=getMatchesByDateRange;