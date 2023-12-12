import globalStateManager from "./globalState.js";
import oldManGlobalStateManager from "./oldManGlobalState.js";

export const gameState = globalStateManager().getInstace();
export const oldManState = oldManGlobalStateManager().getInstace();