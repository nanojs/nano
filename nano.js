/*
 *  nano JavaScript framework v1.0
 *  http://nanojs.org
 *
 *  Copyright (c) 2008-2015 James Watts
 *  https://github.com/jameswatts
 *
 *  This is FREE software, licensed under the GPL
 *  http://www.gnu.org/licenses/gpl.html
 */

;var nano = function nano(obj) {
	if (obj) {
		if (this instanceof nano) {
			var A = (this.args = nano.args());
			this.nano = true;
			this.node = (nano.isset(A.tag))? new nano.node(A.tag, A.ns) : {};
			if (typeof A.id === 'string') this.node.id = A.id;
			if (typeof A.title === 'string') this.node.title = A.title;
			if (nano.equal(nano.raw, A.tag).length < 1 && typeof A.css === 'string') this.node.className = A.css;
			nano.attr.call(this, A.attr, A.ns);
			nano.evts.call(this, A.evt);
			if (A.tag && (A.tag === 'title' || A.tag === 'meta' || A.tag === 'style' || A.tag === 'link' || A.tag === 'base')) {
				nano.head().add(this.node);
			} else {
				nano.extend(this, A);
				if (A.style) this.style(A.style);
				if (nano.isset(A.parent)) nano.add(this.node, (A.parent.node)? A.parent.node : A.parent);
			}
		} else if (typeof obj === 'function') {
			if (window.addEventListener) {
				window.addEventListener('load', obj, false);
			} else if (window.attachEvent) {
				window.attachEvent('onload', obj);
			} else if (typeof window.onload === 'function') {
				var onload = window.onload;
				window.onload = function() {
					onload();
					obj();
				};
			} else {
				window.onload = obj;
			}
			return true;
		} else {
			if (!obj.nano) {
				obj = (typeof obj === 'string')? document.getElementById(obj) : obj;
				if (obj !== null) {
					var node = {nano: true, node: obj};
					nano.extend(node);
					return node;
				}
				return false;
			}
			return obj;
		}
	} else {
		return false;
	}
};
nano.ver = '1.0';
nano.args = function _args(i) {
	return arguments.callee.caller.arguments[i || 0] || {};
};
nano.time = function _time() {
	return (new Date()).getTime();
};
nano.isset = function _isset(val) {
	return (typeof val !== 'undefined' && val !== null);
};
nano.empty = function _empty(val) {
	if (this.type(val) === 'array') return !(val.length > 0);
	if (this.type(val) === 'object') {
		var i = 0, j;
		for (j in val) i++;
		return !(i > 0);
	}
	if (typeof val === 'string') return (val == '' || /^(\s+)$/.test(val));
	if (typeof val === 'number') return (val == 0);
	return (typeof val === 'undefined' || val === null);
};
nano.type = function _type(val) {
	var type = typeof val;
	if (type === 'object') {
		if (val === null) {
			return 'null';
		} else if (val.constructor.toString().match(/regexp/i) !== null) {
			return 'regexp';
		} else if (typeof val.length !== 'undefined' && val.constructor.toString().match(/array/i) !== null) {
			return 'array';
		}
	} else if (type === 'number' && isNaN(val)) {
		return 'NaN';
	}
	return type;
};
nano.equal = function _equal(obj, val) {
	obj = obj || [];
	var i, count = [];
	for (i = 0; i < obj.length; i++) {
		if (obj[i] == val) count.push(obj[i]);
	}
	return count;
};
nano.count = function _count(val) {
	switch (this.type(val)) {
		case 'string':
			return val.length;
		case 'number':
			return val;
		case 'object':
			var i, j = 0;
			for (i in val) j++;
			return j;
		case 'array':
			return val.length;
		case 'regexp':
			return 1;
		default:
			return 0;
	}
};
nano.uniq = function _uniq(len) {
	len = len || 32;
	var rand = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], id = '';
	for (var i = 0; i < len; i++) id += rand[this.rand(0, rand.length-1)][(Math.random() > 0.5)? 'toUpperCase' : 'toLowerCase']();
	return id;
};
nano.rand = function _rand(min, max) {
	min = min || 0, max = max || 9;
	return (Math.floor(Math.random()*(max-min))+min);
};
nano.limit = function _limit(val, min, max) {
	min = min || 0, max = max || 9;
	return (Math.min(Math.max(min, val), max));
};
nano.join = function _join(objs, obj, deep) {
	if (this.type(objs) === 'array') {
		obj = obj || {};
		var len = objs.length, i, j, p, list;
		for (i = 0; i < len; i++) {
			for (p in objs[i]) {
				if (this.type(objs[i][p]) === 'array' && deep) {
					obj[p] = {};
					list = [];
					for (j = 0; j < len; j++) {
						if (objs[j][p]) list.push(objs[j][p]);
					}
					obj[p] = this.join(list, obj[p], deep);
				} else {
					if (objs[i][p] === null || this.type(objs[i][p]) !== 'object') obj[p] = objs[i][p];
				}
			}
		}
		return obj;
	}
	return false;
};
nano.each = function _each(obj, fn, scope) {
	if (typeof fn === 'function') {
		if (this.type(obj) === 'array') {
			for (var i = 0; i < obj.length; i++) fn.call(scope || window, obj[i], i);
			return true;
		} else if (this.type(obj) === 'object') {
			for (var j in obj) fn.call(scope || window, obj[j], j);
			return true;
		}
	}
	return false;
};
nano.proxy = function _proxy(fn, obj) {
	return function() { return fn.apply(obj, arguments); };
};
nano.style = function _style(obj, style) {
	if (obj.nano) obj = obj.node;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		return document.defaultView.getComputedStyle(obj, '').getPropertyValue(style);
	} else if (obj.currentStyle) {
		return obj.currentStyle[style.replace(/\-(\w)/g, function(match, val) { return val.toUpperCase(); })];
	}
	return false;
};
nano.raw = ['html', 'head', 'body', 'title', 'meta', 'script', 'style', 'link', 'base', 'object', 'param', 'noscript', 'noframes'];
nano.nodes = {
	script: function _script() {
		this.node.type = this.args.type || 'text/javascript';
		if (nano.isset(this.args.src)) this.node.src = this.args.src;
		if (nano.isset(this.args.text)) this.node.text = this.args.text;
	},
	style: function _style(A) {
		this.node.type = this.args.type || 'text/css';
		if (nano.isset(this.args.text)) this.node.text = this.args.text;
	},
	link: function _link() {
		this.node.href = this.args.href || '';
		this.node.type = this.args.type || 'text/css';
		this.node.rel = this.args.rel || 'stylesheet';
		this.node.media = this.args.media || 'all';
	},
	div: function _div() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	span: function _span() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	pre: function _pre() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	code: function _code() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	h1: function _h1() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	h2: function _h2() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	h3: function _h3() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	h4: function _h4() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	h5: function _h5() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	h6: function _h6() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	p: function _p() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	q: function _q() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	a: function _a() {
		if (nano.isset(this.args.name)) this.node.name = this.args.name;
		if (nano.isset(this.args.href)) this.node.href = this.args.href;
		if (nano.isset(this.args.target)) this.node.target = this.args.target;
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	b: function _b() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	i: function _i() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	strong: function _strong() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	em: function _em() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	big: function _big() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	small: function _small() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	ins: function _ins() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	del: function _del() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	sub: function _sub() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	sup: function _sup() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	img: function _img() {
		if (nano.isset(this.args.name)) this.node.name = this.args.name;
		if (nano.isset(this.args.src)) this.node.src = this.args.src;
		if (nano.isset(this.args.alt)) this.node.alt = this.args.alt;
		if (nano.isset(this.args.usemap)) this.node.usemap = this.args.usemap;
	},
	map: function _map() {
		if (nano.isset(this.args.name)) this.node.name = this.args.name;
	},
	area: function _area() {
		this.node.shape = this.args.shape || 'rect';
		this.node.coords = this.args.coords || '0,0,0,0';
		if (nano.isset(this.args.href)) this.node.href = this.args.href;
		if (nano.isset(this.args.alt)) this.node.alt = this.args.alt;
	},
	frameset: function _frameset() {
		if (nano.isset(this.args.frameborder)) this.node.frameborder = this.args.frameborder;
		this.node.rows = (nano.isset(this.args.rows))? this.args.rows : 1;
		this.node.cols = (nano.isset(this.args.cols))? this.args.cols : 1;
	},
	frame: function _frame() {
		if (nano.isset(this.args.name)) this.node.name = this.args.name;
		this.node.src = this.args.src || '';
		if (nano.isset(this.args.frameborder)) this.node.frameborder = this.args.frameborder;
		if (nano.isset(this.args.marginwidth)) this.node.marginwidth = this.args.marginwidth;
		if (nano.isset(this.args.marginheight)) this.node.marginheight = this.args.marginheight;
		if (nano.isset(this.args.scrolling)) this.node.scrolling = this.args.scrolling;
		this.win = function win() { return this.node.contentWindow; };
		this.doc = function doc() { return this.node.contentDocument; };
		this.head = function head() { return nano(this.node.contentDocument.getElementsByTagName('head')[0]); };
		this.body = function body() { return nano(this.node.contentDocument.getElementsByTagName('body')[0]); };
	},
	iframe: function _iframe() {
		if (nano.isset(this.args.name)) this.node.name = this.args.name;
		this.node.src = this.args.src || '';
		if (nano.isset(this.args.frameborder)) this.node.frameborder = this.args.frameborder;
		if (nano.isset(this.args.marginwidth)) this.node.marginwidth = this.args.marginwidth;
		if (nano.isset(this.args.marginheight)) this.node.marginheight = this.args.marginheight;
		if (nano.isset(this.args.scrolling)) this.node.scrolling = this.args.scrolling;
		this.win = function win() { return this.node.contentWindow; };
		this.doc = function doc() { return this.node.contentDocument; };
		this.head = function head() { return nano(this.node.contentDocument.getElementsByTagName('head')[0]); };
		this.body = function body() { return nano(this.node.contentDocument.getElementsByTagName('body')[0]); };
	},
	label: function _label() {
		if (nano.isset(this.args['for'])) this.node['for'] = this.args['for'];
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	form: function _form() {
		if (nano.isset(this.args.name)) this.node.name = this.args.name;
		if (nano.isset(this.args.method)) this.node.method = this.args.method;
		if (nano.isset(this.args.action)) this.node.action = this.args.action;
		if (nano.isset(this.args.enctype)) this.node.enctype = this.args.enctype;
	},
	fieldset: function _fieldset() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	legend: function _legend() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	button: function _button() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	select: function _select() {
		if (nano.isset(this.args.name)) this.node.name = this.args.name;
		if (nano.isset(this.args.multiple)) this.node.multiple = this.args.multiple;
		nano.opts.call(this, this.args.opt);
	},
	option: function _option() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
		if (nano.isset(this.args.value)) this.node.value = this.args.value;
	},
	textarea: function _textarea() {
		if (nano.isset(this.args.name)) this.node.name = this.args.name;
		if (nano.isset(this.args.cols)) this.node.cols = this.args.cols;
		if (nano.isset(this.args.rows)) this.node.rows = this.args.rows;
		if (nano.isset(this.args.readonly)) this.node.readonly = this.args.readonly;
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	input: function _input() {
		if (nano.isset(this.args.name)) this.node.name = this.args.name;
		this.node.type = this.args.type || 'text';
		this.node.value = (nano.isset(this.args.text))? this.args.text : '';
	},
	li: function _li() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	dt: function _dt() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	dd: function _dd() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	caption: function _caption() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
	},
	table: function _table() {
		if (nano.isset(this.args.cellpadding)) this.node.cellpadding = this.args.cellpadding;
		if (nano.isset(this.args.cellspacing)) this.node.cellspacing = this.args.cellspacing;
	},
	th: function _th() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
		if (nano.isset(this.args.colspan)) this.node.colspan = this.args.colspan;
		if (nano.isset(this.args.rowspan)) this.node.rowspan = this.args.rowspan;
	},
	td: function _td() {
		if (nano.isset(this.args.text)) this.node.innerHTML = this.args.text;
		if (nano.isset(this.args.colspan)) this.node.colspan = this.args.colspan;
		if (nano.isset(this.args.rowspan)) this.node.rowspan = this.args.rowspan;
	},
	object: function _object() {
		if (nano.isset(this.args.name)) this.node.name = this.args.name;
		this.node.classid = this.args.classid || 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
		this.node.codebase = this.args.codebase || 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,115,0';
		this.node.codetype = this.args.codetype || '';
	},
	param: function _param() {
		this.node.name = (nano.isset(this.args.name))? this.args.name : '';
		if (nano.isset(this.args.text)) this.node.value = this.args.text;
		if (nano.isset(this.args.type)) this.node.type = this.args.type;
		if (nano.isset(this.args.valuetype)) this.node.valuetype = this.args.valuetype;
	}
};
nano.attr = function _attr(attr, ns) {
	if (this.node.nodeName && typeof nano.nodes[this.node.nodeName.toLowerCase()] === 'function') nano.nodes[this.node.nodeName.toLowerCase()].call(this);
	if (nano.type(attr) === 'object') {
		var a;
		if (typeof ns === 'string') {
			for (a in attr) this.node.setAttributeNS(ns, a, attr[a]);
		} else {
			for (a in attr) this.node[a] = attr[a];
		}
		return true;
	}
	return false;
};
nano.opts = function _opts(opt) {
	if (nano.type(opt) === 'object') {
		var o, grp, node, i;
		for (o in opt) {
			if (o === 'grp') {
				grp = nano.node('optgroup');
				grp.label = opt[o].lbl;
				this.node.appendChild(grp);
				for (i = 0; i < opt[o].opt.length; i++) {
					node = nano.node('option');
					node.value = opt[o].val;
					node.text = opt[o].text;
					grp.appendChild(node);
				}
			} else {
				node = nano.node('option');
				node.value = opt[o].val;
				node.text = opt[o].text;
				this.node.options.add(node, (navigator.appName.toLowerCase() == 'microsoft internet explorer')? undefined : null);
			}
		}
		this.options = opt;
		return true;
	}
	return false;
};
nano.evts = function _evts(evt) {
	if (nano.type(evt) === 'object') {
		for (var e in evt) this.node['on' + e] = evt[e];
		this.events = evt;
		return true;
	}
	return false;
};
nano.def = {
	x: function _x() {
		return (this.node.getBoundingClientRect)? ((navigator.appName.toLowerCase() == 'microsoft internet explorer')? this.node.getBoundingClientRect().left-document.documentElement.clientLeft : this.node.getBoundingClientRect().left) : this.node.offsetLeft;
	},
	y: function _y() {
		return (this.node.getBoundingClientRect)? ((navigator.appName.toLowerCase() == 'microsoft internet explorer')? this.node.getBoundingClientRect().top-document.documentElement.clientTop : this.node.getBoundingClientRect().top) : this.node.offsetTop;
	},
	w: function _w(cmp) {
		return (cmp)? parseInt(nano.style(this, 'width'), 10) : this.node.offsetWidth;
	},
	h: function _h(cmp) {
		return (cmp)? parseInt(nano.style(this, 'height'), 10) : this.node.offsetHeight;
	},
	moveTo: function _moveTo(x, y) {
		this.css.position = 'absolute';
		if (typeof x === 'number' && !isNaN(x)) this.css.left = x + 'px';
		if (typeof y === 'number' && !isNaN(y)) this.css.top = y + 'px';
		return this;
	},
	moveBy: function _moveBy(x, y) {
		this.css.position = 'absolute';
		if (typeof x === 'number' && !isNaN(x)) this.css.left = (this.node.offsetLeft+x) + 'px';
		if (typeof y === 'number' && !isNaN(y)) this.css.top = (this.node.offsetTop+y) + 'px';
		return this;
	},
	resizeTo: function _resizeTo(w, h) {
		if (typeof w === 'number' && !isNaN(w)) this.css.width = w + 'px';
		if (typeof h === 'number' && !isNaN(h)) this.css.height = h + 'px';
		return this;
	},
	resizeBy: function _resizeBy(w, h) {
		if (typeof w === 'number' && !isNaN(w)) this.css.width = (this.node.offsetWidth+w) + 'px';
		if (typeof h === 'number' && !isNaN(h)) this.css.height = (this.node.offsetHeight+h) + 'px';
		return this;
	},
	visible: function _visible() {
		return (nano.style(this, 'display') !== 'none' && nano.style(this, 'visibility') !== 'hidden');
	},
	show: function _show(css) {
		this.css.display = css || 'block';
		return this;
	},
	hide: function _hide(css) {
		this.css.display = css || 'none';
		return this;
	},
	toggle: function _toggle(css) {
		this[(this.visible())? 'hide' : 'show'](css);
		return this;
	},
	focus: function _focus() {
		this.node.focus();
		return this;
	},
	blur: function _blur() {
		this.node.blur();
		return this;
	},
	disable: function _disable(val) {
		this.node.disabled = (val)? true : false;
		return this;
	},
	check: function _check(val) {
		this.node.checked = (val)? true : false;
		return this;
	},
	select: function _select(val) {
		this.node.selectedIndex = val;
		return this;
	},
	disabled: function _disabled() {
		return this.node.disabled;
	},
	checked: function _checked() {
		return this.node.checked;
	},
	selected: function _selected() {
		return (this.tag() === 'select')? nano(this.node.options[this.node.selectedIndex]) : null;
	},
	opacity: function _opacity(val) {
		if (arguments.length < 1) return (navigator.appName.toLowerCase() == 'microsoft internet explorer')? ((nano.isset(this.node.filters) && nano.isset(this.node.filters.alpha))? this.node.filters.alpha.opacity/100 : 1) : parseFloat(nano.style(this.node, 'opacity'));
		(navigator.appName.toLowerCase() == 'microsoft internet explorer')? this.css.filter = 'alpha(opacity=' + (val*100) + ')' : this.css.opacity = val;
		return this;
	},
	hasClass: function _hasClass(css) {
		return (this.node.className.indexOf(css) !== -1)? true : false;
	},
	addClass: function _addClass(css, force) {
		if (force || !this.hasClass(css)) this.node.className += ' ' + css;
		return this;
	},
	delClass: function _delClass(css) {
		if (this.node.className.indexOf(css) !== -1) this.node.className = this.node.className.replace(css, '');
		return this;
	},
	toggleClass: function _toggleClass(css) {
		this[((this.hasClass(css))? 'del' : 'add') + 'Class'](css);
		return this;
	},
	style: function _style(obj) {
		if (nano.type(obj) === 'object') {
			for (var prop in obj) this.css[prop] = obj[prop];
		}
		return this;
	},
	attr: function _attr(obj, ns) {
		if (nano.type(obj) === 'object') {
			var p;
			if (typeof ns === 'string') {
				for (p in obj) this.node.setAttributeNS(ns, p, obj[p]);
			} else {
				for (p in obj) this.node[p] = obj[p];
			}
			return this;
		}
		return false;
	},
	evt: function _evt(obj) {
		if (nano.type(obj) === 'object') {
			for (var e in obj) this.node['on' + e] = obj[e];
			return this;
		}
		return false;
	},
	at: function _at(i, val) {
		return (this.get().charAt(i || 0) === val);
	},
	has: function _has(val) {
		return (this.get().indexOf(val) !== -1);
	},
	get: function _get(attr) {
		return (typeof attr === 'string')? this.node[attr] : this.node[(nano.isset(this.node.value) && this.tag() !== 'li' && this.tag() !== 'button')? 'value' : 'innerHTML'];
	},
	set: function _set(val, mode) {
		switch (mode) {
			case 'after':
				this.node[(nano.isset(this.node.value) && this.tag() !== 'li' && this.tag() !== 'button')? 'value' : 'innerHTML'] = this.get() + val;
				break;
			case 'before':
				this.node[(nano.isset(this.node.value) && this.tag() !== 'li' && this.tag() !== 'button')? 'value' : 'innerHTML'] = val + this.get();
				break;
			default:
				this.node[(nano.isset(this.node.value) && this.tag() !== 'li' && this.tag() !== 'button')? 'value' : 'innerHTML'] = val;
		}
		return this;
	},
	trim: function _trim(mode) {
		switch (mode) {
			case 'left':
				return this.set(this.get().replace(/^\s+/, ''));
			case 'right':
				return this.set(this.get().replace(/\s+$/, ''));
			default:
				return this.set(this.get().replace(/^\s+|\s+$/g, ''));
		}
	},
	empty: function _empty() {
		while (this.node.hasChildNodes()) this.node.removeChild(this.node.firstChild);
		return this;
	},
	find: function _find(attr, val, deep) {
		return nano.find(attr, val, deep, this.node);
	},
	tag: function _tag() {
		return this.node.nodeName.toLowerCase();
	},
	parent: function _parent() {
		return nano(this.node.parentNode);
	},
	children: function _children() {
		var nodes = [];
		for (var i = 0; i < this.node.childNodes.length; i++) {
			if (this.node.childNodes[i].nodeType < 2) nodes.push(nano(this.node.childNodes[i]));
		}
		return nodes;
	},
	first: function _first() {
		var nodes = this.children();
		return (nodes.length > 0)? nodes[0] : null;
	},
	last: function _last() {
		var nodes = this.children();
		return (nodes.length > 0)? nodes[nodes.length-1] : null;
	},
	adjacent: function _adjacent() {
		return this.parent().children();
	},
	prev: function _prev() {
		var node = this.node;
		do {
			node = node.previousSibling;
			if (!node) return this;
		} while (node.nodeType > 1);
		return nano(node);
	},
	next: function _next() {
		var node = this.node;
		do {
			node = node.nextSibling;
			if (!node) return this;
		} while (node.nodeType > 1);
		return nano(node);
	},
	add: function _add(obj) {
		if (nano.type(obj) === 'array') {
			for (var i = 0; i < obj.length; i++) this.node.appendChild((obj.nano)? obj.node : obj);
			return this;
		} else if (typeof obj.tag === 'string') {
			obj.parent = this;
			return new nano(obj);
		}
		return (obj)? nano(this.node.appendChild((obj.nano)? obj.node : obj)) : false;
	},
	before: function _before(obj) {
		if (obj.nano) obj = obj.node;
		return nano(this.node.parentNode.insertBefore(obj, this.node));
	},
	after: function _after(obj) {
		if (obj.nano) obj = obj.node;
		return (this.next().node === this.node)? this.node.parentNode.appendChild(obj) : nano(this.node.parentNode.insertBefore(obj, this.next().node));
	},	
	clone: function _clone() {
		return nano(this.node.cloneNode(true));
	},
	del: function _del() {
		return nano.del(this.node);
	},
	submit: function _submit() {
		return (this.tag() === 'form')? (typeof this.node.onsubmit === 'function')? this.node.onsubmit() : this.node.submit() : false;
	},
	reload: function _reload() {
		return (this.tag() === 'iframe' || this.tag() === 'frame')? this.node.src = this.node.src : false;
	},
	win: function _win() {
		return (this.tag() === 'iframe' || this.tag() === 'frame')? this.node.contentWindow : false;
	},
	doc: function _doc() {
		return (this.tag() === 'iframe' || this.tag() === 'frame')? this.node.contentDocument : false;
	},
	head: function _head() {
		return (this.tag() === 'iframe' || this.tag() === 'frame')? nano(this.doc().getElementsByTagName('head')[0]) : false;
	},
	body: function _body() {
		return (this.tag() === 'iframe' || this.tag() === 'frame')? nano(this.doc().getElementsByTagName('body')[0]) : false;
	}
};
nano.extend = function _extend(obj, args) {
	if (obj.nano) {
		for (var fn in this.def) obj[fn] = this.def[fn];
		obj.css = obj.node.style;
		if (this.isset(args)) {
			for (var arg in this.ext) {
				if (this.isset(args[arg])) this.ext[arg].call(obj, args[arg]);
			}
		}
	}
};
nano.ext = {};
nano.reg = function _reg(obj) {
	if (obj) {
		for (var prop in obj) this.ext[prop] = (typeof obj[prop] === 'function')? obj[prop] : null;
		return true;
	}
	return false;
};
nano.plugin = function _plugin(obj, fn) {
	if (obj) {
		for (var prop in obj) this.def[prop] = obj[prop];
	}
	return (typeof fn === 'function')? fn.call(this) : true;
};
nano.find = function _find(attr, val, deep, node, obj) {
	try {
		if (!this.isset(node)) node = document;
		if (node.nano) node = node.node;
		if (!this.isset(obj)) {
			obj = [];
			obj.node = node;
			obj.attr = attr;
			obj.val = val;
			obj.add = function _add(obj, val, deep) {
				if (typeof obj === 'string' && typeof val !== 'undefined') {
					var nodes = nano(this.node).find(obj, val, deep);
					for (var i = 0; i < nodes.length; i++) this.push(nodes[i]);
				} else if (nano.type(obj) === 'array') {
					for (var i = 0; i < obj.length; i++) this.push((obj[i].nano)? obj[i] : nano(obj[i]));
				} else {
					this.push((obj.nano)? obj : nano(obj));
				}
				return this;
			};
			obj.first = function _first() {
				return (this.length > 0 && typeof this[0] !== 'undefined')? this[0] : null;
			};
			obj.last = function _last() {
				return (this.length > 0 && typeof this[this.length-1] !== 'undefined')? this[this.length-1] : null;
			};
			obj.each = function _each(fn, exit) {
				if (typeof fn === 'function') {
					var exit = (arguments.length < 2)? null : exit, i, out;
					for (i = 0; i < this.length; i++) {
						out = fn.call(this[i], this, i);
						if (out === exit) break;
					}
				}
				return this;
			};
		}
		var i;
		if (attr === 'tag') {
			for (i = 0; i < node.childNodes.length; i++) {
				if ((val instanceof RegExp && val.test(node.childNodes[i].nodeName)) || node.childNodes[i].nodeName.toLowerCase() === val) obj.push(this(node.childNodes[i]));
				if (deep && node.childNodes[i].childNodes.length > 0) this.find(attr, val, deep, node.childNodes[i], obj);
			}
		} else if (attr === 'css' || attr === 'class') {
			for (i = 0; i < node.childNodes.length; i++) {
				if (node.childNodes[i].className) {
					if ((val instanceof RegExp && val.test(node.childNodes[i].className)) || node.childNodes[i].className.indexOf(val) !== -1) obj.push(this(node.childNodes[i]));
				}
				if (deep && node.childNodes[i].childNodes.length > 0) this.find(attr, val, deep, node.childNodes[i], obj);
			}
		} else if (attr === 'style' && this.type(val) === 'array' && val.length === 2) {
			for (i = 0; i < node.childNodes.length; i++) {
				if (node.childNodes[i].style) {
					if (node.childNodes[i].style[val[0]] && ((val instanceof RegExp && val.test(node.childNodes[i].style[val[0]])) || node.childNodes[i].style[val[0]] === val[1])) obj.push(this(node.childNodes[i]));
				}
				if (deep && node.childNodes[i].childNodes.length > 0) this.find(attr, val, deep, node.childNodes[i], obj);
			}
		} else if (attr === 'text') {
			var type;
			for (i = 0; i < node.childNodes.length; i++) {
				type = (nano.isset(node.childNodes[i].value) && node.childNodes[i].nodeName.toLowerCase() !== 'li' && node.childNodes[i].nodeName.toLowerCase() !== 'button')? 'value' : 'innerHTML';
				if ((val instanceof RegExp && val.test(node.childNodes[i][type])) || node.childNodes[i][type].indexOf(val) !== -1) obj.push(this(node.childNodes[i]));
				if (deep && node.childNodes[i].childNodes.length > 0) this.find(attr, val, deep, node.childNodes[i], obj);
			}
		} else {
			for (i = 0; i < node.childNodes.length; i++) {
				if (node.childNodes[i][attr] && ((val instanceof RegExp && val.test(node.childNodes[i][attr])) || node.childNodes[i][attr] === val)) obj.push(this(node.childNodes[i]));
				if (deep && node.childNodes[i].childNodes.length > 0) this.find(attr, val, deep, node.childNodes[i], obj);
			}
		}
		return obj;
	} catch(e) {
		return false;
	}
};
nano.add = function _add(obj, parent) {
	if (obj.nano) obj = obj.node;
	return (obj)? (parent === 'body')? this.body().add(obj) : (parent === 'head')? this.head().add(obj) : (parent.nano)? parent.node.appendChild(obj) : parent.appendChild(obj) : false;
};
nano.del = function _del(obj) {
	if (obj.nano) obj = obj.node;
	return nano((nano.isset(obj.parentNode))? obj.parentNode.removeChild(obj) : obj);
};
nano.head = function _head() {
	return nano(document.getElementsByTagName('head')[0]);
};
nano.body = function _body() {
	return nano(document.getElementsByTagName('body')[0]);
};
nano.node = function _node(tag, ns) {
	return (typeof tag === 'string')? (typeof ns === 'string')? document.createElementNS(ns, tag) : document.createElement(tag) : false;
};
