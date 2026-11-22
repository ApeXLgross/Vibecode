export const state = { transactions: [], search: "", category: "all", type: "all", amount: "all", period: "all", sort: "newest", playing: false, theme: "dark" };

const isoWeekKey = (dateValue) => {
  const date = new Date(`${dateValue}T12:00:00`);
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utcDate - yearStart) / 86400000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

export function filteredTransactions() {
  return state.transactions.filter((item) => {
    const matchesCategory = state.category === "all" || item.category === state.category;
    const matchesType = state.type === "all" || (state.type === "income" && item.amount >= 0) || (state.type === "expense" && item.amount < 0);
    const matchesAmount = state.amount === "all" || (state.amount === "big" && Math.abs(item.amount) >= 300) || (state.amount === "small" && Math.abs(item.amount) < 50);
    const matchesPeriod = state.period === "all" || (state.period.startsWith("month:") && item.date.slice(0, 7) === state.period.slice(6)) || (state.period.startsWith("week:") && isoWeekKey(item.date) === state.period.slice(5));
    const query = state.search.toLowerCase();
    return matchesCategory && matchesType && matchesAmount && matchesPeriod && (!query || `${item.description} ${item.category} ${item.date}`.toLowerCase().includes(query));
  }).sort((a, b) => {
    if (state.sort === "oldest") return a.date.localeCompare(b.date);
    if (state.sort === "largest") return Math.abs(b.amount) - Math.abs(a.amount);
    return b.date.localeCompare(a.date);
  });
}
