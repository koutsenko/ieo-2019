export const getIP = req => {
  const { connection, headers } = req;
  const fwd = headers["x-forwarded-for"];
  const ip = connection.remoteAddress;
  const result = fwd ? fwd.split(/\s*,\s*/)[0] : ip;

  return result;
};
