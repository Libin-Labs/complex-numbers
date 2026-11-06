export interface Complex {
  re: number;
  im: number;
}
function finite(x: number): number {
  if (!Number.isFinite(x)) throw new TypeError('Expected finite components.');
  return x;
}
function result(re: number, im: number): Complex {
  if (!Number.isFinite(re) || !Number.isFinite(im)) throw new RangeError('Complex overflow.');
  return { re, im };
}
function check(z: Complex): void {
  finite(z.re);
  finite(z.im);
}
function scaled(x: number, a: number, b: number, divide = false): number {
  if (x === 0 || a === 0) return 0;
  const ea = Math.min(1023, Math.floor(Math.log2(a)));
  const eb = Math.min(1023, Math.floor(Math.log2(b)));
  const ex = Math.min(1023, Math.floor(Math.log2(Math.abs(x))));
  const m = (x / 2 ** ex) * (a / 2 ** ea) * (divide ? 1 / (b / 2 ** eb) : b / 2 ** eb);
  const e = ex + ea + (divide ? -eb : eb);
  const first = Math.max(-1022, Math.min(1023, e));
  return m * 2 ** (e - first) * 2 ** first;
}
export function complex(re: number, im = 0): Complex {
  return { re: finite(re), im: finite(im) };
}
export function add(a: Complex, b: Complex): Complex {
  check(a);
  check(b);
  return result(a.re + b.re, a.im + b.im);
}
export function subtract(a: Complex, b: Complex): Complex {
  check(a);
  check(b);
  return result(a.re - b.re, a.im - b.im);
}
export function multiply(a: Complex, b: Complex): Complex {
  check(a);
  check(b);
  const s = Math.max(Math.abs(a.re), Math.abs(a.im)),
    t = Math.max(Math.abs(b.re), Math.abs(b.im));
  if (s === 0 || t === 0) return complex(0);
  return result(
    scaled((a.re / s) * (b.re / t) - (a.im / s) * (b.im / t), s, t),
    scaled((a.re / s) * (b.im / t) + (a.im / s) * (b.re / t), s, t),
  );
}
export function divide(a: Complex, b: Complex): Complex {
  check(a);
  check(b);
  const s = Math.max(Math.abs(a.re), Math.abs(a.im)),
    t = Math.max(Math.abs(b.re), Math.abs(b.im));
  if (t === 0) throw new RangeError('Division by zero.');
  if (s === 0) return complex(0);
  const br = b.re / t,
    bi = b.im / t,
    d = br * br + bi * bi;
  return result(
    scaled(((a.re / s) * br + (a.im / s) * bi) / d, s, t, true),
    scaled(((a.im / s) * br - (a.re / s) * bi) / d, s, t, true),
  );
}
export function abs(z: Complex): number {
  check(z);
  const n = Math.hypot(z.re, z.im);
  if (!Number.isFinite(n)) throw new RangeError('Magnitude overflow.');
  return n;
}
export function phase(z: Complex): number {
  check(z);
  return Math.atan2(z.im, z.re);
}
export function sqrt(z: Complex): Complex {
  check(z);
  const s = Math.max(Math.abs(z.re), Math.abs(z.im));
  if (s === 0) return complex(0, z.im);
  const u = Math.sqrt(s) * Math.sqrt((Math.hypot(z.re / s, z.im / s) + Math.abs(z.re) / s) / 2);
  return z.re >= 0
    ? result(u, z.im / (2 * u))
    : result(Math.abs(z.im) / (2 * u), z.im < 0 || Object.is(z.im, -0) ? -u : u);
}
export function exp(z: Complex): Complex {
  check(z);
  const c = Math.cos(z.im),
    s = Math.sin(z.im);
  const component = (v: number) =>
    v === 0 ? v : Math.sign(v) * Math.exp(z.re + Math.log(Math.abs(v)));
  return result(component(c), component(s));
}
