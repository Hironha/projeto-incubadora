import type expressWS from 'express-ws';

export type RouterFactory = () => expressWS.Router;
