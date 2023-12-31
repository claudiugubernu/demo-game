import { playerState } from "./state/stateManagers.js";
import { healthBar } from "./uiComponents/healthBar.js";

export function playAnimIfNotPlaying(gameObj, animName) {
  if(gameObj.curAnim() !== animName) gameObj.play(animName);
}

export function areAnyOfTheseKeysDown(k, keys) {
  for (const key of keys) {
    if(k.isKeyDown(key)) return true;
  }

  return false;
}

export function colorizeBackground(k, r, g, b) {
  k.add([
    k.rect(k.canvas.width, k.canvas.height),
    k.color(r,g,b),
    k.fixed()
  ]);
}

export async function fetchMapData(mapPath) {
  const initFetch = await fetch(mapPath);
  return await initFetch.json();
}

export function loadCustomSprite(k, type, url, props) {
  return k.loadSprite(
    type, 
    url,
    props
  );
}

export function drawTiles(k, map, layer, tileheight, tilewidth) {
  let numberOfDrawnTiles = 0;
  const tilePos = k.vec2(0, 0);
  
  for (const tile of layer.data) {
    // we finished drawing the full row
    if(numberOfDrawnTiles % layer.width === 0) {
      tilePos.x = 0;
      tilePos.y += tileheight;
    } else {
      tilePos.x += tilewidth;
    }

    numberOfDrawnTiles++;
    if(tile === 0) continue;

    /* we need to substract 1 due to how tile exports json data object
    by considering 0 as no tile, but in kboom we need to start at 0 so 
    we will offest by 1
    */
    map.add([
      k.sprite("assets", {frame: tile - 1}),
      k.pos(tilePos), 
      k.offscreen(),
    ]);

  }
}

export function generateColliderBoxComponents(k, width, height, pos, tag) {
  return [
    k.area({shape: new k.Rect(k.vec2(0), width, height)}),
    k.pos(pos),
    k.body({ isStatic: true}),
    k.offscreen(),
    tag
  ]
}

export function drawBoundaries(k, map, layer) {
  for (const object of layer.objects) {
    map.add(generateColliderBoxComponents(
      k, 
      object.width, 
      object.height,
      k.vec2(object.x, object.y + 16),
      object.name
    ));
  }
}

export async function blinkEffect(k, entity) {
  await k.tween(
    entity.opacity,
    0,
    0.1,
    (val) => (entity.opacity = val),
    k.easings.linear
  );
 
  await k.tween(
    entity.opacity,
    1,
    0.1,
    (val) => (entity.opacity = val),
    k.easings.linear
  );
}

export function onAttacked(k, entity, player) {
  entity.onCollide('swordHitBox', async () => {
    if(entity.isAttacking) return;

    if(entity.hp() <= 0) {
      k.destroy(entity);
      return;
    }

    await blinkEffect(k, entity);
    entity.hurt(player.attackPower);
  });
}

export function onCollideWithPlayer(k, entity) {
  entity.onCollide('player', async (player) => {
    if(player.isAttacking) return;

    playerState.setHealth(playerState.getHealth() - entity.attackPower);

    k.destroyAll('healthContainer');
    healthBar(k, player);
    await blinkEffect(k, player);

    if(playerState.getHealth() <= 0) {
      playerState.setHealth(playerState.getMaxHealth());
      k.go('world');
    }
  });
}