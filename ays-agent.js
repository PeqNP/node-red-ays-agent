module.exports = function(RED) {
    function AYSAgentNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            var http = require('http');

            var server = env.get("AYS_SERVER").trim();
            var org_secret = env.get("AYS_ORG_SECRET").trim();
            var parent_node = env.get("AYS_PARENT").trim();
            var child_node = env.get("AYS_CHILD").trim();
            var monitor_name = env.get("AYS_MONITOR_NAME").trim();
            var threshold = env.get("AYS_MONITOR_THRESHOLD").trim();
            var heartbeat = env.get("AYS_HEARTBEAT");
            var template = env.get("AYS_TEMPLATE").trim();

            // Set the "error" status of the node
            function set_error(msg, text) {
                var status = ({fill: "red", shape: "ring", text: text});
                msg.payload = status;
                return msg;
            }

            if (server.length == 0) {
                node.error("A global AYS_SERVER variable must be configured");
                return set_error(msg, "AYS_SERVER required");
            }
            if (org_secret.length == 0) {
                node.error("A global AYS_ORG_SECRET must be configured");
                // TODO: Display an error under the node
                return set_error(msg, "AYS_ORG_SECRET required");
            }
            if (parent_node.length == 0) {
                node.error("A parent node must be provided");
                return set_error(msg, "Parent Node is required");
            }
            if (child_node.length == 0) {
                node.error("A child node, or child relative path, must be provided");
                return set_error(msg, "Child Node is required");
            }
            if (monitor_name.length == 0) {
                monitor_name = "node-red";
            }

            var payload = {
                org_secret: org_secret, // "zki8y1v"
                parent: {
                    property: "path",
                    value: parent_node
                },
                relationship: {
                    type: "child",
                    monitor_name: monitor_name,
                    path: child_node
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

            http.post(
                {
                    url: "http://localhost:9443/agent/",
                    form: payload,
                    headers: {
                        "Content-Type: application/json",
                    }
                },
                function (err, response, body) {
                    if err != null {
                        node.error(err)
                    }
                    else {
                        node.log(body)
                    }
                }
            )

            node.send(msg);
        });
    }
    RED.nodes.registerType("ays-agent", AYSAgentNode);
}
