import { colorizeBackground, fetchMapData, drawBoundaries, drawTiles, playAnimIfNotPlaying, onAttacked, onCollideWithPlayer } from "../utils.js";
import { generatePlayerComponent, setPlayerMovement } from "../entities/player.js";
import { healthBar } from "../uiComponents/healthBar.js";
import { gameState, playerState } from "../state/stateManagers.js";
import { dialog } from "../uiComponents/dialog.js"
import sonLines from "../content/sonDialogue.js";
import { generateGhostComponents, onGhostDestroyed, setGhostAI } from "../entities/ghost.js";

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

        if(object.name === "ghost") {
          entities.ghost = map.add(generateGhostComponents(k, k.vec2(object.x, object.y)));
          continue;
        }

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

  // Slide Camera

  async function slideCam(k, range, duration) {
    const currentCamPos = k.camPos();

    await k.tween(
      currentCamPos.y,
      currentCamPos.y + range,
      duration,
      (newPosY) => k.camPos(currentCamPos.x, newPosY),
      k.easings.linear,
    )
  }

  // Init player movement
  setPlayerMovement(k, entities.player);

  // player enters the dungeon boss
  entities.player.onCollide("door-entrance", async () => {
    gameState.setFreezePlayer(true);
    await slideCam(k, -180, 1);
    entities.player.pos.y -= 50;
    gameState.setFreezePlayer(false);
  });
  
  // player exists the dungeon boss
  entities.player.onCollide("door-exit-2", async () => {
    gameState.setFreezePlayer(true);
    await slideCam(k, 180, 1);
    entities.player.pos.y += 50;
    gameState.setFreezePlayer(false);
  });

  // player exits the dungeon
  entities.player.onCollide("door-exit", () => {
    gameState.setPreviousScene('dungeon');
    k.go("world");
  });
  
  // player goes to the prison door
  entities.player.onCollide("prison-door", async (prisonDoor) => {
    await dialog(
      k,
      k.vec2(250, 500),
      sonLines[gameState.getLocale()][playerState.getHasKey() ? 1 : 0],
    );
    
    if(playerState.getHasKey()) {
      prisonDoor.frame = 506;
      prisonDoor.unuse("body");
      prisonDoor.unuse("area");
      
      gameState.setIsSonSaved(true);
    }

  });

  // player defeats the ghost, gets the key, and talks to the son
  entities.player.onCollide('son', async () => {
    await dialog(
      k,
      k.vec2(250, 500),
      sonLines[gameState.getLocale()][2],
    )
  });

  // if ghost exists bring in all logic
  if(entities.ghost) {
    setGhostAI(k, entities.ghost, entities.player);
    onAttacked(k, entities.ghost, entities.player);
    onCollideWithPlayer(k, entities.ghost);
    onGhostDestroyed(k);
  }

  // Manage Camera
  k.camScale(4);
  // Use healthBar
  healthBar(k);

}