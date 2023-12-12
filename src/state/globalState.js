export default function globalStateManager() {
  let instance = null;

  function createInstance() {
    let freezePlayer = false;
    let fontSize = 30;
    let locale = "english"

    return {
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
      getLocale: () => locale
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