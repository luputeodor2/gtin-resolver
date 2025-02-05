const errMap = require("opendsu").loadApi("m2dsu").getErrorsMap();
const mappingErrorsMap = require("./errorMap");

function addMappingError(errorKey) {
  if (!errMap.errorTypes[errorKey]) {
    errMap.addNewErrorType(errorKey, mappingErrorsMap[errorKey].errCode, mappingErrorsMap[errorKey].errMsg);
  }
}

module.exports = {
  addMappingError
}
