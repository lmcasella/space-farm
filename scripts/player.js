class Player extends PIXI.AnimatedSprite {
    constructor(textures) {
        super(textures);
        this.animationSpeed = 0.1;
        this.x = 400;
        this.y = 300;
        this.anchor.set(0.5);
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }
}