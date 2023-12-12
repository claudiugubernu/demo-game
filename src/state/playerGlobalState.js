export default function playerGlobalStateManager() {
  let instance = null;

  function createInstance() {
    let isSwordEquipped = false;
    const maxHealth = 3;
    let health = maxHealth;
    let hasKey = false;

    return {
      setIsSwordEquipped(value) {
        isSwordEquipped = value;
      },
      getIsSwordEquipped: () => isSwordEquipped,
      setHealth(value) {
        health = value;
      },
      getHealth: () => health,
      setHasKey(value) {
        hasKey = value;
      },
      getHasKey: () => hasKey,
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