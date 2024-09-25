class Player extends GameObject {
    constructor(app) {
        super(app, 400, 300);
        this.ready = false;
        this.speed = 3;
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.animations = {};

        this.setupKeysControls();
        this.loadPlayer();
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
        this.sprite.animationSpeed = 0.15;
        this.sprite.loop = true;
        this.sprite.play();
        this.app.stage.addChild(this.sprite);

        this.sprite.x = 400;
        this.sprite.y = 300;
        this.sprite.anchor.set(0.5);

        this.ready = true;
    }

    // Seteo de teclas
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
            this.switchAnimation("walkUp");
            if (!this.checkCollision(objects)) {
                moveY = -1;
            }
            // moveY = -1;
        }
        if (this.movement.down) {
            this.switchAnimation("walkDown");
            if (!this.checkCollision(objects)) {
                moveY = 1;
            }
        }
        if (this.movement.left) {
            this.switchAnimation("walkLeft");
            if (!this.checkCollision(objects)) {
                moveX = -1;
            }
        }
        if (this.movement.right) {
            this.switchAnimation("walkRight");
            if (!this.checkCollision(objects)) {
                moveX = 1;
            }
        }
    
        // Normalizar la velocidad en diagonal
        if (moveX !== 0 && moveY !== 0) {
            const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX /= magnitude;
            moveY /= magnitude;
        }

        // Save current position before moving
        let newPosX = this.sprite.x + moveX * this.speed;
        let newPosY = this.sprite.y + moveY * this.speed;

        // Create a temporary bounds to simulate the new position
        const newBounds = {
            x: newPosX - this.sprite.width / 2,
            y: newPosY - this.sprite.height / 2,
            width: this.sprite.width,
            height: this.sprite.height,
        };

        // // Check for collisions with objects
        // for (let obj of objects) {
        //     if (obj.checkCollision(newBounds)) {
        //         // Resolve the collision
        //         const objBounds = obj.sprite.getBounds();

        //         // Handle horizontal collision
        //         if (moveX > 0) { // Moving right
        //             newPosX = objBounds.x - this.sprite.width / 2; // Stop player on the left side of the object
        //         } else if (moveX < 0) { // Moving left
        //             newPosX = objBounds.x + objBounds.width + this.sprite.width / 2; // Stop player on the right side
        //         }

        //         // Handle vertical collision
        //         if (moveY > 0) { // Moving down
        //             newPosY = objBounds.y - this.sprite.height / 2; // Stop player on the top side
        //         } else if (moveY < 0) { // Moving up
        //             newPosY = objBounds.y + objBounds.height + this.sprite.height / 2; // Stop player on the bottom side
        //         }

        //         console.log('aaaaaaaa:');
                
        //     }
        // }

        // Apply new position
        this.sprite.x = newPosX;
        this.sprite.y = newPosY;
    
        // Cambiar animación dependiendo de la dirección
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
            // Si no me muevo cambiar a idle dependiendo de la última dirección
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
    
        // Checkea la ultima dirección en la que estuvo
        if (moveY !== 0) {
            this.lastDirection = (moveY > 0) ? "down" : "up";
        } else if (moveX !== 0) {
            this.lastDirection = (moveX > 0) ? "right" : "left";
        }
    
        // Movimiento
        this.sprite.x += moveX * this.speed;
        this.sprite.y += moveY * this.speed;
    }
    
    
}
