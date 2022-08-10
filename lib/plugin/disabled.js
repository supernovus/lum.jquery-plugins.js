module.exports = require('./index').new(
{
  enable()
  {
    //return this.removeAttr('disabled');
    return this.prop('disabled', false);
  },
  enabled()
  {
    return (this.prop('disabled') ? false : true);
  },
  disable()
  {
    //return this.attr('disabled','disabled');
    return this.prop('disabled', true);
  },
  disabled ()
  {
    return this.prop('disabled');
  },
});

