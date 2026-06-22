/* ==============================================================
   RANGEBORN — Site Script
   Handles: navigation, cart + wishlist (localStorage), search,
   product rendering + filtering, forms, GSAP reveals, dust FX.
   ============================================================== */

(function () {
  "use strict";

  /* ============================================================
     STORAGE HELPERS
     ============================================================ */
  const STORE_CART = "rangeborn_cart";
  const STORE_WISH = "rangeborn_wishlist";
  const STORE_NEWSLETTER = "rangeborn_newsletter";

  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  let cart = readStore(STORE_CART, []);       // [{id, size, color, qty}]
  let wishlist = readStore(STORE_WISH, []);   // [id, ...]

  function saveCart() { writeStore(STORE_CART, cart); renderCart(); updateCounts(); }
  function saveWishlist() { writeStore(STORE_WISH, wishlist); renderWishlist(); updateCounts(); }

  /* ============================================================
     SVG ICON LIBRARY (inline, no external icon font)
     ============================================================ */
  const ICONS = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.4-4.6-10-9.2C.4 8.4 2 5 5.6 5 8 5 10 6.6 12 9c2-2.4 4-4 6.4-4 3.6 0 5.2 3.4 3.6 6.8C19.4 16.4 12 21 12 21z"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M6 8h12l1 13H5L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>',
    box: '<svg viewBox="0 0 24 24"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>'
  };

  /* ============================================================
     HEADER: scroll state, mobile nav, drawers, search overlay
     ============================================================ */
  const header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = document.querySelector(".burger");
  const mobileNav = document.querySelector(".mobile-nav");
  if (burger && mobileNav) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("is-open");
      mobileNav.classList.toggle("is-open");
    });
    mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      burger.classList.remove("is-open");
      mobileNav.classList.remove("is-open");
    }));
  }

  function bindDrawer(triggerSel, drawerSel, backdropSel, closeSel) {
    const triggers = document.querySelectorAll(triggerSel);
    const drawer = document.querySelector(drawerSel);
    const backdrop = document.querySelector(backdropSel);
    const closeBtn = drawer ? drawer.querySelector(closeSel) : null;
    if (!drawer || !backdrop) return;
    function open() { drawer.classList.add("is-open"); backdrop.classList.add("is-open"); document.body.style.overflow = "hidden"; }
    function close() { drawer.classList.remove("is-open"); backdrop.classList.remove("is-open"); document.body.style.overflow = ""; }
    triggers.forEach(t => t.addEventListener("click", (e) => { e.preventDefault(); open(); }));
    if (closeBtn) closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    return { open, close };
  }
  const cartDrawerCtl = bindDrawer("[data-open='cart']", "#cart-drawer", "#cart-backdrop", ".drawer-close");
  const wishDrawerCtl = bindDrawer("[data-open='wishlist']", "#wishlist-drawer", "#wishlist-backdrop", ".drawer-close");

  const searchOverlay = document.getElementById("search-overlay");
  const searchInput = document.getElementById("search-input");
  document.querySelectorAll("[data-open='search']").forEach(t => t.addEventListener("click", (e) => {
    e.preventDefault();
    searchOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => searchInput && searchInput.focus(), 250);
  }));
  document.querySelectorAll(".search-close").forEach(b => b.addEventListener("click", closeSearch));
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSearch(); });

  if (searchInput) {
    const resultsEl = document.getElementById("search-results");
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      resultsEl.innerHTML = "";
      if (q.length < 2 || typeof PRODUCTS === "undefined") return;
      const matches = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q)
      ).slice(0, 8);
      matches.forEach(p => {
        const a = document.createElement("a");
        a.href = `product.html?id=${p.id}`;
        a.innerHTML = `<span>${p.name}</span><span>£${p.price}</span>`;
        resultsEl.appendChild(a);
      });
      if (!matches.length) {
        resultsEl.innerHTML = `<p class="search-hint">No results for "${q}" — try “tee”, “hoodie”, “hat”, or a collection name.</p>`;
      }
    });
  }

  /* ============================================================
     TOAST
     ============================================================ */
  let toastTimer;
  function toast(message) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.innerHTML = `${ICONS.check}<span>${message}</span>`;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
  }

  /* ============================================================
     CART LOGIC
     ============================================================ */
  function addToCart(id, size, color, qty) {
    qty = qty || 1;
    const existing = cart.find(i => i.id === id && i.size === size && i.color === color);
    if (existing) existing.qty += qty;
    else cart.push({ id, size, color, qty });
    saveCart();
    toast("Added to bag");
    if (cartDrawerCtl) cartDrawerCtl.open();
  }
  function removeFromCart(index) { cart.splice(index, 1); saveCart(); }
  function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart();
  }

  function renderCart() {
    const body = document.getElementById("cart-body");
    const foot = document.getElementById("cart-foot");
    if (!body) return;
    if (!cart.length) {
      body.innerHTML = `<div class="drawer-empty">${ICONS.bag.replace('viewBox="0 0 24 24"','viewBox="0 0 24 24" width="42" height="42"')}<p>Your bag is empty.</p></div>`;
      if (foot) foot.style.display = "none";
      return;
    }
    if (foot) foot.style.display = "block";
    let subtotal = 0;
    body.innerHTML = cart.map((item, idx) => {
      const p = (typeof PRODUCTS !== "undefined") ? PRODUCTS.find(x => x.id === item.id) : null;
      if (!p) return "";
      subtotal += p.price * item.qty;
      return `
        <div class="line-item">
          <div class="li-media"><div class="media-ph theme-${p.theme}"></div></div>
          <div class="li-info">
            <h4>${p.name}</h4>
            <div class="li-meta">${item.color} · ${item.size}</div>
            <div class="li-row">
              <div class="qty-stepper">
                <button type="button" data-qty-minus="${idx}">–</button>
                <span>${item.qty}</span>
                <button type="button" data-qty-plus="${idx}">+</button>
              </div>
              <strong>£${(p.price * item.qty).toFixed(0)}</strong>
            </div>
            <button type="button" class="li-remove" data-remove="${idx}">Remove</button>
          </div>
        </div>`;
    }).join("");

    body.querySelectorAll("[data-qty-plus]").forEach(b => b.addEventListener("click", () => changeQty(+b.dataset.qtyPlus, 1)));
    body.querySelectorAll("[data-qty-minus]").forEach(b => b.addEventListener("click", () => changeQty(+b.dataset.qtyMinus, -1)));
    body.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => removeFromCart(+b.dataset.remove)));

    const subtotalEl = document.getElementById("cart-subtotal");
    if (subtotalEl) subtotalEl.textContent = `£${subtotal.toFixed(0)}`;
  }

  document.addEventListener("click", (e) => {
    const checkoutBtn = e.target.closest("[data-checkout]");
    if (checkoutBtn) {
      e.preventDefault();
      toast("Demo store — connect a payment provider to enable checkout");
    }
  });

  /* ============================================================
     WISHLIST LOGIC
     ============================================================ */
  function toggleWishlist(id, btnEl) {
    const i = wishlist.indexOf(id);
    if (i > -1) { wishlist.splice(i, 1); if (btnEl) btnEl.classList.remove("is-active"); toast("Removed from wishlist"); }
    else { wishlist.push(id); if (btnEl) btnEl.classList.add("is-active"); toast("Saved to wishlist"); }
    saveWishlist();
  }

  function renderWishlist() {
    const body = document.getElementById("wishlist-body");
    if (!body) return;
    if (!wishlist.length) {
      body.innerHTML = `<div class="drawer-empty">${ICONS.heart.replace('viewBox="0 0 24 24"','viewBox="0 0 24 24" width="42" height="42"')}<p>Nothing saved yet.</p></div>`;
      return;
    }
    body.innerHTML = wishlist.map(id => {
      const p = (typeof PRODUCTS !== "undefined") ? PRODUCTS.find(x => x.id === id) : null;
      if (!p) return "";
      return `
        <div class="line-item">
          <div class="li-media"><div class="media-ph theme-${p.theme}"></div></div>
          <div class="li-info">
            <h4>${p.name}</h4>
            <div class="li-meta">£${p.price}</div>
            <div class="li-row">
              <button type="button" class="btn btn-dark btn-sm" data-wish-add="${p.id}">Add to bag</button>
            </div>
            <button type="button" class="li-remove" data-wish-remove="${p.id}">Remove</button>
          </div>
        </div>`;
    }).join("");
    body.querySelectorAll("[data-wish-add]").forEach(b => b.addEventListener("click", () => {
      const p = PRODUCTS.find(x => x.id === b.dataset.wishAdd);
      addToCart(p.id, p.sizes[0], p.colors[0], 1);
    }));
    body.querySelectorAll("[data-wish-remove]").forEach(b => b.addEventListener("click", () => toggleWishlist(b.dataset.wishRemove)));
  }

  function updateCounts() {
    const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll("[data-count='cart']").forEach(el => { el.textContent = cartCount; el.style.display = cartCount ? "flex" : "none"; });
    document.querySelectorAll("[data-count='wishlist']").forEach(el => { el.textContent = wishlist.length; el.style.display = wishlist.length ? "flex" : "none"; });
  }

  /* ============================================================
     PRODUCT CARD RENDERING (shared by home + shop)
     ============================================================ */
  function placeholderMarkup(p, sizeLabel) {
    return `
      <div class="media-ph theme-${p.theme}">
        <div class="ph-label">
          ${ICONS.box.replace('viewBox="0 0 24 24"','viewBox="0 0 24 24" width="26" height="26"')}
          <strong>${p.name}</strong>
          <span>${sizeLabel || "Product Photography"}</span>
        </div>
      </div>`;
  }

  function productCardHTML(p) {
    const isWished = wishlist.includes(p.id);
    return `
      <div class="product-card" data-id="${p.id}">
        <a href="product.html?id=${p.id}" class="product-media">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
          ${placeholderMarkup(p)}
        </a>
        <button type="button" class="wish-btn ${isWished ? "is-active" : ""}" data-wish="${p.id}" aria-label="Save to wishlist">${ICONS.heart}</button>
        <div class="quick-add">
          <button type="button" class="btn btn-gold btn-block btn-sm" data-quickadd="${p.id}">Quick Add</button>
        </div>
        <a href="product.html?id=${p.id}" class="product-info">
          <span class="p-collection">${getCollection(p.collection) ? getCollection(p.collection).name : ""}</span>
          <h4>${p.name}</h4>
          <div class="p-price">£${p.price}</div>
        </a>
      </div>`;
  }

  function bindProductGridEvents(root) {
    root.querySelectorAll("[data-wish]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleWishlist(btn.dataset.wish, btn);
      });
    });
    root.querySelectorAll("[data-quickadd]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const p = PRODUCTS.find(x => x.id === btn.dataset.quickadd);
        if (p) addToCart(p.id, p.sizes[0], p.colors[0], 1);
      });
    });
  }

  /* ============================================================
     HOMEPAGE: featured products + collection cards
     ============================================================ */
  function initHomeFeatured() {
    const grid = document.getElementById("featured-grid");
    if (!grid || typeof PRODUCTS === "undefined") return;
    const featured = PRODUCTS.filter(p => p.badge).slice(0, 8);
    grid.innerHTML = featured.map(productCardHTML).join("");
    bindProductGridEvents(grid);
  }

  /* ============================================================
     SHOP PAGE: filtering, sorting, search
     ============================================================ */
  function initShopPage() {
    const grid = document.getElementById("shop-grid");
    if (!grid || typeof PRODUCTS === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const state = {
      gender: params.get("gender") || "all",
      categories: params.get("category") ? [params.get("category")] : [],
      collections: params.get("collection") ? [params.get("collection")] : [],
      maxPrice: 260,
      sort: "featured",
      query: ""
    };

    const genderInputs = document.querySelectorAll("[name='filter-gender']");
    const catInputs = document.querySelectorAll("[name='filter-category']");
    const colInputs = document.querySelectorAll("[name='filter-collection']");
    const priceInput = document.getElementById("price-range");
    const priceValueEl = document.getElementById("price-range-value");
    const sortSelect = document.getElementById("sort-select");
    const resultsCount = document.getElementById("results-count");
    const emptyState = document.getElementById("empty-state");
    const filterToggle = document.querySelector(".filter-toggle");
    const filtersPanel = document.querySelector(".filters");
    const clearBtn = document.querySelector(".clear-filters");

    // apply preset from query string to checkboxes
    genderInputs.forEach(i => { if (i.value === state.gender) i.checked = true; });
    catInputs.forEach(i => { if (state.categories.includes(i.value)) i.checked = true; });
    colInputs.forEach(i => { if (state.collections.includes(i.value)) i.checked = true; });

    function readFilters() {
      state.gender = [...genderInputs].find(i => i.checked)?.value || "all";
      state.categories = [...catInputs].filter(i => i.checked).map(i => i.value);
      state.collections = [...colInputs].filter(i => i.checked).map(i => i.value);
      state.maxPrice = priceInput ? +priceInput.value : 260;
      state.sort = sortSelect ? sortSelect.value : "featured";
    }

    function apply() {
      readFilters();
      let list = PRODUCTS.filter(p => {
        if (state.gender !== "all" && p.gender !== state.gender) return false;
        if (state.categories.length && !state.categories.includes(p.categorySlug)) return false;
        if (state.collections.length && !state.collections.includes(p.collection)) return false;
        if (p.price > state.maxPrice) return false;
        if (state.query) {
          const q = state.query.toLowerCase();
          if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
        }
        return true;
      });

      if (state.sort === "price-asc") list = list.slice().sort((a, b) => a.price - b.price);
      if (state.sort === "price-desc") list = list.slice().sort((a, b) => b.price - a.price);
      if (state.sort === "newest") list = list.slice().sort((a, b) => (b.badge === "New") - (a.badge === "New"));

      grid.innerHTML = list.map(productCardHTML).join("");
      bindProductGridEvents(grid);
      if (resultsCount) resultsCount.textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}`;
      if (emptyState) emptyState.classList.toggle("is-visible", list.length === 0);
    }

    [...genderInputs, ...catInputs, ...colInputs].forEach(i => i.addEventListener("change", apply));
    if (priceInput) priceInput.addEventListener("input", () => {
      if (priceValueEl) priceValueEl.textContent = `Up to £${priceInput.value}`;
      apply();
    });
    if (sortSelect) sortSelect.addEventListener("change", apply);
    if (filterToggle && filtersPanel) filterToggle.addEventListener("click", () => filtersPanel.classList.toggle("is-open"));
    if (clearBtn) clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      [...genderInputs].forEach(i => i.checked = i.value === "all");
      [...catInputs, ...colInputs].forEach(i => i.checked = false);
      if (priceInput) { priceInput.value = 260; if (priceValueEl) priceValueEl.textContent = "Up to £260"; }
      if (sortSelect) sortSelect.value = "featured";
      apply();
    });

    const shopSearch = document.getElementById("shop-search");
    if (shopSearch) shopSearch.addEventListener("input", () => { state.query = shopSearch.value; apply(); });

    apply();
  }

  /* ============================================================
     PRODUCT DETAIL PAGE
     ============================================================ */
  function initProductPage() {
    const root = document.getElementById("product-root");
    if (!root || typeof PRODUCTS === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || PRODUCTS[0].id;
    const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];

    document.title = `${p.name} — RANGEBORN`;
    const col = getCollection(p.collection);

    document.getElementById("pd-main-media").innerHTML = placeholderMarkup(p, "Main Product Shot");
    const thumbs = document.getElementById("pd-thumbs");
    thumbs.innerHTML = ["Front", "Back", "Detail", "On Model"].map(label => `<div class="media-ph theme-${p.theme}"><div class="ph-label"><span>${label}</span></div></div>`).join("");

    document.getElementById("pd-collection").textContent = col ? `${col.name} Collection` : "";
    document.getElementById("pd-collection").href = `shop.html?collection=${p.collection}`;
    document.getElementById("pd-title").textContent = p.name;
    document.getElementById("pd-price").textContent = `£${p.price}`;
    document.getElementById("pd-desc").textContent = p.description;
    document.getElementById("pd-category-meta").textContent = p.category;
    document.getElementById("pd-gender-meta").textContent = p.gender === "mens" ? "Men's" : "Women's";

    const colorRow = document.getElementById("pd-colors");
    colorRow.innerHTML = p.colors.map((c, i) => `<button type="button" class="swatch ${i === 0 ? "active" : ""}" data-color="${c}">${c}</button>`).join("");
    const sizeRow = document.getElementById("pd-sizes");
    sizeRow.innerHTML = p.sizes.map((s, i) => `<button type="button" class="swatch ${i === 0 ? "active" : ""}" data-size="${s}">${s}</button>`).join("");

    let selColor = p.colors[0];
    let selSize = p.sizes[0];
    colorRow.querySelectorAll(".swatch").forEach(b => b.addEventListener("click", () => {
      colorRow.querySelectorAll(".swatch").forEach(x => x.classList.remove("active"));
      b.classList.add("active"); selColor = b.dataset.color;
    }));
    sizeRow.querySelectorAll(".swatch").forEach(b => b.addEventListener("click", () => {
      sizeRow.querySelectorAll(".swatch").forEach(x => x.classList.remove("active"));
      b.classList.add("active"); selSize = b.dataset.size;
    }));

    const addBtn = document.getElementById("pd-add-cart");
    if (addBtn) addBtn.addEventListener("click", () => addToCart(p.id, selSize, selColor, 1));
    const wishBtn = document.getElementById("pd-wish");
    if (wishBtn) {
      if (wishlist.includes(p.id)) wishBtn.classList.add("is-active");
      wishBtn.innerHTML = ICONS.heart + "<span>Save</span>";
      wishBtn.addEventListener("click", () => toggleWishlist(p.id, wishBtn));
    }

    const related = getRelated(p, 4);
    const relatedGrid = document.getElementById("related-grid");
    if (relatedGrid) {
      relatedGrid.innerHTML = related.map(productCardHTML).join("");
      bindProductGridEvents(relatedGrid);
    }
  }

  /* ============================================================
     LOOKBOOK / HOMEPAGE collection grids (static markup, JS only
     fills the dynamic ones above) — placeholders already in HTML
     ============================================================ */

  /* ============================================================
     NEWSLETTER FORMS
     ============================================================ */
  document.querySelectorAll("[data-newsletter-form]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector("input[type='email']").value;
      const list = readStore(STORE_NEWSLETTER, []);
      list.push({ email, date: new Date().toISOString() });
      writeStore(STORE_NEWSLETTER, list);
      const success = form.parentElement.querySelector(".form-success");
      if (success) success.classList.add("is-visible");
      form.reset();
      toast("Welcome to the club — check your inbox");
    });
  });

  /* ============================================================
     CONTACT FORM (static, no backend)
     ============================================================ */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactForm.reset();
      const success = document.getElementById("contact-success");
      if (success) success.classList.add("is-visible");
      toast("Message sent — we'll reply within 1 business day");
    });
  }

  /* ============================================================
     LOGIN / ACCOUNT PAGE
     ============================================================ */
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".auth-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
  document.querySelectorAll("[data-auth-form]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      toast("Demo store — connect an auth provider to enable accounts");
    });
  });

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  document.querySelectorAll(".faq-q").forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const answer = item.querySelector(".faq-a");
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item").forEach(i => {
        i.classList.remove("is-open");
        i.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ============================================================
     DUST PARTICLES (lightweight canvas, behind hero copy)
     ============================================================ */
  function initDust() {
    const canvas = document.getElementById("dust-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    function size() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    function spawn() {
      const count = window.innerWidth < 700 ? 35 : 70;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.18 + 0.04),
        vx: (Math.random() - 0.5) * 0.12,
        a: Math.random() * 0.4 + 0.08
      }));
    }
    size(); spawn();
    window.addEventListener("resize", () => { size(); spawn(); });

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(196,154,108,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ============================================================
     GSAP REVEALS + HERO ENTRANCE
     ============================================================ */
  function initAnimations() {
    if (typeof gsap === "undefined") {
      // Graceful fallback: if the GSAP CDN script didn't load (blocked, offline,
      // slow network), make sure content is still visible instead of staying
      // hidden at opacity:0 forever.
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.style.opacity = 1;
        el.style.transform = "none";
      });
      return;
    }
    gsap.registerPlugin(window.ScrollTrigger);

    // Hero entrance
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTimeline
      .to(".hero-content .eyebrow", { opacity: 1, y: 0, duration: .7 }, 0.2)
      .to(".hero-title .brand-line", { opacity: 1, y: 0, duration: 1 }, 0.35)
      .to(".hero-title .tag-line", { opacity: 1, y: 0, duration: .9 }, 0.55)
      .to(".hero-actions", { opacity: 1, y: 0, duration: .8 }, 0.75)
      .to(".hero-scroll", { opacity: .7, duration: .8 }, 1.1);

    gsap.set([".hero-content .eyebrow", ".hero-title .brand-line", ".hero-title .tag-line", ".hero-actions"], { opacity: 0, y: 26 });
    gsap.set(".hero-scroll", { opacity: 0 });
    heroTimeline.play();

    // Scroll reveals
    document.querySelectorAll(".reveal").forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
        delay: (i % 4) * 0.06,
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    updateCounts();
    renderCart();
    renderWishlist();
    initHomeFeatured();
    initShopPage();
    initProductPage();
    initDust();
    initAnimations();
  });
})();
