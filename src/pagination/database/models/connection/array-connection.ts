import { ConnectionCursor, IConnectionArguments, IConnection } from './interface';
import { base64, unbase64 } from '../../../../utils';

interface IArraySliceMetaInfo {
  sliceStart: number;
  arrayLength: number;
}

const PREFIX = 'arrayconnection:';

/**
 * Creates the cursor string from an offset.
 */
export function offsetToCursor(offset: number): ConnectionCursor {
  return base64(PREFIX + offset);
}

/**
 * Rederives the offset from the cursor string.
 */
export function cursorToOffset(cursor: ConnectionCursor): number | undefined {
  if (cursor) {
    return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
  }
}

export function connectionFromArray<T>(data: T[], args: IConnectionArguments): IConnection<T> {
  return connectionFromArraySlice(data, args, {
    sliceStart: 0,
    arrayLength: data.length
  });
}

export function connectionFromArraySlice<T>(
  arraySlice: T[],
  args: IConnectionArguments,
  meta: IArraySliceMetaInfo
): IConnection<T> {
  const { after, before, first, last } = args;
  const { sliceStart, arrayLength } = meta;
  const sliceEnd = sliceStart + arraySlice.length;
  const beforeOffset = getOffsetWithDefault(arrayLength, before);
  const afterOffset = getOffsetWithDefault(-1, after);

  let startOffset = Math.max(sliceStart - 1, afterOffset, -1) + 1;
  let endOffset = Math.min(sliceEnd, beforeOffset, arrayLength);
  if (typeof first === 'number') {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }

    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (typeof last === 'number') {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }

    startOffset = Math.max(startOffset, endOffset - last);
  }

  // If supplied slice is too large, trim it down before mapping over it.
  const slice = arraySlice.slice(Math.max(startOffset - sliceStart, 0), arraySlice.length - (sliceEnd - endOffset));

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: value
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const lowerBound = after ? afterOffset + 1 : 0;
  const upperBound = before ? beforeOffset : arrayLength;
  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: typeof last === 'number' ? startOffset > lowerBound : false,
      hasNextPage: typeof first === 'number' ? endOffset < upperBound : false
    }
  };
}

export function getOffsetWithDefault(defaultOffset: number, cursor?: ConnectionCursor): number {
  if (typeof cursor !== 'string') {
    return defaultOffset;
  }
  const offset = cursorToOffset(cursor);
  if (!offset) {
    return defaultOffset;
  }
  return isNaN(offset) ? defaultOffset : offset;
}
