(() => {
  "use strict";
  const SELLER_WHATSAPP = "6281234567890";
  const STORAGE_KEY = "kuliner-nusantara-cart-v1";
  const products = [
    {id:1,name:"Nasi Goreng Kampung",category:"Makanan",price:22000,tag:"Favorit",description:"Nasi goreng dengan racikan bumbu tradisional, telur, sayuran, dan taburan bawang goreng.",location:"Dapur Nusantara",image:"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"},
    {id:2,name:"Rendang Sapi",category:"Makanan",price:35000,tag:"Khas Sumatera",description:"Daging sapi dimasak perlahan bersama santan dan rempah pilihan hingga kaya rasa.",location:"Dapur Minang",image:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80"},
    {id:3,name:"Sate Ayam",category:"Makanan",price:28000,tag:"Terlaris",description:"Potongan ayam berbumbu yang dibakar dan disajikan dengan saus kacang gurih.",location:"Sate Pak Rasa",image:"https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=800&q=80"},
    {id:4,name:"Soto Ayam",category:"Makanan",price:20000,tag:"Hangat & Segar",description:"Kuah kaldu rempah yang hangat dengan suwiran ayam, soun, dan pelengkap.",location:"Warung Soto Ibu",image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"},
    {id:5,name:"Pempek Kapal Selam",category:"Makanan",price:25000,tag:"Khas Palembang",description:"Olahan ikan dan sagu berisi telur, disajikan dengan kuah cuko asam manis.",location:"Pempek Bahari",image:"https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"},
    {id:6,name:"Es Cendol",category:"Minuman",price:12000,tag:"Segar",description:"Cendol kenyal dengan santan, gula aren, dan es yang menyegarkan.",location:"Segar Nusantara",image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80"},
    {id:7,name:"Es Teh Kampung",category:"Minuman",price:7000,tag:"Klasik",description:"Teh pilihan dengan rasa khas, disajikan dingin untuk menemani hidangan.",location:"Kedai Teh",image:"https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=800&q=80"},
    {id:8,name:"Klepon",category:"Camilan",price:15000,tag:"Jajanan Tradisional",description:"Kue tradisional berisi gula merah cair dengan balutan kelapa parut.",location:"Jajanan Mbok",image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80"}
  ];
  const $ = id => document.getElementById(id);
  const money = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
  const safeText = (parent, tag, value, className) => {
    const node = document.createElement(tag);
    node.textContent = String(value);
    if (className) node.className = className;
    parent.appendChild(node);
    return node;
  };
  let cart = loadCart(), activeCategory = "Semua", searchTerm = "", toastTimer;

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter(item => products.some(p => p.id === item.id) && Number.isInteger(item.qty) && item.qty > 0 && item.qty < 100);
    } catch { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
    catch { showToast("Penyimpanan browser tidak tersedia. Keranjang hanya tersimpan sementara."); }
  }
  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function renderCategories() {
    const host = $("categoryList");
    host.replaceChildren();
    ["Semua","Makanan","Minuman","Camilan"].forEach(category => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-chip" + (activeCategory === category ? " active" : "");
      button.textContent = category;
      button.addEventListener("click", () => { activeCategory = category; renderCategories(); renderProducts(); });
      host.appendChild(button);
    });
  }
  function renderProducts() {
    const host = $("productGrid");
    host.replaceChildren();
    let list = products.filter(p => (activeCategory === "Semua" || p.category === activeCategory) && (p.name + " " + p.description + " " + p.location).toLowerCase().includes(searchTerm));
    const sort = $("sortSelect").value;
    if (sort === "low") list.sort((a,b) => a.price-b.price);
    if (sort === "high") list.sort((a,b) => b.price-a.price);
    if (sort === "name") list.sort((a,b) => a.name.localeCompare(b.name,"id"));
    $("resultCount").textContent = `${list.length} menu ditemukan`;
    $("emptyState").classList.toggle("hidden", list.length !== 0);
    list.forEach(product => {
      const card = document.createElement("article"); card.className = "product-card";
      const imageWrap = document.createElement("div"); imageWrap.className = "product-image";
      const image = document.createElement("img"); image.src = product.image; image.alt = product.name; image.loading = "lazy";
      image.addEventListener("error", () => { image.removeAttribute("src"); image.alt = "Gambar tidak tersedia"; imageWrap.style.background = "#eadfD2"; });
      imageWrap.appendChild(image); safeText(imageWrap,"span",product.tag,"product-tag");
      imageWrap.addEventListener("click", () => openDetail(product.id));
      card.appendChild(imageWrap);
      const info = document.createElement("div"); info.className = "product-info";
      safeText(info,"span",product.category,"product-category");
      safeText(info,"h3",product.name);
      safeText(info,"p",product.description,"product-desc");
      const foot = document.createElement("div"); foot.className = "product-foot";
      safeText(foot,"span",money(product.price),"price");
      const add = document.createElement("button"); add.type = "button"; add.className = "add-btn"; add.textContent = "+"; add.setAttribute("aria-label",`Tambah ${product.name} ke keranjang`);
      add.addEventListener("click", () => addToCart(product.id));
      foot.appendChild(add); info.appendChild(foot); card.appendChild(info); host.appendChild(card);
    });
  }
  function addToCart(id) {
    const item = cart.find(x => x.id === id);
    if (item) { if (item.qty >= 99) return showToast("Jumlah maksimum per menu adalah 99."); item.qty++; }
    else cart.push({id,qty:1});
    saveCart(); renderCart(); showToast("Menu ditambahkan ke keranjang.");
  }
  function changeQty(id, delta) {
    const item = cart.find(x => x.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
    if (item.qty > 99) item.qty = 99;
    saveCart(); renderCart();
  }
  function renderCart() {
    const host = $("cartItems"); host.replaceChildren();
    const count = cart.reduce((sum,x) => sum+x.qty,0);
    $("cartCount").textContent = String(count);
    const total = cart.reduce((sum,x) => sum + products.find(p => p.id === x.id).price*x.qty,0);
    $("cartSubtotal").textContent = money(total);
    if (!cart.length) { safeText(host,"p","Keranjangmu masih kosong. Yuk, temukan menu favorit!","cart-empty"); return; }
    cart.forEach(item => {
      const p = products.find(x => x.id === item.id);
      const row = document.createElement("div"); row.className = "cart-row";
      const img = document.createElement("img"); img.src = p.image; img.alt = p.name; row.appendChild(img);
      const detail = document.createElement("div"); safeText(detail,"strong",p.name); safeText(detail,"small",money(p.price));
      const controls = document.createElement("div"); controls.className = "qty-controls";
      const minus = document.createElement("button"); minus.type="button"; minus.textContent="−"; minus.setAttribute("aria-label","Kurangi jumlah"); minus.addEventListener("click",()=>changeQty(p.id,-1));
      safeText(controls,"span",String(item.qty));
      const plus = document.createElement("button"); plus.type="button"; plus.textContent="+"; plus.setAttribute("aria-label","Tambah jumlah"); plus.addEventListener("click",()=>changeQty(p.id,1));
      controls.prepend(minus); controls.appendChild(plus); detail.appendChild(controls); row.appendChild(detail);
      safeText(row,"span",money(p.price*item.qty),"cart-line-price"); host.appendChild(row);
    });
  }
  function openCart() {
    $("cartDrawer").classList.add("open"); $("cartDrawer").setAttribute("aria-hidden","false"); $("overlay").classList.remove("hidden"); document.body.style.overflow="hidden";
  }
  function closePanels() {
    $("cartDrawer").classList.remove("open"); $("cartDrawer").setAttribute("aria-hidden","true");
    $("detailModal").classList.add("hidden"); $("overlay").classList.add("hidden"); document.body.style.overflow="";
  }
  function openDetail(id) {
    const p = products.find(x => x.id === id); if (!p) return;
    const host = $("detailContent"); host.replaceChildren();
    const img = document.createElement("img"); img.src=p.image; img.alt=p.name; img.className="detail-image"; host.appendChild(img);
    const body = document.createElement("div"); body.className="detail-body";
    safeText(body,"span",p.category.toUpperCase(),"product-category"); safeText(body,"h2",p.name); safeText(body,"p",p.description);
    const meta = document.createElement("div"); meta.className="detail-meta"; safeText(meta,"strong",money(p.price),"price"); safeText(meta,"span",`Penjual: ${p.location}`,"detail-location"); body.appendChild(meta);
    const add = document.createElement("button"); add.type="button"; add.className="btn btn-primary detail-add"; add.textContent="Tambah ke keranjang";
    add.addEventListener("click",()=>{addToCart(p.id);closePanels();}); body.appendChild(add); host.appendChild(body);
    $("detailModal").classList.remove("hidden"); $("overlay").classList.remove("hidden"); document.body.style.overflow="hidden";
  }
  function checkout() {
    if (!cart.length) return showToast("Keranjang masih kosong.");
    if (!/^[0-9]{10,15}$/.test(SELLER_WHATSAPP)) return showToast("Nomor WhatsApp penjual belum dikonfigurasi.");
    const lines = cart.map(item => { const p=products.find(x=>x.id===item.id); return `• ${p.name} x${item.qty} — ${money(p.price*item.qty)}`; });
    const total = cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
    const message = `Halo, saya ingin memesan:%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal: ${encodeURIComponent(money(total))}%0A%0AMohon info ketersediaan dan ongkos kirim.`;
    window.open(`https://wa.me/${SELLER_WHATSAPP}?text=${message}`,"_blank","noopener,noreferrer");
  }

  $("searchInput").addEventListener("input", event => { searchTerm=event.target.value.trim().toLowerCase(); renderProducts(); });
  $("sortSelect").addEventListener("change",renderProducts);
  $("resetFilters").addEventListener("click",()=>{activeCategory="Semua";searchTerm="";$("searchInput").value="";$("sortSelect").value="featured";renderCategories();renderProducts();});
  $("cartButton").addEventListener("click",openCart);
  $("closeCart").addEventListener("click",closePanels);
  $("closeDetail").addEventListener("click",closePanels);
  $("overlay").addEventListener("click",closePanels);
  $("checkoutButton").addEventListener("click",checkout);
  $("menuToggle").addEventListener("click",()=>{const open=$("navLinks").classList.toggle("show");$("menuToggle").setAttribute("aria-expanded",String(open));});
  $("navLinks").querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{$("navLinks").classList.remove("show");$("menuToggle").setAttribute("aria-expanded","false");}));
  document.addEventListener("keydown",event=>{if(event.key==="Escape")closePanels();if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();$("searchInput").focus();}});
  $("year").textContent=String(new Date().getFullYear());
  renderCategories(); renderProducts(); renderCart();
})();