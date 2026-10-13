window.onload = () => {
    // ----------------------------------------------------------------
    // DOM ELEMEK
    // ----------------------------------------------------------------
    const $ = (id) => document.getElementById(id);
    const container = $('scene-container');
    const searchInput = $('searchInput');
    const modal = $('modal');
    const closeBtn = document.querySelector('.close-btn');
    const hamburgerBtn = $('hamburgerBtn');
    const navLinks = $('navLinks');
    const mobileWarningModal = $('mobileWarningModal');
    const closeWarningBtn = $('closeWarningBtn');
    const clearSearchBtn = $('clearSearchBtn');

    // Modal részletek
    const readMoreBtn = $('readMoreBtn');
    const modalDetailsContainer = $('modal-details-container');
    const modalDetailsText = $('modal-details-text');
    const modalCategory = $('modal-category');
    const modalBadges = $('modal-badges');
    const modalStats = $('modal-stats');
    const modalWebsite = $('modal-website');
    const starContainer = $('starContainer');
    const ratingPrompt = $('ratingPrompt');
    const ratingStats = $('ratingStats');

    // Szűrő
    const filterToggleBtn = $('filterToggleBtn');
    const filterModal = $('filterModal');
    const closeFilterBtn = $('closeFilterBtn');
    const resetFilterBtn = $('resetFilterBtn');
    const categoryChips = document.querySelectorAll('.filter-chip[data-category]');
    const specialChips = document.querySelectorAll('.filter-chip[data-special]');

    // Felfedező sáv & Gyorsszűrők
    const discoverBar = $('discoverBar');
    const dList = $('discoverList');
    const dTabs = document.querySelectorAll('.dtab'); // mind asztali és mobil fül
    const randomBtn = $('randomBtn');
    const mobileRandomBtn = $('mobileRandomBtn');
    const resultInfo = $('resultInfo');
    const toastEl = $('toast');

    const WARNING_SEEN_KEY = 'mobileWarningSeen';

    // ----------------------------------------------------------------
    // KONFIGURÁCIÓ ÉS VÁLTOZÓK
    // ----------------------------------------------------------------
    let draggedItem = null;
    const dragDistanceThreshold = 5;
    let dragStartX = 0, dragStartY = 0, dragOffsetX = 0, dragOffsetY = 0;
    let topZIndex = 50;

    const PADDING_PERCENTAGE_X = 2;
    const PADDING_PERCENTAGE_Y = 2;
    const DESKTOP_MAX_SPEED = 0.08;
    const MOBILE_BREAKPOINT = 768;
    const MOBILE_MAX_SPEED = 0.03;
    const DAY = 864e5;
    const NEW_DAYS = 7;

    let maxSpeed = DESKTOP_MAX_SPEED;
    let isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;
    let cardSize = 120;
    let premiumSize = 152;
    let navHeight = 70;
    let cachedBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    // Keresés és Szűrés állapot
    let filterState = {
        searchTerm: '',
        tokens: [],
        activeCategory: null, 
        special: null         
    };

    // ADATOK
    const items = [
        { 
            id: 1, name: "Nike", img: "img/l1.png", category: "fashion",
            desc: "A Nike Inc. egy amerikai multinacionális vállalat, amely cipők, ruházati cikkek, sportfelszerelések és kiegészítők tervezésével, fejlesztésével és gyártásával foglalkozik. Küldetésük az inspiráció és innováció eljuttatása minden sportolóhoz a világon." 
        },
        { 
            id: 2, name: "McDonald's", img: "img/l2.png", category: "food",
            desc: "A világ vezető gyorséttermi lánca, több mint 100 országban van jelen. Folyamatosan fejleszti éttermi élményét és globális ellátási láncát a fenntarthatóság jegyében." 
        },
        { 
            id: 3, name: "Apple", img: "img/l3.png", category: "tech",
            desc: "Az Apple Inc. technológiai vállalat, amely fogyasztói elektronikát, számítógépes szoftvereket és online szolgáltatásokat fejleszt. Innovációjuk kulcsa a felhasználói élmény tökéletesítése." 
        },
        { 
            id: 4, name: "Mercedes-Benz", img: "img/l4.png", category: "auto",
            desc: "A Mercedes-Benz német prémium autómárka, amely a luxus, a biztonság és a fejlett technológia szinonimája. Jelenleg nagy hangsúlyt fektetnek az elektromos járművek fejlesztésére." 
        },
        { 
            id: 5, name: "Coca-Cola", img: "img/l5.png", category: "food",
            desc: "A Coca-Cola Company a világ egyik legnagyobb italgyártója, termékeit több mint 200 országban értékesítik. Elkötelezettek a fenntartható csomagolási megoldások iránt." 
        },
        { 
            id: 6, name: "Microsoft", img: "img/l6.png", category: "tech",
            desc: "A Microsoft globális technológiai vállalat, amely szoftverek, fogyasztói elektronikai eszközök, személyi számítógépek és szolgáltatások fejlesztésével foglalkozik. Fő fókuszban a felhőszolgáltatások (Azure) állnak." 
        },
        { 
            id: 7, name: "Amazon", img: "img/l7.png", category: "tech",
            desc: "Az Amazon.com a világ egyik legnagyobb e-kereskedelmi vállalata és felhőszolgáltatója (AWS). Céljuk a vevőközpontúság, az innováció és az operatív kiválóság." 
        },
        { 
            id: 8, name: "X", img: "img/l8.png", category: "social",
            desc: "Az X (korábban Twitter) egy globális közösségi média platform, amely rövid üzenetek megosztására épül. Fontos szerepet játszik a valós idejű kommunikációban és hírek terjesztésében." 
        },
        { 
            id: 9, name: "Ikea", img: "img/l9.png", category: "home",
            desc: "Az IKEA svéd multinacionális vállalat, amely megfizethető és praktikus bútorokat, lakberendezési cikkeket és kiegészítőket kínál. Fenntarthatósági törekvéseik középpontjában az újrahasznosítás és a környezetbarát anyagok állnak." 
        },
        { 
            id: 10, name: "Jysk", img: "img/l10.png", category: "home",
            desc: "A JYSK dán kiskereskedelmi lánc, amely bútorokat, matracokat, lakberendezési cikkeket és háztartási kiegészítőket kínál. Több mint 50 országban van jelen." 
        },
        { 
            id: 11, name: "Adidas", img: "img/l11.png", category: "fashion",
            desc: "Az Adidas német sportszergyártó, amely cipőket, ruházatot és kiegészítőket gyárt. Innovációik középpontjában a sportteljesítmény növelése és a fenntarthatóság áll." 
        },
        { 
            id: 12, name: "Zalando", img: "img/l12.png", category: "fashion",
            desc: "A Zalando egy berlini központú, vezető európai online divat- és életmódplatform, amely ruházatot, cipőket, kiegészítőket és szépségápolási termékeket kínál több millió vásárlónak." 
        },
        { 
            id: 13, name: "Telekom", img: "img/l13.png", category: "tech",
            desc: "A Deutsche Telekom AG európai telekommunikációs vállalat, amely mobil- és vezetékes szolgáltatásokat, valamint digitális megoldásokat kínál. Több országban működik leányvállalatokon keresztül." 
        },
        { 
            id: 14, name: "Samsung", img: "img/l14.png", category: "tech",
            desc: "A Samsung dél-koreai multinacionális elektronikai vállalat. Kínálatukban mobiltelefonok, televíziók, háztartási gépek és félvezetők találhatók. Erős kutatás-fejlesztési bázissal rendelkeznek." 
        },
        { 
            id: 15, name: "Instagram", img: "img/l15.png", category: "social",
            desc: "Az Instagram a Meta Platforms tulajdonában lévő közösségi média alkalmazás, amely fotók és videók megosztására épül. Világszerte több százmillió aktív felhasználóval rendelkezik." 
        },
        { 
            id: 16, name: "Tesla", img: "img/l16.png", category: "auto",
            desc: "A Tesla Inc. amerikai autógyártó és energiatechnológiai vállalat, amely az elektromos járművek és a megújuló energia megoldások úttörője. Küldetésük a fenntartható közlekedés előmozdítása." 
        },
        { 
            id: 17, name: "Ford", img: "img/l17.png", category: "auto",
            desc: "A Ford Motor Company amerikai autógyártó, amely több mint egy évszázada gyárt járműveket. Innovációik középpontjában az elektromos járművek és az automatizált vezetési technológiák állnak." 
        },
        { 
            id: 18, name: "Ferrari", img: "img/l18.png", category: "auto",
            desc: "Az olasz Ferrari luxus sportautógyártó, amely a sebesség, a teljesítmény és az exkluzivitás szimbóluma. Versenypályán és közúton egyaránt ikonikus márka." 
        },
        { 
            id: 19, name: "Google", img: "img/l19.png", category: "tech",
            desc: "A Google a világ legnépszerűbb keresőmotorját üzemelteti, emellett vezető szerepet tölt be az MI, a felhőalapú számítástechnika és az okostelefon-operációs rendszerek terén." 
        },
        { 
            id: 20, name: "Red-Bull", img: "img/l20.png", category: "food",
            desc: "Az osztrák Red Bull energiaital-gyártó vállalat, amely a 'Red Bull szárnyakat ad' szlogennel vált világhírűvé. Jelentős szereplő a sport- és extrémsport szponzorációban." 
        },
        { 
            id: 21, name: "Szentkirályi", img: "img/l21.png", category: "food",
            desc: "Magyar ásványvíz márka, amely természetes forrásból származó, prémium minőségű ásványvizet kínál." 
        },
        { 
            id: 22, name: "Zwack", img: "img/l22.png", category: "food",
            desc: "Magyar italgyártó vállalat, legismertebb terméke az Unicum gyógynövénylikőr." 
        },
        { 
            id: 23, name: "Heineken", img: "img/l23.png", category: "food",
            desc: "Holland sörgyártó vállalat, világszerte ismert prémium lager söreiről." 
        },
        { 
            id: 24, name: "Jack Daniels", img: "img/l24.png", category: "food",
            desc: "Amerikai whiskey márka, híres Tennessee whiskey-jéről és ikonikus fekete címkéjéről." 
        },
        { 
            id: 25, name: "OMV", img: "img/l25.png", category: "auto",
            desc: "Osztrák olaj- és gázipari vállalat, amely üzemanyag-ellátással és energiatermeléssel foglalkozik." 
        },
        { 
            id: 26, name: "MOL", img: "img/l26.png", category: "auto",
            desc: "Magyar olaj- és gázipari vállalat, amely Közép- és Kelet-Európa egyik vezető energiaipari szereplője." 
        },
        { 
            id: 27, name: "Shell", img: "img/l27.png", category: "auto",
            desc: "Globális energiavállalat, amely olaj-, gáz- és megújuló energiaforrásokkal foglalkozik." 
        },
        { 
            id: 28, name: "Turkish Airlines", img: "img/l28.png", category: "auto",
            desc: "Török nemzeti légitársaság, amely több mint 300 célállomásra repül világszerte." 
        },
        { 
            id: 29, name: "Petronas", img: "img/l29.png", category: "auto",
            desc: "Malajziai állami olaj- és gázipari vállalat, amely a Formula–1 szponzorációjáról is ismert." 
        },
        { 
            id: 30, name: "Michelin", img: "img/l30.png", category: "auto",
            desc: "Francia gumiabroncs-gyártó, híres a Michelin Guide éttermi értékeléseiről is." 
        },
        { 
            id: 31, name: "Bridgestone", img: "img/l31.png", category: "auto",
            desc: "Japán gumiabroncs- és autóipari termékgyártó, a világ egyik legnagyobb abroncsgyártója." 
        },
        { 
            id: 32, name: "Nestlé", img: "img/l32.png", category: "food",
            desc: "Svájci multinacionális élelmiszeripari vállalat, amely kávét, csokoládét, tejtermékeket és bébiételeket gyárt." 
        },
        { 
            id: 33, name: "TikTok", img: "img/l33.png", category: "social",
            desc: "Kínai közösségi média platform, amely rövid videók megosztására épül." 
        },
        { 
            id: 34, name: "Facebook", img: "img/l34.png", category: "social",
            desc: "Meta Platforms közösségi hálózata, amely világszerte több milliárd felhasználót kapcsol össze." 
        },
        { 
            id: 35, name: "Hugo Boss", img: "img/l35.png", category: "fashion",
            desc: "Német divatmárka, amely prémium férfi és női ruházatot, parfümöket és kiegészítőket kínál." 
        },
        { 
            id: 36, name: "Louis Vuitton", img: "img/l36.png", category: "fashion",
            desc: "Francia luxus divatmárka, híres bőrtáskáiról, ruházatáról és kiegészítőiről." 
        },
        { 
            id: 37, name: "Ralph Lauren", img: "img/l37.png", category: "fashion",
            desc: "Amerikai divatmárka, amely elegáns ruházatot, parfümöket és lakberendezési cikkeket kínál." 
        },
        { 
            id: 38, name: "Xbox", img: "img/l38.png", category: "tech",
            desc: "A Microsoft videojáték-konzol márkája, amely világszerte népszerű a gamerek körében." 
        },
        { 
            id: 39, name: "PlayStation", img: "img/l39.png", category: "tech",
            desc: "A Sony videojáték-konzol márkája, amely a modern gaming egyik vezető platformja." 
        },
        { 
            id: 40, name: "Nvidia", img: "img/l40.png", category: "tech",
            desc: "Amerikai technológiai vállalat, amely grafikus processzorokat (GPU) és mesterséges intelligencia megoldásokat fejleszt." 
        },
        { 
            id: 41, name: "Intel", img: "img/l41.png", category: "tech",
            desc: "Amerikai félvezetőgyártó, processzorokat és chipkészleteket gyárt számítógépekhez és adatközpontokhoz." 
        },
        { 
            id: 42, name: "AMD", img: "img/l42.png", category: "tech",
            desc: "Amerikai félvezetőgyártó, amely CPU-kat és GPU-kat fejleszt, versenytársa az Intelnek és Nvidiának." 
        },
        { 
            id: 43, name: "Razer", img: "img/l43.png", category: "tech",
            desc: "Amerikai-szingapúri gamer márka, amely perifériákat, laptopokat és kiegészítőket gyárt." 
        },
        { 
            id: 44, name: "Suzuki", img: "img/l44.png", category: "auto",
            desc: "Japán autó- és motorgyártó vállalat, amely kompakt járműveiről és motorjairól ismert." 
        },
        { 
            id: 45, name: "Burger King", img: "img/l45.png", category: "food",
            desc: "Amerikai gyorsétteremlánc, híres Whopper szendvicséről." 
        },
        { 
            id: 46, name: "Toyota", img: "img/l46.png", category: "auto",
            desc: "Japán autógyártó, a hibrid járművek úttörője és a világ egyik legnagyobb autógyártója." 
        },
        { 
            id: 47, name: "VW", img: "img/l47.png", category: "auto",
            desc: "A Volkswagen német autógyártó, amely ikonikus modelleket, például a Golfot és a Beetle-t gyártja." 
        },
        { 
            id: 48, name: "OTP", img: "img/l48.png", category: "tech",
            desc: "Magyar bankcsoport, amely Közép- és Kelet-Európában nyújt pénzügyi szolgáltatásokat." 
        },
        { 
            id: 49, name: "Raiffeisen", img: "img/l49.png", category: "tech",
            desc: "Osztrák bankcsoport, amely nemzetközi pénzügyi szolgáltatásokat kínál." 
        },
        { 
            id: 50, name: "Erste", img: "img/l50.png", category: "tech",
            desc: "Osztrák bankcsoport, amely Közép-Európában nyújt lakossági és vállalati pénzügyi szolgáltatásokat." 
        },
        { 
            id: 51, name: "YouTube", img: "img/l51.png", category: "social",
            desc: "A Google tulajdonában lévő videómegosztó platform, amely világszerte a legnépszerűbb online videós szolgáltatás." 
        },
        { 
            id: 52, name: "BMW", img: "img/l52.png", category: "auto",
            desc: "Német prémium autógyártó, amely a sportos elegancia és a fejlett technológia szinonimája." 
        },
        { 
            id: 53, name: "Rolls-Royce", img: "img/l53.png", category: "auto",
            desc: "Brit luxusautógyártó, amely ikonikus, kézzel készített járműveiről ismert." 
        },
        { 
            id: 54, name: "Netflix", img: "img/l54.png", category: "social",
            desc: "Globális streaming szolgáltató, amely filmek, sorozatok és dokumentumfilmek széles választékát kínálja." 
        },
        { 
            id: 55, name: "Walt Disney", img: "img/l55.png", category: "social",
            desc: "Amerikai szórakoztatóipari óriás, amely filmeket, animációkat, vidámparkokat és médiatartalmakat kínál." 
        },
        { 
            id: 56, name: "SAP", img: "img/l56.png", category: "tech",
            desc: "Német szoftvervállalat, amely vállalatirányítási rendszereket és üzleti megoldásokat fejleszt." 
        },
        { 
            id: 57, name: "Visa", img: "img/l57.png", category: "tech",
            desc: "Globális pénzügyi szolgáltató, amely elektronikus fizetési megoldásokat és bankkártyákat kínál." 
        },
        { 
            id: 58, name: "MasterCard", img: "img/l58.png", category: "tech",
            desc: "Nemzetközi pénzügyi szolgáltató, amely bankkártyás fizetési rendszereket működtet." 
        },
        { 
            id: 59, name: "Cisco", img: "img/l59.png", category: "tech",
            desc: "Amerikai technológiai vállalat, amely hálózati berendezéseket és digitális infrastruktúrát fejleszt." 
        },
        { 
            id: 60, name: "Caterpillar", img: "img/l60.png", category: "auto",
            desc: "Amerikai ipari vállalat, amely nehézgépeket, építőipari berendezéseket és motorokat gyárt." 
        },
        { 
            id: 61, name: "Bosch", img: "img/l61.png", category: "tech",
            desc: "Német multinacionális vállalat, amely autóipari alkatrészeket, háztartási gépeket és ipari technológiákat gyárt." 
        },
        { 
            id: 62, name: "Liebherr", img: "img/l62.png", category: "auto",
            desc: "Német ipari vállalat, amely építőipari gépeket, darukat és háztartási berendezéseket gyárt." 
        },
        { 
            id: 63, name: "L'Oréal", img: "img/l63.png", category: "fashion",
            desc: "Francia kozmetikai óriás, amely szépségápolási termékeket és hajápolási megoldásokat kínál." 
        },
        { 
            id: 64, name: "Airbus", img: "img/l64.png", category: "auto",
            desc: "Európai repülőgépgyártó vállalat, amely kereskedelmi és katonai repülőgépeket fejleszt." 
        },
        { 
            id: 65, name: "HSBC", img: "img/l65.png", category: "tech",
            desc: "Brit multinacionális bank, amely globális pénzügyi szolgáltatásokat kínál." 
        },
        { 
            id: 66, name: "Rolex", img: "img/l66.png", category: "fashion",
            desc: "Svájci luxusóra márka, amely ikonikus presztízsóráiról ismert." 
        },
        { 
            id: 67, name: "Hublot", img: "img/l67.png", category: "fashion",
            desc: "Svájci luxusóra márka, amely innovatív dizájnjáról és sportos stílusáról híres." 
        },
        { 
            id: 68, name: "Omega", img: "img/l68.png", category: "fashion",
            desc: "Svájci óragyártó, amely a precíziós időmérés és az űrkutatás szimbóluma." 
        },
        { 
            id: 69, name: "Breitling", img: "img/l69.png", category: "fashion",
            desc: "Svájci óragyártó, amely pilótaóráiról és sportos kronográfjairól ismert." 
        },
        { 
            id: 70, name: "Patek Philippe", img: "img/l70.png", category: "fashion",
            desc: "Svájci luxusóra márka, amely kézzel készített, exkluzív időmérőket gyárt." 
        },
        { 
            id: 71, name: "Tag Heuer", img: "img/l71.png", category: "fashion",
            desc: "Svájci óragyártó, amely sportos kronográfjairól és innovatív dizájnjáról híres." 
        },
        { 
            id: 72, name: "Prada", img: "img/l72.png", category: "fashion",
            desc: "Olasz luxus divatmárka, amely táskákat, ruházatot és kiegészítőket kínál." 
        },
        { 
            id: 73, name: "Armani", img: "img/l73.png", category: "fashion",
            desc: "Olasz divatmárka, amely elegáns ruházatot, parfümöket és kiegészítőket kínál." 
        },
        { 
            id: 74, name: "Porsche", img: "img/l74.png", category: "auto",
            desc: "Német autógyártó, amely sportautóiról és prémium járműveiről ismert." 
        },
        { 
            id: 75, name: "Bentley", img: "img/l75.png", category: "auto",
            desc: "Brit luxusautógyártó, amely exkluzív, kézzel készített járműveket gyárt." 
        },
        { 
            id: 76, name: "Gucci", img: "img/l76.png", category: "fashion",
            desc: "Olasz luxus divatmárka, amely ikonikus táskáiról, cipőiről és ruházatáról híres." 
        },
        { 
            id: 77, name: "Dior", img: "img/l77.png", category: "fashion",
            desc: "Francia luxus divatmárka, amely haute couture ruházatot, parfümöket és kiegészítőket kínál." 
        },
        { 
            id: 78, name: "Versace", img: "img/l78.png", category: "fashion",
            desc: "Olasz divatmárka, amely extravagáns stílusáról és ikonikus mintáiról ismert." 
        }
    ];

    const META = {
        premium: [3, 16, 20, 66, 76],                       
        newDaysAgo: { 21: 0, 22: 1, 48: 2, 26: 4, 43: 6 }, 
        baseOpens: { 3: 128, 19: 120, 16: 97, 1: 85, 2: 80, 54: 72, 40: 66, 76: 58, 20: 55, 5: 50, 14: 44, 36: 41 }
    };

    const categoryNames = {
        tech: "Technológia",
        auto: "Autóipar",
        food: "Étel & Ital",
        fashion: "Divat & Sport",
        home: "Otthon & Bútor",
        social: "Közösségi Média"
    };

    items.forEach(it => {
        it.premium = META.premium.includes(it.id);
        if (it.id in META.newDaysAgo) it.addedAt = Date.now() - META.newDaysAgo[it.id] * DAY;
        it.baseOpens = META.baseOpens[it.id] || 0;
    });

    // TÁROLÁS
    const LS = {
        get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
    };
    const companies = LS.get('bu_companies', []);
    const opens = LS.get('bu_opens', {});
    const ratings = LS.get('bu_ratings', {}); // itemId -> { totalScore, count, userRatings: { email: score } }

    companies.forEach(c => items.push({
        id: c.id, name: c.name, img: c.logo, category: c.category, desc: c.desc,
        website: c.website, addedAt: c.addedAt, baseOpens: 0, premium: false, registered: true
    }));

    // SEGÉDEK
    const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const isNew = (it) => !!it.addedAt && (Date.now() - it.addedAt) < NEW_DAYS * DAY;
    const totalOpens = (it) => (it.baseOpens || 0) + (opens[it.id] || 0);
    const topItems = (n) => [...items].sort((a, b) => totalOpens(b) - totalOpens(a)).slice(0, n);
    const safeUrl = (u) => {
        if (!u) return '';
        try {
            const x = new URL(/^[a-z][a-z0-9+.-]*:/i.test(u) ? u : 'https://' + u);
            return /^https?:$/.test(x.protocol) ? x.href : '';
        } catch (e) { return ''; }
    };
    const placeholder = (n) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70"><rect width="70" height="70" rx="14" fill="#383838"/><text x="35" y="46" font-size="32" text-anchor="middle" fill="#4fc3f7" font-family="sans-serif">${(String(n || '?').trim().charAt(0).toUpperCase()).replace(/[<>&"']/g, '?')}</text></svg>`);
    const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

    let toastTimer;
    function showToast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('active');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('active'), 5000);
    }

    // Élmény / Részecske hatás értékeléskor (3. pont)
    function ratingParticleEffect(targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        const colors = ['#ffd54f', '#ffca28', '#ffe082', '#fff176', '#4fc3f7'];
        
        for (let i = 0; i < 7; i++) {
            const p = el('div', 'rating-particle');
            const angle = (Math.random() * Math.PI) - (Math.PI / 2); // felfelé irány
            const distance = 40 + Math.random() * 60;
            const dx = Math.cos(angle) * distance;
            const dy = -Math.sin(angle) * distance - 20;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            p.style.cssText = `left:${startX}px; top:${startY}px; background:${color}; --dx:${dx}px; --dy:${dy}px;`;
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1000);
        }
    }

    function confetti() {
        const colors = ['#4fc3f7', '#ffd54f', '#81c784', '#f06292', '#ba68c8'];
        for (let i = 0; i < 40; i++) {
            const p = el('i', 'confetti');
            const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 260;
            p.style.cssText = `left:50%;top:45%;background:${colors[i % 5]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d + 120}px;--rot:${Math.random() * 720}deg`;
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1600);
        }
    }

    // MOBIL ÁLLAPOT, MÉRETEK
    const cardElements = [];

    function checkMobileState() {
        isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;
        if (isMobileView) {
            maxSpeed = MOBILE_MAX_SPEED;
            let seen = null;
            try { seen = localStorage.getItem(WARNING_SEEN_KEY); } catch (e) { }
            if (!seen) setTimeout(() => mobileWarningModal.classList.add('active'), 1000);
        } else {
            maxSpeed = DESKTOP_MAX_SPEED;
            mobileWarningModal.classList.remove('active');
        }
    }

    closeWarningBtn.addEventListener('click', () => {
        mobileWarningModal.classList.remove('active');
        try { localStorage.setItem(WARNING_SEEN_KEY, 'true'); } catch (e) { }
    });

    function updateBounds() {
        const w = window.innerWidth, h = window.innerHeight;
        cardSize = isMobileView ? 90 : 120;
        premiumSize = Math.round(cardSize * 1.27);
        navHeight = Math.round(discoverBar.getBoundingClientRect().bottom) || 70;
        cachedBounds.minX = (w * PADDING_PERCENTAGE_X / 100);
        cachedBounds.maxX = w - (w * PADDING_PERCENTAGE_X / 100) - cardSize;
        cachedBounds.minY = navHeight + (h * PADDING_PERCENTAGE_Y / 100);
        cachedBounds.maxY = h - (h * PADDING_PERCENTAGE_Y / 100) - cardSize;
        cardElements.forEach(c => { c.size = c.originalData.premium ? premiumSize : cardSize; });
    }
    const limX = (c) => cachedBounds.maxX - (c.size - cardSize);
    const limY = (c) => cachedBounds.maxY - (c.size - cardSize);

    function updateDimmedState() {
        const currentlyHovered = cardElements.some(c => c.isHovering);
        cardElements.forEach(item => {
            const skip = item.originalData.premium || item.element.classList.contains('filtered-out');
            if (currentlyHovered && !item.isHovering && !skip) item.element.classList.add('dimmed');
            else item.element.classList.remove('dimmed');
        });
    }

    function calculateCenteredGrid(cards) {
        const W = window.innerWidth, H = window.innerHeight, gap = 12;
        const maxSize = Math.max(...cards.map(c => c.size));
        const cell = maxSize + gap;
        const gridW = Math.min(W - 30, 900);
        const cols = Math.max(1, Math.min(Math.floor(gridW / cell), cards.length));
        const rows = Math.ceil(cards.length / cols);
        const top = navHeight + 40, availH = H - top - 16;
        const stepY = rows > 1 ? Math.max(40, Math.min(cell, (availH - maxSize) / (rows - 1))) : cell;
        const usedW = cols * cell, usedH = (rows - 1) * stepY + maxSize;
        const startX = (W - usedW) / 2, startY = top + Math.max(0, (availH - usedH) / 2);
        cards.forEach((c, i) => {
            const col = i % cols, row = Math.floor(i / cols);
            c.targetX = startX + col * cell + (cell - c.size) / 2;
            c.targetY = startY + row * stepY + (maxSize - c.size) / 2;
        });
    }

    // KÁRTYÁK LÉTREHOZÁSA
    function createCard(item, spawn) {
        const card = el('div', 'card' + (item.premium ? ' premium' : ''));
        const img = new Image();
        img.src = item.img; img.alt = item.name;
        img.onerror = () => { img.onerror = null; img.src = placeholder(item.name); };
        card.append(img, el('h3', null, item.name));
        if (item.premium) card.appendChild(el('span', 'badge-crown', '👑'));
        if (isNew(item)) card.appendChild(el('span', 'badge-new', 'ÚJ'));

        const size = item.premium ? premiumSize : cardSize;
        const data = {
            element: card, size,
            pixelX: cachedBounds.minX + Math.random() * (cachedBounds.maxX - size + cardSize - cachedBounds.minX),
            pixelY: cachedBounds.minY + Math.random() * (cachedBounds.maxY - size + cardSize - cachedBounds.minY),
            currentZ: item.premium ? 40 + Math.floor(Math.random() * 10) : Math.floor(Math.random() * 40),
            vx: ((Math.random() - 0.5) * maxSpeed * 2),
            vy: ((Math.random() - 0.5) * maxSpeed * 2),
            name: norm(item.name),
            hay: norm(item.name + ' ' + (item.desc || '') + ' ' + (categoryNames[item.category] || '')),
            originalData: item,
            isDragging: false, canClick: true, isHovering: false,
            targetX: undefined, targetY: undefined,
            spawnT: spawn ? 0 : 1
        };
        if (spawn) {
            data.pixelX = window.innerWidth / 2 - size / 2;
            data.pixelY = (window.innerHeight + navHeight) / 2 - size / 2;
            data.currentZ = ++topZIndex;
            card.classList.add('highlight');
            setTimeout(() => card.classList.remove('highlight'), 7000);
        }

        card.addEventListener('mouseenter', () => { if (!isMobileView) { data.isHovering = true; updateDimmedState(); } });
        card.addEventListener('mouseleave', () => { if (!isMobileView) { data.isHovering = false; updateDimmedState(); } });

        const startHandler = (e) => {
            if (card.classList.contains('filtered-out') || card.classList.contains('dimmed')) return;
            e.preventDefault();
            draggedItem = data;
            topZIndex++;
            draggedItem.currentZ = topZIndex;
            draggedItem.isDragging = false;
            draggedItem.canClick = true;
            const client = e.type.startsWith('touch') ? e.touches[0] : e;
            dragStartX = client.clientX; dragStartY = client.clientY;
            const r = card.getBoundingClientRect();
            dragOffsetX = client.clientX - r.left;
            dragOffsetY = client.clientY - r.top;
        };
        card.addEventListener('mousedown', startHandler);
        card.addEventListener('touchstart', startHandler, { passive: false });
        cardElements.push(data);
        container.appendChild(card);
        return data;
    }

    checkMobileState();
    updateBounds();
    items.forEach(item => createCard(item, false));

    function handleMove(e) {
        if (!draggedItem) return;
        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
        if (!draggedItem.isDragging) {
            if (Math.abs(clientX - dragStartX) > dragDistanceThreshold || Math.abs(clientY - dragStartY) > dragDistanceThreshold) {
                draggedItem.isDragging = true; draggedItem.canClick = false;
                draggedItem.element.classList.add('dragging');
            }
        }
        if (draggedItem.isDragging) {
            draggedItem.pixelX = Math.max(cachedBounds.minX, Math.min(limX(draggedItem), clientX - dragOffsetX));
            draggedItem.pixelY = Math.max(cachedBounds.minY, Math.min(limY(draggedItem), clientY - dragOffsetY));
        }
    }

    function handleEnd() {
        if (!draggedItem) return;
        if (draggedItem.canClick && !draggedItem.isDragging) openModal(draggedItem.originalData);
        if (draggedItem.isDragging) {
            draggedItem.element.classList.remove('dragging');
            draggedItem.vx = (Math.random() - 0.5) * maxSpeed;
            draggedItem.vy = (Math.random() - 0.5) * maxSpeed;
        }
        draggedItem = null;
    }

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    const easeOutBack = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

    function animate() {
        const isFiltering = filterState.tokens.length > 0 || filterState.activeCategory !== null || filterState.special !== null;

        cardElements.forEach(item => {
            const hidden = item.element.classList.contains('filtered-out');
            if (isFiltering && item.targetX !== undefined) {
                item.pixelX += (item.targetX - item.pixelX) * 0.15;
                item.pixelY += (item.targetY - item.pixelY) * 0.15;
                item.vx = 0; item.vy = 0;
            } else if (!hidden && !item.isDragging) {
                const mx = limX(item), my = limY(item);
                let nextX = item.pixelX + item.vx, nextY = item.pixelY + item.vy;
                if (nextX < cachedBounds.minX || nextX > mx) item.vx *= -1;
                if (nextY < cachedBounds.minY || nextY > my) item.vy *= -1;
                item.pixelX = Math.max(cachedBounds.minX, Math.min(mx, nextX));
                item.pixelY = Math.max(cachedBounds.minY, Math.min(my, nextY));
            }

            let scale = hidden ? 0 : 1;
            if (item.spawnT < 1) {
                item.spawnT = Math.min(1, item.spawnT + 0.03);
                if (!hidden) scale = easeOutBack(item.spawnT);
            }
            item.element.style.zIndex = item.currentZ;
            item.element.style.transform = `translate3d(${item.pixelX}px, ${item.pixelY}px, 0px) scale(${scale})`;
        });
        requestAnimationFrame(animate);
    }
    animate();

    // KERESÉS ÉS SZŰRÉS (1. pont: szűrés törlése után újraindulnak)
    function filterItems() {
        const { tokens, activeCategory: cat, special } = filterState;
        const isAnyFilterActive = tokens.length > 0 || cat !== null || special !== null;
        const topIds = new Set(topItems(10).map(i => i.id));
        const matching = [];

        clearSearchBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
        filterToggleBtn.classList.toggle('active', cat !== null || special !== null);

        cardElements.forEach(item => {
            const o = item.originalData;
            const ok = tokens.every(t => item.hay.includes(t))
                && (cat === null || o.category === cat)
                && (special !== 'new' || isNew(o))
                && (special !== 'premium' || o.premium)
                && (special !== 'popular' || topIds.has(o.id));
            item.element.classList.remove('premium-bg');
            if (ok) {
                item.element.classList.remove('filtered-out');
                matching.push(item);
            } else {
                item.targetX = undefined; item.targetY = undefined;
                if (o.premium && isAnyFilterActive) {
                    item.element.classList.remove('filtered-out');
                    item.element.classList.add('premium-bg');
                } else item.element.classList.add('filtered-out');
            }
        });

        if (isAnyFilterActive && matching.length > 0) {
            matching.sort((a, b) => (b.originalData.premium ? 1 : 0) - (a.originalData.premium ? 1 : 0));
            calculateCenteredGrid(matching);
        } else if (!isAnyFilterActive) {
            // Ha nincsen aktív szűrés, a célpozíciók törlődnek, így a kártyák újra útnak indulnak
            cardElements.forEach(i => { 
                i.targetX = undefined; 
                i.targetY = undefined;
                // Adjunk nekik új sebességet is, hogy biztosan elinduljanak
                i.vx = ((Math.random() - 0.5) * maxSpeed * 2);
                i.vy = ((Math.random() - 0.5) * maxSpeed * 2);
            });
        }

        resultInfo.classList.toggle('active', isAnyFilterActive);
        resultInfo.textContent = matching.length ? `${matching.length} találat` : 'Nincs találat – próbálj más kulcsszót';
        updateDimmedState();
    }

    searchInput.addEventListener('input', (e) => {
        const n = norm(e.target.value).trim();
        filterState.searchTerm = n;
        filterState.tokens = n.split(/\s+/).filter(Boolean);
        filterItems();
    });
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    });

    const openFilter = () => { filterModal.classList.add('active'); };
    const closeFilter = () => { filterModal.classList.remove('active'); };
    filterToggleBtn.addEventListener('click', openFilter);
    closeFilterBtn.addEventListener('click', closeFilter);
    filterModal.addEventListener('click', (e) => { if (e.target === filterModal) closeFilter(); });

    function bindChips(chips, key, attr) {
        chips.forEach(chip => chip.addEventListener('click', () => {
            const val = chip.dataset[attr];
            if (filterState[key] === val) { filterState[key] = null; chip.classList.remove('active'); }
            else { filterState[key] = val; chips.forEach(c => c.classList.remove('active')); chip.classList.add('active'); }
            filterItems();
        }));
    }
    bindChips(categoryChips, 'activeCategory', 'category');
    bindChips(specialChips, 'special', 'special');

    function resetAll(closeIt) {
        filterState.activeCategory = null; filterState.special = null;
        searchInput.value = ''; filterState.searchTerm = ''; filterState.tokens = [];
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        filterItems();
        if (closeIt) closeFilter();
    }
    resetFilterBtn.addEventListener('click', () => resetAll(true));

    // FELFEDEZŐ SÁV & GYORSZSŰRŐK (2. és 6. pont)
    let activeTab = 'popular';
    function renderDiscover() {
        let list = [];
        if (activeTab === 'popular') list = topItems(10);
        else if (activeTab === 'new') list = items.filter(isNew).sort((a, b) => b.addedAt - a.addedAt);
        else list = items.filter(i => i.premium);

        dList.replaceChildren();
        if (!list.length) dList.appendChild(el('span', 'dempty', 'Még nincs ilyen cég'));
        list.forEach((it, i) => {
            const b = el('button', 'mini' + (it.premium ? ' is-premium' : ''));
            b.type = 'button';
            const im = new Image(); im.src = it.img; im.alt = '';
            im.onerror = () => { im.onerror = null; im.src = placeholder(it.name); };
            b.append(im, el('span', null, it.name));
            if (activeTab === 'popular') b.prepend(el('em', 'rank', '#' + (i + 1)));
            if (isNew(it)) b.appendChild(el('b', 'mini-new', 'ÚJ'));
            b.addEventListener('click', () => openModal(it));
            dList.appendChild(b);
        });
    }

    // Gyorsgomb szűrés logika (2. pont)
    function applyQuickFilter(tabName) {
        activeTab = tabName;
        dTabs.forEach(x => x.classList.toggle('active', x.dataset.tab === tabName));
        renderDiscover();
        
        // Gyorsszűrő élesítése a kártyákra is:
        if (tabName === 'popular') filterState.special = 'popular';
        else if (tabName === 'new') filterState.special = 'new';
        else if (tabName === 'premium') filterState.special = 'premium';
        filterItems();

        // Ha mobilon vagyunk, zárjuk be a menüt a kiválasztás után
        if (isMobileView) {
            navLinks.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            container.style.pointerEvents = 'all';
        }
    }

    dTabs.forEach(t => t.addEventListener('click', () => {
        applyQuickFilter(t.dataset.tab);
    }));

    // Kártyák újrakeverése (6. pont)
    function shuffleCards() {
        cardElements.forEach(item => {
            if (!item.element.classList.contains('filtered-out')) {
                item.pixelX = cachedBounds.minX + Math.random() * (cachedBounds.maxX - item.size + cardSize - cachedBounds.minX);
                item.pixelY = cachedBounds.minY + Math.random() * (cachedBounds.maxY - item.size + cardSize - cachedBounds.minY);
                item.vx = ((Math.random() - 0.5) * maxSpeed * 2);
                item.vy = ((Math.random() - 0.5) * maxSpeed * 2);
            }
        });
        showToast('🔀 Kártyák újrakeverve!');
        if (isMobileView) {
            navLinks.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            container.style.pointerEvents = 'all';
        }
    }
    randomBtn.addEventListener('click', shuffleCards);
    mobileRandomBtn.addEventListener('click', shuffleCards);

    renderDiscover();

    // RÉSZLETES MODAL & ÉRTÉKELÉSI RENDSZER (3. pont)
    function openModal(item) {
        opens[item.id] = (opens[item.id] || 0) + 1;
        LS.set('bu_opens', opens);

        const mi = $('modal-img');
        mi.onerror = () => { mi.onerror = null; mi.src = placeholder(item.name); };
        mi.src = item.img;
        $('modal-title').innerText = item.name;
        $('modal-desc').innerText = item.desc;
        modalCategory.innerText = categoryNames[item.category] || item.category;
        modalDetailsText.innerText = item.details || "Részletes leírás hamarosan...";

        modalBadges.replaceChildren();
        if (item.premium) modalBadges.appendChild(el('span', 'mbadge gold', '👑 Prémium'));
        if (isNew(item)) modalBadges.appendChild(el('span', 'mbadge green', '🆕 Új cég'));
        const rank = topItems(5).findIndex(i => i.id === item.id);
        if (rank > -1) modalBadges.appendChild(el('span', 'mbadge fire', '🔥 Top ' + (rank + 1)));
        modalStats.textContent = '👁 ' + totalOpens(item) + ' megnyitás';

        // Értékelési widget frissítése
        updateRatingUI(item);

        const url = safeUrl(item.website);
        modalWebsite.hidden = !url;
        if (url) modalWebsite.href = url;

        modalDetailsContainer.classList.remove('show');
        readMoreBtn.innerText = "Tovább olvasok";
        modal.classList.add('active');
        container.style.pointerEvents = 'none';
        renderDiscover();
    }

    function updateRatingUI(item) {
        const session = getSession();
        const itemRating = ratings[item.id] || { totalScore: 0, count: 0, userRatings: {} };
        const avg = itemRating.count > 0 ? (itemRating.totalScore / itemRating.count).toFixed(1) : 'Még nincs értékelés';
        
        ratingStats.textContent = itemRating.count > 0 ? `Átlag: ${avg} / 5 (${itemRating.count} értékelés)` : 'Legyél te az első, aki értékeli!';
        
        const stars = starContainer.querySelectorAll('.dollar-star');
        const userScore = session ? (itemRating.userRatings[session] || 0) : 0;

        stars.forEach(star => {
            const val = parseInt(star.dataset.value);
            if (val <= userScore) star.classList.add('active');
            else star.classList.remove('active');

            // Eseménykezelő az értékeléshez
            star.onclick = () => {
                if (!session) {
                    showToast('⚠️ Az értékeléshez előbb be kell jelentkezned!');
                    return;
                }
                // Értékelés mentése
                const oldScore = itemRating.userRatings[session] || 0;
                if (oldScore === 0) {
                    itemRating.count++;
                    itemRating.totalScore += val;
                } else {
                    itemRating.totalScore += (val - oldScore);
                }
                itemRating.userRatings[session] = val;
                ratings[item.id] = itemRating;
                LS.set('bu_ratings', ratings);

                updateRatingUI(item);
                ratingParticleEffect(star);
                showToast(`🌟 Köszönjük az értékelést (${val} / 5)!`);
            };
        });

        if (!session) {
            ratingPrompt.textContent = 'Jelentkezz be a logó értékeléséhez (1-5 dollár csillag):';
        } else {
            ratingPrompt.textContent = userScore > 0 ? 'Már értékelted ezt a logót (kattintással módosíthatod):' : 'Értékeld a logót (1-5 skálán):';
        }
    }

    readMoreBtn.addEventListener('click', () => {
        const showing = modalDetailsContainer.classList.toggle('show');
        readMoreBtn.innerText = showing ? "Kevesebb" : "Tovább olvasok";
    });

    function closeModal() {
        modal.classList.remove('active');
        container.style.pointerEvents = 'all';
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        container.style.pointerEvents = navLinks.classList.contains('active') ? 'none' : 'all';
    });

    // REGISZTRÁCIÓ / BELÉPÉS (4. pont: Cég vagy Vendég választás)
    const authModal = $('authModal'), authBtn = $('authBtn'), authLabel =$('authLabel');
    const authTabs = $('authTabs'), authTitle =$('authTitle');
    const registerForm = $('registerForm'), loginForm = $('loginForm'), accountView =$('accountView');
    const regLogo = $('regLogo'), regDesc =$('regDesc'), regName = $('regName'), regCat =$('regCat');
    const descCount = $('descCount'), previewWrap = $('previewWrap'), previewCard =$('previewCard');
    const companyFieldsOnly = $('companyFieldsOnly');
    const regTypeRadios = document.querySelectorAll('input[name="regType"]');
    let pendingLogo = null;

    Object.entries(categoryNames).forEach(([k, v]) => {
        const o = el('option', null, v); o.value = k; regCat.appendChild(o);
    });

    // Regisztrációs típus váltás kezelése (4. pont)
    regTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const isCompany = e.target.value === 'company';
            companyFieldsOnly.style.display = isCompany ? 'block' : 'none';
        });
    });

    const hash = async (s) => {
        try {
            const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('bu:' + s));
            return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
        } catch (e) { return btoa(unescape(encodeURIComponent('bu:' + s))); }
    };
    const getSession = () => LS.get('bu_session', null);
    const currentCompany = () => companies.find(c => c.email === getSession()) || null;

    function updateAuthUI() {
        const c = currentCompany();
        authLabel.textContent = c ? c.name : 'Belépés';
        authBtn.classList.toggle('logged', !!c);
    }

    function setErr(form, name, msg) {
        const e = form.querySelector(`[data-for="${name}"]`);
        if (e) e.textContent = msg || '';
        return !msg;
    }

    function showView(v) {
        registerForm.hidden = v !== 'register';
        loginForm.hidden = v !== 'login';
        accountView.hidden = v !== 'account';
        authTabs.hidden = v === 'account';
        authTabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.tab === v));
        authTitle.textContent = v === 'account' ? 'Fiókom' : (v === 'login' ? 'Üdv újra!' : 'Csatlakozz a Brand Univerzumhoz');
        if (v === 'account') renderAccount();
    }
    function openAuth(v) {
        authModal.classList.add('active');
        container.style.pointerEvents = 'none';
        showView(v || (currentCompany() ? 'account' : 'register'));
    }
    function closeAuth() {
        authModal.classList.remove('active');
        container.style.pointerEvents = 'all';
    }
    authBtn.addEventListener('click', () => {
        navLinks.classList.remove('active'); hamburgerBtn.classList.remove('active');
        openAuth();
    });
    $('closeAuthBtn').addEventListener('click', closeAuth);
    authModal.addEventListener('click', (e) => { if (e.target === authModal) closeAuth(); });
    authTabs.querySelectorAll('button').forEach(b => b.addEventListener('click', () => showView(b.dataset.tab)));

    function renderPreview() {
        if (!pendingLogo) { previewWrap.hidden = true; return; }
        previewWrap.hidden = false;
        previewCard.replaceChildren();
        const im = new Image(); im.src = pendingLogo; im.alt = '';
        previewCard.append(im, el('h3', null, regName.value.trim() || 'Cégneved'), el('span', 'badge-new', 'ÚJ'));
    }
    regName.addEventListener('input', renderPreview);
    regDesc.addEventListener('input', () => { descCount.textContent = regDesc.value.length + ' / 300'; });

    regLogo.addEventListener('change', () => {
        const f = regLogo.files[0];
        pendingLogo = null;
        if (!f) { setErr(registerForm, 'regLogo', ''); renderPreview(); return; }
        if (!f.type.startsWith('image/')) { setErr(registerForm, 'regLogo', 'Csak képfájl tölthető fel.'); renderPreview(); return; }
        if (f.size > 5 * 1024 * 1024) { setErr(registerForm, 'regLogo', 'Maximum 5 MB méretű kép tölthető fel.'); renderPreview(); return; }
        const url = URL.createObjectURL(f), img = new Image();
        img.onload = () => {
            const S = 256, cv = document.createElement('canvas');
            cv.width = cv.height = S;
            const r = Math.min(S / img.width, S / img.height), w = img.width * r, h = img.height * r;
            cv.getContext('2d').drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
            pendingLogo = cv.toDataURL('image/png');
            URL.revokeObjectURL(url);
            setErr(registerForm, 'regLogo', '');
            renderPreview();
        };
        img.onerror = () => { setErr(registerForm, 'regLogo', 'A kép nem olvasható be.'); URL.revokeObjectURL(url); };
        img.src = url;
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = registerForm;
        const regType = document.querySelector('input[name="regType"]:checked').value;
        const name = regName.value.trim(), email = $('regEmail').value.trim().toLowerCase();
        const pass = $('regPass').value;
        let ok = true;

        ok = setErr(f, 'regName', name.length < 2 ? 'A név kötelező (min. 2 karakter).' : '') && ok;
        ok = setErr(f, 'regEmail', /^\S+@\S+\.\S+$/.test(email) ? (companies.some(c => c.email === email) ? 'Ezzel az e-mail címmel már regisztráltak.' : '') : 'Adj meg érvényes e-mail címet.') && ok;
        ok = setErr(f, 'regPass', pass.length < 6 ? 'Min. 6 karakter.' : '') && ok;

        let company = null;
        let item = null;

        if (regType === 'company') {
            const desc = regDesc.value.trim(), cat = regCat.value;
            const siteRaw = $('regSite').value.trim(), site = safeUrl(siteRaw);

            ok = setErr(f, 'regName', name.length < 2 ? 'A cégnév kötelező (min. 2 karakter).' :
                (items.some(i => norm(i.name) === norm(name)) ? 'Ez a cégnév már szerepel.' : '')) && ok;
            ok = setErr(f, 'regLogo', pendingLogo ? '' : 'A logó feltöltése kötelező.') && ok;
            ok = setErr(f, 'regDesc', desc.length === 0 ? 'A rövid leírás kötelező.' : (desc.length > 300 ? 'Maximum 300 karakter.' : '')) && ok;
            ok = setErr(f, 'regCat', cat ? '' : 'Válassz kategóriát.') && ok;
            ok = setErr(f, 'regSite', siteRaw && !site ? 'Érvénytelen weboldal link.' : '') && ok;
            if (!ok) return;

            company = { id: Date.now(), name, email, pass: await hash(pass), logo: pendingLogo, desc, category: cat, website: site, addedAt: Date.now(), type: 'company' };
            companies.push(company);
            if (!LS.set('bu_companies', companies)) {
                companies.pop();
                setErr(f, 'regLogo', 'Nem sikerült menteni (a böngésző tárhelye megtelt). Próbálj kisebb képet.');
                return;
            }
            item = { id: company.id, name, img: company.logo, category: cat, desc, website: site, addedAt: company.addedAt, baseOpens: 0, premium: false, registered: true };
            items.push(item);
            createCard(item, true);
        } else {
            // Vendég regisztráció
            if (!ok) return;
            company = { id: Date.now(), name, email, pass: await hash(pass), type: 'guest', addedAt: Date.now() };
            companies.push(company);
            LS.set('bu_companies', companies);
        }

        LS.set('bu_session', company.email);
        registerForm.reset(); pendingLogo = null; renderPreview(); descCount.textContent = '0 / 300';
        closeAuth(); resetAll(false);
        updateAuthUI(); renderDiscover();
        confetti();
        showToast(`🎉 Üdv a fedélzeten, ${name}! Sikeres regisztráció.`);
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = $('logEmail').value.trim().toLowerCase();
        const c = companies.find(x => x.email === email);
        const good = c && c.pass === await hash($('logPass').value);
        if (!setErr(loginForm, 'logPass', good ? '' : 'Hibás e-mail cím vagy jelszó.')) return;
        LS.set('bu_session', c.email);
        loginForm.reset();
        closeAuth(); updateAuthUI();
        showToast('👋 Üdv újra, ' + c.name + '!');
    });

    function renderAccount() {
        const c = currentCompany();
        accountView.replaceChildren();
        if (!c) { showView('login'); return; }
        
        const isComp = c.type === 'company' || c.logo;
        const head = el('div', 'acc-head');
        const box = el('div');
        
        if (isComp) {
            const im = new Image(); im.src = c.logo; im.alt = '';
            head.append(im);
            box.append(el('h4', null, c.name), el('p', null, categoryNames[c.category] || c.category || 'Cég'), el('p', null, c.email));
        } else {
            box.append(el('h4', null, c.name), el('p', null, 'Vendég fiók (Értékelő)'), el('p', null, c.email));
        }
        head.append(box);

        accountView.append(head);

        if (isComp) {
            const it = items.find(i => i.id === c.id);
            const left = Math.max(0, Math.ceil((NEW_DAYS * DAY - (Date.now() - c.addedAt)) / DAY));
            accountView.append(
                el('p', 'acc-stat', (left > 0 ? `🆕 Az ÚJ jelvényed még ${left} napig látszik.` : 'Az ÚJ jelvényed lejárt.') + '  👁 ' + (it ? totalOpens(it) : 0) + ' megnyitás'),
                el('div', 'acc-premium', '👑 Prémium csomag – hamarosan! Mindig látható, nagyobb kártya és kiemelt megjelenés.')
            );
            const open = el('button', 'btn-primary', 'Kártyám megnyitása'); open.type = 'button';
            open.onclick = () => { closeAuth(); if (it) openModal(it); };
            accountView.append(open);
        } else {
            accountView.append(el('p', 'acc-stat', 'Vendégként szabadon értékelheted a bejelentkezést követően a logókat az 1-5 skálás dollár csillagokkal.'));
        }

        const out = el('button', 'btn-ghost', 'Kilépés'); out.type = 'button';
        out.onclick = () => { LS.set('bu_session', null); closeAuth(); updateAuthUI(); showToast('Sikeres kilépés.'); };
        accountView.append(out);
    }
    updateAuthUI();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeModal(); closeFilter(); closeAuth(); }
    });

    window.addEventListener('resize', () => {
        checkMobileState(); updateBounds();
        if (filterState.tokens.length || filterState.activeCategory || filterState.special) filterItems();
    });
};