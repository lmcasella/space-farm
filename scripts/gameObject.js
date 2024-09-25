class GameObject {
    constructor(app, x = 0, y = 0, width = 50, height = 50) {
        this.app = app;
        this.sprite = new PIXI.Graphics();
        this.sprite.x = x;
        this.sprite.y = y;
        this.width = width;
        this.height = height;

        this.app.stage.addChild(this.sprite);
    }

    update() {

    }

    // Detección de colisiones
    checkCollision(objects) {
        if (objects.length === 0) {
            return false;
        }
        
        for(let obj of objects) {
            
            if (!obj || !obj.sprite) {
                return false; // Handle cases where otherObject is invalid
            }
            
            const thisBounds = this.sprite.getBounds();
            const otherBounds = obj.sprite.getBounds();
        
            return thisBounds.x < otherBounds.x + otherBounds.width &&
                   thisBounds.x + thisBounds.width > otherBounds.x &&
                   thisBounds.y < otherBounds.y + otherBounds.height &&
                   thisBounds.y + thisBounds.height > otherBounds.y;
        }
    }
    
}