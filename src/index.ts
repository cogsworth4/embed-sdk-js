import axios, { AxiosRequestHeaders } from "axios";

const COGSWORTH_EMBED_APP_PATH = "http://localhost:3000";
const COGSWORTH_API_BASE_PATH = "http://localhost:3000/api";

export interface PayloadEndpoint {
  url: string;
  headers: AxiosRequestHeaders;
}

class CogsworthClient {
  payload: any;
  payloadEndpoint: PayloadEndpoint;

  constructor({ payloadEndpoint }: { payloadEndpoint: PayloadEndpoint }) {
    this.payloadEndpoint = payloadEndpoint;
  }

  async getPayload() {
    const response = await axios.get(this.payloadEndpoint.url, {
      headers: {
        "Content-Type": "application/json",
        ...(this.payloadEndpoint.headers || {}),
      },
    });

    return response.data;
  }

  async upsertBusiness(cogsworthUserId: string) {
    // Get payload with signature
    if (!this.payload) {
      this.payload = await this.getPayload();
    }

    // Call embed-api upsert-business endpoint
    const response = await axios.put(
      `${COGSWORTH_API_BASE_PATH}/partner/${this.payload.partnerId}/users/${cogsworthUserId}/businesses`,
      {
        id: this.payload.business.id, // This is the partner's internal id for this resource
        name: this.payload.business.name,
        timezone: this.payload.business.timezone,
        timestamp: this.payload.timestamp,
      },
      {
        headers: {
          Authorization: `Bearer: ${this.payload.business.signature}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }

  async upsertUser() {
    if (!this.payload) {
      this.payload = await this.getPayload();
    }

    // Call embed-api upsert-user endpoint
    const response = await axios.put(
      `${COGSWORTH_API_BASE_PATH}/partner/${this.payload.partnerId}/users`,
      {
        id: this.payload.user.id, // This is the partner's internal id for this resource
        name: this.payload.user.name,
        email: this.payload.user.email,
        role: this.payload.user.role,
        timestamp: this.payload.timestamp,
      },
      {
        headers: {
          Authorization: `Bearer: ${this.payload.user.signature}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }

  async getEmbedUrl() {
    this.payload = await this.getPayload();

    /*
     * Upserting user and business every time the embed-url
     * is requested ensures that they exist and are always
     * up to date with the partner's data.
     */
    const user = await this.upsertUser();
    const business = await this.upsertBusiness(user.id);

    console.log(business);

    return business.embedUrl;
  }
}

window.CogsworthClient = CogsworthClient;
