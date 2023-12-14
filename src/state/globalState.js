export default function globalStateManager() {
  let instance = null;

  function createInstance() {
    let previousScene = null;
    let freezePlayer = false;
    let fontSize = 30;
    let locale = "english";
    let isSonSaved = false;
    let ghostDefeated = false;

    return {
      setPreviousScene(value) {
        previousScene = value;
      },
      getPreviousScene: () => previousScene,
      setFreezePlayer(value) {
        freezePlayer = value;
      },
      getFreezePlayer: () => freezePlayer,
      setFontSize(value) {
        fontSize = value
      },
      getFontSize: () => fontSize,
      setLocale(value) {
        locale = value
      },
      getLocale: () => locale,
      setIsSonSaved(value) {
        isSonSaved = value
      },
      getIsSonSaved: () => isSonSaved,
      setIsGhostDefeated(value) {
        ghostDefeated = value
      },
      getIsGhostDefeated: () => ghostDefeated
    }
  }

  return{
    getInstace() {
      if(!instance) {
        instance = createInstance();
      }

      return instance;
    },
  }
}