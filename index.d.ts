import { PayloadEndpoint } from "./src/index";

export = CogsworthClient;

declare class CogsworthClient {
  constructor({ payloadEndpoint }: { payloadEndpoint: PayloadEndpoint });

  init(containerId: string): void;
}
/*
declare global {
  interface Window {
    CogsworthClient: CogsworthClient;
  }
}
*/