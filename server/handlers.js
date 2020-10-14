

"use strict";

const { MongoClient } = require("mongodb");
//mongo library

require("dotenv").config();
const { MONGO_URI } = process.env;
const dbName = "exercises";

const getSeats = async () => {
  const client = await MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(dbName);
  console.log("connected!");
  let seats = await db.collection("seats").find({}).toArray();
  console.log(seats)
  client.close();
  console.log("disconnected!");
  return Object.assign(...seats.map((seat) => ({ [seat._id]: seat })));
};

const updateBookedSeats = async (_id,fullName,email) => {
  const client = await MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(dbName);
  console.log("connected!");
  let seats = await db
    .collection("seats")
    .findOneAndUpdate({ _id }, { $set: { isBooked: true , fullName , email} });
  client.close();
};

const updateSeats = async (seats) => {
  const client = await MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection("seats").insertMany(seats);
    //SENDS THE DATA TO MONGO
  } catch (err) {
    console.log(err);
  }
  client.close();
};

module.exports = { getSeats, updateSeats, updateBookedSeats };