import { playAnimIfNotPlaying } from "../utils.js";

const directionalStates = ["left", "right", "up", "down"];
const AIDelayBetweenStates = 2; // in seconds

export function generateSlimeComponent(k, pos) {
  return [
    k.sprite("assets", {
      anim: "slime-idle-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(0, 6), 16, 10) }),
    k.body(),
    k.pos(pos),
    k.offscreen(),
    k.opacity(),
    k.state("idle", ["idle", ...directionalStates]),
    {
      speed: 10,
      attackPower: 0.5,
    },
    "slime",
  ];
}


export function setSlimeAI(k, slime) {

  k.onUpdate(() => {
    switch(slime.state) {
      case "right": 
        slime.move(slime.speed, 0);
        break;
      case "left": 
      slime.move(-slime.speed, 0);
        break;
      case "up": 
      slime.move(0, -slime.speed);
        break;
      case "down": 
      slime.move(0, slime.speed);
        break;
      default:
    }
  });

  const idle = slime.onStateEnter("idle", async ()  => {
    slime.stop(); //stop all animation
    await k.wait(AIDelayBetweenStates); // wait 3 sec to next computation
    slime.enterState(directionalStates[Math.floor(Math.random() * directionalStates.length)]); // random state will start
  });
  
  const right = slime.onStateEnter("right", async () => {
    slime.flipX = false; // change anim of slime
    playAnimIfNotPlaying(slime, "slime-side");
    await k.wait(AIDelayBetweenStates);

    slime.enterState("idle");
  });

  const left = slime.onStateEnter("left", async () => {
    slime.flipX = true;
    playAnimIfNotPlaying(slime, "slime-side");
    await k.wait(AIDelayBetweenStates);

    slime.enterState("idle");
  });

  const up = slime.onStateEnter("up", async () => {
    playAnimIfNotPlaying(slime, "slime-up");
    await k.wait(AIDelayBetweenStates);

    slime.enterState("idle");
  });

  const down = slime.onStateEnter("down", async () => {
    playAnimIfNotPlaying(slime, "slime-down");
    await k.wait(AIDelayBetweenStates);

    slime.enterState("idle");
  });

  k.onSceneLeave(() => {
    idle.cancel();
    right.cancel();
    left.cancel();
    up.cancel();
    down.cancel();
  });
}