const CSV_URL = "realistic_student_adjusted_savings.csv";

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  return lines.slice(1).map((line, index) => {
    const columns = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).slice(0, 5);
    const values = columns.map((value) => value.replace(/^"|"$/g, "").replace(/""/g, '"'));
    const [date, description, amount, balance, category] = values;
    return { id: index, date, description, amount: Number(amount), balance: Number(balance), category };
  }).filter((item) => item.date && Number.isFinite(item.amount));
}

export async function loadTransactions(file) {
  const text = file ? await file.text() : await fetch(CSV_URL).then((response) => {
    if (!response.ok) throw new Error("CSV konnte nicht geladen werden");
    return response.text();
  });
  return parseCsv(text);
}

export function summarize(transactions) {
  const income = transactions.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions.filter((item) => item.amount < 0).reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const balances = transactions.map((item) => item.balance);
  const start = balances[0] ?? 0;
  const current = balances.at(-1) ?? 0;
  return { income, expenses, net: income - expenses, start, current, change: current - start, low: Math.min(...balances, 0), high: Math.max(...balances, 0), count: transactions.length };
}
