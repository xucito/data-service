import { compose, map } from 'ramda';
import { Maybe } from 'folktale/maybe';

const dataOrNull = <ResponseTransformed>(
  typeFactory: (v?: any) => ResponseTransformed
) => (maybe: Maybe<any>) =>
  maybe.matchWith({
    Just: ({ value }) => typeFactory(value),
    Nothing: () => typeFactory(),
  });

// (result: Maybe<ResRaw>, request: ReqRaw) => ResTransformed;

export const transformResults = <ResponseRaw, ResponseTransformed>(
  typeFactory: (a?: any) => ResponseTransformed
) => (transformDbResponse: (res: ResponseRaw) => any) =>
  compose(
    dataOrNull(typeFactory),
    map(transformDbResponse)
  );

// // @todo parameterize output type
// /** dataOrNull :: t -> Maybe DbResponse -> Maybe */
// const dataOrNull = typeFactory => maybe =>
//   maybe.matchWith({
//     Just: ({ value }) => typeFactory(value),
//     Nothing: () => null,
//   });

// /** transformResults :: t -> transformDbResponse -> (Maybe DbResponse) -> t | null */
// const transformResults = typeFactory => transformDbResponse =>
//   compose(
//     dataOrNull(typeFactory),
//     map(transformDbResponse)
//   );
