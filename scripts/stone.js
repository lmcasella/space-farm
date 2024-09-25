class Stone extends GameObject {
    constructor(app, x, y, size = 100) {
        super(app, x, y, size, size);
        this.ready = false;

        this.createStone();
    }

    createStone() {
        this.sprite.beginFill(0xff0000);
        this.sprite.drawRect(0, 0, this.width, this.height);
        this.sprite.endFill();

        // this.ready = true;
    }

    // update() {
    //     if (!this.ready) return ;

    //     this.createStone();
    // }
}