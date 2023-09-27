const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const { connection, getdb } = require("./database/database");

const arcade = require("./routes/arcade");
const user = require("./routes/user");

const app = express();
const server = require("http").Server(app);

//socket.io
const setupSocket = require("./socket/games_1");
setupSocket(server);
const setupSocketForChat = require("./socket/chat");
setupSocketForChat(server);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", arcade);
app.use("/", user);

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "games"),
  path.join(__dirname, "frontend"),
]);

//root
app.get("/", (req, res) => {
  const sessionString = req.cookies.sessionToken;
  db.collection("accounts")
    .find()
    .toArray()
    .then((result) => {
      if (result.length > 0) {
        let i;
        for (i = 0; i < result.length; i++) {
          let username = result[i].username;
          if (result[i].session === sessionString) {
            res.render("user", { username: username });
          } else {
            res.sendFile(__dirname + "/frontend/index.html");
          }
        }
      } else {
        res.sendFile(__dirname + "/frontend/index.html");
      }
    });
});

//connecting to database and runnning server
connection((err) => {
  if (!err) {
    server.listen(3000, (err) => {
      if (err) {
        console.error("Error starting server:", err);
      } else {
        console.log("Server is running at 3000...");
      }
    });
    db = getdb();
  }
});
