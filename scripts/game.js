class Game {
    constructor() {
        this.app = new PIXI.Application();
        this.width = 600;
        this.height = 800;

        this.player = new Player(this.app);
        // this.square = new Stone(this.app, 200, 200);
        this.objects = [];
        
        this.run();
    }

    async run() {
        await this.app.init({width: this.width, height: this.height})
            .then(() => {
                document.body.appendChild(this.app.canvas);

                let square = new GameObject(this.app, 100, 200, 100, 100);
                square.sprite.beginFill(0xff0000);
                square.sprite.drawRect(0, 0, square.width, square.height);
                square.sprite.endFill();
                this.objects.push(square);

                this.app.stage.addChild(square.sprite);

                PIXI.Assets.add({ alias: 'background', src: 'assets/environments/Top-Down-Town/top-down-town-preview.png' });
                PIXI.Assets.backgroundLoad(['background']);

                PIXI.Assets.load('background').then((texture) =>
                    {
                        let spriteBackground = new PIXI.Sprite(texture);
                        spriteBackground.width = this.width;
                        spriteBackground.height = this.height;
                        spriteBackground.zIndex = -1;
                        
                        this.app.stage.addChild(spriteBackground);
                    });
            });

        this.app.ticker.add(() => {
            this.gameLoop();
        });
    }

    gameLoop() {
        this.player.update(this.objects);
    }
}