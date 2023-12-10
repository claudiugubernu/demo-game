async function displayLine(textContainer, line) {
  const charPrintSpeed = 30;//ms

  for (const char of line) {
    await new Promise((resolve) => {
      setTimeout(() => {
        textContainer.text += char;
        resolve();
      }, charPrintSpeed);
    });
  }
}

export async function dialog(k, pos, content) {
  const dialogBox = k.add([
    k.rect(800, 200),
    k.pos(pos),
    k.fixed()
  ]);

  const textContainer = dialogBox.add([
    k.text("", {
      width: 700,
      lineSpacing: 15,
      size: 24
    }),
    k.color(27, 29, 52),
    k.pos(20, 40),
    k.fixed()
  ]);

  let index = 0;

  await displayLine(textContainer, content[index]);
  let lineFinishedDisplayed = true;

  const dialogKey = k.onKeyPress("space", async () => {
    if(!lineFinishedDisplayed) return;

    index++;
    if(!content[index]) {
      k.destroy(dialogBox);
      dialogKey.cancel();
      return
    }

    textContainer.text = '';
    lineFinishedDisplayed = false;
    await displayLine(textContainer, content[index]);
    lineFinishedDisplayed = true;
  });
}