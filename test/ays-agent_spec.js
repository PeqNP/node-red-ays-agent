// vim: tabstop=2 shiftwidth=2 softtabstop=2 expandtab

var helper = require("node-red-node-test-helper");
var aysAgent = require("../ays-agent.js");

describe("ays-agent Node", function () {

  afterEach(function () {
    helper.unload();
  });

  it("should be loaded", function (done) {
    var flow = [{ id: "n1", type: "ays-agent", name: "test name" }];
    helper.load(aysAgent, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property("name", "test name");
      done();
    });
  });

  it("should return null", function (done) {
    var flow = [
      {id: "n1", type: "ays-agent", name: "test name", wires: [["n2"]]},
      {id: "n2", type: "helper"}
    ];
    helper.load(aysAgent, flow, function () {
      var n1 = helper.getNode("n1");
      var n2 = helper.getNode("n2");
      n2.on("input", function (msg) {
        console.log("HELLO");
        msg.should.have.property("payload", 30);
        done();
      });
      n1.receive({ payload: 30 });
      done();
    }).catch(done);
  });
});
