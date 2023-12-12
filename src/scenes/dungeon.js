import { colorizeBackground, fetchMapData, drawBoundaries, drawTiles, playAnimIfNotPlaying } from "../utils.js";
import { generatePlayerComponent, setPlayerMovement } from "../entities/player.js";
// import { generateGhostComponents, startInteraction } from "../entities/ghost.js";
import { healthBar } from "../uiComponents/healthBar.js";
import { gameState, playerState } from "../state/stateManagers.js";

const mapPath = './assets/maps/dungeon.json';

export default async function dungeon(k) {
  colorizeBackground(k, 27, 29, 52);

  const mapData = await fetchMapData(mapPath);
  const map = k.add([k.pos(420, 95)]);

  const entities = {
    player: null,
    ghost: null
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

        // if(object.name === "ghost") {
        //   entities.ghost = map.add(generateGhostComponents(k, k.vec2(object.x, object.y)));
        //   continue;
        // }

        if(object.name === 'prison-door') {
          map.add([
            k.sprite('assets', {
              frame: playerState.getHasKey() ? 506 : 505,
              }),
              !playerState.getHasKey() && k.area(),
              !playerState.getHasKey() && k.body({ isStatic: true }),
              k.pos(object.x, object.y),
              'prison-door'
          ]);
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

  // player exits the house
  entities.player.onCollide("door-exit", () => {
    gameState.setPreviousScene('dungeon');
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

  healthBar(k);
}