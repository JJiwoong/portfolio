/* ==========================================================================
   VERMANT BACKOFFICE — Interactive Admin Controller (Live Sync w/ Storefront)
   ========================================================================== */

(function () {
  'use strict';

  const Store = window.VermantStore;
  let state = Store.load();
  let activeTab = 'dashboard';
  let productSearch = '';
  let productCatFilter = 'ALL';
  let orderFilter = 'ALL'; // ALL | RETURN
  let cmsSubtab = 'hero'; // hero | archive | notice | stockist
  let userSearch = '';
  let userGradeFilter = 'ALL';

  const TAB_META = {
    dashboard: {
      title: '대시보드',
      desc: 'VERMANT 스토어 매출, 주문, 회원, 교환/반품비 자동결제 현황을 실시간으로 모니터링합니다.'
    },
    products: {
      title: '상품 관리',
      desc: '한/영 상품 정보, KRW/USD 가격, 재고, 상세 아코디언 스펙을 등록 및 수정합니다.'
    },
    layout: {
      title: '진열 · 에디토리얼 관리',
      desc: '시즌별 4열 카탈로그 내 2칸 와이드 에디토리얼 배너의 노출 여부와 순서를 자유롭게 재배치합니다.'
    },
    orders: {
      title: '주문 · 교환/반품 관리',
      desc: '주문 배송 상태를 관리하고 고객이 신청한 교환/반품 및 반품배송비 자동결제 내역을 승인 처리합니다.'
    },
    cms: {
      title: '콘텐츠 · CMS 관리',
      desc: '메인 원페이지 배너, 아카이브, 공지사항, 원클릭 매장안내(STOCKIST)를 통합 관리합니다.'
    },
    users: {
      title: '회원 관리 (CRM)',
      desc: '스토어프론트에서 가입한 회원 목록, 등급(VIP/STANDARD), 계정 상태 및 누적 구매액을 실시간 관리합니다.'
    }
  };

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('adminToast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.hidden = true;
    }, 2400);
  }

  function persist(toastMsg) {
    Store.save(state);
    if (toastMsg) showToast(toastMsg);
    render();
  }

  function updateReturnBadge() {
    const pending = state.orders.filter(
      (o) => o.returnRequest && o.returnRequest.adminStatus !== '처리완료' && o.returnRequest.adminStatus !== '반려'
    ).length;
    const badge = document.getElementById('navReturnBadge');
    badge.textContent = String(pending);
    badge.hidden = pending === 0;
  }

  /* ---------- 1. DASHBOARD ---------- */
  function renderDashboard() {
    const validOrders = state.orders.filter((o) => o.status !== '취소');
    const totalRevenue = validOrders.reduce((s, o) => s + Number(o.totalKrw || 0), 0);
    const pendingReturns = state.orders.filter(
      (o) => o.returnRequest && o.returnRequest.adminStatus !== '처리완료'
    );
    const activeEditorials = state.catalogLayout.filter(
      (s) => s.type === 'editorial' && s.active !== false
    ).length;

    return `
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">누적 주문 매출 (KRW)</div>
          <div class="kpi-value">₩${Store.formatNumber(totalRevenue)}</div>
          <div class="kpi-sub">유효 주문 ${validOrders.length}건 기준</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">전체 주문 건수</div>
          <div class="kpi-value">${state.orders.length}건</div>
          <div class="kpi-sub">스토어 주문 즉시 반영</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">교환/반품 접수 대기</div>
          <div class="kpi-value">${pendingReturns.length}건</div>
          <div class="kpi-sub">반품배송비 자동 정산 연동</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">가입 회원 / 등록 상품</div>
          <div class="kpi-value">${(state.users || []).filter((u) => u.role !== 'ADMIN').length}명 / ${state.products.length}개</div>
          <div class="kpi-sub">에디토리얼 배너 ${activeEditorials}개 노출 중</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h2 class="panel-title">최근 주문 및 교환/반품비 자동정산 현황</h2>
          <button type="button" class="btn-outline" data-goto-tab="orders">주문 관리 전체 보기 →</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>주문번호</th>
                <th>고객명</th>
                <th>주문 상품</th>
                <th>결제 금액</th>
                <th>주문 상태</th>
                <th>교환/반품 · 배송비 정산</th>
              </tr>
            </thead>
            <tbody>
              ${state.orders
                .slice(0, 6)
                .map((o) => {
                  const first = o.items[0];
                  const extra = o.items.length > 1 ? ` 외 ${o.items.length - 1}건` : '';
                  const rr = o.returnRequest;
                  return `
                    <tr>
                      <td><strong>${esc(o.id)}</strong><div style="color:var(--ink-faint);font-size:11px;">${esc(o.createdAt)}</div></td>
                      <td>${esc(o.customerName)}</td>
                      <td>${esc(first ? first.nameKo : '-')}${extra}</td>
                      <td style="font-variant-numeric:tabular-nums;">₩${Store.formatNumber(o.totalKrw)}</td>
                      <td><span class="pill ${rr ? 'warn' : 'ok'}">${esc(o.status)}</span></td>
                      <td>
                        ${
                          rr
                            ? `<span class="pill ${rr.adminStatus === '처리완료' ? 'ok' : 'warn'}">
                                ${rr.type === 'EXCHANGE' ? '교환' : '반품'} · ₩${Store.formatNumber(rr.feeKrw)} (${esc(rr.adminStatus)})
                               </span>`
                            : '<span style="color:var(--ink-faint);">-</span>'
                        }
                      </td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h2 class="panel-title">빠른 스토어 운영 도구</h2>
        </div>
        <div class="panel-body" style="display:flex; gap:10px; flex-wrap:wrap;">
          <button type="button" class="btn-solid" id="dashAddProduct">+ 신규 상품 등록</button>
          <button type="button" class="btn-outline" data-goto-tab="layout">시즌별 에디토리얼 진열 재배치</button>
          <button type="button" class="btn-outline" data-goto-tab="cms">메인 배너 · 공지 · 매장안내 수정</button>
          <a href="./index.html#orders" target="_blank" rel="noopener" class="btn-ghost">고객 반품비 자동결제 팝업 테스트 ↗</a>
        </div>
      </div>
    `;
  }

  /* ---------- 2. PRODUCTS CRUD ---------- */
  function renderProducts() {
    const cats = ['ALL', 'OUTWEARS', 'TOPS', 'KNIT', 'BOTTOMS'];
    const q = productSearch.trim().toLowerCase();
    const list = state.products.filter((p) => {
      const catOk = productCatFilter === 'ALL' || p.category === productCatFilter;
      const qOk =
        !q ||
        p.nameKo.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      return catOk && qOk;
    });

    return `
      <div class="toolbar">
        <div class="toolbar-group">
          <input type="search" class="input" id="prodSearchInput" placeholder="상품명(한/영) 또는 SKU 검색" value="${esc(
            productSearch
          )}" style="width:240px;" />
          <select class="select" id="prodCatSelect">
            ${cats
              .map(
                (c) => `<option value="${c}" ${productCatFilter === c ? 'selected' : ''}>${
                  c === 'ALL' ? '전체 카테고리' : c
                }</option>`
              )
              .join('')}
          </select>
        </div>
        <button type="button" class="btn-solid" id="openNewProductBtn">+ 신규 상품 등록</button>
      </div>

      <div class="panel">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>이미지</th>
                <th>SKU / 상품명</th>
                <th>카테고리</th>
                <th>가격 (KRW / USD)</th>
                <th>재고</th>
                <th>NEW</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              ${list
                .map(
                  (p) => `
                <tr>
                  <td><img src="${esc((p.images && p.images[0]) || './img/prod_coat.jpg')}" class="thumb-sm" alt="" /></td>
                  <td>
                    <div style="font-size:11px; color:var(--ink-faint);">${esc(p.sku)}</div>
                    <div style="font-weight:500;">${esc(p.nameKo)}</div>
                    <div style="font-size:11px; color:var(--ink-muted);">${esc(p.nameEn)}</div>
                  </td>
                  <td><span class="pill">${esc(p.category)}</span></td>
                  <td style="font-variant-numeric:tabular-nums;">
                    <div>₩${Store.formatNumber(p.priceKrw)}</div>
                    <div style="font-size:11px; color:var(--ink-muted);">$${Store.formatNumber(p.priceUsd)}</div>
                  </td>
                  <td>
                    <span class="pill ${Number(p.stock) <= 0 ? 'danger' : Number(p.stock) < 8 ? 'warn' : 'ok'}">
                      ${Number(p.stock) <= 0 ? '품절' : `${p.stock}개`}
                    </span>
                  </td>
                  <td>${p.newIn ? '<span class="pill ok">NEW</span>' : '-'}</td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button type="button" class="btn-xs" data-edit-prod="${esc(p.id)}">수정</button>
                      <button type="button" class="btn-xs danger" data-del-prod="${esc(p.id)}">삭제</button>
                    </div>
                  </td>
                </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function openProductModal(productId) {
    const existing = productId ? state.products.find((p) => p.id === productId) : null;
    const p = existing || {
      id: 'vm-' + Date.now().toString().slice(-4),
      sku: 'VM26W-NEW',
      category: 'OUTWEARS',
      newIn: true,
      nameKo: '',
      nameEn: '',
      colorKo: '차콜',
      colorEn: 'Charcoal',
      priceKrw: 380000,
      priceUsd: 285,
      stock: 10,
      sizes: ['1 (M)', '2 (L)', '3 (XL)'],
      images: ['./img/prod_coat.jpg', './img/hero_lookbook.jpg'],
      descriptionKo: '',
      descriptionEn: '',
      sizeGuideKo: '1 (M) : 총장 72 / 가슴 59 cm\n2 (L) : 총장 74 / 가슴 61.5 cm',
      sizeGuideEn: '1 (M) : Length 72 / Chest 59 cm\n2 (L) : Length 74 / Chest 61.5 cm',
      fabricCareKo: 'Wool 100% / 드라이클리닝 권장',
      fabricCareEn: '100% Wool / Dry clean only',
      shippingKo: '평일 오후 2시 이전 주문 시 당일 출고됩니다.',
      shippingEn: 'Dispatches same business day before 2 PM KST.'
    };

    const box = document.getElementById('adminModalBox');
    box.innerHTML = `
      <div class="modal-head">
        <h2 class="modal-title">${existing ? '상품 정보 수정' : '신규 상품 등록'}</h2>
        <button type="button" class="btn-xs" data-close-admin-modal>닫기 ✕</button>
      </div>
      <form id="productEditorForm" class="form-grid">
        <div class="form-field">
          <label>상품명 (국문)</label>
          <input class="input" name="nameKo" required value="${esc(p.nameKo)}" placeholder="예: 울 트윌 테일러드 블레이저" />
        </div>
        <div class="form-field">
          <label>상품명 (영문 · EN 스토어용)</label>
          <input class="input" name="nameEn" required value="${esc(p.nameEn)}" placeholder="e.g. Wool Twill Tailored Blazer" />
        </div>
        <div class="form-field">
          <label>SKU 코드</label>
          <input class="input" name="sku" required value="${esc(p.sku)}" />
        </div>
        <div class="form-field">
          <label>카테고리</label>
          <select class="select" name="category">
            ${['OUTWEARS', 'TOPS', 'KNIT', 'BOTTOMS']
              .map((c) => `<option value="${c}" ${p.category === c ? 'selected' : ''}>${c}</option>`)
              .join('')}
          </select>
        </div>
        <div class="form-field">
          <label>판매가 (KRW ₩)</label>
          <input class="input" type="number" name="priceKrw" required value="${Number(p.priceKrw)}" />
        </div>
        <div class="form-field">
          <label>해외 판매가 (USD $)</label>
          <input class="input" type="number" name="priceUsd" required value="${Number(p.priceUsd)}" />
        </div>
        <div class="form-field">
          <label>컬러 (국문)</label>
          <input class="input" name="colorKo" value="${esc(p.colorKo)}" />
        </div>
        <div class="form-field">
          <label>컬러 (영문)</label>
          <input class="input" name="colorEn" value="${esc(p.colorEn)}" />
        </div>
        <div class="form-field">
          <label>재고 수량 (0 입력 시 품절 표시)</label>
          <input class="input" type="number" name="stock" min="0" required value="${Number(p.stock)}" />
        </div>
        <div class="form-field">
          <label>대표 스튜디오 이미지</label>
          <select class="select" name="mainImage">
            ${Store.IMAGE_PRESETS.map(
              (img) =>
                `<option value="${esc(img.url)}" ${p.images && p.images[0] === img.url ? 'selected' : ''}>${esc(
                  img.label
                )}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-field full">
          <label style="display:flex; align-items:center; gap:8px; color:var(--ink);">
            <input type="checkbox" name="newIn" ${p.newIn ? 'checked' : ''} />
            <span>NEW IN 배지 및 신상품 카테고리 노출</span>
          </label>
        </div>
        <div class="form-field full">
          <label>상품 설명 (국문)</label>
          <textarea class="textarea" name="descriptionKo" rows="3">${esc(p.descriptionKo)}</textarea>
        </div>
        <div class="form-field full">
          <label>Product Description (EN)</label>
          <textarea class="textarea" name="descriptionEn" rows="2">${esc(p.descriptionEn)}</textarea>
        </div>
        <div class="form-field full" style="display:flex; justify-content:flex-end; gap:8px; margin-top:6px;">
          <button type="button" class="btn-ghost" data-close-admin-modal>취소</button>
          <button type="submit" class="btn-solid">${existing ? '수정 내용 저장' : '상품 등록 완료'}</button>
        </div>
      </form>
    `;

    document.getElementById('adminModalBackdrop').hidden = false;

    document.getElementById('productEditorForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const mainImg = String(fd.get('mainImage') || './img/prod_coat.jpg');
      const nextImages = existing && existing.images && existing.images.length > 1
        ? [mainImg, ...existing.images.slice(1)]
        : [mainImg, './img/hero_lookbook.jpg'];

      const updated = {
        ...p,
        nameKo: String(fd.get('nameKo')).trim(),
        nameEn: String(fd.get('nameEn')).trim(),
        sku: String(fd.get('sku')).trim(),
        category: String(fd.get('category')),
        priceKrw: Number(fd.get('priceKrw') || 0),
        priceUsd: Number(fd.get('priceUsd') || 0),
        colorKo: String(fd.get('colorKo') || '').trim(),
        colorEn: String(fd.get('colorEn') || '').trim(),
        stock: Number(fd.get('stock') || 0),
        newIn: fd.get('newIn') === 'on',
        images: nextImages,
        descriptionKo: String(fd.get('descriptionKo') || '').trim(),
        descriptionEn: String(fd.get('descriptionEn') || '').trim()
      };

      if (existing) {
        const idx = state.products.findIndex((x) => x.id === existing.id);
        state.products[idx] = updated;
      } else {
        state.products.push(updated);
        state.catalogLayout.push({ type: 'product', productId: updated.id });
      }

      closeAdminModal();
      persist(existing ? '상품이 수정되어 스토어에 반영되었습니다.' : '신규 상품이 등록되어 스토어에 노출됩니다.');
    });
  }

  /* ---------- 3. HYBRID CATALOG & EDITORIAL LAYOUT EDITOR (PDF p.13-14) ---------- */
  function renderLayoutEditor() {
    const prodMap = new Map(state.products.map((p) => [p.id, p]));

    const rowsHtml = state.catalogLayout
      .map((slot, idx) => {
        if (slot.type === 'editorial') {
          const isOff = slot.active === false;
          return `
            <div class="slot-row is-editorial ${isOff ? 'is-off' : ''}">
              <div class="slot-order-btns">
                <button type="button" data-move-slot="${idx}" data-dir="-1" title="위로">▲</button>
                <button type="button" data-move-slot="${idx}" data-dir="1" title="아래로">▼</button>
              </div>
              <img src="${esc(slot.image)}" class="thumb-wide" alt="" />
              <div>
                <span class="slot-type-tag">에디토리얼 · PC 2칸 와이드</span>
                <div style="font-weight:500;">${esc(slot.captionKo)}</div>
                <div style="font-size:11px; color:var(--ink-muted);">${esc(slot.season || '2026 WINTER')} · ${
                  isOff ? '비노출(OFF)' : '노출 중(ON)'
                }</div>
              </div>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn-xs" data-toggle-ed="${idx}">${isOff ? '노출 ON' : '숨김 OFF'}</button>
                <button type="button" class="btn-xs danger" data-del-slot="${idx}">삭제</button>
              </div>
            </div>
          `;
        }

        const p = prodMap.get(slot.productId);
        if (!p) return '';
        return `
          <div class="slot-row">
            <div class="slot-order-btns">
              <button type="button" data-move-slot="${idx}" data-dir="-1" title="위로">▲</button>
              <button type="button" data-move-slot="${idx}" data-dir="1" title="아래로">▼</button>
            </div>
            <img src="${esc((p.images && p.images[0]) || './img/prod_coat.jpg')}" class="thumb-sm" alt="" />
            <div>
              <span class="slot-type-tag prod">상품 카드 · 1칸</span>
              <div style="font-weight:500;">${esc(p.nameKo)}</div>
              <div style="font-size:11px; color:var(--ink-muted);">${esc(p.category)} · ₩${Store.formatNumber(
                p.priceKrw
              )}</div>
            </div>
            <div style="font-size:11px; color:var(--ink-faint);">#${idx + 1}</div>
          </div>
        `;
      })
      .join('');

    const previewHtml = state.catalogLayout
      .map((slot) => {
        if (slot.type === 'editorial') {
          if (slot.active === false) return '';
          return `
            <div class="preview-card span-2">
              <img src="${esc(slot.image)}" alt="" />
              <div class="preview-cap"><strong>[EDITORIAL 2-COL]</strong> ${esc(slot.captionKo)}</div>
            </div>
          `;
        }
        const p = prodMap.get(slot.productId);
        if (!p) return '';
        return `
          <div class="preview-card">
            <img src="${esc((p.images && p.images[0]) || './img/prod_coat.jpg')}" alt="" />
            <div class="preview-cap">${esc(p.nameKo)}</div>
          </div>
        `;
      })
      .join('');

    return `
      <div class="toolbar">
        <div style="font-size:12px; color:var(--ink-muted);">
          시즌별 에디토리얼 유무/위치에 따라 순서를 변경하면 스토어프론트 <strong>CLOTHING → ALL</strong> 4열 그리드에 즉시 반영됩니다.
        </div>
        <button type="button" class="btn-solid" id="addEditorialSlotBtn">+ 에디토리얼 배너 추가</button>
      </div>

      <div class="layout-workspace">
        <div class="panel">
          <div class="panel-head">
            <h2 class="panel-title">진열 순서 편집 (총 ${state.catalogLayout.length}개 블록)</h2>
          </div>
          <div>${rowsHtml}</div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <h2 class="panel-title">스토어프론트 PC 4열 실시간 미리보기</h2>
            <a href="./index.html#catalog/ALL" target="_blank" rel="noopener" class="btn-xs">실제 페이지 확인 ↗</a>
          </div>
          <div class="panel-body">
            <div class="preview-grid-4">${previewHtml}</div>
          </div>
        </div>
      </div>
    `;
  }

  function openAddEditorialModal() {
    const box = document.getElementById('adminModalBox');
    box.innerHTML = `
      <div class="modal-head">
        <h2 class="modal-title">카탈로그 에디토리얼 배너 추가</h2>
        <button type="button" class="btn-xs" data-close-admin-modal>닫기 ✕</button>
      </div>
      <form id="editorialForm" class="form-grid">
        <div class="form-field full">
          <label>캠페인 이미지 선택</label>
          <select class="select" name="image">
            ${Store.IMAGE_PRESETS.map((i) => `<option value="${esc(i.url)}">${esc(i.label)}</option>`).join('')}
          </select>
        </div>
        <div class="form-field">
          <label>시즌 라벨</label>
          <input class="input" name="season" value="2026 WINTER" required />
        </div>
        <div class="form-field">
          <label>삽입 위치</label>
          <select class="select" name="position">
            <option value="top">최상단 (2번째 슬롯)</option>
            <option value="bottom">최하단</option>
          </select>
        </div>
        <div class="form-field full">
          <label>에디토리얼 캡션 (국문)</label>
          <input class="input" name="captionKo" required placeholder="예: EDITORIAL 03 — SEONGSU STUDIO STUDY" />
        </div>
        <div class="form-field full">
          <label>Editorial Caption (EN)</label>
          <input class="input" name="captionEn" required placeholder="e.g. EDITORIAL 03 — SEONGSU STUDIO STUDY" />
        </div>
        <div class="form-field full" style="display:flex; justify-content:flex-end; gap:8px;">
          <button type="button" class="btn-ghost" data-close-admin-modal>취소</button>
          <button type="submit" class="btn-solid">에디토리얼 배너 추가</button>
        </div>
      </form>
    `;
    document.getElementById('adminModalBackdrop').hidden = false;

    document.getElementById('editorialForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const slot = {
        type: 'editorial',
        id: 'ed-' + Date.now().toString().slice(-4),
        active: true,
        span: 2,
        season: String(fd.get('season')).trim(),
        image: String(fd.get('image')),
        captionKo: String(fd.get('captionKo')).trim(),
        captionEn: String(fd.get('captionEn')).trim()
      };
      if (fd.get('position') === 'top') {
        state.catalogLayout.splice(1, 0, slot);
      } else {
        state.catalogLayout.push(slot);
      }
      closeAdminModal();
      persist('에디토리얼 배너가 카탈로그에 추가되었습니다.');
    });
  }

  /* ---------- 4. ORDERS & AUTOMATED RETURN FEE MANAGEMENT (PDF p.18-19) ---------- */
  function renderOrdersAdmin() {
    const list =
      orderFilter === 'RETURN'
        ? state.orders.filter((o) => Boolean(o.returnRequest))
        : state.orders;

    const statuses = ['결제완료', '배송준비중', '배송중', '배송완료', '교환요청', '반품요청', '교환완료', '반품완료', '취소'];

    return `
      <div class="toolbar">
        <div class="subtabs" style="margin:0;">
          <button type="button" class="subtab ${orderFilter === 'ALL' ? 'active' : ''}" data-order-filter="ALL">
            전체 주문 (${state.orders.length})
          </button>
          <button type="button" class="subtab ${orderFilter === 'RETURN' ? 'active' : ''}" data-order-filter="RETURN">
            교환/반품 · 배송비 정산 건 (${state.orders.filter((o) => o.returnRequest).length})
          </button>
        </div>
        <a href="./index.html#orders" target="_blank" rel="noopener" class="btn-outline">스토어 MY ORDERS 열기 ↗</a>
      </div>

      ${
        list.length === 0
          ? `<div class="panel"><div class="panel-body" style="color:var(--ink-faint);">표시할 주문 내역이 없습니다.</div></div>`
          : list
              .map((o) => {
                const rr = o.returnRequest;
                return `
                  <article class="order-admin-card">
                    <div class="order-admin-head">
                      <div>
                        <strong>${esc(o.id)}</strong>
                        <span style="color:var(--ink-faint); margin-left:8px;">${esc(o.createdAt)}</span>
                        <span style="color:var(--ink-muted); margin-left:12px;">${esc(o.customerName)} (${esc(o.customerPhone)}) · ${esc(o.address)}</span>
                      </div>
                      <div style="display:flex; align-items:center; gap:10px;">
                        <strong style="font-variant-numeric:tabular-nums;">₩${Store.formatNumber(o.totalKrw)}</strong>
                        <select class="select" data-order-status="${esc(o.id)}">
                          ${statuses
                            .map((st) => `<option value="${st}" ${o.status === st ? 'selected' : ''}>${st}</option>`)
                            .join('')}
                        </select>
                      </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:8px;">
                      ${o.items
                        .map(
                          (it) => `
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
                          <div style="display:flex; align-items:center; gap:12px;">
                            <img src="${esc(it.image)}" class="thumb-sm" alt="" />
                            <div>
                              <div style="font-weight:500;">${esc(it.nameKo)}</div>
                              <div style="font-size:11px; color:var(--ink-muted);">SIZE ${esc(it.size)} · 수량 ${it.qty}개</div>
                            </div>
                          </div>
                          <div style="font-variant-numeric:tabular-nums;">₩${Store.formatNumber(
                            it.priceKrw * it.qty
                          )}</div>
                        </div>`
                        )
                        .join('')}
                    </div>

                    ${
                      rr
                        ? `<div class="return-admin-panel ${rr.adminStatus === '처리완료' ? 'done' : ''}">
                            <div style="font-size:12px; line-height:1.65;">
                              <div>
                                <strong>[${rr.type === 'EXCHANGE' ? '교환 신청' : '반품 신청'}]</strong>
                                사유: ${esc(rr.reasonLabel)} ${rr.detail ? `— "${esc(rr.detail)}"` : ''}
                              </div>
                              <div>
                                <strong>반품/교환 배송비 자동결제:</strong>
                                ₩${Store.formatNumber(rr.feeKrw)} · ${esc(rr.payMethodLabel)}
                                <span class="pill ${rr.payStatus === 'PAID' || rr.payStatus === 'FREE' ? 'ok' : 'warn'}" style="margin-left:6px;">
                                  ${
                                    rr.payStatus === 'PAID'
                                      ? '즉시결제 완료'
                                      : rr.payStatus === 'DEDUCT'
                                      ? '환불금 차감 예정'
                                      : '판매자 부담 ₩0'
                                  }
                                </span>
                                <span style="margin-left:8px; color:var(--ink-muted);">접수일시: ${esc(rr.requestedAt)}</span>
                              </div>
                            </div>
                            <div style="display:flex; gap:6px; align-items:center;">
                              <span class="pill">${esc(rr.adminStatus)}</span>
                              <button type="button" class="btn-xs" data-return-action="${esc(o.id)}" data-next="수거진행">수거 지시</button>
                              <button type="button" class="btn-solid" style="padding:5px 10px; font-size:11px;" data-return-action="${esc(o.id)}" data-next="처리완료">승인 · 완료</button>
                              <button type="button" class="btn-xs danger" data-return-action="${esc(o.id)}" data-next="반려">반려</button>
                            </div>
                          </div>`
                        : ''
                    }
                  </article>
                `;
              })
              .join('')
      }
    `;
  }

  /* ---------- 5. CMS (HERO, ARCHIVE, NOTICE, STOCKIST) ---------- */
  function renderCms() {
    let inner = '';
    if (cmsSubtab === 'hero') {
      const h = state.hero;
      inner = `
        <div class="panel">
          <div class="panel-head"><h2 class="panel-title">메인 원페이지 에디토리얼 배너 설정</h2></div>
          <div class="panel-body">
            <form id="heroCmsForm" class="form-grid">
              <div class="form-field">
                <label>시즌 타이틀</label>
                <input class="input" name="season" value="${esc(h.season)}" required />
              </div>
              <div class="form-field">
                <label>메인 룩북 이미지</label>
                <select class="select" name="image">
                  ${Store.IMAGE_PRESETS.map(
                    (img) => `<option value="${esc(img.url)}" ${h.image === img.url ? 'selected' : ''}>${esc(img.label)}</option>`
                  ).join('')}
                </select>
              </div>
              <div class="form-field full">
                <label>배너 하단 캡션 (국문)</label>
                <input class="input" name="captionKo" value="${esc(h.captionKo)}" required />
              </div>
              <div class="form-field full">
                <label>Banner Caption (EN)</label>
                <input class="input" name="captionEn" value="${esc(h.captionEn)}" required />
              </div>
              <div class="form-field">
                <label>클릭 시 이동 카테고리</label>
                <select class="select" name="ctaCategory">
                  ${['ALL', 'NEW', 'OUTWEARS', 'TOPS', 'KNIT', 'BOTTOMS']
                    .map((c) => `<option value="${c}" ${h.ctaCategory === c ? 'selected' : ''}>${c}</option>`)
                    .join('')}
                </select>
              </div>
              <div class="form-field" style="justify-content:flex-end; align-items:flex-end;">
                <button type="submit" class="btn-solid">메인 배너 저장</button>
              </div>
            </form>
          </div>
        </div>
      `;
    } else if (cmsSubtab === 'archive') {
      inner = `
        <div class="panel">
          <div class="panel-head">
            <h2 class="panel-title">아카이브 에디토리얼 목록 (${state.archives.length})</h2>
            <button type="button" class="btn-solid" id="addArchiveBtn">+ 아카이브 추가</button>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>커버</th><th>코드 / 카테고리</th><th>제목</th><th>발행일</th><th>관리</th></tr></thead>
              <tbody>
                ${state.archives
                  .map(
                    (a, i) => `
                  <tr>
                    <td><img src="${esc(a.image)}" class="thumb-sm" alt="" /></td>
                    <td><strong>${esc(a.code)}</strong><div style="font-size:11px; color:var(--ink-muted);">${esc(a.category)}</div></td>
                    <td>${esc(a.titleKo)}</td>
                    <td>${esc(a.date)}</td>
                    <td><button type="button" class="btn-xs danger" data-del-archive="${i}">삭제</button></td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (cmsSubtab === 'notice') {
      inner = `
        <div class="panel">
          <div class="panel-head">
            <h2 class="panel-title">공지사항 관리 (${state.notices.length})</h2>
            <button type="button" class="btn-solid" id="addNoticeBtn">+ 공지사항 작성</button>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>구분</th><th>제목 (한/영)</th><th>등록일</th><th>관리</th></tr></thead>
              <tbody>
                ${state.notices
                  .map(
                    (n, i) => `
                  <tr>
                    <td><span class="pill ${n.pinned ? 'ok' : ''}">${n.pinned ? '상단고정' : '일반'}</span></td>
                    <td>
                      <div style="font-weight:500;">${esc(n.titleKo)}</div>
                      <div style="font-size:11px; color:var(--ink-muted);">${esc(n.titleEn)}</div>
                    </td>
                    <td>${esc(n.date)}</td>
                    <td>
                      <button type="button" class="btn-xs" data-pin-notice="${i}">${n.pinned ? '고정해제' : '고정'}</button>
                      <button type="button" class="btn-xs danger" data-del-notice="${i}">삭제</button>
                    </td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      const s = state.stockists;
      inner = `
        <div class="panel">
          <div class="panel-head">
            <h2 class="panel-title">매장안내 (STOCKIST) — 1-Click 페이지 연동</h2>
            <button type="button" class="btn-solid" id="addOfflineStoreBtn">+ 오프라인 매장 추가</button>
          </div>
          <div class="panel-body">
            <div style="margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--line);">
              <strong style="display:block; margin-bottom:4px;">본사 (HQ)</strong>
              <div style="color:var(--ink-muted);">${esc(s.hq.addressKo)} · ${esc(s.hq.contact)}</div>
            </div>

            <strong style="display:block; margin-bottom:10px;">오프라인 매장 (${s.offline.length})</strong>
            <div class="table-wrap">
              <table class="data-table">
                <thead><tr><th>매장명</th><th>주소</th><th>운영시간 / 연락처</th><th>관리</th></tr></thead>
                <tbody>
                  ${s.offline
                    .map(
                      (o, i) => `
                    <tr>
                      <td><strong>${esc(o.name)}</strong></td>
                      <td>${esc(o.addressKo)}</td>
                      <td>${esc(o.hours)} · ${esc(o.phone)}</td>
                      <td><button type="button" class="btn-xs danger" data-del-offline="${i}">삭제</button></td>
                    </tr>`
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="subtabs">
        <button type="button" class="subtab ${cmsSubtab === 'hero' ? 'active' : ''}" data-cms-sub="hero">메인 배너</button>
        <button type="button" class="subtab ${cmsSubtab === 'archive' ? 'active' : ''}" data-cms-sub="archive">아카이브</button>
        <button type="button" class="subtab ${cmsSubtab === 'notice' ? 'active' : ''}" data-cms-sub="notice">공지사항</button>
        <button type="button" class="subtab ${cmsSubtab === 'stockist' ? 'active' : ''}" data-cms-sub="stockist">매장안내 (STOCKIST)</button>
      </div>
      ${inner}
    `;
  }

  function openSimpleCmsModal(kind) {
    const box = document.getElementById('adminModalBox');
    if (kind === 'notice') {
      box.innerHTML = `
        <div class="modal-head">
          <h2 class="modal-title">공지사항 작성</h2>
          <button type="button" class="btn-xs" data-close-admin-modal>닫기 ✕</button>
        </div>
        <form id="noticeForm" class="form-grid">
          <div class="form-field full"><label>제목 (국문)</label><input class="input" name="titleKo" required /></div>
          <div class="form-field full"><label>Title (EN)</label><input class="input" name="titleEn" required /></div>
          <div class="form-field full"><label>내용 (국문)</label><textarea class="textarea" name="bodyKo" rows="3" required></textarea></div>
          <div class="form-field full"><label>Content (EN)</label><textarea class="textarea" name="bodyEn" rows="2" required></textarea></div>
          <div class="form-field full">
            <label style="display:flex; align-items:center; gap:8px; color:var(--ink);">
              <input type="checkbox" name="pinned" checked /><span>상단 고정 공지</span>
            </label>
          </div>
          <div class="form-field full" style="display:flex; justify-content:flex-end; gap:8px;">
            <button type="button" class="btn-ghost" data-close-admin-modal>취소</button>
            <button type="submit" class="btn-solid">등록</button>
          </div>
        </form>
      `;
      document.getElementById('adminModalBackdrop').hidden = false;
      document.getElementById('noticeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const today = Store.nowStamp().slice(0, 10).replace(/-/g, '.');
        state.notices.unshift({
          id: 'nt-' + Date.now().toString().slice(-4),
          pinned: fd.get('pinned') === 'on',
          date: today,
          titleKo: String(fd.get('titleKo')).trim(),
          titleEn: String(fd.get('titleEn')).trim(),
          bodyKo: String(fd.get('bodyKo')).trim(),
          bodyEn: String(fd.get('bodyEn')).trim()
        });
        closeAdminModal();
        persist('공지사항이 등록되었습니다.');
      });
    } else if (kind === 'archive') {
      box.innerHTML = `
        <div class="modal-head">
          <h2 class="modal-title">아카이브 에디토리얼 추가</h2>
          <button type="button" class="btn-xs" data-close-admin-modal>닫기 ✕</button>
        </div>
        <form id="archiveForm" class="form-grid">
          <div class="form-field"><label>아카이브 코드</label><input class="input" name="code" value="ARCHIVE 00${state.archives.length + 1}" required /></div>
          <div class="form-field"><label>카테고리 라벨</label><input class="input" name="category" value="2026 CAPSULE" required /></div>
          <div class="form-field full"><label>대표 이미지</label>
            <select class="select" name="image">
              ${Store.IMAGE_PRESETS.map((i) => `<option value="${esc(i.url)}">${esc(i.label)}</option>`).join('')}
            </select>
          </div>
          <div class="form-field full"><label>제목 (국문)</label><input class="input" name="titleKo" required /></div>
          <div class="form-field full"><label>Title (EN)</label><input class="input" name="titleEn" required /></div>
          <div class="form-field full"><label>요약 / 본문 (국문)</label><textarea class="textarea" name="bodyKo" rows="3" required></textarea></div>
          <div class="form-field full" style="display:flex; justify-content:flex-end; gap:8px;">
            <button type="button" class="btn-ghost" data-close-admin-modal>취소</button>
            <button type="submit" class="btn-solid">아카이브 발행</button>
          </div>
        </form>
      `;
      document.getElementById('adminModalBackdrop').hidden = false;
      document.getElementById('archiveForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const img = String(fd.get('image'));
        const body = String(fd.get('bodyKo')).trim();
        state.archives.unshift({
          id: 'ar-' + Date.now().toString().slice(-4),
          code: String(fd.get('code')).trim(),
          category: String(fd.get('category')).trim(),
          date: Store.nowStamp().slice(0, 10).replace(/-/g, '.'),
          titleKo: String(fd.get('titleKo')).trim(),
          titleEn: String(fd.get('titleEn')).trim(),
          image: img,
          gallery: [img, './img/editorial_wide_1.jpg'],
          summaryKo: body.slice(0, 80),
          summaryEn: String(fd.get('titleEn')).trim(),
          bodyKo: body,
          bodyEn: body
        });
        closeAdminModal();
        persist('새 아카이브 글이 발행되었습니다.');
      });
    } else if (kind === 'offline') {
      box.innerHTML = `
        <div class="modal-head">
          <h2 class="modal-title">오프라인 매장 (STOCKIST) 추가</h2>
          <button type="button" class="btn-xs" data-close-admin-modal>닫기 ✕</button>
        </div>
        <form id="offlineForm" class="form-grid">
          <div class="form-field full"><label>매장명</label><input class="input" name="name" required placeholder="예: VERMANT BUSAN POP-UP" /></div>
          <div class="form-field full"><label>주소 (국문)</label><input class="input" name="addressKo" required /></div>
          <div class="form-field full"><label>Address (EN)</label><input class="input" name="addressEn" required /></div>
          <div class="form-field"><label>운영시간</label><input class="input" name="hours" value="TUE – SUN  12:00 – 20:00" required /></div>
          <div class="form-field"><label>전화번호</label><input class="input" name="phone" value="+82 2-000-0000" required /></div>
          <div class="form-field full" style="display:flex; justify-content:flex-end; gap:8px;">
            <button type="button" class="btn-ghost" data-close-admin-modal>취소</button>
            <button type="submit" class="btn-solid">매장 추가</button>
          </div>
        </form>
      `;
      document.getElementById('adminModalBackdrop').hidden = false;
      document.getElementById('offlineForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        state.stockists.offline.push({
          name: String(fd.get('name')).trim(),
          addressKo: String(fd.get('addressKo')).trim(),
          addressEn: String(fd.get('addressEn')).trim(),
          hours: String(fd.get('hours')).trim(),
          phone: String(fd.get('phone')).trim()
        });
        closeAdminModal();
        persist('오프라인 매장이 STOCKIST에 추가되었습니다.');
      });
    }
  }

  /* ---------- 6. USERS / CRM MANAGEMENT ---------- */
  function renderUsers() {
    const q = userSearch.trim().toLowerCase();
    const list = (state.users || []).filter((u) => {
      const gradeOk = userGradeFilter === 'ALL' || u.grade === userGradeFilter;
      const qOk =
        !q ||
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q);
      return gradeOk && qOk;
    });

    return `
      <div class="toolbar">
        <div class="toolbar-group">
          <input type="search" class="input" id="userSearchInput" placeholder="회원명, 이메일, 연락처 검색" value="${esc(
            userSearch
          )}" style="width:240px;" />
          <select class="select" id="userGradeSelect">
            <option value="ALL" ${userGradeFilter === 'ALL' ? 'selected' : ''}>전체 등급</option>
            <option value="VIP" ${userGradeFilter === 'VIP' ? 'selected' : ''}>VIP</option>
            <option value="STANDARD" ${userGradeFilter === 'STANDARD' ? 'selected' : ''}>STANDARD</option>
            <option value="ADMIN" ${userGradeFilter === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
          </select>
        </div>
        <a href="./index.html#join" target="_blank" rel="noopener" class="btn-outline">스토어 회원가입 테스트 ↗</a>
      </div>

      <div class="panel">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>회원 정보</th>
                <th>연락처 / 기본 배송지</th>
                <th>등급</th>
                <th>누적 주문 / 매출</th>
                <th>가입일</th>
                <th>계정 상태</th>
              </tr>
            </thead>
            <tbody>
              ${list
                .map((u) => {
                  const uOrders = state.orders.filter(
                    (o) => o.userId === u.id || (!o.userId && o.customerName === u.name)
                  );
                  const spent = uOrders
                    .filter((o) => o.status !== '취소')
                    .reduce((s, o) => s + Number(o.totalKrw || 0), 0);
                  const isAdminUser = u.role === 'ADMIN';

                  return `
                    <tr>
                      <td>
                        <div style="font-weight:500;">${esc(u.name)}</div>
                        <div style="font-size:11px; color:var(--ink-muted);">${esc(u.email)}</div>
                      </td>
                      <td>
                        <div>${esc(u.phone || '-')}</div>
                        <div style="font-size:11px; color:var(--ink-faint);">${esc(u.address || '-')}</div>
                      </td>
                      <td>
                        ${
                          isAdminUser
                            ? '<span class="pill ok">ADMIN</span>'
                            : `<select class="select" data-user-grade="${esc(u.id)}" style="padding:4px 8px;">
                                <option value="STANDARD" ${u.grade === 'STANDARD' ? 'selected' : ''}>STANDARD</option>
                                <option value="VIP" ${u.grade === 'VIP' ? 'selected' : ''}>VIP</option>
                               </select>`
                        }
                      </td>
                      <td style="font-variant-numeric:tabular-nums;">
                        <div>${uOrders.length}건</div>
                        <div style="font-size:11px; color:var(--ink-muted);">₩${Store.formatNumber(spent)}</div>
                      </td>
                      <td style="font-size:11px; color:var(--ink-faint);">${esc(u.createdAt || '-')}</td>
                      <td>
                        ${
                          isAdminUser
                            ? '<span class="pill ok">활성</span>'
                            : `<button type="button" class="btn-xs ${u.status === '정지' ? '' : 'danger'}" data-toggle-user-status="${esc(
                                u.id
                              )}">
                                ${u.status === '정지' ? '정지 해제' : '계정 정지'}
                               </button>
                               <span class="pill ${u.status === '정지' ? 'danger' : 'ok'}" style="margin-left:4px;">${esc(
                                 u.status || '활성'
                               )}</span>`
                        }
                      </td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function closeAdminModal() {
    document.getElementById('adminModalBackdrop').hidden = true;
    document.getElementById('adminModalBox').innerHTML = '';
  }

  /* ---------- Admin Auth Gate ---------- */
  function syncAdminAuth() {
    const adminUser = Store.getAdminSession();
    const gate = document.getElementById('adminAuthGate');
    const shell = document.getElementById('adminShell');
    const label = document.getElementById('adminUserLabel');

    if (!adminUser) {
      gate.hidden = false;
      shell.hidden = true;
      return false;
    }

    gate.hidden = true;
    shell.hidden = false;
    if (label) label.textContent = `${adminUser.name} (${adminUser.email})`;
    return true;
  }

  /* ---------- Main Render & Event Binding ---------- */
  function render() {
    if (!syncAdminAuth()) return;
    state = Store.load();
    updateReturnBadge();

    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === activeTab);
    });

    const meta = TAB_META[activeTab] || TAB_META.dashboard;
    document.getElementById('pageTitle').textContent = meta.title;
    document.getElementById('pageDesc').textContent = meta.desc;

    const root = document.getElementById('adminContent');
    if (activeTab === 'dashboard') root.innerHTML = renderDashboard();
    else if (activeTab === 'products') root.innerHTML = renderProducts();
    else if (activeTab === 'layout') root.innerHTML = renderLayoutEditor();
    else if (activeTab === 'orders') root.innerHTML = renderOrdersAdmin();
    else if (activeTab === 'cms') root.innerHTML = renderCms();
    else if (activeTab === 'users') root.innerHTML = renderUsers();

    bindTabEvents();
  }

  function bindTabEvents() {
    document.querySelectorAll('[data-goto-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-goto-tab');
        render();
      });
    });

    const dashAdd = document.getElementById('dashAddProduct');
    if (dashAdd) {
      dashAdd.addEventListener('click', () => {
        activeTab = 'products';
        render();
        openProductModal(null);
      });
    }

    // Products
    const prodSearch = document.getElementById('prodSearchInput');
    if (prodSearch) {
      prodSearch.addEventListener('input', () => {
        productSearch = prodSearch.value;
        render();
        const nextInput = document.getElementById('prodSearchInput');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(productSearch.length, productSearch.length);
        }
      });
    }
    const prodCat = document.getElementById('prodCatSelect');
    if (prodCat) {
      prodCat.addEventListener('change', () => {
        productCatFilter = prodCat.value;
        render();
      });
    }
    const newProdBtn = document.getElementById('openNewProductBtn');
    if (newProdBtn) newProdBtn.addEventListener('click', () => openProductModal(null));

    document.querySelectorAll('[data-edit-prod]').forEach((btn) => {
      btn.addEventListener('click', () => openProductModal(btn.getAttribute('data-edit-prod')));
    });

    document.querySelectorAll('[data-del-prod]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-del-prod');
        if (!window.confirm('이 상품을 삭제하시겠습니까?')) return;
        state.products = state.products.filter((p) => p.id !== pid);
        state.catalogLayout = state.catalogLayout.filter((s) => !(s.type === 'product' && s.productId === pid));
        persist('상품이 삭제되었습니다.');
      });
    });

    // Layout Editor
    const addEdBtn = document.getElementById('addEditorialSlotBtn');
    if (addEdBtn) addEdBtn.addEventListener('click', openAddEditorialModal);

    document.querySelectorAll('[data-move-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-move-slot'));
        const dir = Number(btn.getAttribute('data-dir'));
        const target = idx + dir;
        if (target < 0 || target >= state.catalogLayout.length) return;
        const arr = state.catalogLayout;
        [arr[idx], arr[target]] = [arr[target], arr[idx]];
        persist('진열 순서가 변경되어 스토어에 반영되었습니다.');
      });
    });

    document.querySelectorAll('[data-toggle-ed]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-toggle-ed'));
        const slot = state.catalogLayout[idx];
        if (!slot) return;
        slot.active = slot.active === false ? true : false;
        persist(slot.active ? '에디토리얼 배너가 노출(ON)되었습니다.' : '에디토리얼 배너가 숨김(OFF) 처리되었습니다.');
      });
    });

    document.querySelectorAll('[data-del-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-del-slot'));
        state.catalogLayout.splice(idx, 1);
        persist('에디토리얼 배너가 삭제되었습니다.');
      });
    });

    // Orders & Return Settlement
    document.querySelectorAll('[data-order-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        orderFilter = btn.getAttribute('data-order-filter');
        render();
      });
    });

    document.querySelectorAll('[data-order-status]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const oid = sel.getAttribute('data-order-status');
        const o = state.orders.find((x) => x.id === oid);
        if (!o) return;
        o.status = sel.value;
        persist(`주문 ${oid} 상태가 [${o.status}](으)로 변경되었습니다.`);
      });
    });

    document.querySelectorAll('[data-return-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const oid = btn.getAttribute('data-return-action');
        const next = btn.getAttribute('data-next');
        const o = state.orders.find((x) => x.id === oid);
        if (!o || !o.returnRequest) return;
        o.returnRequest.adminStatus = next;
        if (next === '처리완료') {
          o.status = o.returnRequest.type === 'EXCHANGE' ? '교환완료' : '반품완료';
        }
        persist(`교환/반품 요청이 [${next}] 상태로 업데이트되었습니다.`);
      });
    });

    // CMS
    document.querySelectorAll('[data-cms-sub]').forEach((btn) => {
      btn.addEventListener('click', () => {
        cmsSubtab = btn.getAttribute('data-cms-sub');
        render();
      });
    });

    const heroForm = document.getElementById('heroCmsForm');
    if (heroForm) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        state.hero.season = String(fd.get('season')).trim();
        state.hero.image = String(fd.get('image'));
        state.hero.captionKo = String(fd.get('captionKo')).trim();
        state.hero.captionEn = String(fd.get('captionEn')).trim();
        state.hero.ctaCategory = String(fd.get('ctaCategory'));
        persist('메인 배너가 저장되어 스토어에 반영되었습니다.');
      });
    }

    const addArchiveBtn = document.getElementById('addArchiveBtn');
    if (addArchiveBtn) addArchiveBtn.addEventListener('click', () => openSimpleCmsModal('archive'));
    document.querySelectorAll('[data-del-archive]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.archives.splice(Number(btn.getAttribute('data-del-archive')), 1);
        persist('아카이브 항목이 삭제되었습니다.');
      });
    });

    const addNoticeBtn = document.getElementById('addNoticeBtn');
    if (addNoticeBtn) addNoticeBtn.addEventListener('click', () => openSimpleCmsModal('notice'));
    document.querySelectorAll('[data-pin-notice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.getAttribute('data-pin-notice'));
        state.notices[i].pinned = !state.notices[i].pinned;
        persist('공지 상단 고정 설정이 변경되었습니다.');
      });
    });
    document.querySelectorAll('[data-del-notice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.notices.splice(Number(btn.getAttribute('data-del-notice')), 1);
        persist('공지사항이 삭제되었습니다.');
      });
    });

    const addOfflineBtn = document.getElementById('addOfflineStoreBtn');
    if (addOfflineBtn) addOfflineBtn.addEventListener('click', () => openSimpleCmsModal('offline'));
    document.querySelectorAll('[data-del-offline]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.stockists.offline.splice(Number(btn.getAttribute('data-del-offline')), 1);
        persist('오프라인 매장이 삭제되었습니다.');
      });
    });

    // Users (CRM)
    const userSearchEl = document.getElementById('userSearchInput');
    if (userSearchEl) {
      userSearchEl.addEventListener('input', () => {
        userSearch = userSearchEl.value;
        render();
        const nextEl = document.getElementById('userSearchInput');
        if (nextEl) {
          nextEl.focus();
          nextEl.setSelectionRange(userSearch.length, userSearch.length);
        }
      });
    }

    const userGradeEl = document.getElementById('userGradeSelect');
    if (userGradeEl) {
      userGradeEl.addEventListener('change', () => {
        userGradeFilter = userGradeEl.value;
        render();
      });
    }

    document.querySelectorAll('[data-user-grade]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const uid = sel.getAttribute('data-user-grade');
        const u = (state.users || []).find((x) => x.id === uid);
        if (!u) return;
        u.grade = sel.value;
        persist(`${u.name} 회원의 등급이 [${u.grade}](으)로 변경되었습니다.`);
      });
    });

    document.querySelectorAll('[data-toggle-user-status]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-toggle-user-status');
        const u = (state.users || []).find((x) => x.id === uid);
        if (!u) return;
        u.status = u.status === '정지' ? '활성' : '정지';
        persist(
          u.status === '정지'
            ? `${u.name} 계정이 정지되었습니다 (스토어 로그인 차단).`
            : `${u.name} 계정의 정지가 해제되었습니다.`
        );
      });
    });
  }

  /* ---------- Admin Login & Logout ---------- */
  document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const errEl = document.getElementById('adminAuthError');
    const res = await Store.authenticate(fd.get('email'), fd.get('password'), true);
    if (!res.ok) {
      const msgs = {
        NOT_FOUND: '존재하지 않는 관리자 계정입니다.',
        FORBIDDEN: '관리자 권한이 없는 계정입니다.',
        WRONG_PASSWORD: '비밀번호가 일치하지 않습니다.',
        SUSPENDED: '비활성화된 계정입니다.'
      };
      errEl.textContent = msgs[res.code] || '로그인에 실패했습니다.';
      errEl.hidden = false;
      return;
    }
    errEl.hidden = true;
    showToast(`${res.user.name}님 환영합니다.`);
    render();
  });

  document.getElementById('quickAdminLoginBtn').addEventListener('click', async () => {
    const res = await Store.authenticate('admin@vermant.kr', 'admin1234', true);
    if (res.ok) {
      document.getElementById('adminAuthError').hidden = true;
      showToast('데모 관리자 계정으로 로그인되었습니다.');
      render();
    }
  });

  document.getElementById('adminLogoutBtn').addEventListener('click', () => {
    Store.clearAdminSession();
    showToast('관리자 로그아웃되었습니다.');
    render();
  });

  /* ---------- Global Chrome ---------- */
  document.getElementById('sidebarNav').addEventListener('click', (e) => {
    const item = e.target.closest('.nav-item');
    if (!item) return;
    activeTab = item.getAttribute('data-tab');
    document.getElementById('adminSidebar').classList.remove('open');
    render();
  });

  document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('adminSidebar').classList.toggle('open');
  });

  document.getElementById('resetDemoBtn').addEventListener('click', () => {
    if (!window.confirm('모든 상품, 진열, 주문 및 교환/반품 데이터를 초기 데모 상태로 되돌리시겠습니까?')) return;
    state = Store.reset();
    showToast('초기 데모 데이터로 복원되었습니다.');
    render();
  });

  document.getElementById('adminModalBackdrop').addEventListener('click', (e) => {
    if (e.target.id === 'adminModalBackdrop' || e.target.closest('[data-close-admin-modal]')) {
      closeAdminModal();
    }
  });

  Store.subscribe((next) => {
    state = next;
    render();
  });

  render();
})();
