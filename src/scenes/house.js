import { colorizeBackground, fetchMapData, drawBoundaries, drawTiles, playAnimIfNotPlaying } from "../utils.js";
import { generatePlayerComponent, setPlayerMovement } from "../entities/player.js";
import { generateOldManComponents, startInteraction } from "../entities/oldman.js";

const mapPath = './assets/maps/house.json';

export default async function house(k) {
  colorizeBackground(k, 27, 29, 52);

  const mapData = await fetchMapData(mapPath);
  const map = k.add([k.pos(520, 200)]);

  const entities = {
    oldman: null,
    player: null
  }

  const layers = mapData.layers;

  for (const layer of layers) {

    if(layer.name === 'Boundaries') {
      drawBoundaries(k, map, layer);
      continue;
    }

    if(layer.name === 'SpawnPoints') {
      for (const object of layer.objects) {

        if(object.name === 'player') {
          entities.player = map.add(generatePlayerComponent(k, k.vec2(object.x, object.y)));
          continue;
        }

        if(object.name === "oldman") {
          entities.oldman = map.add(generateOldManComponents(k, k.vec2(object.x, object.y)));
          continue;
        }
      }
      continue;
    }

    // DRAW TILES
    drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
  } 

  // Manage Camera
  k.camScale(4);
  // Set position of cam
  k.camPos(entities.player.worldPos());

  // Init player movement
  setPlayerMovement(k, entities.player);

  // player exits the house
  entities.player.onCollide("door-exit", () => {
    k.go("world");
  });

  // player interacts with oldman NPC
  entities.player.onCollide("oldman", () => {
    startInteraction(k, entities.oldman, entities.player);
  });

  // player stops his interaction with oldman NPC
  entities.player.onCollideEnd("oldman", async () => {
    await k.wait(1); // wait to return oldman NPC to default state
    playAnimIfNotPlaying(entities.oldman, 'oldman-down');
  });
}