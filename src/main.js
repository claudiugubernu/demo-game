import k from './kboomContext.js';
import world from './scenes/world.js';

k.loadSprite(
  "assets", 
  "./assets/plains.png",
  {
    sliceX: 6,
    sliceY: 12
  }
);

const scenes = {
  world
}


for (const sceneName  in scenes) {
  k.scene(sceneName, () => scenes[sceneName](k));
}

k.go("world");
