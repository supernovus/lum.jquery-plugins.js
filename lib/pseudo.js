const td = require('@lumjs/tests-dom');
const Plugins = require('./index.js');

const TEST_DOC = "<html><head><title>Test</title></head><body></body></html>";

function getPlugins(doc=TEST_DOC)
{
  return new Plugins(td.getJQuery(doc));
}

module.exports = getPlugins;

