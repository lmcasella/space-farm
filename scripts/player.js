class Player {
    constructor(app) {
        this.app = app;
        this.ready = false;
        this.speed = 3;
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.animations = {}; // Store all animations in a dictionary for easier access

        this.setupKeysControls();
        this.loadPlayer();
    }

    async loadPlayer() {
        let json = await PIXI.Assets.load('assets/player2/player2.json');

        // Store animations for easier reuse
        this.animations.idleDown = json.animations["idleDown"];
        this.animations.idleUp = json.animations["idleUp"];
        this.animations.idleLeft = json.animations["idleLeft"];
        this.animations.idleRight = json.animations["idleRight"];
        this.animations.walkDown = json.animations["walkDown"];
        this.animations.walkUp = json.animations["walkUp"];
        this.animations.walkLeft = json.animations["walkLeft"];
        this.animations.walkRight = json.animations["walkRight"];

        // Create initial player sprite using idleDown animation
        this.player = new PIXI.AnimatedSprite(this.animations.idleDown);
        this.player.animationSpeed = 0.15;
        this.player.loop = true;
        this.player.play();
        this.app.stage.addChild(this.player);

        this.player.x = 400;
        this.player.y = 300;
        this.player.anchor.set(0.5);

        this.ready = true;
    }

    setupKeysControls() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w':
                    this.movement.up = true;
                    break;
                case 'a':
                    this.movement.left = true;
                    break;
                case 's':
                    this.movement.down = true;
                    break;
                case 'd':
                    this.movement.right = true;
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                    this.movement.up = false;
                    break;
                case 'a':
                    this.movement.left = false;
                    break;
                case 's':
                    this.movement.down = false;
                    break;
                case 'd':
                    this.movement.right = false;
                    break;
            }
        });
    }

    // This function handles animation switching without recreating the sprite
    switchAnimation(animation) {
        if (this.player.textures !== this.animations[animation]) {
            this.player.textures = this.animations[animation]; // Update textures
            this.player.play(); // Restart the animation
        }
    }

    update() {
        if (!this.ready) return;
    
        let moveX = 0;
        let moveY = 0;
    
        if (this.movement.up) {
            moveY = -1;
        }
        if (this.movement.down) {
            moveY = 1;
        }
        if (this.movement.left) {
            moveX = -1;
        }
        if (this.movement.right) {
            moveX = 1;
        }
    
        // Normalize the vector for diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX /= magnitude;
            moveY /= magnitude;
        }
    
        // Decide which animation to show (prioritize vertical movement)
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
        } else {
            // If no movement, revert to idle based on last direction
            if (this.lastDirection === "up") {
                this.switchAnimation("idleUp");
            } else if (this.lastDirection === "down") {
                this.switchAnimation("idleDown");
            } else if (this.lastDirection === "left") {
                this.switchAnimation("idleLeft");
            } else if (this.lastDirection === "right") {
                this.switchAnimation("idleRight");
            }
        }
    
        // Track the last direction for idle state
        if (moveY !== 0) {
            this.lastDirection = (moveY > 0) ? "down" : "up";
        } else if (moveX !== 0) {
            this.lastDirection = (moveX > 0) ? "right" : "left";
        }
    
        // Move the player
        this.player.x += moveX * this.speed;
        this.player.y += moveY * this.speed;
    }
    
}
