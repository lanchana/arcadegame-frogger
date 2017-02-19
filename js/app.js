/* This file provides Collectable super class for Heart, Gems, and key classes.
   Enemy class is used to appropriate enemy image, initial speed, location and
   updates its ocation when it collides with player.
   Player class allows the player to move around using arrow keys and allows to
   collect gems, heart and key.
 */

'use strict';
var globalvar = {};
globalvar.speedIncrease = 50;
globalvar.gotKey = false;
globalvar.startsound = true;
globalvar.val = 0;
globalvar.totalScore;

/**************** SUPER CLASS ***************************/

// Used for all the same properties in GEM, KEY and HEART classes.
function Collectable(value, sprite) {
    this.sprite = sprite;
    this.value = value;
    this.position();
}

Collectable.prototype.position = function() {
    var random = function(low,high) {
        var range = high - low + 1;
        return Math.floor(Math.random() * range) + low;
    };

    var colWidth = 101, rowHeight = 83;
    this.x = colWidth * random(0,6);
    this.y = rowHeight * random(1,4);
    this.x += 20;
    this.y += 25;
};

Collectable.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Collectable.prototype.checkCollision = function() {
    var gem = {x: this.x, y: this.y, width : 50, height: 40};
    var playerboy = {x: player.x, y: player.y, width: 50, height: 40};

    if (gem.x < playerboy.x + playerboy.width &&
        gem.x + gem.width > playerboy.x &&
        gem.y < playerboy.y + playerboy.height &&
        gem.height + gem.y > playerboy.y) {
            this.collisionDetected();
    }
};

Collectable.prototype.update = function() {
    this.checkCollision();
};

/********************* ENEMIES ********************************************************/

// Enemies our player must avoid

/* @description Represents a enemy
 * @constructor
 * @param {number} x - enemy x-co position
 * @param {number} y - enemy y-co position
 * @param {number} speed - enemy travel speed
 */
var Enemy = function(x, y, speed) {

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    globalvar.val++;
    if(globalvar.val % 2 === 0) {
        this.sprite = 'images/enemy-bug.png';
    } else {
    this.sprite = 'images/blue-enemy-bug.png';
    }
    this.x = x;
    this.y = y;
    this.speed = speed + globalvar.speedIncrease;
};

// Enemy.prototype = Object.create(Draw.prototype);
// Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed * dt;
    this.checkCollision();
};

// Draw the enemy on the screen, required method for game
// Enemy.prototype = Object.create(Draw.prototype);
// Enemy.prototype.constructor = Enemy;
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // When the enemy is offscreen it will get assigned back to
    // initial position
    if(this.x >= 707) {
       this.x = -100;
            // this.speed = Math.random() * 250 + speedIncrease;
            this.speed = Math.random() * 250 + globalvar.speedIncrease;
    }
};

// This function identify the player and enemy collision
// REsource https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Enemy.prototype.checkCollision = function() {
    var bug = {x: this.x, y: this.y, width : 75, height: 70};
    var playerboy = {x: player.x, y: player.y, width: 70, height: 70};

    if (bug.x < playerboy.x + playerboy.width &&
        bug.x + bug.width > playerboy.x &&
        bug.y < playerboy.y + playerboy.height &&
        bug.height + bug.y > playerboy.y) {
            // When collision happened, player lives will be decremented by 1
            player.lives--;

            if(player.lives !== 0) {
                sound[2].play();
            } else {
                console.log("executes");
                this.reset();
            }

            player.position();
            // lives--;
    }
};

Enemy.prototype.reset = function() {
    allEnemies.forEach(function(enemy) {
                enemy.x = 710;
            });
    // currentState = 'endGame';
};

/***************** PLAYER *************************************************************/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/* @description Represents a player
 * @constructor
 * @param {number} x - player x-co position
 * @param {number} y - player y-co position
 */
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.lives = 3;
    this.score = 0;
    this.level = 1;
};

Player.prototype.render = function() {
    //  Playes the sound only one time at the start of the game
    if(globalvar.startsound === true) {
        sound[0].play();
        globalvar.startsound = false;
    }

    ctx.restore();
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = '30px monospace';
    ctx.fontStyle = "rgb(24, 24, 104)";
    ctx.linewidth = 2;
    // Draws player current lives, score and level while playeg game
    ctx.fillText("Lives: " + this.lives, 80, 100);
    ctx.fillText("Score: " + this.score, 350, 100);
    ctx.fillText("Level: " + this.level, 620,100);
    ctx.save();
};

