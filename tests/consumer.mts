import * as api from '@lp-labs/complex-numbers';
const z: api.Complex = api.complex(3, 4);
api.add(z, z);
api.subtract(z, z);
api.multiply(z, z);
api.divide(z, z);
api.abs(z);
api.phase(z);
api.sqrt(z);
api.exp(z);
// @ts-expect-error Invalid API input must be rejected.
api.complex('3');
