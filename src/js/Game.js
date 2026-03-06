import { Application, Assets } from "pixi.js";
import { GameConfig } from "./GameConfig";
import { TiledMap } from "./tiled/TiledMap";
import { Camera } from "./Camera";

const MANIFEST = {
  bundles: [
    {
      name: "ROGUE",
      assets: [
        { alias: "ROGUE-data", src: "tileset.json" },
        { alias: "ROGUE-textureSource", src: "tileset.png", data: { scaleMode: "nearest" } },
      ],
    },
  ],
};

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

camera.resize();

window.addEventListener("resize", () => camera.resize());

app.stage.addChild(camera.cameraContainer);
