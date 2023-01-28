const { Client } = require("pg");
const express = require("express");
const http = require("http");
const port = process.env.PORT || 3000;

const app = express();

//leaderboard SQL query here
const leaderboard = "SELECT * FROM userinfo ORDER BY wins DESC LIMIT 5";

client.connect();
client.query(leaderboard, (err, res) => {
  if (!err) {
    console.log(res.rows[0]);

    let resultUser = res.rows.map((a) => a.username);
    let resultWins = res.rows.map((a) => a.wins);

    console.log(resultUser);
    console.log(resultWins);

    var text = `<style>body {background-color: powderblue;} h1 {margin-top: 0; margin-bottom: 0.5rem; font-weight: 625; line-height: 1.2;} #grad {background-image: linear-gradient(white, powderblue);} tr:nth-child(even) {background-color: powderblue;} tr {border-bottom: 1px solid #ddd;}</style><center id="grad"><h1>TicTacToeMax Leaderboard</h1><table height="300" width="150"><tr><th>Username</th><th>Wins</th></tr><tr><td>${res.rows[0].username}</td><td>${res.rows[0].wins}</td></tr><tr><td>${res.rows[1].username}</td><td>${res.rows[1].wins}</td></tr><tr><td>${res.rows[2].username}</td><td>${res.rows[2].wins}</td></tr><tr><td>${res.rows[3].username}</td><td>${res.rows[3].wins}</td></tr><tr><td>${res.rows[4].username}</td><td>${res.rows[4].wins}</td></tr></table><br></center>`;

    app.get("/", (req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(text);
      res.end();
    });

    app.listen(port, () => {
      console.log(`Server is ready`);
    });
  } else {
    console.log(err.message);
  }

  client.end();
});
