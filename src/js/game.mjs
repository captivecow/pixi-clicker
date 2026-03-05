import { Application, Assets, Sprite, Rectangle, Texture, SCALE_MODES } from "pixi.js";

async function loadJsonMap() {
  const WIDTH = 800;
  const HEIGHT = 600;

  const width_draw_amount = 20;
  const height_draw_amount = Math.floor(width_draw_amount * (HEIGHT / WIDTH));

  const width_draw = Math.floor(WIDTH / width_draw_amount);
  const height_draw = Math.floor(HEIGHT / height_draw_amount);

  const jsonData = await Assets.load("src/assets/tileset.json");
  const tilesetSource = await Assets.load("src/assets/tileset.png");
  tilesetSource.source.scaleMode = "nearest"; // Use 'linear' for smooth scaling
  const tileIndexMap = new Map();

  const width = jsonData.width;
  const height = jsonData.height;
  const tileHeight = jsonData.tileheight;
  const tileWidth = jsonData.tilewidth;

  const uniqueTileSet = new Set();
  for (const layer of jsonData.layers) {
    for (const tileNum of layer.data) {
      let finalNum = tileNum - 1;
      if (finalNum < 0) {
        finalNum = 0;
      }
      uniqueTileSet.add(finalNum);
    }
  }

  const imageWidth = jsonData.tilesets[0].imagewidth;
  const imageHeight = jsonData.tilesets[0].imageheight;
  const rows = imageHeight / tileHeight;
  const columns = imageWidth / tileWidth;

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
      let finalNum = value - 1;
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
  width: 800,
  height: 500,
});

document.body.appendChild(app.canvas);
await loadJsonMap();
