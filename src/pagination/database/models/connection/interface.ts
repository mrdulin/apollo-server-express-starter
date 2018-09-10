export type ConnectionCursor = string | null;

export interface IPageInfo {
  startCursor?: ConnectionCursor;
  endCursor?: ConnectionCursor;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface IConnection<T> {
  edges: Array<IEdge<T>>;
  pageInfo: IPageInfo;
}

export interface IEdge<T> {
  node: T;
  cursor: ConnectionCursor;
}

export interface IConnectionArguments {
  before?: ConnectionCursor;
  after?: ConnectionCursor;
  first?: number;
  last?: number;
}
