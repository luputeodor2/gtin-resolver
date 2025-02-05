function verifyIfLeafletMessage(message) {
  return ["leaflet", "smpc"].includes(message.messageType)
    && Object.keys(message).some(key => ['productCode', 'batchCode'].includes(key))
    && typeof message.delete === "undefined"
}

const acceptedFileExtensions = ["xml", "apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp", "bmp", "ico", "cur"];

async function processLeafletMessage(message) {
  const leafletUtils = require("./leafletUtils");
  const logUtils = require("../../utils/LogUtils");
  const utils = require("../utils");
  const errorUtils = require("../errors/errorUtils");
  const errMap = require("opendsu").loadApi("m2dsu").getErrorsMap();

  const {sanitize} = require("../../utils/htmlSanitize");
  this.mappingLogService = logUtils.createInstance(this.storageService, this.options.logService);

  message.otherFilesContent.forEach(fileObj => {
    const splitFileName = fileObj.filename.split(".");
    const fileExtension = splitFileName[splitFileName.length - 1];
    const index = acceptedFileExtensions.findIndex(acceptedExtension => acceptedExtension === fileExtension);
    if (index === -1) {
      errorUtils.addMappingError("UNSUPPORTED_FILE_FORMAT");
      throw errMap.newCustomError(errMap.errorTypes.UNSUPPORTED_FILE_FORMAT, message.messageType);
    }
    try{
      fileObj.fileContent = sanitize(fileObj.fileContent);
    }catch (e) {
      errorUtils.addMappingError("FILE_CONTAINS_FORBIDDEN_TAGS");
      throw errMap.newCustomError(errMap.errorTypes.FILE_CONTAINS_FORBIDDEN_TAGS, message.messageType);
    }
  });

  let language = message.language;
  let type = message.messageType

  let basePath = leafletUtils.getLeafletDirPath(type, language);
  let xmlFilePath = leafletUtils.getLeafletPath(type, language);
  let base64ToArrayBuffer = require("../../utils/CommonUtils").base64ToArrayBuffer;
  let base64XMLFileContent = message.xmlFileContent;
  try{
    base64XMLFileContent = sanitize(base64XMLFileContent);
  }catch (e) {
    errorUtils.addMappingError("FILE_CONTAINS_FORBIDDEN_TAGS");
    throw errMap.newCustomError(errMap.errorTypes.FILE_CONTAINS_FORBIDDEN_TAGS, message.messageType);
  }

  let arrayBufferXMLFileContent = base64ToArrayBuffer(base64XMLFileContent);

  const {hostDSU, hostMetadata} = await leafletUtils.getHostDSUData.call(this, message);
  let beforeChangeLanguages = await $$.promisify(hostDSU.listFolders)(basePath);

  try {

    await hostDSU.writeFile(xmlFilePath, $$.Buffer.from(arrayBufferXMLFileContent));

    for (let i = 0; i < message.otherFilesContent.length; i++) {
      let file = message.otherFilesContent[i];
      let filePath = `${basePath}/${file.filename}`;
      await hostDSU.writeFile(filePath, $$.Buffer.from(base64ToArrayBuffer(file.fileContent)));
    }
    let languages = await $$.promisify(hostDSU.listFolders)(`/${type}`);
    let diffs = {};
    languages.forEach(lang => {
      diffs["type"] = type;
      diffs["language"] = lang;
      if (beforeChangeLanguages.find(item => lang === item)) {
        diffs["action"] = "updated"
      } else {
        diffs["action"] = "added"
      }
    })
    let logData = await this.mappingLogService.logSuccessAction(message, hostMetadata, true, diffs, hostDSU);
    await utils.increaseVersion(this, message);
  } catch (e) {
    console.log("Leaflet Mapping failed because of", e);

    const errMap = require("opendsu").loadApi("m2dsu").getErrorsMap();
    const errorUtils = require("../errors/errorUtils");
    errorUtils.addMappingError("WRITING_FILE_FAILED");
    throw errMap.newCustomError(errMap.errorTypes.WRITING_FILE_FAILED, message.messageType);
  }
}

require("opendsu").loadApi("m2dsu").defineMapping(verifyIfLeafletMessage, processLeafletMessage);
