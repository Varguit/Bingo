const say = require('say');

//import express.js 
var express = require('express');
//assign it to variable app 
var app = express();
//create a server and pass in app as a request handler
var serv = require('http').Server(app);
// io connection 
var io = require('socket.io')(serv, { 'pingInterval': 2000, 'pingTimeout': 50000 });

//This gets the local IPV4 address
var localIP;
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  //console.log('addr: '+add);
  var localIP = add;
  console.log('Server started, listening on: ' + localIP + ":" + port);
})

//Start server
var port = 3000;
serv.listen(process.env.PORT || port);

//send a index.html file when a get request is fired to the given 
//route, which is ‘/’ in this case
app.get('/', function (req, res) {
  res.sendFile('index.html', { "root": __dirname + '/client' });
});

//this means when a get request is made to ‘/client’, put all the 
//static files inside the client folder under ‘/client’.
app.use('/client', express.static(__dirname + '/client'));


////////////////////////////////SERVER STUFF\\\\\\\\\\\\\\\\\\\\

// variables
var clients = [];


// listen for a connection request from any client
io.sockets.on('connection', function (socket) {
  console.log('[SERVER] New client connected (id: ' + socket.id + ').');

  clients.push(socket);

  //HC - Host Connection
  //We should generate a room and pass that info back to the host along with the localIP
  //We create a new socket room based on the generated room code, we also set our client
  //to be a host client. We return the info back to the host through a Host Connection Return
  //message. This will give the host the info it needs to users can start joining.
  socket.on('HC', function () {
    for (var k = 0; k < clients.length; k++) {
      clients[k].isHost = false;
      clients[k].numOfPlayers = 0;
      clients[k].gameStarted = false;
      if (socket.id == clients[k].id) {
        clients[k].isHost = true;
        clients[k].room = GenerateRoomCode();
        clients[k].numOfPlayers = 0;
        clients[k].gameStarted = false;

        socket.join(clients[k].room);
        console.log("host joined room: " + clients[k].room);

        //This is our Host Connection Response
        socket.emit('HCR', {
          ip: localIP,
          port: port,
          room: clients[k].room
        });
      }
    }
  });

  //PC - Player Connected
  //We should check to see if their room code is right, if it is we need to add them
  //to the room, otherwise we need to let them know they screwed up.
  socket.on('PC', function (data) {
    for (var k = 0; k < clients.length; k++) {
      if (socket.id == clients[k].id) {
        clients[k].room = data.room.toLowerCase();
        clients[k].name = data.name;
        clients[k].score = 0;
        clients[k].finishedDrawing = false;
        clients[k].isHost = false;
        console.log('[SERVER] New client ' + data.name + ' is trying to find a room.');
        //search through clients to find host and look for the correct room code
        for (var x = 0; x < clients.length; x++) {
          if (clients[x].isHost && !clients[x].gameStarted) {
            if (clients[x].room == clients[k].room) {
              if (clients[x].numOfPlayers == 20) {
                socket.emit('PCE');
                console.log('[SERVER] This room is maxed.');
              } else {
                //this means we found the host and the room codes match
                socket.join(clients[k].room);
                clients[x].numOfPlayers++;
                clients[k].playerNum = clients[x].numOfPlayers;
                //first player can config game
                if (clients[k].playerNum === 1) {
                  clients[k].isConf = true;
                }
                socket.emit('PCR', {
                  playerNum: clients[k].playerNum,
                });
                console.log('[SERVER] Client found a room with the code ' + clients[k].room);
                return;
              }
            }
          }
          else if (clients[x].isHost && clients[x].gameStarted) {
            console.log('[SERVER] Client found a room with the code ' + clients[k].room + " but the game has already started.");
            socket.emit('PCF');
            return;
          }
          else if (x == clients.length - 1) {
            //we couldn't find any host or matching room codes
            socket.emit('PCE');
            console.log('[SERVER] Client could not find a room with the code ' + clients[k].room);
            return;
          }
        }
      }
    }
  });

  //UA - User Avatar
  //OUTPUT: NUA - New User Avatar
  //We should look for the matching client and then update their avatar image with the
  //image they sent in. We also need to send this info to the host so they can display
  //the new avatar.
  socket.on('UA', function (data) {
    for (var k = 0; k < clients.length; k++) {
      if (socket.id == clients[k].id) {
        clients[k].avatar = data.drawing;

        //Send avatar to the host so it can update its player list
        socket.broadcast.to(clients[k].room).emit('NUA', {
          drawing: clients[k].avatar,
          playerNum: clients[k].playerNum,
          username: clients[k].name,
        });
        //Send to socket 
        socket.emit('checkConf', {
          isConf: clients[k].isConf
        });
        console.log("NUA enviat a room:" + clients[k].room);
      }
    }
  });

  //SG - Start Game
  //We need to check to see how many players exist in the server, if there are more than
  //3 players we can send the start message, if there are less than 3 we need to
  //do nothing. Maybe send a different type of message.
  socket.on('SG', function () {
    for (var k = 0; k < clients.length; k++) {
      if (socket.id == clients[k].id) {
        if (clients[k].numOfPlayers >= 1) {
          console.log('[GAME ' + clients[k].room + '] Host ' + clients[k].room + ' is starting a game.');
          socket.emit('GTG', {
            numOfPlayers: clients[k].numOfPlayers
          });
          clients[k].gameStarted = true;

        } else {
          socket.emit('NG', {
          });
          console.log('[GAME " + clients[k].room + "] Host ' + clients[k].room + " is trying to start a game but they don't have enough players.");
        }
      }
    }
  });

  socket.on('SGfromConf', function (data) {
    io.emit('SGtoHost', {
      nRondas: data.nRondas,
      nVelocidad: data.nVelocidad
    });
    //pausa
  });

  //One player has announced Bingo, pause generator and send to all players
  socket.on('bingoCall', function (data) {
    say.speak('Parece que alguien tiene bingo. Vamos a comprobarlo');
    for (var k = 0; k < clients.length; k++) {
      if (socket.id == clients[k].id) {
        var playerBingoName = clients[k].name;
        console.log(playerBingoName + " possiblement te bingo");
        break;
      }
    }
    io.in(clients[k].room).emit('possibleBingo', {
      bingoNums: data.numCheck,
      player: playerBingoName,
      playerID: clients[k].id
    });
  });

  //WHW - winner recieved
  //We have a winner
  //we will pass in the player name
  socket.on('WHW', function (data) {
    var winnerName = data.winner.toUpperCase();
    console.log(winnerName + " ha ganado esta ronda");
    io.emit('UpdateScore', {
      winner: winnerName,
      round: data.ronda,
    });
  });

  //Penalty
  socket.on('Penalty', function (data) {
    for (var k = 0; k < clients.length; k++) {
      if (socket.id == clients[k].id) {
        //Tell Host to punish player
        io.emit('PlayerPenalty', {
          playerNum: clients[k].playerNum,
          amount: data.amount
        });
        break;
      }
    }
  });

  //SWP - Send Numbers
  //Once the host tells us to send the numbers we will call the send number function
  //we will pass in the room code
  socket.on('StartPlaying', function (data) {
    io.emit('SP', {});
  });


  socket.on('fakeNumbers', function (data) {
    console.log("Falsa alarma, numeros incorrectes");
    socket.broadcast.to(data.playerID).emit('fakeNums', {
      unselectNums: data.fakenums
    });
  });

  //Start a new round
  socket.on('nextRound', function (data) {
    io.emit('nextR', {

    });
  });

  //SOCKETS END
});



