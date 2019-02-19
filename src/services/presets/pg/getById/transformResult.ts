import { compose, map } from 'ramda';
import { Maybe } from 'folktale/maybe';
import { NamedTypeFactory } from '../../../../types/createNamedType';

const dataOrNull = <T>(typeFactory: NamedTypeFactory<T>) => (maybe: Maybe<T>) =>
  maybe.matchWith({
    Just: ({ value }) => typeFactory(value),
    Nothing: () => typeFactory(),
  });

export const transformResults = <SourceType, DestinationType>(
  typeFactory: NamedTypeFactory<DestinationType>
) => (transformDbResponse: (v: SourceType) => DestinationType) =>
  compose(
    dataOrNull(typeFactory),
    map(transformDbResponse)
  );
