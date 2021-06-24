const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const logger = require("morgan");
const { createServer } = require("http");
const FactureRouter = require("./routes/facture");
const UserRouter = require("./routes/user");
const app = express();
const port = 5000;
const MONGOOSE_URI_CONNECTION = "mongodb://localhost:27017/bonita";
function connectMongoDB() {
  const mongoUrl = MONGOOSE_URI_CONNECTION;

  mongoose
    .connect(mongoUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(async () => {
      /** ready to use. The `mongoose.connect()` promise resolves to undefined. */

      console.log(chalk.green("Connected to database"));
    })
    .catch((err) => {
      console.log(
        chalk.red(
          "MongoDB connection error. Please make sure MongoDB is running. " +
            err
        )
      );
      // process.exit();
    });
}
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(require("connect").bodyParser());
app.use(logger("dev"));
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
app.use("/user", UserRouter);
app.use("/facture", FactureRouter);
const ws = createServer(app);
ws.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
connectMongoDB();
