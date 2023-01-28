const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const randomColor = require("randomcolor");
const createBoard = require("./create-board");
const createCooldown = require("./create-cooldown");

const { Client } = require("pg");

// const Client connection here

const app = express();
const clientPath = `${__dirname}/../client`;

console.log(`serving static from ${clientPath}`);
app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);
const { clear, getBoard, makeTurn } = createBoard(20);
var users = [];

function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

client.connect();

io.on("connection", (sock) => {
  //
  const color = randomColor();
  const cooldown = createCooldown(2000);
  sock.emit("board", getBoard()); // sock.emit sends to the client side (meaning that only the client side will se this message)

  sock.on("message", (text) =>
    io.emit("message", users[sock.id] + ": " + text)
  ); // calling io.emit means send to everyone including client. so a broadcast to everyone in server.

  sock.on("turn", ({ x, y }) => {
    if (cooldown()) {
      const playerWon = makeTurn(x, y, color);
      io.emit("turn", { x, y, color });
      if (playerWon) {
        io.emit("message", users[sock.id] + " Won");

        console.log("winning user: ", users[sock.id]);
        var select_statement =
          `SELECT wins FROM userinfo WHERE username = '` + users[sock.id] + `'`;
        console.log(select_statement);

        //retrieves current number of wins for the winning user from the database
        client.query(select_statement, (err, res) => {
          if (!err) {
            //not sure which of these two is correct for storing the wins into var currentWins
            console.log("after select: ", res.rows[0].wins);

            var currentWins = res.rows[0].wins + 1;

            var update_statement =
              `UPDATE userinfo SET wins = ` +
              currentWins +
              ` WHERE username = '` +
              users[sock.id] +
              `'`;

            //increments the winning user's wins by 1
            client.query(update_statement, (err, res) => {
              if (!err) {
                console.log("update successful");
              } else {
                console.log(err.message);
              }
            });
          } else {
            console.log(err.message);
          }
        });

        io.emit("message", "New Round");
        clear();
        io.emit("board");
      }
    }
  });
  sock.on("new-user", (name) => {
    console.log("new user");

    // check for unique user
    if (users.includes(name)) {
      var temp = String(getRandInt(100, 1000));
      var unique_name = name + temp;
      users.push(unique_name);
    } else {
      users.push(name);
      var unique_name = name;
    }

    users[sock.id] = unique_name;
    io.emit("message", unique_name + " Connected");

    //insert user into database/leaderboard
    var insert_statement =
      `INSERT INTO userinfo (username, wins) VALUES ('` + unique_name + `', 0)`;

    client.query(insert_statement, (err, res) => {
      if (err) {
        console.log(err.message);
      }
    });
  });
});

server.on("error", (err) => {
  console.error(err);
  client.end();
});

server.listen(process.env.PORT || 5000, () => {
  console.log("server is ready");
});
