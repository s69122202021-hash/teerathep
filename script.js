/* ============================================================
   PRODUCT DATA (the universal set U)
   ============================================================ */
const products = [
  { id:1,  name:"ไฟหน้า LED โปรเจคเตอร์ X7",        category:"light",   icon:"💡", price:3200, oldPrice:4200, discount:true,  recommended:true  },
  { id:2,  name:"ไฟตัดหมอก RGB Sport",              category:"light",   icon:"🔦", price:1490, oldPrice:1990, discount:true,  recommended:false },
  { id:3,  name:"ไฟท้าย Sequential Turn",           category:"light",   icon:"🚨", price:2650, oldPrice:2650, discount:false, recommended:true  },
  { id:4,  name:"ไฟใต้ท้องรถ Neon Underglow",       category:"light",   icon:"✨", price:1990, oldPrice:1990, discount:false, recommended:false },
  { id:5,  name:"หัวเทียนแข่ง Iridium Pro",          category:"engine",  icon:"🔩", price:890,  oldPrice:1190, discount:true,  recommended:true  },
  { id:6,  name:"กรองอากาศ High-Flow",              category:"engine",  icon:"🌀", price:1250, oldPrice:1590, discount:true,  recommended:false },
  { id:7,  name:"ปั๊มน้ำมันเชื้อเพลิงเรซซิ่ง",         category:"engine",  icon:"⛽", price:3900, oldPrice:3900, discount:false, recommended:true  },
  { id:8,  name:"ลูกสูบ Forged Racing Set",         category:"engine",  icon:"⚙️", price:8700, oldPrice:8700, discount:false, recommended:false },
  { id:9,  name:"ท่อไอเสีย Titanium Cat-back",       category:"exhaust", icon:"🛠️", price:15900,oldPrice:19900,discount:true,  recommended:true  },
  { id:10, name:"ปลายท่อ Carbon Tip Dual",          category:"exhaust", icon:"🎯", price:2200, oldPrice:2900, discount:true,  recommended:false },
  { id:11, name:"ท่อร่วมไอเสีย Header 4-2-1",        category:"exhaust", icon:"🔥", price:6400, oldPrice:6400, discount:false, recommended:true  },
  { id:12, name:"วาล์วท่อไอเสีย Electronic Cutout",  category:"exhaust", icon:"🔘", price:4300, oldPrice:4300, discount:false, recommended:false },
];

/* ============================================================
   SET LOGIC FUNCTIONS (discrete-math set operations)
   Every product's id is treated as an element; sets are
   represented as arrays of product objects, compared by id.
   ============================================================ */
const universalSet = () => products;                                   // U
const setA = () => products.filter(p => p.discount);                   // A = discounted
const setB = () => products.filter(p => p.recommended);                // B = recommended

const byId = (arr, id) => arr.some(p => p.id === id);

function union(setX, setY) {                                           // A ∪ B
  const result = [...setX];
  setY.forEach(p => { if (!byId(result, p.id)) result.push(p); });
  return result;
}

function intersection(setX, setY) {                                    // A ∩ B
  return setX.filter(p => byId(setY, p.id));
}

function difference(setX, setY) {                                      // A − B
  return setX.filter(p => !byId(setY, p.id));
}

function complement(setX, universe) {                                  // A′ = U − A
  return difference(universe, setX);
}

/* Map each console button to the set-logic function it demonstrates */
function computeSet(op) {
  const U = universalSet(), A = setA(), B = setB();
  switch (op) {
    case "A":    return A;
    case "B":    return B;
    case "U":    return U;
    case "AuB":  return union(A, B);
    case "AnB":  return intersection(A, B);
    case "A-B":  return difference(A, B);
    case "B-A":  return difference(B, A);
    case "A'":   return complement(A, U);
    case "B'":   return complement(B, U);
    default:     return U;
  }
}

const opLabels = {
  "A":   "A = {สินค้าลดราคา}",
  "B":   "B = {สินค้าแนะนำ}",
  "U":   "U = {สินค้าทั้งหมด}",
  "AuB": "A ∪ B = {ลดราคา หรือ แนะนำ}",
  "AnB": "A ∩ B = {ลดราคา และ แนะนำ}",
  "A-B": "A − B = {ลดราคาอย่างเดียว ไม่แนะนำ}",
  "B-A": "B − A = {แนะนำอย่างเดียว ไม่ลดราคา}",
  "A'":  "A′ = {ไม่ได้ลดราคา}",
  "B'":  "B′ = {ไม่ได้แนะนำ}",
};

