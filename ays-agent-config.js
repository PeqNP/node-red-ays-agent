module.exports = function(RED) {
    function AYSAgentConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.server = n.server;
        this.secret = n.secret;
    }
    RED.nodes.registerType("ays-agent-config", AYSAgentConfigNode);
}
