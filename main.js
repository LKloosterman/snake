var gameRunning = true;

var gameSpeed = 6;

var canvas;
var canvasContext;

var gameObjects = [];

function Snake() {
    this.id = 'Snake';

    this.width = 10;
    this.height = 10;

    this.x = 250;
    this.y = 250;

    this.velX = 0;
    this.velY = 0;

    this.size = 1;
    this.tail = [];

    this.render = function() {
        canvasContext.fillStyle = 'green';
        
        for (let i = 0; i < this.tail.length; i++) {
            canvasContext.fillRect(this.tail[i][0], this.tail[i][1], this.width,
                    this.height);
        }

        canvasContext.fillRect(this.x, this.y, this.width, this.height);
    };

    this.tick = function() {
        this.x += this.velX;
        this.y += this.velY;

        for (let i = 0; i < (this.tail.length - 1); i++) {
            this.tail[i] = this.tail[(i + 1)];
        }
        if (this.size >= 1) {
            this.tail[(this.size - 1)] = [this.x, this.y];
        }

        this.clamp();

        this.collision();
    };

    this.clamp = function() {
        if ((this.x) >= canvas.width) {
            this.velX = 0;
            this.x = (canvas.width - 10);

            gameOver();
        } else if ((this.x) <= -10) {
            this.velX = 0;
            this.x = 0;

            gameOver();
        } else if ((this.y) >= canvas.height) {
            this.velY = 0;
            this.y = (canvas.height - 10);

            gameOver();
        } else if ((this.y) <= -10) {
            this.velY = 0;
            this.y = 0;

            gameOver();
        }
    };

    this.grow = function() {
        this.size++;

        gameSpeed += 0.1;
    };

    this.collision = function() {
        for (let i = (this.size - 2); i >= 0; i--) {
            if ((this.x === this.tail[i][0]) && (this.y === this.tail[i][1])) {
                gameOver();
            }
        }
    };
}

function Food() {
    this.id = 'Food';

    this.width = 10;
    this.height = 10;

    this.x = -10;

    this.y = -10;

    this.tick = function() {
        this.checkEaten();
    };

    this.render = function() {
        canvasContext.fillStyle = 'orange';

        canvasContext.fillRect(this.x, this.y, this.width, this.height);
    };

    this.checkEaten = function() {
        let snake = findObject('Snake');

        if ((this.x === snake.x) && (this.y === snake.y)) {
            snake.grow();

            this.x = randLocation();
            this.y = randLocation();
        }
    };
}

function tick() {
    gameObjects.forEach((object) => {
        object.tick();
    });
}

function draw() {
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    gameObjects.forEach((object) => {
        object.render();
    });

    if (!gameRunning) {
        canvasContext.fillStyle = 'white';
        canvasContext.font = '30px "Roboto", sans-serif';
        canvasContext.textAlign = 'center';
        canvasContext.fillText('Game Over!',
                (canvas.width / 2), ((canvas.height / 2) - 15));
        
        canvasContext.font = '20px "Roboto", sans-serif';
        canvasContext.fillText('Press space to restart', (canvas.width / 2),
                ((canvas.height / 2) + 10));
    }
}

function findObject(id) {
    let object;

    gameObjects.forEach((gameObject) => {
        if (gameObject.id === id) {
            object = gameObject;
        }
    });

    return object;
}

function gameOver() {
    gameRunning = false;
}

function restart() {
    player = findObject('Snake');

    player.x = 250;
    player.y = 250;

    player.size = 1;
    player.tail = [];

    gameRunning = true;
}

function randLocation() {
    let location = -1;

    while ((location % 10) != 0) {
        location = (Math.floor((Math.random() * (canvas.width / 10)) * 10));
    }

    return location;
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    setInterval(() => {
        if (gameRunning) {
            tick();
        }

        draw();
    }, (1000 / gameSpeed));

    gameObjects.push(new Snake());
    gameObjects.push(new Food());

    let food = findObject('Food');

    food.x = randLocation();
    food.y = randLocation();
};

document.addEventListener('keydown', function(event) {
    let snake = findObject('Snake');
    
    if (event.keyCode === 38) {
        snake.velX = 0;
        snake.velY = -10;
    }
    
    if (event.keyCode === 39) {
        snake.velX = 10;
        snake.velY = 0;
    }

    if (event.keyCode === 40) {
        snake.velX = 0;
        snake.velY = 10;
    }

    if (event.keyCode === 37) {
        snake.velX = -10;
        snake.velY = 0;
    }

    if (event.keyCode === 32) {
        if (!gameRunning) {
            restart();
        }
    }
});
