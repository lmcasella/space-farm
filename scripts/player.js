class Player extends GameObject {
    constructor(app) {
        super(app, 400, 300);
        this.ready = false;
        this.speed = 4;
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.animations = {};
        
        // Create a temporary bounds to simulate the new position
        const newBounds = {};
        
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
        this.sprite.animationSpeed = 0.20;
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

    predictCollision(objects, moveX, moveY) {
        if (objects.length === 0) {
            return false;
        }
    
        for(let obj of objects) {
            
            if (!obj || !obj.sprite) {
                return false; // Handle cases where otherObject is invalid
            }
            
            this.newPosX = this.sprite.x + moveX * this.speed;
            this.newPosY = this.sprite.y + moveY * this.speed;

            this.newBounds = {
                x: this.newPosX - this.sprite.width / 2,
                y: this.newPosY - this.sprite.height / 2,
                width: this.sprite.width,
                height: this.sprite.height,
            };
            const otherBounds = obj.sprite.getBounds();
        
            return this.newBounds.x < otherBounds.x + otherBounds.width &&
                   this.newBounds.x + this.newBounds.width > otherBounds.x &&
                   this.newBounds.y < otherBounds.y + otherBounds.height &&
                   this.newBounds.y + this.newBounds.height > otherBounds.y;
        }
    }

    update(objects) {
        if (!this.ready) return;
        
        let moveX = 0;
        let moveY = 0;

        if (this.movement.up) {
            this.switchAnimation("walkUp");
            if (!this.predictCollision(objects, 0, -1)) {
                moveY = -1;
            }
        }
        if (this.movement.down) {
            this.switchAnimation("walkDown");
            if (!this.predictCollision(objects, 0, 1)) {
                moveY = 1;
            }
        }
        if (this.movement.left) {
            this.switchAnimation("walkLeft");
            if (!this.predictCollision(objects, -1, 0)) {
                moveX = -1;
            }
        }
        if (this.movement.right) {
            this.switchAnimation("walkRight");
            if (!this.predictCollision(objects, 1, 0)) {
                moveX = 1;
            }
        }
    
        // Normalizar la velocidad en diagonal
        if (moveX !== 0 && moveY !== 0) {
            const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX /= magnitude;
            moveY /= magnitude;
        }
    
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
