/*
 *
 * Copyright (c) 2006-2009 Sam Collett (http://www.texotela.co.uk)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * The 'selectOptions' method was originally written by Mathias Bank 
 * (http://www.mathias-bank.de).
 *
 * This was based on version 2.2.4, but has been modified by Tim Totten.
 * Just a few of the modifications since bringing this into Lum.js/Nano.js:
 *
 *  - Changing the default value for 'selected' to false.
 *  - Adding quick ability removeOption() to clear select box.
 *  - Refactored for new @lumjs/core library in August 2022.
 *
 */

const {U,O,F,B,S,N,isArray} = require('@lumjs/core/types');

const OPT = 'option';
const SELT = 'select';
const SELD = 'selected';
const ALL = 'all';

module.exports = require('./index').new(
{
 
/**
 * Adds (single/multiple) options to a select box (or series of select boxes)
 *
 * @returns {jQuery}
 * @example  $("#myselect").addOption("Value", "Text"); // add single value (won't be selected)
 * @example  $("#myselect").addOption("Value 2", "Text 2", true); // add single value (will be selected)
 * @example  $("#myselect").addOption({"foo":"bar","bar":"baz"}); // add multiple values, but don't select
 *
 */
addOption()
{
	var add = function(el, v, t, sO)
	{
		var option = document.createElement(OPT);
		option.value = v, option.text = t;
		// get options
		var o = el.options;
		// get number of options
		var oL = o.length;
		if(!el.cache)
		{
			el.cache = {};
			// loop through existing options, adding to cache
			for(var i = 0; i < oL; i++)
			{
				el.cache[o[i].value] = i;
			}
		}
		// add to cache if it isn't already
		if(typeof el.cache[v] == U) el.cache[v] = oL;
		el.options[el.cache[v]] = option;
		if(sO)
		{
			option.selected = true;
		}
	}
	
	var a = arguments;
	if(a.length == 0) return this;
	// select option when added? default is false
	var sO = false;
	// multiple items
	var m = false;
	// other variables
	var items, v, t;
	if(typeof(a[0]) == O)
	{
		m = true;
		items = a[0];
	}
	if(a.length >= 2)
	{
		if(typeof(a[1]) == B) sO = a[1];
		else if(typeof(a[2]) == B) sO = a[2];
		if(!m)
		{
			v = a[0];
			t = a[1];
		}
	}
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != SELT) return;
			if(m)
			{
				for(var item in items)
				{
					add(this, item, items[item], sO);
				}
			}
			else
			{
				add(this, v, t, sO);
			}
		}
	);
	return this;
},

/**
 * Add options via jQuery.getJSON()
 *
 * @returns {jQuery}
 * @param {string} url - Page to get options from (must be valid JSON)
 * @param {object} [params] Any parameters to send with the request
 * @param {boolean} [select=false] Select the added options, default false
 * @param {function} [fn] Call this after completion.
 * @param {Array} [args] Params to pass to `fn`.
 * @example  $("#myselect").ajaxAddOption("myoptions.php");
 * @example  $("#myselect").ajaxAddOption("myoptions.php", {"code" : "007"});
 * @example  $("#myselect").ajaxAddOption("myoptions.php", {"code" : "007"}, false, sortoptions, [{"dir": "desc"}]);
 *
 */
ajaxAddOption(url, params, select, fn, args)
{
	if(typeof(url) != S) return this;
	if(typeof(params) != O) params = {};
	if(typeof(select) != B) select = false;
	this.each(
		function()
		{
			var el = this;
			$.getJSON(url,
				params,
				function(r)
				{
					$(el).addOption(r, select);
					if(typeof fn == F)
					{
						if(typeof args == O)
						{
							fn.apply(el, args);
						} 
						else
						{
							fn.call(el);
						}
					}
				}
			);
		}
	);
	return this;
},

