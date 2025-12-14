// A teljes logikát a window.onload alá helyezzük, hogy a böngésző biztosan érzékelje a lap betöltésének végét
window.onload = () => {
    const container = document.getElementById('scene-container');
    const searchInput = document.getElementById('searchInput');
    
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');

    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    
    // DRAG VÁLTOZÓK
    let draggedItem = null;
    const dragDistanceThreshold = 5; 
    let dragStartX = 0;
    let dragStartY = 0;
    
    // Z TENGELY KORLÁTOK
    const minZ = 0; 
    const maxZ = 400; 
    
    // SZŰKÍTETT HATÁROK a 3D kilógás megelőzésére
    const PADDING_PERCENTAGE_X = 5;
    const PADDING_PERCENTAGE_Y = 5;
    
    // ----------------------------------------------------------------
    // SEBESSÉG VÁLTOZÓK ÉS BREAKPOINT
    // ----------------------------------------------------------------
    
    // ASZTALI NÉZET (PC, Laptop) - ÉLÉNK, ÜTKÖZŐ FIZIKA
    const DESKTOP_MAX_SPEED = 0.08; 
    const DESKTOP_MIN_SPEED = 0.05;
    
    // MOBIL/TABLET NÉZET - LASSÚ, ÁRAMLÓ FIZIKA, ÜTKÖZTETÉS KIKAPCSOLVA
    const MOBILE_BREAKPOINT = 768; // pl. 768px alatt mobilnak tekintjük
    const MOBILE_MAX_SPEED = 0.025; // Sokkal lassabb mozgás
    const MOBILE_MIN_SPEED = 0.01; 
    
    // Aktuális állapotok
    let maxSpeed = DESKTOP_MAX_SPEED;
    let minStartSpeed = DESKTOP_MIN_SPEED;
    let isMobileView = window.innerWidth <= MOBILE_BREAKPOINT; 
    // ----------------------------------------------------------------

    // 1. EGYEDI ADATSTRUKTÚRA (192 LOGÓ)
    const items = [
        { id: 1, name: "Nike", img: "img/l1.png", desc: "A Nike Inc. egy amerikai multinacionális vállalat, amely cipők, ruházati cikkek, sportfelszerelések és kiegészítők tervezésével, fejlesztésével és gyártásával foglalkozik. Küldetésük az inspiráció és innováció eljuttatása minden sportolóhoz a világon." },
        { id: 2, name: "McDonald's", img: "img/l2.png", desc: "A világ vezető gyorséttermi lánca, több mint 100 országban van jelen. Folyamatosan fejleszti éttermi élményét és globális ellátási láncát a fenntarthatóság jegyében." },
        { id: 3, name: "Apple", img: "img/l3.png", desc: "Az Apple Inc. technológiai vállalat, amely fogyasztói elektronikát, számítógépes szoftvereket és online szolgáltatásokat fejleszt. Innovációjuk kulcsa a felhasználói élmény tökéletesítése." },
        { id: 4, name: "Mercedes-Benz", img: "img/l4.png", desc: "A Mercedes-Benz német prémium autómárka, amely a luxus, a biztonság és a fejlett technológia szinonimája. Jelenleg nagy hangsúlyt fektetnek az elektromos járművek fejlesztésére." },
        { id: 5, name: "Coca-Cola", img: "img/l5.png", desc: "A Coca-Cola Company a világ egyik legnagyobb italgyártója, termékeit több mint 200 országban értékesítik. Elkötelezettek a fenntartható csomagolási megoldások iránt." },
        { id: 6, name: "Microsoft", img: "img/l6.png", desc: "A Microsoft globális technológiai vállalat, amely szoftverek, fogyasztói elektronikai eszközök, személyi számítógépek és szolgáltatások fejlesztésével foglalkozik. Fő fókuszban a felhőszolgáltatások (Azure) állnak." },
        { id: 7, name: "Amazon", img: "img/l7.png", desc: "Az Amazon.com a világ egyik legnagyobb e-kereskedelmi vállalata és felhőszolgáltatója (AWS). Céljuk a vevőközpontúság, az innováció és az operatív kiválóság." },
        { id: 8, name: "X", img: "img/l8.png", desc: "Az X (korábban Twitter) egy globális közösségi média platform, amely rövid üzenetek megosztására épül. Fontos szerepet játszik a valós idejű kommunikációban és hírek terjesztésében." },
        { id: 9, name: "Ikea", img: "img/l9.png", desc: "Az IKEA svéd multinacionális vállalat, amely megfizethető és praktikus bútorokat, lakberendezési cikkeket és kiegészítőket kínál. Fenntarthatósági törekvéseik középpontjában az újrahasznosítás és a környezetbarát anyagok állnak." },
        { id: 10, name: "Jysk", img: "img/l10.png", desc: "A JYSK dán kiskereskedelmi lánc, amely bútorokat, matracokat, lakberendezési cikkeket és háztartási kiegészítőket kínál. Több mint 50 országban van jelen." },
        { id: 11, name: "Adidas", img: "img/l11.png", desc: "Az Adidas német sportszergyártó, amely cipőket, ruházatot és kiegészítőket gyárt. Innovációik középpontjában a sportteljesítmény növelése és a fenntarthatóság áll." },
        { id: 12, name: "Zalando", img: "img/l12.png", desc: "A Zalando egy berlini központú, vezető európai online divat- és életmódplatform, amely ruházatot, cipőket, kiegészítőket és szépségápolási termékeket kínál több millió vásárlónak." },
        { id: 13, name: "Telekom", img: "img/l13.png", desc: "A Deutsche Telekom AG európai telekommunikációs vállalat, amely mobil- és vezetékes szolgáltatásokat, valamint digitális megoldásokat kínál. Több országban működik leányvállalatokon keresztül." },
        { id: 14, name: "Samsung", img: "img/l14.png", desc: "A Samsung dél-koreai multinacionális elektronikai vállalat. Kínálatukban mobiltelefonok, televíziók, háztartási gépek és félvezetők találhatók. Erős kutatás-fejlesztési bázissal rendelkeznek." },
        { id: 15, name: "Instagram", img: "img/l15.png", desc: "Az Instagram a Meta Platforms tulajdonában lévő közösségi média alkalmazás, amely fotók és videók megosztására épül. Világszerte több százmillió aktív felhasználóval rendelkezik." },
        { id: 16, name: "Tesla", img: "img/l16.png", desc: "A Tesla Inc. amerikai autógyártó és energiatechnológiai vállalat, amely az elektromos járművek és a megújuló energia megoldások úttörője. Küldetésük a fenntartható közlekedés előmozdítása." },
        { id: 17, name: "Ford", img: "img/l17.png", desc: "A Ford Motor Company amerikai autógyártó, amely több mint egy évszázada gyárt járműveket. Innovációik középpontjában az elektromos járművek és az automatizált vezetési technológiák állnak." },
        { id: 18, name: "Ferrari", img: "img/l18.png", desc: "Az olasz Ferrari luxus sportautógyártó, amely a sebesség, a teljesítmény és az exkluzivitás szimbóluma. Versenypályán és közúton egyaránt ikonikus márka." },
        { id: 19, name: "Google", img: "img/l19.png", desc: "A Google a világ legnépszerűbb keresőmotorját üzemelteti, emellett vezető szerepet tölt be az MI, a felhőalapú számítástechnika és az okostelefon-operációs rendszerek terén." },
        { id: 20, name: "Red-Bull", img: "img/l20.png", desc: "Az osztrák Red Bull energiaital-gyártó vállalat, amely a 'Red Bull szárnyakat ad' szlogennel vált világhírűvé. Jelentős szereplő a sport- és extrémsport szponzorációban." },
        { id: 21, name: "Szentkirályi", img: "img/l21.png", desc: "Magyar ásványvíz márka, amely természetes forrásból származó, prémium minőségű ásványvizet kínál." },
        { id: 22, name: "Zwack", img: "img/l22.png", desc: "Magyar italgyártó vállalat, legismertebb terméke az Unicum gyógynövénylikőr." },
        { id: 23, name: "Heineken", img: "img/l23.png", desc: "Holland sörgyártó vállalat, világszerte ismert prémium lager söreiről." },
        { id: 24, name: "Jack Daniels", img: "img/l24.png", desc: "Amerikai whiskey márka, híres Tennessee whiskey-jéről és ikonikus fekete címkéjéről." },
        { id: 25, name: "OMV", img: "img/l25.png", desc: "Osztrák olaj- és gázipari vállalat, amely üzemanyag-ellátással és energiatermeléssel foglalkozik." },
        { id: 26, name: "MOL", img: "img/l26.png", desc: "Magyar olaj- és gázipari vállalat, amely Közép- és Kelet-Európa egyik vezető energiaipari szereplője." },
        { id: 27, name: "Shell", img: "img/l27.png", desc: "Globális energiavállalat, amely olaj-, gáz- és megújuló energiaforrásokkal foglalkozik." },
        { id: 28, name: "Turkish Airlines", img: "img/l28.png", desc: "Török nemzeti légitársaság, amely több mint 300 célállomásra repül világszerte." },
        { id: 29, name: "Petronas", img: "img/l29.png", desc: "Malajziai állami olaj- és gázipari vállalat, amely a Formula–1 szponzorációjáról is ismert." },
        { id: 30, name: "Michelin", img: "img/l30.png", desc: "Francia gumiabroncs-gyártó, híres a Michelin Guide éttermi értékeléseiről is." },
        { id: 31, name: "Bridgestone", img: "img/l31.png", desc: "Japán gumiabroncs- és autóipari termékgyártó, a világ egyik legnagyobb abroncsgyártója." },
        { id: 32, name: "Nestlé", img: "img/l32.png", desc: "Svájci multinacionális élelmiszeripari vállalat, amely kávét, csokoládét, tejtermékeket és bébiételeket gyárt." },
        { id: 33, name: "TikTok", img: "img/l33.png", desc: "Kínai közösségi média platform, amely rövid videók megosztására épül." },
        { id: 34, name: "Facebook", img: "img/l34.png", desc: "Meta Platforms közösségi hálózata, amely világszerte több milliárd felhasználót kapcsol össze." },
        { id: 35, name: "Hugo Boss", img: "img/l35.png", desc: "Német divatmárka, amely prémium férfi és női ruházatot, parfümöket és kiegészítőket kínál." },
        { id: 36, name: "Louis Vuitton", img: "img/l36.png", desc: "Francia luxus divatmárka, híres bőrtáskáiról, ruházatáról és kiegészítőiről." },
        { id: 37, name: "Ralph Lauren", img: "img/l37.png", desc: "Amerikai divatmárka, amely elegáns ruházatot, parfümöket és lakberendezési cikkeket kínál." },
        { id: 38, name: "Xbox", img: "img/l38.png", desc: "A Microsoft videojáték-konzol márkája, amely világszerte népszerű a gamerek körében." },
        { id: 39, name: "PlayStation", img: "img/l39.png", desc: "A Sony videojáték-konzol márkája, amely a modern gaming egyik vezető platformja." },
        { id: 40, name: "Nvidia", img: "img/l40.png", desc: "Amerikai technológiai vállalat, amely grafikus processzorokat (GPU) és mesterséges intelligencia megoldásokat fejleszt." },
        { id: 41, name: "Intel", img: "img/l41.png", desc: "Amerikai félvezetőgyártó, processzorokat és chipkészleteket gyárt számítógépekhez és adatközpontokhoz." },
        { id: 42, name: "AMD", img: "img/l42.png", desc: "Amerikai félvezetőgyártó, amely CPU-kat és GPU-kat fejleszt, versenytársa az Intelnek és Nvidiának." },
        { id: 43, name: "Razer", img: "img/l43.png", desc: "Amerikai-szingapúri gamer márka, amely perifériákat, laptopokat és kiegészítőket gyárt." },
        { id: 44, name: "Suzuki", img: "img/l44.png", desc: "Japán autó- és motorgyártó vállalat, amely kompakt járműveiről és motorjairól ismert." },
        { id: 45, name: "Burger King", img: "img/l45.png", desc: "Amerikai gyorsétteremlánc, híres Whopper szendvicséről." },
        { id: 46, name: "Toyota", img: "img/l46.png", desc: "Japán autógyártó, a hibrid járművek úttörője és a világ egyik legnagyobb autógyártója." },
        { id: 47, name: "VW", img: "img/l47.png", desc: "A Volkswagen német autógyártó, amely ikonikus modelleket, például a Golfot és a Beetle-t gyártja." },
        { id: 48, name: "OTP", img: "img/l48.png", desc: "Magyar bankcsoport, amely Közép- és Kelet-Európában nyújt pénzügyi szolgáltatásokat." },
        { id: 49, name: "Raiffeisen", img: "img/l49.png", desc: "Osztrák bankcsoport, amely nemzetközi pénzügyi szolgáltatásokat kínál." },
        { id: 50, name: "Erste", img: "img/l50.png", desc: "Osztrák bankcsoport, amely Közép-Európában nyújt lakossági és vállalati pénzügyi szolgáltatásokat." },
        { id: 51, name: "YouTube", img: "img/l51.png", desc: "A Google tulajdonában lévő videómegosztó platform, amely világszerte a legnépszerűbb online videós szolgáltatás." },
        { id: 52, name: "BMW", img: "img/l52.png", desc: "Német prémium autógyártó, amely a sportos elegancia és a fejlett technológia szinonimája." },
        { id: 53, name: "Rolls-Royce", img: "img/l53.png", desc: "Brit luxusautógyártó, amely ikonikus, kézzel készített járműveiről ismert." },
        { id: 54, name: "Netflix", img: "img/l54.png", desc: "Globális streaming szolgáltató, amely filmek, sorozatok és dokumentumfilmek széles választékát kínálja." },
        { id: 55, name: "Walt Disney", img: "img/l55.png", desc: "Amerikai szórakoztatóipari óriás, amely filmeket, animációkat, vidámparkokat és médiatartalmakat kínál." },
        { id: 56, name: "SAP", img: "img/l56.png", desc: "Német szoftvervállalat, amely vállalatirányítási rendszereket és üzleti megoldásokat fejleszt." },
        { id: 57, name: "Visa", img: "img/l57.png", desc: "Globális pénzügyi szolgáltató, amely elektronikus fizetési megoldásokat és bankkártyákat kínál." },
        { id: 58, name: "MasterCard", img: "img/l58.png", desc: "Nemzetközi pénzügyi szolgáltató, amely bankkártyás fizetési rendszereket működtet." },
        { id: 59, name: "Cisco", img: "img/l59.png", desc: "Amerikai technológiai vállalat, amely hálózati berendezéseket és digitális infrastruktúrát fejleszt." },
        { id: 60, name: "Caterpillar", img: "img/l60.png", desc: "Amerikai ipari vállalat, amely nehézgépeket, építőipari berendezéseket és motorokat gyárt." },
        { id: 61, name: "Bosch", img: "img/l61.png", desc: "Német multinacionális vállalat, amely autóipari alkatrészeket, háztartási gépeket és ipari technológiákat gyárt." },
        { id: 62, name: "Liebherr", img: "img/l62.png", desc: "Német ipari vállalat, amely építőipari gépeket, darukat és háztartási berendezéseket gyárt." },
        { id: 63, name: "L'Oréal", img: "img/l63.png", desc: "Francia kozmetikai óriás, amely szépségápolási termékeket és hajápolási megoldásokat kínál." },
        { id: 64, name: "Airbus", img: "img/l64.png", desc: "Európai repülőgépgyártó vállalat, amely kereskedelmi és katonai repülőgépeket fejleszt." },
        { id: 65, name: "HSBC", img: "img/l65.png", desc: "Brit multinacionális bank, amely globális pénzügyi szolgáltatásokat kínál." },
        { id: 66, name: "Rolex", img: "img/l66.png", desc: "Svájci luxusóra márka, amely ikonikus presztízsóráiról ismert." },
        { id: 67, name: "Hublot", img: "img/l67.png", desc: "Svájci luxusóra márka, amely innovatív dizájnjáról és sportos stílusáról híres." },
        { id: 68, name: "Omega", img: "img/l68.png", desc: "Svájci óragyártó, amely a precíziós időmérés és az űrkutatás szimbóluma." },
        { id: 69, name: "Breitling", img: "img/l69.png", desc: "Svájci óragyártó, amely pilótaóráiról és sportos kronográfjairól ismert." },
        { id: 70, name: "Patek Philippe", img: "img/l70.png", desc: "Svájci luxusóra márka, amely kézzel készített, exkluzív időmérőket gyárt." },
        { id: 71, name: "Tag Heuer", img: "img/l71.png", desc: "Svájci óragyártó, amely sportos kronográfjairól és innovatív dizájnjáról híres." },
        { id: 72, name: "Prada", img: "img/l72.png", desc: "Olasz luxus divatmárka, amely táskákat, ruházatot és kiegészítőket kínál." },
        { id: 73, name: "Armani", img: "img/l73.png", desc: "Olasz divatmárka, amely elegáns ruházatot, parfümöket és kiegészítőket kínál." },
        { id: 74, name: "Porsche", img: "img/l74.png", desc: "Német autógyártó, amely sportautóiról és prémium járműveiről ismert." },
        { id: 75, name: "Bentley", img: "img/l75.png", desc: "Brit luxusautógyártó, amely exkluzív, kézzel készített járműveket gyárt." },
        { id: 76, name: "Gucci", img: "img/l76.png", desc: "Olasz luxus divatmárka, amely ikonikus táskáiról, cipőiről és ruházatáról híres." },
        { id: 77, name: "Dior", img: "img/l77.png", desc: "Francia luxus divatmárka, amely haute couture ruházatot, parfümöket és kiegészítőket kínál." },
        { id: 78, name: "Versace", img: "img/l78.png", desc: "Olasz divatmárka, amely extravagáns stílusáról és ikonikus mintáiról ismert." },
        { id: 79, name: "MAC", img: "img/l79.png", desc: "A MAC Cosmetics kanadai kozmetikai márka, amely professzionális sminktermékeiről és széles színválasztékáról ismert." },
        { id: 80, name: "Tommy Hilfiger", img: "img/l80.png", desc: "Amerikai divatmárka, amely klasszikus amerikai stílusú ruházatot, cipőket és kiegészítőket kínál." },
        { id: 81, name: "Tissot", img: "img/l81.png", desc: "Svájci óragyártó, amely megfizethető, precíziós időmérőiről és sportóráiról ismert." },
        { id: 82, name: "Michael Kors", img: "img/l82.png", desc: "Amerikai luxus divatmárka, amely táskákat, órákat, ruházatot és kiegészítőket kínál." },
        { id: 83, name: "Emirates", img: "img/l83.png", desc: "Dubaji központú nemzetközi légitársaság, amely prémium szolgáltatásairól és globális hálózatáról híres." },
        { id: 84, name: "Dolce & Gabbana", img: "img/l84.png", desc: "Olasz luxus divatmárka, amely extravagáns stílusáról, haute couture kollekcióiról és ikonikus mintáiról ismert." },
        { id: 85, name: "Calvin Klein", img: "img/l85.png", desc: "Amerikai divatmárka, amely minimalista stílusú ruházatot, fehérneműt, parfümöket és kiegészítőket kínál." },
        { id: 86, name: "Fressnapf", img: "img/l86.png", desc: "Németországi állateledel- és felszereléslánc, amely Európa-szerte jelen van." },
        { id: 87, name: "Chanel", img: "img/l87.png", desc: "Francia luxus divatmárka, híres parfümjeiről, haute couture ruházatáról és kiegészítőiről." },
        { id: 88, name: "Whirlpool", img: "img/l88.png", desc: "Amerikai háztartási gépgyártó, amely mosógépeket, hűtőket és konyhai berendezéseket kínál." },
        { id: 89, name: "DeLonghi", img: "img/l89.png", desc: "Olasz háztartási gépgyártó, híres kávéfőzőiről és konyhai eszközeiről." },
        { id: 90, name: "Marshall", img: "img/l90.png", desc: "Brit hangtechnikai márka, amely erősítőiről és fejhallgatóiról ismert." },
        { id: 91, name: "Miele", img: "img/l91.png", desc: "Német prémium háztartási gépgyártó, amely mosógépeket, sütőket és porszívókat kínál." },
        { id: 92, name: "Lacoste", img: "img/l92.png", desc: "Francia divatmárka, híres krokodilos logójáról és sportos eleganciájáról." },
        { id: 93, name: "New Balance", img: "img/l93.png", desc: "Amerikai sportszergyártó, amely cipőket és sportruházatot kínál." },
        { id: 94, name: "Tamaris", img: "img/l94.png", desc: "Német cipőmárka, amely női lábbelik széles választékát kínálja." },
        { id: 95, name: "Ray-Ban", img: "img/l95.png", desc: "Amerikai szemüvegmárka, ikonikus napszemüvegeiről ismert." },
        { id: 96, name: "Adobe", img: "img/l96.png", desc: "Amerikai szoftvervállalat, híres Photoshop, Illustrator és Acrobat programjairól." },
        { id: 97, name: "Levi's", img: "img/l97.png", desc: "Amerikai divatmárka, híres farmernadrágjairól és klasszikus stílusáról." },
        { id: 98, name: "Nintendo", img: "img/l98.png", desc: "Japán videojáték-gyártó, híres a Mario és Zelda sorozatokról." },
        { id: 99, name: "Spotify", img: "img/l99.png", desc: "Svéd streaming szolgáltató, amely zenék és podcastok széles választékát kínálja." },
        { id: 100, name: "PayPal", img: "img/l100.png", desc: "Amerikai online fizetési szolgáltató, amely biztonságos tranzakciókat kínál világszerte." },
        { id: 101, name: "DHL", img: "img/l101.png", desc: "Globális logisztikai vállalat, amely csomagszállítási és futárszolgáltatásokat kínál." },
        { id: 102, name: "GLS", img: "img/l102.png", desc: "Európai logisztikai vállalat, amely csomagszállítási szolgáltatásokat nyújt." },
        { id: 103, name: "UPS", img: "img/l103.png", desc: "Amerikai logisztikai vállalat, amely globális csomagszállítási szolgáltatásokat kínál." },
        { id: 104, name: "Canon", img: "img/l104.png", desc: "Japán vállalat, amely fényképezőgépeket, nyomtatókat és optikai eszközöket gyárt." },
        { id: 105, name: "HP", img: "img/l105.png", desc: "Amerikai informatikai vállalat, amely számítógépeket, nyomtatókat és kiegészítőket gyárt." },
        { id: 106, name: "Allianz", img: "img/l106.png", desc: "Német biztosítótársaság, amely globális pénzügyi és biztosítási szolgáltatásokat kínál." },
        { id: 107, name: "IBM", img: "img/l107.png", desc: "Amerikai informatikai vállalat, amely technológiai és tanácsadási szolgáltatásokat nyújt." },
        { id: 108, name: "Douglas", img: "img/l108.png", desc: "Német parfüm- és kozmetikai üzletlánc." },
        { id: 109, name: "Müller", img: "img/l109.png", desc: "Német drogéria- és szupermarketlánc, amely széles termékkínálattal rendelkezik." },
        { id: 110, name: "DM", img: "img/l110.png", desc: "Német drogérialánc, amely kozmetikai, háztartási és egészségügyi termékeket kínál." },
        { id: 111, name: "Lego", img: "img/l111.png", desc: "Dán játékgyártó, híres építőkockáiról és kreatív játékairól." },
        { id: 112, name: "Lidl", img: "img/l112.png", desc: "Német diszkont áruházlánc, amely élelmiszereket és háztartási cikkeket kínál." },
        { id: 113, name: "3M", img: "img/l113.png", desc: "Amerikai multinacionális vállalat, amely innovatív ipari és fogyasztói termékeket gyárt." },
        { id: 114, name: "Huawei", img: "img/l114.png", desc: "Kínai technológiai vállalat, amely okostelefonokat, hálózati berendezéseket és digitális megoldásokat kínál." },
        { id: 115, name: "Sony", img: "img/l115.png", desc: "Japán multinacionális vállalat, amely elektronikai termékeket, szórakoztató tartalmakat és videojátékokat kínál." },
        { id: 116, name: "LG", img: "img/l116.png", desc: "Dél-koreai elektronikai vállalat, amely háztartási gépeket, televíziókat és mobiltelefonokat gyárt." },
        { id: 117, name: "Hisense", img: "img/l117.png", desc: "Kínai elektronikai vállalat, amely televíziókat, háztartási gépeket és mobiltelefonokat gyárt." },
        { id: 118, name: "H&M", img: "img/l118.png", desc: "Svéd divatmárka, amely megfizethető ruházatot és kiegészítőket kínál." },
        { id: 119, name: "Pepsi", img: "img/l119.png", desc: "Amerikai üdítőital-márka, a PepsiCo terméke." },
        { id: 120, name: "KFC", img: "img/l120.png", desc: "Amerikai gyorsétteremlánc, híres csirkés ételeiről." },
        { id: 121, name: "Subway", img: "img/l121.png", desc: "Amerikai gyorsétteremlánc, amely szendvicseket és salátákat kínál." },
        { id: 122, name: "FedEx", img: "img/l122.png", desc: "Amerikai logisztikai vállalat, amely csomagszállítási és futárszolgáltatásokat kínál." },
        { id: 123, name: "Santander", img: "img/l123.png", desc: "A Banco Santander spanyol multinacionális bankcsoport, amely Európa, Észak- és Dél-Amerika egyik legnagyobb pénzügyi szolgáltatója. Széles körben kínál lakossági, vállalati és befektetési banki szolgáltatásokat, valamint digitális megoldásokat." },
        { id: 124, name: "Kia", img: "img/l124.png", desc: "Dél-koreai autógyártó, amely megfizethető és megbízható járműveiről ismert." },
        { id: 125, name: "eBay", img: "img/l125.png", desc: "Amerikai online piactér, ahol felhasználók termékeket vásárolhatnak és árverezhetnek." },
        { id: 126, name: "Pampers", img: "img/l126.png", desc: "A Procter & Gamble pelenkamárkája, amely világszerte ismert a babatermékek piacán." },
        { id: 127, name: "Gillette", img: "img/l127.png", desc: "Amerikai borotvamárka, híres férfi és női borotvatermékeiről." },
        { id: 128, name: "Makita", img: "img/l128.png", desc: "Japán szerszámgyártó, amely elektromos kéziszerszámokat és ipari berendezéseket kínál." },
        { id: 129, name: "Hilti", img: "img/l129.png", desc: "Liechtensteini szerszámgyártó, amely építőipari eszközöket és megoldásokat kínál." },
        { id: 130, name: "Acer", img: "img/l130.png", desc: "Tajvani informatikai vállalat, amely laptopokat, monitorokat és számítástechnikai eszközöket gyárt." },
        { id: 131, name: "Kenwood", img: "img/l131.png", desc: "Brit elektronikai márka, híres konyhai robotgépeiről és audioeszközeiről." },
        { id: 132, name: "Lay's", img: "img/l132.png", desc: "Amerikai chipsmárka, a PepsiCo terméke." },
        { id: 133, name: "Chio", img: "img/l133.png", desc: "Német snackmárka, amely chips és ropogtatnivalók széles választékát kínálja." },
        { id: 134, name: "Univer", img: "img/l134.png", desc: "Magyar élelmiszergyártó, híres mustárjairól, szószairól és fűszereiről." },
        { id: 135, name: "Harley Davidson", img: "img/l135.png", desc: "Amerikai motorkerékpár-gyártó, ikonikus chopper stílusú motorjairól ismert." },
        { id: 136, name: "Brendon", img: "img/l136.png", desc: "Magyar bababolt-hálózat, amely babatermékeket és kiegészítőket kínál." },
        { id: 137, name: "Renault", img: "img/l137.png", desc: "Francia autógyártó, amely széles választékban kínál személyautókat és haszongépjárműveket." },
        { id: 138, name: "Asus", img: "img/l138.png", desc: "Tajvani informatikai vállalat, amely laptopokat, alaplapokat és gamer eszközöket gyárt." },
        { id: 139, name: "Lenovo", img: "img/l139.png", desc: "Kínai informatikai vállalat, amely laptopokat, PC-ket és okoseszközöket kínál." },
        { id: 140, name: "MSI", img: "img/l140.png", desc: "Tajvani informatikai vállalat, amely gamer laptopokat, alaplapokat és grafikus kártyákat gyárt." },
        { id: 141, name: "Yahoo", img: "img/l141.png", desc: "Amerikai internetes szolgáltató, híres keresőmotorjáról és e-mail szolgáltatásáról." },
        { id: 142, name: "Meta", img: "img/l142.png", desc: "Amerikai technológiai vállalat, a Facebook, Instagram és WhatsApp tulajdonosa." },
        { id: 143, name: "Sega", img: "img/l143.png", desc: "Japán videojáték-fejlesztő és kiadó, híres Sonic the Hedgehog sorozatáról." },
        { id: 144, name: "Logitech", img: "img/l144.png", desc: "Svájci-amerikai vállalat, amely számítógépes perifériákat és gamer kiegészítőket gyárt." },
        { id: 145, name: "WhatsApp", img: "img/l145.png", desc: "Globális üzenetküldő alkalmazás, amely a Meta Platforms tulajdonában van." },
        { id: 146, name: "Nikon", img: "img/l146.png", desc: "Japán optikai és fényképezőgép-gyártó vállalat." },
        { id: 147, name: "Electrolux", img: "img/l147.png", desc: "Svéd háztartási gépgyártó, amely hűtőket, mosógépeket és konyhai eszközöket kínál." },
        { id: 148, name: "Dell", img: "img/l148.png", desc: "Amerikai informatikai vállalat, amely számítógépeket, laptopokat és szervereket gyárt." },
        { id: 149, name: "Chevrolet", img: "img/l149.png", desc: "Amerikai autógyártó, a General Motors leányvállalata." },
        { id: 150, name: "Pringles", img: "img/l150.png", desc: "Amerikai chipsmárka, híres hengeres csomagolásáról." },
        { id: 151, name: "Starbucks", img: "img/l151.png", desc: "Amerikai kávéházlánc, világszerte ismert kávéitalairól." },
        { id: 152, name: "Milka", img: "img/l152.png", desc: "Svájci csokoládémárka, a Mondelez International terméke." },
        { id: 153, name: "Kinder", img: "img/l153.png", desc: "Olasz édességmárka, híres Kinder tojásairól és csokoládéiról." },
        { id: 154, name: "Android", img: "img/l154.png", desc: "A Google által fejlesztett mobil operációs rendszer." },
        { id: 155, name: "Dyson", img: "img/l155.png", desc: "Brit technológiai vállalat, híres porszívóiról, hajszárítókról és légtisztítókról." },
        { id: 156, name: "Playboy", img: "img/l156.png", desc: "Amerikai életmód- és magazinmárka, híres nyuszis logójáról." },
        { id: 157, name: "Knorr", img: "img/l157.png", desc: "Német élelmiszermárka, amely levesporokat, fűszereket és szószokat kínál." },
        { id: 158, name: "Nescafé", img: "img/l158.png", desc: "A Nestlé instant kávémárkája, világszerte ismert." },
        { id: 159, name: "Danone", img: "img/l159.png", desc: "Francia élelmiszeripari vállalat, amely tejtermékeket, ásványvizet és bébiételeket gyárt." },
        { id: 160, name: "Nivea", img: "img/l160.png", desc: "Német kozmetikai márka, híres bőrápolási termékeiről." },
        { id: 161, name: "GoPro", img: "img/l161.png", desc: "Amerikai akciókamera-gyártó, híres sportkameráiról." },
        { id: 162, name: "Tezenis", img: "img/l162.png", desc: "Olasz divatmárka, amely fehérneműt és ruházatot kínál." },
        { id: 163, name: "John Deere", img: "img/l163.png", desc: "Amerikai mezőgazdasági gépgyártó, híres traktorairól és kombájnjairól." },
        { id: 164, name: "Bose", img: "img/l164.png", desc: "Amerikai hangtechnikai vállalat, híres prémium hangszóróiról és fejhallgatóiról." },
        { id: 165, name: "Tiffany & Co.", img: "img/l165.png", desc: "Amerikai luxus ékszermárka, ikonikus kék dobozairól és gyémántékszereiről ismert." },
        { id: 166, name: "Zeppelin", img: "img/l166.png", desc: "Német óragyártó márka, amely klasszikus stílusú időmérőket kínál." },
        { id: 167, name: "Helly Hansen", img: "img/l167.png", desc: "Norvég ruházati márka, híres outdoor és munkaruházati termékeiről." },
        { id: 168, name: "Jaguar", img: "img/l168.png", desc: "Brit prémium autógyártó, amely sportos és elegáns járműveiről ismert." },
        { id: 169, name: "Casio", img: "img/l169.png", desc: "Japán elektronikai vállalat, híres óráiról, számológépeiről és zenei eszközeiről." },
        { id: 170, name: "Pandora", img: "img/l170.png", desc: "Dán ékszermárka, híres charm karkötőiről és személyre szabható ékszereiről." },
        { id: 171, name: "Swarovski", img: "img/l171.png", desc: "Osztrák luxusmárka, híres kristályékszereiről és dekorációs termékeiről." },
        { id: 172, name: "Citizen", img: "img/l172.png", desc: "Japán óragyártó, híres Eco-Drive technológiájáról." },
        { id: 173, name: "Devergo", img: "img/l173.png", desc: "Magyar divatmárka, amely fiatalos ruházatot és kiegészítőket kínál." },
        { id: 174, name: "Geox", img: "img/l174.png", desc: "Olasz cipőmárka, híres lélegző talpú lábbelijeiről." },
        { id: 175, name: "DKNY", img: "img/l175.png", desc: "Amerikai divatmárka, amely modern és városi stílusú ruházatot kínál." },
        { id: 176, name: "Yves Saint Laurent", img: "img/l176.png", desc: "Francia luxus divatmárka, híres haute couture ruházatáról és parfümjeiről." },
        { id: 177, name: "Lamborghini", img: "img/l177.png", desc: "Olasz luxus sportautógyártó, híres ikonikus szupersportautóiról." },
        { id: 178, name: "Iveco", img: "img/l178.png", desc: "Olasz haszongépjármű-gyártó, amely teherautókat és buszokat kínál." },
        { id: 179, name: "Volvo", img: "img/l179.png", desc: "Svéd autógyártó, híres biztonságos és megbízható járműveiről." },
        { id: 180, name: "MAN", img: "img/l180.png", desc: "Német haszongépjármű-gyártó, amely teherautókat és buszokat kínál." },
        { id: 181, name: "Timberland", img: "img/l181.png", desc: "Amerikai cipő- és ruházati márka, híres bakancsairól." },
        { id: 182, name: "Hello Kitty", img: "img/l182.png", desc: "Japán karakter és márka, a Sanrio tulajdona, világszerte népszerű." },
        { id: 183, name: "Reddit", img: "img/l183.png", desc: "Amerikai közösségi média platform, amely fórumokra épül." },
        { id: 184, name: "Revolut", img: "img/l184.png", desc: "Brit fintech vállalat, amely digitális banki és pénzügyi szolgáltatásokat kínál." },
        { id: 185, name: "Under Armour", img: "img/l185.png", desc: "Amerikai sportszergyártó, híres innovatív sportruházatáról." },
        { id: 186, name: "Cartoon Network", img: "img/l186.png", desc: "Amerikai televíziós csatorna, híres animációs sorozatairól." },
        { id: 187, name: "Vodafone", img: "img/l187.png", desc: "Brit telekommunikációs vállalat, amely mobil- és internetes szolgáltatásokat kínál." },
        { id: 188, name: "Bugatti", img: "img/l188.png", desc: "Francia luxusautógyártó, híres exkluzív sportautóiról." },
        { id: 189, name: "Twitch", img: "img/l189.png", desc: "Amerikai streaming platform, amely videojáték-közvetítésekre és élő tartalmakra épül." },
        { id: 190, name: "Monster", img: "img/l190.png", desc: "Amerikai energiaital-márka, híres extrémsport szponzorációiról." },
        { id: 191, name: "DreamWorks", img: "img/l191.png", desc: "Amerikai filmstúdió, híres animációs és élőszereplős filmjeiről." },
        { id: 192, name: "Warner Bros.", img: "img/l192.png", desc: "Amerikai film- és televíziós stúdió, híres klasszikus és modern produkcióiról." }, 
    ];
    // --- EDDIG TART AZ EGYEDI ADATOK DEFINIÁLÁSA ---
    
    // ----------------------------------------------------------------
    // FÜGGVÉNY: Sebesség és nézet beállítása képernyőméret alapján
    // ----------------------------------------------------------------
    function checkMobileState() {
        isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;

        if (isMobileView) {
            maxSpeed = MOBILE_MAX_SPEED;
            minStartSpeed = MOBILE_MIN_SPEED;
        } else {
            maxSpeed = DESKTOP_MAX_SPEED;
            minStartSpeed = DESKTOP_MIN_SPEED;
        }
        
        // Visszaállítja az összes kártya sebességét az új maximumra
        cardElements.forEach(item => {
            if (!item.isDragging) {
                if (Math.abs(item.vx) > maxSpeed) {
                    item.vx = Math.sign(item.vx) * maxSpeed;
                }
                if (Math.abs(item.vy) > maxSpeed) {
                    item.vy = Math.sign(item.vy) * maxSpeed;
                }
            }
        });
    }

    // 2. Kártyák létrehozása
    const cardElements = [];
    
    // Első futtatás a kezdeti sebesség beállításához
    checkMobileState(); 

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Kártya tartalmának generálása
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/65?text=Logo'">
            <h3>${item.name}</h3>
        `;
        
        // A kártya kezdeti helyének és sebességének beállítása
        const startXRange = 100 - (2 * PADDING_PERCENTAGE_X);
        const startYRange = 100 - (2 * PADDING_PERCENTAGE_Y);

        const x = (Math.random() * startXRange) + PADDING_PERCENTAGE_X; 
        const y = (Math.random() * startYRange) + PADDING_PERCENTAGE_Y; 
        
        const z = Math.random() * (maxZ - minZ) + minZ; 
        
        const vx = ((Math.random() - 0.5) * maxSpeed * 2) + (Math.sign(Math.random() - 0.5) * minStartSpeed);
        const vy = ((Math.random() - 0.5) * maxSpeed * 2) + (Math.sign(Math.random() - 0.5) * minStartSpeed);

        const data = {
            element: card,
            x: x, 
            y: y, 
            baseZ: z, 
            vx: vx, 
            vy: vy, 
            mass: 1, 
            name: item.name.toLowerCase(), 
            originalData: item,
            pixelX: 0, 
            pixelY: 0,
            isDragging: false,
            canClick: true
        };

        // --- EGÉR ÉS ÉRINTÉS ESÉNYKEZELÉS ---
        
        card.addEventListener('mouseenter', () => {
            data.isHovering = true;
            data.element.classList.add('hovering');
            updateDimmedState();
        });

        card.addEventListener('mouseleave', () => {
            data.isHovering = false;
            data.element.classList.remove('hovering');
            updateDimmedState();
        });
        
        card.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; 
            
            e.preventDefault();
            draggedItem = data;
            draggedItem.isDragging = false;
            draggedItem.canClick = true; 
            dragStartX = e.clientX;
            dragStartY = e.clientY;
        });
        
        // Mobilos érintés kezdet
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            draggedItem = data;
            draggedItem.isDragging = false;
            draggedItem.canClick = true; 
            
            const touch = e.touches[0];
            dragStartX = touch.clientX;
            dragStartY = touch.clientY;
        }, { passive: false }); 

        cardElements.push(data);
        container.appendChild(card);
    });
    
    // Globális mozgás és elengedés (document)
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false }); 

    function handleMove(e) {
        if (!draggedItem) return;

        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

        const dx = clientX - dragStartX;
        const dy = clientY - dragStartY;
        
        if (!draggedItem.isDragging) {
            
            if (Math.abs(dx) > dragDistanceThreshold || Math.abs(dy) > dragDistanceThreshold) {
                
                draggedItem.isDragging = true;
                draggedItem.canClick = false; 
                draggedItem.element.classList.add('dragging');
                
                draggedItem.vx = 0;
                draggedItem.vy = 0;
            } else {
                return;
            }
        }
        
        if (draggedItem.isDragging) {
            const cardHalf = cardSize / 2;
            draggedItem.pixelX = clientX - cardHalf;
            draggedItem.pixelY = clientY - cardHalf;
        }
    }


    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    function handleEnd(e) {
        if (!draggedItem) return;
        
        if (draggedItem.canClick && !draggedItem.isDragging) {
             // MODAL MEGJELENÍTÉS AZ EGYEDI ITEM ADATAIVAL
             openModal(draggedItem.originalData);
        }
        
        if (draggedItem.isDragging) {
            draggedItem.element.classList.remove('dragging');
            draggedItem.isDragging = false;
            
            // Sebesség generálása az aktuális maxSpeed értékkel
            const newVx = (Math.random() - 0.5) * maxSpeed; 
            const newVy = (Math.random() - 0.5) * maxSpeed; 
            
            draggedItem.vx = newVx;
            draggedItem.vy = newVy;
        }
        
        draggedItem = null;
    }


    // 3. Segéd-függvények
    
    // Ütközési szögrotációhoz
    function rotate(vx, vy, angle) {
        return {
            vx: vx * Math.cos(angle) + vy * Math.sin(angle),
            vy: vy * Math.cos(angle) - vx * Math.sin(angle)
        };
    }
    
    // Halványítás logikája
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

    // 4. Fizikai adatok és határok
    const cardSize = 110; 
    const navHeight = 70; 
    const collisionDistance = 120; // 110px-es kártyához 120px ütközési távolság

    let P_MIN_X = 0;
    let P_MAX_X = 0;
    let P_MIN_Y = 0;
    let P_MAX_Y = 0;
    
    // Képernyő határainak frissítése
    function calculateBounds(w, h) {
        P_MIN_X = (w * PADDING_PERCENTAGE_X / 100); 
        P_MAX_X = w - (w * PADDING_PERCENTAGE_X / 100) - cardSize; 
        
        P_MIN_Y = navHeight + (h * PADDING_PERCENTAGE_Y / 100); 
        P_MAX_Y = h - (h * PADDING_PERCENTAGE_Y / 100) - cardSize;
    }

    // Kezdeti pozíciók beállítása
    (function initializePositions() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        calculateBounds(w, h);
        
        cardElements.forEach(item => {
            const rangeX = P_MAX_X - P_MIN_X;
            const rangeY = P_MAX_Y - P_MIN_Y;
            
            const normalizedX = (item.x - PADDING_PERCENTAGE_X) / (100 - 2 * PADDING_PERCENTAGE_X);
            const normalizedY = (item.y - PADDING_PERCENTAGE_Y) / (100 - 2 * PADDING_PERCENTAGE_Y);

            item.pixelX = P_MIN_X + (normalizedX * rangeX);
            item.pixelY = P_MIN_Y + (normalizedY * rangeY);
        });
    })();


    // 5. Animációs hurok (Fizikai motor)
    function animate() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        calculateBounds(w, h);

        const minXBound = P_MIN_X;
        const maxXBound = P_MAX_X; 
        const minYBound = P_MIN_Y; 
        const maxYBound = P_MAX_Y; 

        cardElements.forEach(item => {
            
            let pixelX = item.pixelX; 
            let pixelY = item.pixelY;
            
            const currentZ = item.baseZ;
            const currentScale = 1;

            if (item.isDragging) {
                // Drag: a kártya követi az egeret/ujjat a korlátokon belül
                pixelX = Math.max(minXBound, Math.min(maxXBound, pixelX));
                pixelY = Math.max(minYBound, Math.min(maxYBound, pixelY));

                item.pixelX = pixelX;
                item.pixelY = pixelY;

            } else {
                
                // Szabad mozgás
                
                // Sebesség korlátozása (remegés elkerülése és nézet-specifikus sebesség)
                item.vx = Math.min(Math.max(item.vx, -maxSpeed), maxSpeed);
                item.vy = Math.min(Math.max(item.vy, -maxSpeed), maxSpeed);
                
                pixelX += item.vx;
                pixelY += item.vy;

                // Ütközés a keretekkel (élfalak)
                if (pixelX < minXBound) { 
                    item.vx *= -1; 
                    pixelX = minXBound; 
                } else if (pixelX > maxXBound) {
                    item.vx *= -1; 
                    pixelX = maxXBound; 
                }
                
                if (pixelY < minYBound) {
                    item.vy *= -1; 
                    pixelY = minYBound; 
                } else if (pixelY > maxYBound) {
                    item.vy *= -1; 
                    pixelY = maxYBound; 
                }
                
                item.pixelX = pixelX;
                item.pixelY = pixelY;
                
            }
            
            // ----------------------------------------------------------------------------------
            // Kártyák közti ÜTKÖZÉSI FIZIKA (CSAK ASZTALI NÉZETBEN)
            // ----------------------------------------------------------------------------------
            if (!item.isDragging && !isMobileView) { // Ha nem húzzuk ÉS nem mobil nézet
                
                const currentCenter1X = item.pixelX + (cardSize / 2);
                const currentCenter1Y = item.pixelY + (cardSize / 2);

                for (let i = cardElements.indexOf(item) + 1; i < cardElements.length; i++) {
                    const otherItem = cardElements[i];

                    // Csak a látható, nem húzott elemekkel ütköztet
                    if (!item.element.classList.contains('filtered-out') && !otherItem.element.classList.contains('filtered-out') && !otherItem.isDragging) {
                        
                        const currentCenter2X = otherItem.pixelX + (cardSize / 2);
                        const currentCenter2Y = otherItem.pixelY + (cardSize / 2);

                        const dx = currentCenter2X - currentCenter1X;
                        const dy = currentCenter2Y - currentCenter1Y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        // Ütközés történt
                        if (distance < collisionDistance) {
                            
                            // Ütközési fizika (2D rugalmas ütközés 1D-re redukálva)
                            const angle = Math.atan2(dy, dx);
                            
                            const v1 = rotate(item.vx, item.vy, angle);
                            const v2 = rotate(otherItem.vx, otherItem.vy, angle);
                            
                            // Cseréjük a sebességeket az ütközési tengelyen
                            const u1 = v1.vx;
                            const u2 = v2.vx;
                            v1.vx = u2; 
                            v2.vx = u1;
                            
                            // Visszaforgatás a globális koordinátarendszerbe
                            const finalV1 = rotate(v1.vx, v1.vy, -angle);
                            const finalV2 = rotate(v2.vx, v2.vy, -angle);
                            
                            item.vx = finalV1.vx;
                            item.vy = finalV1.vy;
                            otherItem.vx = finalV2.vx;
                            otherItem.vy = finalV2.vy;
                            
                            // Elválasztás (Átfedés megszüntetése)
                            const overlap = collisionDistance - distance;
                            const separation = overlap / 2;
                            
                            item.pixelX -= (separation * Math.cos(angle));
                            item.pixelY -= (separation * Math.sin(angle));
                            otherItem.pixelX += (separation * Math.cos(angle));
                            otherItem.pixelY += (separation * Math.sin(angle));
                            
                            // Ütközés utáni sebesség korlátozása (stabilitás)
                            item.vx = Math.min(Math.max(item.vx, -maxSpeed), maxSpeed);
                            item.vy = Math.min(Math.max(item.vy, -maxSpeed), maxSpeed);
                            otherItem.vx = Math.min(Math.max(otherItem.vx, -maxSpeed), maxSpeed);
                            otherItem.vy = Math.min(Math.max(otherItem.vy, -maxSpeed), maxSpeed);
                        }
                    }
                }
            } 
            // ----------------------------------------------------------------------------------

            // Stílus alkalmazása
            item.element.style.transform = `translate3d(${item.pixelX}px, ${item.pixelY}px, ${currentZ}px) scale(${currentScale})`;
            item.element.style.top = '0'; 
            item.element.style.left = '0';
        });

        requestAnimationFrame(animate);
    }

    animate();
    
    // 7. Keresés
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        cardElements.forEach(item => {
            const isMatch = item.name.includes(searchTerm);
            
            if (searchTerm === "") {
                item.element.classList.remove('filtered-out');
                item.element.style.pointerEvents = 'all';
            } else if (isMatch) {
                item.element.classList.remove('filtered-out');
                item.element.style.pointerEvents = 'all';
                // Szűréskor a Z tengelyt nullázzuk a jobb láthatóság érdekében
                item.element.style.transform = `translate3d(${item.pixelX}px, ${item.pixelY}px, 0px) scale(1)`; 
            } else {
                item.element.classList.add('filtered-out');
            }
        });
        
        // Pointer események kezelése, hogy csak a találatok legyenek aktívak keresés közben
        if (searchTerm !== "") {
            cardElements.forEach(item => {
                const isMatch = item.name.includes(searchTerm);
                item.element.style.pointerEvents = isMatch ? 'all' : 'none';
            });
        }
        
        updateDimmedState();
    });

    // 8. Modal Funkciók
    function openModal(item) {
        document.getElementById('modal-img').src = item.img; 
        document.getElementById('modal-title').innerText = item.name;
        document.getElementById('modal-desc').innerText = item.desc;
        
        modal.classList.add('active');
        
        // Kikapcsoljuk az interakciót a háttérrel
        container.style.pointerEvents = 'none';
        cardElements.forEach(item => {
            item.element.style.pointerEvents = 'none';
        });
        document.body.style.overflow = 'hidden'; 
    }

    function closeModal() {
        modal.classList.remove('active');
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Visszaállítjuk az interakciót a keresési állapottól függően
        if (searchTerm === "") {
            container.style.pointerEvents = 'all'; 
            cardElements.forEach(item => {
                item.element.style.pointerEvents = 'all';
            });
            
        } else {
            container.style.pointerEvents = 'none'; 
            cardElements.forEach(item => {
                const isMatch = item.name.includes(searchTerm);
                item.element.style.pointerEvents = isMatch ? 'all' : 'none';
            });
        }
        
        document.body.style.overflow = 'hidden'; 
    }

    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 9. HAMBURGER FUNKCIÓ
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            container.style.pointerEvents = 'none';
        } else {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === "") {
                container.style.pointerEvents = 'all';
            } else {
                container.style.pointerEvents = 'none'; 
            }
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Ablak átméretezés kezelése
    window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        calculateBounds(w, h);
        checkMobileState(); // Meghívjuk a sebesség és nézet ellenőrzését
    });
};