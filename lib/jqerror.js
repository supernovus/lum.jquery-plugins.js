const DEFMSG = "Invalid jQuery variable";

class JqError extends Error
{
  constructor(msg=DEFMSG)
  {
    super(msg);
    this.name = this.constructor.name;
  }
}

module.exports = JqError;