import k from './kboomContext.js';
import world from './scenes/world.js';
import { loadCustomSprite } from './utils.js';

loadCustomSprite(
  k, 
  "assets", 
  "./assets/topdownasset.png", 
  {
    sliceX: 39,
    sliceY: 31,
    anims: {
      'player-idle-down': 936,
      'slime-idle-down' : 858
    }
  }
);

const scenes = {
  world
}

for (const sceneName  in scenes) {
  k.scene(sceneName, () => scenes[sceneName](k));
}

k.go("world");
