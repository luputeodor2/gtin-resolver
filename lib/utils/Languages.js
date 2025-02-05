const languages = [
  {"code": "bg", "name": "Bulgarian", "nativeName": "Български език"},
  {"code": "zh", "name": "Chinese", "nativeName": "中文 (Zhōngwén), 汉语, 漢語"},
  {"code": "hr", "name": "Croatian", "nativeName": "hrvatski"},
  {"code": "cs", "name": "Czech", "nativeName": "Česky, čeština"},
  {"code": "da", "name": "Danish", "nativeName": "Dansk"},
  {"code": "nl", "name": "Dutch", "nativeName": "Nederlands, Vlaams"},
  {"code": "en", "name": "English", "nativeName": "English"},
  {"code": "et", "name": "Estonian", "nativeName": "Eesti, eesti keel"},
  {"code": "fi", "name": "Finnish", "nativeName": "Suomi, suomen kieli"},
  {"code": "fr", "name": "French", "nativeName": "Français"},
  {"code": "ka", "name": "Georgian", "nativeName": "ქართული"},
  {"code": "de", "name": "German", "nativeName": "Deutsch"},
  {"code": "el", "name": "Greek, Modern", "nativeName": "Ελληνικά"},
  {"code": "he", "name": "Hebrew (modern)", "nativeName": "עברית"},
  {"code": "hi", "name": "Hindi", "nativeName": "हिन्दी, हिंदी"},
  {"code": "hu", "name": "Hungarian", "nativeName": "Magyar"},
  {"code": "id", "name": "Indonesian", "nativeName": "Bahasa Indonesia"},
  {"code": "it", "name": "Italian", "nativeName": "Italiano"},
  {"code": "ja", "name": "Japanese", "nativeName": "日本語 (にほんご／にっぽんご)"},
  {"code": "ko", "name": "Korean", "nativeName": "한국어 (韓國語), 조선말 (朝鮮語)"},
  {"code": "lt", "name": "Lithuanian", "nativeName": "Lietuvių kalba"},
  {"code": "lv", "name": "Latvian", "nativeName": "Latviešu valoda"},
  {"code": "mk", "name": "Macedonian", "nativeName": "Македонски јазик"},
  {"code": "no", "name": "Norwegian", "nativeName": "Norsk"},
  {"code": "pa", "name": "Panjabi, Punjabi", "nativeName": "ਪੰਜਾਬੀ, پنجابی‎"},
  {"code": "pl", "name": "Polish", "nativeName": "Polski"},
  {"code": "pt", "name": "Portuguese", "nativeName": "Português"},
  {"code": "ro", "name": "Romanian", "nativeName": "Română"},
  {"code": "ru", "name": "Russian", "nativeName": "Русский язык"},
  {"code": "sr", "name": "Serbian", "nativeName": "Српски језик"},
  {"code": "sk", "name": "Slovak", "nativeName": "Slovenčina"},
  {"code": "es", "name": "Spanish; Castilian", "nativeName": "Español, Castellano"},
  {"code": "sv", "name": "Swedish", "nativeName": "Svenska"},
  {"code": "th", "name": "Thai", "nativeName": "ไทย"},
  {"code": "tr", "name": "Turkish", "nativeName": "Türkçe"},
  {"code": "uk", "name": "Ukrainian", "nativeName": "Українська"},
  {"code": "vi", "name": "Vietnamese", "nativeName": "Tiếng Việt"}
];

function getListAsVM() {
  let result = [];
  languages.forEach(language => {
    result.push({label: language.name, value: language.code});
  });

  return result;
}

function getLanguageFromCode(code) {
  const language = languages.find(language => language.code === code)
  if (typeof language === "undefined") {
    throw Error(`The language code ${code} does not match with any of the known languages.`)
  }
  return language;
}

function getLanguageFromName(name) {
  const language = languages.find(language => language.name.includes(name));
  if (typeof language === "undefined") {
    throw Error(`The language name ${name} does not match with any of the known languages.`)
  }
  return language;
}

function createVMItem(language) {
  return {label: language.name, value: language.code, nativeName: language.nativeName}
}

function normalizeLanguage(language) {
  switch (typeof language) {
    case "string":
      if (language.length === 2) {
        return getLanguageAsItemForVMFromCode(language);
      }
      return getLanguageAsItemForVMFromName(language);

    case "object":
      if (typeof language.value !== "undefined") {
        return language;
      }
      if (typeof language.code !== "undefined") {
        return getLanguageAsItemForVMFromCode(language.code);
      }

      throw Error("Invalid language format");
    default:
      throw Error(`The language should be of type string or object. Provided type ${typeof language}`);
  }
}

function normalizeLanguages(languages) {
  return languages.map(language => normalizeLanguage(language));
}

function getAllLanguagesAsVMItems() {
  let result = [];
  languages.forEach(language => {
    result.push(createVMItem(language));
  });

  return result;
}

function getList() {
  return languages;
}

function getLanguageName(code) {
  let language = getLanguageFromCode(code);
  return language.name;
}

function getLanguageCode(name) {
  let language = getLanguageFromName(name);
  return language.code;
}

function getLanguageAsItemForVMFromCode(code) {
  const language = getLanguageFromCode(code);
  return createVMItem(language);
}

function getLanguageAsItemForVMFromName(name) {
  const language = getLanguageFromName(name);
  return createVMItem(language);
}

function getLanguagesAsVMItemsFromNames(languageNames) {
  const languages = languageNames.map(languageName => getLanguageFromName(languageName));
  const vmItems = languages.map(language => createVMItem(language));
  return vmItems;
}

function getLanguagesAsVMItemsFromCodes(codes) {
  const languages = codes.map(code => getLanguageFromName(code));
  const vmItems = languages.map(language => createVMItem(language));
  return vmItems;
}

function getLanguagesAsVMItems(languageList) {
  const vmItems = languageList.map(language => createVMItem(language));
  return vmItems;
}

module.exports = {
  getListAsVM,
  getList,
  getLanguageFromCode,
  getAllLanguagesAsVMItems,
  getLanguageName,
  getLanguageCode,
  getLanguageAsItemForVMFromCode,
  getLanguageAsItemForVMFromName,
  getLanguagesAsVMItemsFromNames,
  getLanguagesAsVMItemsFromCodes,
  getLanguagesAsVMItems,
  normalizeLanguages,
}
