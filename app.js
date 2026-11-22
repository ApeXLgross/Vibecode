import { loadTransactions, summarize } from "./js/data.js";
import { state } from "./js/state.js";
import { drawBalanceChart } from "./js/charts.js";
import { renderCategories, renderEvents, renderMetrics, renderTable, renderTimeline } from "./js/render.js";

const $ = (selector) => document.querySelector(selector);
let chartTimer;
let runEvents = [];
let triggeredEvents = new Set();
let activeRun;
let currentRunIndex = 0;
const animeEffect = (targets, options) => { if (window.anime) window.anime({ targets, ...options }); };
const formatRunDate = (value) => new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`));
const formatRunMoney = (value) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
const isoWeekKey = (dateValue) => { const date = new Date(`${dateValue}T12:00:00`); const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); const day = utcDate.getUTCDay() || 7; utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day); const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1)); return `${utcDate.getUTCFullYear()}-W${String(Math.ceil(((utcDate - yearStart) / 86400000 + 1) / 7)).padStart(2, "0")}`; };
const monthLabel = (key) => new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(new Date(`${key}-01T12:00:00`));
const weekLabel = (key) => `KW ${Number(key.slice(-2))} · ${key.slice(0, 4)}`;

function setupPeriodFilter() {
  const filter = document.createElement("select");
  filter.id = "periodFilter";
  filter.setAttribute("aria-label", "Monat oder Woche filtern");
  filter.innerHTML = '<option value="all">Alle Monate + Wochen</option>';
  $(".filter-row").append(filter);
  filter.addEventListener("change", (event) => { state.period = event.target.value; renderTable(); });
}

function populatePeriodFilter(transactions) {
  const filter = $("#periodFilter");
  const months = [...new Set(transactions.map((item) => item.date.slice(0, 7)))].sort().reverse();
  const weeks = [...new Set(transactions.map((item) => isoWeekKey(item.date)))].sort().reverse();
  filter.innerHTML = `<option value="all">Alle Monate + Wochen</option><optgroup label="Monate">${months.map((key) => `<option value="month:${key}">${monthLabel(key)}</option>`).join("")}</optgroup><optgroup label="Wochen">${weeks.map((key) => `<option value="week:${key}">${weekLabel(key)}</option>`).join("")}</optgroup>`;
  state.period = "all";
}

function setupPausePanel() {
  const panel = document.createElement("aside");
  panel.id = "pauseSnapshot";
  panel.className = "pause-snapshot";
  panel.hidden = true;
  panel.setAttribute("aria-live", "polite");
  $(".chart-launchbar").append(panel);
  $("#pauseButton").addEventListener("click", () => {
    window.requestAnimationFrame(() => {
      const item = state.transactions[currentRunIndex];
      if (activeRun?.paused && item) updatePausePanel(item);
      else panel.hidden = true;
    });
  });
}

function updatePausePanel(item) {
  const dailyMoves = state.transactions.filter((transaction) => transaction.date === item.date);
  const income = dailyMoves.filter((transaction) => transaction.amount > 0).reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = dailyMoves.filter((transaction) => transaction.amount < 0).reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const panel = $("#pauseSnapshot");
  panel.hidden = false;
  panel.innerHTML = `<span class="snapshot-title">PAUSE · CHECKPOINT</span><span><b>${formatRunDate(item.date)}</b><small>Zeitpunkt</small></span><span><b>${formatRunMoney(item.balance)}</b><small>Kontostand</small></span><span class="snapshot-income"><b>+${formatRunMoney(income)}</b><small>Einnahmen heute</small></span><span class="snapshot-expense"><b>−${formatRunMoney(expenses)}</b><small>Ausgaben heute</small></span>`;
}

function setupUsageBattery() {
  const battery = document.createElement("section");
  battery.id = "usageBattery";
  battery.className = "usage-battery";
  battery.setAttribute("aria-label", "Tages- und Wochenverbrauch");
  battery.innerHTML = '<div class="usage-heading"><span>VERBRAUCH</span><small id="usageDate">Daten werden geladen</small></div><div class="usage-row"><div class="usage-label"><span>Heute</span><b id="dailyUse">--</b></div><div class="battery-track"><span id="dailyBattery"></span></div><small id="dailyNote">--</small></div><div class="usage-row"><div class="usage-label"><span>Diese Woche</span><b id="weeklyUse">--</b></div><div class="battery-track weekly"><span id="weeklyBattery"></span></div><small id="weeklyNote">--</small></div>';
  $(".mission-card").append(battery);
}

function renderUsageBattery(transactions) {
  const newestDate = transactions.at(-1)?.date;
  if (!newestDate) return;
  const expense = (items) => items.filter((item) => item.amount < 0).reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const dailyUse = expense(transactions.filter((item) => item.date === newestDate));
  const weekKey = isoWeekKey(newestDate);
  const weeklyUse = expense(transactions.filter((item) => isoWeekKey(item.date) === weekKey));
  const dayGroups = [...new Set(transactions.map((item) => item.date))];
  const weekGroups = [...new Set(transactions.map((item) => isoWeekKey(item.date)))];
  const dailyAverage = expense(transactions) / Math.max(dayGroups.length, 1);
  const weeklyAverage = expense(transactions) / Math.max(weekGroups.length, 1);
  const batteryLevel = (value, average) => Math.max(8, Math.min(100, value / Math.max(average * 2, 1) * 100));
  $("#usageDate").textContent = formatRunDate(newestDate);
  $("#dailyUse").textContent = formatRunMoney(dailyUse);
  $("#weeklyUse").textContent = formatRunMoney(weeklyUse);
  $("#dailyBattery").style.width = `${batteryLevel(dailyUse, dailyAverage)}%`;
  $("#weeklyBattery").style.width = `${batteryLevel(weeklyUse, weeklyAverage)}%`;
  $("#dailyNote").textContent = `Ø ${formatRunMoney(dailyAverage)} pro Tag`;
  $("#weeklyNote").textContent = `Ø ${formatRunMoney(weeklyAverage)} pro Woche`;
}

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[character]));
const eventLabel = (item) => {
  if (item.amount > 0) return "Einnahmen-Boost";
  if (/miete/i.test(item.description)) return "Mietkosten";
  if (/krankenkasse|versicherung/i.test(item.description)) return "Versicherung";
  return "Ausgaben-Event";
};

function showChartEvent(item, x, y) {
  const pop = $("#eventPop");
  const runner = $("#skeetRunner");
  const balloon = runner.querySelector(".runner-balloon");
  const index = state.transactions.indexOf(item);
  const positive = item.amount > 0;
  const amount = formatRunMoney(item.amount);
  const stageWidth = $(".chart-stage").clientWidth;
  const popX = Math.max(96, Math.min(stageWidth - 96, x(index)));
  pop.className = `event-pop ${positive ? "income" : "expense"} show`;
  pop.style.left = `${popX}px`;
  pop.style.top = `${Math.max(44, y(item.balance))}px`;
  pop.innerHTML = `<strong>${positive ? "&#8593;" : "&#8595;"} ${eventLabel(item)}</strong><br><b>${positive ? "+" : ""}${amount}</b><small>${escapeHtml(item.description)}</small>`;
  balloon.textContent = positive ? "\u{1F60A}" : "\u{1F622}";
  runner.className = `skeet-runner bull-runner running ${positive ? "boost" : "drop"}`;
  window.clearTimeout(chartTimer);
  chartTimer = window.setTimeout(() => {
    pop.className = "event-pop";
    runner.className = "skeet-runner bull-runner running";
  }, 1500);
}

function showSelectedTransaction(item) { const canvas = $("#balanceChart"); const index = state.transactions.indexOf(item); const width = canvas.clientWidth; const height = canvas.clientHeight; const padding = { top: 24, right: 18, bottom: 30, left: 18 }; const values = state.transactions.map((transaction) => transaction.balance); const min = Math.min(...values, 0); const max = Math.max(...values, 1); const range = max - min || 1; const x = padding.left + index * (width - padding.left - padding.right) / Math.max(values.length - 1, 1); const y = padding.top + (max - item.balance) * (height - padding.top - padding.bottom) / range; const row = document.querySelector(`#transactionBody tr[data-row-id="${item.id}"]`); document.querySelectorAll("#transactionBody tr").forEach((tableRow) => tableRow.classList.toggle("selected-row", tableRow === row)); animeEffect(row, { translateX: [-10, 0], duration: 500, easing: "easeOutCubic" }); showChartEvent(item, () => x, () => y); $(".chart-panel").scrollIntoView({ behavior: "smooth", block: "center" }); }

