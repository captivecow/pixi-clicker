import { Assets, Rectangle, Texture, Sprite } from "pixi.js";
import { TileLayer } from "./TileLayer";
import { Tile } from "./Tile";

export class TiledMap {
  tileLayers;
  tileTextures;
  width;
  height;
  tileSize;

  constructor(width, height, tileSize, textureMap, tileLayers) {
    this.tileLayers = tileLayers;
    this.tileTextures = textureMap;
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
  }

  static createMap(tilesetName) {
    const textureMap = new Map();
    const tileLayers = [];

    const jsonData = Assets.get(`${tilesetName}-data`);
    const textureSource = Assets.get(`${tilesetName}-textureSource`);
    const imageConfig = jsonData.tilesets[0];

    const rows = imageConfig.imageheight / imageConfig.tileheight;
    const columns = imageConfig.imagewidth / imageConfig.tilewidth;
    const firstgid = imageConfig.firstgid;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const index = r * columns + c;
        const x = c * imageConfig.tilewidth;
        const y = r * imageConfig.tileheight;
        const frame = new Rectangle(x, y, imageConfig.tilewidth, imageConfig.tileheight);
        const subtext = new Texture({
          source: textureSource.source,
          frame: frame,
        });
        textureMap.set(index, subtext);
      }
    }
    for (const layer of jsonData.layers) {
      const tileLayer = new TileLayer(layer.name, layer.id);
      const data = layer.data;
      data.forEach((value, index) => {
        if (value == 0) {
          return;
        }
        const localId = value - firstgid;
        const texture = textureMap.get(localId);
        const tileSprite = new Sprite(texture);
        const mapTile = new Tile(index, tileSprite);
        tileLayer.addTile(mapTile);
      });
      tileLayers.push(tileLayer);
    }
    return new this(jsonData.width, jsonData.height, jsonData.tilewidth, textureMap, tileLayers);
  }
}
