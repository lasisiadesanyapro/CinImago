import mongoose from "mongoose";
import User from "../modules/auth/user/user.model.js";
import "dotenv/config";
import bcrypt from "bcryptjs";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const userObject = {
  firstName: "Adesanya",
  lastName: "Are",
  email: "adesanya+20@gmail.com",
  password: "power256",
  role: "admin",
};

const MongoUri = process.env.DB_STRING;
mongoose
  .connect(MongoUri, { dbname: process.env.DB_NAME })
  .then(() => {
    console.log(`connected to mongodb`);
  })
  .catch((err) => {
    console.log(`error connecting to mongodb`, err);
    process.exit(1);
  });

async function seedAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userObject.password, salt);

    const user = await User.create({
      firstName: userObject.firstName,
      lastName: userObject.lastName,
      email: userObject.email,
      password: hashedPassword,
      role: userObject.role,
    });
    if (!user) {
      console.error(" error seeding admin user");
      process.exit(1);
    }
    console.log("Admin user seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("error seeding admin user", error);
    process.exit(1);
  }
}

seedAdmin();