/* ============================================================
   STATE + RENDER
   ============================================================ */
let currentOp = "U";
let currentCategory = "all";

/* C = เซตของสินค้าที่ผู้ใช้เลือกเอง — ใช้ JavaScript Set จริง ๆ
   (สมาชิกคือ product.id ซึ่งไม่ซ้ำกันโดยธรรมชาติของ Set) */
const selectedIds = new Set();

function toggleSelect(id) {
  if (selectedIds.has(id)) {
    selectedIds.delete(id);
  } else {
    selectedIds.add(id);
  }
  renderSelectionBar();
  syncCardSelectedClasses();
}

function renderSelectionBar() {
  const selectedProducts = products.filter(p => selectedIds.has(p.id));
  const total = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  document.getElementById("selCount").textContent = selectedIds.size;
  document.getElementById("selTotal").textContent = "รวม ฿" + total.toLocaleString();
  document.getElementById("clearSelection").disabled = selectedIds.size === 0;
}

function syncCardSelectedClasses() {
  document.querySelectorAll(".card").forEach(card => {
    const id = Number(card.dataset.id);
    card.classList.toggle("selected", selectedIds.has(id));
  });
}

function render() {
  // 1. compute the active set from set logic
  let resultSet = computeSet(currentOp);

  // 2. apply category filter (a plain array filter, not a set op)
  if (currentCategory !== "all") {
    resultSet = resultSet.filter(p => p.category === currentCategory);
  }

  // 3. update cardinality readout
  const U = universalSet(), A = setA(), B = setB();
  document.getElementById("cardU").textContent = U.length;
  document.getElementById("cardA").textContent = A.length;
  document.getElementById("cardB").textContent = B.length;
  document.getElementById("cardAB").textContent = intersection(A, B).length;
  document.getElementById("vennCount").textContent = "|A∩B| = " + intersection(A, B).length;

  // 4. update result line + count pill
  document.getElementById("resultLine").innerHTML =
    opLabels[currentOp] + " &nbsp;→&nbsp; <span class='count'>" + resultSet.length + "</span> รายการ";
  document.getElementById("resultCountPill").textContent = resultSet.length + " รายการ";

  // 5. render product grid
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (resultSet.length === 0) {
    grid.innerHTML = '<div class="empty-state">ไม่มีสินค้าที่ตรงกับเงื่อนไขเซตนี้ในหมวดหมู่ที่เลือก</div>';
    return;
  }

  const catLabel = { light:"ไฟ", engine:"เครื่องยนต์", exhaust:"ท่อไอเสีย" };

  resultSet.forEach(p => {
    const card = document.createElement("div");
    card.className = "card" + (selectedIds.has(p.id) ? " selected" : "");
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="card-top">
        <div class="icon-box">${p.icon}</div>
        <div class="badges">
          ${p.discount ? '<span class="badge discount">ลดราคา</span>' : ""}
          ${p.recommended ? '<span class="badge rec">แนะนำ</span>' : ""}
        </div>
      </div>
      <div class="cat-tag">${catLabel[p.category]}</div>
      <h3>${p.name}</h3>
      <div class="price-row">
        <span class="price ${p.discount ? "discounted" : ""}">฿${p.price.toLocaleString()}</span>
        ${p.discount ? `<span class="old-price">฿${p.oldPrice.toLocaleString()}</span>` : ""}
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ============================================================
   EVENTS
   ============================================================ */
document.getElementById("opButtons").addEventListener("click", e => {
  const btn = e.target.closest(".op-btn");
  if (!btn) return;
  document.querySelectorAll(".op-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentOp = btn.dataset.op;
  render();
});

document.getElementById("categoryNav").addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  document.querySelectorAll("#categoryNav button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentCategory = btn.dataset.cat;
  render();
});

document.getElementById("productGrid").addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;
  toggleSelect(Number(card.dataset.id));
});

document.getElementById("clearSelection").addEventListener("click", () => {
  selectedIds.clear();
  renderSelectionBar();
  syncCardSelectedClasses();
});

render();
renderSelectionBar();
