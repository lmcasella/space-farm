class Game {
    constructor() {
        this.app = new PIXI.Application({width: 800, height: 600});
        document.body.appendChild(this.app.view);

        // Load assets
        PIXI.Loader.shared
            .add('spritesheet', 'assets/player.json')
            .load(() => this.setup());
    }

    setup() {
        let playerTextures = [];
        for (let i = 1; i <= 6; i++) {
            playerTextures.push(PIXI.Texture.from(`player-${i}.png`));
        }

        // this.player = new PIXI.AnimatedSprite(playerTextures);
        this.player = new Player(playerTextures);
        this.app.stage.addChild(this.player);

        this.app.ticker.add(delta => {
            this.player.move(1 * delta, 0);
        });
    }
}