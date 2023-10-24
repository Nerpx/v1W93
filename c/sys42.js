/**
 * windows93 - v0.3.5 - Thu, 15 Jan 2015 16:09:55 GMT
 * http://www.windows93.net
 * (w) 2015 WTFPL
 * by @jankenpopp & @zombectro
 */
/*!
 *  polyfill
 */
Date.now = Date.now || function() {
    return +new Date
};
(function() {
    if (typeof window.performance === "undefined") {
        window.performance = {}
    }
    if (!window.performance.now) {
        var n = Date.now();
        if (performance.timing && performance.timing.navigationStart) {
            n = performance.timing.navigationStart
        }
        window.performance.now = function e() {
            return Date.now() - n
        }
    }
})();
(function() {
    "use strict";
    var n = 0,
        e = ["ms", "moz", "webkit", "o"],
        t = !!(window.performance && window.performance.now);
    for (var i = 0, r = e.length; i < r && !window.requestAnimationFrame; i += 1) {
        window.requestAnimationFrame = window[e[i] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[e[i] + "CancelAnimationFrame"] || window[e[i] + "CancelRequestAnimationFrame"]
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame) {
        window.requestAnimationFrame = function(e, t) {
            var i = (new Date).getTime();
            var r = Math.max(0, 16 - (i - n));
            var o = window.setTimeout(function() {
                e(i + r)
            }, r);
            n = i + r;
            return o
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(n) {
            clearTimeout(n)
        }
    }
    if (!t) {
        var o = window.requestAnimationFrame,
            a = +new Date;
        window.requestAnimationFrame = function(n, e) {
            var t = function(e) {
                var t = e < 1e12 ? e : e - a;
                return n(t)
            };
            o(t, e)
        }
    }
})();
if (!String.prototype.repeat) {
    String.prototype.repeat = function(n) {
        "use strict";
        if (this == null) throw new TypeError("can't convert " + this + " to object");
        var e = "" + this;
        n = +n;
        if (n != n) n = 0;
        if (n < 0) throw new RangeError("repeat count must be non-negative");
        if (n == Infinity) throw new RangeError("repeat count must be less than infinity");
        n = Math.floor(n);
        if (e.length == 0 || n == 0) return "";
        if (e.length * n >= 1 << 28) throw new RangeError("repeat count must not overflow maximum string size");
        var t = "";
        for (;;) {
            if ((n & 1) == 1) t += e;
            n >>>= 1;
            if (n == 0) break;
            e += e
        }
        return t
    }
}
/*!
 *  howler.js v1.1.25
 *  howlerjs.com
 *
 *  (c) 2013-2014, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */
(function() {
    var e = {};
    var o = null,
        n = true,
        r = false;
    try {
        if (typeof AudioContext !== "undefined") {
            o = new AudioContext
        } else if (typeof webkitAudioContext !== "undefined") {
            o = new webkitAudioContext
        } else {
            n = false
        }
    } catch (t) {
        n = false
    }
    if (!n) {
        if (typeof Audio !== "undefined") {
            try {
                new Audio
            } catch (t) {
                r = true
            }
        } else {
            r = true
        }
    }
    if (n) {
        var i = typeof o.createGain === "undefined" ? o.createGainNode() : o.createGain();
        i.gain.value = 1;
        i.connect(o.destination)
    }
    var a = function(e) {
        this._volume = 1;
        this._muted = false;
        this.usingWebAudio = n;
        this.ctx = o;
        this.noAudio = r;
        this._howls = [];
        this._codecs = e;
        this.iOSAutoEnable = true
    };
    a.prototype = {
        volume: function(e) {
            var o = this;
            e = parseFloat(e);
            if (e >= 0 && e <= 1) {
                o._volume = e;
                if (n) {
                    i.gain.value = e
                }
                for (var r in o._howls) {
                    if (o._howls.hasOwnProperty(r) && o._howls[r]._webAudio === false) {
                        for (var t = 0; t < o._howls[r]._audioNode.length; t++) {
                            o._howls[r]._audioNode[t].volume = o._howls[r]._volume * o._volume
                        }
                    }
                }
                return o
            }
            return n ? i.gain.value : o._volume
        },
        mute: function() {
            this._setMuted(true);
            return this
        },
        unmute: function() {
            this._setMuted(false);
            return this
        },
        _setMuted: function(e) {
            var o = this;
            o._muted = e;
            if (n) {
                i.gain.value = e ? 0 : o._volume
            }
            for (var r in o._howls) {
                if (o._howls.hasOwnProperty(r) && o._howls[r]._webAudio === false) {
                    for (var t = 0; t < o._howls[r]._audioNode.length; t++) {
                        o._howls[r]._audioNode[t].muted = e
                    }
                }
            }
        },
        codecs: function(e) {
            return this._codecs[e]
        },
        _enableiOSAudio: function() {
            var e = this;
            if (o && (e._iOSEnabled || !/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
                return
            }
            e._iOSEnabled = false;
            var n = function() {
                var r = o.createBuffer(1, 1, 22050);
                var t = o.createBufferSource();
                t.buffer = r;
                t.connect(o.destination);
                if (typeof t.start === "undefined") {
                    t.noteOn(0)
                } else {
                    t.start(0)
                }
                setTimeout(function() {
                    if (t.playbackState === t.PLAYING_STATE || t.playbackState === t.FINISHED_STATE) {
                        e._iOSEnabled = true;
                        e.iOSAutoEnable = false;
                        window.removeEventListener("touchstart", n, false)
                    }
                }, 0)
            };
            window.addEventListener("touchstart", n, false);
            return e
        }
    };
    var u = null;
    var d = {};
    if (!r) {
        u = new Audio;
        d = {
            mp3: !!u.canPlayType("audio/mpeg;").replace(/^no$/, ""),
            opus: !!u.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
            ogg: !!u.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
            wav: !!u.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
            aac: !!u.canPlayType("audio/aac;").replace(/^no$/, ""),
            m4a: !!(u.canPlayType("audio/x-m4a;") || u.canPlayType("audio/m4a;") || u.canPlayType("audio/aac;")).replace(/^no$/, ""),
            mp4: !!(u.canPlayType("audio/x-mp4;") || u.canPlayType("audio/mp4;") || u.canPlayType("audio/aac;")).replace(/^no$/, ""),
            weba: !!u.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")
        }
    }
    var f = new a(d);
    var l = function(e) {
        var r = this;
        r._autoplay = e.autoplay || false;
        r._buffer = e.buffer || false;
        r._duration = e.duration || 0;
        r._format = e.format || null;
        r._loop = e.loop || false;
        r._loaded = false;
        r._sprite = e.sprite || {};
        r._src = e.src || "";
        r._pos3d = e.pos3d || [0, 0, -.5];
        r._volume = e.volume !== undefined ? e.volume : 1;
        r._urls = e.urls || [];
        r._rate = e.rate || 1;
        r._model = e.model || null;
        r._onload = [e.onload || function() {}];
        r._onloaderror = [e.onloaderror || function() {}];
        r._onend = [e.onend || function() {}];
        r._onpause = [e.onpause || function() {}];
        r._onplay = [e.onplay || function() {}];
        r._onendTimer = [];
        r._webAudio = n && !r._buffer;
        r._audioNode = [];
        if (r._webAudio) {
            r._setupAudioNode()
        }
        if (typeof o !== "undefined" && o && f.iOSAutoEnable) {
            f._enableiOSAudio()
        }
        f._howls.push(r);
        r.load()
    };
    l.prototype = {
        load: function() {
            var e = this,
                o = null;
            if (r) {
                e.on("loaderror");
                return
            }
            for (var n = 0; n < e._urls.length; n++) {
                var t, i;
                if (e._format) {
                    t = e._format
                } else {
                    i = e._urls[n];
                    t = /^data:audio\/([^;,]+);/i.exec(i);
                    if (!t) {
                        t = /\.([^.]+)$/.exec(i.split("?", 1)[0])
                    }
                    if (t) {
                        t = t[1].toLowerCase()
                    } else {
                        e.on("loaderror");
                        return
                    }
                }
                if (d[t]) {
                    o = e._urls[n];
                    break
                }
            }
            if (!o) {
                e.on("loaderror");
                return
            }
            e._src = o;
            if (e._webAudio) {
                s(e, o)
            } else {
                var u = new Audio;
                u.addEventListener("error", function() {
                    if (u.error && u.error.code === 4) {
                        a.noAudio = true
                    }
                    e.on("loaderror", {
                        type: u.error ? u.error.code : 0
                    })
                }, false);
                e._audioNode.push(u);
                u.src = o;
                u._pos = 0;
                u.preload = "auto";
                u.volume = f._muted ? 0 : e._volume * f.volume();
                var l = function() {
                    e._duration = Math.ceil(u.duration * 10) / 10;
                    if (Object.getOwnPropertyNames(e._sprite).length === 0) {
                        e._sprite = {
                            _default: [0, e._duration * 1e3]
                        }
                    }
                    if (!e._loaded) {
                        e._loaded = true;
                        e.on("load")
                    }
                    if (e._autoplay) {
                        e.play()
                    }
                    u.removeEventListener("canplaythrough", l, false)
                };
                u.addEventListener("canplaythrough", l, false);
                u.load()
            }
            return e
        },
        urls: function(e) {
            var o = this;
            if (e) {
                o.stop();
                o._urls = typeof e === "string" ? [e] : e;
                o._loaded = false;
                o.load();
                return o
            } else {
                return o._urls
            }
        },
        play: function(e, n) {
            var r = this;
            if (typeof e === "function") {
                n = e
            }
            if (!e || typeof e === "function") {
                e = "_default"
            }
            if (!r._loaded) {
                r.on("load", function() {
                    r.play(e, n)
                });
                return r
            }
            if (!r._sprite[e]) {
                if (typeof n === "function") n();
                return r
            }
            r._inactiveNode(function(t) {
                t._sprite = e;
                var i = t._pos > 0 ? t._pos : r._sprite[e][0] / 1e3;
                var a = 0;
                if (r._webAudio) {
                    a = r._sprite[e][1] / 1e3 - t._pos;
                    if (t._pos > 0) {
                        i = r._sprite[e][0] / 1e3 + i
                    }
                } else {
                    a = r._sprite[e][1] / 1e3 - (i - r._sprite[e][0] / 1e3)
                }
                var u = !!(r._loop || r._sprite[e][2]);
                var d = typeof n === "string" ? n : Math.round(Date.now() * Math.random()) + "",
                    l;
                (function() {
                    var o = {
                        id: d,
                        sprite: e,
                        loop: u
                    };
                    l = setTimeout(function() {
                        if (!r._webAudio && u) {
                            r.stop(o.id).play(e, o.id)
                        }
                        if (r._webAudio && !u) {
                            r._nodeById(o.id).paused = true;
                            r._nodeById(o.id)._pos = 0;
                            r._clearEndTimer(o.id)
                        }
                        if (!r._webAudio && !u) {
                            r.stop(o.id)
                        }
                        r.on("end", d)
                    }, a * 1e3);
                    r._onendTimer.push({
                        timer: l,
                        id: o.id
                    })
                })();
                if (r._webAudio) {
                    var s = r._sprite[e][0] / 1e3,
                        _ = r._sprite[e][1] / 1e3;
                    t.id = d;
                    t.paused = false;
                    p(r, [u, s, _], d);
                    r._playStart = o.currentTime;
                    t.gain.value = r._volume;
                    if (typeof t.bufferSource.start === "undefined") {
                        t.bufferSource.noteGrainOn(0, i, a)
                    } else {
                        t.bufferSource.start(0, i, a)
                    }
                } else {
                    if (t.readyState === 4 || !t.readyState && navigator.isCocoonJS) {
                        t.readyState = 4;
                        t.id = d;
                        t.currentTime = i;
                        t.muted = f._muted || t.muted;
                        t.volume = r._volume * f.volume();
                        setTimeout(function() {
                            t.play()
                        }, 0)
                    } else {
                        r._clearEndTimer(d);
                        (function() {
                            var o = r,
                                i = e,
                                a = n,
                                u = t;
                            var d = function() {
                                o.play(i, a);
                                u.removeEventListener("canplaythrough", d, false)
                            };
                            u.addEventListener("canplaythrough", d, false)
                        })();
                        return r
                    }
                }
                r.on("play");
                if (typeof n === "function") n(d);
                return r
            });
            return r
        },
        pause: function(e) {
            var o = this;
            if (!o._loaded) {
                o.on("play", function() {
                    o.pause(e)
                });
                return o
            }
            o._clearEndTimer(e);
            var n = e ? o._nodeById(e) : o._activeNode();
            if (n) {
                n._pos = o.pos(null, e);
                if (o._webAudio) {
                    if (!n.bufferSource || n.paused) {
                        return o
                    }
                    n.paused = true;
                    if (typeof n.bufferSource.stop === "undefined") {
                        n.bufferSource.noteOff(0)
                    } else {
                        n.bufferSource.stop(0)
                    }
                } else {
                    n.pause()
                }
            }
            o.on("pause");
            return o
        },
        stop: function(e) {
            var o = this;
            if (!o._loaded) {
                o.on("play", function() {
                    o.stop(e)
                });
                return o
            }
            o._clearEndTimer(e);
            var n = e ? o._nodeById(e) : o._activeNode();
            if (n) {
                n._pos = 0;
                if (o._webAudio) {
                    if (!n.bufferSource || n.paused) {
                        return o
                    }
                    n.paused = true;
                    if (typeof n.bufferSource.stop === "undefined") {
                        n.bufferSource.noteOff(0)
                    } else {
                        n.bufferSource.stop(0)
                    }
                } else if (!isNaN(n.duration)) {
                    n.pause();
                    n.currentTime = 0
                }
            }
            return o
        },
        mute: function(e) {
            var o = this;
            if (!o._loaded) {
                o.on("play", function() {
                    o.mute(e)
                });
                return o
            }
            var n = e ? o._nodeById(e) : o._activeNode();
            if (n) {
                if (o._webAudio) {
                    n.gain.value = 0
                } else {
                    n.muted = true
                }
            }
            return o
        },
        unmute: function(e) {
            var o = this;
            if (!o._loaded) {
                o.on("play", function() {
                    o.unmute(e)
                });
                return o
            }
            var n = e ? o._nodeById(e) : o._activeNode();
            if (n) {
                if (o._webAudio) {
                    n.gain.value = o._volume
                } else {
                    n.muted = false
                }
            }
            return o
        },
        volume: function(e, o) {
            var n = this;
            e = parseFloat(e);
            if (e >= 0 && e <= 1) {
                n._volume = e;
                if (!n._loaded) {
                    n.on("play", function() {
                        n.volume(e, o)
                    });
                    return n
                }
                var r = o ? n._nodeById(o) : n._activeNode();
                if (r) {
                    if (n._webAudio) {
                        r.gain.value = e
                    } else {
                        r.volume = e * f.volume()
                    }
                }
                return n
            } else {
                return n._volume
            }
        },
        loop: function(e) {
            var o = this;
            if (typeof e === "boolean") {
                o._loop = e;
                return o
            } else {
                return o._loop
            }
        },
        sprite: function(e) {
            var o = this;
            if (typeof e === "object") {
                o._sprite = e;
                return o
            } else {
                return o._sprite
            }
        },
        pos: function(e, n) {
            var r = this;
            if (!r._loaded) {
                r.on("load", function() {
                    r.pos(e)
                });
                return typeof e === "number" ? r : r._pos || 0
            }
            e = parseFloat(e);
            var t = n ? r._nodeById(n) : r._activeNode();
            if (t) {
                if (e >= 0) {
                    r.pause(n);
                    t._pos = e;
                    r.play(t._sprite, n);
                    return r
                } else {
                    return r._webAudio ? t._pos + (o.currentTime - r._playStart) : t.currentTime
                }
            } else if (e >= 0) {
                return r
            } else {
                for (var i = 0; i < r._audioNode.length; i++) {
                    if (r._audioNode[i].paused && r._audioNode[i].readyState === 4) {
                        return r._webAudio ? r._audioNode[i]._pos : r._audioNode[i].currentTime
                    }
                }
            }
        },
        pos3d: function(e, o, n, r) {
            var t = this;
            o = typeof o === "undefined" || !o ? 0 : o;
            n = typeof n === "undefined" || !n ? -.5 : n;
            if (!t._loaded) {
                t.on("play", function() {
                    t.pos3d(e, o, n, r)
                });
                return t
            }
            if (e >= 0 || e < 0) {
                if (t._webAudio) {
                    var i = r ? t._nodeById(r) : t._activeNode();
                    if (i) {
                        t._pos3d = [e, o, n];
                        i.panner.setPosition(e, o, n);
                        i.panner.panningModel = t._model || "HRTF"
                    }
                }
            } else {
                return t._pos3d
            }
            return t
        },
        fade: function(e, o, n, r, t) {
            var i = this,
                a = Math.abs(e - o),
                u = e > o ? "down" : "up",
                d = a / .01,
                f = n / d;
            if (!i._loaded) {
                i.on("load", function() {
                    i.fade(e, o, n, r, t)
                });
                return i
            }
            i.volume(e, t);
            for (var l = 1; l <= d; l++) {
                (function() {
                    var e = i._volume + (u === "up" ? .01 : -.01) * l,
                        n = Math.round(1e3 * e) / 1e3,
                        a = o;
                    setTimeout(function() {
                        i.volume(n, t);
                        if (n === a) {
                            if (r) r()
                        }
                    }, f * l)
                })()
            }
        },
        fadeIn: function(e, o, n) {
            return this.volume(0).play().fade(0, e, o, n)
        },
        fadeOut: function(e, o, n, r) {
            var t = this;
            return t.fade(t._volume, e, o, function() {
                if (n) n();
                t.pause(r);
                t.on("end")
            }, r)
        },
        _nodeById: function(e) {
            var o = this,
                n = o._audioNode[0];
            for (var r = 0; r < o._audioNode.length; r++) {
                if (o._audioNode[r].id === e) {
                    n = o._audioNode[r];
                    break
                }
            }
            return n
        },
        _activeNode: function() {
            var e = this,
                o = null;
            for (var n = 0; n < e._audioNode.length; n++) {
                if (!e._audioNode[n].paused) {
                    o = e._audioNode[n];
                    break
                }
            }
            e._drainPool();
            return o
        },
        _inactiveNode: function(e) {
            var o = this,
                n = null;
            for (var r = 0; r < o._audioNode.length; r++) {
                if (o._audioNode[r].paused && o._audioNode[r].readyState === 4) {
                    e(o._audioNode[r]);
                    n = true;
                    break
                }
            }
            o._drainPool();
            if (n) {
                return
            }
            var t;
            if (o._webAudio) {
                t = o._setupAudioNode();
                e(t)
            } else {
                o.load();
                t = o._audioNode[o._audioNode.length - 1];
                var i = navigator.isCocoonJS ? "canplaythrough" : "loadedmetadata";
                var a = function() {
                    t.removeEventListener(i, a, false);
                    e(t)
                };
                t.addEventListener(i, a, false)
            }
        },
        _drainPool: function() {
            var e = this,
                o = 0,
                n;
            for (n = 0; n < e._audioNode.length; n++) {
                if (e._audioNode[n].paused) {
                    o++
                }
            }
            for (n = e._audioNode.length - 1; n >= 0; n--) {
                if (o <= 5) {
                    break
                }
                if (e._audioNode[n].paused) {
                    if (e._webAudio) {
                        e._audioNode[n].disconnect(0)
                    }
                    o--;
                    e._audioNode.splice(n, 1)
                }
            }
        },
        _clearEndTimer: function(e) {
            var o = this,
                n = 0;
            for (var r = 0; r < o._onendTimer.length; r++) {
                if (o._onendTimer[r].id === e) {
                    n = r;
                    break
                }
            }
            var t = o._onendTimer[n];
            if (t) {
                clearTimeout(t.timer);
                o._onendTimer.splice(n, 1)
            }
        },
        _setupAudioNode: function() {
            var e = this,
                n = e._audioNode,
                r = e._audioNode.length;
            n[r] = typeof o.createGain === "undefined" ? o.createGainNode() : o.createGain();
            n[r].gain.value = e._volume;
            n[r].paused = true;
            n[r]._pos = 0;
            n[r].readyState = 4;
            n[r].connect(i);
            n[r].panner = o.createPanner();
            n[r].panner.panningModel = e._model || "equalpower";
            n[r].panner.setPosition(e._pos3d[0], e._pos3d[1], e._pos3d[2]);
            n[r].panner.connect(n[r]);
            return n[r]
        },
        on: function(e, o) {
            var n = this,
                r = n["_on" + e];
            if (typeof o === "function") {
                r.push(o)
            } else {
                for (var t = 0; t < r.length; t++) {
                    if (o) {
                        r[t].call(n, o)
                    } else {
                        r[t].call(n)
                    }
                }
            }
            return n
        },
        off: function(e, o) {
            var n = this,
                r = n["_on" + e],
                t = o ? o.toString() : null;
            if (t) {
                for (var i = 0; i < r.length; i++) {
                    if (t === r[i].toString()) {
                        r.splice(i, 1);
                        break
                    }
                }
            } else {
                n["_on" + e] = []
            }
            return n
        },
        unload: function() {
            var o = this;
            var n = o._audioNode;
            for (var r = 0; r < o._audioNode.length; r++) {
                if (!n[r].paused) {
                    o.stop(n[r].id);
                    o.on("end", n[r].id)
                }
                if (!o._webAudio) {
                    n[r].src = ""
                } else {
                    n[r].disconnect(0)
                }
            }
            for (r = 0; r < o._onendTimer.length; r++) {
                clearTimeout(o._onendTimer[r].timer)
            }
            var t = f._howls.indexOf(o);
            if (t !== null && t >= 0) {
                f._howls.splice(t, 1)
            }
            delete e[o._src];
            o = null
        }
    };
    if (n) {
        var s = function(o, n) {
            if (n in e) {
                o._duration = e[n].duration;
                c(o);
                return
            }
            if (/^data:[^;]+;base64,/.test(n)) {
                var r = atob(n.split(",")[1]);
                var t = new Uint8Array(r.length);
                for (var i = 0; i < r.length; ++i) {
                    t[i] = r.charCodeAt(i)
                }
                _(t.buffer, o, n)
            } else {
                var a = new XMLHttpRequest;
                a.open("GET", n, true);
                a.responseType = "arraybuffer";
                a.onload = function() {
                    _(a.response, o, n)
                };
                a.onerror = function() {
                    if (o._webAudio) {
                        o._buffer = true;
                        o._webAudio = false;
                        o._audioNode = [];
                        delete o._gainNode;
                        delete e[n];
                        o.load()
                    }
                };
                try {
                    a.send()
                } catch (u) {
                    a.onerror()
                }
            }
        };
        var _ = function(n, r, t) {
            o.decodeAudioData(n, function(o) {
                if (o) {
                    e[t] = o;
                    c(r, o)
                }
            }, function(e) {
                r.on("loaderror")
            })
        };
        var c = function(e, o) {
            e._duration = o ? o.duration : e._duration;
            if (Object.getOwnPropertyNames(e._sprite).length === 0) {
                e._sprite = {
                    _default: [0, e._duration * 1e3]
                }
            }
            if (!e._loaded) {
                e._loaded = true;
                e.on("load")
            }
            if (e._autoplay) {
                e.play()
            }
        };
        var p = function(n, r, t) {
            var i = n._nodeById(t);
            i.bufferSource = o.createBufferSource();
            i.bufferSource.buffer = e[n._src];
            i.bufferSource.connect(i.panner);
            i.bufferSource.loop = r[0];
            if (r[0]) {
                i.bufferSource.loopStart = r[1];
                i.bufferSource.loopEnd = r[1] + r[2]
            }
            i.bufferSource.playbackRate.value = n._rate
        }
    }
    if (typeof define === "function" && define.amd) {
        define(function() {
            return {
                Howler: f,
                Howl: l
            }
        })
    }
    if (typeof exports !== "undefined") {
        exports.Howler = f;
        exports.Howl = l
    }
    if (typeof window !== "undefined") {
        window.Howler = f;
        window.Howl = l
    }
})();
/*!
    localForage -- Offline Storage, Improved
    Version 1.2.2
    https://mozilla.github.io/localForage
    (c) 2013-2015 Mozilla, Apache License 2.0
*/
! function() {
    var a, b, c, d;
    ! function() {
        var e = {},
            f = {};
        a = function(a, b, c) {
            e[a] = {
                deps: b,
                callback: c
            }
        }, d = c = b = function(a) {
            function c(b) {
                if ("." !== b.charAt(0)) return b;
                for (var c = b.split("/"), d = a.split("/").slice(0, -1), e = 0, f = c.length; f > e; e++) {
                    var g = c[e];
                    if (".." === g) d.pop();
                    else {
                        if ("." === g) continue;
                        d.push(g)
                    }
                }
                return d.join("/")
            }
            if (d._eak_seen = e, f[a]) return f[a];
            if (f[a] = {}, !e[a]) throw new Error("Could not find module " + a);
            for (var g, h = e[a], i = h.deps, j = h.callback, k = [], l = 0, m = i.length; m > l; l++) k.push("exports" === i[l] ? g = {} : b(c(i[l])));
            var n = j.apply(this, k);
            return f[a] = g || n
        }
    }(), a("promise/all", ["./utils", "exports"], function(a, b) {
        "use strict";

        function c(a) {
            var b = this;
            if (!d(a)) throw new TypeError("You must pass an array to all.");
            return new b(function(b, c) {
                function d(a) {
                    return function(b) {
                        f(a, b)
                    }
                }

                function f(a, c) {
                    h[a] = c, 0 === --i && b(h)
                }
                var g, h = [],
                    i = a.length;
                0 === i && b([]);
                for (var j = 0; j < a.length; j++) g = a[j], g && e(g.then) ? g.then(d(j), c) : f(j, g)
            })
        }
        var d = a.isArray,
            e = a.isFunction;
        b.all = c
    }), a("promise/asap", ["exports"], function(a) {
        "use strict";

        function b() {
            return function() {
                process.nextTick(e)
            }
        }

        function c() {
            var a = 0,
                b = new i(e),
                c = document.createTextNode("");
            return b.observe(c, {
                    characterData: !0
                }),
                function() {
                    c.data = a = ++a % 2
                }
        }

        function d() {
            return function() {
                j.setTimeout(e, 1)
            }
        }

        function e() {
            for (var a = 0; a < k.length; a++) {
                var b = k[a],
                    c = b[0],
                    d = b[1];
                c(d)
            }
            k = []
        }

        function f(a, b) {
            var c = k.push([a, b]);
            1 === c && g()
        }
        var g, h = "undefined" != typeof window ? window : {},
            i = h.MutationObserver || h.WebKitMutationObserver,
            j = "undefined" != typeof global ? global : void 0 === this ? window : this,
            k = [];
        g = "undefined" != typeof process && "[object process]" === {}.toString.call(process) ? b() : i ? c() : d(), a.asap = f
    }), a("promise/config", ["exports"], function(a) {
        "use strict";

        function b(a, b) {
            return 2 !== arguments.length ? c[a] : void(c[a] = b)
        }
        var c = {
            instrument: !1
        };
        a.config = c, a.configure = b
    }), a("promise/polyfill", ["./promise", "./utils", "exports"], function(a, b, c) {
        "use strict";

        function d() {
            var a;
            a = "undefined" != typeof global ? global : "undefined" != typeof window && window.document ? window : self;
            var b = "Promise" in a && "resolve" in a.Promise && "reject" in a.Promise && "all" in a.Promise && "race" in a.Promise && function() {
                var b;
                return new a.Promise(function(a) {
                    b = a
                }), f(b)
            }();
            b || (a.Promise = e)
        }
        var e = a.Promise,
            f = b.isFunction;
        c.polyfill = d
    }), a("promise/promise", ["./config", "./utils", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function(a, b, c, d, e, f, g, h) {
        "use strict";

        function i(a) {
            if (!v(a)) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
            if (!(this instanceof i)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
            this._subscribers = [], j(a, this)
        }

        function j(a, b) {
            function c(a) {
                o(b, a)
            }

            function d(a) {
                q(b, a)
            }
            try {
                a(c, d)
            } catch (e) {
                d(e)
            }
        }

        function k(a, b, c, d) {
            var e, f, g, h, i = v(c);
            if (i) try {
                e = c(d), g = !0
            } catch (j) {
                h = !0, f = j
            } else e = d, g = !0;
            n(b, e) || (i && g ? o(b, e) : h ? q(b, f) : a === D ? o(b, e) : a === E && q(b, e))
        }

        function l(a, b, c, d) {
            var e = a._subscribers,
                f = e.length;
            e[f] = b, e[f + D] = c, e[f + E] = d
        }

        function m(a, b) {
            for (var c, d, e = a._subscribers, f = a._detail, g = 0; g < e.length; g += 3) c = e[g], d = e[g + b], k(b, c, d, f);
            a._subscribers = null
        }

        function n(a, b) {
            var c, d = null;
            try {
                if (a === b) throw new TypeError("A promises callback cannot return that same promise.");
                if (u(b) && (d = b.then, v(d))) return d.call(b, function(d) {
                    return c ? !0 : (c = !0, void(b !== d ? o(a, d) : p(a, d)))
                }, function(b) {
                    return c ? !0 : (c = !0, void q(a, b))
                }), !0
            } catch (e) {
                return c ? !0 : (q(a, e), !0)
            }
            return !1
        }

        function o(a, b) {
            a === b ? p(a, b) : n(a, b) || p(a, b)
        }

        function p(a, b) {
            a._state === B && (a._state = C, a._detail = b, t.async(r, a))
        }

        function q(a, b) {
            a._state === B && (a._state = C, a._detail = b, t.async(s, a))
        }

        function r(a) {
            m(a, a._state = D)
        }

        function s(a) {
            m(a, a._state = E)
        }
        var t = a.config,
            u = (a.configure, b.objectOrFunction),
            v = b.isFunction,
            w = (b.now, c.all),
            x = d.race,
            y = e.resolve,
            z = f.reject,
            A = g.asap;
        t.async = A;
        var B = void 0,
            C = 0,
            D = 1,
            E = 2;
        i.prototype = {
            constructor: i,
            _state: void 0,
            _detail: void 0,
            _subscribers: void 0,
            then: function(a, b) {
                var c = this,
                    d = new this.constructor(function() {});
                if (this._state) {
                    var e = arguments;
                    t.async(function() {
                        k(c._state, d, e[c._state - 1], c._detail)
                    })
                } else l(this, d, a, b);
                return d
            },
            "catch": function(a) {
                return this.then(null, a)
            }
        }, i.all = w, i.race = x, i.resolve = y, i.reject = z, h.Promise = i
    }), a("promise/race", ["./utils", "exports"], function(a, b) {
        "use strict";

        function c(a) {
            var b = this;
            if (!d(a)) throw new TypeError("You must pass an array to race.");
            return new b(function(b, c) {
                for (var d, e = 0; e < a.length; e++) d = a[e], d && "function" == typeof d.then ? d.then(b, c) : b(d)
            })
        }
        var d = a.isArray;
        b.race = c
    }), a("promise/reject", ["exports"], function(a) {
        "use strict";

        function b(a) {
            var b = this;
            return new b(function(b, c) {
                c(a)
            })
        }
        a.reject = b
    }), a("promise/resolve", ["exports"], function(a) {
        "use strict";

        function b(a) {
            if (a && "object" == typeof a && a.constructor === this) return a;
            var b = this;
            return new b(function(b) {
                b(a)
            })
        }
        a.resolve = b
    }), a("promise/utils", ["exports"], function(a) {
        "use strict";

        function b(a) {
            return c(a) || "object" == typeof a && null !== a
        }

        function c(a) {
            return "function" == typeof a
        }

        function d(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        }
        var e = Date.now || function() {
            return (new Date).getTime()
        };
        a.objectOrFunction = b, a.isFunction = c, a.isArray = d, a.now = e
    }), b("promise/polyfill").polyfill()
}(),
function() {
    "use strict";

    function a(a, b) {
        var c = "";
        if (a && (c = a.toString()), a && ("[object ArrayBuffer]" === a.toString() || a.buffer && "[object ArrayBuffer]" === a.buffer.toString())) {
            var e, g = f;
            a instanceof ArrayBuffer ? (e = a, g += h) : (e = a.buffer, "[object Int8Array]" === c ? g += j : "[object Uint8Array]" === c ? g += k : "[object Uint8ClampedArray]" === c ? g += l : "[object Int16Array]" === c ? g += m : "[object Uint16Array]" === c ? g += o : "[object Int32Array]" === c ? g += n : "[object Uint32Array]" === c ? g += p : "[object Float32Array]" === c ? g += q : "[object Float64Array]" === c ? g += r : b(new Error("Failed to get type for BinaryArray"))), b(g + d(e))
        } else if ("[object Blob]" === c) {
            var s = new FileReader;
            s.onload = function() {
                var a = d(this.result);
                b(f + i + a)
            }, s.readAsArrayBuffer(a)
        } else try {
            b(JSON.stringify(a))
        } catch (t) {
            window.console.error("Couldn't convert value into a JSON string: ", a), b(null, t)
        }
    }

    function b(a) {
        if (a.substring(0, g) !== f) return JSON.parse(a);
        var b = a.substring(s),
            d = a.substring(g, s),
            e = c(b);
        switch (d) {
            case h:
                return e;
            case i:
                return new Blob([e]);
            case j:
                return new Int8Array(e);
            case k:
                return new Uint8Array(e);
            case l:
                return new Uint8ClampedArray(e);
            case m:
                return new Int16Array(e);
            case o:
                return new Uint16Array(e);
            case n:
                return new Int32Array(e);
            case p:
                return new Uint32Array(e);
            case q:
                return new Float32Array(e);
            case r:
                return new Float64Array(e);
            default:
                throw new Error("Unkown type: " + d)
        }
    }

    function c(a) {
        var b, c, d, f, g, h = .75 * a.length,
            i = a.length,
            j = 0;
        "=" === a[a.length - 1] && (h--, "=" === a[a.length - 2] && h--);
        var k = new ArrayBuffer(h),
            l = new Uint8Array(k);
        for (b = 0; i > b; b += 4) c = e.indexOf(a[b]), d = e.indexOf(a[b + 1]), f = e.indexOf(a[b + 2]), g = e.indexOf(a[b + 3]), l[j++] = c << 2 | d >> 4, l[j++] = (15 & d) << 4 | f >> 2, l[j++] = (3 & f) << 6 | 63 & g;
        return k
    }

    function d(a) {
        var b, c = new Uint8Array(a),
            d = "";
        for (b = 0; b < c.length; b += 3) d += e[c[b] >> 2], d += e[(3 & c[b]) << 4 | c[b + 1] >> 4], d += e[(15 & c[b + 1]) << 2 | c[b + 2] >> 6], d += e[63 & c[b + 2]];
        return c.length % 3 === 2 ? d = d.substring(0, d.length - 1) + "=" : c.length % 3 === 1 && (d = d.substring(0, d.length - 2) + "=="), d
    }
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        f = "__lfsc__:",
        g = f.length,
        h = "arbf",
        i = "blob",
        j = "si08",
        k = "ui08",
        l = "uic8",
        m = "si16",
        n = "si32",
        o = "ur16",
        p = "ui32",
        q = "fl32",
        r = "fl64",
        s = g + h.length,
        t = {
            serialize: a,
            deserialize: b,
            stringToBuffer: c,
            bufferToString: d
        };
    "undefined" != typeof module && module.exports ? module.exports = t : "function" == typeof define && define.amd ? define("localforageSerializer", function() {
        return t
    }) : this.localforageSerializer = t
}.call(window),
    function() {
        "use strict";

        function a(a) {
            var b = this,
                c = {
                    db: null
                };
            if (a)
                for (var d in a) c[d] = a[d];
            return new k(function(a, d) {
                var e = l.open(c.name, c.version);
                e.onerror = function() {
                    d(e.error)
                }, e.onupgradeneeded = function() {
                    e.result.createObjectStore(c.storeName)
                }, e.onsuccess = function() {
                    c.db = e.result, b._dbInfo = c, a()
                }
            })
        }

        function b(a, b) {
            var c = this;
            "string" != typeof a && (window.console.warn(a + " used as a key, but it is not a string."), a = String(a));
            var d = new k(function(b, d) {
                c.ready().then(function() {
                    var e = c._dbInfo,
                        f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName),
                        g = f.get(a);
                    g.onsuccess = function() {
                        var a = g.result;
                        void 0 === a && (a = null), b(a)
                    }, g.onerror = function() {
                        d(g.error)
                    }
                })["catch"](d)
            });
            return j(d, b), d
        }

        function c(a, b) {
            var c = this,
                d = new k(function(b, d) {
                    c.ready().then(function() {
                        var e = c._dbInfo,
                            f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName),
                            g = f.openCursor(),
                            h = 1;
                        g.onsuccess = function() {
                            var c = g.result;
                            if (c) {
                                var d = a(c.value, c.key, h++);
                                void 0 !== d ? b(d) : c["continue"]()
                            } else b()
                        }, g.onerror = function() {
                            d(g.error)
                        }
                    })["catch"](d)
                });
            return j(d, b), d
        }

        function d(a, b, c) {
            var d = this;
            "string" != typeof a && (window.console.warn(a + " used as a key, but it is not a string."), a = String(a));
            var e = new k(function(c, e) {
                d.ready().then(function() {
                    var f = d._dbInfo,
                        g = f.db.transaction(f.storeName, "readwrite"),
                        h = g.objectStore(f.storeName);
                    null === b && (b = void 0);
                    var i = h.put(b, a);
                    g.oncomplete = function() {
                        void 0 === b && (b = null), c(b)
                    }, g.onabort = g.onerror = function() {
                        e(i.error)
                    }
                })["catch"](e)
            });
            return j(e, c), e
        }

        function e(a, b) {
            var c = this;
            "string" != typeof a && (window.console.warn(a + " used as a key, but it is not a string."), a = String(a));
            var d = new k(function(b, d) {
                c.ready().then(function() {
                    var e = c._dbInfo,
                        f = e.db.transaction(e.storeName, "readwrite"),
                        g = f.objectStore(e.storeName),
                        h = g["delete"](a);
                    f.oncomplete = function() {
                        b()
                    }, f.onerror = function() {
                        d(h.error)
                    }, f.onabort = function(a) {
                        var b = a.target.error;
                        "QuotaExceededError" === b && d(b)
                    }
                })["catch"](d)
            });
            return j(d, b), d
        }

        function f(a) {
            var b = this,
                c = new k(function(a, c) {
                    b.ready().then(function() {
                        var d = b._dbInfo,
                            e = d.db.transaction(d.storeName, "readwrite"),
                            f = e.objectStore(d.storeName),
                            g = f.clear();
                        e.oncomplete = function() {
                            a()
                        }, e.onabort = e.onerror = function() {
                            c(g.error)
                        }
                    })["catch"](c)
                });
            return j(c, a), c
        }

        function g(a) {
            var b = this,
                c = new k(function(a, c) {
                    b.ready().then(function() {
                        var d = b._dbInfo,
                            e = d.db.transaction(d.storeName, "readonly").objectStore(d.storeName),
                            f = e.count();
                        f.onsuccess = function() {
                            a(f.result)
                        }, f.onerror = function() {
                            c(f.error)
                        }
                    })["catch"](c)
                });
            return j(c, a), c
        }

        function h(a, b) {
            var c = this,
                d = new k(function(b, d) {
                    return 0 > a ? void b(null) : void c.ready().then(function() {
                        var e = c._dbInfo,
                            f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName),
                            g = !1,
                            h = f.openCursor();
                        h.onsuccess = function() {
                            var c = h.result;
                            return c ? void(0 === a ? b(c.key) : g ? b(c.key) : (g = !0, c.advance(a))) : void b(null)
                        }, h.onerror = function() {
                            d(h.error)
                        }
                    })["catch"](d)
                });
            return j(d, b), d
        }

        function i(a) {
            var b = this,
                c = new k(function(a, c) {
                    b.ready().then(function() {
                        var d = b._dbInfo,
                            e = d.db.transaction(d.storeName, "readonly").objectStore(d.storeName),
                            f = e.openCursor(),
                            g = [];
                        f.onsuccess = function() {
                            var b = f.result;
                            return b ? (g.push(b.key), void b["continue"]()) : void a(g)
                        }, f.onerror = function() {
                            c(f.error)
                        }
                    })["catch"](c)
                });
            return j(c, a), c
        }

        function j(a, b) {
            b && a.then(function(a) {
                b(null, a)
            }, function(a) {
                b(a)
            })
        }
        var k = "undefined" != typeof module && module.exports ? require("promise") : this.Promise,
            l = l || this.indexedDB || this.webkitIndexedDB || this.mozIndexedDB || this.OIndexedDB || this.msIndexedDB;
        if (l) {
            var m = {
                _driver: "asyncStorage",
                _initStorage: a,
                iterate: c,
                getItem: b,
                setItem: d,
                removeItem: e,
                clear: f,
                length: g,
                key: h,
                keys: i
            };
            "undefined" != typeof module && module.exports ? module.exports = m : "function" == typeof define && define.amd ? define("asyncStorage", function() {
                return m
            }) : this.asyncStorage = m
        }
    }.call(window),
    function() {
        "use strict";

        function a(a) {
            var b = this,
                c = {};
            if (a)
                for (var d in a) c[d] = a[d];
            c.keyPrefix = c.name + "/", b._dbInfo = c;
            var e = new k(function(a) {
                q === p.DEFINE ? require(["localforageSerializer"], a) : a(q === p.EXPORT ? require("./../utils/serializer") : l.localforageSerializer)
            });
            return e.then(function(a) {
                return m = a, k.resolve()
            })
        }

        function b(a) {
            var b = this,
                c = b.ready().then(function() {
                    for (var a = b._dbInfo.keyPrefix, c = n.length - 1; c >= 0; c--) {
                        var d = n.key(c);
                        0 === d.indexOf(a) && n.removeItem(d)
                    }
                });
            return j(c, a), c
        }

        function c(a, b) {
            var c = this;
            "string" != typeof a && (window.console.warn(a + " used as a key, but it is not a string."), a = String(a));
            var d = c.ready().then(function() {
                var b = c._dbInfo,
                    d = n.getItem(b.keyPrefix + a);
                return d && (d = m.deserialize(d)), d
            });
            return j(d, b), d
        }

        function d(a, b) {
            var c = this,
                d = c.ready().then(function() {
                    for (var b = c._dbInfo.keyPrefix, d = b.length, e = n.length, f = 0; e > f; f++) {
                        var g = n.key(f),
                            h = n.getItem(g);
                        if (h && (h = m.deserialize(h)), h = a(h, g.substring(d), f + 1), void 0 !== h) return h
                    }
                });
            return j(d, b), d
        }

        function e(a, b) {
            var c = this,
                d = c.ready().then(function() {
                    var b, d = c._dbInfo;
                    try {
                        b = n.key(a)
                    } catch (e) {
                        b = null
                    }
                    return b && (b = b.substring(d.keyPrefix.length)), b
                });
            return j(d, b), d
        }

        function f(a) {
            var b = this,
                c = b.ready().then(function() {
                    for (var a = b._dbInfo, c = n.length, d = [], e = 0; c > e; e++) 0 === n.key(e).indexOf(a.keyPrefix) && d.push(n.key(e).substring(a.keyPrefix.length));
                    return d
                });
            return j(c, a), c
        }

        function g(a) {
            var b = this,
                c = b.keys().then(function(a) {
                    return a.length
                });
            return j(c, a), c
        }

        function h(a, b) {
            var c = this;
            "string" != typeof a && (window.console.warn(a + " used as a key, but it is not a string."), a = String(a));
            var d = c.ready().then(function() {
                var b = c._dbInfo;
                n.removeItem(b.keyPrefix + a)
            });
            return j(d, b), d
        }

        function i(a, b, c) {
            var d = this;
            "string" != typeof a && (window.console.warn(a + " used as a key, but it is not a string."), a = String(a));
            var e = d.ready().then(function() {
                void 0 === b && (b = null);
                var c = b;
                return new k(function(e, f) {
                    m.serialize(b, function(b, g) {
                        if (g) f(g);
                        else try {
                            var h = d._dbInfo;
                            n.setItem(h.keyPrefix + a, b), e(c)
                        } catch (i) {
                            ("QuotaExceededError" === i.name || "NS_ERROR_DOM_QUOTA_REACHED" === i.name) && f(i), f(i)
                        }
                    })
                })
            });
            return j(e, c), e
        }

        function j(a, b) {
            b && a.then(function(a) {
                b(null, a)
            }, function(a) {
                b(a)
            })
        }
        var k = "undefined" != typeof module && module.exports ? require("promise") : this.Promise,
            l = this,
            m = null,
            n = null;
        try {
            if (!(this.localStorage && "setItem" in this.localStorage)) return;
            n = this.localStorage
        } catch (o) {
            return
        }
        var p = {
                DEFINE: 1,
                EXPORT: 2,
                WINDOW: 3
            },
            q = p.WINDOW;
        "undefined" != typeof module && module.exports ? q = p.EXPORT : "function" == typeof define && define.amd && (q = p.DEFINE);
        var r = {
            _driver: "localStorageWrapper",
            _initStorage: a,
            iterate: d,
            getItem: c,
            setItem: i,
            removeItem: h,
            clear: b,
            length: g,
            key: e,
            keys: f
        };
        q === p.EXPORT ? module.exports = r : q === p.DEFINE ? define("localStorageWrapper", function() {
            return r
        }) : this.localStorageWrapper = r
    }.call(window),
    function() {
        "use strict";

        function a(a) {
            var b = this,
                c = {
                    db: null
                };
            if (a)
                for (var d in a) c[d] = "string" != typeof a[d] ? a[d].toString() : a[d];
            var e = new k(function(a) {
                    p === o.DEFINE ? require(["localforageSerializer"], a) : a(p === o.EXPORT ? require("./../utils/serializer") : l.localforageSerializer)
                }),
                f = new k(function(d, e) {
                    try {
                        c.db = n(c.name, String(c.version), c.description, c.size)
                    } catch (f) {
                        return b.setDriver(b.LOCALSTORAGE).then(function() {
                            return b._initStorage(a)
                        }).then(d)["catch"](e)
                    }
                    c.db.transaction(function(a) {
                        a.executeSql("CREATE TABLE IF NOT EXISTS " + c.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], function() {
                            b._dbInfo = c, d()
                        }, function(a, b) {
                            e(b)
                        })
                    })
                });
            return e.then(function(a) {
                return m = a, f
            })
        }

        function b(a, b) {
            var c = this;
            "string" != typeof a && (window.console.warn(a + " used as a key, but it is not a string."), a = String(a));
            var d = new k(function(b, d) {
                c.ready().then(function() {
                    var e = c._dbInfo;
                    e.db.transaction(function(c) {
                        c.executeSql("SELECT * FROM " + e.storeName + " WHERE key = ? LIMIT 1", [a], function(a, c) {
                            var d = c.rows.length ? c.rows.item(0).value : null;
                            d && (d = m.deserialize(d)), b(d)
                        }, function(a, b) {
                            d(b)
                        })
                    })
                })["catch"](d)
            });
            return j(d, b), d
        }

        function c(a, b) {
            var c = this,
                d = new k(function(b, d) {
                    c.ready().then(function() {
                        var e = c._dbInfo;
                        e.db.transaction(function(c) {
                            c.executeSql("SELECT * FROM " + e.storeName, [], function(c, d) {
                                for (var e = d.rows, f = e.length, g = 0; f > g; g++) {
                                    var h = e.item(g),
                                        i = h.value;
                                    if (i && (i = m.deserialize(i)), i = a(i, h.key, g + 1), void 0 !== i) return void b(i)
                                }
                                b()
                            }, function(a, b) {
                                d(b)
                            })
                        })
                    })["catch"](d)
                });
            return j(d, b), d
        }

        function d(a, b, c) {
            var d = this;
            "string" != typeof a && (window.console.warn(a + " used as a key, but it is not a string."), a = String(a));
            var e = new k(function(c, e) {
                d.ready().then(function() {
                    void 0 === b && (b = null);
                    var f = b;
                    m.serialize(b, function(b, g) {
                        if (g) e(g);
                        else {
                            var h = d._dbInfo;
                            h.db.transaction(function(d) {
                                d.executeSql("INSERT OR REPLACE INTO " + h.storeName + " (key, value) VALUES (?, ?)", [a, b], function() {
                                    c(f)
                                }, function(a, b) {
                                    e(b)
                                })
                            }, function(a) {
                                a.code === a.QUOTA_ERR && e(a)
                            })
                        }
                    })
                })["catch"](e)
            });
            return j(e, c), e
        }

        function e(a, b) {
            var c = this;
            "string" != typeof a && (window.console.warn(a + " used as a key, but it is not a string."), a = String(a));
            var d = new k(function(b, d) {
                c.ready().then(function() {
                    var e = c._dbInfo;
                    e.db.transaction(function(c) {
                        c.executeSql("DELETE FROM " + e.storeName + " WHERE key = ?", [a], function() {
                            b()
                        }, function(a, b) {
                            d(b)
                        })
                    })
                })["catch"](d)
            });
            return j(d, b), d
        }

        function f(a) {
            var b = this,
                c = new k(function(a, c) {
                    b.ready().then(function() {
                        var d = b._dbInfo;
                        d.db.transaction(function(b) {
                            b.executeSql("DELETE FROM " + d.storeName, [], function() {
                                a()
                            }, function(a, b) {
                                c(b)
                            })
                        })
                    })["catch"](c)
                });
            return j(c, a), c
        }

        function g(a) {
            var b = this,
                c = new k(function(a, c) {
                    b.ready().then(function() {
                        var d = b._dbInfo;
                        d.db.transaction(function(b) {
                            b.executeSql("SELECT COUNT(key) as c FROM " + d.storeName, [], function(b, c) {
                                var d = c.rows.item(0).c;
                                a(d)
                            }, function(a, b) {
                                c(b)
                            })
                        })
                    })["catch"](c)
                });
            return j(c, a), c
        }

        function h(a, b) {
            var c = this,
                d = new k(function(b, d) {
                    c.ready().then(function() {
                        var e = c._dbInfo;
                        e.db.transaction(function(c) {
                            c.executeSql("SELECT key FROM " + e.storeName + " WHERE id = ? LIMIT 1", [a + 1], function(a, c) {
                                var d = c.rows.length ? c.rows.item(0).key : null;
                                b(d)
                            }, function(a, b) {
                                d(b)
                            })
                        })
                    })["catch"](d)
                });
            return j(d, b), d
        }

        function i(a) {
            var b = this,
                c = new k(function(a, c) {
                    b.ready().then(function() {
                        var d = b._dbInfo;
                        d.db.transaction(function(b) {
                            b.executeSql("SELECT key FROM " + d.storeName, [], function(b, c) {
                                for (var d = [], e = 0; e < c.rows.length; e++) d.push(c.rows.item(e).key);
                                a(d)
                            }, function(a, b) {
                                c(b)
                            })
                        })
                    })["catch"](c)
                });
            return j(c, a), c
        }

        function j(a, b) {
            b && a.then(function(a) {
                b(null, a)
            }, function(a) {
                b(a)
            })
        }
        var k = "undefined" != typeof module && module.exports ? require("promise") : this.Promise,
            l = this,
            m = null,
            n = this.openDatabase;
        if (n) {
            var o = {
                    DEFINE: 1,
                    EXPORT: 2,
                    WINDOW: 3
                },
                p = o.WINDOW;
            "undefined" != typeof module && module.exports ? p = o.EXPORT : "function" == typeof define && define.amd && (p = o.DEFINE);
            var q = {
                _driver: "webSQLStorage",
                _initStorage: a,
                iterate: c,
                getItem: b,
                setItem: d,
                removeItem: e,
                clear: f,
                length: g,
                key: h,
                keys: i
            };
            p === o.DEFINE ? define("webSQLStorage", function() {
                return q
            }) : p === o.EXPORT ? module.exports = q : this.webSQLStorage = q
        }
    }.call(window),
    function() {
        "use strict";

        function a(a, b) {
            a[b] = function() {
                var c = arguments;
                return a.ready().then(function() {
                    return a[b].apply(a, c)
                })
            }
        }

        function b() {
            for (var a = 1; a < arguments.length; a++) {
                var b = arguments[a];
                if (b)
                    for (var c in b) b.hasOwnProperty(c) && (arguments[0][c] = n(b[c]) ? b[c].slice() : b[c])
            }
            return arguments[0]
        }

        function c(a) {
            for (var b in g)
                if (g.hasOwnProperty(b) && g[b] === a) return !0;
            return !1
        }

        function d(c) {
            this._config = b({}, k, c), this._driverSet = null, this._ready = !1, this._dbInfo = null;
            for (var d = 0; d < i.length; d++) a(this, i[d]);
            this.setDriver(this._config.driver)
        }
        var e = "undefined" != typeof module && module.exports ? require("promise") : this.Promise,
            f = {},
            g = {
                INDEXEDDB: "asyncStorage",
                LOCALSTORAGE: "localStorageWrapper",
                WEBSQL: "webSQLStorage"
            },
            h = [g.INDEXEDDB, g.WEBSQL, g.LOCALSTORAGE],
            i = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"],
            j = {
                DEFINE: 1,
                EXPORT: 2,
                WINDOW: 3
            },
            k = {
                description: "",
                driver: h.slice(),
                name: "localforage",
                size: 4980736,
                storeName: "keyvaluepairs",
                version: 1
            },
            l = j.WINDOW;
        "undefined" != typeof module && module.exports ? l = j.EXPORT : "function" == typeof define && define.amd && (l = j.DEFINE);
        var m = function(a) {
                var b = b || a.indexedDB || a.webkitIndexedDB || a.mozIndexedDB || a.OIndexedDB || a.msIndexedDB,
                    c = {};
                return c[g.WEBSQL] = !!a.openDatabase, c[g.INDEXEDDB] = !! function() {
                    if ("undefined" != typeof a.openDatabase && a.navigator && a.navigator.userAgent && /Safari/.test(a.navigator.userAgent) && !/Chrome/.test(a.navigator.userAgent)) return !1;
                    try {
                        return b && "function" == typeof b.open && "undefined" != typeof a.IDBKeyRange
                    } catch (c) {
                        return !1
                    }
                }(), c[g.LOCALSTORAGE] = !! function() {
                    try {
                        return a.localStorage && "setItem" in a.localStorage && a.localStorage.setItem
                    } catch (b) {
                        return !1
                    }
                }(), c
            }(this),
            n = Array.isArray || function(a) {
                return "[object Array]" === Object.prototype.toString.call(a)
            },
            o = this;
        d.prototype.INDEXEDDB = g.INDEXEDDB, d.prototype.LOCALSTORAGE = g.LOCALSTORAGE, d.prototype.WEBSQL = g.WEBSQL, d.prototype.config = function(a) {
            if ("object" == typeof a) {
                if (this._ready) return new Error("Can't call config() after localforage has been used.");
                for (var b in a) "storeName" === b && (a[b] = a[b].replace(/\W/g, "_")), this._config[b] = a[b];
                return "driver" in a && a.driver && this.setDriver(this._config.driver), !0
            }
            return "string" == typeof a ? this._config[a] : this._config
        }, d.prototype.defineDriver = function(a, b, d) {
            var g = new e(function(b, d) {
                try {
                    var g = a._driver,
                        h = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver"),
                        j = new Error("Custom driver name already in use: " + a._driver);
                    if (!a._driver) return void d(h);
                    if (c(a._driver)) return void d(j);
                    for (var k = i.concat("_initStorage"), l = 0; l < k.length; l++) {
                        var n = k[l];
                        if (!n || !a[n] || "function" != typeof a[n]) return void d(h)
                    }
                    var o = e.resolve(!0);
                    "_support" in a && (o = a._support && "function" == typeof a._support ? a._support() : e.resolve(!!a._support)), o.then(function(c) {
                        m[g] = c, f[g] = a, b()
                    }, d)
                } catch (p) {
                    d(p)
                }
            });
            return g.then(b, d), g
        }, d.prototype.driver = function() {
            return this._driver || null
        }, d.prototype.ready = function(a) {
            var b = this,
                c = new e(function(a, c) {
                    b._driverSet.then(function() {
                        null === b._ready && (b._ready = b._initStorage(b._config)), b._ready.then(a, c)
                    })["catch"](c)
                });
            return c.then(a, a), c
        }, d.prototype.setDriver = function(a, b, d) {
            function g() {
                h._config.driver = h.driver()
            }
            var h = this;
            return "string" == typeof a && (a = [a]), this._driverSet = new e(function(b, d) {
                var g = h._getFirstSupportedDriver(a),
                    i = new Error("No available storage method found.");
                if (!g) return h._driverSet = e.reject(i), void d(i);
                if (h._dbInfo = null, h._ready = null, c(g)) {
                    if (l === j.DEFINE) return void require([g], function(a) {
                        h._extend(a), b()
                    });
                    if (l === j.EXPORT) {
                        var k;
                        switch (g) {
                            case h.INDEXEDDB:
                                k = require("./drivers/indexeddb");
                                break;
                            case h.LOCALSTORAGE:
                                k = require("./drivers/localstorage");
                                break;
                            case h.WEBSQL:
                                k = require("./drivers/websql")
                        }
                        h._extend(k)
                    } else h._extend(o[g])
                } else {
                    if (!f[g]) return h._driverSet = e.reject(i), void d(i);
                    h._extend(f[g])
                }
                b()
            }), this._driverSet.then(g, g), this._driverSet.then(b, d), this._driverSet
        }, d.prototype.supports = function(a) {
            return !!m[a]
        }, d.prototype._extend = function(a) {
            b(this, a)
        }, d.prototype._getFirstSupportedDriver = function(a) {
            if (a && n(a))
                for (var b = 0; b < a.length; b++) {
                    var c = a[b];
                    if (this.supports(c)) return c
                }
            return null
        }, d.prototype.createInstance = function(a) {
            return new d(a)
        };
        var p = new d;
        l === j.DEFINE ? define("localforage", function() {
            return p
        }) : l === j.EXPORT ? module.exports = p : this.localforage = p
    }.call(window);
/*!
/////////////////////////////////////////////////////////////////////////////
kernel.js
Writen, concatened, modified, optimised, fixed (or wasted) with ♥ by @zombectro
*/
! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$io", function() {
    "use strict";
    var e = Object.prototype.toString,
        t = Function.prototype.toString,
        n = Object.prototype.hasOwnProperty,
        i = Array.prototype.slice;

    function o(e) {
        this.val = e;
        this.type = x(e);
        this.get = function() {
            return this.val
        };
        this.is = function(e) {
            var t = -1,
                n = e.length;
            while (++t < n)
                if (this.type == e[t]) return true;
            return false
        };
        this.isNot = function(e) {
            var t = -1,
                n = e.length;
            while (++t < n)
                if (this.type == e[t]) return false;
            return true
        }
    }

    function r(e) {
        return new o(e)
    }

    function a(t) {
        return e.call(t).slice(8, -1)
    }

    function s(t) {
        return t ? t.constructor.name || e.call(t).slice(8, -1) : t === null ? "Null" : "Undefined"
    }
    r.type = a;
    var l = y(Array.isArray) ? Array.isArray : function(t) {
        return t && typeof t == "object" && typeof t.length == "number" && e.call(t) == "[object Array]" || false
    };

    function u(e) {
        return typeof e == "string" || false
    }

    function c(e) {
        return typeof e == "function" || false
    }

    function f(t) {
        return t && (typeof t !== "object" || t === null) ? false : e.call(t) == "[object Object]"
    }

    function d(e) {
        return typeof e == "number" && isFinite(e) || false
    }

    function p(t) {
        return t && typeof t == "object" && e.call(t) == "[object RegExp]" || false
    }

    function m(t) {
        return t && (typeof t.length == "number" && e.call(t) == "[object Arguments]") || false
    }

    function h(t) {
        return e.call(t) == "[object Number]" && t != +t
    }

    function g(t) {
        return e.call(t) == "[object Number]" && !isFinite(t)
    }

    function y(e) {
        return c(e) && ("" + e).indexOf("[native code]") >= 0
    }

    function v(t) {
        var n;
        return t && typeof t == "object" && e.call(t) == "[object Error]" || false
    }

    function w(e) {
        var t;
        return e && (t = e.constructor) && typeof t == "function" && t.prototype == e
    }

    function b(e) {
        return e && e.nodeType === 1 || false
    }

    function _(t) {
        var n = e.call(t);
        return n == "[object global]" || n == "[object Window]" || n == "[object DOMWindow]"
    }

    function $(t) {
        var n = e.call(t);
        return typeof t === "object" && (n == "[object HTMLCollection]" || n == "[object NodeList]" || n == "[object Object]" && t.hasOwnProperty("length") && (t.length === 0 || typeof t[0] === "object" && t[0].nodeType > 0))
    }

    function x(t) {
        var n = typeof t;
        return n == "string" ? "String" : n == "boolean" ? "Boolean" : n == "function" || false ? "Function" : t === null ? "Null" : t === undefined ? "Undefined" : d(t) ? "Number" : h(t) ? "NaN" : b(t) ? "Element" : l(t) ? "Array" : m(t) ? "Arguments" : g(t) ? "Infinity" : v(t) ? "Error" : t.constructor.name || e.call(t).slice(8, -1)
    }
    r.is = x;
    r.is.arr = r.isArray = l;
    r.is.str = r.isString = u;
    r.is.fun = r.isFunction = c;
    r.is.obj = r.isObject = f;
    r.is.num = r.isNumber = d;
    r.is.reg = r.isRegExp = p;
    r.is.arg = r.isArguments = m;
    r.is.inf = r.isInfinity = g;
    r.is.nat = r.isNative = y;
    r.is.err = r.isError = v;
    r.is.pro = r.isPrototype = w;
    r.is.ele = r.isElement = b;
    r.is.win = r.isWindow = _;
    r.is.nodelist = r.isNodeList = $;

    function C(e) {
        if (!e) return [];
        return Object.keys(e)
    }

    function E(e, t) {
        var n;
        for (n in e) {
            aI = e[n];
            bI = t[n];
            if (e.hasOwnProperty(n) != t.hasOwnProperty(n)) return false;
            if (typeof aI != typeof bI) return false
        }
        for (n in t) {
            aI = e[n];
            bI = t[n];
            if (!e.hasOwnProperty(n)) return false;
            if (aI === bI) continue;
            if (typeof aI != typeof bI) return false;
            if (!t.hasOwnProperty(n)) continue;
            else if (l(aI) && l(bI) && O(aI, bI)) continue;
            else if (f(aI) && f(bI) && E(aI, bI)) continue;
            return false
        }
        return true
    }

    function L(e, t) {
        var n;
        for (n in e)
            if (e.hasOwnProperty(n)) t(e[n], n)
    }

    function k(e, t) {
        var n;
        for (n in e)
            if (e.hasOwnProperty(n)) {
                if (t(e[n], n) === false) break
            }
    }

    function N(e) {
        try {
            return JSON.stringify(e, null, 2)
        } catch (t) {
            try {
                var n = [];
                $io.arr.all(e, function(e) {
                    n.push(e)
                });
                return "[" + n.join(", ") + "]"
            } catch (i) {
                return "[Error]"
            }
        }
    }

    function j(e, t, n) {
        var i = 0,
            o = $io.reg.escape(n),
            r = new RegExp("^" + o + "|" + o + "$", "gi"),
            a;
        n = n || ".";
        t = t.replace(r, "").split(n);
        while (e && i < t.length) e = e[t[i++]];
        return e
    }

    function I(e, t, n) {
        var i = 0,
            o = $io.reg.escape(n),
            r = new RegExp("^" + o + "|" + o + "$", "gi"),
            a;
        n = n || ".";
        t = t.replace(r, "").split(n);
        while (e && i < t.length) {
            if (e[t[i]]) {
                e = e[t[i]]
            } else {
                e = e[t[i]] = {}
            }
            i++
        }
        return e
    }
    r.obj = r.Object = {};
    r.obj.all = L;
    r.obj.each = k;
    r.obj.equal = E;
    r.obj.str = N;
    r.obj.getPath = j;
    r.obj.setPath = I;

    function O(e, t) {
        var n = e.length;
        if (n != t.length) return false;
        while (n--) {
            aI = e[n];
            bI = t[n];
            if (aI === bI) continue;
            else if (l(aI) && l(bI) && O(aI, bI)) continue;
            else if (f(aI) && f(bI) && E(aI, bI)) continue;
            return false
        }
        return true
    }

    function T(e, t) {
        var n = -1,
            i = e.length;
        while (++n < i) t(e[n])
    }

    function A(e, t) {
        var n = -1,
            i = e.length;
        while (++n < i)
            if (t(e[n], n) === false) break
    }

    function M(e, t, n) {
        var i = n;
        for (var o = 0, r = e.length; o < r; o++) {
            i = t(i, e[o], o, e)
        }
        return i
    }

    function S(e) {
        return e[Math.floor(Math.random() * e.length)]
    }
    r.arr = r.Array = {};
    r.arr.all = T;
    r.arr.each = A;
    r.arr.equal = O;
    r.arr.reduce = M;
    r.arr.random = S;
    r.str = {};
    r.str.truncate = function(e, t) {
        return e.length > t ? e.slice(0, t) + "..." : e
    };
    r.str.slug = function(e) {
        return e.toLowerCase().replace(/ +/g, "-").replace(/[^-\w]/g, "")
    };
    r.str.trim = function(e) {
        var t, n;
        for (t = 0, n = e.length - 1; t <= n; t++) {
            if (e.charCodeAt(t) < 33) continue;
            else break
        }
        for (; n >= t; n--) {
            if (e.charCodeAt(n) < 33) continue;
            else break
        }
        return e.substring(t, n + 1)
    };
    r.str.camel = function(e) {
        return e.replace(/(\-[a-z])/g, function(e) {
            return e.toUpperCase().replace("-", "")
        })
    };
    r.str.dash = function(e) {
        return e.replace(/([A-Z])/g, function(e) {
            return "-" + e.toLowerCase()
        })
    };
    r.str.autolink = function(e) {
        var t = [],
            n = 0;
        return e.replace(/(?:\(((?:https?:\/\/|www\.)[-A-Za-z0-9+$&@#\/%?=~_()|!:,.;]*[-A-Za-z0-9+$&@#\/%=~_()|])\))/gm, function(e, n) {
            t.push(n);
            return "_links_in_parens___ktlu_"
        }).replace(/((?:https?:\/\/|www\.)[-A-Za-z0-9+$&@#\/%?=~_()|!:,.;]*[-A-Za-z0-9+$&@#\/%=~_()|])/gm, function(e) {
            return '<a target="_blank" href="' + (e.indexOf("www.") == 0 ? "http://" + e : e) + '">' + e + "</a>"
        }).replace(/(^|[^@\w])@(\w{1,15})\b/g, '$1<a target="_blank" href="http://twitter.com/$2">@$2</a>').replace(/([\w.]*\w@[\w.]+\w)/gm, '<a href="mailto:$1">$1</a>').replace(/_links_in_parens___ktlu_/g, function() {
            var e = t[n++];
            return '(<a target="_blank" href="' + e + '">' + e + "</a>)"
        })
    };

    function z(e, t) {
        "use strict";
        if (!e || typeof e != "function") return "_not_a_function_";
        return t(e)
    }

    function H(e, t) {
        return z(e, function() {
            var n = t ? /^function[\W\w]*?{/ : null,
                i = t ? /\s+\}$/ : null,
                o = e.toString().replace(n, "").replace(i, ""),
                a = o.match(/(^\s*)/gm),
                s = a ? a.length > 1 ? a.slice(1).reduce(function(e, t) {
                    return e.length < t.length ? e : t
                }) : a[0] : "";
            return r.str.trim(o.replace(new RegExp("^" + o.match(s), "gm"), "").replace(/^\t/gm, "  "))
        })
    }

    function R(e) {
        if (e.name) return e.name;
        return z(e, function() {
            var t = e.toString().match(/^\s*function ([^\(\s]+)/);
            return t && t[1] || "anonymous"
        })
    }

    function D(e) {
        if (!e.length) return [];
        return z(e, function() {
            var t = e.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, ""),
                n = t.slice(t.indexOf("(") + 1, t.indexOf(")")).match(/([^\s,]+)/g);
            return n === null ? [] : n
        })
    }
    r.fn = {};
    r.fn.str = H;
    r.fn.outer = H;
    r.fn.inner = function(e) {
        return H(e, true)
    };
    r.fn.name = R;
    r.fn.arg = D;
    r.fn.prop = r.fn.keys = function q(e) {
        if (!e) return [];
        return Object.keys(e)
    };
    r.fn.method = r.fn.meth = function(e) {
        var t = C(e),
            n = -1,
            i = t.length,
            o = {};
        while (++n < i) {
            o[t[n]] = e[t[n]]
        }
        return o
    };
    r.fn.throttle = function(e, t) {
        var n = false;
        return function() {
            if (!n) {
                e.apply(this, arguments);
                n = true;
                setTimeout(function() {
                    n = false
                }, t)
            }
        }
    };
    r.fn.debounce = function(e, t) {
        var n;
        return function() {
            var i = this,
                o = arguments;
            clearTimeout(n);
            n = setTimeout(function() {
                e.apply(i, o)
            }, t)
        }
    };

    function P(e) {
        return i.call(e)
    }
    r.arg = {};
    r.arg.arr = P;
    r.reg = {};
    r.reg.escape = function(e) {
        return e.replace(/[-[\]{}()*+?.\\^$|]/g, "\\$&")
    };
    r.each = function(e, t, i) {
        if (e) {
            if (f(e)) {
                for (var o in e) {
                    if (n.call(e, o)) {
                        if (t.call(i, e[o], o, e) === false) break
                    }
                }
            } else {
                for (var o = 0, r = e.length; o < r; o++) {
                    if (t.call(i, e[o], o, e) === false) break
                }
            }
        }
    };
    return r
});
var $url = {
    query: function() {
        var e = {};
        var t = window.location.search.substring(1);
        var n = t.split("&");
        for (var i = 0; i < n.length; i++) {
            var o = n[i].split("=");
            if (typeof e[o[0]] === "undefined") {
                e[o[0]] = o[1]
            } else if (typeof e[o[0]] === "string") {
                var r = [e[o[0]], o[1]];
                e[o[0]] = r
            } else {
                e[o[0]].push(o[1])
            }
        }
        return e
    }(),
    parseQuery: function(e) {
        return $io.arr.reduce(e.replace("?", "").split("&"), function(e, t) {
            var n = t.indexOf("="),
                i = t.slice(0, n),
                o = t.slice(++n);
            e[i] = decodeURIComponent(o);
            return e
        }, {})
    },
    getExtention: function(e) {
        var t = e.match(/(?:\.)([0-9a-z]+)(?:[!?].+)?$/);
        return t && t[1] ? t[1] : ""
    },
    getDomain: function(e) {
        var t = e.match(/:\/\/(.[^/]+)/);
        if (t != null && t.length >= 2) {
            return t[1]
        } else {
            return null
        }
    },
    checkImage: function(e, t) {
        var n = new Image;
        n.onload = i;
        n.onerror = i;
        n.onabort = i;
        n.src = e;

        function i() {
            if (n.width > 0) t(true, n);
            else t(false, n)
        }
    },
    checkFavicon: function(e, t) {
        if (e && $io.str.trim(e) != "") {
            var n = $url.getDomain(e),
                i;
            if (n) {
                $url.checkImage(i = "http://" + n + "/favicon.ico", function(e) {
                    if (e) t(true, i);
                    else $url.checkImage(i = "http://" + n + "/favicon.gif", function(e) {
                        if (e) t(true, i);
                        else $url.checkImage(i = "http://" + n + "/favicon.png", function(e) {
                            if (e) t(true, i);
                            else t(false)
                        })
                    })
                })
            }
        }
    }
};
var $dom = {
    getSelection: function() {
        var e = "";
        if (window.getSelection) {
            e = window.getSelection().toString()
        } else if (document.selection && document.selection.type != "Control") {
            e = document.selection.createRange().text
        }
        return e
    }
};

function $noop() {}! function(e) {
    "use strict";
    var t = Object.prototype.toString,
        n = Object.prototype.hasOwnProperty,
        i = Array.prototype.slice;
    e["$is"] = function o(e, n) {
        return n ? t.call(e).indexOf("[object " + n) == 0 : t.call(e).replace(/\[object |\]/g, "")
    };
    e["$slice"] = function r(e, t, n) {
        var o = t && n ? [t, n] : t ? [t] : [1];
        return i.apply(e, o)
    };
    e["$extend"] = function a(e) {
        var t, o, r, s;
        if (typeof e == "boolean" || typeof e == "string") {
            t = i.call(arguments, 1);
            e = e === true ? "deep" : e
        } else {
            t = arguments;
            e = false
        }
        o = t[0];
        for (r = 1, s = t.length; r < s; r++) {
            var l = t[r];
            for (var u in l) {
                var c = l[u];
                if (e == "strict" && !n.call(o, u)) continue;
                if (e == "deep" && typeof c === "object" && typeof o[u] !== "undefined") a(e, o[u], c);
                else o[u] = c
            }
        }
        return o
    }
}(this);
! function(e) {
    "use strict";
    var t;

    function n(e, n) {
        t = e.style.webkitTransform;
        e.style.webkitTransform = "scale(1)";
        n.call(e);
        e.style.webkitTransform = t
    }
    e.$repaint = n
}(this);
! function(e) {
    "use strict";
    e["Howl"] = e["Howl"] || function() {
        this.play = $noop;
        this.pause = $noop
    };
    var t = {};

    function n(e, n) {
        var i;
        if (typeof e === "string") {
            if (t[e]) {
                i = t[e]
            } else {
                i = new Howl({
                    buffer: !!n,
                    urls: [e]
                });
                t[e] = i
            }
        } else {
            return new Howl(e)
        }
        return i
    }
    n.config = function(e) {
        return new Howl(e)
    };
    n.stream = function(e) {
        return n(e, true)
    };
    e.$sound = n
}(this);

function $date(e) {
    var t = e * 1 == e ? new Date(e * 1e3) : $nfo.isie ? Date.parse(e.replace(/( \+)/, " UTC$1")) : new Date(Date.parse(e)),
        n = new Date,
        i = Math.floor((n - t) / 1e3),
        o = t.toLocaleDateString();
    if (i < 60) i = i + "s";
    else if (i <= 3540) i = Math.round(i / 60) + "m";
    else if (i <= 5400) i = "1h";
    else if (i <= 86400) i = Math.round(i / 3600) + "h";
    else if (i <= 129600) i = "1d";
    else if (i < 604800) i = Math.round(i / 86400) + "d";
    else if (i <= 777600) i = "1w";
    else i = o;
    return {
        diff: i,
        human: o,
        date: t
    }
}! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$route", function() {
    "use strict";
    var e;
    if ("pushState" in history) {
        e = function(e) {
            if (e) {
                window.location.hash = "#!" + encodeURI(e)
            } else if (window.location.hash) {
                history.pushState("", document.title, window.location.pathname + window.location.search)
            }
        }
    } else {
        e = function(e) {
            window.location.hash = e ? "#!" + encodeURI(e) : ""
        }
    }
    return e
});

function $watch(e, t) {
    "use strict";
    var n = {};
    var i = Array.prototype.slice;
    var t = t;
    e.observers = n;
    e.on = function(e, t) {
        e.replace(/\S+/g, function(e, i) {
            (n[e] = n[e] || []).push(t)
        });
        return t
    };
    e.off = function(e, t) {
        if (e === "*") n = {};
        else if (t) {
            var i = n[e];
            for (var o = 0, r; r = i && i[o]; ++o) {
                if (r === t) {
                    i.splice(o, 1);
                    o--
                }
            }
        } else {
            e.replace(/\S+/g, function(e) {
                n[e] = []
            })
        }
        return t
    };
    e.trigger = function(e) {
        var i = n[e],
            o = $slice(arguments);
        if (i) {
            for (var r = 0, a = i.length; r < a; r++) {
                i[r].apply(t, o)
            }
        }
        var s = {
            done: function(e) {
                if (typeof e == "function") e.call(t)
            },
            trigger: this.trigger
        };
        return s
    };
    e.scope = function(e) {
        t = e
    };
    return e
}

function $filter(e, t, n) {
    var i = [];
    $io.each(e, function(e, o, r) {
        if (n && ($is(e, "Array") || $is(e, "Object"))) i = i.concat($filter(e, t, n));
        else if (t(e, o, r)) i.push(e)
    });
    return i
}

function $map(e, t, n, i, o) {
    var r = [];
    $io.each(e, function(e, a, s) {
        if (n && ($is(e, "Array") || $is(e, "Object"))) {
            r = r.concat($map(e, t, n, (i ? i + (o || ".") : "") + a, o))
        } else {
            var l = t(e, a, s, i);
            if (l) r.push(l)
        }
    });
    return r
}

function $sync(e, t, n) {
    var i = t ? function() {
        e.apply(n, t)
    } : e;
    setTimeout(i, 0)
}! function(e) {
    "use strict";
    var t = e.localStorage,
        n = null,
        i, o = {};
    if (n) {
        i = n
    } else if (t) {
        i = {
            setItem: function(e, n, i) {
                t.setItem(e, JSON.stringify(n));
                i(null, n)
            },
            getItem: function(e, n) {
                var i = t.getItem(e);
                var o = false;
                try {
                    i = JSON.parse(i);
                    o = true
                } catch (r) {}
                n(null, i, o)
            },
            removeItem: function(e, n) {
                t.removeItem(e);
                n(null)
            },
            clear: function(e) {
                t.clear();
                e(null)
            }
        }
    } else {
        (e.$error || e.alert)("Your browser do not support local save")
    }

    function r(e, t, n, i) {
        o[t] = i;
        r.get(t, function(t, i) {
            n(t, i || e)
        })
    }
    r.set = function(e, t, n) {
        i.setItem(e, t, n || $noop)
    };
    r.del = function(e, t) {
        i.removeItem(e, t || $noop);
        o[e] = null
    };
    r.get = function(e, t) {
        i.getItem(e, t || $noop)
    };
    r.clear = function(e) {
        i.clear(e || $noop);
        for (var t in o) {
            if (o.hasOwnProperty(t)) {
                o[t] = null
            }
        }
    };
    r.save = function(e, t) {
        o[e] = t
    };
    window.addEventListener("beforeunload", function() {
        for (var e in o) {
            if (o.hasOwnProperty(e) && typeof o[e] == "function") {
                var t = o[e]();
                if (e == "notes") {}
                r.set(e, t)
            }
        }
    });
    e["$db"] = r
}(this);
! function(e) {
    var t = window.localStorage,
        n = {};

    function i(e, t, o) {
        n[t] = o;
        return i.get(t) || e
    }
    i.set = function(e, n) {
        if (n === undefined) {
            return t.removeItem(e)
        }
        t.setItem(e, JSON.stringify(n));
        return n
    };
    i.get = function(e) {
        var n = t.getItem(e);
        return n ? JSON.parse(n) : null
    };
    i.save = function(e, t) {
        n[e] = t
    };
    i.clear = function() {
        t.clear();
        for (var e in n) {
            if (n.hasOwnProperty(e)) {
                n[e] = null
            }
        }
    };
    window.addEventListener("beforeunload", function() {
        for (var e in n) {
            if (n.hasOwnProperty(e) && typeof n[e] == "function") i.set(e, n[e]())
        }
    });
    e["$dbls"] = i
}(this);

function $find(e, t, n, i) {
    "use strict";
    var o = i || "/",
        r = $io.obj.getPath(n, t, o),
        a;
    if (t.slice(-1) !== o) t = t + o;
    if (t.slice(0, 1) !== o) t = o + t;
    e.replace(/^\/(.*)\/(.{0,4})$/, function(t, n, i) {
        if (n) e = i ? new RegExp(n, i) : new RegExp(n)
    });
    a = $is(e, "RegExp") ? e : new RegExp($io.reg.escape(e), "i");
    return $map(r, function(e, n, i, r) {
        return a.test(e) ? t + (r ? r + o : "") + e : false
    }, true, null, o)
}

function $chain() {
    "use strict";

    function e(e, t, n) {
        Object.defineProperty(e, n, {
            get: function() {
                var e = t();
                return e === undefined ? this : e
            }
        })
    }

    function t(e, t, n) {
        e[n] = function() {
            var e = t.apply(this, arguments);
            return e === undefined ? this : e
        }
    }

    function n(i, o, r) {
        if ($is(o, "Object")) {
            $io.obj.all(o, function(n, o) {
                if (r === true) e(i, n, o);
                else t(i, n, o);
                if (r === "both") {
                    e(i, n, o);
                    t(i, n, o)
                }
            })
        }
        return $is(r, "Object") ? n(i, r, true) : i
    }
    var i = n.apply(null, arguments);
    i["prop"] = function(e) {
        return n(this, e, true)
    };
    i["meth"] = function(e) {
        return n(this, e)
    };
    return i
}
var $config = function() {
    var e = {},
        t = {},
        n = {},
        i = 0;
    return function(o, r) {
        t[i] = $extend({}, o);
        e[i] = o;
        var a = i,
            s = r,
            l = this;
        r = function() {
            var t = s.apply(l, arguments);
            if (n[a]) {
                $extend(e[a], n[a]);
                n[a] = null
            }
            return t
        };
        $chain(r, {
            config: function(n) {
                $extend(e[a], t[a], n)
            },
            temp: function(i) {
                n[a] = $extend({}, e[a]);
                $extend(e[a], t[a], i)
            },
            set: function(t, n) {
                e[a][t] = n
            },
            end: r
        });
        i++;
        return r
    }
}();
! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$template", function() {
    "use strict";
    return function(e, t) {
        return e.replace(/\{\{(#.*|.*?)\}\}/gm, function(e, n) {
            if (n.indexOf("#if") == 0) {
                var i = n.substring(4, n.indexOf("}}"));
                if (t[i]) return $template(n.substring(6 + i.length).replace("{{/if", ""), t);
                else return ""
            }
            return t[n] || ""
        })
    }
});
! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$ajax", function() {
    "use strict";

    function e(e) {
        return e === Object(e)
    }

    function t(t) {
        if (!e(t)) return t;
        var n = [];
        for (var i in t) {
            if (null != t[i]) {
                n.push(encodeURIComponent(i) + "=" + encodeURIComponent(t[i]))
            }
        }
        return n.join("&")
    }

    function n(e) {
        var t, n;
        try {
            t = JSON.parse(e.responseText);
            n = true
        } catch (i) {
            t = e.responseText;
            n = false
        }
        return [t, e.status, e, n]
    }

    function i() {
        if (window.XMLHttpRequest && ("file:" != window.location.protocol || !window.ActiveXObject)) {
            return new XMLHttpRequest
        } else {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0")
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0")
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP")
            } catch (e) {}
        }
        return false
    }

    function o(e, o, r) {
        var a = i(),
            s = {
                done: function() {},
                fail: function() {},
                guest: function() {}
            },
            l = {
                done: function(e) {
                    s.done = e;
                    return l
                },
                fail: function(e) {
                    s.fail = e;
                    return l
                },
                guest: function(e) {
                    s.guest = e;
                    return l
                }
            };
        if (o) {
            a.open(e, o, true);
            a.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            a.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            if (r && r._token) {
                a.setRequestHeader("X-CSRF-Token", r._token)
            }
            a.onreadystatechange = function() {
                if (a.readyState === 4) {
                    if (a.status >= 200 && a.status < 300) {
                        s.done.apply(s, n(a))
                    } else if (a.status == 401) {
                        s.guest.call(s, a.statusText, {
                            type: e.toLowerCase(),
                            url: o,
                            data: r
                        })
                    } else {
                        s.fail.apply(s, n(a))
                    }
                }
            };
            a.send(t(r))
        } else {
            s.fail.call(s)
        }
        return l
    }

    function r(e, t, n, i) {
        var r = o("GET", e);
        r.done(t || $noop);
        r.fail(n || $noop);
        r.guest(i || $noop)
    }
    r.get = function(e) {
        return o("GET", e)
    };
    r.post = function(e, t) {
        return o("POST", e, t)
    };
    r.delete = function(e) {
        return o("DELETE", e)
    };
    r.put = function(e, t) {
        return o("PUT", e, t)
    };
    return r
});
! function(e) {
    "use strict";
    var t = function(e) {
        if (!e) return;
        var t = e.prototype;
        e.prototype.matches = t.matches || t.matchesSelector || t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector || t.oMatchesSelector;
        return t.matches || t.matchesSelector || t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector || t.oMatchesSelector
    }(Element);

    function n(e) {
        return /^#[a-z0-9\-_]+$/i.test(e)
    }
    var i = [];

    function o(e, o) {
        var e = e || {};
        if (typeof e == "string") {
            if (n(e)) e = (o || document).getElementById(e);
            else(o || document).querySelector(e)
        }
        if (e.nodeType !== 1) e = document;
        var r, a = true;
        $io.arr.all(i, function(t) {
            if (t.elem.isEqualNode(e)) a = false
        });
        if (a) i.push({
            elem: e
        });
        return r = {
            get: function() {
                return e
            },
            hasClass: function(t) {
                return e.classList.contains(t)
            },
            addClass: function(t) {
                e.classList.add(t);
                return r
            },
            removeClass: function(t) {
                e.classList.remove(t);
                return r
            },
            toggleClass: function(t) {
                e.classList.toggle(t);
                return r
            },
            html: function(t) {
                if (!t) return e.innerHTML;
                else e.innerHTML = t;
                return r
            },
            add: function(t) {
                e.innerHTML = e.innerHTML + t;
                return r
            },
            append: function(t) {
                var n;
                if (typeof t == "string") {
                    n = document.createElement("div");
                    n.innerHTML = t;
                    nods = n.childNodes;
                    for (var i = 0, o = nods.length; i < o; i++) e.appendChild(nods[i])
                } else e.appendChild(t);
                return r
            },
            data: function(t) {
                var n = {};
                $io.obj.all(e.attributes, function(e) {
                    if (/^data-/.test(e.name)) {
                        var t = e.name.substr(5).replace(/-(.)/g, function(e, t) {
                            return t.toUpperCase()
                        });
                        n[t] = !e.value && typeof e.value == "string" ? true : e.value
                    }
                });
                if (t) return n[t];
                else return n
            },
            on: function(n, o, a) {
                if (!a) a = o, o = null;
                var s = function(e, n) {
                    return function(i) {
                        if (e) {
                            var o = i.target;
                            while (o && o.nodeType == 1 && !t.call(o, e)) o = o.parentNode;
                            if (!o || o.nodeType == 9) return;
                            n.call(o, i);
                            i.preventDefault();
                            i.stopPropagation();
                            i.stopImmediatePropagation();
                            return false
                        } else {
                            n(i)
                        }
                    }
                }(o, a);
                n.replace(/[^\s,]+/g, function(t, n) {
                    $io.arr.all(i, function(n) {
                        if (n.elem.isEqualNode(e)) {
                            n.attach = {
                                name: t,
                                childs: o,
                                handler: a,
                                scopeHandler: s
                            }
                        }
                    });
                    e.addEventListener(t, s, false)
                });
                return r
            },
            off: function(t, n, o) {
                if (!o) o = n, n = null;
                t.replace(/[^\s,]+/g, function(t, r) {
                    $io.arr.all(i, function(i) {
                        if (i.elem.isEqualNode(e)) {
                            if (i.attach.name == t && i.attach.childs == n && i.attach.handler == o) {
                                e.removeEventListener(t, i.attach.scopeHandler, false)
                            }
                        }
                    })
                });
                return r
            }
        }
    }
    o.create = function(e, t, n, i, o) {
        var r = document.createElement(e);
        for (var a = 0; a < Object.keys(n).length; a++) {
            var s = Object.keys(n)[a],
                l = n[s],
                u = document.createAttribute(s);
            u.value = l;
            r.setAttributeNode(u)
        }
        if (i) {
            for (var c = 0; c < i.length; c++) {
                r.appendChild(i[c])
            }
        }
        if (t) r.appendChild(document.createTextNode(t));
        if (o) {
            var f = o;
            f.appendChild(r)
        }
        return r
    };
    e.$el = o
}(this);
! function(e) {
    "use strict";
    $geo = function() {
        console.log()
    };
    $geo.intersectRect = function(e, t) {
        return !(t.left > e.right || t.right < e.left || t.top > e.bottom || t.bottom < e.top)
    };
    $geo.angleFromPointAandB = function(e, t) {
        var n = 0;
        var i = [];
        i[0] = t[0] - e[0];
        i[1] = t[1] - e[1];
        if (i[0] == 0) {
            n = 90
        } else {
            n = Math.atan(Math.floor(Math.abs(i[1])) / Math.floor(Math.abs(i[0])))
        }
        n = Math.min(90, Math.round(n * 115 / 2));
        if (i[0] > 0 && i[1] < 0) {
            n = 90 + (90 - n)
        } else {
            if (i[0] > 0 && i[1] >= 0) {
                n = 180 + n
            } else {
                if (i[0] <= 0 && i[1] >= 0) {
                    n = 270 + (90 - n)
                }
            }
        }
        n = n % 360;
        return n
    };
    $geo.pointFromPointAngleRadius = function(e, t, n) {
        newPoint = [0, 0];
        newPoint[0] = e[0] + Math.cos(t * 3.14 / 180) * Math.floor(n);
        newPoint[1] = e[1] + Math.sin(t * 3.14 / 180) * Math.floor(n);
        return newPoint
    };
    e.$geo = $geo
}(this);

