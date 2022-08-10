const {F, needObj} = require('@lumjs/core/types');
const needJq = require('../need_jq');

class Plugin
{
  constructor(methods)
  {
    needObj(methods, 'plugin methods must be an object');
    this.$methods = methods;
    this.$aliases = {};
    this.$backups = {};
  }

  enable($, aliases={})
  {
    needJq($);
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
    needJq($);
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

module.exports = Plugin;
