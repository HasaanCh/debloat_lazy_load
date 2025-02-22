"use strict";
(() => {
    var position = document.body.getBoundingClientRect().top;
    var flag = true;

    if (window.localStorage.getItem("debloat_user")) {
        flag = false;

    }
    else {
        window.localStorage.setItem("debloat_user", "debloat_user");
        flag = true;

    }
    const s = window.debloatConfig || {},
        a = !0;
    let d = [];
    const c = { HTMLDocument: document.addEventListener.bind(document), Window: window.addEventListener.bind(window) },
        n = {};
    let r,
        o = !1,
        i = !1,
        l = !1,
        u = !1,
        e = !1,
        m = [],
        t = [],
        styles = [];
    function f(e) {
        var t;
        (m = [...document.querySelectorAll("script[data-debloat-delay]")]),
            m.length &&
            (o ||
                ((o = !0),
                    (t = (t, e) => {
                        e.addEventListener(t, (e) => (n[t] = e));
                    })("DOMContentLoaded", document),
                    t("load", window),
                    t("readystatechange", document),
                    t("pageshow", window),
                    (t = function (e, t, ...n) {
                        var o;
                        l && !i && ["readystatechange", "DOMContentLoaded", "load", "pageshow"].includes(e)
                            ? (a, (o = { event: e, cb: t, context: this, args: n }), d.push(o))
                            : c[this.constructor.name] && c[this.constructor.name].call(this, e, t, ...n);
                    }),
                    (document.addEventListener = t.bind(document)),
                    (window.addEventListener = t.bind(window)),
                    Object.defineProperty(window, "onload", {
                        set(e) {
                            window.addEventListener("load", e);
                        },
                    })),
                w("js", e));
    }
    function h(e) {
        (t = [...document.querySelectorAll("link[data-debloat-delay]")]), t.length && w("css", e);
    }
    function w(t, n) {
        t = t || "js";
        var o = (!n && s[t + "DelayType"]) || "onload";
        const a = "js" === t ? v : y;
        switch (("js" === t && (n || "onload" === o ? p() : L(p)), o)) {
            case "onload":
                L(() => a(n));
                break;
            case "interact":
                let e = !1;
                const d = ["mousemove", "mousedown", "keydown", "touchstart", "wheel"],
                    c = () => {
                        e || ((e = !0), "js" === t ? j(() => setTimeout(a, 2)) : a());
                    };
                d.forEach((e) => {
                    document.addEventListener(e, c, { passive: !0, once: !0 });
                }),
                    "js" === t && s.jsDelayMax && j(() => setTimeout(c, 1e3 * s.jsDelayMax));
                // "css" === t && s.cssDelayMax && setTimeout(() => applyDelayedStyleTags(), 1e3 * s.cssDelayMax);
                break;
            case "custom-delay":
                L(() => {
                    var e = 1e3 * parseInt(element.dataset.customDelay);
                    setTimeout(a, e);
                });
                // "css" === t && s.cssDelayMax && setTimeout(() => applyDelayedStyleTags(), 1e3 * s.cssDelayMax);
                break;
        }
    }
    function y() {
        t.forEach((e) => g(e));
    }
    function v(e) {
        if ((p(), !e)) {
            (l = !0), (r = document.readyState);
            let t = "loading";
            Object.defineProperty(document, "readyState", {
                configurable: !0,
                get() {
                    return t;
                },
                set(e) {
                    return (t = e);
                },
            });
        }
        let t;
        const n = new Promise((e) => (t = e)),
            o = () => {
                if (m.length) {
                    const e = g(m.shift());
                    e.then(o);
                } else t();
            };
        o(),
            n.then(E).catch((e) => {
                E();
            }),
            setTimeout(() => !d.length || E(), 45e3);
    }
    function p(o) {
        e ||
            ((e = !0),
                m.forEach((e) => {
                    var t,
                        n = e.src || e.dataset.src;
                    n && ((t = document.createElement("link")), Object.assign(t, { rel: o || "preload", as: "script", href: n, ...(e.crossOrigin && { crossOrigin: e.crossOrigin }) }), document.head.append(t));
                }));
    }
    function g(t) {
        let e;
        var n = t.dataset.src,
            o = (t) =>
                new Promise((e) => {
                    t.addEventListener("load", e), t.addEventListener("error", e);
                });
        if (n) {
            const a = document.createElement("script");
            (e = o(a)),
                t.getAttributeNames().forEach((e) => {
                    "src" === e || (a[e] = t[e]);
                }),
                (a.async = !1),
                (a.src = n),
                t.parentNode.replaceChild(a, t);
        } else t.type && "text/debloat-script" === t.type && ((t.type = t.dataset.type || "text/javascript"), (t.text += " "));
        n = t.dataset.href;
        return (
            n && ((e = o(t)), (t.href = n)),
            ["debloatDelay", "src"].forEach((e) => {
                (t.dataset[e] = ""), delete t.dataset[e];
            }),
            e || Promise.resolve()
        );
    }
    function b(e) {
        try {
            e.cb.call(e.context, n[e.event], ...e.args);
        } catch (e) { }
    }
    function E() {
        if (!u) {
            a, (u = !0);
            const e = d.filter((e) => "readystatechange" === e.event);
            (document.readyState = "interactive"), e.forEach((e) => b(e));
            for (const t of d) "DOMContentLoaded" === t.event && b(t);
            for (const n of d) "load" === n.event && b(n);
            (d = []),
                (u = !1),
                (i = !0),
                (l = !1),
                L(() => {
                    (document.readyState = "complete"),
                        setTimeout(() => {
                            e.forEach((e) => b(e));
                        }, 2);
                });
        }
    }
    function L(e) {
        "complete" === (r || document.readyState) ? e() : c.Window("load", () => e());
    }
    function j(e) {
        "loading" !== document.readyState ? e() : c.Window("DOMContentLoaded", () => e());
    }
    if (position === 0 && flag) {
        console.log("Debloat Delay Load condition met");
        f();
        h();
        document.addEventListener("debloat-load-css", () => h(true));
        document.addEventListener("debloat-load-js", () => f(true));
    } else {
        console.log("Debloat Delay Load condition not met");
        console.log("position: ", position);
        console.log("flag: ", flag);
        // Immediately load JS and CSS if it's not the first visit
        m = [...document.querySelectorAll("script[data-debloat-delay]")];
        t = [...document.querySelectorAll("link[data-debloat-delay]")];
        m.forEach((script) => g(script));
        t.forEach((link) => g(link));
    }
})();
