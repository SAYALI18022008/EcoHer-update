/* EcoHer frontend-only prototype. Demo authentication and records live in localStorage. */
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const STORE = {
    users:"ecoh_v2_users", session:"ecoh_v2_session", language:"ecoh_v2_language",
    products:"ecoh_v2_products", cart:"ecoh_v2_cart", favorites:"ecoh_v2_favorites",
    orders:"ecoh_v2_orders", transactions:"ecoh_v2_transactions", requests:"ecoh_v2_requests",
    chats:"ecoh_v2_chats", privacy:"ecoh_v2_privacy", profile:"ecoh_v2_profiles"
  };
  const safeGet = (key, fallback) => { try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const uid = () => Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-4);
  const rupees = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(n)||0);
  let language = localStorage.getItem(STORE.language) || "en";
  let currentSection = "overview";
  let activeModal = null;
  let toastTimer;
  const copy = {
    en:{navHome:"Home",navMarket:"Marketplace",navMentors:"Mentorship",navAbout:"Our purpose",login:"Log in",join:"Join EcoHer",heroEyebrow:"A community for women who build",heroTitle:"Small businesses.<br><em>Lasting impact.</em>",heroText:"A place for women entrepreneurs to grow with trusted mentorship, conscious customers, and a community that believes in their work.",heroCta:"Start your journey",exploreMarket:"Explore the marketplace",communityLine:"Made for women-led businesses",communitySub:"Local roots. Shared growth. Better choices.",searchPlaceholder:"Search products or businesses",registerTitle:"Join the EcoHer community",loginTitle:"Welcome back",registerIntro:"Create a demo account to explore the platform.",loginIntro:"Log in with the account you registered on this browser.",fullName:"Full name",email:"Email address",mobile:"Mobile number",city:"City",state:"State",language:"Preferred language",password:"Password",confirmPassword:"Confirm password",role:"I want to join as",entrepreneur:"Entrepreneur",mentor:"Mentor",customer:"Customer",businessName:"Business name",category:"Business category",sustainability:"Sustainability category",businessLocation:"Business location",expertise:"Areas of expertise",experience:"Years of experience",languages:"Languages spoken",availability:"Availability",createAccount:"Create account",haveAccount:"Already have an account?",needAccount:"New to EcoHer?",dashboard:"Dashboard",overview:"Overview",myProducts:"My products",finance:"Sales & expenses",coach:"AI Business Coach",impact:"Impact records",privacy:"Security & privacy",mentorship:"Mentorship requests",market:"Marketplace",cart:"My cart",orders:"Order history",logout:"Log out",welcome:"Welcome",revenue:"Total revenue",expenses:"Total expenses",profit:"Estimated profit",addProduct:"Add product",productName:"Product name",description:"Description",price:"Price (₹)",stock:"Stock quantity",materials:"Materials used",production:"Production method",packaging:"Packaging type",evidence:"Sustainability evidence",saveProduct:"Save product",verifyTitle:"Sustainability information",submitInfo:"Submit information",pending:"Basic review pending",submitted:"Information submitted",addSale:"Add sale",addExpense:"Add expense",amount:"Amount (₹)",date:"Date",note:"Description",record:"Add record",sendRequest:"Request mentorship",addCart:"Add to cart",details:"View details",favorite:"Save",checkout:"Demo checkout",placeOrder:"Place demo order",total:"Total",emptyCart:"Your cart is empty.",askCoach:"Ask EcoHer Coach…",send:"Send",clearChat:"Clear chat",profile:"Business profile",saveChanges:"Save changes",profileVisibility:"Show business profile publicly",hideContact:"Hide personal contact details",publicContact:"Use business contact on public page",blockUser:"Block user",report:"Report activity",requestSent:"Mentorship request sent (demo).",noItems:"Nothing here yet. Add your first item to get started.",sample:"DEMO",cityAll:"All cities",categoryAll:"All categories"},
    hi:{navHome:"होम",navMarket:"मार्केटप्लेस",navMentors:"मार्गदर्शन",navAbout:"हमारा उद्देश्य",login:"लॉग इन",join:"EcoHer से जुड़ें",heroEyebrow:"आगे बढ़ने वाली महिलाओं का समुदाय",heroTitle:"छोटे व्यवसाय।<br><em>बड़ा प्रभाव।</em>",heroText:"महिला उद्यमियों के लिए मार्गदर्शन, जागरूक ग्राहक और सहयोगी समुदाय के साथ आगे बढ़ने की जगह।",heroCta:"अपनी यात्रा शुरू करें",exploreMarket:"मार्केटप्लेस देखें",communityLine:"महिलाओं के व्यवसायों के लिए",communitySub:"स्थानीय जुड़ाव। साझा प्रगति। बेहतर विकल्प।",searchPlaceholder:"उत्पाद या व्यवसाय खोजें",registerTitle:"EcoHer समुदाय से जुड़ें",loginTitle:"वापस स्वागत है",registerIntro:"प्लेटफ़ॉर्म देखने के लिए डेमो खाता बनाएँ।",loginIntro:"इस ब्राउज़र में पंजीकृत खाते से लॉग इन करें।",fullName:"पूरा नाम",email:"ईमेल",mobile:"मोबाइल नंबर",city:"शहर",state:"राज्य",language:"पसंदीदा भाषा",password:"पासवर्ड",confirmPassword:"पासवर्ड की पुष्टि करें",role:"आप किस रूप में जुड़ना चाहते हैं?",entrepreneur:"उद्यमी",mentor:"मार्गदर्शक",customer:"ग्राहक",businessName:"व्यवसाय का नाम",category:"व्यवसाय श्रेणी",sustainability:"स्थिरता श्रेणी",businessLocation:"व्यवसाय का स्थान",expertise:"विशेषज्ञता के क्षेत्र",experience:"अनुभव के वर्ष",languages:"बोली जाने वाली भाषाएँ",availability:"उपलब्धता",createAccount:"खाता बनाएँ",haveAccount:"पहले से खाता है?",needAccount:"EcoHer पर नए हैं?",dashboard:"डैशबोर्ड",overview:"अवलोकन",myProducts:"मेरे उत्पाद",finance:"बिक्री और खर्च",coach:"AI बिज़नेस कोच",impact:"प्रभाव रिकॉर्ड",privacy:"सुरक्षा और गोपनीयता",mentorship:"मार्गदर्शन अनुरोध",market:"मार्केटप्लेस",cart:"मेरी कार्ट",orders:"ऑर्डर इतिहास",logout:"लॉग आउट",welcome:"स्वागत है",revenue:"कुल आय",expenses:"कुल खर्च",profit:"अनुमानित लाभ",addProduct:"उत्पाद जोड़ें",productName:"उत्पाद का नाम",description:"विवरण",price:"कीमत (₹)",stock:"स्टॉक मात्रा",materials:"उपयोग की सामग्री",production:"उत्पादन विधि",packaging:"पैकेजिंग",evidence:"स्थिरता का प्रमाण",saveProduct:"उत्पाद सहेजें",verifyTitle:"स्थिरता की जानकारी",submitInfo:"जानकारी जमा करें",pending:"बुनियादी समीक्षा लंबित",submitted:"जानकारी जमा की गई",addSale:"बिक्री जोड़ें",addExpense:"खर्च जोड़ें",amount:"राशि (₹)",date:"तारीख",note:"विवरण",record:"रिकॉर्ड जोड़ें",sendRequest:"मार्गदर्शन माँगें",addCart:"कार्ट में जोड़ें",details:"विवरण देखें",favorite:"पसंदीदा",checkout:"डेमो चेकआउट",placeOrder:"डेमो ऑर्डर करें",total:"कुल",emptyCart:"आपकी कार्ट खाली है।",askCoach:"EcoHer Coach से पूछें…",send:"भेजें",clearChat:"चैट साफ़ करें",profile:"व्यवसाय प्रोफ़ाइल",saveChanges:"बदलाव सहेजें",profileVisibility:"व्यवसाय प्रोफ़ाइल सार्वजनिक दिखाएँ",hideContact:"व्यक्तिगत संपर्क छिपाएँ",publicContact:"सार्वजनिक पेज पर व्यवसाय संपर्क दिखाएँ",blockUser:"उपयोगकर्ता ब्लॉक करें",report:"गतिविधि रिपोर्ट करें",requestSent:"मार्गदर्शन अनुरोध भेजा गया (डेमो)।",noItems:"अभी कुछ नहीं है। शुरू करने के लिए पहला आइटम जोड़ें।",sample:"डेमो",cityAll:"सभी शहर",categoryAll:"सभी श्रेणियाँ"},
    mr:{navHome:"मुख्यपृष्ठ",navMarket:"बाजार",navMentors:"मार्गदर्शन",navAbout:"आमचा उद्देश",login:"लॉग इन",join:"EcoHer मध्ये सामील व्हा",heroEyebrow:"उद्योजक महिलांचा समुदाय",heroTitle:"लहान व्यवसाय.<br><em>मोठा प्रभाव.</em>",heroText:"महिला उद्योजकांना मार्गदर्शन, जागरूक ग्राहक आणि सहकार्य करणाऱ्या समुदायासोबत वाढण्याची जागा.",heroCta:"तुमचा प्रवास सुरू करा",exploreMarket:"बाजार पाहा",communityLine:"महिला-नेतृत्वाखालील व्यवसायांसाठी",communitySub:"स्थानिक नाती. सामायिक प्रगती. चांगले पर्याय.",searchPlaceholder:"उत्पादने किंवा व्यवसाय शोधा",registerTitle:"EcoHer समुदायात सामील व्हा",loginTitle:"पुन्हा स्वागत आहे",registerIntro:"प्लॅटफॉर्म पाहण्यासाठी डेमो खाते तयार करा.",loginIntro:"या ब्राउझरमध्ये नोंदवलेल्या खात्याने लॉग इन करा.",fullName:"पूर्ण नाव",email:"ईमेल",mobile:"मोबाइल क्रमांक",city:"शहर",state:"राज्य",language:"आवडती भाषा",password:"पासवर्ड",confirmPassword:"पासवर्डची पुष्टी",role:"तुम्हाला कोणत्या भूमिकेत सामील व्हायचे आहे?",entrepreneur:"उद्योजक",mentor:"मार्गदर्शक",customer:"ग्राहक",businessName:"व्यवसायाचे नाव",category:"व्यवसाय श्रेणी",sustainability:"शाश्वतता श्रेणी",businessLocation:"व्यवसायाचे ठिकाण",expertise:"कौशल्याची क्षेत्रे",experience:"अनुभवाची वर्षे",languages:"बोलल्या जाणाऱ्या भाषा",availability:"उपलब्धता",createAccount:"खाते तयार करा",haveAccount:"आधीच खाते आहे?",needAccount:"EcoHer वर नवीन आहात?",dashboard:"डॅशबोर्ड",overview:"आढावा",myProducts:"माझी उत्पादने",finance:"विक्री आणि खर्च",coach:"AI व्यवसाय मार्गदर्शक",impact:"प्रभाव नोंदी",privacy:"सुरक्षा आणि गोपनीयता",mentorship:"मार्गदर्शन विनंत्या",market:"बाजार",cart:"माझी कार्ट",orders:"ऑर्डर इतिहास",logout:"लॉग आउट",welcome:"स्वागत",revenue:"एकूण उत्पन्न",expenses:"एकूण खर्च",profit:"अंदाजित नफा",addProduct:"उत्पादन जोडा",productName:"उत्पादनाचे नाव",description:"वर्णन",price:"किंमत (₹)",stock:"साठा",materials:"वापरलेले साहित्य",production:"उत्पादन पद्धत",packaging:"पॅकेजिंग",evidence:"शाश्वततेचा पुरावा",saveProduct:"उत्पादन जतन करा",verifyTitle:"शाश्वततेची माहिती",submitInfo:"माहिती सादर करा",pending:"मूलभूत तपासणी प्रलंबित",submitted:"माहिती सादर केली",addSale:"विक्री जोडा",addExpense:"खर्च जोडा",amount:"रक्कम (₹)",date:"तारीख",note:"वर्णन",record:"नोंद जोडा",sendRequest:"मार्गदर्शन मागा",addCart:"कार्टमध्ये जोडा",details:"तपशील पाहा",favorite:"आवडते",checkout:"डेमो चेकआउट",placeOrder:"डेमो ऑर्डर द्या",total:"एकूण",emptyCart:"तुमची कार्ट रिकामी आहे.",askCoach:"EcoHer Coach ला विचारा…",send:"पाठवा",clearChat:"चॅट साफ करा",profile:"व्यवसाय प्रोफाइल",saveChanges:"बदल जतन करा",profileVisibility:"व्यवसाय प्रोफाइल सार्वजनिक दाखवा",hideContact:"वैयक्तिक संपर्क लपवा",publicContact:"सार्वजनिक पेजवर व्यवसाय संपर्क दाखवा",blockUser:"वापरकर्ता ब्लॉक करा",report:"क्रियाकलाप नोंदवा",requestSent:"मार्गदर्शन विनंती पाठवली (डेमो).",noItems:"अजून काही नाही. सुरुवात करण्यासाठी पहिली नोंद जोडा.",sample:"डेमो",cityAll:"सर्व शहरे",categoryAll:"सर्व श्रेणी"}
  };
  const t = key => (copy[language] && copy[language][key]) || copy.en[key] || key;
  const demoProducts = [
    {id:"demo1",owner:"demoA",name:"Indigo Everyday Tote",description:"A sturdy everyday carryall inspired by traditional Indian textile motifs.",price:549,stock:14,category:"Accessories",city:"Pune",state:"Maharashtra",business:"Aarohi Loom Studio",materials:"Cotton canvas, natural dyes",production:"Small-batch stitching",packaging:"Recycled paper wrap",evidence:"Maker describes cotton canvas and paper wrap; independent verification has not occurred.",status:"Basic Review Pending",icon:"👜"},
    {id:"demo2",owner:"demoB",name:"Hand-block Table Runner",description:"A hand-printed runner made in small batches with traditional block-printing techniques.",price:899,stock:8,category:"Textiles",city:"Jaipur",state:"Rajasthan",business:"Mitti & Thread",materials:"Cotton fabric, block-print pigment",production:"Hand block printing",packaging:"Paper sleeve",evidence:"Product materials submitted by demo seller.",status:"Information Submitted",icon:"🧵"},
    {id:"demo3",owner:"demoC",name:"Neem & Tulsi Soap Set",description:"A small-batch personal-care gift set with a simple ingredient story.",price:399,stock:20,category:"Personal care",city:"Nashik",state:"Maharashtra",business:"Nisarga Botanics",materials:"Plant oils, neem, tulsi",production:"Small-batch cold process",packaging:"Paper carton",evidence:"Ingredient information provided by demo seller; claims are not independently verified.",status:"Community Review Pending",icon:"🌿"},
    {id:"demo4",owner:"demoD",name:"Upcycled Fabric Pouch",description:"A useful zip pouch made from leftover textile pieces, so each one has its own pattern.",price:299,stock:11,category:"Accessories",city:"Mumbai",state:"Maharashtra",business:"ReWeave Collective",materials:"Upcycled fabric offcuts, zipper",production:"Patchwork and machine stitching",packaging:"Reusable cloth sleeve",evidence:"Seller states fabric offcuts are reused; independent verification has not occurred.",status:"Basic Review Pending",icon:"🪡"},
    {id:"demo5",owner:"demoE",name:"Terracotta Planter Pair",description:"Earthy planters for a windowsill herb garden or a sunny balcony.",price:699,stock:6,category:"Home decor",city:"Delhi",state:"Delhi",business:"Dharti Home",materials:"Terracotta clay",production:"Hand shaped and kiln fired",packaging:"Reused corrugated paper",evidence:"Materials and packaging details submitted by demo seller.",status:"Information Submitted",icon:"🏺"},
    {id:"demo6",owner:"demoF",name:"Reusable Produce Bags",description:"A lightweight set for market trips and keeping produce organised.",price:349,stock:17,category:"Accessories",city:"Pune",state:"Maharashtra",business:"Sakhi Everyday",materials:"Cotton mesh",production:"Cut and stitched in small batches",packaging:"No additional plastic stated by seller",evidence:"Seller-provided packaging description; not independently verified.",status:"Partner Verification Pending",icon:"🥬"},
    {id:"demo7",owner:"demoG",name:"Handmade Journal",description:"A tactile journal with a recycled-paper cover and hand-stitched binding.",price:449,stock:9,category:"Home decor",city:"Mumbai",state:"Maharashtra",business:"Paper Petal Works",materials:"Recycled paper, cotton thread",production:"Hand-stitched binding",packaging:"Paper wrap",evidence:"Recycled-paper detail is seller-submitted and awaits review.",status:"Information Submitted",icon:"📔"},
    {id:"demo8",owner:"demoH",name:"Everyday Cotton Scarf",description:"A versatile soft scarf in earthy tones, made in a small artisan batch.",price:799,stock:5,category:"Textiles",city:"Jaipur",state:"Rajasthan",business:"Gulabi Craft House",materials:"Cotton",production:"Small-batch textile finishing",packaging:"Paper sleeve",evidence:"Materials details supplied by demo seller; not certified.",status:"Basic Review Pending",icon:"🧣"}
  ];
  const demoMentors = [
    {id:"m1",name:"Ananya Deshmukh",role:"Brand & storytelling",city:"Pune",languages:"Marathi, Hindi, English",experience:"8 years",initials:"अ",image:"indian-women-hero.png",about:"Helps early-stage founders tell a clear story and build a memorable local brand."},
    {id:"m2",name:"Meera Kulkarni",role:"Finance & pricing",city:"Mumbai",languages:"Hindi, English, Marathi",experience:"10 years",initials:"म",image:"women-community.png",about:"Supports small businesses with pricing, cash-flow habits, and practical planning."},
    {id:"m3",name:"Kavya Sharma",role:"Sustainable product design",city:"Jaipur",languages:"Hindi, English",experience:"6 years",initials:"क",image:"indian-women-hero.png",about:"Works with makers on materials, packaging choices, and thoughtful product presentation."}
  ];
  function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2800)}
  function esc(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function users(){return safeGet(STORE.users,[])}
  function session(){return safeGet(STORE.session,null)}
  function activeUser(){const s=session();return s?users().find(u=>u.id===s.userId)||null:null}
  function allProducts(){const saved=safeGet(STORE.products,[]);return [...saved,...demoProducts]}
  function ownProducts(){const u=activeUser();return u?safeGet(STORE.products,[]).filter(p=>p.owner===u.id):[]}
  function cart(){return safeGet(STORE.cart,{})}
  function userKey(base){const u=activeUser();return `${base}_${u?u.id:"guest"}`}
  function ownedRecords(key){return safeGet(key,[])}
  function setOwnedRecords(key,arr){save(key,arr)}
  function fmtStatus(status){const approved=status==="Verification Approved";return `<span class="status ${approved?"approved":""}">${esc(status||"Information Submitted")}</span>`}
  function showModal(html,wide=false){activeModal=true;$("#modalRoot").innerHTML=`<div class="modal-backdrop" id="modalBackdrop"><section class="modal ${wide?"modal-wide":""}" role="dialog" aria-modal="true">${html}<button class="modal-close" data-action="closeModal" aria-label="Close dialog">×</button></section></div>`;$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});}
  function closeModal(){activeModal=null;$("#modalRoot").innerHTML=""}
  function setLanguage(lang){language=lang;localStorage.setItem(STORE.language,lang);$("#languageSelect").value=lang;$$("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(copy[lang]?.[key])el.innerHTML=copy[lang][key]});$$("[data-i18n-placeholder]").forEach(el=>{const key=el.dataset.i18nPlaceholder;if(copy[lang]?.[key])el.placeholder=copy[lang][key]});renderProducts();renderMentors();if(activeUser()&&location.hash==="#dashboard")renderDashboard();toast(lang==="hi"?"भाषा बदल दी गई":lang==="mr"?"भाषा बदलली":"Language updated")}
  function openAuth(mode="register"){
    const isReg=mode==="register";
    showModal(`<div class="eyebrow"><span class="eyebrow-line"></span> ECOHER · DEMO ACCOUNT</div><h2>${t(isReg?"registerTitle":"loginTitle")}</h2><p class="modal-intro">${t(isReg?"registerIntro":"loginIntro")}</p>
    <form id="authForm"><div class="form-grid">
      ${isReg?`<div class="field"><label>${t("fullName")} *</label><input name="name" required autocomplete="name"></div>`:""}
      <div class="field"><label>${t("email")} *</label><input name="email" type="email" required autocomplete="email"></div>
      ${isReg?`<div class="field"><label>${t("mobile")} *</label><input name="mobile" inputmode="numeric" pattern="[0-9]{10}" minlength="10" maxlength="10" required></div><div class="field"><label>${t("city")} *</label><input name="city" required></div><div class="field"><label>${t("state")} *</label><input name="state" required></div><div class="field"><label>${t("language")}</label><select name="preferredLanguage"><option>English</option><option>Hindi</option><option>Marathi</option></select></div><div class="field full"><label>${t("role")} *</label><select name="role" id="roleSelect" required><option value="entrepreneur">${t("entrepreneur")}</option><option value="mentor">${t("mentor")}</option><option value="customer">${t("customer")}</option></select></div><div id="roleFields" class="field full"></div>`:""}
      <div class="field"><label>${t("password")} *</label><input name="password" type="password" minlength="6" required autocomplete="${isReg?"new-password":"current-password"}"></div>
      ${isReg?`<div class="field"><label>${t("confirmPassword")} *</label><input name="confirmPassword" type="password" minlength="6" required autocomplete="new-password"></div>`:""}
    </div><div id="authError" class="form-error" role="alert"></div><div class="form-footer"><small>${isReg?t("haveAccount"):t("needAccount")} <a href="#" data-action="${isReg?"login":"register"}">${isReg?t("login"):t("join")}</a></small><button class="btn btn-primary" type="submit">${t(isReg?"createAccount":"login")} ↗</button></div></form>`);
    const roleSelect=$("#roleSelect"),roleFields=$("#roleFields");
    function drawRoleFields(){if(!roleFields)return;const role=roleSelect.value;roleFields.innerHTML=role==="entrepreneur"?`<div class="form-grid"><div class="field"><label>${t("businessName")} *</label><input name="businessName" required></div><div class="field"><label>${t("category")} *</label><select name="businessCategory" required><option>Textiles</option><option>Home decor</option><option>Personal care</option><option>Accessories</option><option>Food</option><option>Other</option></select></div><div class="field"><label>${t("sustainability")} *</label><select name="sustainabilityCategory" required><option>Upcycled materials</option><option>Natural materials</option><option>Reusable products</option><option>Low-waste production</option><option>Other / still exploring</option></select></div><div class="field"><label>${t("businessLocation")} *</label><input name="businessLocation" required placeholder="City, State"></div></div>`:role==="mentor"?`<div class="form-grid"><div class="field"><label>${t("expertise")} *</label><input name="expertise" required></div><div class="field"><label>${t("experience")} *</label><input name="experience" type="number" min="0" max="70" required></div><div class="field"><label>${t("languages")} *</label><input name="languages" required placeholder="Hindi, Marathi, English"></div><div class="field"><label>${t("availability")} *</label><select name="availability" required><option>Weekday evenings</option><option>Weekends</option><option>Flexible</option></select></div></div>`:"";}
    drawRoleFields();if(roleSelect)roleSelect.addEventListener("change",drawRoleFields);
    $("#authForm").addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(e.currentTarget),email=String(fd.get("email")).trim().toLowerCase(),password=String(fd.get("password"));const err=$("#authError");
      if(isReg){if(password!==fd.get("confirmPassword")){err.textContent="Passwords do not match.";return}if(password.length<6){err.textContent="Use at least 6 characters for your password.";return}if(users().some(u=>u.email===email)){err.textContent="An account with this email already exists. Please log in.";return}
        const role=fd.get("role"),u={id:uid(),name:String(fd.get("name")).trim(),email,mobile:String(fd.get("mobile")),city:String(fd.get("city")).trim(),state:String(fd.get("state")).trim(),preferredLanguage:fd.get("preferredLanguage"),password,role,createdAt:new Date().toISOString()};
        if(role==="entrepreneur")Object.assign(u,{businessName:fd.get("businessName"),businessCategory:fd.get("businessCategory"),sustainabilityCategory:fd.get("sustainabilityCategory"),businessLocation:fd.get("businessLocation")});
        if(role==="mentor")Object.assign(u,{expertise:fd.get("expertise"),experience:Number(fd.get("experience")),languages:fd.get("languages"),availability:fd.get("availability")});
        const arr=users();arr.push(u);save(STORE.users,arr);save(STORE.session,{userId:u.id,createdAt:new Date().toISOString()});save(userKey(STORE.profile),{businessName:u.businessName||"",founderName:u.name,city:u.city,state:u.state,category:u.businessCategory||"",story:"",materials:"",production:"",packaging:"",womenSupported:0,public:true,hideContact:true});closeModal();toast("Account created. This is a local demo account.");location.hash="#dashboard";renderDashboard();
      }else{const u=users().find(x=>x.email===email&&x.password===password);if(!u){err.textContent="Account not found or password incorrect. Register first if you are new.";return}save(STORE.session,{userId:u.id,createdAt:new Date().toISOString()});closeModal();toast("Logged in successfully.");location.hash="#dashboard";renderDashboard()}
    });
  }
  function productImage(product){const imgs={"Textiles":"textile-products.png","Home decor":"botanical-products.png","Personal care":"botanical-products.png","Accessories":"textile-products.png"};return product.image||imgs[product.category]||"textile-products.png"}
  function productCard(p){const fav=safeGet(userKey(STORE.favorites),[]).includes(p.id);return `<article class="product-card"><div class="product-photo"><div class="photo-fallback">${esc(p.icon||"✳")}</div><img src="${esc(productImage(p))}" alt="${esc(p.name)} made by a women-led small business" loading="lazy" onload="this.previousElementSibling.style.display='none'" onerror="this.style.display='none'"><span class="product-tag">${esc(p.category)}</span><button class="heart-btn" data-action="favorite" data-id="${esc(p.id)}" aria-label="Save favourite">${fav?"♥":"♡"}</button></div><div class="product-info"><div class="maker">${esc(p.business||"EcoHer demo business")}</div><h3>${esc(p.name)}</h3><div class="city-label">${esc(p.city)}, ${esc(p.state)}</div><div class="verified-label"><span class="verified-dot"></span>${esc(p.status||"Information Submitted")}</div><div class="product-meta"><span class="price">${rupees(p.price)}</span><span class="city-label">${Number(p.stock)>0?`${p.stock} available`:"Out of stock"}</span></div><div class="product-bottom"><button class="btn btn-outline" data-action="details" data-id="${esc(p.id)}">${t("details")}</button><button class="btn btn-primary" data-action="addCart" data-id="${esc(p.id)}" ${Number(p.stock)<=0?"disabled":""}>+ ${t("addCart")}</button></div></div></article>`}
  function renderProducts(){const grid=$("#productGrid");if(!grid)return;const q=($("#marketSearch")?.value||"").toLowerCase(),city=$("#cityFilter")?.value||"",cat=$("#categoryFilter")?.value||"";const filtered=allProducts().filter(p=>(!q||`${p.name} ${p.business} ${p.description}`.toLowerCase().includes(q))&&(!city||p.city===city)&&(!cat||p.category===cat));grid.innerHTML=filtered.length?filtered.slice(0,8).map(productCard).join():`<div class="empty-state">No products match those filters. Try another search.</div>`}
  function renderMentors(){const grid=$("#mentorGrid");if(!grid)return;grid.innerHTML=demoMentors.map(m=>`<article class="mentor-card"><div class="mentor-avatar"><img src="${esc(m.image)}" alt="Portrait of ${esc(m.name)}, Indian woman mentor" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${esc(m.initials)}'"></div><div><h3>${esc(m.name)}</h3><div class="mentor-role">${esc(m.role)}</div><p>${esc(m.about)}</p><p>⌖ ${esc(m.city)} · ${esc(m.languages)}</p><button class="btn btn-outline" data-action="mentorRequest" data-id="${m.id}">${t("sendRequest")} →</button></div></article>`).join("")}
  function detailProduct(id){const p=allProducts().find(x=>x.id===id);if(!p)return;showModal(`<div class="product-detail"><div class="detail-art">${esc(p.icon||"✳")}</div><div class="detail-copy"><div class="eyebrow"><span class="eyebrow-line"></span>${esc(p.category)} · DEMO LISTING</div><h2>${esc(p.name)}</h2><div class="maker">${esc(p.business)} · ${esc(p.city)}, ${esc(p.state)}</div><div class="detail-price">${rupees(p.price)}</div><p>${esc(p.description)}</p><h4>Materials & making</h4><ul><li>Materials: ${esc(p.materials||"Not provided")}</li><li>Production: ${esc(p.production||"Not provided")}</li><li>Packaging: ${esc(p.packaging||"Not provided")}</li></ul><h4>Sustainability status</h4>${fmtStatus(p.status)}<p>${esc(p.evidence||"No supporting information submitted yet.")}</p><p><small>Demo disclosure: seller-submitted details are not proof of independent certification.</small></p><button class="btn btn-primary" data-action="addCart" data-id="${esc(p.id)}">${t("addCart")} · ${rupees(p.price)}</button></div></div>`,true)}
  function addCart(id){const p=allProducts().find(x=>x.id===id);if(!p)return;const c=cart();c[id]=(c[id]||0)+1;save(STORE.cart,c);toast("Added to your demo cart.");}
  function favorite(id){let f=safeGet(userKey(STORE.favorites),[]);f=f.includes(id)?f.filter(x=>x!==id):[...f,id];save(userKey(STORE.favorites),f);renderProducts();toast(f.includes(id)?"Saved to favourites.":"Removed from favourites.")}
  function mentorRequest(id){const u=activeUser();if(!u){openAuth("login");return}if(u.role!=="entrepreneur"){toast("Mentorship requests are available to entrepreneur accounts.");return}const m=demoMentors.find(x=>x.id===id);let req=safeGet(STORE.requests,[]);if(req.some(r=>r.entrepreneurId===u.id&&r.mentorId===id)){toast("You have already sent a request to this demo mentor.");return}req.push({id:uid(),entrepreneurId:u.id,entrepreneurName:u.name,mentorId:id,mentorName:m.name,status:"Pending",createdAt:new Date().toISOString()});save(STORE.requests,req);toast(t("requestSent"))}
  function renderDashboard(){const u=activeUser();if(!u){openAuth("login");return}currentSection="overview";$("#app").innerHTML=`<section class="dashboard-shell"><aside class="dash-sidebar"><a class="brand" href="#home"><span class="brand-mark">e<span>h</span></span><span><strong>EcoHer</strong><small>DEMO WORKSPACE</small></span></a><div class="dash-user"><strong>${esc(u.name)}</strong><small>${esc(u.role.toUpperCase())} · ${esc(u.city||"India")}</small></div><nav class="dash-nav" id="dashNav"></nav></aside><section class="dash-content"><div class="dash-top"><div><h1 id="dashTitle">${t("overview")}</h1><p>${t("welcome")}, ${esc(u.name.split(" ")[0])}. Here's your EcoHer workspace.</p></div><button class="btn btn-outline" data-action="home">← Home</button></div><div id="dashView"></div></section></section>`;renderDashNav();renderDashSection()}
  function renderDashNav(){const u=activeUser();const items=u.role==="entrepreneur"?[["overview","overview","⌂"],["products","myProducts","◇"],["finance","finance","₹"],["coach","coach","✳"],["impact","impact","↗"],["privacy","privacy","⌑"]]:u.role==="mentor"?[["overview","overview","⌂"],["requests","mentorship","♡"],["profile","profile","○"]]:[["overview","overview","⌂"],["market","market","◇"],["cart","cart","＋"],["orders","orders","↗"]];$("#dashNav").innerHTML=items.map(([key,label,icon])=>`<button data-action="dashSection" data-section="${key}" class="${currentSection===key?"active":""}">${icon} &nbsp; ${t(label)}</button>`).join("")+`<button data-action="logout">↪ &nbsp; ${t("logout")}</button>`}
  function metric(label,value,sub=""){return `<div class="metric-card"><span>${label}</span><strong>${value}</strong><small>${sub}</small></div>`}
  function renderDashSection(){const u=activeUser(),view=$("#dashView");if(!u||!view)return;$("#dashTitle").textContent=t(({overview:"overview",products:"myProducts",finance:"finance",coach:"coach",impact:"impact",privacy:"privacy",requests:"mentorship",profile:"profile",market:"market",cart:"cart",orders:"orders"})[currentSection]||"overview");renderDashNav();
    if(u.role==="entrepreneur")return renderEntrepreneurSection(view,u);
    if(u.role==="mentor")return renderMentorSection(view,u);
    return renderCustomerSection(view,u)
  }
  function renderEntrepreneurSection(view,u){
    const products=ownProducts(),tx=ownedRecords(userKey(STORE.transactions)),sales=tx.filter(x=>x.type==="sale").reduce((s,x)=>s+x.amount,0),expenses=tx.filter(x=>x.type==="expense").reduce((s,x)=>s+x.amount,0);
    if(currentSection==="overview"){view.innerHTML=`<div class="dash-cards">${metric(t("revenue"),rupees(sales),"Based on records you entered")}${metric(t("expenses"),rupees(expenses),"Based on records you entered")}${metric(t("profit"),rupees(sales-expenses),"Revenue minus expenses")}</div><div class="panel"><div class="panel-heading"><div><h3>Your business at a glance</h3><p>Start with one product or one record. Demo accounts begin with no personal sales.</p></div><button class="btn btn-primary" data-action="dashSection" data-section="products">+ ${t("addProduct")}</button></div>${products.length?`<div class="dash-product-list">${products.slice(0,3).map(p=>`<div class="mini-product"><div class="mini-image"><img src="${esc(productImage(p))}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none'"></div><div class="mini-body"><strong>${esc(p.name)}</strong><small>${rupees(p.price)} · stock ${p.stock}</small><div style="margin-top:8px">${fmtStatus(p.status)}</div></div></div>`).join("")}</div>`:`<div class="empty-state">${t("noItems")}</div>`}</div><div class="panel"><div class="panel-heading"><div><h3>Quick start</h3><p>These are local prototype tools, not connected services.</p></div></div><div class="inline-form"><button class="btn btn-outline" data-action="dashSection" data-section="finance">Record a sale or expense</button><button class="btn btn-outline" data-action="dashSection" data-section="coach">Ask the business coach</button><button class="btn btn-outline" data-action="dashSection" data-section="privacy">Review privacy settings</button></div></div>`;return}
    if(currentSection==="products"){view.innerHTML=`<div class="panel"><div class="panel-heading"><div><h3>${t("myProducts")}</h3><p>Add a product and submit its sustainability information transparently.</p></div><button class="btn btn-primary" data-action="addProduct">+ ${t("addProduct")}</button></div>${products.length?`<div class="dash-product-list">${products.map(p=>`<div class="mini-product"><div class="mini-image"><img src="${esc(productImage(p))}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none'"></div><div class="mini-body"><strong>${esc(p.name)}</strong><small>${rupees(p.price)} · stock ${p.stock}</small><div style="margin-top:8px">${fmtStatus(p.status)}</div><div class="mini-actions"><button data-action="editProduct" data-id="${p.id}">Edit</button><button data-action="deleteProduct" data-id="${p.id}">Delete</button></div></div></div>`).join("")}</div>`:`<div class="empty-state">${t("noItems")}</div>`}</div>`;return}
    if(currentSection==="finance"){view.innerHTML=`<div class="dash-cards">${metric(t("revenue"),rupees(sales),"Recorded sales")}${metric(t("expenses"),rupees(expenses),"Recorded expenses")}${metric(t("profit"),rupees(sales-expenses),"Estimate only")}</div><div class="panel"><div class="panel-heading"><div><h3>Record a transaction</h3><p>Enter actual demo records; no figures are invented.</p></div></div><form id="transactionForm" class="inline-form"><select name="type"><option value="sale">Sale / revenue</option><option value="expense">Expense</option></select><input name="description" placeholder="${t("note")}" required><input name="category" placeholder="Category" required><input name="amount" type="number" min=".01" step=".01" placeholder="${t("amount")}" required><input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required><button class="btn btn-primary" type="submit">${t("record")}</button></form><div class="table-wrap"><table><thead><tr><th>Type</th><th>Description</th><th>Category</th><th>Amount</th><th>Date</th><th></th></tr></thead><tbody>${tx.map(x=>`<tr><td>${esc(x.type)}</td><td>${esc(x.description)}</td><td>${esc(x.category)}</td><td>${rupees(x.amount)}</td><td>${esc(x.date)}</td><td><button class="btn btn-outline" data-action="deleteTransaction" data-id="${x.id}">Delete</button></td></tr>`).join("")||`<tr><td colspan="6">${t("noItems")}</td></tr>`}</tbody></table></div></div>`;$("#transactionForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget),amount=Number(f.get("amount"));if(!Number.isFinite(amount)||amount<=0){toast("Enter a valid positive amount.");return}tx.push({id:uid(),type:f.get("type"),description:String(f.get("description")).trim(),category:String(f.get("category")).trim(),amount,date:f.get("date")});setOwnedRecords(userKey(STORE.transactions),tx);renderDashSection();toast("Transaction saved.")});return}
    if(currentSection==="coach"){const chats=safeGet(userKey(STORE.chats),[]);view.innerHTML=`<div class="panel"><div class="panel-heading"><div><h3>EcoHer AI Business Coach</h3><p>Rule-based demo assistant · not a connected AI model.</p></div><button class="btn btn-outline" data-action="clearChat">${t("clearChat")}</button></div><div class="chat-suggestions">${["How can I increase my sales?","How should I price my products?","How can I reduce expenses?","What should I focus on this week?"].map(q=>`<button data-action="suggestQuestion" data-question="${esc(q)}">${esc(q)}</button>`).join("")}</div><div id="coachMessages" class="coach-messages">${chats.map(c=>`<div class="chat-message ${c.from==="user"?"user":""}">${esc(c.text)}</div>`).join("")||`<div class="chat-message">Hello! I can help you brainstorm product, pricing, and business next steps. What would you like to work on?</div>`}</div><form id="coachForm" class="chat-compose"><input name="question" placeholder="${t("askCoach")}" required><button class="btn btn-primary" type="submit">${t("send")}</button></form></div>`;$("#coachForm").addEventListener("submit",e=>{e.preventDefault();const question=new FormData(e.currentTarget).get("question");coachReply(question)});return}
    if(currentSection==="impact"){const profile=safeGet(userKey(STORE.profile),{});view.innerHTML=`<div class="panel"><div class="panel-heading"><div><h3>Impact dashboard</h3><p>Metrics appear only when you enter records. No carbon-saving claims are generated.</p></div></div><form id="impactForm" class="form-grid"><div class="field"><label>Women employed or supported</label><input name="womenSupported" type="number" min="0" value="${Number(profile.womenSupported)||0}"></div><div class="field"><label>Reusable packaging units</label><input name="reusableUnits" type="number" min="0" value="${Number(profile.reusableUnits)||0}"></div><div class="field"><label>Waste reused (kg)</label><input name="wasteReused" type="number" min="0" step=".1" value="${Number(profile.wasteReused)||0}"></div><div class="field"><label>Local suppliers supported</label><input name="localSuppliers" type="number" min="0" value="${Number(profile.localSuppliers)||0}"></div><div class="field full"><button class="btn btn-primary" type="submit">Save impact records</button></div></form><div class="impact-grid" style="margin-top:20px"><div class="impact-item"><span>Women supported</span><strong>${Number(profile.womenSupported)||0}</strong></div><div class="impact-item"><span>Reusable units</span><strong>${Number(profile.reusableUnits)||0}</strong></div><div class="impact-item"><span>Waste reused</span><strong>${Number(profile.wasteReused)||0} kg</strong></div><div class="impact-item"><span>Local suppliers</span><strong>${Number(profile.localSuppliers)||0}</strong></div></div></div>`;$("#impactForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);Object.assign(profile,{womenSupported:Number(f.get("womenSupported"))||0,reusableUnits:Number(f.get("reusableUnits"))||0,wasteReused:Number(f.get("wasteReused"))||0,localSuppliers:Number(f.get("localSuppliers"))||0});save(userKey(STORE.profile),profile);toast("Impact records saved.");renderDashSection()});return}
    if(currentSection==="privacy"){const prefs=safeGet(userKey(STORE.privacy),{public:true,hideContact:true,publicBusinessContact:true});view.innerHTML=`<div class="panel"><div class="panel-heading"><div><h3>Security & privacy</h3><p>This prototype stores information in your browser. It does not provide server-side security.</p></div></div>${privacyToggle("public",t("profileVisibility"),"Allow the business profile to appear in the demo marketplace.",prefs.public)}${privacyToggle("hideContact",t("hideContact"),"Your personal mobile number and email should not appear on public pages.",prefs.hideContact)}${privacyToggle("publicBusinessContact",t("publicContact"),"Prefer business contact details instead of personal details.",prefs.publicBusinessContact)}<div class="privacy-row"><div><strong>Session</strong><small>Logged in as ${esc(u.email)}. This demo does not encrypt localStorage data.</small></div><button class="btn btn-outline" data-action="logout">${t("logout")}</button></div><div class="privacy-row"><div><strong>Report suspicious activity</strong><small>Save a local report marker for prototype testing.</small></div><button class="btn btn-outline" data-action="report">Report</button></div></div>`;$$("[data-privacy]",view).forEach(input=>input.addEventListener("change",()=>{prefs[input.dataset.privacy]=input.checked;save(userKey(STORE.privacy),prefs);toast("Privacy preference saved locally.")}));return}
    view.innerHTML=`<div class="panel"><h3>${t("profile")}</h3><p class="modal-intro">Edit the public-facing demo business story.</p><form id="businessProfileForm" class="form-grid"><div class="field"><label>${t("businessName")}</label><input name="businessName" value="${esc(u.businessName||"")}" required></div><div class="field"><label>Founder name</label><input name="founderName" value="${esc(u.name)}" required></div><div class="field"><label>${t("city")}</label><input name="city" value="${esc(u.city)}" required></div><div class="field"><label>${t("state")}</label><input name="state" value="${esc(u.state)}" required></div><div class="field"><label>${t("category")}</label><input name="category" value="${esc(u.businessCategory||"")}"></div><div class="field"><label>Women supported</label><input name="womenSupported" type="number" min="0" value="0"></div><div class="field full"><label>Business story</label><textarea name="story" placeholder="Share your business story…"></textarea></div><div class="field full"><button class="btn btn-primary" type="submit">${t("saveChanges")}</button></div></form></div>`;$("#businessProfileForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget),profile=Object.fromEntries(f.entries());profile.womenSupported=Number(profile.womenSupported)||0;save(userKey(STORE.profile),profile);toast("Business profile saved locally.")})
  }
  function privacyToggle(key,label,desc,checked){return `<div class="privacy-row"><div><strong>${esc(label)}</strong><small>${esc(desc)}</small></div><label class="switch"><input type="checkbox" data-privacy="${key}" ${checked?"checked":""}><span></span></label></div>`}
  function coachReply(question){const u=activeUser(),products=ownProducts(),tx=ownedRecords(userKey(STORE.transactions)),q=String(question).toLowerCase(),chats=safeGet(userKey(STORE.chats),[]);chats.push({from:"user",text:String(question)});let answer;
    if(/sale|customer|promot|market|increase/.test(q))answer=`For ${u.businessName||"your business"}, start with one clear weekly offer, share a product story with a real making detail, and ask 3 past customers for feedback. You currently have ${products.length} product(s) listed in this demo.`;
    else if(/price|cost|margin|profit/.test(q)){const avg=products.length?Math.round(products.reduce((s,p)=>s+Number(p.price),0)/products.length):0;answer=products.length?`Your listed products average ${rupees(avg)}. List material, labour, packaging, delivery, and overhead costs before choosing a price. Compare similar products, then test a small price range.`:"Add a product and record its costs first. A useful starting formula is total unit cost + desired profit, then compare against customer expectations."}
    else if(/expense|reduce|spend/.test(q))answer="Track each expense for two weeks, separate fixed and variable costs, and review packaging and delivery purchases in batches. Avoid cutting costs that directly affect product quality or worker fairness.";
    else if(/sustain|eco|waste|packag/.test(q))answer="Document materials, sourcing, production, and packaging honestly. Start with one measurable improvement, such as reusable packaging units. Keep seller-submitted information separate from independent verification.";
    else if(/week|focus|priority/.test(q))answer="This week: (1) review one customer need, (2) improve one product description, (3) record every sale and expense, and (4) contact one mentor or peer for specific feedback.";
    else if(/description|write|product/.test(q))answer="Use a simple structure: what it is, who makes it, materials used, how it is made, how to care for it, and what makes it useful. Avoid sustainability claims you cannot support.";
    else answer="I can help brainstorm sales, pricing, promotion, expenses, product descriptions, and sustainability practices. Share your current goal or one challenge for a more focused suggestion.";
    chats.push({from:"assistant",text:answer});save(userKey(STORE.chats),chats);renderDashSection();const box=$("#coachMessages");if(box)box.scrollTop=box.scrollHeight;
  }
  function renderMentorSection(view,u){const requests=safeGet(STORE.requests,[]).filter(r=>r.mentorId===u.id||r.mentorName===u.name);if(currentSection==="requests"){view.innerHTML=`<div class="panel"><div class="panel-heading"><div><h3>Mentorship requests</h3><p>Requests are stored locally for this prototype.</p></div></div>${requests.length?requests.map(r=>`<div class="privacy-row"><div><strong>${esc(r.entrepreneurName)}</strong><small>${esc(r.status)} · ${esc(r.createdAt.slice(0,10))}</small></div><div>${r.status==="Pending"?`<button class="btn btn-outline" data-action="requestStatus" data-id="${r.id}" data-status="Accepted">Accept</button> <button class="btn btn-outline" data-action="requestStatus" data-id="${r.id}" data-status="Rejected">Reject</button>`:fmtStatus(r.status)}</div></div>`).join(""):`<div class="empty-state">No mentorship requests yet. Demo requests from entrepreneurs will appear here when linked to this mentor account.</div>`}</div>`;return}
    if(currentSection==="profile"){view.innerHTML=`<div class="panel"><h3>Mentor profile</h3><p class="modal-intro">These details are from your demo registration.</p><div class="impact-grid"><div class="impact-item"><span>Expertise</span><strong style="font-size:18px">${esc(u.expertise||"Not set")}</strong></div><div class="impact-item"><span>Experience</span><strong>${Number(u.experience)||0} yrs</strong></div><div class="impact-item"><span>Languages</span><strong style="font-size:17px">${esc(u.languages||"Not set")}</strong></div><div class="impact-item"><span>Availability</span><strong style="font-size:17px">${esc(u.availability||"Flexible")}</strong></div></div></div>`;return}
    view.innerHTML=`<div class="dash-cards">${metric("Role","Mentor","Demo profile")}${metric("Expertise",esc(u.expertise||"—"),"From registration")}${metric("Requests",requests.length,"Local request records")}</div><div class="panel"><h3>Mentorship workspace</h3><p class="modal-intro">Review requests when entrepreneurs send requests to a matching demo mentor profile. For a fully connected multi-account simulation, register a mentor using the same demo profile name or test role flows in this browser.</p><button class="btn btn-primary" data-action="dashSection" data-section="requests">View requests →</button></div>`
  }
  function renderCustomerSection(view,u){const c=cart(),items=Object.entries(c).map(([id,qty])=>({p:allProducts().find(p=>p.id===id),qty})).filter(x=>x.p);if(currentSection==="market"){view.innerHTML=`<div class="panel"><div class="panel-heading"><div><h3>Browse the marketplace</h3><p>Use the filters on the home page or browse all demo listings below.</p></div></div><div class="dash-product-list">${allProducts().map(p=>`<div class="mini-product"><div class="mini-image"><img src="${esc(productImage(p))}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none'"></div><div class="mini-body"><strong>${esc(p.name)}</strong><small>${rupees(p.price)} · ${esc(p.city)}</small><div class="mini-actions"><button data-action="details" data-id="${p.id}">Details</button><button data-action="addCart" data-id="${p.id}">Add</button></div></div></div>`).join("")}</div></div>`;return}
    if(currentSection==="cart"){const total=items.reduce((s,x)=>s+x.p.price*x.qty,0);view.innerHTML=`<div class="panel"><div class="panel-heading"><div><h3>${t("cart")}</h3><p>Demo orders only. No real payment is collected.</p></div></div>${items.length?items.map(({p,qty})=>`<div class="cart-row"><div class="cart-icon">${esc(p.icon||"✳")}</div><div class="cart-details"><strong>${esc(p.name)}</strong><small>${rupees(p.price)} each</small></div><div class="qty-control"><button data-action="qty" data-id="${p.id}" data-delta="-1">−</button><span>${qty}</span><button data-action="qty" data-id="${p.id}" data-delta="1">+</button></div><strong>${rupees(p.price*qty)}</strong><button class="btn btn-outline" data-action="removeCart" data-id="${p.id}">×</button></div>`).join(""):`<div class="empty-state">${t("emptyCart")}</div>`}<div class="panel-heading" style="margin-top:20px"><h3>${t("total")}: ${rupees(total)}</h3>${items.length?`<button class="btn btn-primary" data-action="checkout">${t("checkout")} →</button>`:""}</div></div>`;return}
    if(currentSection==="orders"){const orders=safeGet(userKey(STORE.orders),[]);view.innerHTML=`<div class="panel"><div class="panel-heading"><div><h3>${t("orders")}</h3><p>Simulated checkout history for this browser.</p></div></div>${orders.length?`<div class="table-wrap"><table><thead><tr><th>Order</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr></thead><tbody>${orders.map(o=>`<tr><td>${esc(o.id)}</td><td>${esc(o.items.map(i=>i.name).join(", "))}</td><td>${rupees(o.total)}</td><td>${esc(o.date)}</td><td>${esc(o.status)}</td></tr>`).join("")}</tbody></table></div>`:`<div class="empty-state">No demo orders yet.</div>`}</div>`;return}
    view.innerHTML=`<div class="dash-cards">${metric("Role","Customer","Demo account")}${metric("Cart items",items.reduce((s,x)=>s+x.qty,0),"Current cart")}${metric("Favourites",safeGet(userKey(STORE.favorites),[]).length,"Saved locally")}</div><div class="panel"><div class="panel-heading"><div><h3>Discover thoughtful products</h3><p>Browse sample listings from women-led demo businesses.</p></div><button class="btn btn-primary" data-action="dashSection" data-section="market">Browse products →</button></div><div class="dash-product-list">${allProducts().slice(0,3).map(p=>`<div class="mini-product"><div class="mini-image"><img src="${esc(productImage(p))}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none'"></div><div class="mini-body"><strong>${esc(p.name)}</strong><small>${rupees(p.price)}</small><div class="mini-actions"><button data-action="details" data-id="${p.id}">Details</button><button data-action="addCart" data-id="${p.id}">Add</button></div></div></div>`).join("")}</div></div>`
  }
  function addProductForm(id=null){const old=id?ownProducts().find(p=>p.id===id):null;showModal(`<div class="eyebrow"><span class="eyebrow-line"></span> PRODUCT STUDIO</div><h2>${old?"Edit product":t("addProduct")}</h2><p class="modal-intro">Sustainability information is seller-submitted until reviewed. Do not treat this as a real certification.</p><form id="productForm"><div class="form-grid"><div class="field"><label>${t("productName")} *</label><input name="name" required value="${esc(old?.name||"")}"></div><div class="field"><label>${t("category")} *</label><select name="category">${["Textiles","Home decor","Personal care","Accessories","Other"].map(c=>`<option ${old?.category===c?"selected":""}>${c}</option>`).join("")}</select></div><div class="field"><label>${t("price")} *</label><input name="price" type="number" min=".01" step=".01" required value="${old?.price||""}"></div><div class="field"><label>${t("stock")} *</label><input name="stock" type="number" min="0" step="1" required value="${old?.stock??0}"></div><div class="field full"><label>${t("description")} *</label><textarea name="description" required>${esc(old?.description||"")}</textarea></div><div class="field"><label>${t("materials")}</label><input name="materials" value="${esc(old?.materials||"")}"></div><div class="field"><label>${t("production")}</label><input name="production" value="${esc(old?.production||"")}"></div><div class="field"><label>${t("packaging")}</label><input name="packaging" value="${esc(old?.packaging||"")}"></div><div class="field"><label>Product image URL (optional)</label><input name="image" type="url" value="${esc(old?.image||"")}"></div><div class="field full"><label>${t("evidence")}</label><textarea name="evidence">${esc(old?.evidence||"")}</textarea></div><div class="field full"><label><input type="checkbox" name="recycled" ${old?.recycled?"checked":""}> Recycled/upcycled materials used</label><label><input type="checkbox" name="plasticFree" ${old?.plasticFree?"checked":""}> Plastic-free packaging</label><label><input type="checkbox" name="local" ${old?.local?"checked":""}> Locally sourced materials</label><label><input type="checkbox" name="reusable" ${old?.reusable?"checked":""}> Reusable, recyclable, or biodegradable</label></div></div><div id="productError" class="form-error"></div><div class="form-footer"><small>New entries start at <b>Information Submitted</b>.</small><button class="btn btn-primary" type="submit">${t("saveProduct")}</button></div></form>`,true);
    $("#productForm").addEventListener("submit",e=>{e.preventDefault();const u=activeUser();if(!u||u.role!=="entrepreneur"){toast("Log in as an entrepreneur to manage products.");return}const f=new FormData(e.currentTarget),price=Number(f.get("price")),stock=Number(f.get("stock"));if(price<=0||stock<0){$("#productError").textContent="Price must be positive and stock cannot be negative.";return}let arr=safeGet(STORE.products,[]);const p={id:old?.id||uid(),owner:u.id,business:u.businessName||u.name,city:u.city,state:u.state,name:String(f.get("name")).trim(),category:f.get("category"),price,stock,description:String(f.get("description")).trim(),materials:String(f.get("materials")||""),production:String(f.get("production")||""),packaging:String(f.get("packaging")||""),image:String(f.get("image")||""),evidence:String(f.get("evidence")||""),recycled:f.has("recycled"),plasticFree:f.has("plasticFree"),local:f.has("local"),reusable:f.has("reusable"),status:old?.status||"Information Submitted",icon:"✳"};arr=arr.filter(x=>x.id!==p.id);arr.push(p);save(STORE.products,arr);closeModal();currentSection="products";renderDashSection();toast("Product saved with transparent demo verification status.")})
  }
  function logout(){localStorage.removeItem(STORE.session);closeModal();toast("Logged out. Your local demo account remains saved.");location.hash="#home";renderHome()}
  function renderHome(){const app=$("#app");if(!$("#home")&&app.dataset.homeRendered!=="yes"){location.reload();return}if($("#home"))return;location.reload()}
  function checkout(){const u=activeUser();if(!u){openAuth("login");return}const c=cart(),items=Object.entries(c).map(([id,qty])=>({p:allProducts().find(p=>p.id===id),qty})).filter(x=>x.p);if(!items.length){toast(t("emptyCart"));return}const total=items.reduce((s,x)=>s+x.p.price*x.qty,0);showModal(`<div class="eyebrow"><span class="eyebrow-line"></span> DEMO CHECKOUT</div><h2>Review your demo order</h2><p class="modal-intro">No payment details are collected. This creates a simulated order only.</p>${items.map(x=>`<div class="cart-row"><div class="cart-icon">${esc(x.p.icon||"✳")}</div><div class="cart-details"><strong>${esc(x.p.name)}</strong><small>Quantity: ${x.qty}</small></div><strong>${rupees(x.p.price*x.qty)}</strong></div>`).join("")}<div class="panel-heading" style="margin-top:20px"><h3>${t("total")}: ${rupees(total)}</h3></div><div class="form-footer"><small>Demo order · no real payment</small><button class="btn btn-primary" data-action="placeOrder">${t("placeOrder")} ↗</button></div>`)}
  function placeOrder(){const u=activeUser(),c=cart(),items=Object.entries(c).map(([id,qty])=>({p:allProducts().find(p=>p.id===id),qty})).filter(x=>x.p);if(!u||!items.length)return;const orders=safeGet(userKey(STORE.orders),[]);orders.unshift({id:"EH-"+Date.now().toString().slice(-7),items:items.map(x=>({name:x.p.name,qty:x.qty,price:x.p.price})),total:items.reduce((s,x)=>s+x.p.price*x.qty,0),date:new Date().toISOString().slice(0,10),status:"Demo order placed"});save(userKey(STORE.orders),orders);save(STORE.cart,{});closeModal();currentSection="orders";renderDashSection();toast("Demo order placed. No payment was processed.")}
  document.addEventListener("click",e=>{const btn=e.target.closest("[data-action]");if(!btn)return;const a=btn.dataset.action,id=btn.dataset.id;
    if(a==="register")openAuth("register");else if(a==="login")openAuth("login");else if(a==="closeModal")closeModal();else if(a==="details")detailProduct(id);else if(a==="addCart")addCart(id);else if(a==="favorite")favorite(id);else if(a==="mentorRequest")mentorRequest(id);else if(a==="home"){location.hash="#home";location.reload()}else if(a==="logout")logout();else if(a==="dashSection"){currentSection=btn.dataset.section;renderDashSection()}else if(a==="addProduct")addProductForm();else if(a==="editProduct")addProductForm(id);else if(a==="deleteProduct"){if(confirm("Delete this product?")){save(STORE.products,safeGet(STORE.products,[]).filter(p=>p.id!==id));renderDashSection();toast("Product deleted.")}}else if(a==="deleteTransaction"){setOwnedRecords(userKey(STORE.transactions),ownedRecords(userKey(STORE.transactions)).filter(x=>x.id!==id));renderDashSection();toast("Transaction deleted.")}else if(a==="clearChat"){save(userKey(STORE.chats),[]);renderDashSection();toast("Chat history cleared.")}else if(a==="suggestQuestion")coachReply(btn.dataset.question);else if(a==="qty"){const c=cart();c[id]=Math.max(1,(c[id]||1)+Number(btn.dataset.delta));save(STORE.cart,c);renderDashSection()}else if(a==="removeCart"){const c=cart();delete c[id];save(STORE.cart,c);renderDashSection()}else if(a==="checkout")checkout();else if(a==="placeOrder")placeOrder();else if(a==="requestStatus"){const req=safeGet(STORE.requests,[]).map(r=>r.id===id?{...r,status:btn.dataset.status}:r);save(STORE.requests,req);renderDashSection();toast("Request status updated.")}else if(a==="report"){const reports=safeGet("ecoh_v2_reports",[]);reports.push({userId:activeUser()?.id,date:new Date().toISOString(),status:"Reported in demo"});save("ecoh_v2_reports",reports);toast("Report saved locally for prototype testing.")}else if(a==="marketAll"){renderProducts();$("#marketplace")?.scrollIntoView({behavior:"smooth"})}
  });
  $("#headerLogin").addEventListener("click",()=>openAuth("login"));$("#headerJoin").addEventListener("click",()=>openAuth("register"));$("#languageSelect").value=language;$("#languageSelect").addEventListener("change",e=>setLanguage(e.target.value));$("#marketSearch").addEventListener("input",renderProducts);$("#cityFilter").addEventListener("change",renderProducts);$("#categoryFilter").addEventListener("change",renderProducts);$("#mobileMenu").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));$$(".main-nav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
  window.addEventListener("hashchange",()=>{if(location.hash==="#dashboard"){renderDashboard()}else if(location.hash==="#home"||!location.hash){if(!$("#home"))location.reload()}});
  // Role-aware dashboard gate: a URL hash cannot grant a role or bypass login.
  if(location.hash==="#dashboard"){if(activeUser())renderDashboard();else{location.hash="#home";setTimeout(()=>openAuth("login"),100)}}else{renderProducts();renderMentors()}
  setLanguage(language);
  
  // EcoHer demo entrepreneur account for presentations
  function seedEcoHerDemoAccount() {
    const email = "aarohi.demo@example.com";
    const password = "EcoHerDemo@2026";

    // Avoid creating duplicate demo accounts
    let allUsers = users();
    let demoUser = allUsers.find(user => user.email === email);

    if (!demoUser) {
      demoUser = {
        id: "demo-aarohi",
        name: "Aarohi Sharma",
        email,
        password,
        mobile: "9876543210",
        city: "Pune",
        state: "Maharashtra",
        preferredLanguage: "en",
        role: "entrepreneur",
        businessName: "Aarohi Loom Studio",
        businessCategory: "Textiles",
        sustainabilityCategory: "Upcycled materials",
        businessLocation: "Pune, Maharashtra",
        createdAt: new Date().toISOString()
      };

      allUsers.push(demoUser);
      save(STORE.users, allUsers);
    }

    // Create the demo business profile
    const profileKey = `ecoh_v2_profiles_${demoUser.id}`;

    if (!localStorage.getItem(profileKey)) {
      save(profileKey, {
        businessName: "Aarohi Loom Studio",
        founderName: "Aarohi Sharma",
        city: "Pune",
        state: "Maharashtra",
        category: "Textiles",
        story:
          "A demo women-led business creating practical textile products.",
        materials: "Cotton canvas and fabric offcuts",
        production: "Small-batch stitching",
        packaging: "Recycled paper packaging",
        womenSupported: 3,
        public: true,
        hideContact: true
      });
    }

    // Add demo products without duplicating them
    const products = safeGet(STORE.products, []);
    const demoProductsForOwner = [
      {
        id: "aarohi-tote",
        name: "Indigo Everyday Tote",
        price: 549,
        stock: 14,
        category: "Accessories",
        description:
          "An everyday tote inspired by traditional Indian textile motifs.",
        materials: "Cotton canvas",
        production: "Small-batch stitching",
        packaging: "Recycled paper wrap",
        status: "Basic Review Pending",
        icon: "👜"
      },
      {
        id: "aarohi-runner",
        name: "Handcrafted Table Runner",
        price: 899,
        stock: 8,
        category: "Textiles",
        description:
          "A handcrafted table runner for everyday home decor.",
        materials: "Cotton fabric",
        production: "Small-batch textile work",
        packaging: "Paper sleeve",
        status: "Information Submitted",
        icon: "🧵"
      },
      {
        id: "aarohi-pouch",
        name: "Upcycled Fabric Pouch",
        price: 299,
        stock: 11,
        category: "Accessories",
        description:
          "A useful pouch made from leftover fabric pieces.",
        materials: "Fabric offcuts",
        production: "Patchwork stitching",
        packaging: "Paper wrap",
        status: "Basic Review Pending",
        icon: "🪡"
      }
    ];

    for (const item of demoProductsForOwner) {
      if (!products.some(product => product.id === item.id)) {
        products.push({
          ...item,
          owner: demoUser.id,
          business: demoUser.businessName,
          city: demoUser.city,
          state: demoUser.state,
          evidence:
            "Demo seller-provided information; independent verification has not occurred."
        });
      }
    }

    save(STORE.products, products);

    // Seed financial records only once
    const transactionKey = `ecoh_v2_transactions_${demoUser.id}`;

    if (!localStorage.getItem(transactionKey)) {
      save(transactionKey, [
        {
          id: "aarohi-sale-1",
          owner: demoUser.id,
          type: "sale",
          description: "Tote bag orders",
          category: "Product sales",
          amount: 2745,
          date: "2026-10-05"
        },
        {
          id: "aarohi-sale-2",
          owner: demoUser.id,
          type: "sale",
          description: "Table runner orders",
          category: "Product sales",
          amount: 1798,
          date: "2026-10-07"
        },
        {
          id: "aarohi-sale-3",
          owner: demoUser.id,
          type: "sale",
          description: "Printed pouch orders",
          category: "Product sales",
          amount: 1495,
          date: "2026-10-09"
        },
        {
          id: "aarohi-expense-1",
          owner: demoUser.id,
          type: "expense",
          description: "Fabric and materials",
          category: "Materials",
          amount: 1200,
          date: "2026-10-05"
        },
        {
          id: "aarohi-expense-2",
          owner: demoUser.id,
          type: "expense",
          description: "Packaging supplies",
          category: "Packaging",
          amount: 350,
          date: "2026-10-07"
        },
        {
          id: "aarohi-expense-3",
          owner: demoUser.id,
          type: "expense",
          description: "Local delivery",
          category: "Delivery",
          amount: 400,
          date: "2026-10-09"
        }
      ]);
    }

    console.log("EcoHer demo account is ready:", email);
  }

  // Run only when explicitly requested through ?demo=1
  if (new URLSearchParams(location.search).get("demo") === "1") {
    seedEcoHerDemoAccount();
  }
})();