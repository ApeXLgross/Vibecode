const colors = { line: "#9d8cff", income: "#56e5ff", expense: "#ff5f87", grid: "rgba(119,144,174,.18)", label: "#a8b6c8" };
const formatCompactEuro = (value) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", notation: "compact", maximumFractionDigits: 0 }).format(value);

export function drawBalanceChart(canvas, transactions, animate = false, onFrame) {
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const padding = { top: 24, right: 18, bottom: 30, left: 18 };
  const values = transactions.map((item) => item.balance);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = max - min || 1;
  const x = (index) => padding.left + index * (width - padding.left - padding.right) / Math.max(values.length - 1, 1);
  const y = (value) => padding.top + (max - value) * (height - padding.top - padding.bottom) / range;
  const duration = 30000;
  let elapsed = 0;
  let previousTimestamp;
  let controller;

  const render = (timestamp = performance.now()) => {
    if (controller.paused) return;
    if (previousTimestamp === undefined) previousTimestamp = timestamp;
    elapsed += timestamp - previousTimestamp;
    previousTimestamp = timestamp;
    const progress = animate ? Math.min(1, elapsed / duration) : 1;
    const visible = Math.max(2, Math.floor(values.length * progress));
    context.clearRect(0, 0, width, height);
    context.strokeStyle = colors.grid;
    context.lineWidth = 1;
    for (let step = 0; step < 5; step += 1) {
      const gridY = padding.top + step * (height - padding.top - padding.bottom) / 4;
      context.beginPath();
      context.moveTo(padding.left, gridY);
      context.lineTo(width - padding.right, gridY);
      context.stroke();
      context.fillStyle = colors.label;
      context.font = "10px system-ui";
      context.textAlign = "right";
      context.fillText(formatCompactEuro(max - step * range / 4), width - padding.right, gridY - 5);
    }
    const gradient = context.createLinearGradient(0, padding.top, 0, height);
    gradient.addColorStop(0, "rgba(157,140,255,.35)");
    gradient.addColorStop(1, "rgba(157,140,255,0)");
    context.beginPath();
    context.moveTo(x(0), height - padding.bottom);
    values.slice(0, visible).forEach((value, index) => context.lineTo(x(index), y(value)));
    context.lineTo(x(visible - 1), height - padding.bottom);
    context.closePath();
    context.fillStyle = gradient;
    context.fill();
    context.beginPath();
    values.slice(0, visible).forEach((value, index) => index ? context.lineTo(x(index), y(value)) : context.moveTo(x(index), y(value)));
    context.strokeStyle = colors.line;
    context.lineWidth = 3;
    context.shadowBlur = 12;
    context.shadowColor = colors.line;
    context.stroke();
    context.shadowBlur = 0;
    values.slice(0, visible).forEach((value, index) => {
      const item = transactions[index];
      if (item.amount > 0 || Math.abs(item.amount) >= 300) {
        context.beginPath();
        context.arc(x(index), y(value), item.amount > 0 ? 5 : 4, 0, Math.PI * 2);
        context.fillStyle = item.amount > 0 ? colors.income : colors.expense;
        context.fill();
      }
    });
    if (visible === values.length) {
      const lastIndex = values.length - 1;
      context.beginPath();
      context.arc(x(lastIndex), y(values[lastIndex]), 7, 0, Math.PI * 2);
      context.fillStyle = "#56e5ff";
      context.fill();
      context.beginPath();
      context.arc(x(lastIndex), y(values[lastIndex]), 3, 0, Math.PI * 2);
      context.fillStyle = "#07111f";
      context.fill();
      context.fillStyle = "#dffbff";
      context.font = "600 11px system-ui";
      context.textAlign = lastIndex > values.length - 3 ? "right" : "left";
      context.fillText(`Aktuell ${formatCompactEuro(values[lastIndex])}`, x(lastIndex) - 10, Math.max(16, y(values[lastIndex]) - 13));
    }
    onFrame?.({ progress, visible, x, y, complete: progress >= 1, paused: controller.paused });
    if (progress < 1) requestAnimationFrame(render);
    else controller.complete = true;
  };

  controller = {
    paused: false,
    complete: false,
    pause() { this.paused = true; },
    resume() { if (!this.complete) { this.paused = false; previousTimestamp = performance.now(); requestAnimationFrame(render); } }
  };
  if (animate) requestAnimationFrame(render);
  else render();
  return controller;
}
