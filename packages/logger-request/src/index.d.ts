/// <reference types="express" />
import * as express from 'express';
export interface LoggerInterface {
    [key: string]: any;
}
export interface ExtendedRequest extends express.Request {
    [key: string]: any;
}
export interface ExtendedTokenCallbackFn {
    (req: ExtendedRequest, res: express.Response): any;
}
export interface Tokenizer {
    id: string;
    fn: ExtendedTokenCallbackFn;
}
export interface CreateLoggerParameters {
    additionalTokens?: Tokenizer[];
    hostname?: string;
    logger?: LoggerInterface;
    level?: string;
}
export declare function createLogger({additionalTokens, hostname, logger, level}?: CreateLoggerParameters): express.RequestHandler;
