/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */


var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;
    canvas.width = 707;
    canvas.height = 706;
    doc.body.appendChild(canvas);
    var currentState = 'start';

//TODO: Add more player Selection

/*  var removeHero = true;
    var herosrc = 'images.char-boy.png';
    global.herosrc =herosrc;
    var herodiv = document.createElement('div');
    document.body.appendChild(herodiv);
    herodiv.id = 'herodiv';
      var createHero = function(src, id) {
        var img1 = document.createElement("img");
    img1.id = id;
    img1.src = src;
    img1.onclick = function() { herosrc  = src; };
    // doc.body.appendChild(img1);
    document.getElementById("herodiv").appendChild(img1);
    };
    createHero('images/char-boy.png', 'charboy');
    createHero('images/char-cat-girl.png', 'charboy1');
    createHero('images/char-horn-girl.png', 'charboy2');
    createHero('images/char-pink-girl.png', 'charboy3');
    createHero('images/char-princess-girl.png', 'charboy4');
    console.log(herosrc);
    }; */

    // creats pause and play button, to pause and resume the game wile playing
    var start_button = doc.createElement("button");
    start_button.id="startbtn";
    start_button.innerHTML = "Play";

    var pause_button = doc.createElement("button");
    pause_button.id = "pausebtn";
    pause_button.innerHTML = "Pause";

    var addbtn = document.getElementsByTagName("body")[0];
    addbtn.appendChild(start_button);
    addbtn.appendChild(pause_button);

    /* initializing gameStartFlag to 1, when the user click pause button it will get assign to 0..
     * pauses the game until player click the play button
     */

    var gameStartFlag = 1;

    start_button.addEventListener("click", function() {
        gameStartFlag = 1;
    });

    pause_button.addEventListener("click", function() {
        gameStartFlag = 0;
    });

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */

    function main() {

        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */

        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        // update(dt);
        // render();

        if (gameStartFlag === 1) {
            update(dt);
            render();
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */

        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */

        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        /* Resource https://gamedevelopment.tutsplus.com/tutorials/finite-state-machines-theory-and-implementation--gamedev-11867
         * for finite state machines theory
         * It changes the behavior of the game accoring to the state: start, playgame or endgame
         */
        switch(currentState) {
            /* start: this state is used to call initial game board to display game rules
             */
            case 'start':

                /* This will turn OFF the keypress event is app.js
                 */
                document.removeEventListener("keyup", input);
                /* This function listen for enter key, to change the currentState
                 */
                var startInput = function(e) {
                    var key = e.keyup || e.which;
                    /* When the key value is equal 1o 13(Enter key) and assigns the currentState to playGame
                     */
                    if(key === 13) {
                        currentState = 'playGame';
                    }
                };
                document.addEventListener('keydown', startInput);
                break;

            /* playGame: This state mainly updates entities while the game is running
             */
            case 'playGame':
                /* This will turn back ON the keypress event in app.js
                 */
                document.addEventListener('keyup', input);
                /*calls updateEntities function to update every game enetity
                 */
                updateEntities(dt);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                break;

            /*endGame: This state is called when the player runs out of lives
             */
            case 'endGame':
                /* This will turn OFF the keypress event is app.js
                 */
                document.removeEventListener("keyup", input);
                var endInput = function(e) {
                    var key = e.keyup || e.which;
                    /* When the key value is equal 1o 13(Enter key), it assigns the currentState back to to playGame
                     */
                    if(key === 13) {
                        currentState = 'playGame';
                    }
                };
                document.addEventListener('keydown', endInput);
                break;
        }
        // updateEntities(dt);
        // .collision();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        player.update();
        // console.log("engineupdate");
        // gems.update();
        gems.forEach(function(gem) {
            gem.update();
        });

        heart.update();
        key.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    // function render() {

        /* This function is used to draw empty Game board
         */
        var backgroundImage = function(){
            /* This array holds the relative URL to the image used
             * for that particular row of the game level.
             */
            var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 7,
            numCols = 7,
            row, col;

         // Loop through the number of rows and columns we've defined above
         // * and, using the rowImages array, draw the correct image for that
         // * portion of the "grid"

            for (row = 0; row < numRows; row++) {
                for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                    ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
                }
            }
        };

    /* This function renders different game states according to case
     */
    function render() {
        switch (currentState) {
            case 'start':
                /* This will hide the play and pause button at the start screen
                 */
                document.getElementById('startbtn').style.visibility = 'hidden';
                document.getElementById('pausebtn').style.visibility = 'hidden';

                /* This function draws the empty game board
                 */
                backgroundImage();

                /* Text to draw on game board which explains Game rules
                 */
                ctx.fillStyle = "rgb(24, 24, 104)";
                ctx.font = "bold 50px monospace";
                ctx.textAlign = "center";
                ctx.fillText("Let's Play Frogger..", canvas.width/1.9, canvas.height/3.5);

                ctx.font = "23px monospace";
                ctx.fillText("Use the arrow keys to move", canvas.width/2, canvas.height/2.8);
                ctx.fillText("Collect KEY and Reach Water to move next level", canvas.width/2, canvas.height/2.5);
                ctx.fillText("Difficulty Increases when you move higher levels", canvas.width/2, canvas.height/2.24);
                ctx.fillText("Collect Hearts for extra lives and Gems to score", canvas.width/2, canvas.height/2.05);
                ctx.fillText("Avoid the Bugs to stay ALIVE!! Bcoz...", canvas.width/2, canvas.height/1.9);
                ctx.fillText("The goal here is to stay ALIVE as long as possible", canvas.width/2, canvas.height/1.75);

                ctx.font = "35px monospace";
                ctx.fillText("Good Luck!", canvas.width/2, canvas.height/1.6);

                ctx.font = "30px monospace";
                ctx.fillText("Press Enter To Start the Game....", canvas.width/2, canvas.height/1.01);
                ctx.restore();
                break;

            case 'playGame':
                /* Displayes play and pause buttons while game is running
                 */
                document.getElementById('startbtn').style.visibility = 'visible';
                document.getElementById('pausebtn').style.visibility = 'visible';

                /* Draws empty game board and renders entities to play the game
                 */
                backgroundImage();
                renderEntities();
                break;

            case 'endGame':
                /* This will hide the play and pause button at the end screen
                 */
                document.getElementById('startbtn').style.visibility = 'hidden';
                document.getElementById('pausebtn').style.visibility = 'hidden';

                /*Draws empty game board and text along with total score
                 */
                backgroundImage();

                ctx.font = "50px monospace";
                ctx.fillText("Game Over!", canvas.width/2, canvas.height/2.5);
                ctx.font = "40px monospace";
                ctx.fillText("Your Score: " + globalvar.totalScore, canvas.width/2, canvas.height/2);
                ctx.font = "30px monospace";
                ctx.fillText("Press Enter To Restart...", canvas.width/2, canvas.height/1.01);
                break;
         }
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        // gems.render();
        gems.forEach(function(gem) {
            gem.render();
        });

        heart.render();
        key.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        if(player.lives === 0){
            currentState = 'endGame';
        }
    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/blue-enemy-bug.png',
        'images/Gem Blue1.png',
        'images/Gem Green1.png',
        'images/Gem Orange1.png',
        'images/Heart1.png',
        'images/Key1.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
     // console.log(herosrc);
    // global.herosrc = herosrc;
    global.ctx = ctx;
    global.reset = reset;
})(this);
