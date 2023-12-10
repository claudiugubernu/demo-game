import { dialog } from "../uiComponents/dialog.js";
import { playAnimIfNotPlaying } from "../utils.js";
import oldmanLines from '../content/oldmanDialogue.js';

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

  const NPCResponses = oldmanLines.english;

  dialog(k, k.vec2(250, 500), NPCResponses[0]);
}