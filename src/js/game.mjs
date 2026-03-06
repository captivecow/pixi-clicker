import { Application, Assets, Sprite, Rectangle, Texture } from "pixi.js";
import { GameConfig } from "./GameConfig";
import { TiledMap } from "./TiledMap";
import { Camera } from "./Camera";

const MANIFEST = {
  bundles: [
    {
      name: "DREAMLAND",
      assets: [
        { alias: "DREAMLAND-data", src: "tileset.json" },
        { alias: "DREAMLAND-textureSource", src: "tileset.png", data: { scaleMode: "nearest" } },
      ],
    },
  ],
};

async function loadJsonMap(screenWidth, screenHeight) {

  const jsonData = Assets.get("jsonData");
  const tilesetSource = Assets.get("tileSourceTexture");
  const tileIndexMap = new Map();

  console.log("Screen dimensions: " + screenWidth + "," + screenHeight);

  const min_tiles_x = Math.floor(GameConfig.MIN_RES_WIDTH / jsonData.tilewidth);
  const min_tiles_y = Math.floor(GameConfig.MIN_RES_HEIGHT / jsonData.tileheight);

  console.log("Base tiles needed to meet min resolution: " + min_tiles_x + "," + min_tiles_y);

  const width = jsonData.width;
  const height = jsonData.height;

  let drawAmountX = min_tiles_x;
  let drawAmountY = min_tiles_y;

  if(width < min_tiles_x){
    drawAmountX = width;
  } 
  if(height < min_tiles_y){
    drawAmountY = height;
  }

  const width_draw = Math.ceil(screenWidth / drawAmountX);
  const height_draw = Math.ceil(screenHeight / drawAmountY);

  const tileHeight = jsonData.tileheight;
  const tileWidth = jsonData.tilewidth;

  const tilesetData = jsonData.tilesets[0];
  const imageWidth = tilesetData.imagewidth;
  const imageHeight = tilesetData.imageheight;
  const firstgid = tilesetData.firstgid;
  const rows = imageHeight / tileHeight;
  const columns = imageWidth / tileWidth;

  const uniqueTileSet = new Set();
  for (const layer of jsonData.layers) {
    for (const tileNum of layer.data) {
      let finalNum = tileNum - firstgid;
      if (finalNum < 0) {
        finalNum = 0;
      }
      uniqueTileSet.add(finalNum);
    }
  }

  console.log(uniqueTileSet);
  console.log(imageWidth);
  console.log(imageHeight);
  console.log(columns + "," + rows);

  for (const tile of uniqueTileSet) {
    const tileRow = Math.floor(tile / columns);
    const tileColumn = tile - tileRow * columns;
    const textureStartX = tileColumn * tileWidth;
    const textureStartY = tileRow * tileHeight;

    const subsetRectangle = new Rectangle(textureStartX, textureStartY, tileWidth, tileHeight);

    const subsetTexture = new Texture({
      source: tilesetSource.source,
      frame: subsetRectangle,
    });
    tileIndexMap.set(tile, subsetTexture);
  }

  for (const layer of jsonData.layers) {
    const data = layer.data;

    data.forEach((value, index) => {
      let finalNum = value - firstgid;
      if (finalNum < 0) {
        finalNum = 0;
      }
      const tileNumTexture = tileIndexMap.get(finalNum);
      const tileSprite = new Sprite(tileNumTexture);
      const tileRow = Math.floor(index / width);
      const tileColumn = index - tileRow * width;
      const textureStartX = tileColumn * width_draw;
      const textureStartY = tileRow * height_draw;
      tileSprite.position.set(textureStartX, textureStartY);
      tileSprite.width = width_draw;
      tileSprite.height = height_draw;
      app.stage.addChild(tileSprite);
    });
  }
}

const app = new Application();

await app.init({
  resizeTo: window,
  antialias: true,
  preference: "webgl",
});
await Assets.init({
  basePath: "src/assets",
  manifest: MANIFEST,
});
await Assets.loadBundle(GameConfig.DEFAULT_MAP_NAME);
document.body.appendChild(app.canvas);

const gameMap = TiledMap.createMap(GameConfig.DEFAULT_MAP_NAME);
const camera = Camera.createCamera(gameMap);

window.addEventListener('resize', () => camera.resize());

app.stage.addChild(camera.cameraContainer);


