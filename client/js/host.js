var socket = io();
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
context.fillStyle = "#181818";
context.font = "30px Roboto Slab";
context.textAlign = 'center';

/////////////////////VARIABLES\\\\\\\\\\\\\
var player1Avatar = new Image();
var player2Avatar = new Image();
var player3Avatar = new Image();
var player4Avatar = new Image();
var player5Avatar = new Image();
var player6Avatar = new Image();
var player7Avatar = new Image();
var player8Avatar = new Image();
var player9Avatar = new Image();
var player10Avatar = new Image();
var player11Avatar = new Image();
var player12Avatar = new Image();
var player13Avatar = new Image();
var player14Avatar = new Image();
var player15Avatar = new Image();
var player16Avatar = new Image();
var player17Avatar = new Image();
var player18Avatar = new Image();
var player19Avatar = new Image();
var player20Avatar = new Image();

//Audio
//var buttonClick = new Audio('../client/files/button-hover.wav');
//buttonClick.volume = 0.3;
var numsAudio = [];
var pop = new Audio('../client/files/pop.wav');
var swish = new Audio('../client/files/swish.wav');
var music = new Audio('../client/files/music.wav');
/* var aalto = new Audio('../client/files/aalto.mp3');
var falsaAlarma = new Audio('../client/files/falsaAlarma.mp3');
var fin = new Audio('../client/files/fin.mp3');
 */
music.volume = 0.3;

var players = [];
var numOfPlayers = 0;
var playersRanking = [];
var roomCode;
var round = 1;
var totalRounds = 5;
var randomInterval; //Start timout generator
var intervalTime = 5000; //5 seconds
var processing = false;
var stopGen = false;
var $ball = $('#balls > div'),
    diameter = $ball.height(),
    perimeter = Math.PI * diameter,
    n = $ball.length,
    i = 0,
    itv;

