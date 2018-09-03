declare module 'apollo-upload-server' {
  import { Request, RequestHandler } from 'express';
  import { GraphQLScalarType } from 'graphql';

  export const GraphQLUpload: GraphQLScalarType;

  export type ApolloUploadOptions = {
    /**
     * Max allowed non-file multipart form field size in bytes; enough for your queries (default: 1 MB)
     */
    maxFieldSize?: number;
    /**
     * Max allowed file size in bytes (default: Infinity)
     */
    maxFileSize?: number;
    /**
     * Max allowed number of files (default: Infinity)
     */
    maxFiles?: number;
  };

  export function apolloUploadExpress(options?: ApolloUploadOptions): RequestHandler;
  export function processRequest(request: Request, options?: ApolloUploadOptions): Promise<any>;
}
