// FRONT-END (CLIENT) JAVASCRIPT HERE

// ---- helpers ----
const byId = (id) => document.getElementById(id);
const esc = (s) =>
  String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// Normalize Mongo _id to a string for UI/data-id
function getId(doc) {
  const v = doc && doc._id;
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object') return v.$oid || v.toString?.() || '';
  return String(v);
}

// ---- render table ----
function updateResults(rows = []) {
  const resultsBody = byId("results-body");
  if (!resultsBody) return;
  resultsBody.innerHTML = "";
  rows.forEach(r => {
    const id = getId(r);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${esc(id)}</td> 
      <td>${esc(r.name)}</td>
      <td>${esc(r.drink)}</td>
      <td>${esc(r.food)}</td>
      <td>${esc(r.createdOn)}</td>
      <td>${esc(r.readyInMin)}</td>
      <td>
        <button class="edit-btn" data-id="${esc(id)}">Edit</button>
        <button class="delete-btn" data-id="${esc(id)}">Delete</button>
      </td>
    `;
    resultsBody.appendChild(tr);
  });
}

// ---- show/hide login vs app ----
function showApp(loggedIn) {
  const login = byId("login-section"); // matches index.html
  const app   = byId("app");  // matches index.html
  if (!login || !app) return;
  login.hidden = !!loggedIn;
  app.hidden   = !loggedIn;
}

// ---- API calls ----
const submit = async (event) => {
  event.preventDefault();
  console.log("submitting data..");

  const nameInput  = byId("yourname");
  const drinkInput = byId("yourdrink");
  const foodInput  = byId("yourfood");

  const payload = {
    yourname:  nameInput?.value || "",
    yourdrink: drinkInput?.value || "",
    yourFood:  foodInput?.value || "", // capital F matches server
  };

  const res = await fetch("/submit", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) { await checkAuth(); return; }
  const data = await res.json();
  updateResults(data.data);
  console.log("submit ->", data);
};

const getResults = async () => {
  console.log("getting results..");
  const res = await fetch("/results", { credentials: "same-origin" });
  if (res.status === 401) { await checkAuth(); return; }
  const info = await res.json();
  updateResults(info.data);
  console.log("data:", info);
};

// ---- table actions (edit/delete) via delegation ----
async function onResultsTableClick(e) {
  const deleteBtn = e.target.closest(".delete-btn");
  const editBtn   = e.target.closest(".edit-btn");
  if (!deleteBtn && !editBtn) return;

  // DELETE
  if (deleteBtn) {
    const id = deleteBtn.dataset.id; // keep as string for ObjectId
    if (!id) return;
    console.log("Deleting order id:", id);

    const res = await fetch("/delete", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.status === 401) { await checkAuth(); return; }
    const info = await res.json();
    updateResults(info.data);
    console.log("delete ->", info);
    return;
  }

  // EDIT
  if (editBtn) {
    const id = editBtn.dataset.id; // keep as string
    if (!id) return;
    console.log("Editing order id:", id);

    const tr = editBtn.closest("tr");
    const currentName  = tr.children[1].textContent;
    const currentDrink = tr.children[2].textContent;
    const currentFood  = tr.children[3].textContent;

    const newName  = prompt("Edit name:",  currentName);
    if (newName === null) return;
    const newDrink = prompt("Edit drink:", currentDrink);
    if (newDrink === null) return;
    const newFood  = prompt("Edit food:",  currentFood);
    if (newFood === null) return;

    const res = await fetch("/edit", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        yourname:  newName,
        yourdrink: newDrink,
        yourFood:  newFood,
      }),
    });

    if (res.status === 401) { await checkAuth(); return; }
    const info = await res.json();
    updateResults(info.data);
    console.log("edit ->", info);
  }
}

// ---- auth ----
async function checkAuth() {
  const res = await fetch("/auth/me", { credentials: 'same-origin' });
  const me = await res.json();
  const authed = !!me.authenticated;
  showApp(authed);
  if (authed) await getResults();
}

// ---- wire everything AFTER DOM is ready ----
window.addEventListener("DOMContentLoaded", () => {
  byId("submit-btn")   ?.addEventListener("click", submit);
  byId("show-results") ?.addEventListener("click", getResults);
  byId("results-body") ?.addEventListener("click", onResultsTableClick);

  byId("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = byId("login-username")?.value.trim() || "";
    const password = byId("login-password")?.value || "";
    if (!username || !password) {
      byId("login-msg") && (byId("login-msg").textContent = "Username and password required");
      return;
    }

    const res = await fetch("/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    byId("login-msg") && (byId("login-msg").textContent =
      data.error || (data.created ? "Account created!" : "Logged in!"));

    await checkAuth();
  });

  byId("logout")?.addEventListener("click", async () => {
    await fetch("/auth/logout", { method: "POST", credentials: "same-origin" });
    await checkAuth();
  });

  checkAuth();
});
