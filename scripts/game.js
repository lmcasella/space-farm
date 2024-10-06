class Game {
    constructor() {
        this.app = new PIXI.Application();
        this.width = 600;
        this.height = 800;

        this.player = new Player(this.app);
        this.objects = [];
        
        this.ready = false;

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
                        spriteBackground.width = this.width;
                        spriteBackground.height = this.height;
                        spriteBackground.zIndex = -1;
                        
                        this.app.stage.addChild(spriteBackground);
                    }
                );
            });
                
        this.spawnObject(Stone, 200, 200, 64, 64);
        
        this.app.ticker.add(() => {
            this.gameLoop();
        });
    }

    spawnObject(object, x, y, width, height) {
        // if (!this.ready) return;

        let newObject = new object(this.app, x, y, width, height);
        newObject.drawHitbox();  // This will draw a green box around the stone
        this.objects.push(newObject);
        this.app.stage.addChild(newObject.sprite);
    }

    gameLoop() {
        this.player.update(this.objects);
        // this.objects.forEach(obj => obj.update());
    }
}