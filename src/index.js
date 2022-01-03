import axios from "./utils/axios";

export class Cogsworth {
  constructor({ payloadEndpoint, payloadEndpointHeaders = {} }) {
    this.payload = null;
    this.payloadEndpoint = payloadEndpoint;
    this.payloadEndpointHeaders = payloadEndpointHeaders;
  }

  async getPayload() {
    const payload = await axios.get(this.payloadEndpoint, {
      headers: this.payloadEndpointHeaders,
    });

    return payload;
  }

  async upsertBusiness() {
    // Get payload with signature
    if (!this.payload) {
      this.payload = await this.getPayload();
    }

    // Call embed-api upsert-business endpoint
    const business = await axios.put("http://localhost:3000/api/businesses", {
      headers: this.payloadEndpointHeaders,
      body: {
        id: this.payload.business.id,
        name: this.payload.business.name,
      },
    });
    const business = response.json();

    return business;
  }

  async upsertUser() {
    if (!this.payload) {
      this.payload = await this.getPayload();
    }

    // Call embed-api upsert-user endpoint
    const response = await axios.put("http://localhost:3000/api/users", {
      headers: this.payloadEndpointHeaders,
      body: {
        id: this.payload.user.id,
        email: this.payload.user.email,
        name: this.payload.user.name,
      },
    });
    const user = await response.json();

    return user;
  }

  async upsertStaff() {
    if (!payload) {
      this.payload = await this.getPayload();
    }

    const response = await axios.put("http://localhost:3000/api/staffs", {
      headers: this.payloadEndpointHeaders,
      body: {
        id: this.payload.staff.id,
        email: this.payload.staff.email,
        name: this.payload.staff.name,
      },
    });
    const staff = await response.json();

    return staff;
  }

  getEmbedUrl() {
    this.payload = await this.getPayload();

    /*
     * Upserting user and business every time the embed-url
     * is requested ensures that they exist and are always
     * up to date with the partner's data.
     */
    const user = await this.upsertUser();
    const business = await this.upsertBusiness();
    const staff = await this.upsertStaff();

    const embedUrl = [
      `http://localhost:3000/`,
      `?signature=${this.payload.signature}`,
      `&partnerId=${this.payload.partner.id}`,
      `&businessId=${business.id}`, // Cogsworth Business ID
      `&userId=${user.id}`, // Cogsworth User ID
      `&staffId=${staff.id}`, // Cogsworth Staff ID
    ].join("");

    return embedUrl;
  }
}
