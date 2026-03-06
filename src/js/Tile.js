export class Tile {

    index;
    tileSprite;

    constructor(index, tileSprite){
        this.index = index;
        this.tileSprite = tileSprite;
    }

    setSize(width, height){
        this.tileSprite.width = width;
        this.tileSprite.height = height;
    }

    setPosition(x, y){
        this.tileSprite.position.set(x, y);
    }
}