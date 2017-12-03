File List:

index.html
index.js
styles.css
Readme.txt

How to run the code:

1. rename index.txt to index.js (this was done because gmail was blocking my attachment)
2. Open "index.html" in web browser (Chrome, Mozilla for best results!). 
2. Click start game link in the web-page and use arrow keys to move your paddle. 
3. The user is on the right side and AI is on the left.
4. Enjoy the game


Answers to questions from Original challenge docs:


1. What was the reasoning behind your layout of the code?

The code was laid out after Object Oriented Approach. After reading the description for the project, I came up with ideas for the different classes and their relationships that would be part of the game. They are as follows:

	1. Board object contains the canvas, all the other objects and everything related to game management (score keeping, playing, pausing etc.). Board has the properties - width and height of canvas, ball, players and key-listener. Board does these tasks: update color of the paddles, check for key press events, move the ball, handle ball's collision detection, check if user or ai has won the round, check if the total wins on either side reached ten, if yes terminate the game and handle the ai moves. All these tasks are created in their respective objects and are only called via Board's update method to be called.

	2. Player is an object that represents the game players (user and AI). It has the properties Paddle and score. Player has the tasks of updating the score and moving the ai paddle.
	
	3. Paddle is an object that is part of Player object. It has the properties color and coordinates. Paddle can update its color.
	
	4. Ball is an object that represents the ball. It has the properties of coordinates and speed. Ball can move.
	
	5. KeyListener object is bound to the Board object for capturing the key presses for playing the game.
	
Board objects update method is the one that plays the game. It constantly updates the positions of ball, detects collisions (edges of canvas and paddles),  updates paddle positions and checks if a player wins by comparing scores.

This method gets called from another loop method - gameLoop. (If it is a game, there has to be a loop :) ). This method runs until one player wins. The winner is displayed in the paragraph below the canvas.

The weather data for Las Vegas is obtained from openweathermap.org. I have created hashmap that maps the key weather words to color. This will check weather for every minute and change the color of the paddle accordingly

JavaScript's canvas was used to create this game. Little bit of jQuery is used to capture events. 

2. How did you come up with your AI opponent? Discuss the thought process and things you took into consideration.

This AI opponent is a simple one. The paddle on the left moves according to the position of the ball. Since exact mirroring will result in an AI that is impossible to beat, the mirroring has been slowed to 70%. That is, for every y px ball moves up or down, the paddle moves 0.7y px.

Since I had limited time, I had to go for an opponent that is simple yet beatable. I think I could have employed actual AI algorithms for better performance or worse. (Min-max alpha-beta pruning).

3. What kind of power ups would you implement given the time and how?

1. I would have implemented a multi-leveled game, where the speed of the ball would increase with higher level. 
2. For an amateur level, I would increased the size of the user paddle so that the chance of losing is lower. 
3. I would have implemented an advanced collision detection where the ball changes speed depending on the angle of impact and the part of paddle where contact is made.

