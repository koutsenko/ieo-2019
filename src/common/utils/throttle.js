let timer;

const throttleAsync = async fn => {
  if (timer !== undefined) {
    clearTimeout(timer);
  }
  timer = setTimeout(async () => {
    await fn();
  }, 250);
};

export { throttleAsync };
