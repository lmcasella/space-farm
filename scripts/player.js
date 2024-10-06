class Player extends GameObject {
    constructor(app) {
        super(app, 400, 300, 64, 64);
        this.ready = false;
        this.speed = 4;
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.animations = {};
        
        this.lastDirection = "down";
        
        this.setupKeysControls();
        this.loadPlayer();
    }

    createAnchorPointMarker() {
        const marker = new PIXI.Graphics();
        marker.beginFill(0xff0000); // Red color
        marker.drawCircle(0, 0, 3); // Draw a small circle with a radius of 3
        marker.endFill();
        this.app.stage.addChild(marker);
        return marker;
    }

    async loadPlayer() {
        let json = await PIXI.Assets.load('assets/player2/player2.json');

        // Almacenar animaciones
        this.animations.idleDown = json.animations["idleDown"];
        this.animations.idleUp = json.animations["idleUp"];
        this.animations.idleLeft = json.animations["idleLeft"];
        this.animations.idleRight = json.animations["idleRight"];
        this.animations.walkDown = json.animations["walkDown"];
        this.animations.walkUp = json.animations["walkUp"];
        this.animations.walkLeft = json.animations["walkLeft"];
        this.animations.walkRight = json.animations["walkRight"];

        // Animacion por defecto
        this.sprite = new PIXI.AnimatedSprite(this.animations.idleDown);
        this.sprite.animationSpeed = 0.20;
        this.sprite.loop = true;
        this.sprite.play();
        this.app.stage.addChild(this.sprite);

        this.sprite.x = this.spriteX;
        this.sprite.y = this.spriteY;

        // Hitbox of the player
        this.width = this.sprite.width;
        this.height = this.sprite.height;

        this.sprite.anchor.set(0.5, 1);

        this.anchorMarker = this.createAnchorPointMarker();
        this.anchorMarker.x = this.sprite.x;
        this.anchorMarker.y = this.sprite.y;

        this.ready = true;
    }

    // Seteo de teclas
    setupKeysControls() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w' || 'W':
                    this.movement.up = true;
                    break;
                case 'a' || 'A':
                    this.movement.left = true;
                    break;
                case 's' || 'S':
                    this.movement.down = true;
                    break;
                case 'd' || 'D':
                    this.movement.right = true;
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w' || 'W':
                    this.movement.up = false;
                    break;
                case 'a' || 'A':
                    this.movement.left = false;
                    break;
                case 's' || 'S':
                    this.movement.down = false;
                    break;
                case 'd' || 'D':
                    this.movement.right = false;
                    break;
            }
        });
    }

    // Manejo de animaciones sin recrear el objeto
    switchAnimation(animation) {
        if (this.sprite.textures !== this.animations[animation]) {
            this.sprite.textures = this.animations[animation]; // Update textures
            this.sprite.play(); // Restart the animation
        }
    }

    update(objects) {
        if (!this.ready) return;
        
        let moveX = 0;
        let moveY = 0;

        if (this.movement.up) {
            if (!this.predictCollisionWithObjects(objects, 0, -1)) {
                moveY = -1;
            }
        }
        if (this.movement.down) {
            if (!this.predictCollisionWithObjects(objects, 0, 1)) {
                moveY = 1;
            }
        }
        if (this.movement.left) {
            if (!this.predictCollisionWithObjects(objects, -1, 0)) {
                moveX = -1;
            }
        }
        if (this.movement.right) {
            if (!this.predictCollisionWithObjects(objects, 1, 0)) {
                moveX = 1;
            }
        }
    
        // Normalizar la velocidad en diagonal
        if (moveX !== 0 && moveY !== 0) {
            const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX /= magnitude;
            moveY /= magnitude;
        }
    
        // Prioritize vertical animation when moving diagonally
        if (moveY !== 0) {
            if (moveY > 0) {
                this.switchAnimation("walkDown");
            } else {
                this.switchAnimation("walkUp");
            }
        } else if (moveX !== 0) {
            if (moveX > 0) {
                this.switchAnimation("walkRight");
            } else {
                this.switchAnimation("walkLeft");
            }
        }

        // Update last direction
        if (moveY !== 0) {
            this.lastDirection = (moveY > 0) ? "down" : "up";
        } else if (moveX !== 0) {
            this.lastDirection = (moveX > 0) ? "right" : "left";
        }

        // Idle animation when not moving
        if (moveX === 0 && moveY === 0) {
            switch (this.lastDirection) {
                case "up":
                    this.switchAnimation("idleUp");
                    break;
                case "down":
                    this.switchAnimation("idleDown");
                    break;
                case "left":
                    this.switchAnimation("idleLeft");
                    break;
                case "right":
                    this.switchAnimation("idleRight");
                    break;
            }
        }

        // Move player sprite
        this.sprite.x += moveX * this.speed;
        this.sprite.y += moveY * this.speed;

        // this.width = this.sprite.width;
        // this.height = this.sprite.height;

        // Update the position of the anchor point marker
        this.anchorMarker.x = this.sprite.x;
        this.anchorMarker.y = this.sprite.y;
    }
    
    predictCollisionWithObjects(objects, moveX, moveY) {
        for (let obj of objects) {
            if (this.predictCollision(obj, moveX, moveY)) {
                return true;
            }
        }
        return false;
    }
}
