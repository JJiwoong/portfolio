/* ==========================================================================
   VERMANT SEOUL — Storefront Interactive Application
   ========================================================================== */

(function () {
  'use strict';

  const Store = window.VermantStore;
  let state = Store.load();
  let lang = localStorage.getItem('vermant_lang') || 'ko';
  let currentRoute = parseHash();
  let catalogSort = 'featured';
  let selectedSizeByProduct = {};
  let accountTab = 'orders'; // orders | profile
  let showAllDemoOrders = false;

  const I18N = {
    ko: {
      toc: 'TABLE OF CONTENTS',
      myOrders: 'MY ORDERS',
      shoppingCart: 'SHOPPING CART',
      footerAddr: '서울특별시 성동구 연무장길 48, 1–3F · CS +82 2-462-0918',
      navAbout: 'ABOUT',
      navNotice: 'NOTICE',
      navStockist: 'STOCKIST',
      navFaq: 'FAQ',
      exploreCollection: '컬렉션 보기 →',
      viewAll: '→ VIEW ALL',
      archiveAll: '→ ARCHIVE ALL',
      sortFeatured: '추천순 (에디토리얼)',
      sortLow: '낮은 가격순',
      sortHigh: '높은 가격순',
      itemsSuffix: 'ITEMS',
      color: '컬러',
      stock: '재고 상태',
      inStock: '구매 가능',
      outOfStock: '품절',
      selectSize: '사이즈 선택',
      addToCart: '장바구니 담기',
      buyNow: '바로 구매하기',
      backToList: '← 목록으로',
      accDesc: 'Description',
      accSize: 'Size Guide',
      accFabric: 'Fabric & Care',
      accShipping: 'Shipping & Returns',
      cartEmpty: '장바구니에 담긴 상품이 없습니다.',
      subtotal: '상품 금액',
      shippingFee: '배송비',
      free: '무료',
      totalAmount: '총 결제 예정 금액',
      checkout: '주문서 작성하기',
      remove: '삭제',
      ordersHeading: 'MY ORDERS',
      ordersSub: '주문 내역 및 교환/반품비 자동 정산',
      noOrders: '주문 내역이 없습니다.',
      requestReturn: '교환 / 반품 신청',
      returnRegistered: '교환/반품 접수 내역',
      returnTypeReturn: '반품 신청 (RETURN)',
      returnTypeExchange: '교환 신청 (EXCHANGE)',
      returnModalTitle: '교환 / 반품 신청 및 배송비 자동 결제',
      returnReasonLabel: '신청 사유 선택',
      returnDetailLabel: '상세 사유 및 요청 사항',
      returnDetailPlaceholder: '예: 사이즈 2(L)로 교환 희망합니다.',
      autoFeeCalcTitle: '반품/교환 배송비 자동 정산',
      feePolicyNote: '사유에 따라 고객 부담 / 판매자 부담 여부가 자동 계산됩니다.',
      baseFee: '산정 배송비',
      liability: '부담 주체',
      buyerLiability: '구매자 부담',
      sellerLiability: '판매자 부담 (무료)',
      payMethodLabel: '반품/교환 배송비 결제 수단',
      payDeduct: '환불 금액에서 자동 차감 (반품 전용)',
      payCard: '신용 / 체크카드 즉시 결제',
      payTransfer: '실시간 계좌이체 / 간편결제',
      confirmReturnPay: '배송비 결제 및 접수 완료',
      confirmReturnFree: '무료 반품/교환 접수 완료',
      checkoutTitle: 'ORDER CHECKOUT',
      nameLabel: '수령인 성함',
      phoneLabel: '연락처',
      addrLabel: '배송지 주소',
      placeOrder: '결제 완료하기',
      addedToCart: '장바구니에 상품이 담겼습니다.',
      orderCompleted: '주문이 정상적으로 완료되었습니다.',
      returnCompleted: '교환/반품 접수 및 배송비 정산이 완료되었습니다.',
      stockistHq: 'HEADQUARTERS',
      stockistOnline: 'ONLINE STORE',
      stockistOffline: 'OFFLINE STORE',
      aboutLead: '덜어낸 선과 단단한 원단으로 오래 머무는 옷을 만듭니다.',
      aboutP1: 'VERMANT는 서울 성수동 아틀리에를 기반으로 전개하는 컨템포러리 멘즈웨어 브랜드입니다. 유행을 빠르게 소비하기보다, 밀도 높은 천연 소재와 정교한 패턴 구조를 통해 계절이 지나도 자연스럽게 손이 가는 옷을 제안합니다.',
      aboutP2: '이탈리아 비엘라의 울 멜톤, 일본 오카야마의 구식 셔틀 직기 셀비지 데님, 호주산 엑스트라파인 메리노 원사 등 검증된 원단만을 선별하여 소량 정밀 생산합니다.',
      login: 'LOGIN',
      myAccount: 'MY ACCOUNT',
      signInTab: 'SIGN IN',
      joinTab: 'CREATE ACCOUNT',
      emailLabel: '이메일',
      passwordLabel: '비밀번호',
      passwordConfirmLabel: '비밀번호 확인',
      passwordMinHint: '6자 이상 입력',
      signInBtn: '로그인',
      joinBtn: '회원가입 완료',
      logoutBtn: 'LOGOUT',
      demoLoginTitle: 'PORTFOLIO QUICK DEMO LOGIN (원클릭 체험)',
      demoLoginGo: '바로 로그인 →',
      profileTab: 'PROFILE & SHIPPING',
      saveProfileBtn: '회원 정보 저장',
      profileSaved: '회원 정보가 저장되었습니다.',
      loggedInToast: '로그인되었습니다.',
      joinedToast: 'VERMANT 회원가입이 완료되었습니다.',
      loggedOutToast: '로그아웃되었습니다.',
      guestOrderPrompt: '로그인하시면 본인 주문 내역과 교환/반품비 자동 정산, 배송지 자동 입력을 이용하실 수 있습니다.',
      viewAllDemoOrders: '전체 데모 주문 보기',
      viewMyOrdersOnly: '내 주문만 보기'
    },
    en: {
      toc: 'TABLE OF CONTENTS',
      myOrders: 'MY ORDERS',
      shoppingCart: 'SHOPPING CART',
      footerAddr: '48 Yeonmujang-gil, Seongdong-gu, Seoul · CS +82 2-462-0918',
      navAbout: 'ABOUT',
      navNotice: 'NOTICE',
      navStockist: 'STOCKIST',
      navFaq: 'FAQ',
      exploreCollection: 'EXPLORE COLLECTION →',
      viewAll: '→ VIEW ALL',
      archiveAll: '→ ARCHIVE ALL',
      sortFeatured: 'EDITORIAL ORDER',
      sortLow: 'PRICE: LOW TO HIGH',
      sortHigh: 'PRICE: HIGH TO LOW',
      itemsSuffix: 'ITEMS',
      color: 'COLOR',
      stock: 'AVAILABILITY',
      inStock: 'IN STOCK',
      outOfStock: 'SOLD OUT',
      selectSize: 'SELECT SIZE',
      addToCart: 'ADD TO CART',
      buyNow: 'BUY NOW',
      backToList: '← BACK TO COLLECTION',
      accDesc: 'Description',
      accSize: 'Size Guide',
      accFabric: 'Fabric & Care',
      accShipping: 'Shipping & Returns',
      cartEmpty: 'Your shopping cart is empty.',
      subtotal: 'Subtotal',
      shippingFee: 'Shipping',
      free: 'Complimentary',
      totalAmount: 'Total',
      checkout: 'PROCEED TO CHECKOUT',
      remove: 'Remove',
      ordersHeading: 'MY ORDERS',
      ordersSub: 'Order History & Automated Return Settlement',
      noOrders: 'No orders found.',
      requestReturn: 'REQUEST RETURN / EXCHANGE',
      returnRegistered: 'RETURN / EXCHANGE RECORD',
      returnTypeReturn: 'RETURN',
      returnTypeExchange: 'EXCHANGE',
      returnModalTitle: 'RETURN / EXCHANGE & SHIPPING FEE SETTLEMENT',
      returnReasonLabel: 'Reason',
      returnDetailLabel: 'Additional Notes',
      returnDetailPlaceholder: 'e.g. Requesting exchange to size 2 (L).',
      autoFeeCalcTitle: 'Automated Shipping Fee Calculation',
      feePolicyNote: 'Shipping fee liability is calculated automatically based on selected reason.',
      baseFee: 'Calculated Fee',
      liability: 'Responsibility',
      buyerLiability: 'Customer',
      sellerLiability: 'VERMANT (Complimentary)',
      payMethodLabel: 'Settlement Method',
      payDeduct: 'Auto-Deduct from Refund (Return Only)',
      payCard: 'Instant Credit / Debit Card Payment',
      payTransfer: 'Instant Bank / Express Pay',
      confirmReturnPay: 'PAY FEE & SUBMIT REQUEST',
      confirmReturnFree: 'SUBMIT COMPLIMENTARY REQUEST',
      checkoutTitle: 'ORDER CHECKOUT',
      nameLabel: 'Recipient Name',
      phoneLabel: 'Phone Number',
      addrLabel: 'Shipping Address',
      placeOrder: 'COMPLETE ORDER',
      addedToCart: 'Added to shopping cart.',
      orderCompleted: 'Your order has been placed.',
      returnCompleted: 'Return/Exchange request & settlement confirmed.',
      stockistHq: 'HEADQUARTERS',
      stockistOnline: 'ONLINE STORE',
      stockistOffline: 'OFFLINE STORE',
      aboutLead: 'Quiet architectural tailoring built on material longevity.',
      aboutP1: 'VERMANT is a contemporary menswear house based in Seongsu-dong, Seoul. Rather than chasing rapid seasonal turnover, we focus on restrained proportions, tactile natural fibers, and disciplined construction.',
      aboutP2: 'Each piece is produced in measured batches using Biella virgin wool melton, Okayama shuttle-loom selvedge denim, and Australian extrafine merino.',
      login: 'LOGIN',
      myAccount: 'MY ACCOUNT',
      signInTab: 'SIGN IN',
      joinTab: 'CREATE ACCOUNT',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      passwordConfirmLabel: 'Confirm Password',
      passwordMinHint: 'Minimum 6 characters',
      signInBtn: 'SIGN IN',
      joinBtn: 'CREATE ACCOUNT',
      logoutBtn: 'LOGOUT',
      demoLoginTitle: 'PORTFOLIO QUICK DEMO LOGIN',
      demoLoginGo: 'SIGN IN →',
      profileTab: 'PROFILE & SHIPPING',
      saveProfileBtn: 'SAVE CHANGES',
      profileSaved: 'Profile details updated.',
      loggedInToast: 'Signed in successfully.',
      joinedToast: 'Welcome to VERMANT. Account created.',
      loggedOutToast: 'You have been signed out.',
      guestOrderPrompt: 'Sign in to view personal orders, saved shipping details, and automated return settlement.',
      viewAllDemoOrders: 'Show All Demo Orders',
      viewMyOrdersOnly: 'My Orders Only'
    }
  };

  function t(key) {
    return (I18N[lang] && I18N[lang][key]) || key;
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function parseHash() {
    const raw = (window.location.hash || '#home').replace(/^#/, '');
    const parts = raw.split('/').filter(Boolean);
    const view = parts[0] || 'home';
    const param = parts[1] || '';
    return { view, param };
  }

  function navigate(hash) {
    closeTocDropdown();
    closeMobileDrawer();
    if (window.location.hash === hash) {
      currentRoute = parseHash();
      render();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.location.hash = hash;
    }
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.hidden = true;
    }, 2600);
  }

  /* ---------- Shared 3-Category TOC Markup (PDF p.5-9 REPOS Structure) ---------- */
  function buildTocMarkup() {
    const cat = currentRoute.view === 'catalog' ? currentRoute.param || 'ALL' : '';
    const info = currentRoute.view === 'info' ? currentRoute.param || 'stockist' : '';
    const isArc = currentRoute.view === 'archive';

    return `
      <div class="toc-group">
        <h3 class="toc-block-title"><span class="toc-num">1</span><span>CLOTHING</span></h3>
        <ul class="toc-list">
          <li><a href="#catalog/NEW" class="toc-link ${cat === 'NEW' ? 'active' : ''}">NEW IN</a></li>
          <li><a href="#catalog/OUTWEARS" class="toc-link ${cat === 'OUTWEARS' ? 'active' : ''}">OUTWEARS</a></li>
          <li><a href="#catalog/TOPS" class="toc-link ${cat === 'TOPS' ? 'active' : ''}">TOPS</a></li>
          <li><a href="#catalog/KNIT" class="toc-link ${cat === 'KNIT' ? 'active' : ''}">KNIT</a></li>
          <li><a href="#catalog/BOTTOMS" class="toc-link ${cat === 'BOTTOMS' ? 'active' : ''}">BOTTOMS</a></li>
          <li><a href="#catalog/ALL" class="toc-link emphasis ${cat === 'ALL' ? 'active' : ''}">${t('viewAll')}</a></li>
        </ul>
      </div>
      <div class="toc-group">
        <h3 class="toc-block-title"><span class="toc-num">2</span><span>ARCHIVE</span></h3>
        <ul class="toc-list">
          ${state.archives
            .slice(0, 3)
            .map(
              (a) =>
                `<li><a href="#archive/${esc(a.id)}" class="toc-link ${
                  isArc && currentRoute.param === a.id ? 'active' : ''
                }">${esc(a.category)}</a></li>`
            )
            .join('')}
          <li><a href="#archive" class="toc-link emphasis ${isArc && !currentRoute.param ? 'active' : ''}">${t('archiveAll')}</a></li>
        </ul>
      </div>
      <div class="toc-group">
        <h3 class="toc-block-title"><span class="toc-num">3</span><span>INFORMATION</span></h3>
        <ul class="toc-list">
          <li><a href="#info/about" class="toc-link ${info === 'about' ? 'active' : ''}">ABOUT</a></li>
          <li><a href="#info/notice" class="toc-link ${info === 'notice' ? 'active' : ''}">NOTICE</a></li>
          <li><a href="#info/stockist" class="toc-link ${info === 'stockist' ? 'active' : ''}">STOCKIST</a></li>
          <li><a href="#info/faq" class="toc-link ${info === 'faq' ? 'active' : ''}">FAQ</a></li>
          <li><a href="#orders" class="toc-link ${currentRoute.view === 'orders' ? 'active' : ''}">${t('myOrders')}</a></li>
        </ul>
      </div>
    `;
  }

  /* ---------- View 1: Home (One-Page Editorial Hero) ---------- */
  function renderHome() {
    const hero = state.hero;
    const caption = lang === 'en' ? hero.captionEn : hero.captionKo;

    return `
      <section class="hero-canvas">
        <aside class="hero-toc" aria-label="Table of Contents">
          <p class="hero-toc-heading">${t('toc')}</p>
          <div class="hero-toc-groups">
            ${buildTocMarkup()}
          </div>
        </aside>

        <div class="hero-stage">
          <figure class="hero-figure">
            <a href="#catalog/${esc(hero.ctaCategory || 'ALL')}" class="hero-image-link">
              <img src="${esc(hero.image)}" alt="${esc(hero.season)}" class="hero-image" />
            </a>
            <figcaption class="hero-meta">
              <span class="hero-season">${esc(caption || hero.season)}</span>
              <a href="#catalog/${esc(hero.ctaCategory || 'ALL')}" class="hero-cta">${t('exploreCollection')}</a>
            </figcaption>
          </figure>
        </div>
      </section>
    `;
  }

  /* ---------- View 2: Clothing Catalog (Hybrid Editorial + Product Grid) ---------- */
  function renderCatalog(category) {
    const activeCat = (category || 'ALL').toUpperCase();
    const cats = ['ALL', 'NEW', 'OUTWEARS', 'TOPS', 'KNIT', 'BOTTOMS'];
    const prodMap = new Map(state.products.map((p) => [p.id, p]));

    let gridItemsHtml = '';
    let visibleProductCount = 0;

    if (activeCat === 'ALL' && catalogSort === 'featured') {
      // Exact hybrid editorial + product sequence configured in Admin!
      const renderedProductIds = new Set();
      state.catalogLayout.forEach((slot) => {
        if (slot.type === 'editorial') {
          if (slot.active === false) return;
          const cap = lang === 'en' ? slot.captionEn : slot.captionKo;
          gridItemsHtml += `
            <article class="editorial-tile">
              <div class="editorial-media">
                <img src="${esc(slot.image)}" alt="${esc(cap)}" loading="lazy" />
              </div>
              <div class="editorial-caption-row">
                <span class="editorial-caption">${esc(cap)}</span>
                <span class="editorial-season-tag">${esc(slot.season || '2026 WINTER')}</span>
              </div>
            </article>
          `;
        } else if (slot.type === 'product') {
          const p = prodMap.get(slot.productId);
          if (!p) return;
          renderedProductIds.add(p.id);
          visibleProductCount += 1;
          gridItemsHtml += renderProductCard(p);
        }
      });

      // Also show any newly added products not yet placed in catalogLayout
      state.products.forEach((p) => {
        if (!renderedProductIds.has(p.id)) {
          visibleProductCount += 1;
          gridItemsHtml += renderProductCard(p);
        }
      });
    } else {
      let filtered = state.products.filter((p) => {
        if (activeCat === 'ALL') return true;
        if (activeCat === 'NEW') return Boolean(p.newIn);
        return p.category === activeCat;
      });
      if (catalogSort === 'low') {
        filtered = [...filtered].sort((a, b) => a.priceKrw - b.priceKrw);
      } else if (catalogSort === 'high') {
        filtered = [...filtered].sort((a, b) => b.priceKrw - a.priceKrw);
      }
      visibleProductCount = filtered.length;
      gridItemsHtml = filtered.map(renderProductCard).join('');
    }

    return `
      <section class="page-wrap">
        <div class="catalog-toolbar">
          <nav class="cat-tabs" aria-label="Clothing Categories">
            ${cats
              .map(
                (c) => `
              <a href="#catalog/${c}" class="cat-tab ${activeCat === c ? 'active' : ''}">
                ${c === 'NEW' ? 'NEW IN' : c}
              </a>`
              )
              .join('')}
          </nav>
          <div class="catalog-controls">
            <span class="catalog-count">${visibleProductCount} ${t('itemsSuffix')}</span>
            <select class="catalog-sort" id="catalogSortSelect" aria-label="Sort products">
              <option value="featured" ${catalogSort === 'featured' ? 'selected' : ''}>${t('sortFeatured')}</option>
              <option value="low" ${catalogSort === 'low' ? 'selected' : ''}>${t('sortLow')}</option>
              <option value="high" ${catalogSort === 'high' ? 'selected' : ''}>${t('sortHigh')}</option>
            </select>
          </div>
        </div>

        <div class="hybrid-grid">
          ${gridItemsHtml}
        </div>
      </section>
    `;
  }

  function renderProductCard(p) {
    const name = lang === 'en' ? p.nameEn : p.nameKo;
    const color = lang === 'en' ? p.colorEn : p.colorKo;
    const price = Store.formatPrice(p.priceKrw, p.priceUsd, lang);
    const thumb = (p.images && p.images[0]) || './img/prod_coat.jpg';

    return `
      <article class="product-card" data-product-id="${esc(p.id)}">
        <a href="#product/${esc(p.id)}" class="product-media">
          <img src="${esc(thumb)}" alt="${esc(name)}" loading="lazy" />
          ${p.newIn ? '<span class="product-badge">NEW</span>' : ''}
          ${Number(p.stock) <= 0 ? '<span class="product-badge">SOLD OUT</span>' : ''}
        </a>
        <div class="product-info">
          <a href="#product/${esc(p.id)}" class="product-name">${esc(name)}</a>
          <div class="product-sub">
            <span class="product-color">${esc(color)}</span>
            <span class="product-price">${esc(price)}</span>
          </div>
        </div>
      </article>
    `;
  }

  /* ---------- View 3: Product Detail (Camiel Fortgens / Youth Ref) ---------- */
  function renderProductDetail(productId) {
    const p = state.products.find((item) => item.id === productId) || state.products[0];
    if (!p) return renderCatalog('ALL');

    const name = lang === 'en' ? p.nameEn : p.nameKo;
    const color = lang === 'en' ? p.colorEn : p.colorKo;
    const price = Store.formatPrice(p.priceKrw, p.priceUsd, lang);
    const desc = lang === 'en' ? p.descriptionEn : p.descriptionKo;
    const sizeGuide = lang === 'en' ? p.sizeGuideEn : p.sizeGuideKo;
    const fabric = lang === 'en' ? p.fabricCareEn : p.fabricCareKo;
    const shipping = lang === 'en' ? p.shippingEn : p.shippingKo;
    const sizes = Array.isArray(p.sizes) && p.sizes.length ? p.sizes : ['1 (M)', '2 (L)', '3 (XL)'];
    const selectedSize = selectedSizeByProduct[p.id] || sizes[1] || sizes[0];
    selectedSizeByProduct[p.id] = selectedSize;

    const images = Array.isArray(p.images) && p.images.length ? p.images : ['./img/prod_coat.jpg'];
    const soldOut = Number(p.stock) <= 0;

    return `
      <section class="detail-layout">
        <aside class="detail-sidebar" aria-label="Category index">
          <a href="#catalog/${esc(p.category)}" class="detail-back-link">${t('backToList')}</a>
          <div class="toc-group">
            <h3 class="toc-block-title"><span class="toc-num">1</span><span>CLOTHING</span></h3>
            <ul class="toc-list">
              <li><a href="#catalog/NEW" class="toc-link">NEW IN</a></li>
              <li><a href="#catalog/OUTWEARS" class="toc-link ${p.category === 'OUTWEARS' ? 'active' : ''}">OUTWEARS</a></li>
              <li><a href="#catalog/TOPS" class="toc-link ${p.category === 'TOPS' ? 'active' : ''}">TOPS</a></li>
              <li><a href="#catalog/KNIT" class="toc-link ${p.category === 'KNIT' ? 'active' : ''}">KNIT</a></li>
              <li><a href="#catalog/BOTTOMS" class="toc-link ${p.category === 'BOTTOMS' ? 'active' : ''}">BOTTOMS</a></li>
              <li><a href="#catalog/ALL" class="toc-link emphasis">${t('viewAll')}</a></li>
            </ul>
          </div>
        </aside>

        <div class="detail-gallery">
          ${images
            .map(
              (src, idx) => `
            <div class="detail-gallery-frame">
              <img src="${esc(src)}" alt="${esc(name)} — ${idx + 1}" />
            </div>`
            )
            .join('')}
        </div>

        <div class="detail-panel">
          <div class="detail-sku">${esc(p.sku)} · ${esc(p.category)}</div>
          <h1 class="detail-title">${esc(name)}</h1>
          <p class="detail-price">${esc(price)}</p>

          <div class="detail-meta-row">
            <span class="detail-meta-label">${t('color')}</span>
            <span>${esc(color)}</span>
          </div>
          <div class="detail-meta-row">
            <span class="detail-meta-label">${t('stock')}</span>
            <span>${soldOut ? t('outOfStock') : `${t('inStock')} (${p.stock})`}</span>
          </div>

          <div class="size-section">
            <div class="size-label">
              <span>${t('selectSize')}</span>
              <span>${esc(selectedSize)}</span>
            </div>
            <div class="size-grid">
              ${sizes
                .map(
                  (sz) => `
                <button type="button" class="size-btn ${selectedSize === sz ? 'selected' : ''}" data-pick-size="${esc(sz)}" data-pid="${esc(p.id)}">
                  ${esc(sz)}
                </button>`
                )
                .join('')}
            </div>
          </div>

          <div class="detail-actions">
            <button type="button" class="btn-primary" id="addToCartBtn" data-pid="${esc(p.id)}" ${soldOut ? 'disabled' : ''}>
              ${soldOut ? t('outOfStock') : t('addToCart')}
            </button>
            <button type="button" class="btn-secondary" id="buyNowBtn" data-pid="${esc(p.id)}" ${soldOut ? 'disabled' : ''}>
              ${t('buyNow')}
            </button>
          </div>

          <div class="accordion-list">
            <div class="accordion-item open">
              <button type="button" class="accordion-trigger">
                <span>${t('accDesc')}</span><span class="accordion-plus">+</span>
              </button>
              <div class="accordion-body">${esc(desc)}</div>
            </div>
            <div class="accordion-item">
              <button type="button" class="accordion-trigger">
                <span>${t('accSize')}</span><span class="accordion-plus">+</span>
              </button>
              <div class="accordion-body">${esc(sizeGuide)}</div>
            </div>
            <div class="accordion-item">
              <button type="button" class="accordion-trigger">
                <span>${t('accFabric')}</span><span class="accordion-plus">+</span>
              </button>
              <div class="accordion-body">${esc(fabric)}</div>
            </div>
            <div class="accordion-item">
              <button type="button" class="accordion-trigger">
                <span>${t('accShipping')}</span><span class="accordion-plus">+</span>
              </button>
              <div class="accordion-body">${esc(shipping)}</div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /* ---------- View 4: Archive (YOUTH LAB 3-Column Editorial Grid) ---------- */
  function renderArchive(articleId) {
    if (articleId) {
      const a = state.archives.find((x) => x.id === articleId);
      if (a) {
        const title = lang === 'en' ? a.titleEn : a.titleKo;
        const body = lang === 'en' ? a.bodyEn : a.bodyKo;
        const imgs = Array.isArray(a.gallery) && a.gallery.length ? a.gallery : [a.image];
        return `
          <section class="page-wrap">
            <article class="archive-article">
              <a href="#archive" class="detail-back-link">← ARCHIVE LIST</a>
              <div class="archive-article-meta">
                <span>${esc(a.code)} · ${esc(a.category)}</span>
                <span>${esc(a.date)}</span>
              </div>
              <h1 class="archive-article-title">${esc(title)}</h1>
              <p class="archive-article-body">${esc(body)}</p>
              <div class="archive-article-gallery">
                ${imgs.map((src) => `<img src="${esc(src)}" alt="${esc(title)}" />`).join('')}
              </div>
            </article>
          </section>
        `;
      }
    }

    return `
      <section class="page-wrap">
        <div class="section-header">
          <h1 class="section-heading">ARCHIVE</h1>
          <span class="section-sub">EDITORIAL & CRAFT JOURNAL (${state.archives.length})</span>
        </div>
        <div class="archive-grid">
          ${state.archives
            .map((a) => {
              const title = lang === 'en' ? a.titleEn : a.titleKo;
              const summary = lang === 'en' ? a.summaryEn : a.summaryKo;
              return `
                <article class="archive-card">
                  <a href="#archive/${esc(a.id)}">
                    <div class="archive-thumb">
                      <img src="${esc(a.image)}" alt="${esc(title)}" loading="lazy" />
                    </div>
                    <div class="archive-code">${esc(a.code)} · ${esc(a.date)}</div>
                    <h2 class="archive-title">${esc(title)}</h2>
                    <p class="archive-summary">${esc(summary)}</p>
                  </a>
                </article>
              `;
            })
            .join('')}
        </div>
      </section>
    `;
  }

  /* ---------- View 5: Information (1-Click Stockist, About, Notice, FAQ) ---------- */
  function renderInfo(sub) {
    const active = (sub || 'stockist').toLowerCase();
    const tabs = ['about', 'notice', 'stockist', 'faq'];

    let bodyHtml = '';
    if (active === 'stockist') {
      const s = state.stockists;
      bodyHtml = `
        <div class="stockist-group">
          <div class="stockist-group-label">${t('stockistHq')}</div>
          <div class="stockist-list">
            <div>
              <h3 class="stockist-item-name">${esc(lang === 'en' ? s.hq.nameEn : s.hq.nameKo)}</h3>
              <p class="stockist-item-line">${esc(lang === 'en' ? s.hq.addressEn : s.hq.addressKo)}</p>
              <p class="stockist-item-line">${esc(lang === 'en' ? s.hq.hoursEn : s.hq.hoursKo)}</p>
              <p class="stockist-item-line">${esc(s.hq.contact)}</p>
            </div>
          </div>
        </div>

        <div class="stockist-group">
          <div class="stockist-group-label">${t('stockistOnline')}</div>
          <div class="stockist-list">
            ${s.online
              .map(
                (o) => `
              <div>
                <h3 class="stockist-item-name">
                  <span>${esc(o.name)}</span>
                  <span class="stockist-region">${esc(o.region)}</span>
                </h3>
                <p class="stockist-item-line">${esc(lang === 'en' ? o.noteEn : o.noteKo)}</p>
              </div>`
              )
              .join('')}
          </div>
        </div>

        <div class="stockist-group">
          <div class="stockist-group-label">${t('stockistOffline')}</div>
          <div class="stockist-list">
            ${s.offline
              .map(
                (o) => `
              <div>
                <h3 class="stockist-item-name">${esc(o.name)}</h3>
                <p class="stockist-item-line">${esc(lang === 'en' ? o.addressEn : o.addressKo)}</p>
                <p class="stockist-item-line">${esc(o.hours)} · ${esc(o.phone)}</p>
              </div>`
              )
              .join('')}
          </div>
        </div>
      `;
    } else if (active === 'about') {
      bodyHtml = `
        <div class="about-grid">
          <div>
            <h2 class="about-lead">${t('aboutLead')}</h2>
            <p class="about-copy">${t('aboutP1')}</p>
            <p class="about-copy">${t('aboutP2')}</p>
          </div>
          <div>
            <img src="./img/archive_craft.jpg" alt="VERMANT Atelier Craft" />
          </div>
        </div>
      `;
    } else if (active === 'notice') {
      bodyHtml = `
        <div class="notice-list">
          ${state.notices
            .map((n, idx) => {
              const title = lang === 'en' ? n.titleEn : n.titleKo;
              const content = lang === 'en' ? n.bodyEn : n.bodyKo;
              return `
                <div class="notice-row ${idx === 0 ? 'open' : ''}">
                  <button type="button" class="notice-trigger">
                    <span class="notice-pin ${n.pinned ? 'pinned' : ''}">${n.pinned ? 'NOTICE' : 'INFO'}</span>
                    <span class="notice-title">${esc(title)}</span>
                    <span class="notice-date">${esc(n.date)}</span>
                  </button>
                  <div class="notice-body">${esc(content)}</div>
                </div>
              `;
            })
            .join('')}
        </div>
      `;
    } else {
      const faqs =
        lang === 'en'
          ? [
              {
                q: 'How do returns and shipping fee settlement work?',
                a: 'Open MY ORDERS, click REQUEST RETURN / EXCHANGE on any order, choose your reason, and the return shipping fee ($15 return / $25 exchange / $0 for defects) is calculated and settled automatically.'
              },
              {
                q: 'Do you offer international shipping?',
                a: 'Yes. Switch to EN at the top right to view USD pricing. Worldwide delivery ships via DHL Express within 3–5 business days.'
              },
              {
                q: 'Can I try items on in person?',
                a: 'Full seasonal collections are available at our Seongsu Flagship and Hannam Showroom. See STOCKIST for hours.'
              }
            ]
          : [
              {
                q: '교환 및 반품 배송비는 어떻게 결제하나요?',
                a: '상단 MY ORDERS에서 해당 주문의 [교환 / 반품 신청] 버튼을 누르면 사유별 배송비(단순변심 반품 3,000원 / 교환 6,000원 / 불량·오배송 0원)가 자동 산정되며, 환불금 차감 또는 카드 즉시결제로 바로 접수됩니다.'
              },
              {
                q: '주문 후 출고까지 얼마나 걸리나요?',
                a: '평일 오후 2시 이전 결제 완료 건은 당일 출고되며, 평균 1~2영업일 내 수령하실 수 있습니다.'
              },
              {
                q: '오프라인 쇼룸에서 실물 피팅이 가능한가요?',
                a: '성수 플래그십 스토어와 한남 쇼룸에서 전 시즌 컬렉션 피팅이 가능합니다. 자세한 위치는 STOCKIST 메뉴를 참고해 주세요.'
              }
            ];

      bodyHtml = `
        <div class="accordion-list">
          ${faqs
            .map(
              (f, i) => `
            <div class="accordion-item ${i === 0 ? 'open' : ''}">
              <button type="button" class="accordion-trigger">
                <span>${esc(f.q)}</span><span class="accordion-plus">+</span>
              </button>
              <div class="accordion-body">${esc(f.a)}</div>
            </div>`
            )
            .join('')}
        </div>
        <div style="margin-top: 28px;">
          <a href="#orders" class="btn-inline">${t('myOrders')} →</a>
        </div>
      `;
    }

    return `
      <section class="info-shell">
        <nav class="info-tabs" aria-label="Information Navigation">
          ${tabs
            .map(
              (tb) => `
            <a href="#info/${tb}" class="info-tab ${active === tb ? 'active' : ''}">
              ${tb.toUpperCase()}
            </a>`
            )
            .join('')}
        </nav>
        ${bodyHtml}
      </section>
    `;
  }

  /* ---------- View 6: LOGIN / CREATE ACCOUNT (SHA-256 Auth) ---------- */
  function renderAuth(mode) {
    const isJoin = mode === 'join';
    const member = Store.getMemberSession();
    if (member) {
      return renderAccount();
    }

    return `
      <section class="auth-shell">
        <div class="auth-tabs">
          <a href="#login" class="auth-tab ${!isJoin ? 'active' : ''}">${t('signInTab')}</a>
          <a href="#join" class="auth-tab ${isJoin ? 'active' : ''}">${t('joinTab')}</a>
        </div>

        <div id="authErrorBox" class="auth-error" hidden></div>

        ${
          !isJoin
            ? `
          <form id="loginForm">
            <div class="form-group">
              <label class="form-label">${t('emailLabel')}</label>
              <input type="email" class="form-input" name="email" required placeholder="seoyeon@vermant.kr" autocomplete="email" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('passwordLabel')}</label>
              <input type="password" class="form-input" name="password" required placeholder="••••••••" autocomplete="current-password" />
            </div>
            <button type="submit" class="btn-primary" style="margin-top:8px;">${t('signInBtn')}</button>
          </form>

          <div class="demo-accounts-box">
            <p class="demo-accounts-title">${t('demoLoginTitle')}</p>
            <div class="demo-account-list">
              <button type="button" class="demo-account-btn" data-demo-email="seoyeon@vermant.kr" data-demo-pw="vermant1234">
                <span>
                  <span class="demo-account-name">김서연 · VIP 회원 (seoyeon@vermant.kr)</span>
                  <span class="demo-account-sub">${lang === 'en' ? 'Delivered coat order · Ready to test return fee popup' : '배송완료 주문 보유 · 교환/반품비 자동결제 바로 테스트'}</span>
                </span>
                <span class="demo-account-go">${t('demoLoginGo')}</span>
              </button>
              <button type="button" class="demo-account-btn" data-demo-email="doyoon@vermant.kr" data-demo-pw="vermant1234">
                <span>
                  <span class="demo-account-name">박도윤 · STANDARD 회원 (doyoon@vermant.kr)</span>
                  <span class="demo-account-sub">${lang === 'en' ? 'Active exchange request with paid round-trip fee' : '교환요청(왕복 배송비 즉시결제 완료) 진행 중인 계정'}</span>
                </span>
                <span class="demo-account-go">${t('demoLoginGo')}</span>
              </button>
            </div>
          </div>
        `
            : `
          <form id="joinForm">
            <div class="form-group">
              <label class="form-label">${t('nameLabel')}</label>
              <input type="text" class="form-input" name="name" required placeholder="${lang === 'en' ? 'Jiwoo Kim' : '홍길동'}" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('emailLabel')}</label>
              <input type="email" class="form-input" name="email" required placeholder="you@example.com" autocomplete="email" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('passwordLabel')} (${t('passwordMinHint')})</label>
              <input type="password" class="form-input" name="password" required minlength="6" placeholder="••••••••" autocomplete="new-password" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('passwordConfirmLabel')}</label>
              <input type="password" class="form-input" name="passwordConfirm" required minlength="6" placeholder="••••••••" autocomplete="new-password" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('phoneLabel')}</label>
              <input type="text" class="form-input" name="phone" required placeholder="010-0000-0000" />
            </div>
            <div class="form-group">
              <label class="form-label">${t('addrLabel')}</label>
              <input type="text" class="form-input" name="address" required placeholder="${lang === 'en' ? 'Seoul, South Korea' : '서울특별시 성동구 연무장길 48'}" />
            </div>
            <button type="submit" class="btn-primary" style="margin-top:8px;">${t('joinBtn')}</button>
          </form>
        `
        }
      </section>
    `;
  }

  /* ---------- View 7: MY ACCOUNT & MY ORDERS + Return Settlement ---------- */
  function renderAccount() {
    const member = Store.getMemberSession();

    if (!member) {
      return `
        <section class="info-shell">
          <div class="section-header">
            <h1 class="section-heading">${t('ordersHeading')}</h1>
            <span class="section-sub">${t('ordersSub')}</span>
          </div>

          <div class="guest-gate">
            <div>
              <div style="font-weight:500; margin-bottom:4px;">${lang === 'en' ? 'Sign in to VERMANT' : '회원 로그인 안내'}</div>
              <div style="font-size:12px; color:var(--ink-muted);">${t('guestOrderPrompt')}</div>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <a href="#login" class="btn-inline">${t('signInTab')}</a>
              <a href="#join" class="btn-inline">${t('joinTab')}</a>
            </div>
          </div>

          <div style="font-size:11px; letter-spacing:0.1em; color:var(--ink-faint); text-transform:uppercase; margin-bottom:16px;">
            ${lang === 'en' ? 'RECENT DEMO ORDERS (PREVIEW)' : '전체 데모 주문 미리보기 (비회원 체험용)'}
          </div>
          ${
            state.orders.length === 0
              ? `<p class="cart-empty">${t('noOrders')}</p>`
              : `<div class="orders-list">${state.orders.map(renderOrderCard).join('')}</div>`
          }
        </section>
      `;
    }

    const myOrders = state.orders.filter(
      (o) => o.userId === member.id || (!o.userId && o.customerName === member.name)
    );
    const visibleOrders = showAllDemoOrders ? state.orders : myOrders;

    return `
      <section class="info-shell">
        <div class="account-banner">
          <div>
            <h1 class="account-user-name">
              <span>${esc(member.name)}</span>
              <span class="status-tag">${esc(member.grade || 'STANDARD')}</span>
            </h1>
            <p class="account-user-meta">${esc(member.email)} · ${esc(member.phone || '-')} · ${lang === 'en' ? 'Joined' : '가입일'} ${esc((member.createdAt || '').slice(0, 10))}</p>
          </div>
          <button type="button" class="btn-inline" id="logoutMemberBtn">${t('logoutBtn')}</button>
        </div>

        <div class="account-subtabs">
          <div class="account-subtab-group">
            <button type="button" class="info-tab ${accountTab === 'orders' ? 'active' : ''}" data-acc-tab="orders">
              ${t('ordersHeading')} (${myOrders.length})
            </button>
            <button type="button" class="info-tab ${accountTab === 'profile' ? 'active' : ''}" data-acc-tab="profile">
              ${t('profileTab')}
            </button>
          </div>
          ${
            accountTab === 'orders'
              ? `<button type="button" class="util-btn" id="toggleAllOrdersBtn" style="font-size:10px; color:var(--ink-muted);">
                  ${showAllDemoOrders ? t('viewMyOrdersOnly') : t('viewAllDemoOrders')}
                 </button>`
              : ''
          }
        </div>

        ${
          accountTab === 'orders'
            ? visibleOrders.length === 0
              ? `<p class="cart-empty">${t('noOrders')}</p>`
              : `<div class="orders-list">${visibleOrders.map(renderOrderCard).join('')}</div>`
            : `
              <div class="profile-card">
                <form id="profileForm">
                  <div class="form-group">
                    <label class="form-label">${t('emailLabel')}</label>
                    <input class="form-input" value="${esc(member.email)}" disabled style="background:var(--surface-alt); color:var(--ink-muted);" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">${t('nameLabel')}</label>
                    <input class="form-input" name="name" required value="${esc(member.name)}" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">${t('phoneLabel')}</label>
                    <input class="form-input" name="phone" required value="${esc(member.phone || '')}" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">${t('addrLabel')}</label>
                    <input class="form-input" name="address" required value="${esc(member.address || '')}" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'New Password (Optional)' : '새 비밀번호 변경 (변경 시에만 입력)'}</label>
                    <input type="password" class="form-input" name="newPassword" minlength="6" placeholder="${t('passwordMinHint')}" />
                  </div>
                  <button type="submit" class="btn-primary">${t('saveProfileBtn')}</button>
                </form>
              </div>
            `
        }
      </section>
    `;
  }

  function renderOrderCard(o) {
    const total = Store.formatPrice(o.totalKrw, o.totalUsd, lang);
    const rr = o.returnRequest;
    const canRequest = !rr && o.status !== '취소';

    return `
      <article class="order-card">
        <div class="order-head">
          <div>
            <span class="order-id">${esc(o.id)}</span>
            <span class="order-date">${esc(o.createdAt)}</span>
          </div>
          <span class="status-tag ${rr ? '' : 'muted'}">${esc(o.status)}</span>
        </div>

        ${o.items
          .map((item) => {
            const nm = lang === 'en' ? item.nameEn : item.nameKo;
            const pr = Store.formatPrice(item.priceKrw * item.qty, item.priceUsd * item.qty, lang);
            return `
              <div class="order-item-row">
                <img src="${esc(item.image)}" alt="${esc(nm)}" />
                <div>
                  <div style="font-weight:500; margin-bottom:2px;">${esc(nm)}</div>
                  <div style="color:var(--ink-muted); font-size:11px;">SIZE ${esc(item.size)} · QTY ${item.qty}</div>
                </div>
                <div style="font-variant-numeric:tabular-nums;">${esc(pr)}</div>
              </div>
            `;
          })
          .join('')}

        ${
          rr
            ? `<div class="return-summary-box">
                <div><strong>${t('returnRegistered')}</strong> — ${rr.type === 'EXCHANGE' ? '교환 (EXCHANGE)' : '반품 (RETURN)'} · 처리상태: <strong>${esc(rr.adminStatus)}</strong></div>
                <div>사유: ${esc(rr.reasonLabel)} ${rr.detail ? `(${esc(rr.detail)})` : ''}</div>
                <div>자동 산정 배송비: <strong>${Store.formatPrice(rr.feeKrw, rr.feeUsd, lang)}</strong> · 결제 방식: ${esc(rr.payMethodLabel)} (${rr.payStatus === 'PAID' ? '결제완료' : rr.payStatus === 'DEDUCT' ? '환불금 차감 예정' : '판매자 부담 ₩0'})</div>
              </div>`
            : ''
        }

        <div class="order-foot">
          <div>
            <span style="color:var(--ink-muted); margin-right:8px;">${esc(o.customerName)} · ${esc(o.address)}</span>
            <strong>${esc(total)}</strong>
          </div>
          <div>
            ${
              canRequest
                ? `<button type="button" class="btn-inline" data-open-return="${esc(o.id)}">${t('requestReturn')}</button>`
                : ''
            }
          </div>
        </div>
      </article>
    `;
  }

  /* ---------- Cart Drawer ---------- */
  function updateCartCount() {
    const totalQty = state.cart.reduce((acc, c) => acc + Number(c.qty || 1), 0);
    document.getElementById('cartCount').textContent = `(${totalQty})`;
    const moCount = document.getElementById('mobileCartCount');
    if (moCount) moCount.textContent = `(${totalQty})`;
  }

  function addToCart(productId, size, openDrawer) {
    const p = state.products.find((x) => x.id === productId);
    if (!p || Number(p.stock) <= 0) return;

    const existing = state.cart.find((c) => c.productId === productId && c.size === size);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ productId, size, qty: 1 });
    }
    Store.save(state);
    updateCartCount();
    renderCartDrawer();
    if (openDrawer) {
      openCartDrawer();
    } else {
      showToast(t('addedToCart'));
    }
  }

  function renderCartDrawer() {
    const wrap = document.getElementById('cartItemsWrap');
    const foot = document.getElementById('cartFooterWrap');
    const prodMap = new Map(state.products.map((p) => [p.id, p]));

    const validItems = state.cart
      .map((c) => ({ ...c, product: prodMap.get(c.productId) }))
      .filter((c) => Boolean(c.product));

    if (validItems.length === 0) {
      wrap.innerHTML = `<p class="cart-empty">${t('cartEmpty')}</p>`;
      foot.innerHTML = '';
      return;
    }

    let sumKrw = 0;
    let sumUsd = 0;

    wrap.innerHTML = validItems
      .map((item, idx) => {
        const p = item.product;
        const nm = lang === 'en' ? p.nameEn : p.nameKo;
        const unitPrice = Store.formatPrice(p.priceKrw * item.qty, p.priceUsd * item.qty, lang);
        sumKrw += p.priceKrw * item.qty;
        sumUsd += p.priceUsd * item.qty;

        return `
          <div class="cart-item">
            <img src="${esc((p.images && p.images[0]) || './img/prod_coat.jpg')}" alt="${esc(nm)}" />
            <div>
              <p class="cart-item-title">${esc(nm)}</p>
              <p class="cart-item-meta">SIZE ${esc(item.size)} · ${esc(unitPrice)}</p>
              <div class="cart-item-controls">
                <div class="qty-box">
                  <button type="button" data-cart-dec="${idx}">−</button>
                  <span>${item.qty}</span>
                  <button type="button" data-cart-inc="${idx}">+</button>
                </div>
                <button type="button" class="remove-link" data-cart-del="${idx}">${t('remove')}</button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    const formattedSum = Store.formatPrice(sumKrw, sumUsd, lang);
    foot.innerHTML = `
      <div class="cart-sum-row">
        <span>${t('subtotal')}</span>
        <span>${esc(formattedSum)}</span>
      </div>
      <div class="cart-sum-row">
        <span>${t('shippingFee')}</span>
        <span>${t('free')}</span>
      </div>
      <div class="cart-sum-row total">
        <span>${t('totalAmount')}</span>
        <span>${esc(formattedSum)}</span>
      </div>
      <button type="button" class="btn-primary" id="openCheckoutBtn">${t('checkout')}</button>
    `;
  }

  function openCartDrawer() {
    renderCartDrawer();
    document.getElementById('cartBackdrop').hidden = false;
    document.getElementById('cartDrawer').hidden = false;
  }

  function closeCartDrawer() {
    document.getElementById('cartBackdrop').hidden = true;
    document.getElementById('cartDrawer').hidden = true;
  }

  /* ---------- Checkout Modal ---------- */
  function openCheckoutModal() {
    closeCartDrawer();
    const prodMap = new Map(state.products.map((p) => [p.id, p]));
    const items = state.cart
      .map((c) => ({ ...c, product: prodMap.get(c.productId) }))
      .filter((c) => Boolean(c.product));
    if (!items.length) return;

    const member = Store.getMemberSession();
    const totalKrw = items.reduce((s, x) => s + x.product.priceKrw * x.qty, 0);
    const totalUsd = items.reduce((s, x) => s + x.product.priceUsd * x.qty, 0);

    const defName = member ? member.name : lang === 'en' ? 'Jiwoo Kim' : '김지우';
    const defPhone = member ? member.phone || '010-2910-8841' : '010-2910-8841';
    const defAddr = member
      ? member.address || ''
      : lang === 'en'
      ? '48 Yeonmujang-gil, Seongdong-gu, Seoul'
      : '서울특별시 성동구 연무장길 48, 502호';

    const sheet = document.getElementById('modalSheet');
    sheet.innerHTML = `
      <div class="modal-head">
        <h2 class="modal-title">${t('checkoutTitle')}</h2>
        <button type="button" class="icon-close-btn" data-close-modal>✕</button>
      </div>
      ${
        member
          ? `<div style="font-size:11px; color:var(--ink-muted); margin-bottom:16px; padding:10px 12px; background:var(--surface-alt); border:1px solid var(--line);">
              <strong style="color:var(--ink);">${esc(member.name)} (${esc(member.grade)})</strong> ${
              lang === 'en' ? 'signed in · Shipping info pre-filled.' : '회원 로그인 중 · 기본 배송지가 자동 입력되었습니다.'
            }
             </div>`
          : `<div style="font-size:11px; color:var(--ink-muted); margin-bottom:16px; padding:10px 12px; background:var(--surface-alt); border:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span>${lang === 'en' ? 'Checking out as guest.' : '비회원 주문 진행 중입니다.'}</span>
              <button type="button" id="checkoutLoginJump" style="text-decoration:underline; text-underline-offset:3px; color:var(--ink);">${t('signInTab')} →</button>
             </div>`
      }
      <form id="checkoutForm">
        <div class="form-group">
          <label class="form-label">${t('nameLabel')}</label>
          <input class="form-input" name="customerName" required value="${esc(defName)}" />
        </div>
        <div class="form-group">
          <label class="form-label">${t('phoneLabel')}</label>
          <input class="form-input" name="customerPhone" required value="${esc(defPhone)}" />
        </div>
        <div class="form-group">
          <label class="form-label">${t('addrLabel')}</label>
          <input class="form-input" name="address" required value="${esc(defAddr)}" />
        </div>

        <div class="fee-calc-box">
          ${items
            .map(
              (x) => `
            <div class="fee-row">
              <span>${esc(lang === 'en' ? x.product.nameEn : x.product.nameKo)} (${esc(x.size)} × ${x.qty})</span>
              <span>${Store.formatPrice(x.product.priceKrw * x.qty, x.product.priceUsd * x.qty, lang)}</span>
            </div>`
            )
            .join('')}
          <div class="fee-row total">
            <span>${t('totalAmount')}</span>
            <span>${Store.formatPrice(totalKrw, totalUsd, lang)}</span>
          </div>
        </div>

        <button type="submit" class="btn-primary">${t('placeOrder')}</button>
      </form>
    `;

    document.getElementById('modalBackdrop').hidden = false;

    const jumpBtn = document.getElementById('checkoutLoginJump');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', () => {
        closeModal();
        navigate('#login');
      });
    }

    document.getElementById('checkoutForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const fd = new FormData(e.target);
      const newOrder = {
        id: Store.generateOrderId(),
        userId: member ? member.id : null,
        createdAt: Store.nowStamp(),
        customerName: String(fd.get('customerName') || '').trim(),
        customerPhone: String(fd.get('customerPhone') || '').trim(),
        address: String(fd.get('address') || '').trim(),
        lang,
        items: items.map((x) => ({
          productId: x.product.id,
          nameKo: x.product.nameKo,
          nameEn: x.product.nameEn,
          size: x.size,
          qty: x.qty,
          priceKrw: x.product.priceKrw,
          priceUsd: x.product.priceUsd,
          image: (x.product.images && x.product.images[0]) || './img/prod_coat.jpg'
        })),
        totalKrw,
        totalUsd,
        status: '결제완료',
        returnRequest: null
      };

      state.orders.unshift(newOrder);
      state.cart = [];
      Store.save(state);
      updateCartCount();
      closeModal();
      showToast(t('orderCompleted'));
      accountTab = 'orders';
      navigate('#account');
    });
  }

  /* ---------- Automated Return / Exchange Fee Payment Popup (PDF p.18-19) ---------- */
  function openReturnModal(orderId) {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return;

    let reqType = 'RETURN'; // RETURN | EXCHANGE
    let reasonCode = 'MIND'; // MIND | SIZE | COLOR | DEFECT | WRONG
    let payMethod = 'CARD_INSTANT'; // DEDUCT | CARD_INSTANT | TRANSFER

    const reasons = [
      { code: 'MIND', ko: '단순 변심', en: 'Change of mind', buyerFault: true },
      { code: 'SIZE', ko: '사이즈 변경', en: 'Size does not fit', buyerFault: true },
      { code: 'COLOR', ko: '색상 / 옵션 변경', en: 'Color / option change', buyerFault: true },
      { code: 'DEFECT', ko: '상품 불량 / 하자 (판매자 부담)', en: 'Defective item (Complimentary)', buyerFault: false },
      { code: 'WRONG', ko: '오배송 (판매자 부담)', en: 'Wrong item delivered (Complimentary)', buyerFault: false }
    ];

    function calcFee() {
      const r = reasons.find((x) => x.code === reasonCode) || reasons[0];
      if (!r.buyerFault) return { krw: 0, usd: 0, buyerFault: false, reasonObj: r };
      if (reqType === 'EXCHANGE') return { krw: 6000, usd: 25, buyerFault: true, reasonObj: r };
      return { krw: 3000, usd: 15, buyerFault: true, reasonObj: r };
    }

    const sheet = document.getElementById('modalSheet');

    function drawModal() {
      const fee = calcFee();
      if (reqType === 'EXCHANGE' && payMethod === 'DEDUCT') {
        payMethod = 'CARD_INSTANT';
      }

      sheet.innerHTML = `
        <div class="modal-head">
          <h2 class="modal-title">${t('returnModalTitle')}</h2>
          <button type="button" class="icon-close-btn" data-close-modal>✕</button>
        </div>

        <div style="font-size:11px; color:var(--ink-muted); margin-bottom:16px;">
          ORDER <strong style="color:var(--ink);">${esc(order.id)}</strong> · ${esc(
        lang === 'en' ? order.items[0].nameEn : order.items[0].nameKo
      )}
        </div>

        <form id="returnForm">
          <div class="form-group">
            <label class="form-label">STEP 01 · TYPE</label>
            <div class="segment-row">
              <button type="button" class="segment-btn ${reqType === 'RETURN' ? 'active' : ''}" data-req-type="RETURN">
                ${t('returnTypeReturn')}
              </button>
              <button type="button" class="segment-btn ${reqType === 'EXCHANGE' ? 'active' : ''}" data-req-type="EXCHANGE">
                ${t('returnTypeExchange')}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">STEP 02 · ${t('returnReasonLabel')}</label>
            <select class="form-select" id="returnReasonSelect">
              ${reasons
                .map(
                  (r) =>
                    `<option value="${r.code}" ${r.code === reasonCode ? 'selected' : ''}>${esc(
                      lang === 'en' ? r.en : r.ko
                    )}</option>`
                )
                .join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">${t('returnDetailLabel')}</label>
            <textarea class="form-textarea" id="returnDetailInput" rows="2" placeholder="${t(
              'returnDetailPlaceholder'
            )}"></textarea>
          </div>

          <div class="fee-calc-box">
            <div style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--ink); margin-bottom:10px; font-weight:500;">
              STEP 03 · ${t('autoFeeCalcTitle')}
            </div>
            <div class="fee-row">
              <span>${t('liability')}</span>
              <span>${fee.buyerFault ? t('buyerLiability') : t('sellerLiability')}</span>
            </div>
            <div class="fee-row">
              <span>${reqType === 'EXCHANGE' ? (lang === 'en' ? 'Round-trip Courier' : '왕복 택배비 (수거 + 재발송)') : lang === 'en' ? 'Return Courier' : '편도 반품 택배비'}</span>
              <span>${Store.formatPrice(fee.krw, fee.usd, lang)}</span>
            </div>
            <div class="fee-row total">
              <span>${t('baseFee')}</span>
              <span>${Store.formatPrice(fee.krw, fee.usd, lang)}</span>
            </div>
            <div style="font-size:10px; color:var(--ink-faint); margin-top:6px;">${t('feePolicyNote')}</div>
          </div>

          ${
            fee.krw > 0
              ? `
            <div class="form-group">
              <label class="form-label">STEP 04 · ${t('payMethodLabel')}</label>
              <div class="pay-method-list">
                ${
                  reqType === 'RETURN'
                    ? `
                  <label class="pay-option ${payMethod === 'DEDUCT' ? 'selected' : ''}">
                    <input type="radio" name="payMethod" value="DEDUCT" ${payMethod === 'DEDUCT' ? 'checked' : ''} />
                    <span>${t('payDeduct')}</span>
                  </label>`
                    : ''
                }
                <label class="pay-option ${payMethod === 'CARD_INSTANT' ? 'selected' : ''}">
                  <input type="radio" name="payMethod" value="CARD_INSTANT" ${payMethod === 'CARD_INSTANT' ? 'checked' : ''} />
                  <span>${t('payCard')}</span>
                </label>
                <label class="pay-option ${payMethod === 'TRANSFER' ? 'selected' : ''}">
                  <input type="radio" name="payMethod" value="TRANSFER" ${payMethod === 'TRANSFER' ? 'checked' : ''} />
                  <span>${t('payTransfer')}</span>
                </label>
              </div>
            </div>
          `
              : ''
          }

          <button type="submit" class="btn-primary">
            ${
              fee.krw > 0
                ? `${Store.formatPrice(fee.krw, fee.usd, lang)} · ${t('confirmReturnPay')}`
                : t('confirmReturnFree')
            }
          </button>
        </form>
      `;

      sheet.querySelectorAll('[data-req-type]').forEach((btn) => {
        btn.addEventListener('click', () => {
          reqType = btn.getAttribute('data-req-type');
          drawModal();
        });
      });

      const reasonSel = sheet.querySelector('#returnReasonSelect');
      reasonSel.addEventListener('change', () => {
        reasonCode = reasonSel.value;
        drawModal();
      });

      sheet.querySelectorAll('input[name="payMethod"]').forEach((rad) => {
        rad.addEventListener('change', () => {
          payMethod = rad.value;
          drawModal();
        });
      });

      sheet.querySelector('#returnForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const detail = (sheet.querySelector('#returnDetailInput').value || '').trim();
        const finalFee = calcFee();

        const methodLabelMap = {
          DEDUCT: '환불 금액에서 자동 차감',
          CARD_INSTANT: '신용/체크카드 즉시 결제',
          TRANSFER: '실시간 계좌이체 / 간편결제',
          FREE: '판매자 부담 (무료)'
        };

        const chosenMethod = finalFee.krw === 0 ? 'FREE' : payMethod;
        const payStatus =
          finalFee.krw === 0 ? 'FREE' : chosenMethod === 'DEDUCT' ? 'DEDUCT' : 'PAID';

        order.status = reqType === 'EXCHANGE' ? '교환요청' : '반품요청';
        order.returnRequest = {
          type: reqType,
          reasonCode,
          reasonLabel: finalFee.reasonObj.ko,
          detail,
          feeKrw: finalFee.krw,
          feeUsd: finalFee.usd,
          payMethod: chosenMethod,
          payMethodLabel: methodLabelMap[chosenMethod],
          payStatus,
          requestedAt: Store.nowStamp(),
          adminStatus: '접수대기'
        };

        Store.save(state);
        closeModal();
        showToast(t('returnCompleted'));
        render();
      });
    }

    drawModal();
    document.getElementById('modalBackdrop').hidden = false;
  }

  function closeModal() {
    document.getElementById('modalBackdrop').hidden = true;
    document.getElementById('modalSheet').innerHTML = '';
  }

  /* ---------- TOC Dropdown & Mobile Drawer ---------- */
  function toggleTocDropdown() {
    const dd = document.getElementById('tocDropdown');
    const trig = document.getElementById('desktopTocTrigger');
    const open = dd.hidden;
    if (open) {
      document.getElementById('tocDropdownInner').innerHTML = buildTocMarkup();
      dd.hidden = false;
      trig.setAttribute('aria-expanded', 'true');
      trig.querySelector('.toc-indicator').textContent = '−';
    } else {
      closeTocDropdown();
    }
  }

  function closeTocDropdown() {
    const dd = document.getElementById('tocDropdown');
    const trig = document.getElementById('desktopTocTrigger');
    if (dd) dd.hidden = true;
    if (trig) {
      trig.setAttribute('aria-expanded', 'false');
      trig.querySelector('.toc-indicator').textContent = '+';
    }
  }

  function openMobileDrawer() {
    document.getElementById('mobileDrawerBody').innerHTML = buildTocMarkup();
    document.getElementById('mobileDrawer').hidden = false;
    document.getElementById('mobileTcBtn').setAttribute('aria-expanded', 'true');
  }

  function closeMobileDrawer() {
    document.getElementById('mobileDrawer').hidden = true;
    document.getElementById('mobileTcBtn').setAttribute('aria-expanded', 'false');
  }

  /* ---------- Language & Static UI Sync ---------- */
  function syncStaticChrome() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('.lang-opt').forEach((opt) => {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });

    const member = Store.getMemberSession();
    const authBtn = document.getElementById('authHeaderBtn');
    const mobAuthBtn = document.getElementById('mobileAuthBtn');
    if (authBtn) {
      authBtn.textContent = member ? `${t('myAccount')} (${member.name})` : t('login');
    }
    if (mobAuthBtn) {
      mobAuthBtn.textContent = member ? `${t('myAccount')} (${member.name})` : t('login');
    }

    updateCartCount();
  }

  /* ---------- Main Render Cycle ---------- */
  function render() {
    state = Store.load();
    currentRoute = parseHash();
    syncStaticChrome();

    const isHome = currentRoute.view === 'home';
    document.body.classList.toggle('is-home', isHome);
    document.getElementById('siteHeader').classList.toggle('has-border', !isHome);

    const main = document.getElementById('appMain');
    switch (currentRoute.view) {
      case 'catalog':
        main.innerHTML = renderCatalog(currentRoute.param);
        break;
      case 'product':
        main.innerHTML = renderProductDetail(currentRoute.param);
        break;
      case 'archive':
        main.innerHTML = renderArchive(currentRoute.param);
        break;
      case 'info':
        main.innerHTML = renderInfo(currentRoute.param);
        break;
      case 'login':
        main.innerHTML = renderAuth('login');
        break;
      case 'join':
        main.innerHTML = renderAuth('join');
        break;
      case 'account':
      case 'orders':
        main.innerHTML = renderAccount();
        break;
      case 'home':
      default:
        main.innerHTML = renderHome();
        break;
    }

    bindDynamicEvents();
  }

  function bindDynamicEvents() {
    // Catalog sort
    const sortSel = document.getElementById('catalogSortSelect');
    if (sortSel) {
      sortSel.addEventListener('change', () => {
        catalogSort = sortSel.value;
        render();
      });
    }

    // Product size buttons
    document.querySelectorAll('[data-pick-size]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-pid');
        const sz = btn.getAttribute('data-pick-size');
        selectedSizeByProduct[pid] = sz;
        render();
      });
    });

    // Add to Cart / Buy Now
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const pid = addBtn.getAttribute('data-pid');
        addToCart(pid, selectedSizeByProduct[pid] || '2 (L)', true);
      });
    }

    const buyBtn = document.getElementById('buyNowBtn');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        const pid = buyBtn.getAttribute('data-pid');
        addToCart(pid, selectedSizeByProduct[pid] || '2 (L)', false);
        openCheckoutModal();
      });
    }

    // Accordions (Detail & FAQ)
    document.querySelectorAll('.accordion-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.parentElement.classList.toggle('open');
      });
    });

    // Notice expanders
    document.querySelectorAll('.notice-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.parentElement.classList.toggle('open');
      });
    });

    // Return / Exchange Auto-Fee Modal trigger
    document.querySelectorAll('[data-open-return]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openReturnModal(btn.getAttribute('data-open-return'));
      });
    });

    // Login Form (SHA-256)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = await Store.authenticate(fd.get('email'), fd.get('password'), false);
        const errBox = document.getElementById('authErrorBox');
        if (!res.ok) {
          const msgs = {
            NOT_FOUND: lang === 'en' ? 'Account not found.' : '가입되지 않은 이메일입니다.',
            WRONG_PASSWORD: lang === 'en' ? 'Incorrect password.' : '비밀번호가 일치하지 않습니다.',
            SUSPENDED: lang === 'en' ? 'This account has been suspended by admin.' : '관리자에 의해 이용이 정지된 계정입니다.'
          };
          errBox.textContent = msgs[res.code] || '로그인에 실패했습니다.';
          errBox.hidden = false;
          return;
        }
        showToast(`${res.user.name}님, ${t('loggedInToast')}`);
        accountTab = 'orders';
        navigate('#account');
      });
    }

    // One-click Demo Login buttons
    document.querySelectorAll('[data-demo-email]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-demo-email');
        const pw = btn.getAttribute('data-demo-pw');
        const res = await Store.authenticate(email, pw, false);
        if (res.ok) {
          showToast(`${res.user.name} (${res.user.grade}) ${t('loggedInToast')}`);
          accountTab = 'orders';
          navigate('#account');
        }
      });
    });

    // Join / Register Form (SHA-256)
    const joinForm = document.getElementById('joinForm');
    if (joinForm) {
      joinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const pw = String(fd.get('password') || '');
        const pwConfirm = String(fd.get('passwordConfirm') || '');
        const errBox = document.getElementById('authErrorBox');

        if (pw !== pwConfirm) {
          errBox.textContent = lang === 'en' ? 'Passwords do not match.' : '비밀번호 확인이 일치하지 않습니다.';
          errBox.hidden = false;
          return;
        }

        const res = await Store.registerMember({
          name: fd.get('name'),
          email: fd.get('email'),
          password: pw,
          phone: fd.get('phone'),
          address: fd.get('address')
        });

        if (!res.ok) {
          errBox.textContent =
            res.code === 'DUPLICATE_EMAIL'
              ? lang === 'en'
                ? 'Email is already registered.'
                : '이미 가입된 이메일 주소입니다.'
              : lang === 'en'
              ? 'Please check all required fields.'
              : '입력 정보를 다시 확인해 주세요 (비밀번호 6자 이상).';
          errBox.hidden = false;
          return;
        }

        state = Store.load();
        showToast(t('joinedToast'));
        accountTab = 'orders';
        navigate('#account');
      });
    }

    // Account Subtabs, Logout & Profile Save
    document.querySelectorAll('[data-acc-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        accountTab = btn.getAttribute('data-acc-tab');
        render();
      });
    });

    const toggleAllBtn = document.getElementById('toggleAllOrdersBtn');
    if (toggleAllBtn) {
      toggleAllBtn.addEventListener('click', () => {
        showAllDemoOrders = !showAllDemoOrders;
        render();
      });
    }

    const logoutBtn = document.getElementById('logoutMemberBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Store.clearMemberSession();
        showAllDemoOrders = false;
        showToast(t('loggedOutToast'));
        navigate('#home');
      });
    }

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const member = Store.getMemberSession();
        if (!member) return;
        const fd = new FormData(e.target);
        const idx = state.users.findIndex((u) => u.id === member.id);
        if (idx < 0) return;

        state.users[idx].name = String(fd.get('name') || '').trim();
        state.users[idx].phone = String(fd.get('phone') || '').trim();
        state.users[idx].address = String(fd.get('address') || '').trim();
        const newPw = String(fd.get('newPassword') || '');
        if (newPw.length >= 6) {
          state.users[idx].passwordHash = await Store.hashPassword(newPw);
        }

        Store.save(state);
        Store.setMemberSession(state.users[idx]);
        showToast(t('profileSaved'));
        render();
      });
    }
  }

  /* ---------- Global Chrome Event Listeners ---------- */
  function initEvents() {
    window.addEventListener('hashchange', () => {
      closeTocDropdown();
      closeMobileDrawer();
      render();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    document.getElementById('desktopTocTrigger').addEventListener('click', toggleTocDropdown);
    document.getElementById('mobileTcBtn').addEventListener('click', openMobileDrawer);
    document.getElementById('closeMobileDrawerBtn').addEventListener('click', closeMobileDrawer);

    document.getElementById('tocDropdown').addEventListener('click', (e) => {
      if (e.target.closest('a[href^="#"]')) closeTocDropdown();
    });
    document.getElementById('mobileDrawer').addEventListener('click', (e) => {
      if (e.target.closest('a[href^="#"]')) closeMobileDrawer();
    });

    function goAuthOrAccount() {
      const member = Store.getMemberSession();
      navigate(member ? '#account' : '#login');
    }

    document.getElementById('authHeaderBtn').addEventListener('click', goAuthOrAccount);
    document.getElementById('mobileAuthBtn').addEventListener('click', goAuthOrAccount);

    function toggleLang() {
      lang = lang === 'ko' ? 'en' : 'ko';
      localStorage.setItem('vermant_lang', lang);
      render();
      if (!document.getElementById('cartDrawer').hidden) renderCartDrawer();
    }

    document.getElementById('langToggleBtn').addEventListener('click', toggleLang);
    document.getElementById('mobileLangBtn').addEventListener('click', () => {
      toggleLang();
      closeMobileDrawer();
    });

    document.getElementById('openCartBtn').addEventListener('click', openCartDrawer);
    document.getElementById('mobileCartBtn').addEventListener('click', () => {
      closeMobileDrawer();
      openCartDrawer();
    });
    document.getElementById('closeCartBtn').addEventListener('click', closeCartDrawer);
    document.getElementById('cartBackdrop').addEventListener('click', closeCartDrawer);

    // Delegated cart controls
    document.getElementById('cartDrawer').addEventListener('click', (e) => {
      const dec = e.target.closest('[data-cart-dec]');
      const inc = e.target.closest('[data-cart-inc]');
      const del = e.target.closest('[data-cart-del]');
      const checkout = e.target.closest('#openCheckoutBtn');

      if (dec) {
        const i = Number(dec.getAttribute('data-cart-dec'));
        if (state.cart[i].qty > 1) state.cart[i].qty -= 1;
        else state.cart.splice(i, 1);
        Store.save(state);
        updateCartCount();
        renderCartDrawer();
      } else if (inc) {
        const i = Number(inc.getAttribute('data-cart-inc'));
        state.cart[i].qty += 1;
        Store.save(state);
        updateCartCount();
        renderCartDrawer();
      } else if (del) {
        const i = Number(del.getAttribute('data-cart-del'));
        state.cart.splice(i, 1);
        Store.save(state);
        updateCartCount();
        renderCartDrawer();
      } else if (checkout) {
        openCheckoutModal();
      }
    });

    // Modal backdrop & close button
    document.getElementById('modalBackdrop').addEventListener('click', (e) => {
      if (e.target.id === 'modalBackdrop' || e.target.closest('[data-close-modal]')) {
        closeModal();
      }
    });

    // Escape closes overlays
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTocDropdown();
        closeMobileDrawer();
        closeCartDrawer();
        closeModal();
      }
    });

    // Live cross-tab synchronization with Admin Backoffice
    Store.subscribe((nextState) => {
      state = nextState;
      render();
      if (!document.getElementById('cartDrawer').hidden) renderCartDrawer();
    });
  }

  initEvents();
  render();
})();
