import url from "url";

export default (wssA, wssG) => (request, socket, head) => {
  const { pathname } = url.parse(request.url);

  if (pathname === "/admin") {
    wssA.handleUpgrade(request, socket, head, ws => {
      wssA.emit("connection", ws, request);
    });
  } else if (pathname === "/game") {
    wssG.handleUpgrade(request, socket, head, ws => {
      wssG.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
};
