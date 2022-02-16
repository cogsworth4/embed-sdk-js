"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const utils_1 = require("./utils");
const templates_1 = __importStar(require("./templates"));
const EMBED_APP_URL = process.env.NEXT_PUBLIC_EMBED_APP_URL || 'https://embed-app.vercel.app';
class CogsworthClient {
    constructor({ payloadEndpoint, containerSelector, }) {
        this.payloadEndpoint = payloadEndpoint;
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Could not load Cogsworth widget: Element with selector ${containerSelector} not found`);
            return;
        }
        this.container = container;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.container) {
                return;
            }
            this.payload = yield this.getPayload();
            (0, utils_1.appendStyles)(templates_1.STYLES);
            (0, utils_1.renderIntoContainer)(this.container, templates_1.default.LOADING);
            const { user, business } = yield this.getUserStatus();
            if (user === 'UNAUTHORIZED' || business === 'UNAUTHORIZED') {
                (0, utils_1.renderIntoContainer)(this.container, templates_1.default.AUTHORIZE);
            }
            const role = this.payload.business.userRole;
            // When business exists already, we can always prompt the user to sign up
            if (user === 'NOT_FOUND' && business === 'CREATED') {
                return (0, utils_1.renderIntoContainer)(this.container, templates_1.default.SIGNUP, {
                    onClick: () => this.embedApp(),
                });
            }
            // Only owners can be prompted sign up to create a new business;
            // other roles are prompted to ask an admin to sign up first
            if (user === 'NOT_FOUND' && business === 'NOT_FOUND') {
                if (role === 'OWNER') {
                    return (0, utils_1.renderIntoContainer)(this.container, templates_1.default.SIGNUP, {
                        onClick: () => this.embedApp(),
                    });
                }
                else {
                    return (0, utils_1.renderIntoContainer)(this.container, templates_1.default.ASK_ADMIN);
                }
            }
            // If user exists already, we render the new business screen instead
            if (user === 'CREATED' && business === 'NOT_FOUND') {
                if (role === 'OWNER') {
                    return (0, utils_1.renderIntoContainer)(this.container, templates_1.default.NEW_BUSINESS, {
                        onClick: () => this.embedApp(),
                    });
                }
                else {
                    return (0, utils_1.renderIntoContainer)(this.container, templates_1.default.ASK_ADMIN);
                }
            }
            // Only possible scenario left is that both the business and user already exist
            // We can safely render the embed app now
            return this.embedApp();
        });
    }
    embedApp() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.renderIntoContainer)(this.container, templates_1.default.LOADING);
            // Create the iframe element and hide it
            const embedUrl = yield this.getEmbedUrl();
            const iframe = document.createElement('iframe');
            iframe.setAttribute('class', templates_1.CLASSES.IFRAME);
            iframe.setAttribute('style', 'display: none;');
            iframe.setAttribute('src', embedUrl);
            this.container.append(iframe);
            // Once the app has loaded, we can display the iframe
            iframe.onload = (e) => {
                (0, utils_1.removeElement)(`.${templates_1.CLASSES.LOADING}`);
                iframe.removeAttribute('style');
            };
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