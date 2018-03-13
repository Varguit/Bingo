////////////////////JQUERY STUFF\\\\\\\\\\\\
$(document).ready(function () {
    //'use strict';

    //Variables
    var socket = io();
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var usedArray = new Array(90);
    var baseArray = new Array(0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4);
    var number = 0;
    var base = 0;

    //Initial login show
    $('#play').hide();
    $('#login-error').hide();
    $('#input-text').hide();
    $('#page').hide();
    $('#input-config').hide();
    //window.scrollTo(0,document.body.scrollHeight);
    /*     $('html,body').animate({
            scrollTop: document.body.scrollHeight,
            scrollTop: $('#button-wrapper').offset().top
        },"fast");
     */


    $('#login-send').click(function () {

        var username = $('#display-name').val();
        var roomCode = $('#room-code').val();

        if (username.length > 12) username = username.substring(0, 13);
        socket.emit('PC', {
            room: roomCode,
            name: username
        });
    });

    $('#send').click(function () {
        //if (state == "avatar") {
        var dataURL = canvas.toDataURL();
        console.log('envia dibuix');

        socket.emit('UA', {
            drawing: dataURL
        });

    });

    $('#startGame').click(function () {
        var ron = $("#rondas").val();
        var vel = $("#velocidad").val();
        // Send Start Game from Config player
        socket.emit('SGfromConf', {
            nRondas: ron,
            nVelocidad: vel
        });
    });

    $('td').click(function () {
        $(this).toggleClass("selected");
        if (CheckBingoCall()) {
            $('#callBingo').attr('disabled', false);
            $('#callBingo').css('background-color', 'green');
        } else {
            $('#callBingo').attr('disabled', true);
            $('#callBingo').css('background-color', 'grey');
        }

    });

    $('#callBingo').click(function () {
        rowArray = [];
        var totalRows = $('#table1 tr').length;
        var cellsInARow = $('#table1').children('tbody').children('tr:eq(1)').children('td').length;
        //Check row numbers and send bingo
        for (row = 1; row < totalRows; row++) {
            var selItemsRow = $('#table1').find('tr:eq(' + row + ')').find('td').filter('.selected').length
            //Find the first row with all items selected
            if (selItemsRow == cellsInARow) {
                //Find all numbers from the selected rowa 
                for (itm = 0; itm < selItemsRow; itm++) {
                    var item = +($('#table1').find('tr:eq(' + row + ')').find('td:eq(' + itm + ')').html());
                    rowArray.push(item);
                }
                //Send complete row numbers to check if they're ok
                socket.emit('bingoCall', {
                    numCheck: rowArray
                });
                return;
            }
        }
    });

    window.onbeforeunload = function (e) {
        e = e || window.event;
        var returnString = 'Are you sure?';
        if (e) {
            e.returnValue = returnString;
        }
        return returnString;
    };

    ////////////////////////SOCKET MESSAGES\\\\\\\\\\\\\\\\\\\\\\\
    //Login recieved
    socket.on('PCR', function (data) {
        $('#login').hide("slow");
        $('#play').show("slow");
        $('html,body').animate({
            scrollTop: $('#button-wrapper').offset().top
        }, "fast");

        $('#username').text($('#display-name').val());

        playerNumber = data.playerNum;

        TimeToDraw();
        state = "avatar";
        GetUsersColor(data.playerNum);
        playerColor = context.strokeStyle;
        $('#prompt').css('color', playerColor);
    });

    //Login error
    socket.on('PCE', function () {
        $('#login-error').show();
    });

    //Game already started
    socket.on('PCF', function () {
        alertify.alert("El juego ya ha empezado, espera a que termine");
    });


    //Login ok start play
    socket.on('SP', function () {
        //Init game
        init();
        $('#input-config').hide();
        $('#prompt').hide();
        $('#page').show("slow");
        state = 'playing';
    });

    //Check conf
    socket.on('checkConf', function (data) {
        $('#static').hide("slow");
        $('#canvas-wrapper').hide("fast");
        $('#button-wrapper').hide("fast");

        context.clearRect(0, 0, canvas.width, canvas.height);

        //Show config options only if  player 1
        if (data.isConf === true) {
            $('#input-config').show();
            $('#prompt').html('Ahora tu eres el que manda!<br>Elige las opciones del juego y decide cuando empezar.<br> Recuerda, un gran poder conlleva una gran responsabilidad! ');
            //$('#startGame').attr('disabled', true);

        } else {
            $('#prompt').text(" muy bien, eres un/a artista...");
        }

    });


    socket.on('possibleBingo', function () {
        $('#callBingo').attr('disabled', true);
    });

    //Numbers to unselect (fake)
    socket.on('fakeNums', function (data) {
        var ArrayNums = data.unselectNums;
        alertify.alert("Atencion", "Estos numeros no han salido:\n " + ArrayNums + " Has sido penalizado con " + (ArrayNums.length * 100) + " puntos");

        $.each(ArrayNums, function (index, value) {
            $('#table1 td').filter(function () {
                return $(this).html() == value;
            }).toggleClass("selected");
        });
        //We need to punish this player, tell to server
        socket.emit('Penalty', {
            amount: ArrayNums.length
        });
        //alertify.alert("Has sido penalizado con " + (ArrayNums.length * 100) + " puntos");
        $('#callBingo').attr('disabled', true);
        $('#callBingo').css('background-color', 'grey');
        $('#callBingo').attr('disabled', false);
    });

    //Update player scores
    /*     socket.on('UpdateScore', function () {
    
        }); */

    //Start a new round
    socket.on('nextR', function (data) {
        alertify.alert()
            .setting({
                'label': 'Vamos!',
                'message': 'Siguiente ronda!',
                'modal': true,
                'movable': false,
                'transition': zoom
            }).show();
        //alert("Next Round");
        resetUsedNumbersArray();
        init();

    });



    /////////////////////////FUNCTIONS\\\\\\\\\\\\\\\\


    function init() {
        $('#table1 td').filter('.selected').removeClass('selected');
        $('#callBingo').attr('disabled', true);
        $('#callBingo').css('background-color', 'grey');
        for (var i = 0; i < 25; i++) {
            fillCard(i);
        }
    }

    function fillCard(i) {
        //base = baseArray[i] * 18;
        //number = base + Math.floor(Math.random() * 18) + 1;
        var min = 1;
        var max = 90;
        number = Math.floor(Math.random() * (max - min + 1)) + min;

        if (usedArray[number] != true) {
            $('#square' + i).html(number);
            usedArray[number] = true;
        } else {
            fillCard(i);
        }
    }

    function resetUsedNumbersArray() {
        for (var j = 0; j < usedArray.length; j++) {
            usedArray[j] = false;
        }
    }

    function GetUsersColor(playerNum) {
        switch (playerNum) {
            case 1:
                context.strokeStyle = '#69D2E7';
                $('header').css('background-color', '#69D2E7');
                break;

            case 2:
                context.strokeStyle = '#FA6900';
                $('header').css('background-color', '#FA6900');
                break;

            case 3:
                context.strokeStyle = '#FE4365';
                $('header').css('background-color', '#FE4365');
                break;

            case 4:
                context.strokeStyle = '#83AF9B';
                $('header').css('background-color', '#83AF9B');
                break;

            case 5:
                context.strokeStyle = '#9f9f85';
                $('header').css('background-color', '#9f9f85');
                break;

            case 6:
                context.strokeStyle = '#cca52a';
                $('header').css('background-color', '#cca52a');
                break;

            case 7:
                context.strokeStyle = '#79BD9A';
                $('header').css('background-color', '#79BD9A');
                break;

            case 8:
                context.strokeStyle = '#D95B43';
                $('header').css('background-color', '#D95B43');
                break;

            case 9:
                context.strokeStyle = '#542437';
                $('header').css('background-color', '#542437');
                break;

            case 10:
                context.strokeStyle = '#53777A';
                $('header').css('background-color', '#53777A');
                break;

            case 11:
                context.strokeStyle = '#6C5B7B';
                $('header').css('background-color', '#6C5B7B');
                break;

            case 12:
                context.strokeStyle = '#0B486B';
                $('header').css('background-color', '#0B486B');
                break;

            case 13:
                context.strokeStyle = '#2e8759';
                $('header').css('background-color', '#2e8759');
                break;

            case 14:
                context.strokeStyle = '#594F4F';
                $('header').css('background-color', '#594F4F');
                break;

            case 15:
                context.strokeStyle = '#99B2B7';
                $('header').css('background-color', '#99B2B7');
                break;

            case 16:
                context.strokeStyle = '#797260';
                $('header').css('background-color', '#797260');
                break;

            case 17:
                context.strokeStyle = '#355C7D';
                $('header').css('background-color', '#355C7D');
                break;

            case 18:
                context.strokeStyle = '#3299BB';
                $('header').css('background-color', '#3299BB');
                break;

            case 19:
                context.strokeStyle = '#C06C84';
                $('header').css('background-color', '#C06C84');
                break;

            case 20:
                context.strokeStyle = '#519548';
                $('header').css('background-color', '#519548');
                break;
        }
    }

    function TimeToDraw() {
        canvas.width = 300;
        canvas.height = 350;
        context.lineWidth = 5;
        context.lineCap = "round";
        var disableSave = false;
        var pixels = [];
        var cpixels = [];
        var xyLast = {};
        var xyAddLast = {};
        var calculate = false;
        {   //functions
            function remove_event_listeners() {
                canvas.removeEventListener('mousemove', on_mousemove, false);
                canvas.removeEventListener('mouseup', on_mouseup, false);
                canvas.removeEventListener('touchmove', on_mousemove, false);
                canvas.removeEventListener('touchend', on_mouseup, false);

                document.body.removeEventListener('mouseup', on_mouseup, false);
                document.body.removeEventListener('touchend', on_mouseup, false);
            }

            function get_coords(e) {
                var x, y;

                if (e.changedTouches && e.changedTouches[0]) {
                    var offset = $('#canvas').offset();
                    var offsety = offset.top;
                    var offsetx = offset.left;

                    x = e.changedTouches[0].pageX - offsetx;
                    y = e.changedTouches[0].pageY - offsety;


                } else if (e.layerX || 0 == e.layerX) {
                    x = e.layerX;
                    y = e.layerY;
                } else if (e.offsetX || 0 == e.offsetX) {
                    x = e.offsetX;
                    y = e.offsetY;
                }

                return {
                    x: x,
                    y: y
                };
            };

            function on_mousedown(e) {
                e.preventDefault();
                e.stopPropagation();

                canvas.addEventListener('mouseup', on_mouseup, false);
                canvas.addEventListener('mousemove', on_mousemove, false);
                canvas.addEventListener('touchend', on_mouseup, false);
                canvas.addEventListener('touchmove', on_mousemove, false);
                document.body.addEventListener('mouseup', on_mouseup, false);
                document.body.addEventListener('touchend', on_mouseup, false);

                empty = false;
                var xy = get_coords(e);
                context.beginPath();
                pixels.push('moveStart');
                context.moveTo(xy.x, xy.y);
                pixels.push(xy.x, xy.y);
                xyLast = xy;
            };

            function on_mousemove(e, finish) {
                e.preventDefault();
                e.stopPropagation();

                var xy = get_coords(e);
                var xyAdd = {
                    x: (xyLast.x + xy.x) / 2,
                    y: (xyLast.y + xy.y) / 2
                };

                if (calculate) {
                    var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
                    var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
                    pixels.push(xLast, yLast);
                } else {
                    calculate = true;
                }

                context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
                pixels.push(xyAdd.x, xyAdd.y);
                context.stroke();
                context.beginPath();
                context.moveTo(xyAdd.x, xyAdd.y);
                xyAddLast = xyAdd;
                xyLast = xy;

            };

            function on_mouseup(e) {
                remove_event_listeners();
                disableSave = false;
                context.stroke();
                pixels.push('e');
                calculate = false;
            };
        }
        canvas.addEventListener('touchstart', on_mousedown, false);
        canvas.addEventListener('mousedown', on_mousedown, false);
    }

    function CheckBingoCall() {
        rowArray = [];
        var totalRows = $('#table1 tr').length;
        var cellsInARow = $('#table1').children('tbody').children('tr:eq(1)').children('td').length;

        for (row = 1; row < totalRows; row++) {
            var selItemsRow = $('#table1').find('tr:eq(' + row + ')').find('td').filter('.selected').length
            //Find the first row with all items selected
            if (selItemsRow == cellsInARow) {
                return true;
                return;
            }
        }
        return false;
    }


});
