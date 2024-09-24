class Game {
    constructor() {
        this.app = new PIXI.Application();
        this.width = 600 // window.innerWidth;
        this.height = 800 // window.innerHeight;
        this.player = new Player(this.app);
        
        this.run();
    }

    async run() {
        await this.app.init({width: this.width, height: this.height})
            .then(() => {
                document.body.appendChild(this.app.canvas);

                PIXI.Assets.add({ alias: 'background', src: 'assets/environments/Top-Down-Town/top-down-town-preview.png' });
                PIXI.Assets.backgroundLoad(['background']);

                PIXI.Assets.load('background').then((texture) =>
                    {
                        let spriteBackground = new PIXI.Sprite(texture);
                        // Background 100% of the screen without stretching
                        spriteBackground.width = this.width;
                        spriteBackground.height = this.height;
                        
                        this.app.stage.addChild(spriteBackground);
                    });
            });

        this.app.ticker.add(() => {
            this.gameLoop();
        });
    }

    gameLoop() {
        this.player.update();
    }
}