function $geo() {
    "use strict"
}! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$key", function() {
    "use strict";
    var e = 0,
        t = {},
        n = {},
        i = {},
        o = {
            shift: false,
            alt: false,
            ctrl: false,
            meta: false
        },
        r = {
            0: "\\",
            8: "backspace",
            9: "tab",
            12: "num",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "caps",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            44: "print",
            45: "insert",
            46: "delete",
            91: "cmd",
            92: "cmd",
            93: "cmd",
            106: "num_multiply",
            107: "num_add",
            108: "num_enter",
            109: "num_subtract",
            110: "num_decimal",
            111: "num_divide",
            124: "print",
            144: "num",
            145: "scroll",
            224: "cmd",
            225: "altgr",
            57392: "ctrl",
            63289: "num"
        };
    for (var a = 1; a < 20; ++a) r[111 + a] = "f" + a;
    for (a = 0; a <= 9; ++a) r[a + 96] = "num_" + a;
    for (var s in r) {
        if (r.hasOwnProperty(s)) {
            var l = r[s];
            if (i[l]) i[l].push(s);
            else i[l] = [s]
        }
    }

    function u(e) {
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
        e.stopImmediatePropagation()
    }
    var c;

    function f(e) {
        e = e || window.event;
        if (typeof e.which !== "number") e.which = e.keyCode;
        var t, i, o;
        if (e.type == "keydown") {
            i = String.fromCharCode(e.which).toLowerCase();
            if (r[e.which]) {
                t = r[e.which];
                c = t === "shift" ? null : t
            }
            if (n["ctrl"] || n["shift"] || n["cmd"] || n["meta"] || n["alt"] || n["altgr"]) {
                t = t || i
            }
            n[t || i] = true
        }
        if (e.type == "keypress" && !c) {
            t = String.fromCharCode(e.which)
        }
        if (e.type == "keyup") {
            c = null;
            o = String.fromCharCode(e.which).toLowerCase();
            if (r[e.which]) o = r[e.which];
            n[o] = false
        }
        if (t) d(t, e.which, e)
    }

    function d(e, n, i) {
        var o;
        if (o = t[i.target.getAttribute("data-keyboard-id")]) {
            if (o.call(i.target, e, n, i) === false) {
                u(i)
            }
        } else if (p) {
            if (p(e, n, i) === false) {
                u(i)
            }
        }
    }
    var p, m = document.documentElement;
    m.addEventListener("keydown", f, false);
    m.addEventListener("keypress", f, false);
    m.addEventListener("keyup", f, false);
    var h = function(i, o) {
        if (typeof i == "string") {
            return n[i]
        }
        if (typeof i == "function") {
            p = i
        }
        if (i && typeof o == "function") {
            t[++e] = o;
            i.setAttribute("data-keyboard-id", e);
            if (!i.getAttribute("tabindex")) i.setAttribute("tabindex", "0");
            i.addEventListener("keydown", f, false);
            i.addEventListener("keypress", f, false);
            i.addEventListener("keyup", f, false)
        }
    };
    h.up = function(e, t) {
        if (e && typeof t == "function") {
            if (!e.getAttribute("tabindex")) e.setAttribute("tabindex", "0");
            e.addEventListener("keyup", function(e) {
                e = e || window.event;
                if (typeof e.which !== "number") e.which = e.keyCode;
                var n = String.fromCharCode(e.which).toLowerCase();
                if (r[e.which]) {
                    n = r[e.which]
                }
                if (t(n, e) === false);
            }, false)
        }
    };
    h.down = function(e, t) {
        if (e && typeof t == "function") {
            if (!e.getAttribute("tabindex")) e.setAttribute("tabindex", "0");
            e.addEventListener("keydown", function(e) {
                e = e || window.event;
                if (typeof e.which !== "number") e.which = e.keyCode;
                var n = String.fromCharCode(e.which).toLowerCase();
                if (r[e.which]) {
                    n = r[e.which]
                }
                if (t(n, e) === false);
            }, false)
        }
    };
    return h
});
! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$wheel", function() {
    "use strict";
    var e = {},
        t = 0,
        n = {
            noscroll: false,
            handler: null,
            delay: 0
        };
    return function(i, o, r) {
        if (typeof i == "object" && !(i instanceof HTMLElement)) return n = i;
        var a = i,
            r = r || n,
            s = r.noscroll || n.noscroll,
            l = r.delay || n.delay,
            u = r.handler || n.handler,
            c;
        if (i + "" === i) {
            i = document.getElementById(a);
            if (!i) i = document.querySelectorAll(a)[0]
        }
        if (!i) return;
        t++;
        e[t] = o;

        function f(n) {
            var o = Math.max(-1, Math.min(1, n.wheelDelta || -n.detail));
            e[t].call(i, o);
            return false
        }

        function d(e) {
            e = window.event || e;
            if (u) {
                if (u.isEqualNode(e.target)) {
                    e.preventDefault();
                    f(e)
                }
            } else if (s) {
                e.preventDefault();
                f(e)
            } else {
                f(e)
            }
        }

        function p(e) {
            e.preventDefault();
            clearTimeout(c);
            c = setTimeout(function() {
                h()
            }, l)
        }

        function m(e) {
            e.preventDefault();
            g();
            clearTimeout(c)
        }
        i.addEventListener("mouseenter", l ? p : function(e) {
            h()
        }, false);
        i.addEventListener("mouseleave", l ? m : function(e) {
            g()
        }, false);

        function h() {
            i.addEventListener("mousewheel", d, false);
            i.addEventListener("DOMMouseScroll", d, false)
        }

        function g() {
            i.removeEventListener("mousewheel", d, false);
            i.removeEventListener("DOMMouseScroll", d, false)
        }
    }
});
! function(e) {
    "use strict";

    function t(e, t) {
        if (typeof e != "string") return "";
        var n = [],
            i = 0,
            o = [],
            r = 0,
            a = [],
            s = 0;

        function l(e) {
            e = e.replace(/&/g, "²_amp__²").replace(/"/g, "²_quot__²").replace(/'/g, "²_squot__²").replace(/</g, "²_less__²").replace(/>/g, "²_more__²");
            e = $io.str.autolink(e);
            e = e.replace(/²_amp__²/g, "&amp;").replace(/²_quot__²/g, "&quot;").replace(/²_squot__²/g, "&#39;").replace(/²_less__²/g, "&lt;").replace(/²_more__²/g, "&gt;");
            return e
        }
        return (t ? "" : '<div class="sh_function">') + e.replace(/\b(class)\b/g, "<span class=sh_keyword>$1</span>").replace(/("((\\"|[^"])*)")|('((\\'|[^'])*)')/g, function(e) {
            n.push(e);
            return "_string___ktlu_"
        }).replace(/(\/\*[\W\w]*?\*\/|\/\/.*)/g, function(e) {
            o.push(e);
            return "_comment__ktlu_"
        }).replace(/([\r\n\s,.;[({=&|!])(\/(?!\/)(?:\[.+?]|\\.|[^\/\r\n])+\/[gimy]{0,4})(?=\s*($|[\r\n,.;})\]]))/g, function(e, t, n) {
            a.push(n);
            return t + "_regex____ktlu_"
        }).replace(/([+.\/\|\^&%!~<>=-]|&amp;|&lt;?|&gt;?)/g, '<span class="sh_operator">$1</span>').replace(/([[\]{}().,;:])/g, '<span class="sh_punctuation">$1</span>').replace(/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|true|false|NaN|-?Infinity)\b/g, '<span class="sh_number">$1</span>').replace(/\bnew[ \t]+(\w+)/g, '<span class="sh_keyword">new</span> <span class="sh_init">$1</span>').replace(/\b(break|case|catch|const|continue|debugger|default|delete|do|else|enum|export|extends|_false_|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|_true_|try|typeof|var|void|while|with|yield)\b/g, '<span class="sh_keyword">$1</span>').replace(/_regex____ktlu_/g, function() {
            return '<span class="sh_keyword2">' + l(a[s++] || "") + "</span>"
        }).replace(/_comment__ktlu_/g, function() {
            return '<span class="sh_comment">' + l(o[r++] || "") + "</span>"
        }).replace(/_string___ktlu_/g, function() {
            return '<span class="sh_string">' + l(n[i++] || "") + "</span>"
        }) + (t ? "" : "</div>")
    }
    e["$hilit"] = t
}(this);
! function(e) {
    "use strict";
    var t, n = ["clear", "error", "error", "succes", "fail", "pass", "warn", "info", "bold", "italic", "blue", "green", "white", "yellow", "cyan", "magenta", "html", "autolink", "code", "pad", "right", "center", "repeat", "stack", "save", "stay", "id", "fast", "group", "noop", "obj", "end"],
        i = {
            el: null
        },
        o = {},
        r = "";
    for (var a = 0, s = n.length; a < s; a++) {
        i[n[a]] = "";
        o[n[a]] = function(e) {
            return function() {
                i[e] = "1"
            }
        }(n[a])
    }

    function l(e) {
        if ($is(e, "String")) return e;
        if ($is(e, "Number")) return '<span class="sh_number">' + e + "</span>";
        if ($is(e, "Undefined")) return "Undefined";
        if ($is(e, "Null")) return "Null";
        if ($is(e, "Function")) return $hilit($io.fn.str(e));
        if ($is(e, "Object") || $is(e, "Array")) return $hilit($io.obj.str(e));
        if ($is(e.constructor, "Function")) return "<span class=sh_init>" + $is(e) + "</span> " + $hilit($io.obj.str(e), true);
        return e
    }

    function u(e, t) {
        for (var n in e) {
            var i = e[n];
            if (n == t) return;
            if (typeof i == "string" || typeof i == "number" || typeof i == "boolean") {
                $log.pad(n, i + "", ".")
            } else if ($io.is.obj(i)) u(i, t)
        }
    }

    function c(e, n, o) {
        if (i.clear) {
            i.el.innerHTML = "";
            i.clear = "";
            return
        }
        if (i.repeat) e = e.repeat(i.cols), i.repeat = "";
        if (i.code) e = $hilit(e), i.code = "";
        if (i.pass) e = "✔ " + e, r += "ui_log__green", i.pass = "";
        if (i.fail) e = "✘ " + e, r += "ui_log__red", i.fail = "";
        if (i.info) e = "ℹ " + e, r += "ui_log__blue", i.info = "";
        if (i.white) r += "ui_log__white", i.white = "";
        if (i.yellow) r += "ui_log__yellow", i.yellow = "";
        if (i.cyan) r += "ui_log__cyan", i.cyan = "";
        if (i.magenta) r += "ui_log__magenta", i.magenta = "";
        if (i.blue) r += "ui_log__blue", i.blue = "";
        if (i.succes) r += "ui_log__green", i.succes = "";
        if (i.green) r += "ui_log__green", i.green = "";
        if (i.error) r += "ui_log__red", i.error = "";
        if (i.obj) {
            i.obj = "";
            u(e, n);
            return
        }
        if (i.pad) {
            var a;
            if (o) a = o;
            else a = n, n = "";
            var s = i.cols - 3 - (e.length + (n || "").length);
            e = e + a.repeat((3 + (s >= 0 ? s : 0)) / a.length) + n;
            i.pad = ""
        } else if (n) {
            var f = $io.arg.arr(arguments);
            e = f.join(", ")
        }
        if (!i.el) return;
        t = document.createElement("div");
        t.innerHTML = l(e);
        t.className = r;
        i.el.appendChild(t);
        c.trigger("addline");
        r = "";
        return t
    }
    c.config = function(e) {
        $extend(i, e);
        return c
    };
    $watch(c);
    e["$log"] = $chain(c, o, o)
}(this);
! function(e) {
    "use strict";

    function t(e) {
        e.scrollTop = e.scrollHeight
    }

    function n(e) {
        e.style.height = e.scrollHeight + "px"
    }

    function i(e) {
        e.focus();
        var t, n;
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            t = document.createRange(), n = window.getSelection();
            t.selectNodeContents(e);
            t.collapse(false);
            n.removeAllRanges();
            n.addRange(t)
        } else if (typeof document.body.createTextRange != "undefined") {
            t = document.body.createTextRange();
            t.moveToElementText(e);
            t.collapse(false);
            t.select()
        }
    }
    r.history = function() {
        return o
    };
    r.clearhistory = function() {
        o.length = 0
    };
    var o;
    $db([], "cli/history", function(e, t) {
        o = t
    }, r.history);

    function r(e) {
        var i = {
                cols: 59,
                el: document.body,
                prompt: "$>",
                history: o
            },
            r = $extend(i, e),
            a = document.createElement("code"),
            s = document.createElement("div"),
            l = document.createElement("div"),
            u = document.createElement("span"),
            c = document.createElement("textarea");
        if (!r.el) return;
        r.prompt += "&nbsp;";
        u.innerHTML = r.prompt;
        c.innerHTML = "";
        c.spellcheck = false;
        c.rows = "1";
        c.style.outline = "0 none";
        c.style.boxShadow = "0 0 transparent";
        c.style.textShadow = "0 0 transparent";
        c.style.border = "0 none";
        c.style.verticalAlign = "top";
        c.style.resize = "none";
        c.style.padding = "0";
        c.style.margin = "0";
        c.style.height = "auto";
        c.style.width = "100%";
        c.style.color = "inherit";
        c.style.font = "inherit";
        c.style.fontSize = "inherit";
        c.style.background = "transparent";
        c.style.overflow = "hidden";
        l.style.display = "table";
        l.style.tableLayout = "fixed";
        c.style.display = "table-cell";
        u.style.display = "table-cell";
        u.style.width = "1%";
        u.style.whiteSpace = "nowrap";
        l.appendChild(u);
        l.appendChild(c);
        a.appendChild(s);
        a.appendChild(l);
        a.style.display = "block";
        a.style.width = r.cols + "ch";
        a.style.whiteSpace = "pre-wrap";
        a.style.wordBreak = "break-word";
        a.style.wordWrap = "break-word";
        r.el.appendChild(a);
        r.el.style.overflowY = "scroll";
        if (r.rows) r.el.style.height = r.rows + "em";

        function f() {
            $log.config({
                cols: r.cols,
                el: s
            })
        }

        function d() {
            if (!$dom.getSelection()) {
                c.focus();
                f()
            }
        }
        $log.on("addline", function() {
            t(r.el)
        });
        r.el.addEventListener("mouseup", d, false);
        r.el.addEventListener("contextmenu", d, false);
        c.addEventListener("mouseup", function(e) {
            if (e.stopPropagation) e.stopPropagation();
            else e.cancelBubble = true;
            e.stopImmediatePropagation();
            f()
        }, false);
        c.addEventListener("paste", function(e) {
            setTimeout(function() {
                p(c)
            }, 0)
        }, false);

        function p(e) {
            n(e);
            t(r.el)
        }
        var m = 0;
        var h = false;
        $key(c, function(e, t, n) {
            p(this);
            var i = r.history.length;
            if (e == "enter") {
                var o = $io.str.trim(this.value);
                if (!o) return false;
                this.value = "";
                this.style.height = "auto";
                m = 0;
                if (y.onenter(o) === false) return;
                $log(r.prompt + o);
                if (r.history[i - 1] != o) r.history.push(o);
                if (!$exe(o)) {
                    try {
                        $log(eval.call(window, o))
                    } catch (n) {
                        $log.error.autolink(n.message + " \n" + n.stack.replace(n.message, ""))
                    }
                }
                return false
            }
            if (!this.value) h = false;
            if (!h) {
                if (e == "up") {
                    m++;
                    if (m > i) m = i;
                    this.value = r.history[i - m] || "";
                    p(this);
                    return false
                }
                if (e == "down") {
                    m--;
                    if (m < 0) m = 0;
                    this.value = r.history[i - m] || "";
                    p(this);
                    return false
                }
            }
        });
        var g = $log.config({
            cols: r.cols,
            el: s
        });
        var y = {
            destroy: function() {
                console.log("@todo : terminal destroy")
            },
            onenter: $noop,
            prompt: u,
            input: c,
            log: g
        };
        return y
    }
    e["$cli"] = r
}(this);
! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$pos", function() {
    "use strict";

    function e(e, n, i) {
        e = e.replace(/([a-z]+)([+-])?/g, function(e, t, n) {
            return (t == "top" ? "bottom" : t == "bottom" ? "top" : t == "right" ? "left" : t == "left" ? "right" : t) + (n == "+" ? "-" : n == "-" ? "+" : "")
        });
        return t(e, n, i)
    }

    function t(e, t, n) {
        var i = n || {
                top: 0,
                left: 0
            },
            o = t.offsetHeight || 0,
            r = t.offsetWidth || 0;
        e.replace(/(?:(right|left|center)(?:([+-])(\d+)(%)?)?)? ?(?:(top|bottom|center)(?:([+-])(\d+)(%)?)?)?/, function(e, t, n, a, s, l, u, c, f) {
            if (!l) l = "center";
            if (!t) t = "center";
            if (t == "right") i.left += r;
            if (t == "center") i.left += r / 2;
            if (l == "bottom") i.top += o;
            if (l == "center") i.top += o / 2;
            if (s) a = r / 100 * +a;
            if (f) c = o / 100 * +c;
            if (a) i.left = i.left - +(n + a);
            if (c) i.top = i.top - +(u + c)
        });
        return i
    }

    function n(n, i) {
        if (!n) throw new Error("$pos: element is undefined");
        n.style.position = "fixed";
        var o = false,
            r = n.parentNode,
            a = window.getComputedStyle(r, null),
            s = {
                top: 0,
                left: 0
            };
        while (r.parentNode && r.parentNode.nodeType !== 9 && a.transform == "none" && a.perspective == "none") {
            if (r.getAttribute("data-ui-menu-scroller")) o = r;
            r = r.parentNode;
            a = window.getComputedStyle(r, null)
        }
        s = r.getBoundingClientRect();
        var l = {
                my: "left top",
                at: "left bottom",
                of: {},
                collision: "flip",
                within: window,
                transform: false,
                overflow: "none"
            },
            u = $extend(l, i),
            c, f, d, p = t(u.my, n),
            m = t(u.at, u.of),
            h = m.top - p.top - s.top,
            g = m.left - p.left - s.left,
            y = {
                x: 0,
                y: 0,
                h: 0,
                w: 0
            };
        var v = {};
        if ($io.isWindow(u.within) || !u.within) {
            y.h = window.innerHeight;
            y.w = window.innerWidth
        } else {
            v = u.within.getBoundingClientRect();
            y.x = v.left;
            y.y = v.top;
            y.h = u.within.offsetHeight;
            y.w = u.within.offsetWidth
        }

        function w() {
            var e = u.of.getBoundingClientRect(),
                t = e.top - y.y,
                i = y.h - t - u.of.offsetHeight,
                o;
            if (n.parentNode.isEqualNode(u.of)) o = y.h;
            else o = t > i ? t : i;
            n.style.height = o + "px";
            n.setAttribute("data-ui-menu-scroller", true)
        }
        if (n.offsetHeight > y.h) {
            w()
        }
        var b = s.left == v.left ? 0 : v.left,
            _ = s.top == v.top ? 0 : v.top,
            $ = y.w - n.offsetWidth + b,
            x = y.h - n.offsetHeight + _;
        if (u.of.nodeType === 1) {
            var C = window.getComputedStyle(u.of, null),
                E = C.transform || C.webkitTransform || C.MozTransform || C.msTransform
        }
        if (E && E != "none") {
            n.style.transformOrigin = C.transformOrigin;
            c = function() {
                var e, t, i, o;
                if (s.left == 0) {
                    e = v.left;
                    t = v.top;
                    i = g;
                    o = h
                } else {
                    e = 0;
                    t = 0;
                    i = g + v.left;
                    o = h + v.top
                }
                n.style.left = u.of.offsetLeft + e + "px";
                n.style.top = u.of.offsetTop + t + "px";
                n.style.transform = E + " translateX(" + i + "px) translateY(" + o + "px)"
            }
        } else if (u.collision == "fit") {
            c = function(e, t) {
                e += g;
                t += h;
                e = e > $ ? $ : e < b ? b : e;
                t = t > x ? x : t < _ ? _ : t;
                n.style.left = e + "px";
                n.style.top = t + "px"
            }
        } else if (u.collision == "flip" || u.collision == "flipfit") {
            var L = e(u.my, n),
                k = e(u.at, u.of),
                N = k.top - L.top - s.top,
                j = k.left - L.left - s.left;
            c = u.collision == "flipfit" ? function(e, t, i, o) {
                e += g;
                t += h;
                if (e > $ || e < b) e = i + j;
                if (t > x || t < _) t = o + N;
                e = e > $ ? $ : e < b ? b : e;
                t = t > x ? x : t < _ ? _ : t;
                n.style.left = e + "px";
                n.style.top = t + "px"
            } : function(e, t, i, o) {
                e += g;
                t += h;
                if (e > $ || e < b) e = i + j;
                if (t > x || t < _) t = o + N;
                n.style.left = e + "px";
                n.style.top = t + "px"
            }
        } else {
            c = function(e, t) {
                n.style.left = e + g + "px";
                n.style.top = t + h + "px"
            }
        }

        function I(e) {
            if (!e) e = u.of;
            if (e.nodeType === 1) {
                var t = e.getBoundingClientRect();
                f = t.left;
                d = t.top
            } else if (e.preventDefault) {
                f = e.pageX;
                d = e.pageY
            }
            c(f, d, f, d)
        }
        I(u.of);
        return {
            update: I
        }
    }
    return n
});

