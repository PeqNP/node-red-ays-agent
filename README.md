# Node-RED `ays-agent`

This provides an interface to the At Your Service agent from within Node-RED. This is accomplished by adding an `ays-agent` subflow and adding two global environment variables.

## Installation

Please note: The agent has only been tested on Node-RED v3.1.6.

### Install the Subflow

There are two ways to install the `ays-agent` subflow.

**1. Node-RED**

- Open Node-RED
- Top right menu button > `Settings` > `Palette` > (tab) `Install`
- Search for the `bithead/node-red-ays-agent` module
- Install

**2. NPM**

- Open a terminal
- Change directory to the Node-RED config directory (e.g. `cd ~/.node-red`)
- Install module using NPM `npm install @bithead/node-red-ays-agent`

## Usage

Drag the `ays-agent` node into your flow. It should be located in the `network` category.

Connect any of your HW/SW systems to the `ays-agent` input. The input must be a numeric value.

**Parameters:**

- `Config` global configuration that can be used by an `ays-agent` node instance
  - `Server` the location to the AYS Agent Service endpoint
  - `Org Secret` the respective secret for the organization node sending samples to
  - `Parent` (optional) the path to the parent node. Set this value if you intend to use the same parent for all agents.
- `Parent Node` the path to the parent node. Your child lives under this node. Leave this empty to use the `Config.Parent Node` value. Otherwise, it will override the value.
- `Child Node` The name of the child node. Please use the character range `[a-z0-9]`, or the hyphen (`-`) character, where the first character in the name is a letter. e.g. `my-node-01`
- `Monitor Name` (optional) The name of the monitor. If none is provided, `node-red` is used.
- `Threshold` (optional) Trigger a threshold if a value falls outside of specified range. Refer to the [ays-agent API docs](https://github.com/PeqNP/ays-agent/blob/main/docs/api.md#--value-threshold-optional) for a list of supported threshold formats.
- `Heartbeat` (optional) The default is set for 5 minutes. If you don't want to monitor the node, set the heartbeat value to `0`.
- `Template` (optional) Adopt a template located at the specified node path.

## Debugging

The `ays-agent` subflow emits `node.error`s messages (which can be seen in the Debug panel) _and_ provides node status messages hints that display under the `ays-agent` subflow instance. If an node status is displayed, please open the Debug menu for more information.

The most common problems are:

- A required parameter is not provided
- Connection to the AYS server failed

## Help

Do you need help configuring the agent? Do you have a feature suggestion? If so, please call me at 253-329-1280.
