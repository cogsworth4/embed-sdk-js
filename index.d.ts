import { PayloadEndpoint } from "./src/index";

export = CogsworthClient;

declare class CogsworthClient {
  constructor({ payloadEndpoint }: { payloadEndpoint: PayloadEndpoint });

  getEmbedUrl(): string;
}

declare global {
  interface Window {
    CogsworthClient: any;
  }
}
