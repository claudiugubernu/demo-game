import { generatePlayerComponent, setPlayerMovement } from '../entities/player.js';
import { generateSlimeComponent, setSlimeAI } from '../entities/slime.js';
import { healthBar } from '../uiComponents/healthBar.js';
import { colorizeBackground, drawBoundaries, drawTiles, fetchMapData, onAttacked, onCollideWithPlayer } from '../utils.js';

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
      drawBoundaries(k, map, layer);
      continue;
    }

    if(layer.name === 'SpawnPoints') {
      for (const object of layer.objects) {
        if(object.name === 'player') {
          entities.player = map.add(generatePlayerComponent(k, k.vec2(object.x, object.y)));
          continue;
        }

        if(object.name === 'slime') {
          entities.slimes.push(map.add(generateSlimeComponent(k, k.vec2(object.x, object.y))));
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
  // Follow player on map
  k.onUpdate(() => {
    if(entities.player.pos.dist(k.camPos())) {
      k.tween(
        k.camPos(), // init val
        entities.player.worldPos(), // target val
        0.15, // how long to update target val
        (newPos) => {
          k.camPos(newPos);
        }, // intermediate val between init and target val
        k.easings.linear // effect of movement
      );
    }
  });

  // Init player movement
  setPlayerMovement(k, entities.player);

  // init AI slime movement
  for (const slime of entities.slimes) {
    setSlimeAI(k, slime);
    onAttacked(k, slime, entities.player);
    onCollideWithPlayer(k, slime);
  }

  // player enters the house
  entities.player.onCollide("door-entrance", () => {
    k.go("house");
  });

  healthBar(k);
}