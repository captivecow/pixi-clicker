import { Container } from "pixi.js";
import { GameConfig } from "./GameConfig";

export class Camera {
  tiledMap;
  cameraContainer;
  mapContainer;

  constructor(tiledMap, cameraContainer, mapContainer) {
    this.tiledMap = tiledMap;
    this.cameraContainer = cameraContainer;
    this.mapContainer = mapContainer;
  }

  static createCamera(tiledMap) {
    const cameraContainer = new Container();
    const mapContainer = new Container();

    for (const tileLayer of tiledMap.tileLayers) {
      for (const tile of tileLayer.tiles) {
        mapContainer.addChild(tile.tileSprite);
      }
    }
    cameraContainer.addChild(mapContainer);
    return new this(tiledMap, cameraContainer, mapContainer);
  }

  resize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const min_tiles_x = Math.floor(GameConfig.MIN_RES_WIDTH / this.tiledMap.tileSize);
    const min_tiles_y = Math.floor(GameConfig.MIN_RES_HEIGHT / this.tiledMap.tileSize);

    let drawAmountX = min_tiles_x;
    let drawAmountY = min_tiles_y;

    if (this.tiledMap.width < min_tiles_x) {
      drawAmountX = this.tiledMap.width;
    }
    if (this.tiledMap.height < min_tiles_y) {
      drawAmountY = this.tiledMap.height;
    }
    const width_draw = Math.ceil(screenWidth / drawAmountX);
    const height_draw = Math.ceil(screenHeight / drawAmountY);

    for (const tileLayer of this.tiledMap.tileLayers) {
      for (const tile of tileLayer.tiles) {
        const tileRow = Math.floor(tile.index / this.tiledMap.width);
        const tileColumn = tile.index - tileRow * this.tiledMap.width;
        const textureStartX = tileColumn * width_draw;
        const textureStartY = tileRow * height_draw;
        tile.setSize(width_draw, height_draw);
        tile.setPosition(textureStartX, textureStartY);
      }
    }
  }
}
