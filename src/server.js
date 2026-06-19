import createapp from "./app.js";
import http from "http";
import "dotenv/config";
import connectToDatabase from "./db/db.js";
const PORT = process.env.PORT || 5000;

const main = () => {
  const app = createapp();
  const server = http.createServer(app);

  connectToDatabase().then(() => {
    server.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  });
};
main();
