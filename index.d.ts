import { PayloadEndpoint } from './src/index'

export = CogsworthClient

declare class CogsworthClient {
  constructor({
    partnerId,
    payloadEndpoint,
    containerSelector,
  }: {
    partnerId: string
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
