// Imports the server.js file to be tested.
const server = require("../server");
// Assertion (Test Driven Development) and Should,  Expect(Behaviour driven 
// development) library
const chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

import { createServer } from "http";
import { io as Client } from "socket.io-client";
import { Server } from "socket.io";
import { assert } from "chai";

// https://socket.io/docs/v4/testing/ this has documentation on testing

describe("server project", () =>{
    let io, serverSocket, clientSocket;

    before((done) => {

        //I think this just makes sure to run the server before a test, and then close it afterwards
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
          const port = httpServer.address().port;
          clientSocket = new Client(`http://localhost:${port}`);
          io.on("connection", (socket) => {
            serverSocket = socket;
          });
          clientSocket.on("connect", done);
        });
      });
    
      //this closes the server
      after(() => {
        io.close();
        clientSocket.close();
      });

      it("test 1", (done) => {
          chai
          .something
          .end((err, res) => {
              expect(something);
              done();
          });
      });
      describe("test1", () =>{
        let var1, var2, var3;
    
        before((done) => {
    
          
              const port = httpServer.address().port;
              clientSocket = new Client(`http://localhost:${port}`);
              io.on("connection", (socket) => {
                serverSocket = socket;
              });
              clientSocket.on("connect", done);
            });
          });
        
          after(() => {
            io.close();
            clientSocket.close();
          });
    
          it("test 1", (done) => {
              chai
              .something
              .end((err, res) => {
                  expect(something);
                  done();
              });
          });

});