// Moves the player according to the keyy pressed
Player.prototype.handleInput = function(k) {
    var yaxis =83, xaxis = 101;
    if(k === 'up' && this.y > 73) {
        // Checks for the water, otherwise moves the player up
        this.y = this.y - yaxis;
    }
    else if(k === 'down' && this.y < 450) {
        // Checks for the water, otherwise moves the player down
        this.y = this.y + yaxis;
    }
    else if(k === 'left' && this.x > 50) {
        // Checks for the wall, otherwise moves the player left
        this.x = this.x - xaxis;
    }
    else if(k === 'right' && this.x < 600) {
        // Checks for the wall, otherwise moves the player right
        this.x = this.x + xaxis;
    }
    else if(k === 'up' && this.y === 70) {
        // Calls waterCollision function, if player touches water
        this.waterCollision();
    }
};

// This will call reset function when player lives is equal to zero
Player.prototype.update = function() {
    if(this.lives === 0) {
        this.reset();
    }
};

// Sets starting position of player
Player.prototype.position = function() {
    this.x = 300;
    this.y = 485;
};

//  If player has Key and touch water, playes success sound
//  increases enemey speed, resets key value and player position
Player.prototype.waterCollision = function() {
    // console.log(gotKey);
    if(globalvar.gotKey === true) {
        sound[4].play();
        globalvar.speedIncrease += 30;
        console.log(globalvar.speedIncrease);
        globalvar.gotKey = false;
        this.level++;
        this.score += 100;
        this.position();
        key.position();
        allEnemies.forEach(function(enemy) {
            enemy.x = -200;
            enemy.speed += globalvar.speedIncrease;
        });
    }
};

Player.prototype.reset = function() {
    globalvar.speedIncrease = 50;
    sound[5].play();
    globalvar.startsound = true;
    // currentState = 'endGame';
    globalvar.totalScore = player.score;
    reset();
    player.level = 0;
    player.lives = 3;
    player.score = 0;
};


/******************* GEMS ********************************************/

// Player should collect gems to increase score

/* @description Represents gems
 * @constructor
 * @param {number} value - gems score points
 * @param {string} sprite - gem url
 */
var Gem = function(value, sprite) {
    this.value = value;
    this.sprite = sprite;
    this.position();
 };

Gem.prototype = Object.create(Collectable.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.collisionDetected = function() {
    sound[1].play();
    this.x = 900;
    this.y = 900;
    player.score += this.value;
    var self = this;
    setTimeout( function(){self.position();}, 15000);
};

/******************* Heart ********************************************/

// Player should collect Heart to increase Lives

var Heart = function() {
    this.position();
    this.sprite = 'images/Heart1.png';
    this.value = 50;
};

Heart.prototype = Object.create(Collectable.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.collisionDetected = function() {
    sound[6].play();
    this.x = 900;
    this.y = 900;
    player.score += this.value;
    player.lives += 1;
    var self = this;
    setTimeout( function() {self.position();}, 20000);
};


/************** KEY *******************************************************/

// Player should collect Key snd touch water to move next level
var Key = function() {
    this.position();
    this.sprite = 'images/Key1.png';
    this.value = 50;

};

Key.prototype = Object.create(Collectable.prototype);
Key.prototype.constructor = Key;

Key.prototype.collisionDetected = function() {
    this.x = 900;
    this.y = 900;
    player.score += this.value;
    globalvar.gotKey = true;
    sound[3].play();
};

/*************** OBJECT INSTANTIATE *************************************/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Buffers audio file automatically when created
// Audio files: https://www.freesound.org
// var sound = new Audio("audio/key.wav");
var sound = [];
sound.push(new Audio('audio/gamestart.mp3'));
sound.push(new Audio('audio/gems.wav'));
sound.push(new Audio('audio/gamelost.wav'));
sound.push(new Audio('audio/key.wav'));
sound.push(new Audio('audio/nextlevel.wav'));
sound.push(new Audio('audio/gameover.wav'));
sound.push(new Audio('audio/heart.wav'));

// Player instantiate
var player = new Player(300, 485);

// Enemy instantiate
var allEnemies = [];
var yax = 70;       // Initial y co-ordinate value
for(var i= 1; i<=4; i++){
    if (i % 2 === 0){
        for(var j = 1; j<=2; j++){
            // sets one enemy x-corniate = 100, another one to -200
            allEnemies.push(new Enemy(-100 * j, yax, Math.random() * 250));
        }
    }
    else
    {
    allEnemies.push(new Enemy(-100, yax, Math.random() * 200 ));
}
    yax = yax + 80;
}

// Gem instantiate
var gems = [];
// gems.push(new Gem(10, 'images/Gem Blue1.png'));
gems.push(new Gem(20, 'images/Gem Green1.png'));
gems.push(new Gem(30, 'images/Gem Orange1.png'));

// Heart and key instantiate
var heart = new Heart();
var key = new Key();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// document.addEventListener('keyup', function(e) {

// This function is modified, so we can use removeEventListener
// during 'startGame' and 'endGame' sates.
// Credit http://stackoverflow.com/questions/4950115/removeeventlistener-on-anonymous-functions-in-javascript

var input = function(e){
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
};
// });
document.addEventListener('keyup', input);

