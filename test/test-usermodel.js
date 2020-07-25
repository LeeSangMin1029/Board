import mongoose from "mongoose";
import MongoMemoryServer from "mongodb-memory-server";
import User from "../models/User.js";

let mongoServer;
const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above

before(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, opts);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("...", () => {
  it("...", async () => {
    new User({ id: "cube", name: "sangmin", password: "1234" });
    const cnt = await User.count();
    expect(cnt).to.equal(0);
  });
});
