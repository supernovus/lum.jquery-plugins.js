const {S,def} = require('@lumjs/core/types');
const jqu = require('./util');
const JqError = require('./jqerror');
const Plugin = require('./plugin');

class PluginsManager
{
  constructor(jq, opts={})
  {    
    this.$ = jqu.requireJq(jq, opts.setDefault);
  }

  get(name)
  {
    const plugin = require('./plugin/'+name);
    if (plugin instanceof Plugin)
      return plugin;
    else
      throw new JqError("Invalid plugin: "+name);
  }

  enable(...plugins)
  {
    for (const name of plugins)
    {
      if (typeof name !== S)
        throw new TypeError("plugin name must be a string");
      const plugin = this.get(name);
      plugin.enable(this.$);
    }
  }

  disable(...plugins)
  {
    for (const name of plugins)
    {
      if (typeof name !== S)
        throw new TypeError("plugin name must be a string");
      const plugin = this.get(name);
      plugin.disable(this.$);
    }
  }
  
}

PluginsManager.new = function (jq)
{
  return new PluginsManager(jq);
}

// A way to query the default from the outside world.
def(PluginsManager, '$',
{
  get: jqu.getDefault,
  set: jqu.setDefault,
});

module.exports = PluginsManager;
