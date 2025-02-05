const openDSU = require("opendsu");
const keyssiSpace = openDSU.loadApi("keyssi");

function GTIN_SSI(arraySSI) {
    const self = this;
    /*arraySSI.getTypeName = () => {
        return SSITypes.WALLET_SSI;
    };*/

    Object.assign(self, arraySSI);

    // this.getIdentifier = (plain) => {
    //     const pskCrypto = require("pskcrypto");
    //     let identifier = arraySSI.getIdentifier(true);
    //     // identifier = identifier.replace("array", "gtin");
    //     return plain ? identifier : pskCrypto.pskBase58Encode(identifier);
    // }
}

function setOptions(gtinSSI){
    if(typeof gtinSSI.options === "undefined"){
        gtinSSI.options = {};
    }
    gtinSSI.options.dsuFactoryType = "const";
}

function createGTIN_SSI(domain, bricksDomain, gtin, batch, expiration, serialNumber) {
    console.log(`New GTIN_SSI in domain:${domain} and bricksDomain:${bricksDomain}`);
    let hint;
    if (typeof bricksDomain !== "undefined") {
        hint = {};
        hint[openDSU.constants.BRICKS_DOMAIN_KEY] = bricksDomain;
        hint = JSON.stringify(hint);
    }
    let realSSI = keyssiSpace.createArraySSI(domain, [gtin, batch], 'v0', hint);

    return realSSI;
}

function parseGTIN_SSI(ssiIdentifier) {
    /*const pskCrypto = require("pskcrypto");
    ssiIdentifier = pskCrypto.pskBase58Decode(ssiIdentifier).toString();
    ssiIdentifier = ssiIdentifier.replace("gtin", "array");
    ssiIdentifier = pskCrypto.pskBase58Encode(ssiIdentifier).toString();
    let realSSI = keyssiSpace.parse(ssiIdentifier);
    let gtinSSI = new GTIN_SSI(realSSI);
    setOptions(gtinSSI);
    return gtinSSI;*/
    return keyssiSpace.parse(ssiIdentifier);
}

module.exports = {
    createGTIN_SSI,
    parseGTIN_SSI
};