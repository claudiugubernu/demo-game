import globalStateManager from "./globalState.js";
import oldManGlobalStateManager from "./oldManGlobalState.js";
import playerGlobalStateManager from "./playerGlobalState.js";

export const gameState = globalStateManager().getInstace();
export const oldManState = oldManGlobalStateManager().getInstace();
export const playerState = playerGlobalStateManager().getInstace();