import { join } from "path";
import fse from "fs-extra";

import settings from "server/settings";

export default () => async data => {
  let response = {
    success: false,
    reason: "Not implemented yet"
  };

  const { login } = data;
  const root = settings.SERVER_ROOT_DIR;
  const file = join(root, "../../..", ".pm2", "logs", "ieo-out.log");
  const buffer = await fse.readFile(file);
  const content = buffer.toString();
  const related = content
    .split("\n")
    .filter(row => row.includes(`Player [${login}]`));
  response.success = true;
  response.data = related;

  return response;
};
