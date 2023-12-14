import { dialog } from "../uiComponents/dialog.js";
import { playAnimIfNotPlaying } from "../utils.js";
import oldmanLines from '../content/oldmanDialogue.js';
import { gameState, oldManState, playerState } from "../state/stateManagers.js";

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

  playerState.setIsSwordEquipped(true);

  const NPCLines = oldmanLines[gameState.getLocale()];

  console.log(gameState.getIsSonSaved());

  if(gameState.getIsSonSaved()) {
    await dialog(k, k.vec2(250, 500), NPCLines[3]);
    return;
  }

  let nbTalkedOldMan = oldManState.getNbTalkedOldMan();

  // we want to have the offset here to keep the last line
  // for when we finish the game
  if(nbTalkedOldMan > NPCLines.length - 2) {
    oldManState.setNbTalkedOldMan(1);
    nbTalkedOldMan = oldManState.getNbTalkedOldMan();
  } 

  if(NPCLines[nbTalkedOldMan]) {
    dialog(k, k.vec2(250, 500), NPCLines[nbTalkedOldMan]);
    oldManState.setNbTalkedOldMan(nbTalkedOldMan + 1);
  }
}