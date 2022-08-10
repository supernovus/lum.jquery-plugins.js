const {JSDOM} = require('jsdom');
const jQuery  = require('jquery');
const Plugins = require('./index.js');

const TEST_DOC = "<html><head><title>Test</title></head><body></body></html>";

function getPlugins(doc=TEST_DOC)
{
  const {window} = new JSDOM(doc);
  return new Plugins(jQuery(window))
}

module.exports = getPlugins;

