class Stone extends GameObject {
    constructor(app, x, y, width, height) {
        super(app, x, y, width, height);

        this.createStone();
    }

    createStone() {
        this.sprite.beginFill(0xff0000);
        this.sprite.drawRect(0, 0, this.width, this.height);
        this.sprite.endFill();
        // this.sprite.anchor.set(0.5, 0.5);
        this.sprite.x = this.spriteX;
        this.sprite.y = this.spriteY;

        // this.ready = true;
    }
}