/*
 * dc-runtime.js — a small standalone renderer for the prototype pages.
 *
 * Each page holds its markup inside <x-dc> as a template, plus a
 * <script type="text/x-dc" data-dc-script> block that defines
 * `class Component extends DCLogic { renderVals() { ... } }`.
 *
 * Supported template syntax:
 *   {{ path.to.value }}            dotted lookup into renderVals() (and loop scope)
 *   attr="{{ value }}"             raw value (functions, numbers, objects)
 *   attr="text {{ value }} text"   interpolated string
 *   <sc-for list="{{ xs }}" as="x">  repeat, with {{ x }} and {{ $index }} in scope
 *   <sc-if value="{{ cond }}">     render children when truthy
 *   onClick="{{ handler }}"        event handlers (and other on* events)
 *
 * Rendering uses React so CSS transitions and animations behave the same
 * way they do in the design canvas.
 */
(function () {
  var R = window.React;
  var h = R.createElement;
  var WHOLE = /^\s*\{\{([^}]+)\}\}\s*$/;
  var ANY = /\{\{([^}]+)\}\}/g;
  var EVENTS = {
    onclick: "onClick", onchange: "onChange", oninput: "onInput", onsubmit: "onSubmit",
    onmouseenter: "onMouseEnter", onmouseleave: "onMouseLeave", onfocus: "onFocus", onblur: "onBlur",
    onkeydown: "onKeyDown", onkeyup: "onKeyUp", onpointerdown: "onPointerDown", onpointerup: "onPointerUp"
  };
  var RENAME = { "class": "className", "for": "htmlFor", tabindex: "tabIndex", readonly: "readOnly", maxlength: "maxLength", autocomplete: "autoComplete", colspan: "colSpan", rowspan: "rowSpan" };

  function lookup(scope, path) {
    path = path.trim();
    if (path === "true") return true;
    if (path === "false") return false;
    if (path === "null") return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    var v = scope;
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }
  function interp(str, scope) {
    return str.replace(ANY, function (m, p) {
      var v = lookup(scope, p);
      return v == null ? "" : String(v);
    });
  }
  function attrValue(str, scope) {
    var m = str.match(WHOLE);
    return m ? lookup(scope, m[1]) : interp(str, scope);
  }
  function styleObject(s) {
    var out = {};
    String(s).split(";").forEach(function (decl) {
      var i = decl.indexOf(":");
      if (i < 0) return;
      var k = decl.slice(0, i).trim();
      var v = decl.slice(i + 1).trim();
      if (!k) return;
      if (k.indexOf("--") !== 0) {
        k = k.replace(/^-webkit-/, "Webkit-").replace(/^-moz-/, "Moz-").replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); });
      }
      out[k] = v;
    });
    return out;
  }
  function children(node, scope) {
    var list = [];
    var kids = node.childNodes;
    for (var i = 0; i < kids.length; i++) {
      var r = render(kids[i], scope, i);
      if (r !== null && r !== undefined) list.push(r);
    }
    return list;
  }
  function render(node, scope, key) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      return t.indexOf("{{") < 0 ? t : interp(t, scope);
    }
    if (node.nodeType !== 1) return null;
    var tag = node.localName;
    if (tag === "helmet") return null;
    if (tag === "sc-for") {
      var items = attrValue(node.getAttribute("list") || "", scope) || [];
      var as = node.getAttribute("as") || "item";
      return h(R.Fragment, { key: key }, items.map(function (item, i) {
        var inner = Object.create(scope);
        inner[as] = item;
        inner.$index = i;
        return h(R.Fragment, { key: i }, children(node, inner));
      }));
    }
    if (tag === "sc-if") {
      return attrValue(node.getAttribute("value") || "", scope) ? h(R.Fragment, { key: key }, children(node, scope)) : null;
    }
    var isSvg = node.namespaceURI === "http://www.w3.org/2000/svg";
    var props = { key: key };
    for (var a = 0; a < node.attributes.length; a++) {
      var name = node.attributes[a].name;
      var val = attrValue(node.attributes[a].value, scope);
      if (name.indexOf("hint-") === 0) continue;
      if (EVENTS[name]) { if (typeof val === "function") props[EVENTS[name]] = val; continue; }
      if (name === "style") { props.style = styleObject(val); continue; }
      if (RENAME[name]) { props[RENAME[name]] = val; continue; }
      if (isSvg && name.indexOf("-") > 0 && name.indexOf("aria-") !== 0 && name.indexOf("data-") !== 0) {
        name = name.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); });
      }
      props[name] = val;
    }
    var kids = children(node, scope);
    return kids.length ? h(tag, props, kids) : h(tag, props);
  }

  var template = null;
  class DCLogic extends R.Component {
    renderVals() { return {}; }
    render() { return h(R.Fragment, null, children(template, this.renderVals() || {})); }
  }
  window.DCLogic = DCLogic;

  function boot() {
    var host = document.querySelector("x-dc");
    var script = document.querySelector("script[data-dc-script]");
    if (!host || !script) return;
    template = document.createElement("div");
    Array.prototype.slice.call(host.childNodes).forEach(function (c) {
      if (c.localName === "helmet") {
        Array.prototype.slice.call(c.querySelectorAll("style, link")).forEach(function (s) { document.head.appendChild(s); });
      } else {
        template.appendChild(c);
      }
    });
    var Component = new Function("DCLogic", "React", script.textContent + "\n;return Component;")(DCLogic, R);
    var props = {};
    try {
      var declared = JSON.parse(script.getAttribute("data-props") || "{}");
      Object.keys(declared).forEach(function (k) {
        if (k.charAt(0) !== "$" && declared[k] && "default" in declared[k]) props[k] = declared[k]["default"];
      });
    } catch (e) { /* no declared props */ }
    var root = document.createElement("div");
    root.id = "dc-root";
    host.replaceWith(root);
    ReactDOM.createRoot(root).render(h(Component, props));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
