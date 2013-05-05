/*
 * popcorn.js version 1.3
 * http://popcornjs.org
 *
 * Copyright 2011, Mozilla Foundation
 * Licensed under the MIT license
 */

(function(p, o) {
	function E(a, b) {
		return function() {
			if (c.plugin.debug) return a.apply(this, arguments);
			try {
				return a.apply(this, arguments)
			} catch (d) {
				c.plugin.errors.push({
					plugin: b,
					thrown: d,
					source: a.toString()
				});
				this.emit("pluginerror", c.plugin.errors)
			}
		}
	}
	if (o.addEventListener) {
		var t = Array.prototype,
			y = Object.prototype,
			z = t.forEach,
			A = t.slice,
			x = y.hasOwnProperty,
			B = y.toString,
			F = p.Popcorn,
			v = [],
			C = false,
			u = {
				events: {
					hash: {},
					apis: {}
				}
			}, D = function() {
				return p.requestAnimationFrame || p.webkitRequestAnimationFrame || p.mozRequestAnimationFrame || p.oRequestAnimationFrame || p.msRequestAnimationFrame || function(a) {
					p.setTimeout(a, 16)
				}
			}(),
			c = function(a, b) {
				return new c.p.init(a, b || null)
			};
		c.version = "1.3";
		c.isSupported = true;
		c.instances = [];
		c.p = c.prototype = {
			init: function(a, b) {
				var d, e = this;
				if (typeof a === "function") if (o.readyState === "complete") a(o, c);
				else {
					v.push(a);
					if (!C) {
						C = true;
						var f = function() {
							o.removeEventListener("DOMContentLoaded", f, false);
							for (var k = 0, n = v.length; k < n; k++) v[k].call(o, c);
							v = null
						};
						o.addEventListener("DOMContentLoaded", f, false)
					}
				} else {
					if (typeof a ===
						"string") try {
						d = o.querySelector(a)
					} catch (h) {
						throw Error("Popcorn.js Error: Invalid media element selector: " + a);
					}
					this.media = d || a;
					d = this.media.nodeName && this.media.nodeName.toLowerCase() || "video";
					this[d] = this.media;
					this.options = b || {};
					this.id = this.options.id || c.guid(d);
					if (c.byId(this.id)) throw Error("Popcorn.js Error: Cannot use duplicate ID (" + this.id + ")");
					this.isDestroyed = false;
					this.data = {
						running: {
							cue: []
						},
						timeUpdate: c.nop,
						disabled: {},
						events: {},
						hooks: {},
						history: [],
						state: {
							volume: this.media.volume
						},
						trackRefs: {},
						trackEvents: {
							byStart: [{
								start: -1,
								end: -1
							}],
							byEnd: [{
								start: -1,
								end: -1
							}],
							animating: [],
							startIndex: 0,
							endIndex: 0,
							previousUpdateTime: -1
						}
					};
					c.instances.push(this);
					var i = function() {
						if (e.media.currentTime < 0) e.media.currentTime = 0;
						e.media.removeEventListener("loadeddata", i, false);
						var k, n, m, j, g;
						k = e.media.duration;
						k = k != k ? Number.MAX_VALUE : k + 1;
						c.addTrackEvent(e, {
							start: k,
							end: k
						});
						if (e.options.frameAnimation) {
							e.data.timeUpdate = function() {
								c.timeUpdate(e, {});
								c.forEach(c.manifest, function(l, w) {
									if (n = e.data.running[w]) {
										j = n.length;
										for (var s = 0; s < j; s++) {
											m = n[s];
											(g = m._natives) && g.frame && g.frame.call(e, {}, m, e.currentTime())
										}
									}
								});
								e.emit("timeupdate");
								!e.isDestroyed && D(e.data.timeUpdate)
							};
							!e.isDestroyed && D(e.data.timeUpdate)
						} else {
							e.data.timeUpdate = function(l) {
								c.timeUpdate(e, l)
							};
							e.isDestroyed || e.media.addEventListener("timeupdate", e.data.timeUpdate, false)
						}
					};
					Object.defineProperty(this, "error", {
						get: function() {
							return e.media.error
						}
					});
					e.media.readyState >= 2 ? i() : e.media.addEventListener("loadeddata", i, false);
					return this
				}
			}
		};
		c.p.init.prototype = c.p;
		c.byId = function(a) {
			for (var b = c.instances, d = b.length, e = 0; e < d; e++) if (b[e].id === a) return b[e];
			return null
		};
		c.forEach = function(a, b, d) {
			if (!a || !b) return {};
			d = d || this;
			var e, f;
			if (z && a.forEach === z) return a.forEach(b, d);
			if (B.call(a) === "[object NodeList]") {
				e = 0;
				for (f = a.length; e < f; e++) b.call(d, a[e], e, a);
				return a
			}
			for (e in a) x.call(a, e) && b.call(d, a[e], e, a);
			return a
		};
		c.extend = function(a) {
			var b = A.call(arguments, 1);
			c.forEach(b, function(d) {
				for (var e in d) a[e] = d[e]
			});
			return a
		};
		c.extend(c, {
			noConflict: function(a) {
				if (a) p.Popcorn = F;
				return c
			},
			error: function(a) {
				throw Error(a);
			},
			guid: function(a) {
				c.guid.counter++;
				return (a ? a : "") + (+new Date + c.guid.counter)
			},
			sizeOf: function(a) {
				var b = 0,
					d;
				for (d in a) b++;
				return b
			},
			isArray: Array.isArray || function(a) {
				return B.call(a) === "[object Array]"
			},
			nop: function() {},
			position: function(a) {
				a = a.getBoundingClientRect();
				var b = {}, d = o.documentElement,
					e = o.body,
					f, h, i;
				f = d.clientTop || e.clientTop || 0;
				h = d.clientLeft || e.clientLeft || 0;
				i = p.pageYOffset && d.scrollTop || e.scrollTop;
				d = p.pageXOffset && d.scrollLeft || e.scrollLeft;
				f = Math.ceil(a.top + i - f);
				h = Math.ceil(a.left + d - h);
				for (var k in a) b[k] = Math.round(a[k]);
				return c.extend({}, b, {
					top: f,
					left: h
				})
			},
			disable: function(a, b) {
				if (!a.data.disabled[b]) {
					a.data.disabled[b] = true;
					for (var d = a.data.running[b].length - 1, e; d >= 0; d--) {
						e = a.data.running[b][d];
						e._natives.end.call(a, null, e)
					}
				}
				return a
			},
			enable: function(a, b) {
				if (a.data.disabled[b]) {
					a.data.disabled[b] = false;
					for (var d = a.data.running[b].length - 1, e; d >= 0; d--) {
						e = a.data.running[b][d];
						e._natives.start.call(a, null, e)
					}
				}
				return a
			},
			destroy: function(a) {
				var b = a.data.events,
					d = a.data.trackEvents,
					e, f, h, i;
				for (f in b) {
					e = b[f];
					for (h in e) delete e[h];
					b[f] = null
				}
				for (i in c.registryByName) c.removePlugin(a, i);
				d.byStart.length = 0;
				d.byEnd.length = 0;
				if (!a.isDestroyed) {
					a.data.timeUpdate && a.media.removeEventListener("timeupdate", a.data.timeUpdate, false);
					a.isDestroyed = true
				}
			}
		});
		c.guid.counter = 1;
		c.extend(c.p, function() {
			var a = {};
			c.forEach("load play pause currentTime playbackRate volume duration preload playbackRate autoplay loop controls muted buffered readyState seeking paused played seekable ended".split(/\s+/g),

			function(b) {
				a[b] = function(d) {
					var e;
					if (typeof this.media[b] === "function") {
						if (d != null && /play|pause/.test(b)) this.media.currentTime = c.util.toSeconds(d);
						this.media[b]();
						return this
					}
					if (d != null) {
						e = this.media[b];
						this.media[b] = d;
						e !== d && this.emit("attrchange", {
							attribute: b,
							previousValue: e,
							currentValue: d
						});
						return this
					}
					return this.media[b]
				}
			});
			return a
		}());
		c.forEach("enable disable".split(" "), function(a) {
			c.p[a] = function(b) {
				return c[a](this, b)
			}
		});
		c.extend(c.p, {
			roundTime: function() {
				return Math.round(this.media.currentTime)
			},
			exec: function(a, b, d) {
				var e = arguments.length,
					f, h;
				try {
					h = c.util.toSeconds(a)
				} catch (i) {}
				if (typeof h === "number") a = h;
				if (typeof a === "number" && e === 2) {
					d = b;
					b = a;
					a = c.guid("cue")
				} else if (e === 1) b = -1;
				else if (f = this.getTrackEvent(a)) {
					if (typeof a === "string" && e === 2) {
						if (typeof b === "number") d = f._natives.start;
						if (typeof b === "function") {
							d = b;
							b = f.start
						}
					}
				} else if (e >= 2) {
					if (typeof b === "string") {
						try {
							h = c.util.toSeconds(b)
						} catch (k) {}
						b = h
					}
					if (typeof b === "number") d = c.nop();
					if (typeof b === "function") {
						d = b;
						b = -1
					}
				}
				c.addTrackEvent(this, {
					id: a,
					start: b,
					end: b + 1,
					_running: false,
					_natives: {
						start: d || c.nop,
						end: c.nop,
						type: "cue"
					}
				});
				return this
			},
			mute: function(a) {
				a = a == null || a === true ? "muted" : "unmuted";
				if (a === "unmuted") {
					this.media.muted = false;
					this.media.volume = this.data.state.volume
				}
				if (a === "muted") {
					this.data.state.volume = this.media.volume;
					this.media.muted = true
				}
				this.emit(a);
				return this
			},
			unmute: function(a) {
				return this.mute(a == null ? false : !a)
			},
			position: function() {
				return c.position(this.media)
			},
			toggle: function(a) {
				return c[this.data.disabled[a] ? "enable" :
					"disable"](this, a)
			},
			defaults: function(a, b) {
				if (c.isArray(a)) {
					c.forEach(a, function(d) {
						for (var e in d) this.defaults(e, d[e])
					}, this);
					return this
				}
				if (!this.options.defaults) this.options.defaults = {};
				this.options.defaults[a] || (this.options.defaults[a] = {});
				c.extend(this.options.defaults[a], b);
				return this
			}
		});
		c.Events = {
			UIEvents: "blur focus focusin focusout load resize scroll unload",
			MouseEvents: "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave click dblclick",
			Events: "loadstart progress suspend emptied stalled play pause error loadedmetadata loadeddata waiting playing canplay canplaythrough seeking seeked timeupdate ended ratechange durationchange volumechange"
		};
		c.Events.Natives = c.Events.UIEvents + " " + c.Events.MouseEvents + " " + c.Events.Events;
		u.events.apiTypes = ["UIEvents", "MouseEvents", "Events"];
		(function(a, b) {
			for (var d = u.events.apiTypes, e = a.Natives.split(/\s+/g), f = 0, h = e.length; f < h; f++) b.hash[e[f]] = true;
			d.forEach(function(i) {
				b.apis[i] = {};
				for (var k = a[i].split(/\s+/g), n = k.length, m = 0; m < n; m++) b.apis[i][k[m]] = true
			})
		})(c.Events, u.events);
		c.events = {
			isNative: function(a) {
				return !!u.events.hash[a]
			},
			getInterface: function(a) {
				if (!c.events.isNative(a)) return false;
				var b = u.events,
					d = b.apiTypes;
				b = b.apis;
				for (var e = 0, f = d.length, h, i; e < f; e++) {
					i = d[e];
					if (b[i][a]) {
						h = i;
						break
					}
				}
				return h
			},
			all: c.Events.Natives.split(/\s+/g),
			fn: {
				trigger: function(a, b) {
					var d;
					if (this.data.events[a] && c.sizeOf(this.data.events[a])) {
						if (d = c.events.getInterface(a)) {
							d = o.createEvent(d);
							d.initEvent(a, true, true, p, 1);
							this.media.dispatchEvent(d);
							return this
						}
						c.forEach(this.data.events[a], function(e) {
							e.call(this, b)
						}, this)
					}
					return this
				},
				listen: function(a, b) {
					var d = this,
						e = true,
						f = c.events.hooks[a],
						h;
					if (!this.data.events[a]) {
						this.data.events[a] = {};
						e = false
					}
					if (f) {
						f.add && f.add.call(this, {}, b);
						if (f.bind) a = f.bind;
						if (f.handler) {
							h = b;
							b = function(i) {
								f.handler.call(d, i, h)
							}
						}
						e = true;
						if (!this.data.events[a]) {
							this.data.events[a] = {};
							e = false
						}
					}
					this.data.events[a][b.name || b.toString() + c.guid()] = b;
					!e && c.events.all.indexOf(a) > -1 && this.media.addEventListener(a, function(i) {
						c.forEach(d.data.events[a], function(k) {
							typeof k === "function" && k.call(d, i)
						})
					}, false);
					return this
				},
				unlisten: function(a, b) {
					if (this.data.events[a] && this.data.events[a][b]) {
						delete this.data.events[a][b];
						return this
					}
					this.data.events[a] = null;
					return this
				}
			},
			hooks: {
				canplayall: {
					bind: "canplaythrough",
					add: function(a, b) {
						var d = false;
						if (this.media.readyState) {
							b.call(this, a);
							d = true
						}
						this.data.hooks.canplayall = {
							fired: d
						}
					},
					handler: function(a, b) {
						if (!this.data.hooks.canplayall.fired) {
							b.call(this, a);
							this.data.hooks.canplayall.fired = true
						}
					}
				}
			}
		};
		c.forEach([
			["trigger", "emit"],
			["listen", "on"],
			["unlisten", "off"]
		], function(a) {
			c.p[a[0]] = c.p[a[1]] = c.events.fn[a[0]]
		});
		c.addTrackEvent = function(a, b) {
			var d, e;
			if (b.id) d = a.getTrackEvent(b.id);
			if (d) {
				e = true;
				b = c.extend({}, d, b);
				a.removeTrackEvent(b.id)
			}
			if (b && b._natives && b._natives.type && a.options.defaults && a.options.defaults[b._natives.type]) b = c.extend({}, a.options.defaults[b._natives.type], b);
			if (b._natives) {
				b._id = b.id || b._id || c.guid(b._natives.type);
				a.data.history.push(b._id)
			}
			b.start = c.util.toSeconds(b.start, a.options.framerate);
			b.end = c.util.toSeconds(b.end, a.options.framerate);
			var f = a.data.trackEvents.byStart,
				h = a.data.trackEvents.byEnd,
				i;
			for (i = f.length - 1; i >= 0; i--) if (b.start >= f[i].start) {
				f.splice(i + 1, 0, b);
				break
			}
			for (f = h.length - 1; f >= 0; f--) if (b.end > h[f].end) {
				h.splice(f + 1, 0, b);
				break
			}
			if (b.end > a.media.currentTime && b.start <= a.media.currentTime) {
				b._running = true;
				a.data.running[b._natives.type].push(b);
				a.data.disabled[b._natives.type] || b._natives.start.call(a, null, b)
			}
			i <= a.data.trackEvents.startIndex && b.start <= a.data.trackEvents.previousUpdateTime && a.data.trackEvents.startIndex++;
			f <= a.data.trackEvents.endIndex && b.end < a.data.trackEvents.previousUpdateTime && a.data.trackEvents.endIndex++;
			this.timeUpdate(a,
			null, true);
			b._id && c.addTrackEvent.ref(a, b);
			if (e) {
				e = b._natives.type === "cue" ? "cuechange" : "trackchange";
				a.emit(e, {
					id: b.id,
					previousValue: {
						time: d.start,
						fn: d._natives.start
					},
					currentValue: {
						time: b.start,
						fn: b._natives.start
					}
				})
			}
		};
		c.addTrackEvent.ref = function(a, b) {
			a.data.trackRefs[b._id] = b;
			return a
		};
		c.removeTrackEvent = function(a, b) {
			for (var d, e, f = a.data.history.length, h = a.data.trackEvents.byStart.length, i = 0, k = 0, n = [], m = [], j = [], g = []; --h > -1;) {
				d = a.data.trackEvents.byStart[i];
				e = a.data.trackEvents.byEnd[i];
				if (!d._id) {
					n.push(d);
					m.push(e)
				}
				if (d._id) {
					d._id !== b && n.push(d);
					e._id !== b && m.push(e);
					if (d._id === b) {
						k = i;
						d._natives._teardown && d._natives._teardown.call(a, d)
					}
				}
				i++
			}
			h = a.data.trackEvents.animating.length;
			i = 0;
			if (h) for (; --h > -1;) {
				d = a.data.trackEvents.animating[i];
				d._id || j.push(d);
				d._id && d._id !== b && j.push(d);
				i++
			}
			k <= a.data.trackEvents.startIndex && a.data.trackEvents.startIndex--;
			k <= a.data.trackEvents.endIndex && a.data.trackEvents.endIndex--;
			a.data.trackEvents.byStart = n;
			a.data.trackEvents.byEnd = m;
			a.data.trackEvents.animating = j;
			for (h = 0; h < f; h++) a.data.history[h] !== b && g.push(a.data.history[h]);
			a.data.history = g;
			c.removeTrackEvent.ref(a, b)
		};
		c.removeTrackEvent.ref = function(a, b) {
			delete a.data.trackRefs[b];
			return a
		};
		c.getTrackEvents = function(a) {
			var b = [];
			a = a.data.trackEvents.byStart;
			for (var d = a.length, e = 0, f; e < d; e++) {
				f = a[e];
				f._id && b.push(f)
			}
			return b
		};
		c.getTrackEvents.ref = function(a) {
			return a.data.trackRefs
		};
		c.getTrackEvent = function(a, b) {
			return a.data.trackRefs[b]
		};
		c.getTrackEvent.ref = function(a, b) {
			return a.data.trackRefs[b]
		};
		c.getLastTrackEventId = function(a) {
			return a.data.history[a.data.history.length - 1]
		};
		c.timeUpdate = function(a, b) {
			var d = a.media.currentTime,
				e = a.data.trackEvents.previousUpdateTime,
				f = a.data.trackEvents,
				h = f.endIndex,
				i = f.startIndex,
				k = f.byStart.length,
				n = f.byEnd.length,
				m = c.registryByName,
				j, g, l;
			if (e <= d) {
				for (; f.byEnd[h] && f.byEnd[h].end <= d;) {
					j = f.byEnd[h];
					g = (e = j._natives) && e.type;
					if (!e || m[g] || a[g]) {
						if (j._running === true) {
							j._running = false;
							l = a.data.running[g];
							l.splice(l.indexOf(j), 1);
							if (!a.data.disabled[g]) {
								e.end.call(a, b, j);
								a.emit("trackend",
								c.extend({}, j, {
									plugin: g,
									type: "trackend"
								}))
							}
						}
						h++
					} else {
						c.removeTrackEvent(a, j._id);
						return
					}
				}
				for (; f.byStart[i] && f.byStart[i].start <= d;) {
					j = f.byStart[i];
					g = (e = j._natives) && e.type;
					if (!e || m[g] || a[g]) {
						if (j.end > d && j._running === false) {
							j._running = true;
							a.data.running[g].push(j);
							if (!a.data.disabled[g]) {
								e.start.call(a, b, j);
								a.emit("trackstart", c.extend({}, j, {
									plugin: g,
									type: "trackstart"
								}))
							}
						}
						i++
					} else {
						c.removeTrackEvent(a, j._id);
						return
					}
				}
			} else if (e > d) {
				for (; f.byStart[i] && f.byStart[i].start > d;) {
					j = f.byStart[i];
					g = (e = j._natives) && e.type;
					if (!e || m[g] || a[g]) {
						if (j._running === true) {
							j._running = false;
							l = a.data.running[g];
							l.splice(l.indexOf(j), 1);
							if (!a.data.disabled[g]) {
								e.end.call(a, b, j);
								a.emit("trackend", c.extend({}, j, {
									plugin: g,
									type: "trackend"
								}))
							}
						}
						i--
					} else {
						c.removeTrackEvent(a, j._id);
						return
					}
				}
				for (; f.byEnd[h] && f.byEnd[h].end > d;) {
					j = f.byEnd[h];
					g = (e = j._natives) && e.type;
					if (!e || m[g] || a[g]) {
						if (j.start <= d && j._running === false) {
							j._running = true;
							a.data.running[g].push(j);
							if (!a.data.disabled[g]) {
								e.start.call(a, b, j);
								a.emit("trackstart", c.extend({},
								j, {
									plugin: g,
									type: "trackstart"
								}))
							}
						}
						h--
					} else {
						c.removeTrackEvent(a, j._id);
						return
					}
				}
			}
			f.endIndex = h;
			f.startIndex = i;
			f.previousUpdateTime = d;
			f.byStart.length < k && f.startIndex--;
			f.byEnd.length < n && f.endIndex--
		};
		c.extend(c.p, {
			getTrackEvents: function() {
				return c.getTrackEvents.call(null, this)
			},
			getTrackEvent: function(a) {
				return c.getTrackEvent.call(null, this, a)
			},
			getLastTrackEventId: function() {
				return c.getLastTrackEventId.call(null, this)
			},
			removeTrackEvent: function(a) {
				c.removeTrackEvent.call(null, this, a);
				return this
			},
			removePlugin: function(a) {
				c.removePlugin.call(null, this, a);
				return this
			},
			timeUpdate: function(a) {
				c.timeUpdate.call(null, this, a);
				return this
			},
			destroy: function() {
				c.destroy.call(null, this);
				return this
			}
		});
		c.manifest = {};
		c.registry = [];
		c.registryByName = {};
		c.plugin = function(a, b, d) {
			if (c.protect.natives.indexOf(a.toLowerCase()) >= 0) c.error("'" + a + "' is a protected function name");
			else {
				var e = ["start", "end"],
					f = {}, h = typeof b === "function",
					i = ["_setup", "_teardown", "start", "end", "frame"],
					k = function(j, g) {
						j = j || c.nop;
						g = g || c.nop;
						return function() {
							j.apply(this, arguments);
							g.apply(this, arguments)
						}
					};
				c.manifest[a] = d = d || b.manifest || {};
				i.forEach(function(j) {
					b[j] = E(b[j] || c.nop, a)
				});
				var n = function(j, g) {
					if (!g) return this;
					if (g.ranges && c.isArray(g.ranges)) {
						c.forEach(g.ranges, function(q) {
							q = c.extend({}, g, q);
							delete q.ranges;
							this[a](q)
						}, this);
						return this
					}
					var l = g._natives = {}, w = "",
						s;
					c.extend(l, j);
					g._natives.type = a;
					g._running = false;
					l.start = l.start || l["in"];
					l.end = l.end || l.out;
					if (g.once) l.end = k(l.end, function() {
						this.removeTrackEvent(g._id)
					});
					l._teardown = k(function() {
						var q = A.call(arguments),
							r = this.data.running[l.type];
						q.unshift(null);
						q[1]._running && r.splice(r.indexOf(g), 1) && l.end.apply(this, q)
					}, l._teardown);
					g.compose = g.compose && g.compose.split(" ") || [];
					g.effect = g.effect && g.effect.split(" ") || [];
					g.compose = g.compose.concat(g.effect);
					g.compose.forEach(function(q) {
						w = c.compositions[q] || {};
						i.forEach(function(r) {
							l[r] = k(l[r], w[r])
						})
					});
					g._natives.manifest = d;
					if (!("start" in g)) g.start = g["in"] || 0;
					if (!g.end && g.end !== 0) g.end = g.out || Number.MAX_VALUE;
					if (!x.call(g, "toString")) g.toString = function() {
						var q = ["start: " + g.start, "end: " + g.end, "id: " + (g.id || g._id)];
						g.target != null && q.push("target: " + g.target);
						return a + " ( " + q.join(", ") + " )"
					};
					if (!g.target) {
						s = "options" in d && d.options;
						g.target = s && "target" in s && s.target
					}
					if (g._natives) g._id = c.guid(g._natives.type);
					g._natives._setup && g._natives._setup.call(this, g);
					c.addTrackEvent(this, g);
					c.forEach(j, function(q, r) {
						r !== "type" && e.indexOf(r) === -1 && this.on(r, q)
					}, this);
					return this
				};
				c.p[a] = f[a] = function(j, g) {
					var l;
					if (j && !g) g = j;
					else if (l = this.getTrackEvent(j)) {
						g = c.extend({}, l, g);
						c.addTrackEvent(this, g);
						return this
					} else g.id = j;
					this.data.running[a] = this.data.running[a] || [];
					l = c.extend({}, this.options.defaults && this.options.defaults[a] || {}, g);
					return n.call(this, h ? b.call(this, l) : b, l)
				};
				d && c.extend(b, {
					manifest: d
				});
				var m = {
					fn: f[a],
					definition: b,
					base: b,
					parents: [],
					name: a
				};
				c.registry.push(c.extend(f, m, {
					type: a
				}));
				c.registryByName[a] = m;
				return f
			}
		};
		c.plugin.errors = [];
		c.plugin.debug = c.version === "1.3";
		c.removePlugin = function(a,
		b) {
			if (!b) {
				b = a;
				a = c.p;
				if (c.protect.natives.indexOf(b.toLowerCase()) >= 0) {
					c.error("'" + b + "' is a protected function name");
					return
				}
				var d = c.registry.length,
					e;
				for (e = 0; e < d; e++) if (c.registry[e].name === b) {
					c.registry.splice(e, 1);
					delete c.registryByName[b];
					delete c.manifest[b];
					delete a[b];
					return
				}
			}
			d = a.data.trackEvents.byStart;
			e = a.data.trackEvents.byEnd;
			var f = a.data.trackEvents.animating,
				h, i;
			h = 0;
			for (i = d.length; h < i; h++) {
				if (d[h] && d[h]._natives && d[h]._natives.type === b) {
					d[h]._natives._teardown && d[h]._natives._teardown.call(a,
					d[h]);
					d.splice(h, 1);
					h--;
					i--;
					if (a.data.trackEvents.startIndex <= h) {
						a.data.trackEvents.startIndex--;
						a.data.trackEvents.endIndex--
					}
				}
				e[h] && e[h]._natives && e[h]._natives.type === b && e.splice(h, 1)
			}
			h = 0;
			for (i = f.length; h < i; h++) if (f[h] && f[h]._natives && f[h]._natives.type === b) {
				f.splice(h, 1);
				h--;
				i--
			}
		};
		c.compositions = {};
		c.compose = function(a, b, d) {
			c.manifest[a] = d || b.manifest || {};
			c.compositions[a] = b
		};
		c.plugin.effect = c.effect = c.compose;
		var G = /^(?:\.|#|\[)/;
		c.dom = {
			debug: false,
			find: function(a, b) {
				var d = null;
				a = a.trim();
				b = b || o;
				if (a) {
					if (!G.test(a)) {
						d = o.getElementById(a);
						if (d !== null) return d
					}
					try {
						d = b.querySelector(a)
					} catch (e) {
						if (c.dom.debug) throw Error(e);
					}
				}
				return d
			}
		};
		var H = /\?/,
			I = {
				url: "",
				data: "",
				dataType: "",
				success: c.nop,
				type: "GET",
				async: true,
				xhr: function() {
					return new p.XMLHttpRequest
				}
			};
		c.xhr = function(a) {
			a.dataType = a.dataType && a.dataType.toLowerCase() || null;
			if (a.dataType && (a.dataType === "jsonp" || a.dataType === "script")) c.xhr.getJSONP(a.url, a.success, a.dataType === "script");
			else {
				a = c.extend({}, I, a);
				a.ajax = a.xhr();
				if (a.ajax) {
					if (a.type ===
						"GET" && a.data) {
						a.url += (H.test(a.url) ? "&" : "?") + a.data;
						a.data = null
					}
					a.ajax.open(a.type, a.url, a.async);
					a.ajax.send(a.data || null);
					return c.xhr.httpData(a)
				}
			}
		};
		c.xhr.httpData = function(a) {
			var b, d = null,
				e, f = null;
			a.ajax.onreadystatechange = function() {
				if (a.ajax.readyState === 4) {
					try {
						d = JSON.parse(a.ajax.responseText)
					} catch (h) {}
					b = {
						xml: a.ajax.responseXML,
						text: a.ajax.responseText,
						json: d
					};
					if (!b.xml || !b.xml.documentElement) {
						b.xml = null;
						try {
							e = new DOMParser;
							f = e.parseFromString(a.ajax.responseText, "text/xml");
							if (!f.getElementsByTagName("parsererror").length) b.xml = f
						} catch (i) {}
					}
					if (a.dataType) b = b[a.dataType];
					a.success.call(a.ajax, b)
				}
			};
			return b
		};
		c.xhr.getJSONP = function(a, b, d) {
			var e = o.head || o.getElementsByTagName("head")[0] || o.documentElement,
				f = o.createElement("script"),
				h = false,
				i = [];
			i = /(=)\?(?=&|$)|\?\?/;
			var k, n;
			if (!d) {
				n = a.match(/(callback=[^&]*)/);
				if (n !== null && n.length) {
					i = n[1].split("=")[1];
					if (i === "?") i = "jsonp";
					k = c.guid(i);
					a = a.replace(/(callback=[^&]*)/, "callback=" + k)
				} else {
					k = c.guid("jsonp");
					if (i.test(a)) a = a.replace(i, "$1" + k);
					i = a.split(/\?(.+)?/);
					a = i[0] + "?";
					if (i[1]) a += i[1] + "&";
					a += "callback=" + k
				}
				window[k] = function(m) {
					b && b(m);
					h = true
				}
			}
			f.addEventListener("load", function() {
				d && b && b();
				h && delete window[k];
				e.removeChild(f)
			}, false);
			f.src = a;
			e.insertBefore(f, e.firstChild)
		};
		c.getJSONP = c.xhr.getJSONP;
		c.getScript = c.xhr.getScript = function(a, b) {
			return c.xhr.getJSONP(a, b, true)
		};
		c.util = {
			toSeconds: function(a, b) {
				var d = /^([0-9]+:){0,2}[0-9]+([.;][0-9]+)?$/,
					e, f, h;
				if (typeof a === "number") return a;
				typeof a === "string" && !d.test(a) && c.error("Invalid time format");
				d = a.split(":");
				e = d.length - 1;
				f = d[e];
				if (f.indexOf(";") > -1) {
					f = f.split(";");
					h = 0;
					if (b && typeof b === "number") h = parseFloat(f[1], 10) / b;
					d[e] = parseInt(f[0], 10) + h
				}
				e = d[0];
				return {
					1: parseFloat(e, 10),
					2: parseInt(e, 10) * 60 + parseFloat(d[1], 10),
					3: parseInt(e, 10) * 3600 + parseInt(d[1], 10) * 60 + parseFloat(d[2], 10)
				}[d.length || 1]
			}
		};
		c.p.cue = c.p.exec;
		c.protect = {
			natives: function(a) {
				return Object.keys ? Object.keys(a) : function(b) {
					var d, e = [];
					for (d in b) x.call(b, d) && e.push(d);
					return e
				}(a)
			}(c.p).map(function(a) {
				return a.toLowerCase()
			})
		};
		c.forEach({
			listen: "on",
			unlisten: "off",
			trigger: "emit",
			exec: "cue"
		}, function(a, b) {
			var d = c.p[b];
			c.p[b] = function() {
				if (typeof console !== "undefined" && console.warn) {
					console.warn("Deprecated method '" + b + "', " + (a == null ? "do not use." : "use '" + a + "' instead."));
					c.p[b] = d
				}
				return c.p[a].apply(this, [].slice.call(arguments))
			}
		});
		p.Popcorn = c
	} else {
		p.Popcorn = {
			isSupported: false
		};
		for (t = "byId forEach extend effects error guid sizeOf isArray nop position disable enable destroyaddTrackEvent removeTrackEvent getTrackEvents getTrackEvent getLastTrackEventId timeUpdate plugin removePlugin compose effect xhr getJSONP getScript".split(/\s+/); t.length;) p.Popcorn[t.shift()] = function() {}
	}
})(window, window.document);