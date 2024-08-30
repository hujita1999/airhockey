var canvas;
var context;
var lastTime;

var boardWidth = 512;
var boardHeight = 256;
var puck;
var paddle1;
var paddle2;

function Puck(x,y) {
    var self = this;

    self.radius = 5;
    self.x = x;
    self.y = y;
    self.speed = 0.5;
    self.vel = {
        x: 0.2,
        y: 0.1
    
    };

    normalize(self.vel);

    self.update = function (dt) {
        self.x += self.vel.x * self.speed * dt;
        self.y += self.vel.y * self.speed * dt;

        if (self.x + self.radius > boardWidth) {
            self.vel.x *= -1;
            self.x = boardWidth - self.radius;

        }

        if (self.x - self.radius < 0) {
            self.vel.x *= -1;
            self.x = self.radius;
        }

        if (self.y + self.radius > boardHeight) {
            self.vel.y *= -1;
            self.y = boardHeight - self.raduis;
        
        }

        if (self.y - self.radius < 0) {
            self.vel.y *= -1;
            self.y = self.radius;
    
        }

    

    };

    self.draw = function (context) {
        context.fillstyle = "white";
        context.beginPath();
        context.arc(self.x, self.y, self.radius, 0, 2 * Math.PI);
        context.fill();

    };

    self.collideswithPaddle = function (paddle) {
        var closestPoint = self.closestPointOnPaddle(paddle);

        var diff = {
            x: self.x - closestPoint.x,
            y: self.y - closestPoint.y

        };

        var length = Math.sqrt(diff.x * diff.x + diff.y * diff.y);

        return length < self.radius;

    };

    self.closestPointOnPaddle = function (paddle) {
        return {
            x: clamp(self.x, paddle.x - paddle.halfWidth, paddle.x + paddle.halfWidth),
            y: clamp(self.y, paddle.y - paddle.halfHeight, paddle.y + paddle.halfHeight)

        };

    };

    self.handlePaddleCollision = function (paddle) {
        var collisionHappened = false;

        while (self.collideswithPaddle(paddle)) {
            self.x -= self.vel.x;
            self.y -= self.vel.y;

            collisionHappened = true;

        }

        if (collisionHappened) {
            var closestPoint = self.closestPointOnPaddle(paddle);

            var normal = {
                x: self.x - closestPoint.x,
                y: self.y - closestPoint.y
            };

            normalize(normal);

            var dotprod = dot(self.vel, normal);

            self.vel.x = self.vel.x - (2 * dotProd * normal.x);
            self.vel.y = self.vel.y - (2 * dotProd * normal.y);

        }

    };

}

function Paddle(x, upKeyCode, downKeyCode) {
    var self = this;

    self.x = x;
    self.y - boardHeight / 2;

    self.halfWidth = 5;
    self.halfHeight = 20;
    self.moveSpeed = 0.5;
    self.upButtonPressed = false;
    self.downButtonPressed = false;
    self.upKeyCode = upKeyCode;
    self.downKeyCode = downKeyCode;

    self.onKeyDown = function (keycode) {
        if (keyCode === self.upKeyCode) {
            self.upButtonPressed = true;
        }

        if (keyCode === self.downKeyCode) {
            self.downButtonPressed = true;
        }


    };

    self.onKeyUp = function (keyCode) {
        if (keyCode === self.upKeyCode) {
            self.upButtonPressed = false;
        }

        if (keyCode === self.downKeyCode) {
            self.downButtonPressed = false;
        }

    };

    self.update = function (dt) {
        if (self.upButtonPressed) {
            self.y -= self.moveSpeed * dt;
        }

        if (self.downButtonPressed) {
            self.y += self.moveSpeed * dt;
        }

        if (self.y - self.halfHeight < 0) {
            self.y = self.halfHeight;

        }

        if (self.y - self.halfHeight > boardHeight) {
            self.y = boardHeight - self.halfHeight;
            
        }

    };

    self.draw = function (context) {
        context.fillstyle = "white";

        context.fillRect(
            self.x - self.halfWidth,
            self.y - self.halfHeight,
            self.halfWidth * 2,
            self.halfHeight * 2
        );

    };

}

function clamp(val, min, max){
    return Math.max(min, Math.min(max,val));

}

function vecLength (v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);

}

function normalize(v) {
    var len = vecLength(v);

    if (len > 0) {
        v.x /= len;
        v.y /= len;
    }
}

function dot(u, v) {
    return u.x * v.x + u.y * v.y;

}

function init() {
    canvas = document.getElementById("game-canvas");
    canvas.width = boardWidth;
    canvas.height = boardHeight;

    puck = new Puck(100, 100);
    paddle1 = new Paddle(10, 87, 83);
    paddle2 = new Paddle(boardWidth - 10, 38, 40);

    document.addEventListener("keydown", function (e) {
        e.preventDefault();

        paddle1.onKeyDown(e.keyCode);
        paddle2.onKeyDown(e.keyCode);

    });

    document.addEventListener("keyup", function (e){
        e.preventDefault();

        paddle1.onKeyUp(e.keyCode);
        paddle2.onKeyUp(e.keyCode);

    });

    context = canvas.getContext("2d");

    lastTime = performance.now();

}

function update(dt) {
    puck.update(dt);
    paddle1.update(dt);
    paddle2.update(dt);

    puck.handlePaddleCollision (paddle1);
    puck.handlePaddleCollision (paddle2);
}

function render(dt) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    puck.draw(context);
    paddle1.draw(context);
    paddle2.draw(context);

}

function main() {
    var now = performance.now();
    var dt = now - lastTime;
    var maxFrameTime = 1000 / 60;

    if (dt > maxFrameTime) {
        dt = maxFrameTime;
    
    }

    update(dt);
    render(dt);

    lastTime = now;

    requestAnimationFrame(main);

}

init();
main();