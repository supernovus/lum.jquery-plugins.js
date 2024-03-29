const {F, needObj, def} = require('@lumjs/core/types');
const jqu = require('../util')
const req = jqu.requireJq;

class Plugin
{
  constructor(methods)
  {
    needObj(methods, 'plugin methods must be an object');
    this.$methods = methods;
    this.$aliases = {};
    this.$backups = {};
  }

  enable($, aliases={}, setDef=false)
  {
    $ = req($, setDef);
    needObj(aliases, 'aliases must be an object');

    for (const meth in this.$methods)
    {
      const name = (meth in aliases) ? aliases[meth] : meth;

      if (name !== meth)
      { // Save the aliased name.
        this.$aliases[meth] = name;
      }

      if (typeof $.fn[name] === F)
      { // Backup the current value.
        this.$backups[name] = $.fn[name];
      }
      $.fn[name] = this.$methods[meth];
    }
  }

  disable($)
  {
    $ = req($);
    for (const meth in this.$methods)
    {
      let name = meth;
      if (meth in this.$aliases)
      {
        name = this.$aliases[meth];
        delete this.$aliases[meth];
      }

      if (name in this.$backups)
      {
        $.fn[name] = this.$backups[name];
        delete this.$backups[name];
      }
      else
      {
        delete $.fn[name];
      }
    }
  }

}

Plugin.new = function (methods)
{
  return new Plugin(methods);
}

// A way to query the default from the outside world.
def(Plugin, '$',
{
  get: req,
  set: jqu.setDefault,
});

module.exports = Plugin;
