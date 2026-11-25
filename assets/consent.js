// ZORRI consent + Google Analytics — VERSION 1.1.0
// 1.1.0 (2026-11-25): banner links to /privacy; footer gets a "Privacy" link next to "Cookie settings". Consent logic unchanged from 1.0.0.
// 1.0.0 (2026-11-25): first version. GA4 property "ZORRI – zorri.ro" (G-HQ5BXEPBLE).
//   Basic consent mode: gtag.js is NOT loaded and no cookies are set until the visitor clicks Accept.
//   Choice kept in localStorage ("zorri-consent" = granted | denied). Decline = nothing loads.
//   "Cookie settings" link is added to the footer list so the choice can be changed later.
(function () {
  var GA_ID = "G-HQ5BXEPBLE";
  var KEY = "zorri-consent";

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (window.__zorriGA) return;
    window.__zorriGA = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
      analytics_storage: "granted"
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  function clearGACookies() {
    document.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (n.indexOf("_ga") === 0) {
        ["", "; domain=.zorri.ro", "; domain=zorri.ro"].forEach(function (d) {
          document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
        });
      }
    });
  }

  function css() {
    if (document.getElementById("zc-style")) return;
    var st = document.createElement("style");
    st.id = "zc-style";
    st.textContent =
      ".zc{position:fixed;left:var(--gutter,1.25rem);right:var(--gutter,1.25rem);bottom:1rem;z-index:1000;max-width:34rem;margin-left:auto;" +
      "background:var(--white,#fff);color:var(--text,#33474e);border:1px solid var(--line,#dde3e4);border-radius:18px;" +
      "box-shadow:0 12px 40px rgba(23,67,74,.16);padding:1.25rem 1.5rem;font-family:var(--sans,sans-serif);font-size:.9375rem;line-height:1.55}" +
      ".zc p{margin:0 0 1rem}.zc p a{color:var(--ink,#1e3a43)}.zc strong{color:var(--ink,#1e3a43)}" +
      ".zc-b{display:flex;gap:.75rem;flex-wrap:wrap}" +
      ".zc button{font:inherit;font-weight:600;cursor:pointer;border-radius:999px;padding:.6rem 1.25rem;border:1px solid var(--ink,#1e3a43)}" +
      ".zc .zc-a{background:var(--ink,#1e3a43);color:#fff}.zc .zc-d{background:transparent;color:var(--ink,#1e3a43)}" +
      ".zc button:focus-visible{outline:2px solid var(--ochre,#c98f16);outline-offset:2px}" +
      "@media (max-width:600px){.zc{left:.75rem;right:.75rem;bottom:.75rem;padding:1rem 1.1rem}}";
    document.head.appendChild(st);
  }

  function banner() {
    if (document.querySelector(".zc")) return;
    css();
    var d = document.createElement("div");
    d.className = "zc";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-live", "polite");
    d.setAttribute("aria-label", "Cookie consent");
    d.innerHTML =
      "<p><strong>Analytics cookies?</strong> With your OK, zorri.ro uses Google Analytics to count visits and see which pages are read. " +
      "No ads, no tracking across other sites. Decline and nothing is loaded. <a href=\"/privacy\">Privacy</a></p>" +
      "<div class=\"zc-b\"><button type=\"button\" class=\"zc-a\">Accept</button><button type=\"button\" class=\"zc-d\">Decline</button></div>";
    document.body.appendChild(d);
    d.querySelector(".zc-a").addEventListener("click", function () { save("granted"); d.remove(); loadGA(); });
    d.querySelector(".zc-d").addEventListener("click", function () { save("denied"); d.remove(); clearGACookies(); });
  }

  function footerLink() {
    var ul = document.querySelector(".site-footer ul");
    if (!ul || ul.querySelector(".zc-open")) return;
    if (!ul.querySelector('a[href="/privacy"]')) {
      var lp = document.createElement("li");
      var ap = document.createElement("a");
      ap.href = "/privacy";
      ap.textContent = "Privacy";
      lp.appendChild(ap);
      ul.appendChild(lp);
    }
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#";
    a.className = "zc-open";
    a.textContent = "Cookie settings";
    a.addEventListener("click", function (e) { e.preventDefault(); banner(); });
    li.appendChild(a);
    ul.appendChild(li);
  }

  function init() {
    var c = read();
    if (c === "granted") loadGA();
    else if (c !== "denied") banner();
    footerLink();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
// ZORRI consent + Google Analytics — VERSION 1.1.0 END