/**
 * Removes an option (by value or index) from a select box (or series of select boxes)
 *
 * @returns {jQuery}
 * @param {(string|RegExp|number)} what - Option to remove.
 * @param {boolean} [selectedOnly=false] Remove only if it has been selected.
 * @example  $("#myselect").removeOption("Value"); // remove by value
 * @example  $("#myselect").removeOption(/^val/i); // remove options with a value starting with 'val'
 * @example  $("#myselect").removeOption(/./); // remove all options
 * @example  $("#myselect").removeOption(/./, true); // remove all options that have been selected
 * @example  $("#myselect").removeOption(0); // remove by index
 * @example  $("#myselect").removeOption(["myselect_1","myselect_2"]); // values contained in passed array
 *
 */
removeOption()
{
	var a = arguments;
	if(a.length == 0)
  { this.each(
      function()
      { this.cache = null;
        this.options.length = 0;
      }
    );
    return this;
  }
	var ta = typeof(a[0]);
	var v, index;
	// has to be a string or regular expression (object in IE, function in Firefox)
	if(ta == S || ta == O || ta == F )
	{
		v = a[0];
		// if an array, remove items
		if(isArray(v))
		{
			var l = v.length;
			for(var i = 0; i<l; i++)
			{
				this.removeOption(v[i], a[1]); 
			}
			return this;
		}
	}
	else if(ta == N) index = a[0];
	else return this;
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != SELT) return;
			// clear cache
			if(this.cache) this.cache = null;
			// does the option need to be removed?
			var remove = false;
			// get options
			var o = this.options;
			if(!!v)
			{
				// get number of options
				var oL = o.length;
				for(var i=oL-1; i>=0; i--)
				{
					if(v.constructor == RegExp)
					{
						if(o[i].value.match(v))
						{
							remove = true;
						}
					}
					else if(o[i].value == v)
					{
						remove = true;
					}
					// if the option is only to be removed if selected
					if(remove && a[1] === true) remove = o[i].selected;
					if(remove)
					{
						o[i] = null;
					}
					remove = false;
				}
			}
			else
			{
				// only remove if selected?
				if(a[1] === true)
				{
					remove = o[index].selected;
				}
				else
				{
					remove = true;
				}
				if(remove)
				{
					this.remove(index);
				}
			}
		}
	);
	return this;
},

/**
 * Sort options (ascending or descending) in a select box (or series of select boxes)
 *
 * @returns {jQuery}
 * @param {boolean} [ascending=true] Sort in ascending order.
 * @example  // ascending
 * $("#myselect").sortOptions(); // or $("#myselect").sortOptions(true);
 * @example  // descending
 * $("#myselect").sortOptions(false);
 *
 */
sortOptions(ascending)
{
	// get selected values first
	var sel = $(this).selectedValues();
	var a = typeof(ascending) == U ? true : !!ascending;
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != SELT) return;
			// get options
			var o = this.options;
			// get number of options
			var oL = o.length;
			// create an array for sorting
			var sA = [];
			// loop through options, adding to sort array
			for(var i = 0; i<oL; i++)
			{
				sA[i] = {
					v: o[i].value,
					t: o[i].text
				}
			}
			// sort items in array
			sA.sort(
				function(o1, o2)
				{
					// option text is made lowercase for case insensitive sorting
					o1t = o1.t.toLowerCase(), o2t = o2.t.toLowerCase();
					// if options are the same, no sorting is needed
					if(o1t == o2t) return 0;
					if(a)
					{
						return o1t < o2t ? -1 : 1;
					}
					else
					{
						return o1t > o2t ? -1 : 1;
					}
				}
			);
			// change the options to match the sort array
			for(var i = 0; i<oL; i++)
			{
				o[i].text = sA[i].t;
				o[i].value = sA[i].v;
			}
		}
	).selectOptions(sel, true); // select values, clearing existing ones
	return this;
},

/*
 * Selects an option by value
 *
 * @returns {jQuery}
 * @param {(string|RegExp|Array)} value - Which options should be selected.
 * @param {boolean} [clear=false] Clear existing selected options.
 * @example  $("#myselect").selectOptions("val1"); // with the value 'val1'
 * @example  $("#myselect").selectOptions(["val1","val2","val3"]); // with the values 'val1' 'val2' 'val3'
 * @example  $("#myselect").selectOptions(/^val/i); // with the value starting with 'val', case insensitive
 *
 */
