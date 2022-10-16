!function (e, t) {
  window.micell = t()
  "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).micell = t()
}(this, (function () {
  "use strict";

  function e(e) {
    for (var t = "", n = 0; n < e.length; n++) t += ("0" + (255 & e[n]).toString(16)).slice(-2);
    return t
  }

  for (var t = function (e) {
    return function (t) {
      return Object.prototype.toString.call(t) === "[object " + e + "]"
    }
  }, n = t("String"), r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = {}, o = 0; o < r.length; o++) {
    var a = r.charAt(o);
    i[a] = o
  }

  function s(e) {
    for (var t = "", n = 0; n < 4; n++) {
      var r = e.charAt(n), o = i[r];
      if (o > -1) {
        var a = o.toString(2);
        t += "000000".slice(0, 6 - a.length) + a
      }
    }
    for (var s = [], u = (n = 0, Math.floor(t.length / 8)); n < u; n++) s.push(parseInt(t.slice(8 * n, 8 * (n + 1)), 2));
    return s
  }

  function u(t, r) {
    if (void 0 === r && (r = {}), !n(t)) throw TypeError("input parameter should be a string");
    for (var i = r.encoding, o = void 0 === i ? "utf8" : i, a = [], u = 0, c = Math.ceil(t.length / 4); u < c; u++) a.push.apply(a, s(t.slice(4 * u, 4 * (u + 1))));
    return "binary" === o ? a : "hex" === o ? e(a) : function (e) {
      for (var t = [], n = 0, r = "", i = -1, o = 0; o < e.length; o++) (i = e[o]) < 128 ? t.push(e[o]) : i < 224 ? (n = ((31 & e[o]) << 6) + (63 & e[++o]), t.push(n)) : i < 240 ? (n = ((15 & e[o]) << 12) + ((63 & e[++o]) << 6) + (63 & e[++o]), t.push(n)) : (n = ((7 & e[o]) << 18) + ((63 & e[++o]) << 12) + ((63 & e[++o]) << 6) + (63 & e[++o]), n -= 65536, t.push(55296 + (n >> 10), n % 1024 + 56320)), t.length > 16383 && (r += String.fromCharCode.apply(null, t), t.length = 0);
      return r += String.fromCharCode.apply(null, t)
    }(a)
  }

  function c(e) {
    for (var t = [], n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 127) t.push(r); else if (r < 2047) {
        var i = r >> 6 | 192, o = 63 & r | 128;
        t.push(i, o)
      } else if (r >= 55296 && r <= 56319) {
        n++;
        i = (r = 65536 + 1024 * (r - 55296) + e.charCodeAt(n) - 56320) >> 18 | 240, o = r >> 12 & 63 | 128;
        var a = r >> 6 & 63 | 128, s = 63 & r | 128;
        t.push(i, o, a, s)
      } else {
        i = r >> 12 | 224, o = r >> 6 & 63 | 128, a = 63 & r | 128;
        t.push(i, o, a)
      }
    }
    return t
  }

  var f = t("Array"), l = t("Uint8Array");

  function d(e) {
    for (var t = e.length, n = "", r = 3 - t, i = "", o = 0; o < t; o++) {
      var a = e[o].toString(2);
      n += "00000000".slice(0, 8 - a.length) + a
    }
    1 === t ? n += "00000000".slice(0, 4) : 2 === t && (n += "00000000".slice(0, 2));
    o = 0;
    for (var s = n.length / 6; o < s; o++) {
      i += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[parseInt(n.slice(6 * o, 6 * (o + 1)), 2)]
    }
    for (; r--;) i += "=";
    return i
  }

  var h = u, g = function (e, t) {
    return new Promise((function (n, r) {
      try {
        var i = t.type, o = u(e, {encoding: "binary"});
        n(new Blob([Uint8Array.from(o)], {type: i}))
      } catch (e) {
        r(e)
      }
    }))
  }, v = function (e) {
    var t = [];
    if ("string" == typeof e) t = c(e); else {
      if (!f(e) && !l(e)) throw TypeError("the input parameter must be one of String, Byte Array, Uint8Array");
      t = e
    }
    for (var n = "", r = 0, i = Math.ceil(t.length / 3); r < i; r++) n += d(Array.prototype.slice.call(t, 3 * r, 3 * (r + 1)));
    return n
  }, p = function (e) {
    return new Promise((function (t, n) {
      var r = new FileReader;
      r.addEventListener("load", (function () {
        var e = r.result ? r.result.replace(/data:.+?,/, "") : "";
        t(e)
      })), r.addEventListener("error", (function () {
        n(new Error("error occurred in reading file"))
      })), r.readAsDataURL(e)
    }))
  }, m = function (e) {
    return !(!n(e) || 1 !== e.length) && /[\u1100-\u11ff\u2e80-\u2fdf\u3040-\u318f\u3200-\u4dbf\u4e00-\u9fff\ua960-\ua97f\uf900-\ufaff\u3000-\u303f\uac00-\ud7af\ufe10-\ufe1f\ufe30-\ufe6f\uff00-\uff60\uffe0-\uffef]/.test(e)
  }, w = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 65 && t <= 90 || t >= 97 && t <= 122
    }
    return !1
  }, b = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122
    }
    return !1
  }, y = function (e) {
    return !(!n(e) || 1 !== e.length) && e.charCodeAt(0) <= 127
  }, A = m, M = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 0 && t <= 31 || 127 === t
    }
    return !1
  }, E = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 48 && t <= 57
    }
    return !1
  }, S = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 33 && t <= 126
    }
    return !1
  }, C = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 48 && t <= 57 || t >= 65 && t <= 70 || t >= 97 && t <= 102
    }
    return !1
  }, T = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 97 && t <= 122
    }
    return !1
  }, $ = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 32 && t <= 126
    }
    return !1
  }, x = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 33 && t <= 47 || t >= 58 && t <= 64 || t >= 91 && t <= 96 || t >= 123 && t <= 126
    }
    return !1
  }, O = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 9 && t <= 13 || 32 === t
    }
    return !1
  }, I = function (e) {
    if (n(e) && 1 === e.length) {
      var t = e.charCodeAt(0);
      return t >= 65 && t <= 90
    }
    return !1
  }, R = function () {
    return (R = Object.assign || function (e) {
      for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
      return e
    }).apply(this, arguments)
  };

  function D(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  }

  function U(e) {
    var t = e.charAt(e.length - 1), n = parseInt(e, 10), r = new Date;
    switch (t) {
      case"Y":
        r.setFullYear(r.getFullYear() + n);
        break;
      case"M":
        r.setMonth(r.getMonth() + n);
        break;
      case"D":
        r.setDate(r.getDate() + n);
        break;
      case"h":
        r.setHours(r.getHours() + n);
        break;
      case"m":
        r.setMinutes(r.getMinutes() + n);
        break;
      case"s":
        r.setSeconds(r.getSeconds() + n);
        break;
      default:
        r = new Date(e)
    }
    return r
  }

  function k(e, t, n, r) {
    void 0 === n && (n = {}), void 0 === r && (r = encodeURIComponent);
    var i = function (e) {
      var t, n = "";
      for (t in e) if (D(e, t)) if (/^expires$/i.test(t)) {
        var r = e[t];
        "object" != typeof r && (r += "number" == typeof r ? "D" : "", r = U(String(r))), n += ";" + t + "=" + r.toUTCString()
      } else /^secure$/.test(t) ? e[t] && (n += ";" + t) : n += ";" + t + "=" + String(e[t]);
      return D(e, "path") || (n += ";path=/"), n
    }(n), o = e + "=" + ("function" == typeof r ? r(t) : t) + i;
    document.cookie = o
  }

  function L(e, t) {
    var n = {expires: -1};
    t && (n = R(R({}, t), n)), k(e, "a", n)
  }

  function F(e) {
    return e.replace(/[.*+?^$|[\](){}\\-]/g, "\\$&")
  }

  function H(e, t) {
    if (void 0 === t && (t = decodeURIComponent), !n(e) || !e) return null;
    var r = new RegExp("(?:^|; )" + F(e) + "(?:=([^;]*))?(?:;|$)").exec(document.cookie);
    return null === r ? null : "function" == typeof t ? t(r[1]) : r[1]
  }

  var P = function () {
    var e = new RegExp("(?:^|; )@key@=1(?:;|$)");
    document.cookie = "@key@=1;path=/;";
    var t = e.test(document.cookie);
    return t && L("@key@"), t
  }, j = H, N = function (e) {
    void 0 === e && (e = decodeURIComponent);
    for (var t, n = /(?:^|; )([^=]+?)(?:=([^;]*))?(?:;|$)/g, r = {}; t = n.exec(document.cookie);) n.lastIndex = t.index + t.length - 1, r[t[1]] = "function" == typeof e ? e(t[2]) : t[2];
    return r
  }, Y = function (e) {
    return H(e, JSON.parse)
  }, W = function (e) {
    return H(e, null)
  }, q = k, z = function (e, t, n) {
    k(e, t, n, JSON.stringify)
  }, B = function (e, t, n) {
    k(e, t, n, null)
  }, X = L, J = t("Date");
  var Z = t("Number"), Q = function (e, t, n) {
    void 0 === e && (e = ""), void 0 === t && (t = 0), void 0 === n && (n = " ");
    for (var r = String(e), i = String(n), o = "", a = t - r.length; o.length < a;) o += i;
    return (o = o.slice(0, a)) + r
  };
  var V = {
    en_US: [["just now", "right now"], ["%s seconds ago", "in %s seconds"], ["1 minute ago", "in 1 minute"], ["%s minutes ago", "in %s minutes"], ["1 hour ago", "in 1 hour"], ["%s hours ago", "in %s hours"], ["1 day ago", "in 1 day"], ["%s days ago", "in %s days"], ["1 week ago", "in 1 week"], ["%s weeks ago", "in %s weeks"], ["1 month ago", "in 1 month"], ["%s months ago", "in %s months"], ["1 year ago", "in 1 year"], ["%s years ago", "in %s years"]],
    zh_CN: [["刚刚", "片刻后"], ["%s 秒前", "%s 秒后"], ["1 分钟前", "1 分钟后"], ["%s 分钟前", "%s 分钟后"], ["1 小时前", "1 小时后"], ["%s 小时前", "%s 小时后"], ["1 天前", "1 天后"], ["%s 天前", "%s 天后"], ["1 周前", "1 周后"], ["%s 周前", "%s 周后"], ["1 个月前", "1 个月后"], ["%s 个月前", "%s 个月后"], ["1 年前", "1 年后"], ["%s 年前", "%s 年后"]]
  }, _ = "en_US", G = {
    diff: function (e, t, n, r) {
      void 0 === r && (r = Math.round);
      var i = J(e) ? e : new Date(e), o = (J(t) ? t : new Date(t)).getTime() - i.getTime(), a = 0;
      switch (n) {
        case"Y":
          a = r(o / 31536e6);
          break;
        case"M":
          a = r(o / 2592e6);
          break;
        case"D":
          a = r(o / 864e5);
          break;
        case"h":
          a = r(o / 36e5);
          break;
        case"m":
          a = r(o / 6e4);
          break;
        case"s":
          a = r(o / 1e3);
          break;
        case"ms":
        default:
          a = o
      }
      return a
    }, format: function (e, t, r) {
      if (!Z(e) && !n(e) && !J(e)) throw new Error("The first parameter should be a number, a parsable date string or a Date object");
      var i;
      if (i = Z(e) || n(e) ? new Date(e) : e, !n(t)) return i.toString();
      var o = r ? i.getUTCFullYear() : i.getFullYear(), a = r ? i.getUTCMonth() : i.getMonth(),
        s = r ? i.getUTCDate() : i.getDate(), u = r ? i.getUTCHours() : i.getHours(), c = u % 12,
        f = u < 12 ? "AM" : "PM", l = r ? i.getUTCMinutes() : i.getMinutes(),
        d = r ? i.getUTCSeconds() : i.getSeconds(), h = r ? i.getUTCMilliseconds() : i.getMilliseconds();
      return t.replace(/(^|[^Y])YYYY([^Y]|$)/g, "$1" + o + "$2").replace(/(^|[^Y])YY([^Y]|$)/g, "$1" + String(o).slice(-2) + "$2").replace(/(^|[^M])MM([^M]|$)/g, "$1" + Q(a + 1, 2, "0") + "$2").replace(/(^|[^M])M([^M]|$)/g, "$1" + a + "$2").replace(/(^|[^D])DD([^D]|$)/g, "$1" + Q(s, 2, "0") + "$2").replace(/(^|[^D])D([^D]|$)/g, "$1" + s + "$2").replace(/(^|[^H])HH([^H]|$)/g, "$1" + Q(u, 2, "0") + "$2").replace(/(^|[^H])H([^H]|$)/g, "$1" + u + "$2").replace(/(^|[^h])hh([^h]|$)/g, "$1" + Q(c, 2, "0") + "$2").replace(/(^|[^h])h([^h]|$)/g, "$1" + c + "$2").replace(/(^|[^A])A([^A]|$)/g, "$1" + f + "$2").replace(/(^|[^a])a([^a]|$)/g, "$1" + f.toLowerCase() + "$2").replace(/(^|[^m])mm([^m]|$)/g, "$1" + Q(l, 2, "0") + "$2").replace(/(^|[^m])m([^m]|$)/g, "$1" + l + "$2").replace(/(^|[^s])ss([^s]|$)/g, "$1" + Q(d, 2, "0") + "$2").replace(/(^|[^s])s([^s]|$)/g, "$1" + d + "$2").replace(/(^|[^S]+)([S]+)([^S]+|$)/g, (function (e, t, n, r) {
        for (var i = Q(String(h), 3, "0"), o = 3; o < n.length; o++) i += "0";
        return "" + t + (i = i.slice(0, n.length)) + r
      }))
    }, parse: function (e, t) {
      if (void 0 === t && (t = !1), !Z(e) && !n(e) && !J(e)) throw new Error("The first parameter should be a number, a parsable date string or a Date object");
      var r;
      return r = Z(e) || n(e) ? new Date(e) : e, {
        years: t ? r.getUTCFullYear() : r.getFullYear(),
        months: t ? r.getUTCMonth() : r.getMonth(),
        dates: t ? r.getUTCDate() : r.getDate(),
        hours: t ? r.getUTCHours() : r.getHours(),
        minutes: t ? r.getUTCMinutes() : r.getMinutes(),
        seconds: t ? r.getUTCSeconds() : r.getSeconds(),
        milliseconds: t ? r.getUTCMilliseconds() : r.getMilliseconds()
      }
    }, timeAgo: {
      getLocale: function () {
        return _
      }, setLocale: function (e) {
        D(V, e) && (_ = e)
      }, addLocale: function (e, t) {
        V[e] = t
      }, format: function (e, t, n) {
        void 0 === t && (t = _), void 0 === n && (n = new Date);
        var r = new Date(e), i = D(V, t) ? t : _, o = n.getTime() - r.getTime() >= 0 ? 1 : -1,
          a = Math.abs(n.getTime() - r.getTime()), s = Math.floor(a / 31536e6), u = Math.floor(a / 2592e6),
          c = Math.floor(a / 6048e5), f = Math.floor(a / 864e5), l = Math.floor(a / 36e5), d = Math.floor(a / 6e4),
          h = Math.floor(a / 1e3), g = 0, v = 0;
        0 === h ? (g = 0, v = 0) : h >= 1 && 0 === d ? (g = 1, v = h) : 1 === d ? (g = 2, v = d) : d > 1 && 0 === l ? (g = 3, v = d) : 1 === l ? (g = 4, v = l) : l > 1 && 0 === f ? (g = 5, v = l) : 1 === f ? (g = 6, v = f) : f > 1 && 0 === c ? (g = 7, v = f) : 1 === c ? (g = 8, v = c) : c > 1 && 0 === u ? (g = 9, v = c) : 1 === u ? (g = 10, v = u) : u > 1 && 0 === s ? (g = 11, v = u) : 1 === s ? (g = 12, v = s) : (g = 13, v = s);
        var p = V[i][g];
        return (o > 0 ? p[0] : p[1]).replace(/%s/, String(v))
      }
    }
  };

  function K(e) {
    return !(!e || 1 !== e.nodeType)
  }

  function ee(e) {
    if (!K(e)) return 0;
    for (var t = e, n = 0; t;) n += t.offsetLeft, t = t.offsetParent;
    return n
  }

  function te(e) {
    return !(!e || e.self !== e)
  }

  function ne(e) {
    void 0 === e && (e = window);
    var t = 0;
    if (te(e)) {
      var n = e;
      t = n.scrollX || n.pageXOffset || n.document.documentElement.scrollLeft
    } else K(e) && (t = e.scrollLeft);
    return t
  }

  function re(e) {
    if (!K(e)) return 0;
    for (var t = e, n = 0; t;) n += t.offsetTop, t = t.offsetParent;
    return n
  }

  function ie(e) {
    void 0 === e && (e = window);
    var t = 0;
    if (te(e)) {
      var n = e;
      t = n.scrollY || n.pageYOffset || n.document.documentElement.scrollTop
    } else K(e) && (t = e.scrollTop);
    return t
  }

  var oe, ae = [], se = "object" == typeof document && document, ue = se && se.documentElement.doScroll,
    ce = se && (ue ? /^loaded|^c/ : /^loaded|^i|^c/).test(se.readyState);

  function fe(e, t) {
    void 0 === t && (t = {});
    var n = document.createElement("script");
    return n.src = e, Object.keys(t).forEach((function (e) {
      n[e] = t[e]
    })), document.body.appendChild(n), n
  }

  function le(e) {
    var t = 0, n = 0;
    if (te(e)) {
      var r = e;
      t = r.innerWidth || r.document.documentElement.clientWidth, n = r.innerHeight || r.document.documentElement.clientHeight
    } else if (K(e)) {
      var i = e;
      t = i.clientWidth, n = i.clientHeight
    }
    return {width: t, height: n}
  }

  !ce && se && (oe = function () {
    var e = ae.shift();
    for (se.removeEventListener("DOMContentLoaded", oe), ce = !0; e;) e(), e = ae.shift()
  }, se.addEventListener("DOMContentLoaded", oe));
  var de = t("Object"), he = function (e) {
    return "function" == typeof e
  }, ge = "function" == typeof Float32Array;

  function ve(e, t) {
    return 1 - 3 * t + 3 * e
  }

  function pe(e, t) {
    return 3 * t - 6 * e
  }

  function me(e) {
    return 3 * e
  }

  function we(e, t, n) {
    return ((ve(t, n) * e + pe(t, n)) * e + me(t)) * e
  }

  function be(e, t, n) {
    return 3 * ve(t, n) * e * e + 2 * pe(t, n) * e + me(t)
  }

  function ye(e) {
    return e
  }

  function Ae(e, t, n, r) {
    if (!(e >= 0 && e <= 1 && n >= 0 && n <= 1)) throw new Error("bezier x values must be in [0, 1] range");
    if (e === t && n === r) return ye;
    for (var i = ge ? new Float32Array(11) : new Array(11), o = 0; o < 11; ++o) i[o] = we(.1 * o, e, n);

    function a(t) {
      for (var r = 0, o = 1; 10 !== o && i[o] <= t; ++o) r += .1;
      --o;
      var a = r + .1 * ((t - i[o]) / (i[o + 1] - i[o])), s = be(a, e, n);
      return s >= .001 ? function (e, t, n, r) {
        for (var i = 0; i < 4; ++i) {
          var o = be(t, n, r);
          if (0 === o) return t;
          t -= (we(t, n, r) - e) / o
        }
        return t
      }(t, a, e, n) : 0 === s ? a : function (e, t, n, r, i) {
        var o, a, s = 0;
        do {
          (o = we(a = t + (n - t) / 2, r, i) - e) > 0 ? n = a : t = a
        } while (Math.abs(o) > 1e-7 && ++s < 10);
        return a
      }(t, r, r + .1, e, n)
    }

    return function (e) {
      return 0 === e ? 0 : 1 === e ? 1 : we(a(e), t, r)
    }
  }

  var Me, Ee = Ae(0, 0, 1, 1), Se = Ae(.25, .1, .25, 1), Ce = Ae(.42, 0, 1, 1), Te = Ae(.42, 0, .58, 1),
    $e = Ae(0, 0, .58, 1), xe = "undefined" != typeof window && void 0 !== window.document;
  if (xe && window.performance && window.performance.now) Me = function () {
    return performance.now()
  }; else {
    var Oe = Date.now();
    Me = function () {
      return Date.now() - Oe
    }
  }
  for (var Ie = Me, Re = ["webkit", "moz"], De = xe ? window : global, Ue = "AnimationFrame", ke = De["request" + Ue], Le = De["cancel" + Ue], Fe = 0; Fe < Re.length && !ke; Fe++) ke = De[Re[Fe] + "Request" + Ue], Le = De[Re[Fe] + "Cancel" + Ue];
  if (!ke || !Le) {
    var He = [], Pe = 0, je = 0;
    ke = function (e) {
      if (0 === He.length) {
        var t = Ie(), n = Math.max(0, 1e3 / 60 - (t - Pe));
        Pe = t + n, setTimeout((function () {
          var e = He.slice();
          He.length = 0;
          for (var t = 0; t < e.length; t++) if (!e[t].cancelled) try {
            e[t].callback(Pe)
          } catch (e) {
            setTimeout((function () {
              throw e
            }), 0)
          }
        }), Math.round(n))
      }
      var r = je++;
      return He.push({timerId: r, callback: e, cancelled: !1}), r
    }, Le = function (e) {
      for (var t = 0; t < He.length; t++) He[t].timerId === e && (He[t].cancelled = !0)
    }
  }

  function Ne(e) {
    return ke.call(De, e)
  }

  Ne.cancel = function (e) {
    Le.call(De, e)
  };
  var Ye = {linear: Ee, ease: Se, "ease-in": Ce, "ease-in-out": Te, "ease-out": $e},
    We = /^(linear|ease|ease-in|ease-in-out|ease-out)$/,
    qe = /^cubic-bezier\(\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*\)$/;
  var ze = function (e) {
    var t = 0;
    return K(e) && (t = ee(e) - ne()), t
  }, Be = function (e) {
    var t = 0;
    return K(e) && (t = re(e) - ie()), t
  }, Xe = function (e, t) {
    void 0 === t && (t = {});
    var n, r = t.bubbles, i = void 0 !== r && r, o = t.cancelable, a = void 0 !== o && o, s = t.detail,
      u = void 0 === s ? null : s;
    try {
      n = new CustomEvent(e, t)
    } catch (t) {
      "function" == typeof (n = document.createEvent("Event")).initCustomEvent ? n.initCustomEvent(e, i, a, u) : (n.initEvent(e, i, a), n.detail = u)
    }
    return n
  }, Je = function (e) {
    ce ? setTimeout(e, 0) : ae.push(e)
  }, Ze = fe, Qe = K, Ve = function (e) {
    if (!K(e)) return !1;
    var t = e.getBoundingClientRect(), n = t.top, r = t.left, i = t.right, o = t.bottom, a = le(window), s = a.width,
      u = a.height;
    return !(n < 0 || o > u || r < 0 || i > s)
  }, _e = te, Ge = ee, Ke = re, et = function (e) {
    if (!e) return document.documentElement.scrollHeight;
    if (!K(e)) throw new TypeError("the parameter el must be an valid html element");
    return e.scrollHeight
  }, tt = function (e) {
    if (!e) return document.documentElement.scrollWidth;
    if (!K(e)) throw new TypeError("the parameter el must be an valid html element");
    return e.scrollWidth
  }, nt = function (e, t, n) {
    void 0 === t && (t = 0), void 0 === n && (n = 0);
    var r = window, i = {};
    K(e) || te(e) ? (r = e, de(t) ? i = t : (i.x = t, i.y = n)) : de(e) ? i = e : (i.x = e || 0, i.y = t), D(i, "x") || (i.x = i.left || 0), D(i, "y") || (i.y = i.top || 0);
    var o = function (e) {
      var t = e.x, n = e.y, i = e.behavior;
      he(r.scrollTo) ? i ? r.scrollTo({
        left: t,
        top: n,
        behavior: i
      }) : r.scrollTo(t, n) : (void 0 !== t && (r.scrollLeft = t), void 0 !== n && (r.scrollTop = n))
    };
    if (i.easing) {
      var a;
      if (We.test(i.easing)) a = Ye[i.easing]; else {
        if (!qe.test(i.easing)) return void o(i);
        var s = i.easing.match(qe), u = 0, c = 0, f = 0, l = 0;
        s && (u = Number(s[1]), c = Number(s[2]), f = Number(s[3]), l = Number(s[4])), a = Ae(u, c, f, l)
      }
      var d = ne(r), h = ie(r), g = i.x - d, v = i.y - h, p = Math.max(Math.abs(g), Math.abs(v)),
        m = Math.min(150 + p / 1e3 * 100, 500), w = Math.ceil(m / 62.5), b = d, y = h, A = 0, M = function (e) {
          A <= w && (b = d + g * Math.max(a(A / w), 1), y = h + v * Math.max(a(A / w), 1), o({x: b, y: y}), A++, Ne(M))
        };
      Ne(M)
    } else o(i)
  }, rt = ne, it = ie, ot = le, at = {cubicBezier: Ae, ease: Se, easeIn: Ce, easeInOut: Te, easeOut: $e, linear: Ee};
  var st = function () {
    function e() {
      this["@events"] = {}
    }

    return e.prototype.on = function (e, t) {
      (this["@events"][e] = this["@events"][e] || []).push(t)
    }, e.prototype.once = function (e, t) {
      var n = function () {
        for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
        return t.apply(this, e)
      };
      n.$once = !0, this.on(e, n)
    }, e.prototype.off = function (e, t) {
      var n = this["@events"][e];
      if (0 === arguments.length) this["@events"] = {}; else if (1 === arguments.length) delete this["@events"][e]; else if (n) {
        for (var r = n.length, i = 0; i < r;) n[i] === t ? (n.splice(i, 1), r--) : i++;
        n.length || delete this["@events"][e]
      }
    }, e.prototype.emit = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      var r = this["@events"][e];
      if (r) for (var i = r.slice(), o = 0; o < i.length; o++) {
        var a = i[o];
        a.$once && this.off(e, a), a.apply(this, t)
      }
    }, e.prototype.getListeners = function (e) {
      return e ? this["@events"][e] || [] : function (e) {
        var t = [];
        for (var n in e) D(e, n) && (t = t.concat(e[n]));
        return t
      }(this["@events"])
    }, e
  }();

  function ut() {
    return new st
  }

  var ct = ut(), ft = ct.emit.bind(ct), lt = ct.getListeners.bind(ct), dt = ct.off.bind(ct), ht = ct.on.bind(ct),
    gt = ct.once.bind(ct), vt = {Emitter: st, create: ut, emit: ft, getListeners: lt, off: dt, on: ht, once: gt},
    pt = t("Boolean"), mt = t("Error"), wt = t("RegExp"), bt = {
      isArray: f, isBoolean: pt, isDate: J, isError: mt, isFunction: he, isNil: function (e) {
        return null == e
      }, isNull: function (e) {
        return null === e
      }, isNumber: Z, isObject: de, isRegExp: wt, isString: n, isUndefined: function (e) {
        return void 0 === e
      }
    }, yt = function (e, t, n) {
      var r = String(e), i = r.lastIndexOf(n || "/"), o = i > -1 ? i + 1 : 0, a = r.length - (t || "").length;
      return r.slice(o, a)
    }, At = function (e, t) {
      var n = String(e), r = n.lastIndexOf(t || "/"), i = r > -1 ? r : 0;
      return n.slice(0, i)
    }, Mt = function (e) {
      var t = String(e), n = t.lastIndexOf("."), r = "";
      return n > -1 && (r = t.slice(n)), r
    }, Et = function () {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return 0 === e.length ? "" : e.join("/").replace(/[/]+/g, "/")
    };

  function St(e) {
    void 0 === e && (e = "");
    var t = "?" === e.charAt(0) ? e.slice(1) : e, n = /^[\w\W]+\[\]$/, r = {};
    return t.split("&").forEach((function (e) {
      if (e) {
        var t = e.indexOf("="), i = t > -1 ? e.slice(0, t) : e, o = t > -1 ? e.slice(t + 1) : "",
          a = decodeURIComponent(i), s = decodeURIComponent(o);
        if (n.test(a) && (a = a.slice(0, -2), !r[a])) return void (r[a] = [s]);
        r[a] ? (Array.isArray(r[a]) || (r[a] = [r[a]]), r[a].push(s)) : r[a] = s
      }
    })), r
  }

  function Ct(e) {
    var t = [];
    if (de(e)) {
      var n = function (n) {
        if (D(e, n)) {
          var r = e[n], i = encodeURIComponent(n);
          Array.isArray(r) ? r.forEach((function (e) {
            t.push(i + "=" + encodeURIComponent(e))
          })) : t.push(i + "=" + encodeURIComponent(r))
        }
      };
      for (var r in e) n(r)
    }
    return t.join("&")
  }

  var Tt = function (e, t) {
      return St(t)[e]
    }, $t = St, xt = Ct, Ot = /^[\x00-\xff]+$/, It = /^[+-]?(?:\d+\.?\d*|\.\d+)$/, Rt = /^\d+$/,
    Dt = /^[^\s:/]+\.[^\s.:/]+$/i,
    Ut = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    kt = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, Lt = /^(hsl|HSL)\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/,
    Ft = /^(hsla|HSLA)\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*0?\.?\d+\s*\)$/, Ht = /^\d+$/,
    Pt = /^(?:25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)\.(?:(?:25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)\.){2}(?:25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)$/,
    jt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
    Nt = function (e) {
      return n(e) && Pt.test(e)
    }, Yt = function (e) {
      return n(e) && jt.test(e)
    }, Wt = /^1\d{4,}$/, qt = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/,
    zt = /^(rgb|RGB)\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
    Bt = /^(rgba|RGBA)\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0?\.?\d+\s*\)$/, Xt = {
      ascii: Ot,
      decimal: It,
      digit: Rt,
      domain: Dt,
      email: Ut,
      hexColor: kt,
      hsl: Lt,
      hsla: Ft,
      integer: Ht,
      ipv4: Pt,
      ipv6: jt,
      isAscii: function (e) {
        return n(e) && Ot.test(e)
      },
      isDecimal: function (e) {
        return n(e) && It.test(e)
      },
      isDigit: function (e) {
        return n(e) && Rt.test(e)
      },
      isDomain: function (e) {
        return n(e) && Dt.test(e)
      },
      isEmail: function (e) {
        return n(e) && Ut.test(e)
      },
      isHexColor: function (e) {
        return n(e) && kt.test(e)
      },
      isHsl: function (e) {
        return n(e) && Lt.test(e)
      },
      isHsla: function (e) {
        return n(e) && Ft.test(e)
      },
      isInteger: function (e) {
        return n(e) && Ht.test(e)
      },
      isIP: function (e) {
        return Nt(e) || Yt(e)
      },
      isIPv4: Nt,
      isIPv6: Yt,
      isQQ: function (e) {
        return n(e) && Wt.test(e)
      },
      isRealNumber: function (e) {
        return n(e) && qt.test(e)
      },
      isRgb: function (e) {
        return n(e) && zt.test(e)
      },
      isRgba: function (e) {
        return n(e) && Bt.test(e)
      },
      qq: Wt,
      realNumber: qt,
      rgb: zt,
      rgba: Bt
    };
  var Jt = function (e, t) {
    if (void 0 === t && (t = 0), !n(e)) throw new TypeError("the first argument must be a string");
    var r = e.length, i = 0, o = 0;
    if (1 === t || 2 === t) for (var a = 0; a < r; a++) m(e.charAt(a)) ? i++ : o++;
    return 1 === t ? 2 * i + o : 2 === t ? i + Math.ceil(o / 2) : r
  }, Zt = function (e, t) {
    for (var n = String(e), r = t || "\n", i = -1, o = 0; (i = n.indexOf(r, i + 1)) > -1;) o++;
    var a = n.lastIndexOf(r) === n.length - r.length;
    return n && !a && o++, o
  }, Qt = F, Vt = function (e) {
    if (!n(e)) throw new Error("The parameter 1 should be a string");
    return e.charAt(0)
  }, _t = function (e) {
    var t = !1;
    try {
      JSON.parse(e), t = !0
    } catch (e) {
    }
    return t
  }, Gt = function (e) {
    if (!n(e)) throw new Error("The parameter 1 should be a string");
    return e.charAt(e.length - 1)
  }, Kt = function (e, t) {
    void 0 === e && (e = ""), void 0 === t && (t = {});
    for (var n = t.length, r = t.omission, i = void 0 === r ? "..." : r, o = t.countType, a = void 0 === o ? 0 : o, s = String(e), u = s.length, c = n || u, f = 1 === a ? 2 : 1, l = 2 === a ? .5 : 1, d = 0, h = 0; h < u && (m(s.charAt(h)) ? d += f : d += l, !(d > c)); h++) ;
    return "" + s.slice(0, h) + i
  }, en = {
    Windows: /Windows/,
    MacOS: /Macintosh/,
    Linux: /Linux|X11/,
    Android: /Android|Adr/,
    IOS: /like Mac OS X/,
    Mobile: /Mobi|iPh|480/,
    Tablet: /Tablet|Pad|Nexus 7/,
    WeChat: /MicroMessenger/,
    IPhone: /iPhone|iPod/,
    IPad: /iPad/
  }, tn = xe ? window.navigator.userAgent : "";

  function nn(e) {
    return function (t) {
      return void 0 === t && (t = tn), en[e].test(t)
    }
  }

  var rn = {
    isAndroid: nn("Android"),
    isIOS: nn("IOS"),
    isIPad: nn("IPad"),
    isIPhone: nn("IPhone"),
    isLinux: nn("Linux"),
    isMacOS: nn("MacOS"),
    isMobile: nn("Mobile"),
    isTablet: nn("Tablet"),
    isWeChat: nn("WeChat"),
    isWindows: nn("Windows")
  };
  var on = /^(https?:\/\/)?([^\s:/]+\.){1,}[^\s:/]+(:\d+)?\/?$/, an = /[?#]/,
    sn = /(\w+):\/\/(?:(\w+)(?::(\w+))?@)?([^@/#]+\.[a-z]+)(?::(\d+))?([^?#]+)?(\?[^#]+)?(#[\w\W]+)?/;
  var un = function (e) {
    return n(e) && /^https?:\/\//.test(e)
  }, cn = function () {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    for (var n = e.length, r = "", i = "", o = 0; o < n; o++) an.test(e[o]) && "/" === i && (r = r.slice(0, -1), i = ""), r += e[o], on.test(r) && "" === i && (i = "/"), o < n - 1 && (r += i);
    return r = r.replace(/([/]{2,})/g, (function (e, t, n) {
      return ":" === r[n - 1] ? e : "/"
    }))
  }, fn = function (e) {
    if (!n(e)) throw new TypeError("invalid url");
    var t = e.match(sn);
    if (!t) throw new TypeError("invalid url");
    var r = t[1], i = t[2] || "", o = t[3] || "", a = t[4], s = t[5] || "", u = t[6] || "", c = t[7] || "",
      f = a + (s ? ":" + s : "");
    return {
      hash: t[8] || "",
      host: f,
      hostname: a,
      href: e,
      origin: r + "://" + f,
      password: o,
      pathname: u,
      port: s,
      protocol: r,
      query: St(c),
      search: c,
      username: i
    }
  }, ln = function (e) {
    if (!de(e)) throw new TypeError("invalid url parts object");
    var t = e.protocol, n = e.username, r = e.password, i = e.host, o = e.hostname, a = e.port,
      s = void 0 === a ? "" : a, u = e.pathname, c = void 0 === u ? "" : u, f = e.search, l = void 0 === f ? "" : f,
      d = e.query, h = void 0 === d ? {} : d, g = e.hash, v = void 0 === g ? "" : g;
    if (!t) throw new TypeError("protocol missing");
    if (!i && !o) throw new TypeError("host or hostname missing");
    var p = "";
    if (p += t + "://", n && (p += n, r && (p += ":" + r), p += "@"), i ? p += i : (p += o, s && (p += ":" + s)), p += c, l) p += l; else if (h) {
      var m = Ct(h);
      m && (p += "?" + m)
    }
    return p += v
  };

  function dn(e, t) {
    return void 0 === t && (t = {}), new Promise((function (r, i) {
      var o, a = t.async, s = void 0 === a || a, u = t.beforeSend, c = void 0 === u ? function () {
        } : u, f = t.data, l = void 0 === f ? null : f, d = t.headers, h = void 0 === d ? {} : d, g = t.method,
        v = void 0 === g ? "get" : g, p = t.responseType, m = void 0 === p ? "json" : p, w = t.timeout,
        b = void 0 === w ? 0 : w, y = new XMLHttpRequest;
      y.open(v, e, s), b && (o = window.setTimeout((function () {
        i(new Error("the xhr request timeout " + b + "ms"))
      }), b)), y.onerror = function () {
        i(new Error("unknown error"))
      }, y.onreadystatechange = function () {
        if (4 === y.readyState) if (b && void 0 !== o && clearTimeout(o), y.status >= 200 && y.status < 300) r(y); else {
          var e = new Error("the request is error");
          i(e)
        }
      };
      var A = null;
      if (de(l)) try {
        A = JSON.stringify(l), h["content-type"] = "application/json"
      } catch (e) {
        i(e)
      } else n(l) && (h["content-type"] = "application/x-www-form-urlencoded");
      for (var M in h) y.setRequestHeader(M, h[M]);
      b && (y.timeout = b), y.responseType = m, !1 !== c(y) && y.send(A)
    }))
  }

  function hn() {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    for (var r = "", i = 0, o = e; i < o.length; i++) {
      var a = o[i];
      if (n(a)) r += " " + a; else if (de(a)) for (var s = Object.keys(a), u = 0, c = s; u < c.length; u++) {
        var l = c[u];
        a[l] && (r += " " + l)
      } else f(a) && (r += " " + hn.apply(void 0, a))
    }
    return r.slice(1)
  }

  function gn(e, t) {
    var r;
    if (n(e)) {
      if (!(r = document.querySelector(e))) throw new Error("the element is not exist")
    } else {
      if (!K(e)) throw new Error("the 1st argument must be a css selector or an element");
      r = e
    }
    if (!de(t)) {
      var i = window.getComputedStyle(r);
      return n(t) && (i = i[t]), i
    }
    var o = r.style.cssText;
    Object.keys(t).forEach((function (e) {
      o += e + ": " + t[e] + ";"
    })), r.style.cssText = o
  }

  function vn(e) {
    return void 0 === e && (e = 0), new Promise((function (t) {
      return setTimeout((function () {
        return t()
      }), e)
    }))
  }

  var pn, mn = function () {
    return /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)
  };

  function wn(e) {
    var t = new XMLHttpRequest;
    t.open("HEAD", e, !1);
    try {
      t.send()
    } catch (e) {
    }
    return t.status >= 200 && t.status <= 299
  }

  function bn(e, t) {
    var n = new XMLHttpRequest;
    n.open("GET", e), n.responseType = "blob", n.onload = function () {
      pn(n.response, t)
    }, n.onerror = function () {
      console.error("could not download file")
    }, n.send()
  }

  function yn(e) {
    try {
      e.dispatchEvent(new MouseEvent("click"))
    } catch (n) {
      var t = document.createEvent("MouseEvents");
      t.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), e.dispatchEvent(t)
    }
  }

  var An = pn = xe ? "download" in HTMLAnchorElement.prototype && !mn() ? function (e, t) {
    var n = document.createElement("a"), r = t || e.name || "download";
    if (n.download = r, n.rel = "noopener", "string" == typeof e) n.href = e, n.origin !== location.origin ? wn(n.href) ? bn(e, r) : (n.target = "_blank", yn(n)) : yn(n); else {
      var i = window.URL || window.webkitURL;
      n.href = i.createObjectURL(e), setTimeout((function () {
        return i.revokeObjectURL(n.href)
      }), 4e4), setTimeout((function () {
        return yn(n)
      }), 0)
    }
  } : "msSaveOrOpenBlob" in navigator ? function (e, t) {
    var n = t || e.name || "download";
    if ("string" == typeof e) if (wn(e)) bn(e, n); else {
      var r = document.createElement("a");
      r.href = e, r.target = "_blank", setTimeout((function () {
        return yn(r)
      }))
    } else navigator.msSaveOrOpenBlob(function (e) {
      return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob([String.fromCharCode(65279), e], {type: e.type}) : e
    }(e), n)
  } : function (e, t) {
    var n = window.open("", "_blank");
    n && (n.document.title = "downloading...", n.document.body.innerText = "downloading...");
    var r = t || e.name || "download";
    if ("string" != typeof e) {
      var i = "application/octet-stream" === e.type,
        o = /constructor/i.test(String(window.HTMLElement)) || String(window.safari || ""),
        a = /CriOS\/[\d]+/.test(navigator.userAgent);
      if ((a || i && o || mn()) && "undefined" != typeof FileReader) {
        var s = new FileReader;
        s.onloadend = function () {
          var e = s.result || "";
          e = a ? e : e.replace(/^data:[^;]*;/, "data:attachment/file;"), n ? n.location.href = e : window.location.href = e, n = null
        }, s.readAsDataURL(e)
      } else {
        var u = window.URL || window.webkitURL, c = u.createObjectURL(e);
        n ? n.location.href = c : location.href = c, n = null, setTimeout((function () {
          u.revokeObjectURL(c)
        }), 4e4)
      }
    } else bn(e, r)
  } : function () {
    throw new Error("download is not support in pure Node.js")
  };

  function Mn(e, t) {
    return void 0 === t && (t = {}), new Promise((function (n, r) {
      var i, o = t.callback, a = void 0 === o ? "_callback" : o, s = t.responseType, u = void 0 === s ? "json" : s,
        c = t.timeout, f = void 0 === c ? 0 : c, l = "_callback" + Date.now(), d = e.indexOf("?") > -1, h = e;
      h += d ? "&" : "?", h += encodeURIComponent(a) + "=" + encodeURIComponent(l), f && (i = window.setTimeout((function () {
        r(new Error("the request is timeout " + f + "ms"))
      }), f)), window[l] = function (e) {
        if (i && clearTimeout(i), "json" === u) try {
          n(JSON.parse(e))
        } catch (e) {
          r(e)
        } else n(e)
      }, fe(h, {
        onerror: function () {
          r(new Error("load error"))
        }
      })
    }))
  }

  var En = t("Uint8Array");

  function Sn(e, t, n, r, i, o, a) {
    var s = e + (t & n | ~t & r) + (i >>> 0) + a;
    return (s << o | s >>> 32 - o) + t
  }

  function Cn(e, t, n, r, i, o, a) {
    var s = e + (t & r | n & ~r) + (i >>> 0) + a;
    return (s << o | s >>> 32 - o) + t
  }

  function Tn(e, t, n, r, i, o, a) {
    var s = e + (t ^ n ^ r) + (i >>> 0) + a;
    return (s << o | s >>> 32 - o) + t
  }

  function $n(e, t, n, r, i, o, a) {
    var s = e + (n ^ (t | ~r)) + (i >>> 0) + a;
    return (s << o | s >>> 32 - o) + t
  }

  function xn(t) {
    var r = [];
    if (n(t)) r = c(t); else {
      if (!f(t) && !En(t)) throw TypeError("the input parameter must be one of String, Byte Array, Uint8Array");
      r = t
    }
    for (var i = function (e) {
      for (var t = [], n = 0, r = 0; n < e.length; n++, r += 8) t[r >>> 5] |= e[n] << 24 - r % 32;
      return t
    }(r), o = 8 * r.length, a = 1732584193, s = -271733879, u = -1732584194, l = 271733878, d = 0; d < i.length; d++) i[d] = 16711935 & (i[d] << 8 | i[d] >>> 24) | 4278255360 & (i[d] << 24 | i[d] >>> 8);
    i[o >>> 5] |= 128 << o % 32, i[14 + (o + 64 >>> 9 << 4)] = o;
    for (d = 0; d < i.length; d += 16) {
      var h = a, g = s, v = u, p = l;
      a = Sn(a, s, u, l, i[d + 0], 7, -680876936), l = Sn(l, a, s, u, i[d + 1], 12, -389564586), u = Sn(u, l, a, s, i[d + 2], 17, 606105819), s = Sn(s, u, l, a, i[d + 3], 22, -1044525330), a = Sn(a, s, u, l, i[d + 4], 7, -176418897), l = Sn(l, a, s, u, i[d + 5], 12, 1200080426), u = Sn(u, l, a, s, i[d + 6], 17, -1473231341), s = Sn(s, u, l, a, i[d + 7], 22, -45705983), a = Sn(a, s, u, l, i[d + 8], 7, 1770035416), l = Sn(l, a, s, u, i[d + 9], 12, -1958414417), u = Sn(u, l, a, s, i[d + 10], 17, -42063), s = Sn(s, u, l, a, i[d + 11], 22, -1990404162), a = Sn(a, s, u, l, i[d + 12], 7, 1804603682), l = Sn(l, a, s, u, i[d + 13], 12, -40341101), u = Sn(u, l, a, s, i[d + 14], 17, -1502002290), a = Cn(a, s = Sn(s, u, l, a, i[d + 15], 22, 1236535329), u, l, i[d + 1], 5, -165796510), l = Cn(l, a, s, u, i[d + 6], 9, -1069501632), u = Cn(u, l, a, s, i[d + 11], 14, 643717713), s = Cn(s, u, l, a, i[d + 0], 20, -373897302), a = Cn(a, s, u, l, i[d + 5], 5, -701558691), l = Cn(l, a, s, u, i[d + 10], 9, 38016083), u = Cn(u, l, a, s, i[d + 15], 14, -660478335), s = Cn(s, u, l, a, i[d + 4], 20, -405537848), a = Cn(a, s, u, l, i[d + 9], 5, 568446438), l = Cn(l, a, s, u, i[d + 14], 9, -1019803690), u = Cn(u, l, a, s, i[d + 3], 14, -187363961), s = Cn(s, u, l, a, i[d + 8], 20, 1163531501), a = Cn(a, s, u, l, i[d + 13], 5, -1444681467), l = Cn(l, a, s, u, i[d + 2], 9, -51403784), u = Cn(u, l, a, s, i[d + 7], 14, 1735328473), a = Tn(a, s = Cn(s, u, l, a, i[d + 12], 20, -1926607734), u, l, i[d + 5], 4, -378558), l = Tn(l, a, s, u, i[d + 8], 11, -2022574463), u = Tn(u, l, a, s, i[d + 11], 16, 1839030562), s = Tn(s, u, l, a, i[d + 14], 23, -35309556), a = Tn(a, s, u, l, i[d + 1], 4, -1530992060), l = Tn(l, a, s, u, i[d + 4], 11, 1272893353), u = Tn(u, l, a, s, i[d + 7], 16, -155497632), s = Tn(s, u, l, a, i[d + 10], 23, -1094730640), a = Tn(a, s, u, l, i[d + 13], 4, 681279174), l = Tn(l, a, s, u, i[d + 0], 11, -358537222), u = Tn(u, l, a, s, i[d + 3], 16, -722521979), s = Tn(s, u, l, a, i[d + 6], 23, 76029189), a = Tn(a, s, u, l, i[d + 9], 4, -640364487), l = Tn(l, a, s, u, i[d + 12], 11, -421815835), u = Tn(u, l, a, s, i[d + 15], 16, 530742520), a = $n(a, s = Tn(s, u, l, a, i[d + 2], 23, -995338651), u, l, i[d + 0], 6, -198630844), l = $n(l, a, s, u, i[d + 7], 10, 1126891415), u = $n(u, l, a, s, i[d + 14], 15, -1416354905), s = $n(s, u, l, a, i[d + 5], 21, -57434055), a = $n(a, s, u, l, i[d + 12], 6, 1700485571), l = $n(l, a, s, u, i[d + 3], 10, -1894986606), u = $n(u, l, a, s, i[d + 10], 15, -1051523), s = $n(s, u, l, a, i[d + 1], 21, -2054922799), a = $n(a, s, u, l, i[d + 8], 6, 1873313359), l = $n(l, a, s, u, i[d + 15], 10, -30611744), u = $n(u, l, a, s, i[d + 6], 15, -1560198380), s = $n(s, u, l, a, i[d + 13], 21, 1309151649), a = $n(a, s, u, l, i[d + 4], 6, -145523070), l = $n(l, a, s, u, i[d + 11], 10, -1120210379), u = $n(u, l, a, s, i[d + 2], 15, 718787259), s = $n(s, u, l, a, i[d + 9], 21, -343485551), a = a + h >>> 0, s = s + g >>> 0, u = u + v >>> 0, l = l + p >>> 0
    }
    return e(function (e) {
      for (var t = [], n = 0; n < 32 * e.length; n += 8) t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
      return t
    }(function (e) {
      for (var t = 0; t < e.length; t++) {
        var n = e[t];
        e[t] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8)
      }
      return e
    }([a, s, u, l])))
  }

  function On() {
  }

  function In(e, t, n, r) {
    if (void 0 === t && (t = -1), void 0 === n && (n = "."), void 0 === r && (r = ","), !Z(e)) return "";
    var i, o = Math.pow(10, t), a = e >= 0 ? "" : "-";
    t > -1 && (e = Math.round(e * o) / o);
    var s = Math.abs(e), u = Math.floor(s), c = (s * o - u * o) / o, f = u.toString();
    if (i = 0 === c ? "" : c.toString().slice(2), t > -1) {
      for (var l = 0; l < t; l++) i[l] || (i += "0");
      i = i.slice(0, t)
    }
    var d = f.length, h = d % 3;
    for (l = 0; l < d; l++) a += f[l], (l + 1 - h) % 3 == 0 && l !== d - 1 && (a += r);
    return i && (a += n, a += i), a
  }

  function Rn(e, t, n) {
    if (t - e + 1 < n) throw new RangeError("the result of end - start + 1 should be greater than length");
    for (var r, i = Object.create(null), o = [], a = 0; a < n;) (r = Math.floor(Math.random() * (t - e + 1)) + e) in i || (o.push(r), a++, i[r] = !0);
    return o
  }

  function Dn(e, t) {
    for (var n = e || 32, r = t || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz", i = "", o = 0; o < n; o++) i += r.charAt(Math.random() * r.length);
    return i
  }

  var Un, kn, Ln = Math.pow(2, 32) - 1, Fn = Math.random;
  xe && (window.crypto && "function" == typeof window.crypto.getRandomValues ? Un = function (e) {
    return window.crypto.getRandomValues(e)
  } : window.msCrypto && "function" == typeof window.msCrypto.getRandomValues && (Un = function (e) {
    return window.msCrypto.getRandomValues(e)
  }), "function" == typeof window.Uint32Array && Un && (Fn = function () {
    return Un(new Uint32Array(1))[0] / Ln
  }));

  function Hn() {
    for (var e = [], t = 0; t < 36; t++) e[t] = "0123456789abcdef".charAt(16 * Fn());
    return e[8] = e[13] = e[18] = e[23] = "-", e[14] = "4", e[19] = (3 & Number(e[19]) | 8).toString(16), e.join("")
  }

  return function (e) {
    var t, n, r, i, o, a, s, u, c, f, l, d, m, R;
    e.ajax = dn, e.classNames = hn, e.css = gn, e.delay = vn, e.download = An, e.jsonp = Mn, e.md5 = xn, e.noop = On, e.numberFormat = In, e.raf = Ne, e.randomNumbers = Rn, e.randomString = Dn, e.uuid = Hn, (t = e.base64 || (e.base64 = {})).decode = h, t.decodeFile = g, t.encode = v, t.encodeFile = p, (n = e.char || (e.char = {})).isAlphabetic = w, n.isAlphanumeric = b, n.isASCII = y, n.isCJK = A, n.isControl = M, n.isDigit = E, n.isGraph = S, n.isHexadecimal = C, n.isLower = T, n.isPrint = $, n.isPunctuation = x, n.isSpace = O, n.isUpper = I, (r = e.cookie || (e.cookie = {})).get = j, r.getAll = N, r.getJson = Y, r.getRaw = W, r.isEnabled = P, r.remove = X, r.set = q, r.setJson = z, r.setRaw = B, (i = e.date || (e.date = {})).diff = G.diff, i.format = G.format, i.parse = G.parse, i.timeAgo = G.timeAgo, (o = e.dom || (e.dom = {})).clientX = ze, o.clientY = Be, o.createEvent = Xe, o.domReady = Je, o.insertScript = Ze, o.isElement = Qe, o.isInViewport = Ve, o.isWindow = _e, o.pageHeight = et, o.pageWidth = tt, o.pageX = Ge, o.pageY = Ke, o.scrollTo = nt, o.scrollX = rt, o.scrollY = it, o.viewport = ot, (a = e.easing || (e.easing = {})).cubicBezier = at.cubicBezier, a.ease = at.ease, a.easeIn = at.easeIn, a.easeInOut = at.easeInOut, a.easeOut = at.easeOut, a.linear = at.linear, (s = e.emitter || (e.emitter = {})).create = vt.create, s.emit = vt.emit, s.Emitter = vt.Emitter, s.getListeners = vt.getListeners, s.once = vt.once, s.on = vt.on, s.off = vt.off, (u = e.lang || (e.lang = {})).isArray = bt.isArray, u.isBoolean = bt.isBoolean, u.isDate = bt.isDate, u.isError = bt.isError, u.isFunction = bt.isFunction, u.isNil = bt.isNil, u.isNull = bt.isNull, u.isNumber = bt.isNumber, u.isObject = bt.isObject, u.isRegExp = bt.isRegExp, u.isString = bt.isString, u.isUndefined = bt.isUndefined, (c = e.path || (e.path = {})).basename = yt, c.dirname = At, c.extname = Mt, c.join = Et, (f = e.qs || (e.qs = {})).get = Tt, f.parse = $t, f.stringify = xt, (l = e.regex || (e.regex = {})).ascii = Xt.ascii, l.decimal = Xt.decimal, l.digit = Xt.digit, l.domain = Xt.domain, l.email = Xt.email, l.hexColor = Xt.hexColor, l.hsl = Xt.hsl, l.hsla = Xt.hsla, l.integer = Xt.integer, l.ipv4 = Xt.ipv4,l.ipv6 = Xt.ipv6,l.isAscii = Xt.isAscii,l.isDecimal = Xt.isDecimal,l.isDigit = Xt.isDigit,l.isDomain = Xt.isDomain,l.isEmail = Xt.isEmail,l.isHexColor = Xt.isHexColor,l.isHsl = Xt.isHsl,l.isHsla = Xt.isHsla,l.isIP = Xt.isIP,l.isIPv4 = Xt.isIPv4,l.isIPv6 = Xt.isIPv6,l.isInteger = Xt.isInteger,l.isQQ = Xt.isQQ,l.isRealNumber = Xt.isRealNumber,l.isRgb = Xt.isRgb,l.isRgba = Xt.isRgba,l.qq = Xt.qq,l.realNumber = Xt.realNumber,l.rgb = Xt.rgb,l.rgba = Xt.rgba,(d = e.string || (e.string = {})).countChars = Jt,d.countLines = Zt,d.escapeRegexp = Qt,d.firstChar = Vt,d.isValidJSON = _t,d.lastChar = Gt,d.truncate = Kt,(m = e.url || (e.url = {})).isAbsolute = un,m.join = cn,m.parse = fn,m.stringify = ln,(R = e.ua || (e.ua = {})).isAndroid = rn.isAndroid,R.isIOS = rn.isIOS,R.isIPad = rn.isIPad,R.isIPhone = rn.isIPhone,R.isLinux = rn.isLinux,R.isMacOS = rn.isMacOS,R.isMobile = rn.isMobile,R.isTablet = rn.isTablet,R.isWeChat = rn.isWeChat,R.isWindows = rn.isWindows
  }(kn || (kn = {})), kn
}));
//# sourceMappingURL=micell.min.js.map
