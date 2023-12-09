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
    {
      speed: 3,
      attackPower: 0.5,
    },
    "slime",
  ];
}