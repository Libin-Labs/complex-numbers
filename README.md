# @lp-labs/complex-numbers

Finite complex construction, addition, subtraction, scaled multiplication/division, magnitude, phase, principal square root and exponential.

Standalone Node.js >=18 package. ESM and CommonJS with separate strict TypeScript declarations. No runtime, peer or sibling dependencies.

## Install

```sh
npm install @lp-labs/complex-numbers
```

## Example

```js
import { complex, multiply, sqrt, divide } from '@lp-labs/complex-numbers';
console.log(multiply(complex(1, 2), complex(3, -1))); // { re: 5, im: 5 }
console.log(sqrt(complex(-4))); // { re: 0, im: 2 }
console.log(divide(complex(1e308, 1e308), complex(1e308, 1e308)));
```

## API, customization, numerical behavior and limits

All components must be finite. add/subtract/multiply/divide/sqrt/exp return fresh Complex records; abs returns the Euclidean magnitude, phase returns atan2 in radians (including signed-zero behavior). divide rejects a zero denominator. sqrt chooses the principal branch, using the sign of the imaginary zero on the negative real axis. Scaling by powers of two avoids common intermediate overflows in multiplication and division; sqrt uses scaled hypot, exp evaluates each component in the log domain. Results are IEEE-754 doubles, not arbitrary precision or correctly rounded complex arithmetic. Cancellation and extreme component dynamic ranges may lose precision; representable underflow rounds to zero. A nonfinite output raises RangeError instead of returning Infinity/NaN. Work and memory are O(1). No customization options or callbacks.

## Full declarations

```ts
export interface Complex {
  re: number;
  im: number;
}
export declare function complex(re: number, im?: number): Complex;
export declare function add(a: Complex, b: Complex): Complex;
export declare function subtract(a: Complex, b: Complex): Complex;
export declare function multiply(a: Complex, b: Complex): Complex;
export declare function divide(a: Complex, b: Complex): Complex;
export declare function abs(z: Complex): number;
export declare function phase(z: Complex): number;
export declare function sqrt(z: Complex): Complex;
export declare function exp(z: Complex): Complex;
```

## Development

```sh
npm ci --offline --no-audit --no-fund
npm run build
npm run typecheck
npm test
npm run format:check
```

Tests use Node's built-in runner and include independent or analytic reference cases. No runtime global browser access, I/O or hidden dependencies.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
