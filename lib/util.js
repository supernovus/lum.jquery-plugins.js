const {F, isObj, isNil, root} = require('@lumjs/core/types');
const JqError = require('./jqerror');

function isJq($)
{
  return (typeof $ === F && isObj($.fn));
}

exports.isJq = isJq;

function needJq($)
{
  if (!isJq($))
  {
    throw new JqError();
  }
}

exports.needJq = needJq;

let $jquery = null;

function getDefault()
{
  if (!isJq($jquery))
  { // No jQuery instance has been set or detected yet.
    if (isJq(root.jQuery))
    {
      $jquery = root.jQuery;
    }
    else if (isJq(root.$))
    {
      $jquery = root.$;
    }
  }
  return $jquery;
}

exports.getDefault = getDefault;

function setDefault(jq)
{
  if (isJq(jq))
  {
    $jquery = jq;
  }
  else
  {
    throw new JqError();
  }
}

exports.setDefault = setDefault;

function requireJq($, opts={})
{
  if (isNil($))
  { // Nothing specified, try to get one.
    $ = getDefault();
    if (isNil($) && opts.load)
    { // Try loading node module.
      $ = require('jquery');
    }
  }

  needJq($);

  if (opts.setDef)
  { // We want to set the default now.
    setDefault($);
  }

  return $;
}

exports.requireJq = requireJq;

