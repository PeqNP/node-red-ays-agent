/**
 Copyright 2024 Bithead LLC. All rights reserved.

 MIT License
 */

module.exports = function(RED) {
    function AYSAgentNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var cfg = RED.nodes.getNode(config.config);
        var server = cfg.server;
        var orgSecret = cfg.secret;
        var parentNode = config.parent || cfg.parent;
        var childNode = config.child;
        var monitorName = config.monitor;
        var threshold = config.threshold;
        var heartbeat = parseInt(config.heartbeat) || 0;
        var template = config.template;

        node.on('input', function(msg, send, done) {
            const axios = require('axios');

            // Set the "error" status of the node
            function setError(text) {
                node.error(text);
                node.status({fill: "red", shape: "ring", text: text});
                node.send(null);
                done();
            }

            if (server.length == 0) {
                return setError("Server is required");
            }
            if (orgSecret.length == 0) {
                return setError("Org secret is required");
            }
            if (parentNode.length == 0) {
                return setError("Parent node is required");
            }
            if (childNode.length == 0) {
                return setError("Child node is required");
            }
            if (monitorName.length == 0) {
                monitorName = "node-red";
            }

            var payload = {
                org_secret: orgSecret,
                parent: {
                    property: "path",
                    value: parentNode
                },
                relationship: {
                    type: "child",
                    monitor_name: monitorName,
                    path: childNode
                },
                value: {
                    name: "value",
                    value: msg.payload
                },
                check: true
            };

            if (threshold.length > 0) {
                payload.value.threshold_format = threshold;
            }

            if (template.length != 0) {
                payload.template = template;
            }

            if (heartbeat > 0) {
                payload.heartbeat = {
                    "timeout": heartbeat,
                    "level": "critical"
                }
            }

            headers = {
                "Content-Type": "application/json"
            };

            axios.post(server, payload, {headers: headers})
                .then(function (response) {
                    node.status({fill: "green", shape: "dot"});
                })
                .catch(function (error) {
                    node.error(error)
                    try {
                        var err_msg = error.response.data.error.message;
                        node.status({fill: "red", shape: "ring", text: err_msg});
                    } catch (err) {
                        console.log(JSON.stringify(error, null, 4));
                        if (error.code == "ECONNREFUSED") {
                            node.status({fill: "red", shape: "ring", text: "Connection refused to " + server});
                        }
                        else {
                            node.status({fill: "red", shape: "ring", text: error});
                        }
                    }
                })
                .finally(function() {
                    node.send(msg);
                    done();
                });
        });
    }
    RED.nodes.registerType("ays-agent", AYSAgentNode);
}
