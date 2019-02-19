import { List, fromMaybe } from '../../../../types';
import { map, compose } from 'ramda';
import { NamedTypeFactory } from '../../../../types/createNamedType';

export const transformResults = <SourceType, DestinationType>(
  typeFactory: NamedTypeFactory<DestinationType>
) => (transformDbResponse: (v: SourceType[]) => DestinationType) =>
  compose(
    List,
    map( data => data
      // compose(
      //   fromMaybe(typeFactory),
      //   map(transformDbResponse)
      // )
    )
  );
