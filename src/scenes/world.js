import { colorizeBackground, drawTiles, fetchMapData } from "../utils.js";

const mapPath = './assets/maps/world.json';


export default async function world(k) {
  colorizeBackground(k, 76, 170, 255);

  const mapData = await fetchMapData(mapPath);

  const map = k.add([k.pos(0, 0)]);
  const entities = {
    player: null,
    slimes: []
  }

  const layers = mapData.layers;
  for (const layer of layers) {
    if(layer.name === 'Boundaries') {
      // TODO
      continue;
    }

    if(layer.name === 'SpawnPoints') {
      // TODO
      continue;
    }

    // DRAW TILES
    drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
  }
}