import { playAnimIfNotPlaying } from "../utils.js";

export function generateOldManComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "oldman-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(2, 4), 12, 12 )}),
    k.body({ isStatic: true }),
    k.pos(pos),
    "oldman",
  ];
}

export async function startInteraction(k, oldman, player) {
  switch(player.direction) {
    case 'left':
      oldman.flipX = true;
      playAnimIfNotPlaying(oldman, "oldman-side");
      break;
    case 'right':
      oldman.flipX = false;
      playAnimIfNotPlaying(oldman, "oldman-side");
      break;
    case 'down':
      playAnimIfNotPlaying(oldman, "oldman-up");
      break;
    default:
  }
}