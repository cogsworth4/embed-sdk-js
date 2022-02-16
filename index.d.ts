import { PayloadEndpoint } from './src/index'

export = CogsworthClient

declare class CogsworthClient {
  constructor({
    payloadEndpoint,
    containerSelector,
  }: {
    payloadEndpoint: PayloadEndpoint
    containerSelector: string
  })

  init(): void
}
/*
declare global {
  interface Window {
    CogsworthClient: CogsworthClient;
  }
}
*/
