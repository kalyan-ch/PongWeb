

$(document).ready(function(){
    var paddleColor = "blue";

    //creating Player Object
    function Player(isUser,paddle){
        this.paddle = paddle;
        this.isUser = isUser;
        this.score = 0;
    }

    Player.prototype.update = function(color) {
        this.paddle.updateColor(color);
    };

    Player.prototype.moveAI = function(speed,y) {
        if(!this.isUser){
            var pd = this.paddle;
            pd.y = y*0.7;
        }
    };

    Player.prototype.draw = function(ctxt) {
        var pd = this.paddle;
        ctxt.fillStyle = pd.color;
        var x = pd.x;
        var y = pd.y - (pd.ph)/2;
        if(this.isUser){
            x = pd.x - pd.pw;
        }   

        ctxt.fillRect(x,y,pd.pw,pd.ph);     
    };

    //creating Paddle Object
    function Paddle(x,y) {
        this.color = paddleColor;
        this.x = x;
        this.y = y;
        this.pw = 7;
        this.ph = 80;
    }

    Paddle.prototype.updateColor = function(color) {
        this.color = color;
    };

    Paddle.prototype.updatePosition = function(x,y) {
        this.x = x;
        this.y = y;
    };

    //creating keys object

    function KeyListener(){
        this.pressedKeys = [];
        this.keydown = function(e){
            this.pressedKeys[e.keyCode] = true;
        }
        this.keyup = function(e){
            this.pressedKeys[e.keyCode] = false;   
        }

        document.addEventListener("keydown",this.keydown.bind(this))
        document.addEventListener("keyup",this.keyup.bind(this));

    }

    KeyListener.prototype.isPressed = function(key) {
        return this.pressedKeys[key] ? true : false;
    };

    KeyListener.prototype.addKeyPressListener = function(keycode, callback) {
        document.addEventListener("keypress", function(e) {
            if (e.keyCode == keyCode)
                callback(e);
        });
    };

    //creating Board Object
    function Board(){
        var canvas = $("#game")[0];
        this.context = canvas.getContext("2d");

        this.w = canvas.width;
        this.h = canvas.height;
        
        this.keys = new KeyListener();

        this.p1;
        this.p2;
        this.ball;
        this.fin = false;
    }

    Board.prototype.update = function(){
        //update color
        this.p1.update(paddleColor);
        this.p2.update(paddleColor);
        
        //check for key press events
        var pd = this.p2.paddle;
        if (this.keys.isPressed(40)) { // DOWN   
            pd.y = Math.min(this.h - pd.ph/2, pd.y + 10);
        } else if (this.keys.isPressed(38)) { // UP
            pd.y = Math.max(0 + pd.ph/2, pd.y - 10);
        }

        var b = this.ball;
        b.move();

        if(b.y >= this.h || b.y <= 0){
            b.yspeed *= -1;
        }

        //if ball moving right
        if(b.xspeed > 0){
            if(b.x < this.w){
                var pd2 = this.p2.paddle;
                var colDif = b.x + b.w - pd2.x;
                var pos = (pd2.y + pd2.ph/2);
                var neg = (pd2.y - pd2.ph/2);
                if(colDif >= 0 && b.y >= neg && b.y <= pos){
                    b.xspeed *= -1;
                }    
            }else{
                console.log("user lost!");
                this.p1.score += 1;
                b.x = parseInt(Math.random()*400);
                b.y = parseInt(Math.random()*250);
                b.xspeed = 3;
                b.yspeed = 4;

                b.move();
                return;
            }
            
        }else{
            if(b.x > 0){
                var pd1 = this.p1.paddle;
                var colDif = b.x - pd1.x;
                var pos = (pd1.y + pd1.ph/2);
                var neg = (pd1.y - pd1.ph/2);
                if(colDif <= 0 && b.y >= neg && b.y <= pos){
                    b.xspeed *= -1;
                }    
            }else{
                console.log("AI lost!");
                this.p2.score += 1;
                b.x = parseInt(Math.random()*400);
                b.y = parseInt(Math.random()*250);
                b.xspeed = 3;
                b.yspeed = 4;
                b.move();
                return;
            }
            
        }

        //ai moves
        if(b.x < this.w && b.x > 0){
            this.p1.moveAI(b.yspeed,b.y);            
        }

        //stop if we have a winner
        if(this.p1.score == 10){
            this.winner = "AI";
            this.fin = true;
        }else if(this.p2.score == 10){
            this.winner = "USER";
            this.fin = true;
        }

    }

    Board.prototype.draw = function() {
        this.context.clearRect(0,0,this.w,this.h);

        //draw two sides
        this.context.fillStyle = "black";
        this.context.fillRect(this.w/2-1,0,2,this.h);

        //draw user paddles
        this.p1.draw(this.context);
        this.p2.draw(this.context);

        //ball
        this.ball.draw(this.context);

        //scores
        this.context.fillText(this.p1.score,this.w/4,25);
        this.context.fillText(this.p2.score,this.w*3/4,25);
    };

    Board.prototype.addBall = function(ball) {
        this.ball = ball;
    };

    Board.prototype.addPlayers = function(user,aiOpnt) {
        this.p1 = aiOpnt;
        this.p2 = user;
    };

    //creating Ball Object
    function Ball(){
        this.x = parseInt(Math.random()*400);
        this.y = parseInt(Math.random()*250);
        this.xspeed = 3;
        this.yspeed = 4;
        this.w = 5;
        this.h = 5;
    }

    Ball.prototype.move = function() {
        this.x += this.xspeed;
        this.y += this.yspeed;
    };

    Ball.prototype.draw = function(ctxt) {
        ctxt.fillStyle = "black";
        ctxt.fillRect(this.x,this.y,this.w,this.h);
    };


    //initializing Game
    var board = new Board();
    
    //creating users and paddles
    var pd1 = new Paddle(board.w-3,board.h/2);
    var user = new Player(true,pd1);

    var pd2 = new Paddle(3,board.h/2);
    var aiOpnt = new Player(false,pd2);

    //creating ball
    var ball = new Ball();
    
    board.addPlayers(user,aiOpnt);
    board.addBall(ball);
    
    function gameLoop(){
        board.update();
        board.draw();

        if(!board.fin){

            //60 fps game :)
            setTimeout(gameLoop,16.67);
        }else{
            $("#winner").html("The winner is: "+board.winner );
        }
        
    }

    $("#start_game").click(function(){
        $("#winner").html("");
        //start game
        gameLoop();
    
    });
    
    
    //weather check
    function getLVWthr() {
        var cityId = 5506956;
        var api_key = "55db977766eb6524e3f2fdcd8f622868";
        var colorMap = new Map();

        colorMap.set("clouds","black");
        colorMap.set("rain","blue");
        colorMap.set("clear","green");
        colorMap.set("thunderstorm","yellow");
        colorMap.set("drizzle","brown");
        colorMap.set("snow","white");
        
        var wUrl = "http://api.openweathermap.org/data/2.5/weather?id="+cityId+"&appid="+api_key;
        $.ajax({
            type: 'GET',
            url: wUrl,
            success: function(data){
                var weather = data.weather[0].main;
                var color = colorMap.get(weather.toLowerCase());
                paddleColor = color;
                board.update();
            },
            error: function(data){
                console.log("error "+data);
            }
        })
        setTimeout(getLVWthr,60000);
    }

    getLVWthr();

});