function $maxZ(e, t) {
    var n, i, o, r = 0,
        a;
    if (typeof e == "string") n = (t || document).querySelectorAll(e);
    else if ($io.isNodeList(e)) n = e;
    else throw new Error("$maxZ: invalid selector");
    $io.arr.all(n, function(e) {
        i = window.getComputedStyle(e, null);
        o = i.zIndex;
        if (i.position != "static" && o != "auto" && +o > r) {
            a = e;
            r = +o
        }
    });
    return {
        num: r,
        el: a
    }
}

function simulateClick(e) {
    var t;
    if (document.createEvent) {
        t = document.createEvent("MouseEvents");
        t.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    }
    t ? e.dispatchEvent(t) : e.click && e.click()
}! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else try {
        $ui[e] = t()
    } catch (n) {
        this["$" + e] = t()
    }
}("menu", function() {
    "use strict";
    var e = document.createElement("div"),
        t = document.createElement("ul"),
        n = document.createElement("li"),
        i = document.createElement("span"),
        o = 0,
        r = 0,
        a = {},
        s = {};
    t.setAttribute("role", "menu");
    n.setAttribute("role", "menuitem");
    n.setAttribute("tabindex", "-1");
    n.className = "ui_menu__item";
    i.className = "ui_menu__item__text";

    function l(u, f, d) {
        f = typeof f == "function" ? f() : f;
        var p = document.createDocumentFragment(),
            m = e.cloneNode(false),
            h = t.cloneNode(false);
        m.appendChild(h);
        m.id = "ui_menu_" + o++;
        for (var g = 0, y = f.length; g < y; g++) {
            if (!f[g]) continue;
            var v = f[g],
                w = n.cloneNode(false);
            if (v.name == "---") {
                w.className = "ui_menu__separator";
                w.appendChild(document.createElement("hr"));
                p.appendChild(w);
                continue
            }
            w.id = "ui_menu__item_" + r++;
            var b = i.cloneNode(false);
            var _ = document.createElement("span");
            _.className = "ui_menu__ico";
            if (v.action) s[w.id] = v.action;
            if (d && d.mode == "radio") {
                w.innerHTML = '<span class="ui_menu__ico ui_form-ico-radio" data-js-checked="true">&nbsp;</span>'
            } else if (v.mode == "checkbox") {
                w.innerHTML = '<span class="ui_menu__ico ui_form-ico-checkbox" data-js-checked="true">&nbsp;</span>'
            }
            b.textContent = typeof v.name == "string" ? v.name : v;
            if (v.icon) {
                var $ = new Image;
                $.src = v.icon;
                _.appendChild($)
            }
            w.appendChild(_);
            w.appendChild(b);
            if (v.items) {
                w.setAttribute("aria-haspopup", true);
                w.classList.add("ui_menu__item--opener");
                if (u.recursive === true) {
                    var x = l(u, v.items, v);
                    x.className = "ui_menu__submenu";
                    if (u.position !== false) c(x);
                    w.appendChild(x)
                } else {
                    a[w.id] = v.items
                }
            }
            p.appendChild(w)
        }
        h.appendChild(p);
        return m
    }

    function u(e) {
        e.setAttribute("aria-hidden", false);
        e.setAttribute("aria-expanded", true);
        e.classList.add("ui_menu--open")
    }

    function c(e) {
        e.setAttribute("aria-hidden", true);
        e.setAttribute("aria-expanded", false);
        e.classList.remove("ui_menu--open")
    }

    function f(e, t) {
        if (t.classList.contains("ui_menu--open")) {
            c(t);
            e.classList.remove("ui_menu__item--focus")
        } else {
            u(t)
        }
    }
    var d = {};
    var p = {};

    function m(e) {
        if (d[e]) return;
        d[e] = true;
        document.addEventListener("mousedown", function t(n) {
            var i = n.target;
            while (i && i.id !== e) i = i.parentNode;
            if (!i) {
                h();
                document.removeEventListener("mousedown", t, false);
                d[e] = false
            }
        }, false)
    }

    function h(e) {
        var t = (e || document).querySelectorAll(".ui_menu__item--focus"),
            n = (e || document).querySelectorAll(".ui_menu--open"),
            i = (e || document).querySelectorAll(".ui_menu--scroller");
        $io.arr.all(t, function(e) {
            p[e.parentNode.parentNode.id] = false;
            e.classList.remove("ui_menu__item--focus")
        });
        $io.arr.all(n, function(e) {
            c(e)
        });
        $io.arr.all(i, function(e) {
            e.removeAttribute("style");
            e.classList.remove("ui_menu--scroller");
            if (e.classList.contains("ui_menu--scroller--active")) e.classList.remove("ui_menu--scroller--active");
            e.removeEventListener("mouseover", g, false)
        })
    }

    function g(e) {
        if (e.target.matches(".ui_menu__right_handler")) this.classList.remove("ui_menu--scroller--active");
        else this.classList.add("ui_menu--scroller--active")
    }

    function y(e) {
        e.addEventListener("mouseover", g, false);
        e.querySelector(".ui_menu__up_handler").addEventListener("mouseover", g, false)
    }
    var v = {
        mode: "inline",
        icons: "auto",
        recursive: true,
        solo: true,
        autoclose: true,
        closeOthers: true,
        trigger: "mouseover",
        position: {
            within: window
        }
    };

    function w(e, t, n) {
        if (!e) throw new Error("$menu: element is undefined");
        var i = n.mode == "tree" ? $extend({}, v, {
                closeOthers: false,
                trigger: "click",
                position: false
            }) : v,
            o = $extend({}, i, n),
            r = false,
            a = false;
        if (o.mode == "tabs") {
            r = true;
            o.mode = "bar"
        }
        if (o.mode == "context") {
            a = true;
            o.mode = "popup"
        }
        var d = l(o, t);
        d.className = "ui_menu ui_menu--" + (o.mode == "inline" || o.mode == "popup" ? "menu" : o.mode);
        d.setAttribute("tabindex", "0");
        var g;
        if (o.mode != "popup") {
            if (r) {
                e.appendChild(d);
                if (o.dest) {
                    g = o.dest
                } else {
                    g = document.createElement("div");
                    g.className = "ui_menu--tabs__content";
                    e.appendChild(g)
                }
            } else {
                e.appendChild(d)
            }
        } else {
            e.parentNode.insertBefore(d, e);
            d.classList.add("ui_menu--popup");
            c(d);
            if (a) {
                e.addEventListener("contextmenu", w, false)
            } else {
                e.addEventListener("click", w, false)
            }
        }
        d.style.zIndex = $maxZ(".ui_menu", d.parentNode).num + 1;

        function w(t) {
            t.stopImmediatePropagation();
            t.preventDefault();
            if (d.classList.contains("ui_menu--open")) return;
            if (o.solo) h();
            u(d);
            d.style.zIndex = $maxZ(".ui_menu, .ui_window").num + 1;
            $pos(d, {
                collision: "flip",
                of: e,
                within: o.position.within
            });
            if (d.getAttribute("data-ui-menu-scroller")) b(d);
            m(d.id)
        }

        function b(e) {
            function t() {
                if (e.scrollTop === 0) n.disabled = true;
                else n.disabled = false;
                if (e.scrollHeight - e.scrollTop === e.clientHeight) i.disabled = true;
                else i.disabled = false
            }
            var n, i, o, r;
            if (e.classList.contains("ui_menu--scroller--active")) e.classList.remove("ui_menu--scroller--active");
            e.classList.add("ui_menu--scroller");
            if (e.childNodes.length == 1) {
                n = document.createElement("button");
                i = document.createElement("button");
                o = document.createElement("div");
                n.className = "ui_menu__up_handler";
                i.className = "ui_menu__down_handler";
                o.className = "ui_menu__right_handler";
                var a = e.firstChild.offsetWidth;
                n.style.width = i.style.width = a + "px";
                e.appendChild(n);
                e.appendChild(i);
                e.appendChild(o);
                r = e.getBoundingClientRect();
                n.style.top = r.top + "px";
                i.style.bottom = window.innerHeight - e.offsetHeight - r.top + "px";
                o.style.left = r.left + a + "px";
                n.onclick = function() {
                    e.scrollTop -= 80;
                    t()
                };
                i.onclick = function() {
                    e.scrollTop += 80;
                    t()
                };
                e.onscroll = function() {
                    t()
                };
                t()
            }
            y(e)
        }
        var _;

        function $(e) {
            var t = e.target;
            while (t && t.tagName !== "LI") t = t.parentNode;
            if (!t) return;
            if (o.position !== false && t.classList.contains("ui_menu__item--focus")) return;
            $io.arr.each(t.parentNode.childNodes, function(e) {
                if (e.id == t.id) {
                    if (o.mode == "bar" && !p[d.id] && t.parentNode.parentNode.id == d.id) return;
                    e.classList.add("ui_menu__item--focus");
                    if (e.classList.contains("ui_menu__item--opener")) {
                        var n = e.lastChild;
                        if (o.position === false) {
                            f(e, n)
                        } else {
                            n.style.position = "fixed";
                            u(n);
                            $pos(n, {
                                my: "left top-1",
                                at: o.mode == "bar" && t.parentNode.parentNode.id == d.id ? "left bottom" : "right top",
                                of: e,
                                collision: "flipfit",
                                within: o.position.within || window
                            });
                            if (n.getAttribute("data-ui-menu-scroller")) b(n);
                            m(d.id)
                        }
                    }
                } else if (o.closeOthers) {
                    e.classList.remove("ui_menu__item--focus");
                    h(e)
                }
            })
        }
        d.addEventListener(o.trigger, $, false);
        p[d.id] = false;

        function x(e) {
            var t = this;
            if (o.mode == "bar" && !p[d.id]) {
                p[d.id] = true;
                $(e)
            }
            var n = s[t.id];
            var i = typeof n;
            if (r && (i == "string" || i == "function")) g.innerHTML = i == "function" ? n() : n, h();
            if (typeof n == "function" && n() !== false) h()
        }
        $el(d).on("click", ".ui_menu__item", x);
        var C = {
            destroy: function() {
                console.log("destroy menu");
                $el(d).off("click", ".ui_menu__item", x)
            }
        };
        return C
    }
    return $config(v, w)
});
! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$drag", function() {
    "use strict";

    function e(e, t) {
        document.documentElement.addEventListener(e, t, false)
    }

    function t(e, t) {
        document.documentElement.removeEventListener(e, t, false)
    }
    return function(n, i) {
        if (!n) throw new Error("$drag: element is undefined");
        var o = n.parentNode;
        while (o.parentNode && o.parentNode.nodeType !== 9 && window.getComputedStyle(o, null).position == "static") o = o.parentNode;
        var r = window.getComputedStyle(n, null),
            a = {
                constrain: false,
                absolute: r.position == "absolute" ? true : false,
                handle: null,
                start: null,
                drag: null,
                stop: null
            },
            s = $extend(a, i),
            l, u, c, f, d, p, m = s.constrain ? $ : x,
            h = typeof s.drag == "function" ? s.drag : function(e, t, n) {},
            g = false,
            y = o.offsetHeight - n.offsetHeight - .5,
            v = o.offsetWidth - n.offsetWidth - .5,
            w = 0,
            b = 0;

        function _(e) {
            e.preventDefault();
            C(e)
        }(s.handle || n).addEventListener("mousedown", _, false);
        (s.handle || n).addEventListener("touchstart", _, false);

        function $(e) {
            l = f + e.clientX - d;
            u = c + e.clientY - p;
            l = l > v ? v : l < b ? b : l;
            u = u > y ? y : u < w ? w : u;
            n.style.left = l + "px";
            n.style.top = u + "px";
            h(e, l, u)
        }

        function x(e) {
            l = f + e.clientX - d;
            u = c + e.clientY - p;
            n.style.left = l + "px";
            n.style.top = u + "px";
            h(e, l, u)
        }

        function C(t) {
            d = t.clientX;
            p = t.clientY;
            var i = getComputedStyle(n, null);
            f = n.offsetLeft - (parseInt(i.marginLeft, 10) || 0);
            c = n.offsetTop - (parseInt(i.marginTop, 10) || 0);
            if (s.absolute) {
                n.style.position = i.position == "fixed" ? "fixed" : "absolute";
                n.style.boxSizing = n.style.webkitBoxSizing = n.style.MozBoxSizing = "border-box";
                n.style.height = n.offsetHeight + "px";
                n.style.width = n.offsetWidth + "px";
                n.style.left = f + "px";
                n.style.top = c + "px"
            } else {
                var o = parseInt(i.left, 10) || 0,
                    r = parseInt(i.top, 10) || 0;
                if (s.constrain && !g) {
                    y = y - c + r;
                    w = w - c + r;
                    v = v - f + o;
                    b = b - f + o;
                    g = true
                }
                f = o;
                c = r;
                n.style.position = "relative";
                n.style.left = f + "px";
                n.style.top = c + "px"
            }
            e("mousemove", m);
            e("touchmove", m);
            e("mouseup", E);
            e("touchend", E);
            e("contextmenu", E);
            s.start && s.start(n, t)
        }

        function E(e) {
            t("mousemove", m);
            t("touchmove", m);
            t("mouseup", E);
            t("touchend", E);
            t("contextmenu", E);
            s.stop && s.stop(n, e)
        }

        function L() {
            (s.handle || n).removeEventListener("mousedown", _, false);
            (s.handle || n).removeEventListener("touchstart", _, false)
        }
        return {
            destroy: L
        }
    }
});
! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$resize", function() {
    "use strict";

    function e(e, t) {
        document.documentElement.addEventListener(e, t, false)
    }

    function t(e, t) {
        document.documentElement.removeEventListener(e, t, false)
    }
    return function(n, i) {
        if (!n) throw new Error("$resize: element is undefined");
        if (n.getAttribute("data-js-resize-init")) return;
        else n.setAttribute("data-js-resize-init", true);
        var o = n.parentNode;
        while (o && o.parentNode && o.parentNode.nodeType !== 9 && window.getComputedStyle(o, null).position == "static") o = o.parentNode;
        if (typeof i == "string") i = {
            handles: i
        };
        var r = window.getComputedStyle(n, null),
            a = {
                handles: "e, s, se",
                start: $noop,
                resize: $noop,
                stop: $noop
            },
            s = $extend(a, i),
            l = r.position == "fixed" || r.position == "absolute",
            u = n.getBoundingClientRect(),
            c = u.top,
            f = u.left,
            d = [];
        if (r.position == "static" || r.position == "") n.style.position = "relative";
        if (s.handles == "all") {
            d = ["n", "w", "e", "s", "nw", "ne", "sw", "se"]
        } else {
            s.handles.replace(/([^,\s]+)/g, function(e, t) {
                d.push(t)
            })
        }
        var p = [];
        for (var m = 0, h = d.length; m < h; m++) p.push(g(n, d[m]));

        function g(n, i) {
            var o, r, a, u, c, f, d, p = document.createElement("div"),
                i = i || "s",
                m;
            try {
                m = $io.fn.throttle(b, 15)
            } catch (h) {
                m = b
            }
            p.className = "js-resizer js-resizer-" + i;
            p.style.position = "absolute";
            if (i == "n") {
                p.style.top = "0";
                p.style.left = "0";
                p.style.right = "0";
                p.style.bottom = "auto";
                p.style.height = "6px";
                p.style.cursor = "n-resize"
            } else if (i == "s") {
                p.style.top = "auto";
                p.style.left = "0";
                p.style.right = "0";
                p.style.bottom = "0";
                p.style.height = "6px";
                p.style.cursor = "s-resize"
            } else if (i == "e") {
                p.style.top = "0";
                p.style.left = "auto";
                p.style.right = "0";
                p.style.bottom = "0";
                p.style.width = "6px";
                p.style.cursor = "e-resize"
            } else if (i == "w") {
                p.style.top = "0";
                p.style.left = "0";
                p.style.right = "auto";
                p.style.bottom = "0";
                p.style.width = "6px";
                p.style.cursor = "w-resize"
            } else if (i == "nw") {
                p.style.top = "0";
                p.style.left = "0";
                p.style.height = "6px";
                p.style.width = "6px";
                p.style.cursor = "nw-resize"
            } else if (i == "ne") {
                p.style.top = "0";
                p.style.right = "0";
                p.style.height = "6px";
                p.style.width = "6px";
                p.style.cursor = "ne-resize"
            } else if (i == "sw") {
                p.style.bottom = "0";
                p.style.left = "0";
                p.style.height = "6px";
                p.style.width = "6px";
                p.style.cursor = "sw-resize"
            } else if (i == "se") {
                p.style.bottom = "0";
                p.style.right = "0";
                p.style.height = "6px";
                p.style.width = "6px";
                p.style.cursor = "se-resize"
            }
            n.appendChild(p);

            function g(e) {
                e.preventDefault();
                v(e)
            }
            p.addEventListener("mousedown", g, false);
            p.addEventListener("touchstart", g, false);

            function y(e) {
                e.preventDefault()
            }

            function v(t) {
                o = t.clientX;
                r = t.clientY;
                a = n.offsetWidth;
                u = n.offsetHeight;
                c = n.offsetTop;
                f = n.offsetLeft;
                e("mousemove", m);
                e("touchmove", m);
                e("mouseup", w);
                e("touchend", w);
                e("contextmenu", y);
                document.documentElement.style.cursor = i + "-resize";
                s.start && s.start(n, t)
            }

            function w(e) {
                document.documentElement.style.cursor = "auto";
                t("mousemove", m);
                t("touchmove", m);
                t("mouseup", w);
                t("touchend", w);
                t("contextmenu", y);
                s.stop && s.stop(n, e)
            }

            function b(e) {
                if (i === "s" || i === "se" || i === "sw") n.style.height = u + e.clientY - r + "px";
                if (i === "e" || i === "ne" || i === "se") {
                    n.style.width = a + e.clientX - o + "px"
                }
                if (i === "n" || i === "ne" || i === "nw") {
                    var t = e.clientY - r;
                    if (l) {
                        n.style.top = c + t + "px"
                    }
                    n.style.height = u - t + "px"
                }
                if (i === "w" || i === "nw" || i === "sw") {
                    var t = e.clientX - o;
                    if (l) {
                        n.style.left = f + t + "px"
                    }
                    n.style.width = a - t + "px"
                }
            }

            function _() {
                p.removeEventListener("mousedown", g, false);
                p.removeEventListener("touchstart", g, false);
                p.parentNode.removeChild(p)
            }
            return {
                destroy: _
            }
        }

        function y() {
            for (var e = 0, t = p.length; e < t; e++) {
                p[e].destroy()
            }
        }
        return {
            destroy: y
        }
    }
});
! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$window", function() {
    "use strict";
    var e = {
            title: "",
            url: null,
            html: "",
            menu: null,
            footer: null,
            help: "",
            width: 380,
            height: 260,
            baseWidth: null,
            baseHeight: null,
            minWidth: null,
            minHeight: null,
            top: null,
            left: null,
            center: false,
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            draggable: true,
            automaximize: false,
            onopen: $noop,
            onready: $noop,
            onclose: $noop,
            oncancel: $noop,
            onminimize: $noop,
            ondrag: $noop,
            onresize: $noop,
            animationIn: "",
            animationOut: "",
            baseClass: "",
            bodyClass: "",
            dest: document.body,
            dock: null,
            baseUrl: "",
            ajax: false
        },
        t = 0,
        n = {},
        i = document.createElement("div"),
        o = document.createElement("header"),
        r = document.createElement("header"),
        a = document.createElement("section"),
        s = document.createElement("footer"),
        l = document.createElement("iframe"),
        u = document.createElement("img"),
        c = document.createElement("span"),
        f = document.createElement("button"),
        d = document.createElement("button"),
        p = document.createElement("button"),
        m = document.createElement("button");
    i.setAttribute("role", "dialog");
    i.className = "ui_window ui_window--active";
    o.className = "ui_window__head";
    u.className = "ui_window__head__icon";
    c.className = "ui_window__head__title ui_elipsis";
    f.className = "ui_window__head__help";
    d.className = "ui_window__head__minimize";
    p.className = "ui_window__head__maximize";
    m.className = "ui_window__head__close";
    r.className = "ui_window__menu";
    a.className = "ui_window__body";
    s.className = "ui_window__foot";
    l.className = "ui_window__iframe";
    l.setAttribute("allowfullscreen", "true");
    a.setAttribute("tabindex", "0");

    function h(g) {
        if (typeof g == "string" && g.indexOf(".html") != -1) g = {
            title: g,
            url: g,
            ajax: true,
            width: 400,
            height: 300
        };
        var w = $extend({}, e, g),
            b = i.cloneNode(false),
            _ = o.cloneNode(false),
            $ = r.cloneNode(false),
            x = a.cloneNode(false),
            C = s.cloneNode(false),
            E = t++,
            L = w.dest.offsetWidth,
            k = w.dest.offsetHeight;
        b.id = "ui_window_" + E;
        b.setAttribute("data-id", E);
        if (w.baseClass) {
            var N = w.baseClass.split(" ");
            $io.arr.all(N, function(e) {
                b.classList.add(e)
            })
        }
        if (w.help || w.minimizable || w.maximizable || w.closable) {
            if (w.icon) {
                var j = u.cloneNode(false);
                j.src = w.baseUrl + w.icon;
                _.appendChild(j)
            }
            var I = c.cloneNode(false);
            I.textContent = w.title || "";
            b.setAttribute("aria-labelledby", "ui_window__title_" + E);
            I.id = "ui_window__title_" + E;
            _.appendChild(I);
            if (w.help) {
                var O = f.cloneNode(false);
                O.onclick = st;
                _.appendChild(O)
            }
            if (w.minimizable && w.dock) {
                var T = d.cloneNode(false);
                T.onclick = mt;
                _.appendChild(T)
            }
            if (w.maximizable) {
                var A = p.cloneNode(false);
                A.onclick = ft;
                _.appendChild(A)
            }
            if (w.closable) {
                var M = m.cloneNode(false);
                M.onclick = lt;
                _.appendChild(M)
            }
            b.appendChild(_)
        }
        if (w.menu || w.beforeMenu || w.afterMenu) {
            b.appendChild($)
        }
        if (w.beforeMenu) {
            var S;
            if (typeof w.beforeMenu == "string") {
                S = document.createElement("div");
                S.innerHTML = w.beforeMenu
            } else {
                S = w.beforeMenu
            }
            $.appendChild(S)
        }
        if (w.menu) {
            $menu($, w.menu, {
                mode: "bar",
                position: {
                    within: w.dest
                }
            })
        }
        if (w.afterMenu) {
            var z;
            if (typeof w.afterMenu == "string") {
                z = document.createElement("div");
                z.innerHTML = w.afterMenu
            } else {
                z = w.afterMenu
            }
            $.appendChild(z)
        }
        b.appendChild(x);
        if (w.footer) {
            var H;
            if (typeof w.footer == "string") {
                H = document.createElement("div");
                H.innerHTML = w.footer
            } else {
                H = w.footer
            }
            C.appendChild(H)
        }
        if (w.footer || w.btnOk || w.btnCancel) {
            b.appendChild(C)
        }
        b.style.top = (w.top || -2e3) + "px";
        b.style.left = (w.left || -2e3) + "px";
        x.style.width = w.width * 1 + 2 + (w.width == "auto" ? "" : "px");
        x.style.height = w.height * 1 + 2 + (w.height == "auto" ? "" : "px");

        function R() {
            var e = w.baseWidth ? w.baseWidth : b.offsetWidth,
                t = w.baseHeight ? w.baseHeight : b.offsetHeight,
                n = false,
                i = false;
            if (e > L) e = L, n = true;
            if (t > k) t = k, i = true;
            b.style.height = t + "px";
            b.style.width = e + "px";
            if (w.minHeight) b.style.minHeight = t + "px";
            if (w.minWidth) b.style.minWidth = e + "px";
            x.classList.add("ui_window__body--flex");
            x.removeAttribute("style");
            if (w.center) {
                w.top = ~~((k - ~~t) / 2) + "px";
                w.left = ~~((L - ~~e) / 2) + "px"
            } else {
                if (!w.top) {
                    var o = ~~(Math.random() * (k - t - 30));
                    w.top = (o > 10 ? o : 10) + "px"
                }
                if (!w.left) {
                    var r = ~~(Math.random() * (L - e - 30));
                    w.left = (r > 10 ? r : 10) + "px"
                }
            }
            b.style.top = i ? 0 : w.top;
            b.style.left = n ? 0 : w.left
        }
        w.dest.appendChild(b);
        if (w.automaximize) {
            b.classList.add("ui_window--maximized")
        }
        if (w.draggable) {
            (I || b).classList.add("ui_window--draggable");
            var D = $drag(b, {
                handle: I ? I : b,
                start: function(e) {
                    h.active(e);
                    y(e)
                },
                stop: function(e) {
                    v(e)
                }
            })
        }
        if (w.resizable) {
            var P = $resize(b, {
                handles: "all",
                start: function(e) {
                    h.active(e);
                    y(e)
                },
                stop: function(e) {
                    v(e);
                    w.onresize()
                }
            })
        }
        if (w.bodyClass) {
            var q = w.bodyClass.split(" ");
            $io.arr.all(q, function(e) {
                x.classList.add(e)
            })
        }
        if (w.animationIn == "random") w.animationIn = $io.arr.random($animate.i);
        if (w.animationOut == "random") w.animationOut = $io.arr.random($animate.o);
        console.log("animationIn", w.animationIn);
        console.log("animationOut", w.animationOut);
        if (w.animationIn) {
            b.classList.add("animated");
            $animate(b, w.animationIn, function(e) {
                b.classList.remove("animated")
            })
        }
        if (w.btnCancel || w.btnOk) {
            var B = document.createElement("div");
            B.className = "ui_window__buttons";
            C.appendChild(B)
        }
        var U;
        if (w.btnCancel) {
            U = document.createElement("button");
            U.innerHTML = w.btnCancel;
            U.className = "ui_window__ok";
            B.appendChild(U)
        }
        var W;
        if (w.btnOk) {
            W = document.createElement("button");
            W.innerHTML = w.btnOk;
            W.setAttribute("autofocus", "autofocus");
            W.className = "ui_window__ok js-to-focus";
            B.appendChild(W)
        }

        function X(e) {
            if (this.classList.contains("ui_window_docked--minimized")) {
                ht();
                if (!b.classList.contains("ui_window--active")) h.active(b)
            } else {
                if (b.classList.contains("ui_window--active")) {
                    if (w.minimizable) mt()
                } else {
                    h.active(b)
                }
            }
        }
        if (w.dock) {
            var F = document.createElement("button"),
                Z = document.createElement("img"),
                Y = document.createElement("span");
            F.className = "ui_window_docked";
            F.id = "ui_window_docked_" + E;
            Z.className = "ui_window_docked__icon";
            Y.className = "ui_window_docked__text ui_elipsis";
            if (w.icon) Z.src = w.baseUrl + w.icon, F.appendChild(Z);
            if (w.title) {
                Y.textContent = w.title;
                Y.title = w.title;
                F.appendChild(Y)
            }
            w.dock.appendChild(F);
            $menu(F, [{
                name: "close",
                action: function() {
                    at.close()
                }
            }], {
                mode: "context",
                position: {
                    within: w.dest
                }
            });
            F.addEventListener("click", X, false)
        }
        var J = false;

        function K(e) {
            J = true;
            lt(e)
        }

        function V(e) {
            if (w.oncancel.call(at, J) !== false) lt(e)
        }
        if (w.btnCancel) U.addEventListener("click", V, false);
        if (w.btnOk) W.addEventListener("click", K, false);

        function Q() {
            h.active(this)
        }
        b.addEventListener("click", Q, false);
        if (w.resizable && I) I.addEventListener("dblclick", ft, false);

        function G() {
            b.removeEventListener("click", Q, false);
            b.parentNode.removeChild(b);
            if (w.dock) F.removeEventListener("click", X, false);
            if (w.dock) F.parentNode.removeChild(F);
            if (w.btnCancel) U.removeEventListener("click", lt, false);
            if (w.btnOk) W.removeEventListener("click", K, false);
            if (pt.parentNode) pt.parentNode.removeChild(pt);
            pt = null;
            if (w.resizable && I) I.removeEventListener("dblclick", ft, false);
            if (w.draggable) D.destroy();
            if (w.resizable) P.destroy();
            var e = $maxZ(".ui_window").el;
            if (e) h.active(e)
        }

        function et() {
            if (w.animationOut) {
                b.classList.add("animated");
                $animate(b, w.animationOut, function(e) {
                    b.classList.remove("animated");
                    G()
                })
            } else {
                G()
            }
        }

        function tt() {
            if (J && w.onsubmit && w.onsubmit.call(at, J, $form(it)) === false) {
                J = false
            } else {
                et();
                w.onclose.call(at, J, $form(it))
            }
        }

        function nt(e) {
            if (e === true) J = true;
            if (it) {
                tt()
            } else {
                et();
                w.onclose.call(at, J)
            }
        }
        var it;

        function ot() {
            setTimeout(function() {
                h.active(b);
                R();
                it = b.getElementsByTagName("form")[0];
                if (it) {
                    it.onsubmit = function() {
                        J = true;
                        tt();
                        return false
                    }
                }
                at.el.form = it;
                w.onready.call(at, b, x);
                if (rt) rt.focus();
                else x.focus()
            }, 0)
        }
        var rt;
        if (w.url && !w.ajax) {
            rt = l.cloneNode(false);
            rt.src = w.url.indexOf("www") == 0 ? "http://" + w.url : w.url;
            x.appendChild(rt);
            x.classList.add("ui_window__body--with_iframe");
            if (!w.title) w.title = w.url
        } else if (!w.ajax) {
            if (typeof w.html == "string") x.innerHTML = w.html;
            else if (w.html.nodeType === 1 || w.html.nodeType === 11) x.appendChild(w.html)
        }
        if (w.url && w.ajax) {
            $ajax.get(w.url).done(function(e) {
                var t = document.createElement("div");
                t.innerHTML = e;
                var n = t.querySelectorAll(".language-javascript");
                $io.arr.each(n, function(e, t) {
                    var n = e.textContent;
                    e.innerHTML = $hilit(e.innerHTML);
                    var i = document.createElement("button");
                    i.id = "run_" + E + "_" + t;
                    e.id = "code_" + E + "_" + t;
                    i.onclick = function() {
                        return function() {
                            eval.call(window, n)
                        }
                    }(n);
                    i.textContent = "run";
                    e.appendChild(i)
                });
                x.appendChild(t);
                ot()
            }).fail(function() {
                $error("ajax error")
            })
        } else {
            ot()
        }
        var at = {
            el: {
                base: b,
                body: x,
                head: _,
                foot: C,
                iframe: rt,
                form: it,
                btnCancel: U,
                btnOk: W
            },
            close: nt,
            destroy: G,
            cfg: w
        };
        n[E] = at;
        w.onopen.call(at, b, x);

        function st() {
            $info(w.help)
        }

        function lt(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            nt()
        }
        var ut;

        function ct(e, t, n) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (b.classList.contains("ui_window--" + t)) {
                b.classList.remove("ui_window--" + t);
                b.classList.add("untransition");
                b.removeAttribute("style");
                b.setAttribute("style", ut);
                setTimeout(function() {
                    b.classList.remove("untransition");
                    n(false)
                }, 500)
            } else {
                ut = b.getAttribute("style");
                b.classList.add("ui_window--" + t);
                setTimeout(function() {
                    n(true)
                }, 500)
            }
        }

        function ft(e) {
            ct(e, "maximized", w.onresize)
        }
        var dt, pt = document.createElement("div");
        pt.className = "ui_window_transfer";

        function mt() {
            if (w.dock) {
                var e = b.getBoundingClientRect();
                dt = {
                    t: e.top + "px",
                    l: e.left + "px",
                    h: b.offsetHeight + "px",
                    w: b.offsetWidth + "px"
                };
                pt.style.display = "block";
                pt.style.top = dt.t;
                pt.style.left = dt.l;
                pt.style.height = dt.h;
                pt.style.width = dt.w;
                pt.style.zIndex = $maxZ(".ui_window").num + 1;
                document.body.appendChild(pt);
                b.classList.add("ui_window--minimized");
                var t = F.getBoundingClientRect();
                pt.style.top = t.top + "px";
                pt.style.left = t.left + "px";
                pt.style.height = F.offsetHeight + "px";
                pt.style.width = F.offsetWidth + "px";
                setTimeout(function() {
                    pt.style.display = "none";
                    F.classList.add("ui_window_docked--minimized")
                }, 300)
            }
        }

        function ht() {
            pt.classList.remove("ui_window_transfer");
            pt.style.display = "block";
            pt.style.zIndex = $maxZ(".ui_window").num + 1;
            pt.classList.add("ui_window_retransfer");
            setTimeout(function() {
                pt.style.top = dt.t;
                pt.style.left = dt.l;
                pt.style.height = dt.h;
                pt.style.width = dt.w
            }, 0);
            setTimeout(function() {
                pt.style.display = "none";
                b.classList.remove("ui_window--minimized");
                F.classList.remove("ui_window_docked--minimized")
            }, 300)
        }
        return at
    }
    var g = document.createElement("div");
    g.className = "js-mask";
    g.setAttribute("style", "background-image:url(/c/sys/img/spacer.gif); position: absolute; z-index: 2; left: 0; top: 0; right: 0; bottom: 0;");

    function y(e) {
        if (e.getElementsByTagName("iframe").length) e.getElementsByTagName("section")[0].appendChild(g.cloneNode(false))
    }

    function v(e) {
        var t = e.querySelector(".js-mask");
        if (t && t.parentNode) t.parentNode.removeChild(t)
    }

    function w() {
        $io.arr.all(document.querySelectorAll(".ui_window--active"), function(e) {
            e.classList.remove("ui_window--active");
            y(e)
        });
        $io.arr.all(document.querySelectorAll(".ui_window_docked.pressed"), function(e) {
            e.classList.remove("pressed")
        })
    }
    h = $config(e, h);
    h.active = function(e) {
        var t = e.classList.contains("ui_window--active");
        w();
        e.classList.add("ui_window--active");
        v(e);
        e.style.zIndex = $maxZ(".ui_window").num + 1;
        var n = e.getAttribute("data-id");
        var i = document.getElementById("ui_window_docked_" + n);
        if (i) i.classList.add("pressed")
    };
    h.close = function(e) {
        if (typeof e == "string") n[e].close();
        else if (e && e.nodeType == 1 && e.getAttribute("data-id")) n[e.getAttribute("data-id")].close()
    };
    h.destroy = function(e) {
        if (typeof e == "string") n[e].destroy();
        else if (e && e.nodeType == 1 && e.getAttribute("data-id")) n[e.getAttribute("data-id")].destroy()
    };
    return h
});
! function(e) {
    "use strict";
    var t = {
            baseClass: "ui_alert",
            height: "auto",
            minHeight: "auto",
            footer: "",
            minimizable: false,
            maximizable: false,
            resizable: false,
            center: true
        },
        n = $sound("/c/sys/sounds/CHORD.ogg"),
        i = $sound("/c/sys/sounds/QUACK.ogg");

    function o(e, i) {
        var o = $extend({
            title: "Alert",
            baseClass: "ui_alert",
            msg: e,
            img: "/c/sys/ico32/alert.png",
            cb: i,
            onopen: function() {
                n.play();
                if (f) {
                    setTimeout(function() {
                        f.focus()
                    }, 10)
                }
            },
            onclose: function(t) {
                (i || e.cb) && (i || e.cb)(t)
            },
            btnOk: "OK",
            animationIn: "bounceIn",
            animationOut: "bounceOut"
        }, e);
        if (typeof o.msg !== "string") {
            try {
                o.msg = JSON.stringify(o.msg, null, 2);
                o.bodyClass = t.bodyClass + " " + o.baseClass + "--code"
            } catch (r) {
                o.msg = o.msg + "";
                o.bodyClass = t.bodyClass + " " + o.baseClass + "--code" + " " + o.baseClass + "--center"
            }
        }
        var a = document.createElement("div"),
            s = document.createElement("div"),
            l = document.createDocumentFragment();
        a.className = "clearfix";
        if (o.img) {
            var u = new Image;
            u.className = o.baseClass + "__img";
            a.appendChild(u)
        }
        s.innerHTML = o.msg;
        s.className = o.baseClass + "__text";
        a.appendChild(s);
        if (typeof o.prompt == "string") {
            var c = document.createElement("form");
            var f = document.createElement("input");
            f.type = "text";
            f.value = o.prompt;
            f.name = "prompt";
            f.setAttribute("autofocus", "autofocus");
            c.style.textAlign = "center";
            c.appendChild(f);
            s.appendChild(c)
        }
        o.html = a;
        var d = null;
        if (o.img) {
            var p = false;
            d = function() {
                if (!p) {
                    $window($extend({}, t, o))
                }
                p = true
            };
            u.onload = d;
            u.onerror = d;
            u.onabort = d;
            u.src = o.img
        } else {
            $window($extend({}, t, o))
        }
    }
    var r = function(e, t) {
        o($extend({
            title: "Error",
            msg: e,
            img: "/c/sys/ico32/error.png",
            cb: t,
            onopen: function() {
                i.play()
            }
        }, e))
    };
    var a = function(e, t) {
        o($extend({
            title: "Info",
            msg: e,
            img: "/c/sys/ico32/info.png",
            onopen: function() {},
            cb: t
        }, e))
    };
    var s = function(e, t) {
        o($extend({
            title: "Confirm",
            msg: e,
            img: "/c/sys/ico32/question.png",
            cb: t,
            btnCancel: "Cancel"
        }, e))
    };
    var l = function(e, t, n) {
        if (typeof t == "function") {
            n = t;
            t = ""
        }
        o($extend({
            title: "Prompt",
            msg: e,
            img: "/c/sys/ico32/question.png",
            cb: n,
            prompt: t,
            onclose: function(t, i) {
                var o = i.post.prompt;
                (n || e.cb) && (n || e.cb)(t, o)
            },
            btnCancel: "Cancel"
        }, e))
    };
    e.$alert = o;
    e.$error = r;
    e.$info = a;
    e.$confirm = s;
    e.$prompt = l
}(this);
! function(e, t) {
    if (typeof module != "undefined") module.exports = t();
    else if (typeof define == "function" && typeof define.amd == "object") define(t);
    else this[e] = t()
}("$form", function() {
    "use strict";
    return function(e, t) {
        var n;
        if (e.nodeName == "FORM") {
            var i = [];
            var o = {};
            $io.arr.all(e.elements, function(e) {
                if (e.name === "") return;
                switch (e.nodeName) {
                    case "INPUT":
                        switch (e.type) {
                            case "text":
                            case "hidden":
                            case "password":
                            case "button":
                            case "reset":
                            case "submit":
                                i.push(e.name + "=" + encodeURIComponent(e.value)), o[e.name] = e.value;
                                break;
                            case "checkbox":
                            case "radio":
                                if (e.checked) {
                                    i.push(e.name + "=" + encodeURIComponent(e.value)), o[e.name] = e.value
                                }
                                break;
                            case "file":
                                break
                        }
                        break;
                    case "TEXTAREA":
                        i.push(e.name + "=" + encodeURIComponent(e.value)), o[e.name] = e.value;
                        break;
                    case "SELECT":
                        switch (e.type) {
                            case "select-one":
                                i.push(e.name + "=" + encodeURIComponent(e.value)), o[e.name] = e.value;
                                break;
                            case "select-multiple":
                                for (j = e.options.length - 1; j >= 0; j = j - 1) {
                                    if (e.options[j].selected) {
                                        i.push(e.name + "=" + encodeURIComponent(e.options[j].value)), o[e.name] = e.options[j].value
                                    }
                                }
                                break
                        }
                        break;
                    case "BUTTON":
                        switch (e.type) {
                            case "reset":
                            case "submit":
                            case "button":
                                i.push(e.name + "=" + encodeURIComponent(e.value)), o[e.name] = e.value;
                                break
                        }
                        break
                }
            });
            return {
                get: i.join("&"),
                post: o,
                action: e.getAttribute("action")
            }
        } else if (typeof e == "object") {
            var r = document.createElement("form"),
                a = document.createElement("div"),
                s = document.createElement("label"),
                l = document.createElement("input");
            r.className = "ui_form";
            $io.obj.all(e, function(e, t) {
                var n = a.cloneNode(false);
                var i = l.cloneNode(false);
                var o = s.cloneNode(false);
                var u = $io.str.slug(t);
                var c = false;
                i.id = u;
                i.name = u;
                i.value = e;
                o.setAttribute("for", u);
                o.innerHTML = t;
                if (typeof e == "string") {
                    if (e.indexOf("{{password}}") != -1) {
                        i.type = "password";
                        i.value = ""
                    } else if (e.indexOf("{{captcha}}") != -1) {
                        i = document.createElement("div");
                        i.innerHTML = "yeaaa"
                    } else {
                        i.type = "text"
                    }
                    c = true
                } else if (typeof e == "boolean") {
                    i.type = "checkbox";
                    i.checked = e;
                    c = true
                } else if ($io.is.arr(e)) {
                    if (e.length > 4) {} else {
                        i = document.createElement("select");
                        $io.arr.all(e, function(e) {
                            var t = document.createElement("option");
                            t.value = e;
                            t.innerHTML = e;
                            i.appendChild(t)
                        })
                    }
                }
                if (c) {
                    n.appendChild(o);
                    n.appendChild(i);
                    r.appendChild(n)
                }
            });
            if (t) t.appendChild(r);
            else return r
        }
    }
});
! function(e) {
    "use strict";
    var t = function() {
        var e = document.createElement("div"),
            t = "Khtml Ms ms MS O o Moz moz webkit Webkit webKit WebKit".split(" "),
            n = t.length;
        return function(i) {
            if (i in e.style) return i;
            i = i.replace(/^[a-z]/, function(e) {
                return e.toUpperCase()
            });
            for (var o = 0; o < n; o++) {
                if (t[o] + i in e.style) {
                    return t[o] + i
                }
            }
            return false
        }
    }();
    var n = t("animationName");

    function i(e, t, n) {
        "use strict";
        e.addEventListener("animationend", n, false);
        e.addEventListener("webkitAnimationEnd", n, false);
        e.addEventListener("MSAnimationEnd", n, false);
        e.addEventListener("oAnimationEnd", n, false);
        e.addEventListener("oanimationend", n, false);
        e.classList.add(t)
    }

    function o(e, t) {
        var i = document.createElement("div");
        i.className = e;
        document.body.appendChild(i);
        var o = window.getComputedStyle(i, null);
        if (o[n] != "none") {
            t(true)
        } else {
            t(false)
        }
        i.parentNode.removeChild(i)
    }

    function r(e, t, n) {
        function r() {
            n(true);
            e.removeEventListener("animationend", r, false);
            e.removeEventListener("webkitAnimationEnd", r, false);
            e.removeEventListener("MSAnimationEnd", r, false);
            e.removeEventListener("oAnimationEnd", r, false);
            e.removeEventListener("oanimationend", r, false);
            e.classList.remove(t)
        }
        o(t, function(o) {
            if (o) {
                i(e, t, r)
            } else {
                n(false)
            }
        })
    }
    r.i = ["rubberBand", "swing", "tada", "wobble", "bounceIn", "bounceInDown", "bounceInLeft", "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "flip", "flipInX", "flipInY", "lightSpeedIn", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpRight", "slideInDown", "slideInLeft", "rollIn", "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp"];
    r.o = ["bounceOut", "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp", "fadeOut", "fadeOutDown", "fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig", "fadeOutUp", "lightSpeedOut", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight", "slideOutLeft", "slideOutRight", "slideOutUp", "hinge", "rollOut", "zoomOut", "zoomOutDown", "zoomOutLeft", "zoomOutRight", "zoomOutUp"];
    e.$animate = r
}(this);

function $hint(e, t) {
    "use strict";
    if (!e) throw new Error("$hint: element is undefined");
    var n = $extend({
            classes: {
                ul: "js-hints",
                li: "js-hints__hint",
                active: "js-hints__hint--active"
            }
        }, t),
        i = n.source,
        o = e.offsetHeight,
        r = document.createElement("div"),
        a = document.createElement("ul"),
        s = document.createElement("li"),
        l = document.createDocumentFragment(),
        u = e.cloneNode(),
        c = window.getComputedStyle(e, null),
        f = function(e) {
            return c.getPropertyValue(e)
        };
    r.style.display = f("display");
    r.style.margin = f("margin");
    r.style.background = f("background");
    r.style.backgroundColor = f("background-color");
    if (f("position") == "relative" || f("position") == "absolute" || f("position") == "fixed") {
        r.style.position = e.style.position;
        r.style.top = e.style.top;
        r.style.left = e.style.left;
        r.style.right = e.style.right;
        r.style.bottom = e.style.bottom
    } else r.style.position = "relative";
    if (!n.hintColor) {
        u.style.color = n.hintColor;
        u.style.opacity = .4
    }
    u.id = u.placeholder = u.value = "";
    u.style.position = "absolute";
    u.style.top = u.style.left = u.style.right = u.style.bottom = u.style.margin = "0";
    a.style.position = "absolute";
    a.style.zIndex = "100";
    a.style.display = "none";
    a.className = n.classes.ul;
    s.className = n.classes.li;
    e.style.position = "relative";
    e.style.top = e.style.left = e.style.right = e.style.bottom = e.style.margin = "auto";
    e.style.backgroundColor = "transparent";
    e.parentNode.insertBefore(r, e);
    e.parentNode.removeChild(e);
    r.appendChild(u);
    r.appendChild(e);
    r.appendChild(a);
    var d;
    if (typeof i == "function") {
        if (i.length < 2) {
            d = function(e) {
                p(i(e))
            }
        } else if (i.length > 1) {
            d = function(e) {
                a.innerHTML = "loading...";
                i(e, function(e) {
                    a.innerHTML = "";
                    p(e)
                })
            }
        }
    } else {
        d = function(e) {
            var t = new RegExp("^" + $io.reg.escape(e), "");
            var n = [];
            for (var o = 0, r = i.length; o < r; o++) {
                var e = i[o];
                if (t.test(e)) n.push(e)
            }
            p(n)
        }
    }

    function p(e) {
        while (l.firstChild) l.removeChild(l.firstChild);
        for (var t = 0, i = e.length; t < i; t++) {
            var o = s.cloneNode();
            o.innerHTML = e[t];
            if (t == 0) o.classList.add(n.classes.active), u.value = o.textContent;
            l.appendChild(o)
        }
        if (e.length > 1) {
            a.appendChild(l);
            a.style.display = "block"
        } else a.style.display = "none"
    }
    $el(a).on("click", "li", function() {
        u.value = "";
        e.value = this.textContent;
        a.style.display = "none"
    });
    e.addEventListener("keydown", function(t) {
        t = t || window.event;
        if (typeof t.which !== "number") t.which = t.keyCode;
        if (t.which == 38) {
            var i = a.querySelector("li." + n.classes.active),
                o = i.previousSibling;
            if (i && o) {
                i.classList.remove(n.classes.active);
                o.classList.add(n.classes.active);
                u.value = o.textContent
            }
            if (t.preventDefault) t.preventDefault();
            else t.returnValue = false
        }
        if (t.which == 40) {
            var i = a.querySelector("li." + n.classes.active),
                o = i.nextSibling;
            if (i && o) {
                i.classList.remove(n.classes.active);
                o.classList.add(n.classes.active);
                u.value = o.textContent
            }
            if (t.preventDefault) t.preventDefault();
            else t.returnValue = false
        }
        if (t.which == 39) {
            var i = a.querySelector("li." + n.classes.active);
            e.value = i.textContent;
            if (t.preventDefault) t.preventDefault();
            else t.returnValue = false
        }
    }, false);
    e.addEventListener("keyup", function(e) {
        e = e || window.event;
        if (typeof e.which !== "number") e.which = e.keyCode;
        if (e.which == 38) {
            return false
        }
        if (e.which == 40) {
            return false
        }
        if (e.which == 39) {
            while (a.firstChild) a.removeChild(a.firstChild);
            a.style.display = "none";
            return false
        }
        u.value = "";
        while (a.firstChild) a.removeChild(a.firstChild);
        if (this.value) d(this.value);
        else a.style.display = "none"
    }, false)
}! function(e) {
    "use strict";
    var t = {};

    function n() {}

    function i(e, t) {
        var n = [],
            i;
        $io.arr.each(e, function(e, o) {
            var r = 1;
            e = e.replace(/\.\.\//g, function() {
                r++;
                return ""
            });
            i = t.split("/").slice(0, -r).join("/");
            var a = i + "/" + e + ".js";
            n.push(a)
        });
        return n
    }

    function o(e) {
        setTimeout(function() {
            for (var t = 0, n = e.length; t < n; t++) {
                var i = e[t];
                if (i && i.nodeType) {
                    i.onload = i.onreadystatechange = i.onerror = i.onabort = null
                }
            }
        }, 0)
    }

    function r(e) {}

    function a(e, n, i) {
        s++;
        var o = arguments.length;
        if (o == 1) {
            i = e;
            n = [];
            e = s
        } else if (o == 2) {
            i = n;
            if (typeof e == "string") {
                n = []
            } else {
                n = e;
                e = s
            }
        }
        if (n.length) {
            t[e] = {
                dep: n,
                fac: i
            }
        } else {
            t[e] = i
        }
    }
    var s = 0;
    var l = 0;
    var u = 0;
    var c = {
        yo: "yo"
    };
    var f = {},
        d = {},
        p = [];
    var m, h;
    ! function() {
        var e = document.getElementsByTagName("script")[0];
        if (e) {
            m = e.parentNode;
            h = e
        } else {
            m = document.head || document.getElementsByTagName("head")[0];
            h = m.getElementsByTagName("base")[0] || null
        }
        var t = document.createComment("/// loaded with $loader ///");
        m.insertBefore(t, h)
    }();

    function g(e) {
        m.insertBefore(e, h)
    }
    window.$log = window.$log || n;
    var y;

    function v(e, n, r) {
        if ($is(e, "Object")) {
            var a = r;
            r = e;
            e = n;
            n = a
        }
        r = $extend({
            amd: true
        }, r);
        if (r.amd === false) {
            y = window["define"];
            window["define"] = null
        } else if (y) {
            window["define"] = y;
            y = null
        }
        var s = 0,
            m = e.length,
            h = [];

        function w(e, r, a) {
            if (e.couldBeAMD) {
                var u = t[l + 1];
                if (u) {
                    l++;
                    if (u.dep) {
                        (function(e, t) {
                            u.dep = i(u.dep, t.url);
                            v(u.dep, function() {
                                f[t.url] = t.uid;
                                p[t.uid] = h[t.i] = typeof u.fac == "function" ? u.fac.apply(null, arguments) : u.fac;
                                t.couldBeAMD = false;
                                w(t)
                            })
                        })(l, e);
                        return
                    } else {
                        f[e.url] = e.uid;
                        p[e.uid] = h[e.i] = typeof t[l] == "function" ? t[l].apply(null, ["require", "exports", "module"]) : t[l]
                    }
                } else {
                    f[e.url] = e.uid;
                    p[e.uid] = h[e.i]
                }
            } else {
                f[e.url] = e.uid;
                p[e.uid] = h[e.i]
            }
            if (r) {
                $log.fail.pad(e.url, r, ".")
            } else {
                $log.pass.pad(e.url, "loaded # " + e.uid, ".")
            }
            if (d[e.url].length) {
                $io.arr.each(d[e.url], function(t, n) {
                    t && t.apply(c, [p[e.uid]])
                });
                d[e.url].length = 0
            }
            if (++s >= m) {
                n && n.apply(c, h);
                o(h)
            }
        }
        $io.arr.each(e, function(t, i) {
            u++;
            if (!t) {
                console.error("loader: One asset was undefined", e);
                return
            }
            var o = false;
            if (t.indexOf("nocache!") > -1) {
                o = true;
                t = t.replace("nocache!", "")
            }
            var a = (r.baseUrl || "") + t,
                s = $url.getExtention(a),
                l, c = {
                    url: a,
                    type: s,
                    i: i,
                    uid: u
                };

            function m(e, t) {
                w(c, e, t)
            }
            if (d[a] && !f[a]) {
                d[a].push(n);
                return
            } else {
                d[a] = []
            }
            if (!o && f[a]) {
                c.uid = f[a];
                h[i] = p[c.uid];
                m();
                return
            }
            if (/txt|html|php|json|xml/.test(s)) {
                $ajax.get(a).done(function(e) {
                    h[c.i] = e;
                    m()
                }).fail(function(e) {
                    m("ajax error: " + e.status + " " + e.statusText, arguments)
                })
            } else if (/jpg|jpeg|gif|png|svg/.test(s)) {
                h[i] = l = new Image;
                l.id = "dynamicDeps_" + u;
                l.className = "js_dynamic-deps";
                l.onload = function() {
                    m()
                };
                l.onerror = function() {
                    m("image not loaded correctly", arguments)
                };
                l.onabort = function() {
                    m("image not loaded correctly (abort)", arguments)
                };
                l.src = a
            } else if (s === "css") {
                h[i] = l = document.createElement("link");
                l.id = "dynamicDeps_" + u;
                l.className = "js_dynamic-deps";
                l.charset = "utf-8";
                l.rel = "stylesheet";
                l.href = a;
                g(l);
                m()
            } else if (s === "js" || s === "" && r.amd) {
                c.couldBeAMD = true;
                h[i] = l = document.createElement("script");
                l.id = "dynamicDeps_" + u;
                l.className = "js_dynamic-deps";
                l.type = "text/javascript";
                l.charset = "utf-8";
                l.async = r.amd;
                l.defer = true;
                l.onload = l.onreadystatechange = function(e, t) {
                    if (!l.readyState || /loaded|complete/.test(l.readyState)) {
                        if (t) {
                            m("script not loaded correctly (abort)", arguments)
                        } else {
                            m()
                        }
                    }
                };
                l.onerror = function() {
                    m("script not loaded correctly", arguments)
                };
                g(l);
                l.src = a
            } else if (/mp3|opus|ogg|wav|aac|m4a|mp4|weba/.test(s)) {
                h[i] = l = $sound({
                    urls: [a],
                    buffer: false,
                    onload: function() {
                        m()
                    },
                    onloaderror: function() {
                        m("sound not loaded correctly", arguments)
                    }
                })
            } else {
                m("unknown dependencies format")
            }
        })
    }
    r["factories"] = t;
    a["amd"] = {
        plugins: false,
        jQuery: false,
        $loader: {
            version: "0.3.0",
            config: function(e) {}
        }
    };
    e["define"] = a;
    e["require"] = r;
    e["$loader"] = v
}(this);
! function(i) {
    "use strict";

    function t() {}
    i.$file = t
}(this);