/////////////////////JQUERY\\\\\\\\\\\\\\\\\
//Number generator
$(document).ready(function () {

    alert("despres ready");
    //CreateAudioArray();
    $('#display').hide();
    $('#generator').hide();
    $('#bingoWinner').hide();
    $('#balls').hide();
    //debugger;
    music.play();


    $('#start-game').click(function () {
        socket.emit('SG');
    });

    var bingo = {
        selectedNumbers: [],
        generateRandom: function () {
            var min = 1;
            var max = 90;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random;
        },
        generateNextRandom: function () {
            if (bingo.selectedNumbers.length > 90) {
                clearInterval(randomInterval);
                //responsiveVoice.speak("Empanados, como puede ser que nadie tenga Bingo?");
                alert("Han sortit tots els numeros!");
                return 0;
            } else {
                var random = bingo.generateRandom();
                while ($.inArray(random, bingo.selectedNumbers) > -1) {
                    random = bingo.generateRandom();
                }
                bingo.selectedNumbers.push(random);
                return random;
            }
        }
    };

    //debug
    $('#genTable').on('click', 'td', function () {
        //get cell value and convert it to number
        var a = +($(this).text());
        //console.log($(this).html);
        bingo.selectedNumbers.push(a);
        $('td.cell' + a).addClass('selected');
    });

    $('td').each(function () {
        var concatClass = this.cellIndex + "" + this.parentNode.rowIndex;
        var number = parseInt(concatClass, 10) + 1;
        $(this).addClass("cell" + number).text(number);
    });

    window.onbeforeunload = function (e) {
        e = e || window.event;
        var returnString = 'Are you sure?';
        if (e) {
            e.returnValue = returnString;
        }
        return returnString;
    };



    ////////////////////////////////////////////////////////////////////////////SOCKET STUFF\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    //Send the Host Connection message to the server
    //so we can get our IPV4 address and room code
    socket.emit('HC');

    socket.on('HCR', function (data) {
        alert("abans room code");
        roomCode = data.room;
        $('#room-code').text(roomCode);
        //$('#link').text(data.ip + ":" + data.port);
    });

    //New player joined the room
    socket.on('NUA', function (data) {
        pop.play();
        var newUser = {
            avatar: data.drawing,
            playerNum: data.playerNum,
            color: GetUsersColor(data.playerNum),
            name: data.username.toUpperCase(),
            score: 0,
        };

        players.push(newUser);

        if (data.playerNum == 1) {
            player1Avatar.src = data.drawing;

            player1Avatar.onload = function () {
                context.drawImage(player1Avatar, 140, 40, player1Avatar.width / 2, player1Avatar.height / 2);
                context.fillStyle = "#69D2E7";
                context.fillText(data.username.toUpperCase(), 212, 270);
            }
        }
        else if (data.playerNum == 2) {
            player2Avatar.src = data.drawing;

            player2Avatar.onload = function () {
                context.drawImage(player2Avatar, 1165, 40, player2Avatar.width / 2, player2Avatar.height / 2);
                context.fillStyle = "#FA6900";
                context.fillText(data.username.toUpperCase(), 1257, 270);
            }
        }
        else if (data.playerNum == 3) {
            player3Avatar.src = data.drawing;

            player3Avatar.onload = function () {
                context.drawImage(player3Avatar, 635, 192, player3Avatar.width / 2, player3Avatar.height / 2);
                context.fillStyle = "#FE4365";
                context.fillText(data.username.toUpperCase(), 706, 422);
            }
        }
        else if (data.playerNum == 4) {
            player4Avatar.src = data.drawing;

            player4Avatar.onload = function () {
                context.drawImage(player4Avatar, 1170, 192, player4Avatar.width / 2, player4Avatar.height / 2);
                context.fillStyle = "#83AF9B";
                context.fillText(data.username.toUpperCase(), 1242, 422);
            }
        }
        else if (data.playerNum == 5) {
            player5Avatar.src = data.drawing;

            player5Avatar.onload = function () {
                context.drawImage(player5Avatar, 440, 350, player5Avatar.width / 2, player5Avatar.height / 2);
                context.fillStyle = "#9f9f85";
                context.fillText(data.username.toUpperCase(), 512, 580);
            }
        }
        else if (data.playerNum == 6) {
            player6Avatar.src = data.drawing;

            player6Avatar.onload = function () {
                context.drawImage(player6Avatar, 1365, 350, player6Avatar.width / 2, player6Avatar.height / 2);
                context.fillStyle = "#cca52a";
                context.fillText(data.username.toUpperCase(), 1457, 580);
            }
        }
        else if (data.playerNum == 7) {
            player7Avatar.src = data.drawing;

            player7Avatar.onload = function () {
                context.drawImage(player7Avatar, 635, 502, player7Avatar.width / 2, player7Avatar.height / 2);
                context.fillStyle = "#79BD9A";
                context.fillText(data.username.toUpperCase(), 702, 732);
            }
        }
        else if (data.playerNum == 8) {
            player8Avatar.src = data.drawing;

            player8Avatar.onload = function () {
                context.drawImage(player8Avatar, 1170, 502, player8Avatar.width / 2, player8Avatar.height / 2);
                context.fillStyle = "#D95B43";
                context.fillText(data.username.toUpperCase(), 1242, 732);
            }
        }
        else if (data.playerNum == 9) {
            player9Avatar.src = data.drawing;

            player9Avatar.onload = function () {
                context.drawImage(player9Avatar, 440, 662, player9Avatar.width / 2, player9Avatar.height / 2);
                context.fillStyle = "#542437";
                context.fillText(data.username.toUpperCase(), 512, 892);
            }
        }
        else if (data.playerNum == 10) {
            player10Avatar.src = data.drawing;

            player10Avatar.onload = function () {
                context.drawImage(player10Avatar, 1365, 662, player10Avatar.width / 2, player10Avatar.height / 2);
                context.fillStyle = "#53777A";
                context.fillText(data.username.toUpperCase(), 1457, 892);
            }
        }
        else if (data.playerNum == 11) {
            player11Avatar.src = data.drawing;

            player11Avatar.onload = function () {
                context.drawImage(player11Avatar, 245, 40, player11Avatar.width / 2, player11Avatar.height / 2);
                context.fillStyle = "#6C5B7B";
                context.fillText(data.username.toUpperCase(), 317, 270);
            }
        }
        else if (data.playerNum == 12) {
            player12Avatar.src = data.drawing;

            player12Avatar.onload = function () {
                context.drawImage(player12Avatar, 1560, 40, player12Avatar.width / 2, player12Avatar.height / 2);
                context.fillStyle = "#0B486B";
                context.fillText(data.username.toUpperCase(), 1632, 270);
            }
        }
        else if (data.playerNum == 13) {
            player13Avatar.src = data.drawing;

            player13Avatar.onload = function () {
                context.drawImage(player13Avatar, 50, 192, player13Avatar.width / 2, player13Avatar.height / 2);
                context.fillStyle = "#2e8759";
                context.fillText(data.username.toUpperCase(), 122, 422);
            }
        }
        else if (data.playerNum == 14) {
            player14Avatar.src = data.drawing;

            player14Avatar.onload = function () {
                context.drawImage(player14Avatar, 1755, 192, player14Avatar.width / 2, player14Avatar.height / 2);
                context.fillStyle = "#594F4F";
                context.fillText(data.username.toUpperCase(), 1827, 422);
            }
        }
        else if (data.playerNum == 15) {
            player15Avatar.src = data.drawing;

            player15Avatar.onload = function () {
                context.drawImage(player15Avatar, 245, 350, player15Avatar.width / 2, player15Avatar.height / 2);
                context.fillStyle = "#99B2B7";
                context.fillText(data.username.toUpperCase(), 317, 580);
            }
        }
        else if (data.playerNum == 16) {
            player16Avatar.src = data.drawing;

            player16Avatar.onload = function () {
                context.drawImage(player16Avatar, 1560, 350, player16Avatar.width / 2, player16Avatar.height / 2);
                context.fillStyle = "#797260";
                context.fillText(data.username.toUpperCase(), 1632, 580);
            }
        }
        else if (data.playerNum == 17) {
            player17Avatar.src = data.drawing;

            player17Avatar.onload = function () {
                context.drawImage(player17Avatar, 50, 502, player17Avatar.width / 2, player17Avatar.height / 2);
                context.fillStyle = "#355C7D";
                context.fillText(data.username.toUpperCase(), 122, 732);
            }
        }
        else if (data.playerNum == 18) {
            player18Avatar.src = data.drawing;

            player18Avatar.onload = function () {
                context.drawImage(player18Avatar, 1755, 502, player18Avatar.width / 2, player18Avatar.height / 2);
                context.fillStyle = "#3299BB";
                context.fillText(data.username.toUpperCase(), 1827, 732);
            }
        }
        else if (data.playerNum == 19) {
            player19Avatar.src = data.drawing;

            player19Avatar.onload = function () {
                context.drawImage(player19Avatar, 245, 662, player19Avatar.width / 2, player19Avatar.height / 2);
                context.fillStyle = "#C06C84";
                context.fillText(data.username.toUpperCase(), 317, 892);
            }
        }
        else if (data.playerNum == 20) {
            player20Avatar.src = data.drawing;

            player20Avatar.onload = function () {
                context.drawImage(player20Avatar, 1560, 662, player20Avatar.width / 2, player20Avatar.height / 2);
                context.fillStyle = "#519548";
                context.fillText(data.username.toUpperCase(), 1632, 892);
            }
        }
    });

    //Player Conf wants to start game
    //Inform host to check number of players
    socket.on('SGtoHost', function (data) {
        totalRounds = parseInt(data.nRondas);
        intervalTime = parseInt(data.nVelocidad * 1000);
        //Send Start Game to server
        socket.emit('SG');
    });

    //Start the game
    socket.on('GTG', StartGame);

    //We need more players
    socket.on('NG', function (data) {
        alert("Necesitamos mas jugadores");
    });

    //Check possible bingo
    socket.on('possibleBingo', function (data) {
        clearInterval(randomInterval);
        aalto.play();
        /*         responsiveVoice.speak("ALTO. Parece que " + data.player + " tiene bingo. Vamos a comprobarlo", "Spanish Female", {
                    onend: function () {
         */                //Check bingo numbers
        setTimeout(function () {
            var generatedNums = bingo.selectedNumbers;
            var givenNums = data.bingoNums;
            var difference = $(givenNums).not(generatedNums).get();
            if (difference.length == 0) {
                //Es ben bona
                weHaveAWinner(data.player);
                socket.emit('WHW', {
                    winner: data.player,
                });
            } else {
                //Tell server that the player who emitted bingo has fake numbers
                socket.emit('fakeNumbers', {
                    fakenums: difference,
                    playerID: data.playerID
                });
                //alert("Aquests numeros no hi son: " + difference);
            }
        }, 5000);
/*             }
        });
 */    });

    socket.on('PlayerPenalty', function (data) {
        for (var i = 0; i < players.length; i++) {
            if (data.playerNum == players[i].playerNum) {
                players[i].score -= data.amount * 100;
            }
        }
        //Restart numbers generator
        falsaAlarma.play();
/*         responsiveVoice.speak("Falsa alarma, continuamos", "Spanish Female", {
            onend: function () {
 */                randomInterval = setInterval(function () { GenerateNumber() }, intervalTime);

/*         });
 */    });

    socket.on('UpdateScore', function (data) {

        UpdatePlayerScores(data.winner);
        DisplayScores(round);
        resetTable();
        //Next round
        if (round < totalRounds) {
            round++;
            setTimeout(function () {
/*                 responsiveVoice.speak("Preparados para la siguiente ronda?", {
                    onend: function () {
 */                        music.pause();
                music.currentTime = 0;

                socket.emit('nextRound', {
                });
                StartGame({ numOfPlayers: numOfPlayers });
                //setTimeout(function () {
                /*                     context.clearRect(0, 0, canvas.width, canvas.height);
                                    $('#generator').show("slow");
                                    $('#display').hide("fade");
                                    $('#bingoWinner').hide("fade");
                                    randomInterval = setInterval(function () { GenerateNumber() }, intervalTime);
                 */                    //}, 5000);
                /*                     }
                                });
                 */
            }, 10000);

        } else {
            //Game end
            fin.play();
            fin.onended = function () {
                /*             responsiveVoice.speak("Fin del juego", "Spanish Female");
                 */            //alert("todas las rondas completadas")
                round = 1;
                ResetPlayerScores();
                socket.emit('gameEnd', {
                });
            };
        }


    });



    /////////////////////////FUNCTIONS\\\\\\\\\\\\\\\\\\\\\\\\
    function CreateAudioArray() {
        for (var i = 1; i < 91; i++) {
            numsAudio[i] = new Audio('../client/files/numbers/' + i + '.mp3');
        }
    }

    function StartGame(data) {
        //music.pause();
        //music.currentTime = 0;
        swish.play();
        $('#main-menu').hide();
        context.clearRect(0, 0, canvas.width, canvas.height);
        numOfPlayers = data.numOfPlayers;
        //voice1.play();
        //voice2.play();
        doDrawingTime = true;
        $('#roundDisplay').text("Ronda " + round);
        $('#generator').show("slow");
        $('#display').hide("fade");
        $('#bingoWinner').hide("fade");
        socket.emit('StartPlaying', {});
        randomInterval = setInterval(function () { GenerateNumber() }, intervalTime);
    }

    function rotateBall(distance, text) {
        $('.ball>div>span').text(text);
        var degree = distance * 360 / perimeter;
        $ball.eq(i).css({
            transition: "2s cubic-bezier(1.000, 1.450, 0.185, 0.850)",
            transform: 'translateX(' + distance + 'px)'
        }).find('div').css({
            transition: "2s cubic-bezier(1.000, 1.450, 0.185, 0.850)",
            transform: 'rotate(' + degree + 'deg)'
        });
    }

    function GenerateNumber() {
        $('#balls').show();
        var random = bingo.generateNextRandom().toString();
        $('.ball>div>span').text(random);
        var posRandom = [
            $('td.cell' + random).position().left,
            $('td.cell' + random).position().top + diameter
        ];
        $ball.eq(0).css({
            top: posRandom[1]
        });

        rotateBall(770 + posRandom[0] + (diameter * i), random);
        numsAudio[random].play();
        setTimeout(() => {
            $('td.cell' + random).addClass('selected');
            $ball.eq(0).css({
                transform: 'none',
                transition: 'none',
                left: '-120px',
                top: '500px',
            }).find('div').css({
                transform: 'none',
                transition: 'none'
            })
        }, 2000);
    }

    /*             try {
                    numsAudio[random].play();
                }
                catch (err) {
                    alert(err);
                    //alert(numsAudio[random].error.code);
                    if (err === 4) {
                        decir(random, selectRotatingBallNumber());
                    }
                    else {
                        numsAudio[random].onended = function () {
                            selectRotatingBallNumber()
                        };
                    }
                }
            }
     */

    function selectRotatingBallNumber(num) {
        $('td.cell' + num).addClass('selected');
        $ball.eq(0).css({
            transform: 'none',
            transition: 'none',
            left: '-120px',
            top: '500px',
        }).find('div').css({
            transform: 'none',
            transition: 'none'
        });
    }

    function resetTable() {
        bingo.selectedNumbers = [];
        $('tbody tr td').removeClass("selected");
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

    function weHaveAWinner(player) {
        $('#bingoWinner').show();
        $('#balls').hide();
        bingo.generatedNums = [];
        //responsiveVoice.speak("Felicidades " + player + " has ganado esta ronda", "Spanish Female");
        //
    }

    function GetUsersColor(playerNum) {
        switch (playerNum) {
            case 1:
                currentColor = '#69D2E7';
                break;

            case 2:
                currentColor = '#FA6900';
                break;

            case 3:
                currentColor = '#FE4365';
                break;

            case 4:
                currentColor = '#83AF9B';
                break;

            case 5:
                currentColor = '#9f9f85';
                break;

            case 6:
                currentColor = '#cca52a';
                break;

            case 7:
                currentColor = '#79BD9A';
                break;

            case 8:
                currentColor = '#D95B43';
                break;

            case 9:
                currentColor = '#542437';
                break;

            case 10:
                currentColor = '#53777A';
                break;

            case 11:
                currentColor = '#6C5B7B';
                break;

            case 12:
                currentColor = '#0B486B';
                break;

            case 13:
                currentColor = '#2e8759';
                break;

            case 14:
                currentColor = '#594F4F';
                break;

            case 15:
                currentColor = '#99B2B7';
                break;

            case 16:
                currentColor = '#797260';
                break;

            case 17:
                currentColor = '#355C7D';
                break;

            case 18:
                currentColor = '#3299BB';
                break;

            case 19:
                currentColor = '#C06C84';
                break;

            case 20:
                currentColor = '#519548';
                break;
        }
    }

    function UpdatePlayerScores(winner) {
        for (var i = 0; i < players.length; i++) {
            if (winner == players[i].name) {
                players[i].score += 1000;
            }
        }
    }

    function ResetPlayerScores() {
        for (var i = 0; i < players.length; i++) {
            players[i].score = 0;
        }
    }

    function DisplayScores(round) {
        setTimeout(function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            swish.play();
            //voice11.play();
            $('#generator').hide("slow");
            $('#display').show();
            $('#drawing-title').text('PUNTUACIONES');
            $('#drawing-title').css('color', '#181818');
            music.play();
            //We need to display all the users avatars back at their positions but replace their names with their scores
            for (var p = 0; p < players.length; p++) {
                pop.play();
                if (players[p].playerNum == 1) {
                    context.drawImage(player1Avatar, 440, 40, player1Avatar.width / 2, player1Avatar.height / 2);
                    context.fillStyle = "#69D2E7";
                    context.fillText(players[p].score, 512, 270);
                }
                else if (players[p].playerNum == 2) {
                    context.drawImage(player2Avatar, 1365, 40, player2Avatar.width / 2, player2Avatar.height / 2);
                    context.fillStyle = "#FA6900";
                    context.fillText(players[p].score, 1457, 270);
                }
                else if (players[p].playerNum == 3) {
                    context.drawImage(player3Avatar, 635, 192, player3Avatar.width / 2, player3Avatar.height / 2);
                    context.fillStyle = "#FE4365";
                    context.fillText(players[p].score, 706, 422);
                }
                else if (players[p].playerNum == 4) {
                    context.drawImage(player4Avatar, 1170, 192, player4Avatar.width / 2, player4Avatar.height / 2);
                    context.fillStyle = "#83AF9B";
                    context.fillText(players[p].score, 1242, 422);
                }
                else if (players[p].playerNum == 5) {
                    context.drawImage(player5Avatar, 440, 350, player5Avatar.width / 2, player5Avatar.height / 2);
                    context.fillStyle = "#9f9f85";
                    context.fillText(players[p].score, 512, 580);
                }
                else if (players[p].playerNum == 6) {
                    context.drawImage(player6Avatar, 1365, 350, player6Avatar.width / 2, player6Avatar.height / 2);
                    context.fillStyle = "#cca52a";
                    context.fillText(players[p].score, 1457, 580);
                }
                else if (players[p].playerNum == 7) {
                    context.drawImage(player7Avatar, 635, 502, player7Avatar.width / 2, player7Avatar.height / 2);
                    context.fillStyle = "#79BD9A";
                    context.fillText(players[p].score, 702, 732);
                }
                else if (players[p].playerNum == 8) {
                    context.drawImage(player8Avatar, 1170, 502, player8Avatar.width / 2, player8Avatar.height / 2);
                    context.fillStyle = "#D95B43";
                    context.fillText(players[p].score, 1242, 732);
                }
                else if (players[p].playerNum == 9) {
                    context.drawImage(player9Avatar, 440, 662, player9Avatar.width / 2, player9Avatar.height / 2);
                    context.fillStyle = "#542437";
                    context.fillText(players[p].score, 512, 892);
                }
                else if (players[p].playerNum == 10) {
                    context.drawImage(player10Avatar, 1365, 662, player10Avatar.width / 2, player10Avatar.height / 2);
                    context.fillStyle = "#53777A";
                    context.fillText(players[p].score, 1457, 892);
                }
                else if (players[p].playerNum == 11) {
                    context.drawImage(player11Avatar, 245, 40, player11Avatar.width / 2, player11Avatar.height / 2);
                    context.fillStyle = "#6C5B7B";
                    context.fillText(players[p].score, 317, 270);
                }
                else if (players[p].playerNum == 12) {
                    context.drawImage(player12Avatar, 1560, 40, player12Avatar.width / 2, player12Avatar.height / 2);
                    context.fillStyle = "#0B486B";
                    context.fillText(players[p].score, 1632, 270);
                }
                else if (players[p].playerNum == 13) {
                    context.drawImage(player13Avatar, 50, 192, player13Avatar.width / 2, player13Avatar.height / 2);
                    context.fillStyle = "#2e8759";
                    context.fillText(players[p].score, 122, 422);
                }
                else if (players[p].playerNum == 14) {
                    context.drawImage(player14Avatar, 1755, 192, player14Avatar.width / 2, player14Avatar.height / 2);
                    context.fillStyle = "#594F4F";
                    context.fillText(players[p].score, 1827, 422);
                }
                else if (players[p].playerNum == 15) {
                    context.drawImage(player15Avatar, 245, 350, player15Avatar.width / 2, player15Avatar.height / 2);
                    context.fillStyle = "#99B2B7";
                    context.fillText(players[p].score, 317, 580);
                }
                else if (players[p].playerNum == 16) {
                    context.drawImage(player16Avatar, 1560, 350, player16Avatar.width / 2, player16Avatar.height / 2);
                    context.fillStyle = "#797260";
                    context.fillText(players[p].score, 1632, 580);
                }
                else if (players[p].playerNum == 17) {
                    context.drawImage(player17Avatar, 50, 502, player17Avatar.width / 2, player17Avatar.height / 2);
                    context.fillStyle = "#355C7D";
                    context.fillText(players[p].score, 122, 732);
                }
                else if (players[p].playerNum == 18) {
                    context.drawImage(player18Avatar, 1755, 502, player18Avatar.width / 2, player18Avatar.height / 2);
                    context.fillStyle = "#3299BB";
                    context.fillText(players[p].score, 1827, 732);
                }
                else if (players[p].playerNum == 19) {
                    context.drawImage(player19Avatar, 245, 662, player19Avatar.width / 2, player19Avatar.height / 2);
                    context.fillStyle = "#C06C84";
                    context.fillText(players[p].score, 317, 892);
                }
                else if (players[p].playerNum == 20) {
                    context.drawImage(player20Avatar, 1560, 662, player20Avatar.width / 2, player20Avatar.height / 2);
                    context.fillStyle = "#519548";
                    context.fillText(players[p].score, 1632, 892);
                }
            }

            playersRanking = players;
            playersRanking.sort(sort_by('score', false, parseInt));

            for (var y = 0; y < playersRanking.length; y++) {
                var posNum = y + 1;
                GetUsersColor(playersRanking[y].playerNum);
                context.fillStyle = currentColor;
                var yPos = 200 + (y * 35);
                context.fillText(posNum + ": " + playersRanking[y].name, 960, yPos);
            }

        }, 1000);
    }

    var sort_by = function (field, reverse, primer) {
        var key = function (x) { return primer ? primer(x[field]) : x[field] };

        return function (a, b) {
            var A = key(a), B = key(b);
            return ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [-1, 1][+!!reverse];
        }
    }

});