//////////////////////FUNCTIONS\\\\\\\\\\\\\\\\\\\\\\\\\
function GenerateRoomCode() {
  var letter1 = getRandomInt(1, 26);
  var letter2 = getRandomInt(1, 26);
  var letter3 = getRandomInt(1, 26);
  var letter4 = getRandomInt(1, 26);

  var roomCode = "";

  roomCode = GetLetterFromInt(letter1) + GetLetterFromInt(letter2) + GetLetterFromInt(letter3) + GetLetterFromInt(letter4);
  console.log("[SERVER] New host generated room code: " + roomCode);

  return roomCode;
}

function getRandomInt(min, max) {

  return Math.floor(Math.random() * (max - min + 1)) + min;

}

//This function gets our letters from the number we pass in
function GetLetterFromInt(number) {
  switch (number) {
    case 1:
      return "a";
    case 2:
      return "b";
    case 3:
      return "c";
    case 4:
      return "d";
    case 5:
      return "e";
    case 6:
      return "f";
    case 7:
      return "g";
    case 8:
      return "h";
    case 9:
      return "i";
    case 10:
      return "j";
    case 11:
      return "k";
    case 12:
      return "l";
    case 13:
      return "m";
    case 14:
      return "n";
    case 15:
      return "o";
    case 16:
      return "p";
    case 17:
      return "q";
    case 18:
      return "r";
    case 19:
      return "s";
    case 20:
      return "t";
    case 21:
      return "u";
    case 22:
      return "v";
    case 23:
      return "w";
    case 24:
      return "x";
    case 25:
      return "y";
    case 26:
      return "z";
  }
}

function decir(text, onend) {
  window.speechSynthesis.cancel();
  var ssu = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(ssu);
  function _wait() {
    if (!window.speechSynthesis.speaking) {
      onend();
      return;
    }
    window.setTimeout(_wait, 200);
  }
  _wait();
}
