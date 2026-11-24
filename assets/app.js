// Shared script for ar.html, en.html and fr.html. Each page sets window.PAGE_LANG before loading it.
(function () {
  var lang = window.PAGE_LANG || "ar";
  var UI = {
    ar: {
      title: "مرجع الإشارات الدينية", home: "الصفحة الرئيسية",
      lede: "مصطلحات دينية إسلامية بلغة الإشارة العربية، تؤديها شخصية مرسومة، مع معنى مختصر لكل مصطلح.",
      search: "ابحث عن مصطلح…", all: "الكل",
      count: function (n, t) { return "يُعرض " + n + " من " + t + " مصطلحاً"; },
      video: "فيديو الإشارة الأصلي", gif: "تنزيل GIF", link: "رابط هذا المصطلح", showAll: "عرض كل المصطلحات",
      alt: function (t) { return "إشارة «" + t + "»"; }, empty: "لا توجد مصطلحات مطابقة.",
      note1: "حركة الأصابع تقريبية في بعض الإشارات؛ فيديو الإشارة الأصلي هو المرجع. المعاني المختصرة للتعريف العام وليست مرجعاً فقهياً.",
      note2: "الإشارات مأخوذة من «القاموس الإشاري العربي للصم» وتختلف لغات الإشارة من بلد لآخر."
    },
    en: {
      title: "Religious Signs Reference", home: "Home",
      lede: "Islamic religious terms in Arabic Sign Language, performed by a drawn avatar, each with a short meaning.",
      search: "Search for a term…", all: "All",
      count: function (n, t) { return "Showing " + n + " of " + t + " terms"; },
      video: "Original sign video", gif: "Download GIF", link: "Link to this term", showAll: "Show all terms",
      alt: function (t) { return 'Sign for "' + t + '"'; }, empty: "No matching terms.",
      note1: "Finger detail is approximate in some signs; the original sign video is the reference. The short meanings are for general orientation and are not a religious ruling reference.",
      note2: "The signs come from the Arabic Sign Dictionary for the Deaf. Sign languages differ from country to country."
    },
    fr: {
      title: "Référence des signes religieux", home: "Accueil",
      lede: "Termes religieux islamiques en langue des signes arabe, exécutés par un personnage dessiné, chacun avec une courte signification.",
      search: "Rechercher un terme…", all: "Tous",
      count: function (n, t) { return n + " termes affichés sur " + t; },
      video: "Vidéo originale du signe", gif: "Télécharger le GIF", link: "Lien vers ce terme", showAll: "Afficher tous les termes",
      alt: function (t) { return "Signe pour « " + t + " »"; }, empty: "Aucun terme correspondant.",
      note1: "Le détail des doigts est approximatif pour certains signes ; la vidéo originale du signe fait référence. Les courtes significations servent d'orientation générale et ne constituent pas une référence juridique religieuse.",
      note2: "Les signes proviennent du Dictionnaire arabe des signes pour les sourds. Les langues des signes diffèrent d'un pays à l'autre."
    }
  };
  var t = UI[lang];
  var $ = function (id) { return document.getElementById(id); };
  var only = null;
  try { only = new URLSearchParams(location.search).get("w"); } catch (e) {}
  var activeCat = "all";

  function name(row) {
    if (lang === "ar") return row[1];
    if (lang === "fr") return (window.TERMS_FR[row[0]] || [row[2]])[0];
    return row[2];
  }
  function meaning(row) {
    if (lang === "ar") return row[4];
    if (lang === "fr") return (window.TERMS_FR[row[0]] || ["", row[5]])[1];
    return row[5];
  }
  function catName(k) {
    if (lang === "fr") return window.CATEGORIES_FR[k];
    return window.CATEGORIES[k][lang];
  }
  function videoUrl(code) {
    return "https://menasy.com/signs/" + (window.VIDEO_SLUGS[code] || ("sign-" + code)) + "/";
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function normalize(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ًͯ-ْـ]/g, "")
      .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
  }

  var watcher = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        if (!v.poster) v.poster = v.dataset.poster;
        if (!v.src) v.src = v.dataset.src;
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: "300px" }) : null;

  function card(row) {
    var code = row[0];
    var c = el("article", "card");
    c.id = code;
    var slot = el("div", "slot");
    var v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("preload", "none");
    v.dataset.poster = "posters/" + code + ".jpg";
    v.dataset.src = "video/" + code + ".mp4";
    v.setAttribute("aria-label", t.alt(name(row)));
    v.onclick = function () { if (v.paused) v.play(); else v.pause(); };
    if (watcher) watcher.observe(v); else { v.poster = v.dataset.poster; v.src = v.dataset.src; v.controls = true; }
    slot.appendChild(v);
    c.appendChild(slot);

    var body = el("div", "body");
    body.appendChild(el("h2", "term", name(row)));
    var alt = el("p", "alt", lang === "ar" ? row[2] : row[1]);
    alt.lang = lang === "ar" ? "en" : "ar";
    alt.dir = lang === "ar" ? "ltr" : "rtl";
    body.appendChild(alt);
    body.appendChild(el("p", "meaning", meaning(row)));
    var links = el("div", "links");
    var a = el("a", null, t.video); a.href = videoUrl(code); a.target = "_blank"; a.rel = "noopener";
    var g = el("a", null, t.gif); g.href = "gifs/" + code + ".gif"; g.setAttribute("download", "");
    var l = el("a", null, t.link); l.href = "?w=" + code;
    links.appendChild(a); links.appendChild(g);
    if (!only) links.appendChild(l);
    body.appendChild(links);
    var meta = el("div", "meta");
    meta.appendChild(el("span", "chip", catName(row[3])));
    meta.appendChild(el("span", "code", code));
    body.appendChild(meta);
    c.appendChild(body);
    return c;
  }

  function renderCats() {
    var box = $("cats");
    box.textContent = "";
    ["all"].concat(Object.keys(window.CATEGORIES)).forEach(function (k) {
      var b = el("button", "cat", k === "all" ? t.all : catName(k));
      b.type = "button";
      b.setAttribute("aria-pressed", String(k === activeCat));
      b.onclick = function () { activeCat = k; renderCats(); renderGrid(); };
      box.appendChild(b);
    });
  }

  function renderGrid() {
    var grid = $("grid");
    grid.textContent = "";
    var q = normalize($("search").value.trim());
    var rows = window.TERMS.filter(function (r) {
      if (only) return r[0] === only;
      if (activeCat !== "all" && r[3] !== activeCat) return false;
      if (!q) return true;
      var fr = window.TERMS_FR[r[0]] || [];
      return normalize(r.slice(1, 3).concat(r.slice(4), fr).join(" ")).indexOf(q) !== -1;
    });
    rows.forEach(function (r) { grid.appendChild(card(r)); });
    if (!rows.length) grid.appendChild(el("p", "empty", t.empty));
    $("count").textContent = only ? "" : t.count(rows.length, window.TERMS.length);
  }

  document.title = t.title;
  $("title").textContent = t.title;
  $("lede").textContent = t.lede;
  $("home").textContent = t.home;
  $("search").placeholder = t.search;
  $("search").setAttribute("aria-label", t.search);
  $("note1").textContent = t.note1;
  $("note2").textContent = t.note2;
  if (only) {
    $("search").hidden = true; $("cats").hidden = true;
    $("grid").classList.add("single");
    var back = el("a", "all", t.showAll); back.href = location.pathname;
    $("count").after(back);
  } else {
    renderCats();
    $("search").oninput = renderGrid;
  }
  renderGrid();
  if (!only && location.hash.length > 1) {
    var hit = document.getElementById(location.hash.slice(1));
    if (hit) { hit.classList.add("hit"); hit.scrollIntoView({ block: "center" }); }
  }
})();