function playJourney() { if (state.playing) return; state.playing = true; triggeredEvents = new Set(); runEvents = state.transactions.filter((item) => item.amount > 300 || /miete|krankenkasse|versicherung/i.test(item.description)); $("#chartEmpty").hidden = true; $("#playButton").classList.add("flash"); $("#playButton span:last-child").textContent = "Run läuft ..."; $("#chartPlayButton").classList.add("flash"); $("#chartPlayButton").disabled = true; $("#pauseButton").disabled = false; $("#pauseButton").textContent = "Pause"; $("#chartPlayButton span:last-child").textContent = "Bull Run läuft ..."; $("#runStatus").textContent = "Läuft · 01.04.2026 · Startposition"; $("#skeetRunner").className = "skeet-runner bull-runner running"; activeRun = drawBalanceChart($("#balanceChart"), state.transactions, true, ({ visible, x, y, complete }) => { const runner = $("#skeetRunner"); currentRunIndex = Math.min(visible - 1, state.transactions.length - 1); const currentItem = state.transactions[currentRunIndex]; runner.style.left = `${x(currentRunIndex)}px`; runner.style.top = `${Math.max(4, y(currentItem.balance) - 38)}px`; $("#runStatus").textContent = `Läuft · ${formatRunDate(currentItem.date)} · ${formatRunMoney(currentItem.balance)}`; runEvents.forEach((item) => { const itemIndex = state.transactions.indexOf(item); if (itemIndex <= currentRunIndex && !triggeredEvents.has(item.id)) { triggeredEvents.add(item.id); showChartEvent(item, x, y); } }); if (complete) { runner.style.left = `${x(state.transactions.length - 1)}px`; runner.style.top = `${Math.max(4, y(state.transactions.at(-1).balance) - 38)}px`; runner.className = "skeet-runner bull-runner finished"; state.playing = false; $("#pauseButton").disabled = true; $("#pauseButton").textContent = "Pause"; $("#runStatus").textContent = `Run beendet · ${formatRunDate(currentItem.date)} · ${formatRunMoney(currentItem.balance)}`; $("#chartPlayButton").disabled = false; $("#chartPlayButton span:last-child").textContent = "Bull Run erneut starten"; $("#playButton span:last-child").textContent = "Run erneut starten"; } }); }