selectOptions(value, clear=false)
{
	var v = value;
	var vT = typeof(value);
	// handle arrays
	if(vT == O && v.constructor == Array)
	{
		var $this = this;
		$.each(v, function()
			{
      				$this.selectOptions(this, clear);
    			}
		);
	};
	var c = clear || false;
	// has to be a string or regular expression (object in IE, function in Firefox)
	if(vT != S && vT != F && vT != O) return this;
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != SELT) return this;
			// get options
			var o = this.options;
			// get number of options
			var oL = o.length;
			for(var i = 0; i<oL; i++)
			{
				if(v.constructor == RegExp)
				{
					if(o[i].value.match(v))
					{
						o[i].selected = true;
					}
					else if(c)
					{
						o[i].selected = false;
					}
				}
				else
				{
					if(o[i].value == v)
					{
						o[i].selected = true;
					}
					else if(c)
					{
						o[i].selected = false;
					}
				}
			}
		}
	);
	return this;
},

/**
 * Copy options to another select
 *
 * @returns {jQuery}
 * @param {string} to - Element to copy to
 * @param {string} [which] Specifies which options should be copied 
 *   - 'all'
 *   - 'selected' (default)
 * @example  $("#myselect").copyOptions("#myselect2"); // copy selected options from 'myselect' to 'myselect2'
 * @example  $("#myselect").copyOptions("#myselect2", 'selected'); // same as above
 * @example  $("#myselect").copyOptions("#myselect2", 'all'); // copy all options from 'myselect' to 'myselect2'
 *
 */
copyOptions(to, which)
{
	var w = which || SELD;
	if($(to).size() == 0) return this;
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != SELT) return this;
			// get options
			var o = this.options;
			// get number of options
			var oL = o.length;
			for(var i = 0; i<oL; i++)
			{
				if(w == ALL || (w == SELD && o[i].selected))
				{
					$(to).addOption(o[i].value, o[i].text);
				}
			}
		}
	);
	return this;
},

/**
 * Checks if a select box has an option with the supplied value
 *
 * @returns {(boolean|jQuery)}
 * @param {(string|RegExp)} value - Which value to check for.
 * @param {function} [fn] Apply if an option with the given value is found.
 * Use this if you don't want to break the chaining
 * @example  if($("#myselect").containsOption("val1")) alert("Has an option with the value 'val1'");
 * @example  if($("#myselect").containsOption(/^val/i)) alert("Has an option with the value starting with 'val'");
 * @example  $("#myselect").containsOption("val1", copyoption).doSomethingElseWithSelect(); // calls copyoption (user defined function) for any options found, chain is continued
 *
 */
containsOption(value, fn)
{
	var found = false;
	var v = value;
	var vT = typeof(v);
	var fT = typeof(fn);
	// has to be a string or regular expression (object in IE, function in Firefox)
	if(vT != S && vT != F && vT != O) return fT == F ? this: found;
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != SELT) return this;
			// option already found
			if(found && fT != F) return false;
			// get options
			var o = this.options;
			// get number of options
			var oL = o.length;
			for(var i = 0; i<oL; i++)
			{
				if(v.constructor == RegExp)
				{
					if (o[i].value.match(v))
					{
						found = true;
						if(fT == F) fn.call(o[i], i);
					}
				}
				else
				{
					if (o[i].value == v)
					{
						found = true;
						if(fT == F) fn.call(o[i], i);
					}
				}
			}
		}
	);
	return fT == F ? this : found;
},

/**
 * Returns values which have been selected
 *
 * @returns {Array}
 * @example  $("#myselect").selectedValues();
 *
 */
selectedValues()
{
	var v = [];
	this.selectedOptions().each(
		function()
		{
			v[v.length] = this.value;
		}
	);
	return v;
},

/**
 * Returns text which has been selected
 *
 * @returns {Array}
 * @example  $("#myselect").selectedTexts();
 *
 */
selectedTexts()
{
	var t = [];
	this.selectedOptions().each(
		function()
		{
			t[t.length] = this.text;
		}
	);
	return t;
},

/**
 * Returns options which have been selected
 *
 * @returns {jQuery}
 * @example  $("#myselect").selectedOptions();
 *
 */
selectedOptions()
{
	return this.find(`${OPT}:${SELD}`);
},

});
