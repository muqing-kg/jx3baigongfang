/* 跨端格式化：不依赖 Intl，避免小程序 JSCore 差异 */
export function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function round(v, d) {
  const f = Math.pow(10, d == null ? 2 : d);
  return Math.round((Number(v) + Number.EPSILON) * f) / f;
}

export function fmt(v, d) {
  if (v == null || !Number.isFinite(Number(v))) return '—';
  const digits = d == null ? 2 : d;
  const n = round(Number(v), digits);
  const neg = n < 0;
  const parts = Math.abs(n).toFixed(digits).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const frac = digits > 0 ? '.' + parts[1] : '';
  return (neg ? '-' : '') + intPart + frac;
}

export function fmtInt(v) {
  if (v == null || !Number.isFinite(Number(v))) return '—';
  return String(Math.round(Number(v))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function fmtPct(v, d) {
  if (v == null || !Number.isFinite(Number(v))) return '—';
  return (Number(v) * 100).toFixed(d == null ? 0 : d) + '%';
}

export function fmtSigned(v, d) {
  if (v == null || !Number.isFinite(Number(v))) return '—';
  return (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v), d);
}

export function fmtTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const p = function (n) { return String(n).padStart(2, '0'); };
  return p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}

export function truncate(s, n) {
  s = String(s == null ? '' : s);
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export function today() {
  const d = new Date();
  const p = function (n) { return String(n).padStart(2, '0'); };
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}
