const {F, isObj} = require('@lumjs/core/types');

function needJq($)
{
  if (typeof $ !== F || !isObj($.fn))
  {
    throw new Error("Invalid jQuery reference");
  }
}

module.exports = needJq;

