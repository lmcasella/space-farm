class Game {
    constructor() {
        this.app = new PIXI.Application();
        this.width = 600 // window.innerWidth;
        this.height = 800 // window.innerHeight;
        this.player = new Player(this.app);
        
        this.run();
    }

    async run() {
        await this.app.init({width: this.width, height: this.height});
        document.body.appendChild(this.app.canvas);

        this.app.ticker.add(() => {
            this.gameLoop();
        });
    }

    gameLoop() {
        
    }
}