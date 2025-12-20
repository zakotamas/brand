window.onload = () => {
    // ----------------------------------------------------------------
    // DOM ELEMEK
    // ----------------------------------------------------------------
    const container = document.getElementById('scene-container');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    const mobileWarningModal = document.getElementById('mobileWarningModal');
    const closeWarningBtn = document.getElementById('closeWarningBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    
    // Modal részletek
    const readMoreBtn = document.getElementById('readMoreBtn');
    const modalDetailsContainer = document.getElementById('modal-details-container');
    const modalDetailsText = document.getElementById('modal-details-text');
    const modalCategory = document.getElementById('modal-category');

    // ÚJ: Szűrő elemek
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterModal = document.getElementById('filterModal');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const filterChips = document.querySelectorAll('.filter-chip');

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
    
    let maxSpeed = DESKTOP_MAX_SPEED;
    let isMobileView = window.innerWidth <= MOBILE_BREAKPOINT; 
    let cardSize = 120;
    const navHeight = 70; 
    let cachedBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    // Keresés és Szűrés állapot
    let filterState = {
        searchTerm: '',
        activeCategory: null // 'tech', 'food', stb. vagy null
    };

    const CENTER_TARGET_DAMPING = 0.15; 
    const CENTER_AREA_WIDTH = 600; 
    const CENTER_AREA_HEIGHT = 400; 

    // ADATOK: 'category' mező hozzáadva
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
        },
    /**
        { id: 79, name: "MAC", img: "img/l79.png", category: "fashion", desc: "A MAC Cosmetics kanadai kozmetikai márka, amely professzionális sminktermékeiről és széles színválasztékáról ismert." },
        { id: 80, name: "Tommy Hilfiger", img: "img/l80.png", category: "fashion", desc: "Amerikai divatmárka, amely klasszikus amerikai stílusú ruházatot, cipőket és kiegészítőket kínál." },
        { id: 81, name: "Tissot", img: "img/l81.png", category: "fashion", desc: "Svájci óragyártó, amely megfizethető, precíziós időmérőiről és sportóráiról ismert." },
        { id: 82, name: "Michael Kors", img: "img/l82.png", category: "fashion", desc: "Amerikai luxus divatmárka, amely táskákat, órákat, ruházatot és kiegészítőket kínál." },
        { id: 83, name: "Emirates", img: "img/l83.png", category: "auto", desc: "Dubaji központú nemzetközi légitársaság, amely prémium szolgáltatásairól és globális hálózatáról híres." },
        { id: 84, name: "Dolce & Gabbana", img: "img/l84.png", category: "fashion", desc: "Olasz luxus divatmárka, amely extravagáns stílusáról, haute couture kollekcióiról és ikonikus mintáiról ismert." },
        { id: 85, name: "Calvin Klein", img: "img/l85.png", category: "fashion", desc: "Amerikai divatmárka, amely minimalista stílusú ruházatot, fehérneműt, parfümöket és kiegészítőket kínál." },
        { id: 86, name: "Fressnapf", img: "img/l86.png", category: "home", desc: "Németországi állateledel- és felszereléslánc, amely Európa-szerte jelen van." },
        { id: 87, name: "Chanel", img: "img/l87.png", category: "fashion", desc: "Francia luxus divatmárka, híres parfümjeiről, haute couture ruházatáról és kiegészítőiről." },
        { id: 88, name: "Whirlpool", img: "img/l88.png", category: "home", desc: "Amerikai háztartási gépgyártó, amely mosógépeket, hűtőket és konyhai berendezéseket kínál." },
        { id: 89, name: "DeLonghi", img: "img/l89.png", category: "home", desc: "Olasz háztartási gépgyártó, híres kávéfőzőiről és konyhai eszközeiről." },
        { id: 90, name: "Marshall", img: "img/l90.png", category: "tech", desc: "Brit hangtechnikai márka, amely erősítőiről és fejhallgatóiról ismert." },
        { id: 91, name: "Miele", img: "img/l91.png", category: "home", desc: "Német prémium háztartási gépgyártó, amely mosógépeket, sütőket és porszívókat kínál." },
        { id: 92, name: "Lacoste", img: "img/l92.png", category: "fashion", desc: "Francia divatmárka, híres krokodilos logójáról és sportos eleganciájáról." },
        { id: 93, name: "New Balance", img: "img/l93.png", category: "fashion", desc: "Amerikai sportszergyártó, amely cipőket és sportruházatot kínál." },
        { id: 94, name: "Tamaris", img: "img/l94.png", category: "fashion", desc: "Német cipőmárka, amely női lábbelik széles választékát kínálja." },
        { id: 95, name: "Ray-Ban", img: "img/l95.png", category: "fashion", desc: "Amerikai szemüvegmárka, ikonikus napszemüvegeiről ismert." },
        { id: 96, name: "Adobe", img: "img/l96.png", category: "tech", desc: "Amerikai szoftvervállalat, híres Photoshop, Illustrator és Acrobat programjairól." },
        { id: 97, name: "Levi's", img: "img/l97.png", category: "fashion", desc: "Amerikai divatmárka, híres farmernadrágjairól és klasszikus stílusáról." },
        { id: 98, name: "Nintendo", img: "img/l98.png", category: "tech", desc: "Japán videojáték-gyártó, híres a Mario és Zelda sorozatokról." },
        { id: 99, name: "Spotify", img: "img/l99.png", category: "social", desc: "Svéd streaming szolgáltató, amely zenék és podcastok széles választékát kínálja." },
        { id: 100, name: "PayPal", img: "img/l100.png", category: "tech", desc: "Amerikai online fizetési szolgáltató, amely biztonságos tranzakciókat kínál világszerte." },
        { id: 101, name: "DHL", img: "img/l101.png", category: "auto", desc: "Globális logisztikai vállalat, amely csomagszállítási és futárszolgáltatásokat kínál." },
        { id: 102, name: "GLS", img: "img/l102.png", category: "auto", desc: "Európai logisztikai vállalat, amely csomagszállítási szolgáltatásokat nyújt." },
        { id: 103, name: "UPS", img: "img/l103.png", category: "auto", desc: "Amerikai logisztikai vállalat, amely globális csomagszállítási szolgáltatásokat kínál." },
        { id: 104, name: "Canon", img: "img/l104.png", category: "tech", desc: "Japán vállalat, amely fényképezőgépeket, nyomtatókat és optikai eszközöket gyárt." },
        { id: 105, name: "HP", img: "img/l105.png", category: "tech", desc: "Amerikai informatikai vállalat, amely számítógépeket, nyomtatókat és kiegészítőket gyárt." },
        { id: 106, name: "Allianz", img: "img/l106.png", category: "tech", desc: "Német biztosítótársaság, amely globális pénzügyi és biztosítási szolgáltatásokat kínál." },
        { id: 107, name: "IBM", img: "img/l107.png", category: "tech", desc: "Amerikai informatikai vállalat, amely technológiai és tanácsadási szolgáltatásokat nyújt." },
        { id: 108, name: "Douglas", img: "img/l108.png", category: "fashion", desc: "Német parfüm- és kozmetikai üzletlánc." },
        { id: 109, name: "Müller", img: "img/l109.png", category: "home", desc: "Német drogéria- és szupermarketlánc, amely széles termékkínálattal rendelkezik." },
        { id: 110, name: "DM", img: "img/l110.png", category: "home", desc: "Német drogérialánc, amely kozmetikai, háztartási és egészségügyi termékeket kínál." },
        { id: 111, name: "Lego", img: "img/l111.png", category: "home", desc: "Dán játékgyártó, híres építőkockáiról és kreatív játékairól." },
        { id: 112, name: "Lidl", img: "img/l112.png", category: "food", desc: "Német diszkont áruházlánc, amely élelmiszereket és háztartási cikkeket kínál." },
        { id: 113, name: "3M", img: "img/l113.png", category: "tech", desc: "Amerikai multinacionális vállalat, amely innovatív ipari és fogyasztói termékeket gyárt." },
        { id: 114, name: "Huawei", img: "img/l114.png", category: "tech", desc: "Kínai technológiai vállalat, amely okostelefonokat, hálózati berendezéseket és digitális megoldásokat kínál." },
        { id: 115, name: "Sony", img: "img/l115.png", category: "tech", desc: "Japán multinacionális vállalat, amely elektronikai termékeket, szórakoztató tartalmakat és videojátékokat kínál." },
        { id: 116, name: "LG", img: "img/l116.png", category: "tech", desc: "Dél-koreai elektronikai vállalat, amely háztartási gépeket, televíziókat és mobiltelefonokat gyárt." },
        { id: 117, name: "Hisense", img: "img/l117.png", category: "tech", desc: "Kínai elektronikai vállalat, amely televíziókat, háztartási gépeket és mobiltelefonokat gyárt." },
        { id: 118, name: "H&M", img: "img/l118.png", category: "fashion", desc: "Svéd divatmárka, amely megfizethető ruházatot és kiegészítőket kínál." },
        { id: 119, name: "Pepsi", img: "img/l119.png", category: "food", desc: "Amerikai üdítőital-márka, a PepsiCo terméke." },
        { id: 120, name: "KFC", img: "img/l120.png", category: "food", desc: "Amerikai gyorsétteremlánc, híres csirkés ételeiről." },
        { id: 121, name: "Subway", img: "img/l121.png", category: "food", desc: "Amerikai gyorsétteremlánc, amely szendvicseket és salátákat kínál." },
        { id: 122, name: "FedEx", img: "img/l122.png", category: "auto", desc: "Amerikai logisztikai vállalat, amely csomagszállítási és futárszolgáltatásokat kínál." },
        { id: 123, name: "Santander", img: "img/l123.png", category: "tech", desc: "A Banco Santander spanyol multinacionális bankcsoport, amely Európa, Észak- és Dél-Amerika egyik legnagyobb pénzügyi szolgáltatója." },
        { id: 124, name: "Kia", img: "img/l124.png", category: "auto", desc: "Dél-koreai autógyártó, amely megfizethető és megbízható járműveiről ismert." },
        { id: 125, name: "eBay", img: "img/l125.png", category: "tech", desc: "Amerikai online piactér, ahol felhasználók termékeket vásárolhatnak és árverezhetnek." },
        { id: 126, name: "Pampers", img: "img/l126.png", category: "home", desc: "A Procter & Gamble pelenkamárkája, amely világszerte ismert a babatermékek piacán." },
        { id: 127, name: "Gillette", img: "img/l127.png", category: "fashion", desc: "Amerikai borotvamárka, híres férfi és női borotvatermékeiről." },
        { id: 128, name: "Makita", img: "img/l128.png", category: "home", desc: "Japán szerszámgyártó, amely elektromos kéziszerszámokat és ipari berendezéseket kínál." },
        { id: 129, name: "Hilti", img: "img/l129.png", category: "home", desc: "Liechtensteini szerszámgyártó, amely építőipari eszközöket és megoldásokat kínál." },
        { id: 130, name: "Acer", img: "img/l130.png", category: "tech", desc: "Tajvani informatikai vállalat, amely laptopokat, monitorokat és számítástechnikai eszközöket gyárt." },
        { id: 131, name: "Kenwood", img: "img/l131.png", category: "home", desc: "Brit elektronikai márka, híres konyhai robotgépeiről és audioeszközeiről." },
        { id: 132, name: "Lay's", img: "img/l132.png", category: "food", desc: "Amerikai chipsmárka, a PepsiCo terméke." },
        { id: 133, name: "Chio", img: "img/l133.png", category: "food", desc: "Német snackmárka, amely chips és ropogtatnivalók széles választékát kínálja." },
        { id: 134, name: "Univer", img: "img/l134.png", category: "food", desc: "Magyar élelmiszergyártó, híres mustárjairól, szószairól és fűszereiről." },
        { id: 135, name: "Harley Davidson", img: "img/l135.png", category: "auto", desc: "Amerikai motorkerékpár-gyártó, ikonikus chopper stílusú motorjairól ismert." },
        { id: 136, name: "Brendon", img: "img/l136.png", category: "home", desc: "Magyar bababolt-hálózat, amely babatermékeket és kiegészítőket kínál." },
        { id: 137, name: "Renault", img: "img/l137.png", category: "auto", desc: "Francia autógyártó, amely széles választékban kínál személyautókat és haszongépjárműveket." },
        { id: 138, name: "Asus", img: "img/l138.png", category: "tech", desc: "Tajvani informatikai vállalat, amely laptopokat, alaplapokat és gamer eszközöket gyárt." },
        { id: 139, name: "Lenovo", img: "img/l139.png", category: "tech", desc: "Kínai informatikai vállalat, amely laptopokat, PC-ket és okoseszközöket kínál." },
        { id: 140, name: "MSI", img: "img/l140.png", category: "tech", desc: "Tajvani informatikai vállalat, amely gamer laptopokat, alaplapokat és grafikus kártyákat gyárt." },
        { id: 141, name: "Yahoo", img: "img/l141.png", category: "tech", desc: "Amerikai internetes szolgáltató, híres keresőmotorjáról és e-mail szolgáltatásáról." },
        { id: 142, name: "Meta", img: "img/l142.png", category: "tech", desc: "Amerikai technológiai vállalat, a Facebook, Instagram és WhatsApp tulajdonosa." },
        { id: 143, name: "Sega", img: "img/l143.png", category: "tech", desc: "Japán videojáték-fejlesztő és kiadó, híres Sonic the Hedgehog sorozatáról." },
        { id: 144, name: "Logitech", img: "img/l144.png", category: "tech", desc: "Svájci-amerikai vállalat, amely számítógépes perifériákat és gamer kiegészítőket gyárt." },
        { id: 145, name: "WhatsApp", img: "img/l145.png", category: "social", desc: "Globális üzenetküldő alkalmazás, amely a Meta Platforms tulajdonában van." },
        { id: 146, name: "Nikon", img: "img/l146.png", category: "tech", desc: "Japán optikai és fényképezőgép-gyártó vállalat." },
        { id: 147, name: "Electrolux", img: "img/l147.png", category: "home", desc: "Svéd háztartási gépgyártó, amely hűtőket, mosógépeket és konyhai eszközöket kínál." },
        { id: 148, name: "Dell", img: "img/l148.png", category: "tech", desc: "Amerikai informatikai vállalat, amely számítógépeket, laptopokat és szervereket gyárt." },
        { id: 149, name: "Chevrolet", img: "img/l149.png", category: "auto", desc: "Amerikai autógyártó, a General Motors leányvállalata." },
        { id: 150, name: "Pringles", img: "img/l150.png", category: "food", desc: "Amerikai chipsmárka, híres hengeres csomagolásáról." },
        { id: 151, name: "Starbucks", img: "img/l151.png", category: "food", desc: "Amerikai kávéházlánc, világszerte ismert kávéitalairól." },
        { id: 152, name: "Milka", img: "img/l152.png", category: "food", desc: "Svájci csokoládémárka, a Mondelez International terméke." },
        { id: 153, name: "Kinder", img: "img/l153.png", category: "food", desc: "Olasz édességmárka, híres Kinder tojásairól és csokoládéiról." },
        { id: 154, name: "Android", img: "img/l154.png", category: "tech", desc: "A Google által fejlesztett mobil operációs rendszer." },
        { id: 155, name: "Dyson", img: "img/l155.png", category: "home", desc: "Brit technológiai vállalat, híres porszívóiról, hajszárítókról és légtisztítókról." },
        { id: 156, name: "Playboy", img: "img/l156.png", category: "fashion", desc: "Amerikai életmód- és magazinmárka, híres nyuszis logójáról." },
        { id: 157, name: "Knorr", img: "img/l157.png", category: "food", desc: "Német élelmiszermárka, amely levesporokat, fűszereket és szószokat kínál." },
        { id: 158, name: "Nescafé", img: "img/l158.png", category: "food", desc: "A Nestlé instant kávémárkája, világszerte ismert." },
        { id: 159, name: "Danone", img: "img/l159.png", category: "food", desc: "Francia élelmiszeripari vállalat, amely tejtermékeket, ásványvizet és bébiételeket gyárt." },
        { id: 160, name: "Nivea", img: "img/l160.png", category: "fashion", desc: "Német kozmetikai márka, híres bőrápolási termékeiről." },
        { id: 161, name: "GoPro", img: "img/l161.png", category: "tech", desc: "Amerikai akciókamera-gyártó, híres sportkameráiról." },
        { id: 162, name: "Tezenis", img: "img/l162.png", category: "fashion", desc: "Olasz divatmárka, amely fehérneműt és ruházatot kínál." },
        { id: 163, name: "John Deere", img: "img/l163.png", category: "auto", desc: "Amerikai mezőgazdasági gépgyártó, híres traktorairól és kombájnjairól." },
        { id: 164, name: "Bose", img: "img/l164.png", category: "tech", desc: "Amerikai hangtechnikai vállalat, híres prémium hangszóróiról és fejhallgatóiról." },
        { id: 165, name: "Tiffany & Co.", img: "img/l165.png", category: "fashion", desc: "Amerikai luxus ékszermárka, ikonikus kék dobozairól és gyémántékszereiről ismert." },
        { id: 166, name: "Zeppelin", img: "img/l166.png", category: "fashion", desc: "Német óragyártó márka, amely klasszikus stílusú időmérőket kínál." },
        { id: 167, name: "Helly Hansen", img: "img/l167.png", category: "fashion", desc: "Norvég ruházati márka, híres outdoor és munkaruházati termékeiről." },
        { id: 168, name: "Jaguar", img: "img/l168.png", category: "auto", desc: "Brit prémium autógyártó, amely sportos és elegáns járműveiről ismert." },
        { id: 169, name: "Casio", img: "img/l169.png", category: "tech", desc: "Japán elektronikai vállalat, híres óráiról, számológépeiről és zenei eszközeiről." },
        { id: 170, name: "Pandora", img: "img/l170.png", category: "fashion", desc: "Dán ékszermárka, híres charm karkötőiről és személyre szabható ékszereiről." },
        { id: 171, name: "Swarovski", img: "img/l171.png", category: "fashion", desc: "Osztrák luxusmárka, híres kristályékszereiről és dekorációs termékeiről." },
        { id: 172, name: "Citizen", img: "img/l172.png", category: "fashion", desc: "Japán óragyártó, híres Eco-Drive technológiájáról." },
        { id: 173, name: "Devergo", img: "img/l173.png", category: "fashion", desc: "Magyar divatmárka, amely fiatalos ruházatot és kiegészítőket kínál." },
        { id: 174, name: "Geox", img: "img/l174.png", category: "fashion", desc: "Olasz cipőmárka, híres lélegző talpú lábbelijeiről." },
        { id: 175, name: "DKNY", img: "img/l175.png", category: "fashion", desc: "Amerikai divatmárka, amely modern és városi stílusú ruházatot kínál." },
        { id: 176, name: "Yves Saint Laurent", img: "img/l176.png", category: "fashion", desc: "Francia luxus divatmárka, híres haute couture ruházatáról és parfümjeiről." },
        { id: 177, name: "Lamborghini", img: "img/l177.png", category: "auto", desc: "Olasz luxus sportautógyártó, híres ikonikus szupersportautóiról." },
        { id: 178, name: "Iveco", img: "img/l178.png", category: "auto", desc: "Olasz haszongépjármű-gyártó, amely teherautókat és buszokat kínál." },
        { id: 179, name: "Volvo", img: "img/l179.png", category: "auto", desc: "Svéd autógyártó, híres biztonságos és megbízható járműveiről." },
        { id: 180, name: "MAN", img: "img/l180.png", category: "auto", desc: "Német haszongépjármű-gyártó, amely teherautókat és buszokat kínál." },
        { id: 181, name: "Timberland", img: "img/l181.png", category: "fashion", desc: "Amerikai cipő- és ruházati márka, híres bakancsairól." },
        { id: 182, name: "Hello Kitty", img: "img/l182.png", category: "home", desc: "Japán karakter és márka, a Sanrio tulajdona, világszerte népszerű." },
        { id: 183, name: "Reddit", img: "img/l183.png", category: "social", desc: "Amerikai közösségi média platform, amely fórumokra épül." },
        { id: 184, name: "Revolut", img: "img/l184.png", category: "tech", desc: "Brit fintech vállalat, amely digitális banki és pénzügyi szolgáltatásokat kínál." },
        { id: 185, name: "Under Armour", img: "img/l185.png", category: "fashion", desc: "Amerikai sportszergyártó, híres innovatív sportruházatáról." },
        { id: 186, name: "Cartoon Network", img: "img/l186.png", category: "social", desc: "Amerikai televíziós csatorna, híres animációs sorozatairól." },
        { id: 187, name: "Vodafone", img: "img/l187.png", category: "tech", desc: "Brit telekommunikációs vállalat, amely mobil- és internetes szolgáltatásokat kínál." },
        { id: 188, name: "Bugatti", img: "img/l188.png", category: "auto", desc: "Francia luxusautógyártó, híres exkluzív sportautóiról." },
        { id: 189, name: "Twitch", img: "img/l189.png", category: "social", desc: "Amerikai streaming platform, amely videojáték-közvetítésekre és élő tartalmakra épül." },
        { id: 190, name: "Monster", img: "img/l190.png", category: "food", desc: "Amerikai energiaital-márka, híres extrémsport szponzorációiról." },
        { id: 191, name: "DreamWorks", img: "img/l191.png", category: "social", desc: "Amerikai filmstúdió, híres animációs és élőszereplős filmjeiről." },
        { id: 192, name: "Warner Bros.", img: "img/l192.png", category: "social", desc: "Amerikai film- és televíziós stúdió, híres klasszikus és modern produkcióiról." }, 
    **/
    ];

    // Segéd: Kategória név megjelenítéshez
    const categoryNames = {
        tech: "Technológia",
        auto: "Autóipar",
        food: "Étel & Ital",
        fashion: "Divat & Sport",
        home: "Otthon & Bútor",
        social: "Közösségi Média"
    };

    function checkMobileState() {
        isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;
        if (isMobileView) {
            maxSpeed = MOBILE_MAX_SPEED;
            const seen = localStorage.getItem(WARNING_SEEN_KEY);
            if (!seen) {
                setTimeout(() => {
                    mobileWarningModal.classList.add('active');
                }, 1000); 
            }
        } else {
            maxSpeed = DESKTOP_MAX_SPEED;
            mobileWarningModal.classList.remove('active');
        }
    }
    
    closeWarningBtn.addEventListener('click', () => {
        mobileWarningModal.classList.remove('active');
        localStorage.setItem(WARNING_SEEN_KEY, 'true');
    });

    function updateBounds() {
        const w = window.innerWidth, h = window.innerHeight;
        cardSize = isMobileView ? 90 : 120;
        cachedBounds.minX = (w * PADDING_PERCENTAGE_X / 100);
        cachedBounds.maxX = w - (w * PADDING_PERCENTAGE_X / 100) - cardSize;
        cachedBounds.minY = navHeight + (h * PADDING_PERCENTAGE_Y / 100);
        cachedBounds.maxY = h - (h * PADDING_PERCENTAGE_Y / 100) - cardSize;
    }
    
    function updateDimmedState() {
        const currentlyHovered = cardElements.some(c => c.isHovering);
        cardElements.forEach(item => {
            if (currentlyHovered && !item.isHovering && !item.element.classList.contains('filtered-out')) {
                item.element.classList.add('dimmed');
            } else {
                item.element.classList.remove('dimmed');
            }
        });
    }

    function calculateCenteredGrid(cards) {
        const containerW = window.innerWidth, containerH = window.innerHeight;
        const centerX = containerW / 2;
        const centerY = (containerH + navHeight) / 2; 
        const gridW = Math.min(CENTER_AREA_WIDTH, containerW - 100); 
        const gridH = Math.min(CENTER_AREA_HEIGHT, containerH - navHeight - 100);
        const numCards = cards.length;
        const cardDiameter = cardSize + 20; 
        let cols = Math.floor(gridW / cardDiameter);
        cols = Math.max(1, Math.min(cols, numCards)); 
        const rows = Math.ceil(numCards / cols);
        const usedW = cols * cardDiameter, usedH = rows * cardDiameter;
        const startX = centerX - usedW / 2, startY = centerY - usedH / 2;

        cards.forEach((card, index) => {
            const col = index % cols, row = Math.floor(index / cols);
            card.targetX = startX + col * cardDiameter + (cardDiameter - cardSize) / 2;
            card.targetY = startY + row * cardDiameter + (cardDiameter - cardSize) / 2;
        });
    }

    const cardElements = [];
    checkMobileState(); 
    updateBounds();

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/70?text=Logo'"><h3>${item.name}</h3>`;
        
        const data = {
            element: card,
            pixelX: cachedBounds.minX + Math.random() * (cachedBounds.maxX - cachedBounds.minX),
            pixelY: cachedBounds.minY + Math.random() * (cachedBounds.maxY - cachedBounds.minY),
            currentZ: Math.floor(Math.random() * 50),
            vx: ((Math.random() - 0.5) * maxSpeed * 2),
            vy: ((Math.random() - 0.5) * maxSpeed * 2),
            name: item.name.toLowerCase(),
            originalData: item,
            isDragging: false, canClick: true, isHovering: false,
            targetX: undefined, targetY: undefined
        };

        card.addEventListener('mouseenter', () => { if (!isMobileView) { data.isHovering = true; updateDimmedState(); }});
        card.addEventListener('mouseleave', () => { if (!isMobileView) { data.isHovering = false; updateDimmedState(); }});
        
        const startHandler = (e) => {
            if (data.element.classList.contains('filtered-out') || data.element.classList.contains('dimmed')) return;
            e.preventDefault(); 
            draggedItem = data;

            topZIndex++;
            draggedItem.currentZ = topZIndex;

            draggedItem.isDragging = false; 
            draggedItem.canClick = true; 
            const client = e.type.startsWith('touch') ? e.touches[0] : e;
            dragStartX = client.clientX; dragStartY = client.clientY;
            const cardRect = draggedItem.element.getBoundingClientRect();
            dragOffsetX = client.clientX - cardRect.left; 
            dragOffsetY = client.clientY - cardRect.top;
        };
        
        card.addEventListener('mousedown', startHandler);
        card.addEventListener('touchstart', startHandler, { passive: false }); 
        cardElements.push(data);
        container.appendChild(card);
    });

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
            draggedItem.pixelX = Math.max(cachedBounds.minX, Math.min(cachedBounds.maxX, clientX - dragOffsetX));
            draggedItem.pixelY = Math.max(cachedBounds.minY, Math.min(cachedBounds.maxY, clientY - dragOffsetY));
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

    function animate() {
        // Ha van aktív keresés VAGY aktív kategória szűrő, akkor középre rendezünk
        const isFiltering = filterState.searchTerm.length > 0 || filterState.activeCategory !== null;

        cardElements.forEach(item => {
            if (isFiltering && item.targetX !== undefined) {
                // Mozgás a rács pozícióba
                item.pixelX += (item.targetX - item.pixelX) * CENTER_TARGET_DAMPING;
                item.pixelY += (item.targetY - item.pixelY) * CENTER_TARGET_DAMPING;
                item.vx = 0; item.vy = 0;
            } else if (!item.element.classList.contains('filtered-out') && !item.isDragging) {
                // Szabad mozgás
                let nextX = item.pixelX + item.vx;
                let nextY = item.pixelY + item.vy;
                if (nextX < cachedBounds.minX || nextX > cachedBounds.maxX) item.vx *= -1;
                if (nextY < cachedBounds.minY || nextY > cachedBounds.maxY) item.vy *= -1;
                item.pixelX = Math.max(cachedBounds.minX, Math.min(cachedBounds.maxX, nextX));
                item.pixelY = Math.max(cachedBounds.minY, Math.min(cachedBounds.maxY, nextY));
            }
            
            const isHidden = item.element.classList.contains('filtered-out');
            const scale = isHidden ? 0 : 1; 

            item.element.style.zIndex = item.currentZ;
            item.element.style.transform = `translate3d(${item.pixelX}px, ${item.pixelY}px, 0px) scale(${scale})`;
        });
        requestAnimationFrame(animate);
    }
    animate();

    // ----------------------------------------------------------------
    // KERESÉS ÉS SZŰRÉS LOGIKA (AND KAPCSOLAT)
    // ----------------------------------------------------------------

    function filterItems() {
        const term = filterState.searchTerm;
        const cat = filterState.activeCategory;
        const matchingCards = [];

        // Gombok láthatósága
        clearSearchBtn.style.display = term.length > 0 ? 'block' : 'none';
        
        // Főikon állapota
        if (cat !== null) {
            filterToggleBtn.classList.add('active');
        } else {
            filterToggleBtn.classList.remove('active');
        }

        let isAnyFilterActive = term.length > 0 || cat !== null;

        cardElements.forEach(item => {
            // 1. Keresés egyezés
            const matchSearch = item.name.includes(term);
            // 2. Kategória egyezés (ha nincs kat, akkor true)
            const matchCat = cat === null || item.originalData.category === cat;

            if (matchSearch && matchCat) {
                item.element.classList.remove('filtered-out');
                matchingCards.push(item);
            } else {
                item.element.classList.add('filtered-out');
                // Ha kiszűrtük, töröljük a célpontot
                item.targetX = undefined; 
                item.targetY = undefined;
            }
        });

        // Ha van aktív szűrés, számoljuk újra a rácsot a látható elemeknek
        if (isAnyFilterActive && matchingCards.length > 0) {
            calculateCenteredGrid(matchingCards);
        } else if (!isAnyFilterActive) {
            // Minden szűrő törölve -> mindenki szabadon úszik
            cardElements.forEach(item => {
                item.targetX = undefined; item.targetY = undefined;
            });
        }

        updateDimmedState();
    }

    // Kereső Input Esemény
    searchInput.addEventListener('input', (e) => {
        filterState.searchTerm = e.target.value.toLowerCase().trim();
        filterItems();
    });
    
    // Keresés törlése gomb
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    });

    // ----------------------------------------------------------------
    // SZŰRŐ MODAL KEZELÉS
    // ----------------------------------------------------------------

    // Megnyitás
    filterToggleBtn.addEventListener('click', () => {
        filterModal.classList.add('active');
    });

    // Bezárás (X gomb)
    closeFilterBtn.addEventListener('click', () => {
        filterModal.classList.remove('active');
    });

    // Bezárás (Háttér kattintás)
    filterModal.addEventListener('click', (e) => {
        if (e.target === filterModal) filterModal.classList.remove('active');
    });

    // Kategória Chip kattintás
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const selectedCat = chip.dataset.category;

            // Ha már ez volt aktív, akkor kikapcsoljuk (toggle)
            if (filterState.activeCategory === selectedCat) {
                filterState.activeCategory = null;
                chip.classList.remove('active');
            } else {
                // Új kategória beállítása
                filterState.activeCategory = selectedCat;
                // UI frissítés
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            }
            
            // Szűrés futtatása
            filterItems();
        });
    });

    // Reset Filter Gomb
    resetFilterBtn.addEventListener('click', () => {
        filterState.activeCategory = null;
        filterChips.forEach(c => c.classList.remove('active'));
        filterItems();
        filterModal.classList.remove('active'); // Opcionális: bezárja a modalt reset után
    });


    // ----------------------------------------------------------------
    // RÉSZLETES MODAL
    // ----------------------------------------------------------------

    function openModal(item) {
        document.getElementById('modal-img').src = item.img; 
        document.getElementById('modal-title').innerText = item.name;
        document.getElementById('modal-desc').innerText = item.desc;
        
        // Kategória kiírása szépen
        modalCategory.innerText = categoryNames[item.category] || item.category;

        modalDetailsText.innerText = item.details || "Részletes leírás hamarosan...";
        
        modalDetailsContainer.classList.remove('show');
        readMoreBtn.innerText = "Tovább olvasok";
        
        modal.classList.add('active');
        container.style.pointerEvents = 'none';
    }

    readMoreBtn.addEventListener('click', () => {
        const isShowing = modalDetailsContainer.classList.contains('show');
        if (isShowing) {
            modalDetailsContainer.classList.remove('show');
            readMoreBtn.innerText = "Tovább olvasok";
        } else {
            modalDetailsContainer.classList.add('show');
            readMoreBtn.innerText = "Kevesebb";
        }
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

    window.addEventListener('resize', () => {
        checkMobileState(); updateBounds();
        if (filterState.searchTerm || filterState.activeCategory) {
            const matching = cardElements.filter(i => !i.element.classList.contains('filtered-out'));
            calculateCenteredGrid(matching);
        }
    });
};