function $loop(e, n) {
    "use strict";
    var t, l, o;

    function u(n) {
        e((n - t) / 1e3);
        l = requestAnimationFrame(u);
        t = performance.now()
    }

    function i() {
        e((performance.now() - t) / 1e3);
        l = setTimeout(i, n);
        t = performance.now()
    }

    function c() {
        e();
        l = requestAnimationFrame(c)
    }

    function m() {
        e();
        l = setTimeout(m, n)
    }

    function s(t) {
        a();
        if (t !== undefined) n = t;
        if (e.length) o = n && n > 0 ? i : u;
        else o = n && n > 0 ? m : c;
        o(0);
        return f
    }

    function a() {
        if (n) clearTimeout(l);
        else cancelAnimationFrame(l);
        return f
    }
    var d = false;

    function r() {
        if (d) {
            a();
            d = false
        } else {
            s();
            d = true
        }
    }
    var f = {
        play: s,
        pause: a,
        toggle: r
    };
    return f
}

function $fullscreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen()
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen()
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen()
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
}! function(e) {
    "use strict";

    function n(e, n) {
        "use strict";
        var t = document.getElementById(e);
        var l = t.getContext("2d");
        t.style.display = "none";
        var o = t.width;
        var u = t.height;
        var i = document.getElementById(n);
        var c = i.getContext("2d");

        function m() {
            var e = window.innerWidth;
            var n = window.innerHeight;
            var t = e / o;
            var l = n / u;
            if (t > l) {
                i.width = o * l;
                i.height = n;
                c.scale(l, l)
            } else {
                i.width = e;
                i.height = u * t;
                c.scale(t, t)
            }
            c.webkitImageSmoothingEnabled = false;
            c.oImageSmoothingEnabled = false;
            c.mozImageSmoothingEnabled = false;
            c.imageSmoothingEnabled = false
        }
        m();
        window.onresize = m;
        l.webkitImageSmoothingEnabled = false;
        l.oImageSmoothingEnabled = false;
        l.mozImageSmoothingEnabled = false;
        l.imageSmoothingEnabled = false;
        return {
            origin: {
                canvas: t,
                ctx: l
            },
            display: {
                canvas: i,
                ctx: c
            },
            sync: function() {
                c.drawImage(t, 0, 0)
            }
        }
    }
    e.$pixelperfect = n
}(this);
var $state = {
    loading: function() {
        document.body.classList.add("ui_loading")
    },
    loaded: function() {
        document.body.classList.remove("ui_loading")
    },
    pause: function() {
        document.body.classList.add("ui_pause")
    },
    play: function() {
        document.body.classList.remove("ui_pause")
    }
};
! function(e) {
    "use strict";
    var n = {
        load: function(e, t) {
            $loader(e, function() {
                t.apply(n, arguments)
            })
        },
        _states: {
            opened: {}
        },
        _data: {
            _tree: {}
        }
    };

    function t(e, i) {
        if ($io.is.obj(e) || !e) {
            $extend(n, e);
            t.scope(n)
        }
        if (typeof e == "string" && i && typeof i == "function") t.on(e, i);
        else if (typeof e == "string" && !i) {
            t.trigger(e);
            return n[e]
        } else if (typeof e == "function") t.on("ready", e);
        else if (e instanceof Array && typeof i == "function") {
            t.on("ready", function() {
                n.load(e, i)
            })
        }
    }
    e["system42"] = $watch(t)
}(window);
system42(function() {
    var e = this,
        n = e._apps;

    function t(n) {
        var t = $url.getDomain(n.url);
        if (t && location.hostname != t) {
            $url.checkFavicon(n.url, function(e, t) {
                if (e) n.icon = t;
                else if (img) n.icon = img.src;
                $window(n)
            })
        } else {
            if (n.url.slice(-1) === "/") {
                $explorer(n.url)
            } else {
                var i = $url.getExtention(n.url);
                var o = a.getDefaultApp(i);
                if (o) o.call(e, n);
                else if (i || n.url.indexOf("c/") > -1) $window(n)
            }
        }
    }
    var i, o, r = -1;

    function l(e) {
        --r;
        if (r == 0 && o.length) {
            $route(i.replace(/ \| /g, "&"));
            o.length = 0
        } else {
            $route(i)
        }
    }

    function a(e) {
        "use strict";
        if (e && typeof e == "string" && e.indexOf(" | ") != -1) {
            var l = e.split(" | ");
            o = l;
            r = l.length;
            i = e;
            $io.arr.each(l, function(e, n) {
                setTimeout(function() {
                    a(e)
                }, 700 * n)
            });
            return true
        }
        if (r < 0) {
            i = e
        }
        if (e) {
            if (e.nodeType && e.nodeType === 1) {
                var c = {};
                $io.obj.all(e.attributes, function(e) {
                    if (/^data-/.test(e.name)) {
                        var n = e.name.substr(5).replace(/-(.)/g, function(e, n) {
                            return n.toUpperCase()
                        });
                        c[n] = !e.value && typeof e.value == "string" ? true : e.value
                    }
                });
                if (c.exe) {
                    a(c.exe);
                    return
                }
                if (c.alert) {
                    $alert(c.alert);
                    return
                }
                if (c.error) {
                    $error(c.error);
                    return
                }
                if (c.confirm) {
                    $confirm(c.confirm);
                    return
                }
                if (c.prompt) {
                    $prompt(c.prompt);
                    return
                }
                if (c.url) {
                    if (!c.icon) {
                        var u = e.getElementsByTagName("img")[0];
                        if (u) c.icon = u.src
                    }
                    t(c)
                }
            } else if (n[e] && n[e].exec) {
                return s(n[e], e, $slice(arguments))
            } else {
                var f = e.split(" "),
                    d = f[0];
                if (n[d] && n[d].exec) {
                    var p = [];
                    var m = {};
                    var v = null;
                    var h = 0;
                    $io.arr.all($slice(f), function(e) {
                        if (e.indexOf("--") == 0) {
                            v = e.replace(/^--/, "");
                            m[v] = true;
                            h = 0
                        } else if (v) {
                            if (h == 0) {
                                m[v] = e
                            } else {
                                m[v] = [m[v], e]
                            }
                            h++
                        } else {
                            p.push(e)
                        }
                    });
                    if (Object.keys(m).length) p.push(m);
                    return s(n[d], d, p)
                } else {
                    t({
                        url: e
                    })
                }
            }
        }
        return false
    }

    function s(n, t, i) {
        if (n.cmd === true && !e._states.opened["terminal"]) {
            $terminal({
                onopen: function() {
                    setTimeout(function() {
                        n.exec.apply(e, i);
                        l(t)
                    }, 100)
                }
            })
        } else {
            n.exec.apply(e, i);
            l(t)
        }
        return true
    }
    var c = {};
    $io.obj.all(n, function(e, n) {
        if (e.filetype) {
            $io.arr.all(e.filetype, function(n) {
                c[n] = e
            })
        }
    });
    a.getDefaultApp = function(e) {
        if (c[e] && c[e].exec) {
            return c[e].exec
        } else {
            return null
        }
    };
    window.$exe = a
});
system42(function() {
    "use strict";
    var e = this;

    function n(n) {
        var t;
        n = n || {
            onopen: $noop
        };
        $window({
            title: "Terminal",
            icon: e._apps.terminal.icon,
            bodyClass: "ui_terminal",
            onopen: function(i, o) {
                t = $cli({
                    cols: 60,
                    prompt: ">",
                    el: o
                });
                e._states.opened["terminal"] = {
                    loaded: true,
                    body: o,
                    cli: t
                };
                t.input.focus();
                n.onopen()
            },
            onclose: function() {
                e._states.opened["terminal"] = null;
                t.destroy()
            }
        })
    }
    window.$terminal = n
});
system42(function() {
    "use strict";
    var e = this,
        n = document.getElementById("templ_computer").innerHTML;
    $el(this._desktop).on("dblclick touchend", ".ui_explorer--nobrowse .ui_icon", function() {
        $exe(this)
    });

    function t(t, i) {
        if (typeof t == "object") {
            i = t;
            t = "/"
        }
        var o = {
                list: false,
                browse: false,
                nav: false,
                onopen: $noop,
                onclose: $noop
            },
            r = $extend(o, i),
            l = 0,
            a;
        if (r.browse) r.nav = true;
        if (!t) t = "/";
        if (t.slice(-1) !== "/") t += "/";

        function s(t) {
            if (t.slice(-1) !== "/") t += "/";
            if (!r.browse) {
                $route("dora " + t + (r.list ? " --list" : "") + (r.nav ? " --nav" : ""))
            }
            if (t === "/") {
                return n
            } else {
                var i = [],
                    o = [],
                    l = $io.obj.getPath(e._files, t || "c", "/");
                for (var a in l) {
                    if (l.hasOwnProperty(a)) {
                        if (typeof l[a] == "string") {
                            o.push(l[a])
                        } else if ($io.is.obj(l[a]) || $io.is.arr(l[a])) {
                            i.push(a)
                        }
                    }
                }
                var s = "";
                $io.arr.all(i.sort(), function(e, n) {
                    s += '<div tabindex="0" class="ui_icon icon-folder" ' + 'data-url="' + t + e + '/" ' + '><img src="c/sys/ico32/folder.png">' + "<span>" + e + "</span></div>"
                });
                $io.arr.all(o.sort(), function(n, i) {
                    var o = e.getFileInfo(n);
                    s += '<div tabindex="0" class="ui_icon icon-file" ' + 'data-url="' + t + n + '" ' + '><img src="c/sys/ico32/' + o.icon + '">' + "<span>" + n + "</span></div>"
                });
                return s
            }
        }

        function c(e) {
            var n = [];
            for (var t in e) {
                if (e.hasOwnProperty(t)) {
                    if ($io.is.arr(e[t])) {
                        n.push({
                            name: t
                        })
                    } else if ($io.is.obj(e[t])) {
                        n.push({
                            name: t,
                            items: function(e) {
                                return c(e)
                            }(e[t])
                        })
                    }
                }
            }
            return n.sort()
        }

        function u() {
            b.value = $el(this).data("url")
        }

        function f() {
            b.value = $el(this).data("url");
            a.close(true)
        }

        function d() {
            var e = $el(this).data("url");
            p(e)
        }

        function p(e) {
            y.value = e;
            k.innerHTML = s(e)
        }

        function m() {
            var e = y.value;
            var n = e.slice(0, -1).split("/");
            n.pop();
            e = n.join("/");
            p(e || "/")
        }

        function v() {
            var e = y.value;
            p(e)
        }

        function h(e) {
            e = e || window.event;
            if (typeof e.which !== "number") e.which = e.keyCode;
            if (e.which == 13) {
                v()
            }
        }
        var _ = {};
        _.bodyClass = "skin_inset_deep skin_light ui_explorer";
        _.icon = "/c/sys/ico32/computer.png";
        if (r.browse) {
            _.title = "explorer";
            _.bodyClass += " ui_explorer--browse";
            _.btnOk = "Open";
            _.btnCancel = "Cancel";
            var b = document.createElement("input");
            b.type = "text";
            b.className = "ui_explorer__selected_file";
            b.value = t;
            _.footer = b
        } else {
            _.title = t;
            _.bodyClass += " ui_explorer--nobrowse"
        }
        if (r.nav) {
            var $ = document.createElement("div"),
                y = document.createElement("input"),
                g = document.createElement("button"),
                w = document.createElement("button"),
                x = document.createElement("button");
            $.className = "ui_explorer__nav";
            g.innerHTML = "<";
            g.className = "ui_explorer__nav__prev";
            w.innerHTML = ">";
            w.className = "ui_explorer__nav__next";
            x.innerHTML = "Go";
            x.className = "ui_explorer__nav__go";
            y.type = "text";
            y.value = t;
            y.className = "ui_explorer__nav__input";
            $.appendChild(g);
            $.appendChild(y);
            $.appendChild(x);
            _.afterMenu = $;
            g.addEventListener("click", m, false);
            x.addEventListener("click", v, false);
            y.addEventListener("keypress", h, false)
        }
        _.onopen = function() {
            if (r.browse) $el(this.el.base).on("click", ".icon-file", u);
            if (r.browse) $el(this.el.base).on("dblclick touchend", ".icon-file", f);
            if (r.nav) $el(this.el.base).on("dblclick touchend", ".icon-folder", d);
            r.onopen.call(this)
        };
        _.onclose = function(e) {
            if (r.browse) $el(this.el.base).off("click", ".icon-file", u);
            if (r.browse) $el(this.el.base).off("dblclick touchend", ".icon-file", f);
            if (r.nav) $el(this.el.base).off("dblclick touchend", ".icon-folder", d);
            if (r.nav) g.removeEventListener("click", m, false);
            if (r.nav) x.removeEventListener("click", v, false);
            if (y) y.removeEventListener("keypress", h, false);
            if (r.browse) r.onclose.call(this, e, b.value);
            else r.onclose.call(this)
        };
        var k = document.createElement("div");
        if (r.list) {
            _.bodyClass += " ui_explorer--panes ui_explorer--list";
            var C = document.createDocumentFragment(),
                T = document.createElement("div");
            T.className = "ui_explorer--panes__tree";
            k.className = "ui_explorer--panes__folder";
            $menu(T, c(e._files.c), {
                mode: "tree"
            });
            $resize(T, "e");
            k.innerHTML = s(t);
            C.appendChild(T);
            C.appendChild(k);
            _.html = C
        } else {
            _.bodyClass += " ui_explorer--folder";
            k.innerHTML = s(t);
            _.html = k
        }
        a = $window(_)
    }
    window.$explorer = t
});

