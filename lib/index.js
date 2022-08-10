const {S} = require('@lumjs/core/types');
const needJq = require('./need_jq');
const Plugin = require('./plugin');

class PluginsManager
{
  constructor(jq)
  {
    needJq(jq);
    this.$jq = jq;
  }

  get(name)
  {
    const plugin = require('./plugin/'+name);
    if (plugin instanceof Plugin)
      return plugin;
    else
      throw new Error("Invalid plugin: "+name);
  }

  enable(...plugins)
  {
    for (const name of plugins)
    {
      if (typeof name !== S)
        throw new TypeError("plugin name must be a string");
      const plugin = this.get(name);
      plugin.enable(this.$jq);
    }
  }

  disable(...plugins)
  {
    for (const name of plugins)
    {
      if (typeof name !== S)
        throw new TypeError("plugin name must be a string");
      const plugin = this.get(name);
      plugin.disable(this.$jq);
    }
  }
  
}

PluginsManager.new = function (jq)
{
  return new PluginsManager(jq);
}

module.exports = PluginsManager;
