import { DO_EXPORT_LOG } from "common/constants/api";

const doExportLog = login => ({
  type: DO_EXPORT_LOG,
  data: {
    login
  }
});

export default doExportLog;