function $tooltip(e, n) {
    var t = document.createElement("div");
    t.innerHTML = n;
    t.className = "ui_tooltip animated fadeIn";
    document.getElementById("w93_desktop").appendChild(t);
    $pos(t, {
        at: e
    })
}! function(e) {
    "use strict";
    var n = {
        title: "Login",
        bodyClass: "skin_base",
        height: "auto",
        width: "auto",
        url: "/nop",
        ajax: true,
        btnOk: "Submit",
        btnCancel: "Cancel",
        onsubmit: function(e, n) {
            var t = this;
            var i = this.el.form;
            var o = this.cfg;
            if (e && n) {
                $ajax.post(n.action, n.post).done(function(e) {
                    o.done.call(t, e)
                }).fail(function(e) {
                    console.table(e);
                    $io.obj.all(e, function(e, n) {
                        if (i[n] && e) {
                            i[n].title = e;
                            i[n].classList.add("invalid")
                        }
                    })
                })
            }
            return false
        },
        onclose: function() {
            console.log(arguments)
        }
    };
    e.$request = function(e) {
        if (typeof e == "string") {
            e = {
                title: arguments[0],
                url: arguments[1],
                btnOk: arguments[0],
                done: arguments[2]
            }
        }
        var t = $extend(n, e);
        $window(t)
    }
}(this);
! function(e) {
    "use strict";
    var n = [],
        t = document.createElement("div");

    function i(e) {
        t.innerHTML = e.innerHTML.replace(/\n|<br>|<div><br><\/div>|<div>/g, "_newline___ktlu_");
        var n = t.innerText || t.textContent;
        return $io.str.autolink(n.replace(/\n|_newline___ktlu_/g, "<br>"))
    }
    var o = "--- Type something ---";
    var r = function(e) {
        var t = 0;
        if (!e) e = o;
        $window($extend({
            baseClass: "ui_note",
            icon: "c/sys/ico32/pin.png",
            title: "Note",
            html: e,
            baseHeight: 200,
            baseWidth: 200,
            img: null,
            dock: null,
            maximi: true,
            resizable: true,
            onopen: function(e, o) {
                t = n.push({
                    el: e,
                    body: o
                }) - 1;
                o.setAttribute("tabindex", "0");
                o.innerHTML = i(o);
                o.onblur = function() {
                    o.innerHTML = i(o)
                };
                o.onfocus = function() {
                    o.contentEditable = true;
                    o.style.borderColor = "#000"
                }
            },
            onclose: function(e, i) {
                n[t] = null
            }
        }, e))
    };
    e.$note = r;
    var l = ["Lorem ipsum dolor sit amet,\n www.windows93.net", "ho yeah"]
}(this);
! function(e) {
    "use strict";

    function n(e) {
        e.className = "ui_notif animated fadeOut";
        setTimeout(function() {
            if (e.parentNode) e.parentNode.removeChild(e)
        }, 500)
    }
    e.$notif = function(e, t) {
        var i = document.createElement("div"),
            o = document.createElement("b"),
            r = document.createElement("p"),
            l = document.createElement("span");
        i.style.visibility = "hidden";
        i.className = "ui_notif";
        l.innerHTML = "&times;";
        if (typeof e == "string") {
            e = {
                description: e
            }
        }
        if (e.title) {
            o.innerHTML = e.title;
            i.appendChild(o)
        }
        r.innerHTML = e.description;
        i.appendChild(r);
        i.appendChild(l);
        l.onclick = function() {
            n(i)
        };
        i.onmouseover = function() {
            clearTimeout(s)
        };
        i.onmouseout = function() {
            c()
        };
        document.getElementById("w93_desktop").appendChild(i);
        i.style.zIndex = 9999999;
        setTimeout(function() {
            i.style.visibility = "visible";
            i.className = "ui_notif animated fadeIn";
            a()
        }, 2e3);

        function a() {
            if (t) {
                i.style.bottom = "auto";
                i.style.right = "auto";
                $pos(i, {
                    my: "right bottom",
                    at: "center center",
                    of: t,
                    collision: "flipfit"
                })
            }
        }
        var s;

        function c() {
            s = setTimeout(function() {
                n(i)
            }, 20000)
        }
        c()
    }
}(this);