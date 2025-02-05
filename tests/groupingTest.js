require("../../privatesky/psknode/bundles/testsRuntime");
require("../../gtin-resolver/build/bundles/gtinResolver");

const tir = require("../../privatesky/psknode/tests/util/tir");
const dc = require('double-check');

const assert = require("double-check").assert;
const messages = require("./assets/messages.json")


assert.callback("message grouping test ", (testFinishCallback) => {
  dc.createTestFolder('testFolder', (err, folder) => {
    if (err) {
      assert.true(false, 'Error creating test folder');
      throw err;

    }
    tir.launchApiHubTestNode(1, folder, async function (err, port) {
      if (err) {
        throw err;
      }

      const opendsu = require("opendsu");
      const MessagesPipe = opendsu.loadApi("m2dsu").getMessagesPipe();
      const MessageQueuingService = require("../lib/services").getMessageQueuingServiceInstance();
      let messagesPipe = new MessagesPipe(3, 2 * 1000, MessageQueuingService.getNextMessagesBlock);

      // const persistenceDSU = await $$.promisify(require("opendsu").loadApi("resolver").createSeedDSU)("default");
      // const mappings = require("epi-utils").loadApi("mappings");
      // const holderInfo = {domain: "default", subdomain: "default"};
      // const mappingEngine = mappings.getEPIMappingEngine(persistenceDSU, {
      //     holderInfo: holderInfo,
      //     logService: this.logService
      // });

      // enterpriseMessageQueue.onMessage((message) => {
      //     messagesPipe.addInQueue(message);
      // })
      let i = 0;
      const results = [5, 3, 1];
      messagesPipe.onNewGroup(async (group) => {
        console.log("Message", group.length)
        assert.equal(group.length, results[i]);
        if (i === 2) {
          testFinishCallback();
        }
        i++;

      })

      setTimeout(() => {
        messagesPipe.addInQueue(messages);
      }, 500);

    })
  });

}, 10000)

