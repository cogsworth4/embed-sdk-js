"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const signup_1 = __importDefault(require("./screens/signup"));
const authorize_1 = __importDefault(require("./screens/authorize"));
const embed_app_1 = __importDefault(require("./screens/embed-app"));
const ask_admin_1 = __importDefault(require("./screens/ask-admin"));
const new_business_1 = __importDefault(require("./screens/new-business"));
const loading_1 = __importDefault(require("./screens/loading"));
const EMBED_APP_URL = process.env.NEXT_PUBLIC_EMBED_APP_URL || 'https://embed-app.vercel.app';
class CogsworthClient {
    constructor({ payloadEndpoint }) {
        this.payloadEndpoint = payloadEndpoint;
    }
    init(elementId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload = yield this.getPayload();
            const element = document.getElementById(elementId);
            if (!element) {
                console.error(`Cogsworth Embed App: Element with ID ${elementId} not found`);
                return;
            }
            (0, loading_1.default)(element);
            const { user, business } = yield this.getUserStatus();
            if (user === 'UNAUTHORIZED' || business === 'UNAUTHORIZED') {
                return (0, authorize_1.default)(element);
            }
            const role = this.payload.business.userRole;
            // When business exists already, we can always prompt the user to sign up
            if (user === 'NOT_FOUND' && business === 'CREATED') {
                return (0, signup_1.default)(element, () => this.embedApp(element));
            }
            // Only owners can be prompted sign up to create a new business;
            // other roles are prompted to ask an admin to sign up first
            if (user === 'NOT_FOUND' && business === 'NOT_FOUND') {
                return role === 'OWNER'
                    ? (0, signup_1.default)(element, () => this.embedApp(element))
                    : (0, ask_admin_1.default)(element);
            }
            // If user exists already, we render the new business screen instead
            if (user === 'CREATED' && business === 'NOT_FOUND') {
                return role === 'OWNER'
                    ? (0, new_business_1.default)(element, () => this.embedApp(element))
                    : (0, ask_admin_1.default)(element);
            }
            // Only possible scenario left is that both the business and user already exist
            // We can safely render the embed app now
            return this.embedApp(element);
        });
    }
    embedApp(element) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, loading_1.default)(element);
            const embedUrl = yield this.getEmbedUrl();
            (0, embed_app_1.default)(element, embedUrl);
        });
    }
    getUserStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${EMBED_APP_URL}/api/partner/${encodeURIComponent(this.payload.partnerId)}/user-status?userEmail=${encodeURIComponent(this.payload.user.email)}&businessId=${encodeURIComponent(this.payload.business.id)}`);
            return response.data.data;
        });
    }
    getEmbedUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
             * Upserting user and business every time the embed-url
             * is requested ensures that they exist and are always
             * up to date with the partner's data.
             */
            const user = yield this.upsertUser();
            const business = yield this.upsertBusiness(user.data.id);
            return business.data.embedUrl;
        });
    }
    getPayload() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(this.payloadEndpoint.url, {
                headers: Object.assign({ 'Content-Type': 'application/json' }, (this.payloadEndpoint.headers || {})),
            });
            return response.data;
        });
    }
    upsertBusiness(cogsworthUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Call embed-api upsert-business endpoint
            const response = yield axios_1.default.put(`${EMBED_APP_URL}/api/partner/${this.payload.partnerId}/users/${cogsworthUserId}/businesses`, {
                id: this.payload.business.id,
                name: this.payload.business.name,
                timestamp: this.payload.timestamp,
                timezone: this.payload.business.timezone,
                userRole: this.payload.business.userRole,
                location: this.payload.business.location,
            }, {
                headers: {
                    Authorization: `Bearer: ${this.payload.business.signature}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        });
    }
    upsertUser() {
        return __awaiter(this, void 0, void 0, function* () {
            // Call embed-api upsert-user endpoint
            const response = yield axios_1.default.put(`${EMBED_APP_URL}/api/partner/${this.payload.partnerId}/users`, {
                id: this.payload.user.id,
                name: this.payload.user.name,
                email: this.payload.user.email,
                timestamp: this.payload.timestamp,
            }, {
                headers: {
                    Authorization: `Bearer: ${this.payload.user.signature}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        });
    }
}
exports.default = CogsworthClient;
//# sourceMappingURL=index.js.map