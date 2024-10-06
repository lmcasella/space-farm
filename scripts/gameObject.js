class GameObject {
    constructor(app, x, y, width, height) {
        this.app = app;
        this.sprite = new PIXI.Graphics();
        this.spriteX = x;
        this.spriteY = y;
        this.width = width;
        this.height = height;

        // this.drawHitbox();

        // this.app.stage.addChild(this.sprite);
    }

    update() {

    }

    // Detección de colisiones
    // predictCollision(otherObject, moveX = 0, moveY = 0) {
    //     if (!otherObject || !otherObject.sprite) {
    //         return false;  // Skip invalid objects.
    //     }

    //     // Predict new position based on movement
    //     const newPosX = this.sprite.x + moveX * this.speed;
    //     const newPosY = this.sprite.y + moveY * this.speed;

    //     // Define the bounds of this object explicitly
    //     const thisBounds = {
    //         x: newPosX - this.width / 2,
    //         y: newPosY - this.height,
    //         width: this.width,
    //         height: this.height
    //     };

    //     // Define the bounds of the other object explicitly
    //     const otherBounds = {
    //         x: otherObject.sprite.x,
    //         y: otherObject.sprite.y,
    //         width: otherObject.width,
    //         height: otherObject.height
    //     };

    //     // Check if the bounding boxes intersect (collision)
    //     return thisBounds.x < otherBounds.x + otherBounds.width &&
    //            thisBounds.x + thisBounds.width > otherBounds.x &&
    //            thisBounds.y < otherBounds.y + otherBounds.height &&
    //            thisBounds.y + thisBounds.height > otherBounds.y;
    // }

    predictCollision(otherObject, moveX = 0, moveY = 0) {
        if (!otherObject || !otherObject.sprite) {
            return false;  // Skip invalid objects.
        }
    
        // Account for anchor offset (0.5, 1) for the player
        const newPosX = this.sprite.x + moveX * this.speed;
        const newPosY = this.sprite.y + moveY * this.speed;
    
        // Only check collision for the bottom 30% of the player (adjust this ratio as needed)
        const footHeightRatio = 0.3;  // Adjust this value to fine-tune the height of the feet
        const footHeight = this.height * footHeightRatio;
        
        // Reduce width slightly for side collisions
        const footWidthAdjustment = 0.6; // Adjust this to tweak how "tight" side collisions are
        const footWidth = this.width * footWidthAdjustment;
    
        const thisBounds = {
            x: newPosX - footWidth / 2,  // Center the collision box horizontally
            y: newPosY - footHeight,     // Only consider the bottom portion (feet) for collision
            width: footWidth,            // Reduced width for better side collision
            height: footHeight           // Only the lower part of the player's height
        };
    
        const otherBounds = {
            x: otherObject.sprite.x,
            y: otherObject.sprite.y,
            width: otherObject.width,
            height: otherObject.height
        };
    
        // Check if the bounding boxes intersect (collision)
        return thisBounds.x < otherBounds.x + otherBounds.width &&
               thisBounds.x + thisBounds.width > otherBounds.x &&
               thisBounds.y < otherBounds.y + otherBounds.height &&
               thisBounds.y + thisBounds.height > otherBounds.y;
    }
    

    // Optionally, define a method to visualize hitboxes for debugging
    drawHitbox() {
        const hitbox = new PIXI.Graphics();
        hitbox.lineStyle(2, 0x00ff00); // Green outline
        hitbox.drawRect(this.sprite.x, this.sprite.y, this.width, this.height);
        this.app.stage.addChild(hitbox);
    }
    
    // predictCollision(otherObject, moveX, moveY) {
    //     if (!otherObject || !otherObject.sprite) {
    //         return false;  // Skip invalid objects.
    //     }

    //     const newPosX = this.sprite.x + moveX * this.speed;
    //     const newPosY = this.sprite.y + moveY * this.speed;

    //     const thisBounds = {
    //         x: newPosX - this.sprite.width / 2,
    //         y: newPosY - this.sprite.height / 2,
    //         width: this.sprite.width,
    //         height: this.sprite.height,
    //     };

    //     const otherBounds = otherObject.sprite.getBounds();

    //     return thisBounds.x < otherBounds.x + otherBounds.width &&
    //            thisBounds.x + thisBounds.width > otherBounds.x &&
    //            thisBounds.y < otherBounds.y + otherBounds.height &&
    //            thisBounds.y + thisBounds.height > otherBounds.y;
    // }
}