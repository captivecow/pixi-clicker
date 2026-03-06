import { Tile } from "./Tile";

export class TileLayer {

    tiles;
    id;
    name;

    constructor(name, id){
        this.name = name;
        this.id = id;
        this.tiles = []
    }

    addTile(tile){
        this.tiles.push(tile);
    }

    
}