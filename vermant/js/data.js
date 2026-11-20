/* ==========================================================================
   VERMANT SEOUL — Shared Data Store, Auth (SHA-256) & Live Sync Layer
   ========================================================================== */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'vermant_commerce_state_v1';
  const MEMBER_SESSION_KEY = 'vermant_member_session_v1';
  const ADMIN_SESSION_KEY = 'vermant_admin_session_v1';

  const IMAGE_PRESETS = [
    { label: 'Lookbook Hero (Editorial)', url: './img/hero_lookbook.jpg' },
    { label: 'Editorial Wide 01 (Campaign)', url: './img/editorial_wide_1.jpg' },
    { label: 'Editorial Wide 02 (Architecture)', url: './img/editorial_wide_2.jpg' },
    { label: 'Archive Craft (Wool Detail)', url: './img/archive_craft.jpg' },
    { label: 'Wool Single Coat (Studio)', url: './img/prod_coat.jpg' },
    { label: 'M65 Wool Field Jacket (Studio)', url: './img/prod_jacket.jpg' },
    { label: 'Merino Rib Cardigan (Studio)', url: './img/prod_knit.jpg' },
    { label: 'Raw Selvedge Chore Jacket (Studio)', url: './img/prod_denim.jpg' }
  ];

  /* Pure-JS SHA-256 fallback so hashing works identically on both HTTPS & file:// */
  function sha256Fallback(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const maxWord = Math.pow(2, 32);
    let result = '';
    const words = [];
    const asciiBitLength = ascii.length * 8;
    const hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};

    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += '\x80';
    while ((ascii.length % 64) - 56) ascii += '\x00';
    for (let i = 0; i < ascii.length; i++) {
      const j = ascii.charCodeAt(i);
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (let j = 0; j < words.length; ) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash.slice(0);

      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15];
        const w2 = w[i - 2];
        const a = hash[0];
        const e = hash[4];
        const temp1 =
          hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0);
        const temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

        hash.unshift((temp1 + temp2) | 0);
        hash[4] = (hash[4] + temp1) | 0;
        hash.pop();
      }

      for (let i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  function hashPasswordSync(plain) {
    const utf8 = unescape(encodeURIComponent('VERMANT_SALT::' + String(plain || '')));
    return sha256Fallback(utf8);
  }

  async function hashPassword(plain) {
    const salted = 'VERMANT_SALT::' + String(plain || '');
    try {
      if (global.crypto && global.crypto.subtle && global.TextEncoder) {
        const buf = new TextEncoder().encode(salted);
        const digest = await global.crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      }
    } catch (e) {
      // Fallback below
    }
    return hashPasswordSync(plain);
  }

  const DEFAULT_USERS = [
    {
      id: 'u-admin',
      email: 'admin@vermant.kr',
      passwordHash: hashPasswordSync('admin1234'),
      name: 'VERMANT 관리자',
      phone: '02-462-0918',
      address: '서울특별시 성동구 연무장길 48, 3F',
      role: 'ADMIN',
      grade: 'ADMIN',
      status: '활성',
      createdAt: '2026-01-02 09:00'
    },
    {
      id: 'u-001',
      email: 'seoyeon@vermant.kr',
      passwordHash: hashPasswordSync('vermant1234'),
      name: '김서연',
      phone: '010-4821-9032',
      address: '서울특별시 마포구 독막로 112, 402호',
      role: 'MEMBER',
      grade: 'VIP',
      status: '활성',
      createdAt: '2026-08-19 14:15'
    },
    {
      id: 'u-002',
      email: 'doyoon@vermant.kr',
      passwordHash: hashPasswordSync('vermant1234'),
      name: '박도윤',
      phone: '010-7723-1140',
      address: '서울특별시 강남구 논현로 151길 28, 301호',
      role: 'MEMBER',
      grade: 'STANDARD',
      status: '활성',
      createdAt: '2026-09-24 11:30'
    },
    {
      id: 'u-003',
      email: 'hyunwoo@vermant.kr',
      passwordHash: hashPasswordSync('vermant1234'),
      name: '이현우',
      phone: '010-9104-5521',
      address: '경기도 성남시 분당구 판교역로 235, 1104호',
      role: 'MEMBER',
      grade: 'STANDARD',
      status: '활성',
      createdAt: '2026-10-11 18:05'
    }
  ];

  const DEFAULT_DATA = {
    version: 2,
    hero: {
      season: '2026 WINTER COLLECTION',
      titleKo: '절제된 구조와 겨울의 밀도',
      titleEn: 'QUIET ARCHITECTURE FOR WINTER',
      captionKo: '2026 WINTER — LOOK 01 / DOUBLE-FACED WOOL OVERCOAT',
      captionEn: '2026 WINTER — LOOK 01 / DOUBLE-FACED WOOL OVERCOAT',
      image: './img/hero_lookbook.jpg',
      ctaCategory: 'ALL'
    },
    users: DEFAULT_USERS,
    products: [
      {
        id: 'vm-001',
        sku: 'VM26W-OT01',
        category: 'OUTWEARS',
        newIn: true,
        nameKo: '더블 페이스 울 싱글 발마칸 코트',
        nameEn: 'Double-Faced Wool Single Balmacaan Coat',
        colorKo: '차콜 그레이',
        colorEn: 'Charcoal Grey',
        priceKrw: 685000,
        priceUsd: 510,
        stock: 14,
        sizes: ['1 (M)', '2 (L)', '3 (XL)'],
        images: [
          './img/prod_coat.jpg',
          './img/hero_lookbook.jpg',
          './img/archive_craft.jpg'
        ],
        descriptionKo: '이탈리아산 고밀도 버진 울 90%와 캐시미어 10% 혼방 원단으로 제작한 싱글 발마칸 코트입니다. 자연스럽게 떨어지는 래글런 숄더와 여유 있는 A라인 실루엣이 특징이며, 히든 플라켓과 천연 소뿔 단추로 군더더기 없는 외관을 완성했습니다.',
        descriptionEn: 'Crafted from dense Italian 90% virgin wool and 10% cashmere double-faced melton. Designed with a soft raglan shoulder, generous A-line drape, concealed horn-button placket, and full cupro lining.',
        sizeGuideKo: '1 (M) : 총장 116 / 가슴 61 / 화장 86 cm\n2 (L) : 총장 119 / 가슴 63.5 / 화장 88.5 cm\n3 (XL) : 총장 122 / 가슴 66 / 화장 91 cm\n* 모델 184cm / 2 (L) 사이즈 착용',
        sizeGuideEn: '1 (M) : Length 116 / Chest 61 / Sleeve 86 cm\n2 (L) : Length 119 / Chest 63.5 / Sleeve 88.5 cm\n3 (XL) : Length 122 / Chest 66 / Sleeve 91 cm\n* Model is 184cm wearing size 2 (L)',
        fabricCareKo: '겉감 : Virgin Wool 90%, Cashmere 10%\n안감 : Cupro 100%\n세탁 : 드라이클리닝 단독 세탁 권장 (물세탁 및 건조기 금지)',
        fabricCareEn: 'Shell : 90% Virgin Wool, 10% Cashmere\nLining : 100% Cupro\nCare : Dry clean only. Do not tumble dry.',
        shippingKo: '영업일 기준 오후 2시 이전 주문 시 당일 출고됩니다. 전 상품 무료 배송이며, 단순 변심 반품 시 편도 3,000원 / 교환 시 왕복 6,000원의 배송비가 자동 정산됩니다.',
        shippingEn: 'Orders placed before 2 PM KST dispatch same business day. Complimentary domestic shipping. International DHL Express available ($25 flat, free over $400).'
      },
      {
        id: 'vm-002',
        sku: 'VM26W-OT02',
        category: 'OUTWEARS',
        newIn: true,
        nameKo: '브러시드 울 M65 필드 재킷',
        nameEn: 'Brushed Wool M65 Field Jacket',
        colorKo: '딥 올리브 차콜',
        colorEn: 'Deep Olive Charcoal',
        priceKrw: 495000,
        priceUsd: 370,
        stock: 9,
        sizes: ['1 (M)', '2 (L)', '3 (XL)'],
        images: [
          './img/prod_jacket.jpg',
          './img/editorial_wide_2.jpg',
          './img/archive_craft.jpg'
        ],
        descriptionKo: '빈티지 밀리터리 필드 재킷의 실용적인 포켓 구조를 도회적인 테일러링으로 재해석했습니다. 표면을 미세하게 기모 가공한 브러시드 울 원단을 사용해 묵직한 보온성과 부드러운 터치감을 동시에 제공합니다.',
        descriptionEn: 'An architectural reinterpretation of the archival M65 field jacket in softly brushed heavyweight wool. Features four gusseted bellows pockets, concealed two-way zip, and internal waist drawcord.',
        sizeGuideKo: '1 (M) : 총장 74 / 어깨 50 / 가슴 60 / 소매 62 cm\n2 (L) : 총장 76 / 어깨 52 / 가슴 62.5 / 소매 63.5 cm\n3 (XL) : 총장 78 / 어깨 54 / 가슴 65 / 소매 65 cm',
        sizeGuideEn: '1 (M) : Length 74 / Shoulder 50 / Chest 60 / Sleeve 62 cm\n2 (L) : Length 76 / Shoulder 52 / Chest 62.5 / Sleeve 63.5 cm\n3 (XL) : Length 78 / Shoulder 54 / Chest 65 / Sleeve 65 cm',
        fabricCareKo: '겉감 : Wool 100% (540gsm)\n안감 : Cotton 55%, Polyester 45%\n세탁 : 드라이클리닝 권장',
        fabricCareEn: 'Shell : 100% Wool (540gsm)\nLining : 55% Cotton, 45% Polyester\nCare : Dry clean only.',
        shippingKo: '영업일 기준 오후 2시 이전 주문 시 당일 출고됩니다. 수령 후 7일 이내 마이페이지에서 반품/교환 신청이 가능합니다.',
        shippingEn: 'Dispatches within 1 business day. Returns and exchanges accepted within 7 days of delivery.'
      },
      {
        id: 'vm-003',
        sku: 'VM26W-KN01',
        category: 'KNIT',
        newIn: true,
        nameKo: '엑스트라파인 메리노 헤비 리브 가디건',
        nameEn: 'Extrafine Merino Heavy Rib Cardigan',
        colorKo: '오트밀 에크루',
        colorEn: 'Oatmeal Ecru',
        priceKrw: 298000,
        priceUsd: 225,
        stock: 22,
        sizes: ['1 (M)', '2 (L)', '3 (XL)'],
        images: [
          './img/prod_knit.jpg',
          './img/editorial_wide_1.jpg'
        ],
        descriptionKo: '호주산 엑스트라파인 메리노 울 원사를 5게이지로 촘촘하게 편직한 헤비 리브 가디건입니다. 단독 아우터로도 손색없는 볼륨감과 탄탄한 조직감을 유지하며, 코트 이너로 레이어드하기 좋은 넥라인으로 설계했습니다.',
        descriptionEn: 'Knitted in dense 5-gauge fisherman rib from Australian extrafine merino wool. Substantial enough to wear as an outer layer, with horn buttons and reinforced tubular plackets.',
        sizeGuideKo: '1 (M) : 총장 65 / 어깨 49 / 가슴 57 / 소매 60 cm\n2 (L) : 총장 67.5 / 어깨 51 / 가슴 59.5 / 소매 61.5 cm\n3 (XL) : 총장 70 / 어깨 53 / 가슴 62 / 소매 63 cm',
        sizeGuideEn: '1 (M) : Length 65 / Shoulder 49 / Chest 57 / Sleeve 60 cm\n2 (L) : Length 67.5 / Shoulder 51 / Chest 59.5 / Sleeve 61.5 cm\n3 (XL) : Length 70 / Shoulder 53 / Chest 62 / Sleeve 63 cm',
        fabricCareKo: '소재 : Extrafine Merino Wool 100%\n세탁 : 드라이클리닝 또는 울 샴푸 냉수 단독 손세탁 후 뉘어서 건조',
        fabricCareEn: 'Composition : 100% Extrafine Merino Wool\nCare : Dry clean or hand wash cold flat dry.',
        shippingKo: '전 상품 무료 배송. 교환/반품 접수 시 배송비 자동 결제 시스템을 지원합니다.',
        shippingEn: 'Complimentary domestic shipping. Automated return shipping settlement available via My Orders.'
      },
      {
        id: 'vm-004',
        sku: 'VM26W-OT03',
        category: 'TOPS',
        newIn: true,
        nameKo: '로우 셀비지 데님 초어 재킷',
        nameEn: 'Raw Selvedge Denim Chore Jacket',
        colorKo: '인디고 로우',
        colorEn: 'Raw Indigo',
        priceKrw: 345000,
        priceUsd: 260,
        stock: 11,
        sizes: ['1 (M)', '2 (L)', '3 (XL)'],
        images: [
          './img/prod_denim.jpg',
          './img/editorial_wide_2.jpg'
        ],
        descriptionKo: '오카야마 구식 셔틀 직기에서 제직된 13.5oz 로우 셀비지 데님으로 만든 워크 초어 재킷입니다. 절제된 토널 스티치와 무광 니켈 캔톤 버튼을 적용해 시간의 흐름에 따라 고유한 페이딩이 자연스럽게 축적됩니다.',
        descriptionEn: 'Cut from 13.5oz Okayama shuttle-loom raw selvedge denim. Finished with tonal stitching, matte brushed nickel tack buttons, and clean architectural patch pockets.',
        sizeGuideKo: '1 (M) : 총장 71 / 어깨 48 / 가슴 58 / 소매 61 cm\n2 (L) : 총장 73 / 어깨 50 / 가슴 60.5 / 소매 62.5 cm\n3 (XL) : 총장 75 / 어깨 52 / 가슴 63 / 소매 64 cm',
        sizeGuideEn: '1 (M) : Length 71 / Shoulder 48 / Chest 58 / Sleeve 61 cm\n2 (L) : Length 73 / Shoulder 50 / Chest 60.5 / Sleeve 62.5 cm\n3 (XL) : Length 75 / Shoulder 52 / Chest 63 / Sleeve 64 cm',
        fabricCareKo: '소재 : Cotton 100% (13.5oz Japanese Selvedge)\n세탁 : 원워시 전 이염 주의, 찬물 단독 손세탁 권장',
        fabricCareEn: 'Composition : 100% Cotton (13.5oz Japanese Selvedge)\nCare : Wash cold separately. Natural indigo may transfer initially.',
        shippingKo: '영업일 기준 오후 2시 이전 주문 시 당일 출고됩니다.',
        shippingEn: 'Dispatches same business day before 2 PM KST.'
      },
      {
        id: 'vm-005',
        sku: 'VM26W-OT04',
        category: 'OUTWEARS',
        newIn: false,
        nameKo: '테일러드 울 더블 오버코트',
        nameEn: 'Tailored Wool Double Overcoat',
        colorKo: '옵시디언 블랙',
        colorEn: 'Obsidian Black',
        priceKrw: 720000,
        priceUsd: 540,
        stock: 6,
        sizes: ['1 (M)', '2 (L)', '3 (XL)'],
        images: [
          './img/hero_lookbook.jpg',
          './img/prod_coat.jpg',
          './img/archive_craft.jpg'
        ],
        descriptionKo: 'VERMANT 2026 WINTER 에디토리얼의 시그니처 피스입니다. 건축적인 피크드 라펠과 길게 떨어지는 맥시 기장이 차분한 긴장감을 형성합니다.',
        descriptionEn: 'Signature lookbook overcoat from the 2026 Winter collection. Constructed with structured canvas chest interlining, deep vent, and elongated silhouette.',
        sizeGuideKo: '1 (M) : 총장 121 / 어깨 49 / 가슴 59 / 소매 63 cm\n2 (L) : 총장 124 / 어깨 51 / 가슴 61.5 / 소매 64.5 cm\n3 (XL) : 총장 127 / 어깨 53 / 가슴 64 / 소매 66 cm',
        sizeGuideEn: '1 (M) : Length 121 / Shoulder 49 / Chest 59 / Sleeve 63 cm\n2 (L) : Length 124 / Shoulder 51 / Chest 61.5 / Sleeve 64.5 cm\n3 (XL) : Length 127 / Shoulder 53 / Chest 64 / Sleeve 66 cm',
        fabricCareKo: '겉감 : Virgin Wool 100%\n안감 : Bemberg Cupro 100%\n세탁 : 드라이클리닝 단독',
        fabricCareEn: 'Shell : 100% Virgin Wool\nLining : 100% Bemberg Cupro\nCare : Dry clean only.',
        shippingKo: '전용 가먼트 백과 함께 안전하게 출고됩니다.',
        shippingEn: 'Delivered in a signature cotton garment cover.'
      },
      {
        id: 'vm-006',
        sku: 'VM26W-BT01',
        category: 'BOTTOMS',
        newIn: false,
        nameKo: '더블 플리츠 와이드 울 트라우저',
        nameEn: 'Double-Pleated Wide Wool Trousers',
        colorKo: '다크 슬레이트',
        colorEn: 'Dark Slate',
        priceKrw: 278000,
        priceUsd: 210,
        stock: 18,
        sizes: ['1 (30)', '2 (32)', '3 (34)'],
        images: [
          './img/editorial_wide_1.jpg',
          './img/archive_craft.jpg'
        ],
        descriptionKo: '깊은 투턱 플리츠가 여유로운 스트레이트 드레이프를 만드는 와이드 트라우저입니다. 고연사 울 트윌 원단을 사용해 구김 복원력이 우수합니다.',
        descriptionEn: 'Full-leg tailored trousers cut with deep forward double pleats in high-twist worsted wool twill for fluid drape and natural crease recovery.',
        sizeGuideKo: '1 (30) : 허리 39 / 밑위 33 / 허벅지 36 / 밑단 25.5 / 총장 105 cm\n2 (32) : 허리 41.5 / 밑위 34 / 허벅지 37.5 / 밑단 26.5 / 총장 107 cm\n3 (34) : 허리 44 / 밑위 35 / 허벅지 39 / 밑단 27.5 / 총장 109 cm',
        sizeGuideEn: '1 (30) : Waist 39 / Rise 33 / Thigh 36 / Hem 25.5 / Length 105 cm\n2 (32) : Waist 41.5 / Rise 34 / Thigh 37.5 / Hem 26.5 / Length 107 cm\n3 (34) : Waist 44 / Rise 35 / Thigh 39 / Hem 27.5 / Length 109 cm',
        fabricCareKo: '소재 : Worsted Wool 100%\n세탁 : 드라이클리닝 권장',
        fabricCareEn: 'Composition : 100% Worsted Wool\nCare : Dry clean only.',
        shippingKo: '영업일 기준 오후 2시 이전 주문 시 당일 출고됩니다.',
        shippingEn: 'Dispatches same business day before 2 PM KST.'
      }
    ],
    catalogLayout: [
      { type: 'product', productId: 'vm-001' },
      {
        type: 'editorial',
        id: 'ed-01',
        active: true,
        span: 2,
        season: '2026 WINTER',
        image: './img/editorial_wide_1.jpg',
        captionKo: 'EDITORIAL 01 — WINTER TAILORING SILHOUETTE',
        captionEn: 'EDITORIAL 01 — WINTER TAILORING SILHOUETTE'
      },
      { type: 'product', productId: 'vm-002' },
      { type: 'product', productId: 'vm-003' },
      { type: 'product', productId: 'vm-004' },
      {
        type: 'editorial',
        id: 'ed-02',
        active: true,
        span: 2,
        season: '2026 WINTER',
        image: './img/editorial_wide_2.jpg',
        captionKo: 'EDITORIAL 02 — CONCRETE & WOOL STUDY',
        captionEn: 'EDITORIAL 02 — CONCRETE & WOOL STUDY'
      },
      { type: 'product', productId: 'vm-005' },
      { type: 'product', productId: 'vm-006' }
    ],
    archives: [
      {
        id: 'ar-003',
        code: 'ARCHIVE 003',
        category: '2026 WINTER EDITORIAL',
        date: '2026.10.28',
        titleKo: '2026 WINTER — QUIET ARCHITECTURE',
        titleEn: '2026 WINTER — QUIET ARCHITECTURE',
        image: './img/hero_lookbook.jpg',
        gallery: ['./img/hero_lookbook.jpg', './img/editorial_wide_1.jpg', './img/editorial_wide_2.jpg'],
        summaryKo: '차가운 겨울 빛과 노출 콘크리트 공간 속에서 드러나는 울 원단의 무게와 비례를 기록한 2026 윈터 캠페인.',
        summaryEn: 'A visual study of heavyweight wool proportions set against winter daylight and raw architectural concrete in Seoul.',
        bodyKo: 'VERMANT의 2026 윈터 컬렉션은 장식을 덜어낸 자리에서 비로소 드러나는 봉제선과 원단의 밀도에 집중합니다. 성수동의 조용한 콘크리트 아카이브 공간에서 촬영된 이번 에디토리얼은 몸과 의복 사이에 생기는 미세한 여백을 기록했습니다.',
        bodyEn: 'For Winter 2026, VERMANT strips away ornamental gestures to focus purely on seam geometry and textile density. Photographed in a quiet concrete gallery in Seongsu-dong, Seoul, the series captures the stillness between body and cloth.'
      },
      {
        id: 'ar-002',
        code: 'ARCHIVE 002',
        category: '2026 FALL WINTER',
        date: '2026.09.14',
        titleKo: 'MONOLITH — FALL WINTER LOOKBOOK',
        titleEn: 'MONOLITH — FALL WINTER LOOKBOOK',
        image: './img/editorial_wide_2.jpg',
        gallery: ['./img/editorial_wide_2.jpg', './img/prod_jacket.jpg', './img/prod_denim.jpg'],
        summaryKo: '밀리터리 아카이브와 현대적인 워크웨어를 절제된 무채색 톤으로 정리한 2026 FW 룩북.',
        summaryEn: 'Archival utility silhouettes distilled into muted charcoal, deep olive, and unwashed selvedge indigo.',
        bodyKo: '실용적인 아웃포켓 구조와 단단한 아우터 원단이 일상 속에서 어떻게 유연하게 자리 잡는지 탐구했습니다. 모든 피스는 계절을 넘어 겹쳐 입을 수 있도록 일관된 톤 밸런스로 설계되었습니다.',
        bodyEn: 'Exploring how utilitarian pocket architecture translates into daily tailoring. Every garment is tuned to a restrained neutral palette designed for effortless multi-season layering.'
      },
      {
        id: 'ar-001',
        code: 'ARCHIVE 001',
        category: 'CRAFT JOURNAL',
        date: '2026.08.05',
        titleKo: 'MATERIAL STUDY : DOUBLE-FACED WOOL',
        titleEn: 'MATERIAL STUDY : DOUBLE-FACED WOOL',
        image: './img/archive_craft.jpg',
        gallery: ['./img/archive_craft.jpg', './img/prod_coat.jpg', './img/prod_knit.jpg'],
        summaryKo: '이탈리아 비엘라 직조 공방에서 완성된 540gsm 울 멜톤과 핸드 피니싱 공정의 기록.',
        summaryEn: 'Inside our 540gsm Italian wool melton sourcing and hand-finished seam construction process.',
        bodyKo: '좋은 코트는 옷걸이에 걸려 있을 때보다 어깨 위에 놓였을 때 비로소 무게가 가벼워야 합니다. VERMANT 아틀리에는 두 겹의 울 원단을 정교하게 합봉하는 더블 페이스 공법을 통해 안감의 부피를 줄이면서도 높은 보온성을 구현합니다.',
        bodyEn: 'A great coat should feel lighter on the shoulders than in the hand. By splitting and hand-stitching double-faced virgin wool seams, the VERMANT atelier achieves clean internal architecture with enduring warmth.'
      }
    ],
    notices: [
      {
        id: 'nt-001',
        pinned: true,
        date: '2026.11.01',
        titleKo: '[안내] 2026 WINTER 컬렉션 2차 드롭 및 배송 일정 안내',
        titleEn: '[NOTICE] 2026 Winter Collection 2nd Drop & Dispatch Schedule',
        bodyKo: 'VERMANT 2026 WINTER 2차 발매 상품은 영업일 기준 오후 2시 이전 결제 완료 건에 한해 당일 출고됩니다. 성수 쇼룸에서도 전 사이즈 피팅이 가능합니다.',
        bodyEn: 'All 2026 Winter 2nd drop orders confirmed before 2 PM KST ship the same business day. Full size range is also available for fitting at our Seongsu Flagship.'
      },
      {
        id: 'nt-002',
        pinned: true,
        date: '2026.10.20',
        titleKo: '[시스템] 교환/반품 배송비 자동 정산 및 즉시 결제 기능 오픈',
        titleEn: '[UPDATE] Automated Return & Exchange Shipping Fee Settlement',
        bodyKo: '고객님의 편리한 쇼핑 경험을 위해 마이페이지(MY ACCOUNT) 내 교환/반품 신청 시 사유에 따른 배송비 자동 산정 및 환불금 차감/즉시 결제 기능을 도입했습니다. 별도 계좌 입금 없이 원스톱으로 접수하실 수 있습니다.',
        bodyEn: 'You can now request returns or exchanges directly inside MY ACCOUNT with automated shipping fee calculation and instant card settlement or refund deduction.'
      },
      {
        id: 'nt-003',
        pinned: false,
        date: '2026.10.05',
        titleKo: '[해외배송] 글로벌 영문 스토어 및 USD 결제 지원 안내',
        titleEn: '[GLOBAL] English Storefront & Worldwide DHL Express Launch',
        bodyKo: '우측 상단 KR / EN 전환 버튼을 통해 영문 스토어와 USD 가격 안내를 이용하실 수 있습니다. 해외 주문은 DHL Express를 통해 영업일 기준 3~5일 내 배송됩니다.',
        bodyEn: 'Switch between KR / EN at the top-right utility bar for English navigation and USD pricing. International parcels ship via DHL Express within 3–5 business days.'
      }
    ],
    stockists: {
      hq: {
        nameKo: 'VERMANT SEOUL HEADQUARTERS',
        nameEn: 'VERMANT SEOUL HEADQUARTERS',
        addressKo: '서울특별시 성동구 연무장길 48, 3F (VERMANT 아틀리에)',
        addressEn: '3F, 48 Yeonmujang-gil, Seongdong-gu, Seoul, South Korea',
        hoursKo: 'MON – FRI  10:00 – 19:00 (LUNCH 12:30 – 13:30)',
        hoursEn: 'MON – FRI  10:00 – 19:00 KST',
        contact: 'cs@vermant-seoul.com  /  +82 2-462-0918'
      },
      online: [
        { name: 'VERMANT OFFICIAL ONLINE', region: 'GLOBAL', url: 'https://vermant-seoul.com', noteKo: '전 컬렉션 및 아카이브 단독 발매', noteEn: 'Full collection & exclusive archives' },
        { name: '29CM', region: 'KR', url: 'https://www.29cm.co.kr', noteKo: '시즌 주요 아우터 · 니트 입점', noteEn: 'Selected seasonal outerwear & knitwear' },
        { name: 'EQL', region: 'KR', url: 'https://www.eqlstore.com', noteKo: '컨템포러리 셀렉트 라인 입점', noteEn: 'Contemporary curated line' },
        { name: 'SSENSE (STOCKING 2027 SS)', region: 'INTL', url: 'https://www.ssense.com', noteKo: '글로벌 파트너십 예정', noteEn: 'Upcoming international retail partner' }
      ],
      offline: [
        {
          name: 'VERMANT SEONGSU FLAGSHIP',
          addressKo: '서울특별시 성동구 연무장길 48, 1–2F',
          addressEn: '1–2F, 48 Yeonmujang-gil, Seongdong-gu, Seoul',
          hours: 'TUE – SUN  12:00 – 20:00',
          phone: '+82 2-462-0919'
        },
        {
          name: 'VERMANT HANNAM SHOWROOM',
          addressKo: '서울특별시 용산구 이태원로 54길 32, 2F',
          addressEn: '2F, 32 Itaewon-ro 54-gil, Yongsan-gu, Seoul',
          hours: 'WED – SUN  13:00 – 19:30',
          phone: '+82 2-794-0920'
        },
        {
          name: 'GALLERIA WEST 4F POP-UP',
          addressKo: '서울특별시 강남구 압구정로 343 웨스트 4F',
          addressEn: '4F West, 343 Apgujeong-ro, Gangnam-gu, Seoul',
          hours: 'MON – SUN  10:30 – 20:00',
          phone: '+82 2-3449-4114'
        }
      ]
    },
    orders: [
      {
        id: 'VM-20261118-0412',
        userId: 'u-001',
        createdAt: '2026-11-18 14:22',
        customerName: '김서연',
        customerPhone: '010-4821-9032',
        address: '서울특별시 마포구 독막로 112, 402호',
        lang: 'ko',
        items: [
          {
            productId: 'vm-001',
            nameKo: '더블 페이스 울 싱글 발마칸 코트',
            nameEn: 'Double-Faced Wool Single Balmacaan Coat',
            size: '2 (L)',
            qty: 1,
            priceKrw: 685000,
            priceUsd: 510,
            image: './img/prod_coat.jpg'
          }
        ],
        totalKrw: 685000,
        totalUsd: 510,
        status: '배송완료',
        returnRequest: null
      },
      {
        id: 'VM-20261115-0389',
        userId: 'u-002',
        createdAt: '2026-11-15 10:08',
        customerName: '박도윤',
        customerPhone: '010-7723-1140',
        address: '서울특별시 강남구 논현로 151길 28, 301호',
        lang: 'ko',
        items: [
          {
            productId: 'vm-003',
            nameKo: '엑스트라파인 메리노 헤비 리브 가디건',
            nameEn: 'Extrafine Merino Heavy Rib Cardigan',
            size: '1 (M)',
            qty: 1,
            priceKrw: 298000,
            priceUsd: 225,
            image: './img/prod_knit.jpg'
          }
        ],
        totalKrw: 298000,
        totalUsd: 225,
        status: '교환요청',
        returnRequest: {
          type: 'EXCHANGE',
          reasonCode: 'SIZE',
          reasonLabel: '사이즈 변경 (1(M) → 2(L))',
          detail: '어깨가 조금 타이트해 2(L) 사이즈로 교환 요청합니다.',
          feeKrw: 6000,
          feeUsd: 25,
          payMethod: 'CARD_INSTANT',
          payMethodLabel: '신용/체크카드 즉시 결제',
          payStatus: 'PAID',
          requestedAt: '2026-11-17 16:40',
          adminStatus: '접수대기'
        }
      },
      {
        id: 'VM-20261112-0351',
        userId: 'u-003',
        createdAt: '2026-11-12 19:45',
        customerName: '이현우',
        customerPhone: '010-9104-5521',
        address: '경기도 성남시 분당구 판교역로 235, 1104호',
        lang: 'ko',
        items: [
          {
            productId: 'vm-002',
            nameKo: '브러시드 울 M65 필드 재킷',
            nameEn: 'Brushed Wool M65 Field Jacket',
            size: '2 (L)',
            qty: 1,
            priceKrw: 495000,
            priceUsd: 370,
            image: './img/prod_jacket.jpg'
          },
          {
            productId: 'vm-006',
            nameKo: '더블 플리츠 와이드 울 트라우저',
            nameEn: 'Double-Pleated Wide Wool Trousers',
            size: '2 (32)',
            qty: 1,
            priceKrw: 278000,
            priceUsd: 210,
            image: './img/editorial_wide_1.jpg'
          }
        ],
        totalKrw: 773000,
        totalUsd: 580,
        status: '배송중',
        returnRequest: null
      }
    ],
    cart: [
      {
        productId: 'vm-004',
        size: '2 (L)',
        qty: 1
      }
    ]
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function migrateState(parsed) {
    let dirty = false;
    if (!Array.isArray(parsed.users) || parsed.users.length === 0) {
      parsed.users = clone(DEFAULT_USERS);
      dirty = true;
    }
    if (Array.isArray(parsed.orders)) {
      const nameToId = { 김서연: 'u-001', 박도윤: 'u-002', 이현우: 'u-003' };
      parsed.orders.forEach((o) => {
        if (!o.userId && nameToId[o.customerName]) {
          o.userId = nameToId[o.customerName];
          dirty = true;
        }
      });
    }
    if (dirty) save(parsed);
    return parsed;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seed = clone(DEFAULT_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.products)) {
        const seed = clone(DEFAULT_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      return migrateState(parsed);
    } catch (e) {
      return clone(DEFAULT_DATA);
    }
  }

  function save(nextState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (e) {
      console.warn('VERMANT storage save warning:', e);
    }
    return nextState;
  }

  function reset() {
    const seed = clone(DEFAULT_DATA);
    save(seed);
    return seed;
  }

  /* ---------- Session Helpers ---------- */
  function readSession(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.userId) return null;
      const state = load();
      const user = (state.users || []).find((u) => u.id === parsed.userId);
      if (!user || user.status === '정지') {
        localStorage.removeItem(key);
        return null;
      }
      return user;
    } catch (e) {
      return null;
    }
  }

  function writeSession(key, user) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ userId: user.id, email: user.email, loggedInAt: nowStamp() })
      );
    } catch (e) {}
  }

  function clearSessionKey(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  async function authenticate(email, password, requireAdmin) {
    const state = load();
    const normEmail = String(email || '').trim().toLowerCase();
    const user = (state.users || []).find((u) => u.email.toLowerCase() === normEmail);
    if (!user) return { ok: false, code: 'NOT_FOUND' };
    if (user.status === '정지') return { ok: false, code: 'SUSPENDED' };
    if (requireAdmin && user.role !== 'ADMIN') return { ok: false, code: 'FORBIDDEN' };

    const hash = await hashPassword(password);
    if (user.passwordHash !== hash) return { ok: false, code: 'WRONG_PASSWORD' };

    writeSession(requireAdmin ? ADMIN_SESSION_KEY : MEMBER_SESSION_KEY, user);
    return { ok: true, user };
  }

  async function registerMember(payload) {
    const state = load();
    const email = String(payload.email || '').trim().toLowerCase();
    const name = String(payload.name || '').trim();
    const password = String(payload.password || '');
    const phone = String(payload.phone || '').trim();
    const address = String(payload.address || '').trim();

    if (!email || !name || password.length < 6) {
      return { ok: false, code: 'INVALID_INPUT' };
    }
    const exists = (state.users || []).some((u) => u.email.toLowerCase() === email);
    if (exists) {
      return { ok: false, code: 'DUPLICATE_EMAIL' };
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: 'u-' + Date.now().toString().slice(-6),
      email,
      passwordHash,
      name,
      phone,
      address,
      role: 'MEMBER',
      grade: 'STANDARD',
      status: '활성',
      createdAt: nowStamp()
    };

    state.users.unshift(newUser);
    save(state);
    writeSession(MEMBER_SESSION_KEY, newUser);
    return { ok: true, user: newUser };
  }

  function formatPrice(krw, usd, lang) {
    if (lang === 'en') {
      const val = Number(usd || Math.round((krw || 0) / 1350));
      return '$' + val.toLocaleString('en-US');
    }
    const val = Number(krw || 0);
    return '₩' + val.toLocaleString('ko-KR');
  }

  function formatNumber(n) {
    return Number(n || 0).toLocaleString('ko-KR');
  }

  function nowStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return (
      d.getFullYear() +
      '-' +
      pad(d.getMonth() + 1) +
      '-' +
      pad(d.getDate()) +
      ' ' +
      pad(d.getHours()) +
      ':' +
      pad(d.getMinutes())
    );
  }

  function generateOrderId() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `VM-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rand}`;
  }

  function subscribe(callback) {
    window.addEventListener('storage', function (ev) {
      if (
        ev.key === STORAGE_KEY ||
        ev.key === MEMBER_SESSION_KEY ||
        ev.key === ADMIN_SESSION_KEY
      ) {
        callback(load());
      }
    });
  }

  global.VermantStore = {
    STORAGE_KEY,
    IMAGE_PRESETS,
    load,
    save,
    reset,
    hashPassword,
    authenticate,
    registerMember,
    getMemberSession: () => readSession(MEMBER_SESSION_KEY),
    setMemberSession: (u) => writeSession(MEMBER_SESSION_KEY, u),
    clearMemberSession: () => clearSessionKey(MEMBER_SESSION_KEY),
    getAdminSession: () => readSession(ADMIN_SESSION_KEY),
    setAdminSession: (u) => writeSession(ADMIN_SESSION_KEY, u),
    clearAdminSession: () => clearSessionKey(ADMIN_SESSION_KEY),
    formatPrice,
    formatNumber,
    nowStamp,
    generateOrderId,
    subscribe
  };
})(window);
