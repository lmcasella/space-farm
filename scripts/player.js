class Player {
    constructor(app) {
        this.app = app;
        this.ready = false;
        this.loadPlayer();
    }

    async loadPlayer() {
        let json = await PIXI.Assets.load('assets/player2/player2.json');
        this.player = new PIXI.AnimatedSprite(json.animations["walk"]);
        this.player.animationSpeed = 0.15;
        this.player.loop = true
        this.player.play()
        this.app.stage.addChild(this.player)

        this.player.x = 400
        this.player.y = 300
        this.player.anchor.set(0.5)

        this.ready = true;
    }

    update() {
        if (!this.ready) return;

        this.player.x += 1;
    }
}