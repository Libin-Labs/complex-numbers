import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
const close = (a, b, tol = 1e-12) =>
  assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} != ${b}`);
test('arithmetic and nonmutation', () => {
  const a = api.complex(1, 2),
    b = api.complex(3, -1);
  assert.deepEqual(api.add(a, b), { re: 4, im: 1 });
  assert.deepEqual(api.subtract(a, b), { re: -2, im: 3 });
  assert.deepEqual(api.multiply(a, b), { re: 5, im: 5 });
  const q = api.divide(api.multiply(a, b), b);
  close(q.re, 1);
  close(q.im, 2);
  assert.deepEqual(a, { re: 1, im: 2 });
});
test('scaled extreme division and multiplication', () => {
  assert.deepEqual(api.divide(api.complex(1e308, 1e308), api.complex(1e308, 1e308)), {
    re: 1,
    im: 0,
  });
  close(api.multiply(api.complex(1e308), api.complex(1e-308)).re, 1);
  close(api.divide(api.complex(1e-308), api.complex(1e-308)).re, 1);
});
test('principal roots including signed zero', () => {
  assert.deepEqual(api.sqrt(api.complex(-4)), { re: 0, im: 2 });
  assert.equal(api.sqrt(api.complex(-4, -0)).im, -2);
  const z = api.sqrt(api.complex(1e308, 1e308));
  assert.ok(Number.isFinite(z.re) && Number.isFinite(z.im));
  const q = api.multiply(api.sqrt(api.complex(3, 4)), api.sqrt(api.complex(3, 4)));
  close(q.re, 3);
  close(q.im, 4);
});
test('magnitude phase and exponential', () => {
  assert.equal(api.abs(api.complex(3, 4)), 5);
  close(api.phase(api.complex(0, 1)), Math.PI / 2);
  const z = api.exp(api.complex(0, Math.PI));
  close(z.re, -1);
  close(z.im, 0);
  assert.equal(api.exp(api.complex(-1000)).re, 0);
});
test('invalid and zero denominator', () => {
  for (const v of [NaN, Infinity, -Infinity]) {
    assert.throws(() => api.complex(v));
    assert.throws(() => api.abs({ re: v, im: 0 }));
  }
  assert.throws(() => api.divide(api.complex(1), api.complex(0)), RangeError);
});
test('overflow is explicit', () => {
  assert.throws(
    () => api.add(api.complex(Number.MAX_VALUE), api.complex(Number.MAX_VALUE)),
    RangeError,
  );
  assert.throws(() => api.multiply(api.complex(1e308), api.complex(2)), RangeError);
  assert.throws(() => api.abs(api.complex(Number.MAX_VALUE, Number.MAX_VALUE)), RangeError);
  assert.throws(() => api.exp(api.complex(1000)), RangeError);
});
test('seeded multiplication division oracle', () => {
  let s = 3;
  for (let j = 0; j < 500; j++) {
    s = (1664525 * s + 1013904223) >>> 0;
    const a = api.complex(s / 2 ** 32 - 0.5, j / 500 - 0.5),
      b = api.complex(0.3, j / 501);
    const r = api.divide(api.multiply(a, b), b);
    close(r.re, a.re, 1e-12);
    close(r.im, a.im, 1e-12);
  }
});
