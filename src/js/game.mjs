import { Application, Assets, Sprite, Rectangle, Texture, loadJson } from "pixi.js";

const WIDTH = 800;
const HEIGHT = 600;

const MANIFEST = {
  bundles: [
    {
      name: "dreamland",
      assets: [
        { alias: "jsonData", src: "tileset.json", parser: loadJson },
        { alias: "tileSourceTexture", src: "tileset.png", data: { scaleMode: "nearest" } },
      ],
    },
  ],
};

async function loadJsonMap() {
  const dreamlandAssets = await Assets.loadBundle("dreamland");

  const width_draw_amount = 20;
  const height_draw_amount = Math.floor(width_draw_amount * (HEIGHT / WIDTH));

  const width_draw = Math.floor(WIDTH / width_draw_amount);
  const height_draw = Math.floor(HEIGHT / height_draw_amount);

  const jsonData = dreamlandAssets.jsonData;
  const tilesetSource = dreamlandAssets.tileSourceTexture;
  const tileIndexMap = new Map();

  const width = jsonData.width;
  const height = jsonData.height;
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

  // Formula for index: rowsxcolumns, (r * columns) + c
  // Find row from index: (i/columns)
  // for (let r = 0; r < rows; r++) {
  //   for (let c = 0; c < columns; c++) {
  //     console.log("(" + c + "," + r + ")");
  //     console.log(r * columns + c);
  //   }
  // }

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

    console.log("Start");
    data.forEach((value, index) => {
      let finalNum = value - firstgid;
      if (finalNum < 0) {
        finalNum = 0;
      }
      const tileNumTexture = tileIndexMap.get(finalNum);
      const tileSprite = new Sprite(tileNumTexture);
      const tileRow = Math.floor(index / width);
      const tileColumn = index - tileRow * width;
      console.log(finalNum);
      console.log(tileColumn + "," + tileRow);
      const textureStartX = tileColumn * width_draw;
      const textureStartY = tileRow * height_draw;
      console.log(textureStartX + "," + textureStartY);
      tileSprite.position.set(textureStartX, textureStartY);
      tileSprite.width = width_draw;
      tileSprite.height = height_draw;
      app.stage.addChild(tileSprite);
    });
  }
}

const app = new Application();

await app.init({
  width: WIDTH,
  height: HEIGHT,
  antialias: true,
  preference: "webgl",
});

await Assets.init({
  basePath: "src/assets",
  manifest: MANIFEST,
});

document.body.appendChild(app.canvas);
await loadJsonMap();