function setupFilters() { $("#searchInput").addEventListener("input", (event) => { state.search = event.target.value; renderTable(); }); $("#categoryFilter").addEventListener("change", (event) => { state.category = event.target.value; renderTable(); }); $("#typeFilter").addEventListener("change", (event) => { state.type = event.target.value; renderTable(); }); $("#amountFilter").addEventListener("change", (event) => { state.amount = event.target.value; renderTable(); }); $("#sortFilter").addEventListener("change", (event) => { state.sort = event.target.value; renderTable(); }); $("#transactionBody").addEventListener("click", (event) => { const row = event.target.closest("tr[data-row-id]"); if (row) showSelectedTransaction(state.transactions.find((item) => item.id === Number(row.dataset.rowId))); }); $("#transactionBody").addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") event.target.click(); }); document.querySelectorAll("th[data-sort]").forEach((header) => { header.addEventListener("click", () => { state.sort = header.dataset.sort === "date" ? (state.sort === "newest" ? "oldest" : "newest") : "largest"; $("#sortFilter").value = state.sort; renderTable(); }); }); $("#pauseButton").addEventListener("click", () => { if (!activeRun || activeRun.complete) return; const pauseButton = $("#pauseButton"); if (activeRun.paused) { activeRun.resume(); $("#skeetRunner").classList.remove("paused"); pauseButton.textContent = "Pause"; $("#runStatus").textContent = `Läuft · ${formatRunDate(state.transactions[currentRunIndex].date)} · ${formatRunMoney(state.transactions[currentRunIndex].balance)}`; } else { activeRun.pause(); $("#skeetRunner").classList.add("paused"); pauseButton.textContent = "Weiter"; const item = state.transactions[currentRunIndex]; $("#runStatus").textContent = `Pausiert · ${formatRunDate(item.date)} · ${formatRunMoney(item.balance)} · ${item.description}`; } }); $("#themeToggle").addEventListener("click", () => { state.theme = state.theme === "dark" ? "light" : "dark"; document.body.classList.toggle("light", state.theme === "light"); }); $("#playButton").addEventListener("click", playJourney); $("#chartPlayButton").addEventListener("click", playJourney); $("#csvInput").addEventListener("change", async (event) => { if (event.target.files[0]) await boot(event.target.files[0]); }); }

async function boot(file) { try { state.transactions = await loadTransactions(file); const summary = summarize(state.transactions); summary.currentDate = state.transactions.at(-1)?.date; summary.incomeEvents = state.transactions.filter((item) => item.amount > 0).length; summary.expenseEvents = state.transactions.filter((item) => item.amount < 0).length; renderMetrics(summary); renderCategories(state.transactions); renderEvents(state.transactions); renderTable(); renderTimeline(state.transactions); const categories = [...new Set(state.transactions.map((item) => item.category))]; $("#categoryFilter").innerHTML = `<option value="all">Alle Kategorien</option>${categories.map((category) => `<option value="${category}">${category}</option>`).join("")}`; $("#chartEmpty").hidden = true; drawBalanceChart($("#balanceChart"), state.transactions, false); } catch (error) { $("#chartEmpty").textContent = "CSV konnte nicht geladen werden. Nutze 'CSV laden'."; console.error(error); } }

const loadDashboard = boot;
boot = async function(file) {
  await loadDashboard(file);
  if (state.transactions.length) { populatePeriodFilter(state.transactions); renderUsageBattery(state.transactions); }
};

setupPeriodFilter();
setupFilters();
setupPausePanel();
setupUsageBattery();
let visualTheme = state.theme;
$("#themeToggle").addEventListener("click", () => { const themes = ["dark", "light", "monochrome"]; visualTheme = themes[(themes.indexOf(visualTheme) + 1) % themes.length]; state.theme = visualTheme; document.body.classList.toggle("light", visualTheme === "light"); document.body.classList.toggle("monochrome", visualTheme === "monochrome"); const themeLabel = visualTheme === "dark" ? "Dunkles Theme" : visualTheme === "light" ? "Helles Theme" : "Schwarz-Weiss-Theme"; $("#themeToggle").textContent = visualTheme === "monochrome" ? "◐" : visualTheme === "light" ? "☼" : "◑"; $("#themeToggle").setAttribute("aria-label", `Theme wechseln: ${themeLabel}`); });
boot();
