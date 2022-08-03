/* eslint-disable prettier/prettier */
type FN<A, B> = (x: A) => B;

export function pipe<A>(x: A): A;
export function pipe<A, B>(x: A, f1: FN<A, B>): B;
export function pipe<A, B, C>(x: A, f1: FN<A, B>, f2: FN<B, C>): C;
export function pipe<A, B, C>(x: A, f1: FN<A, B>, f2: FN<B, C>): C;
export function pipe<A, B, C, D>(x: A, f1: FN<A, B>, f2: FN<B, C>, f3: FN<C, D>): D;
export function pipe<A, B, C, D, E>(x: A, f1: FN<A, B>, f2: FN<B, C>, f3: FN<C, D>, f4: FN<D, E>): E;
export function pipe<A, B, C, D, E, F>(x: A, f1: FN<A, B>, f2: FN<B, C>, f3: FN<C, D>, f4: FN<D, E>, f5: FN<E, F>): F;
export function pipe<A, B, C, D, E, F, G>(x: A, f1: FN<A, B>, f2: FN<B, C>, f3: FN<C, D>, f4: FN<D, E>, f5: FN<E, F>, f6: FN<F, G>): G;
export function pipe<A, B, C, D, E, F, G, H>(x: A, f1: FN<A, B>, f2: FN<B, C>, f3: FN<C, D>, f4: FN<D, E>, f5: FN<E, F>, f6: FN<F, G>, f7: FN<G, H>): H;
export function pipe<A, B, C, D, E, F, G, H, I>(x: A, f1: FN<A, B>, f2: FN<B, C>, f3: FN<C, D>, f4: FN<D, E>, f5: FN<E, F>, f6: FN<F, G>, f7: FN<G, H>, f8: FN<H, I>): I;
export function pipe<A, B, C, D, E, F, G, H, I, J>(x: A, f1: FN<A, B>, f2: FN<B, C>, f3: FN<C, D>, f4: FN<D, E>, f5: FN<E, F>, f6: FN<F, G>, f7: FN<G, H>, f8: FN<H, I>, f9: FN<I, J>): J;
export function pipe(x, ...fns) {
  return fns.reduce((v, f) => f(v), x);
}
