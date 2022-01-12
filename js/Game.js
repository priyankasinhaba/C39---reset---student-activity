class Game {
  /*we will create 2 elements one is the resetButton and next is the text for
the reset button which will say “Reset Button”. We can
name it resetTitle.
Reset Title using createElement() function. Button can be created using the createButton() function.
These are an inbuilt function in p5.DOM.js library that can 
create an HTML element. We will pass the size of the text 
as an argument in this function here we will write “h2” which is the heading text size from HTML.
We can keep its argument empty because we want to have an image attached to the button.

We define the leader board text in the constructor()
function of the game.js file. We will define text for leaderboardTitle, leader1(player1), 
and leader2(player2).
*/

  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

   /*We need to display them by setting their position and making them HTML elements.
    Everything we see on the screen has HTML in the backend.
But these are handled by the libraries we are using, but in
this case, we want to create the button and text in a more traditional way.
In the handleElement() method of game.js we will write code to display the button and text.
For the title, we will define the position of the text and the Text it will display.
We are also adding this to the class so that we can apply styling to this button using CSS.*/
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          // Changing camera position in y direction
          camera.position.y = cars[index - 1].position.y;
        }
      }

      // handling keyboard events
      this.handlePlayerControls();

      drawSprites();
    }
  }

  // handleResetButton() {
  //   this.resetButton.mousePressed(() => {
  //     database.ref("/").set({
  //       playerCount: 0,
  //       gameState: 0,
  //       players: {}
  //     });
  //     window.location.reload();
  //   });
  // }

  /*add the logic to check which player is the leader.
We have the player’s rank updated in the database; here we use the player rank to display the 
leaderboards on the screen.
In the showleaderBoard() method we have 2 variables leader1 and leader2, one more variable players 
which has information of the player taken from the database.
The first condition is to check if our first player has rank 1.
We will set the rank, name, and score of player 1 to the leader 1 variable.
And leader 2 will have the details of player 2. Here &emsp
is an HTML tag that is used to add 4 spaces before the text.
Instead of using a for-in loop to traverse through allPlayers, we will learn another method, the
Object.values(). This method returns an array of a given object's own enumerable property values, 
in the same order as that provided by a for-in loop.*/

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {

    /*The car moves forward in the y-direction when the user
presses the up arrow button.*/

    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }

    /*To move the car in the left and right direction, we will
change the x position value with the left and right arrow keys.
We also don’t want the player to go off track; to prevent
that we will write the condition.

To move left we will use the keyIsDown() function and it
will look for the LEFT_ARROW pressed by the user.
We will add the condition using the and operator that
player x position can be given greater than width/3 -50.
This means if the user goes to the end of the track in the
left direction, it will not move any further.
Similar things we will implement for the right side also.
To move the player on the left side, we need to subtract
from its position, and to move towards the right we need to
increment the x-position.

Update the player’s position in the database using the
player.update() method.
*/


    // if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
    //   player.positionX -= 5;
    //   player.update();
    // }

    // if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
    //   player.positionX += 5;
    //   player.update();
    // }
  }
}
