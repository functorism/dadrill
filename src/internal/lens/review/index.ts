export interface Review<S, A> {
  review: (a: A) => S;
}

export const review = <S, A>(review: (a: A) => S): Review<S, A> => ({
  review
});
