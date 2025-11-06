import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "ServiceHive" })
    .then((c) => {
      console.log(`DB connected to host ${c.connection.host}`);
    })
    .catch((err) => console.log(err));
};
