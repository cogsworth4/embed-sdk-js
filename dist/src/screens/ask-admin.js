"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
exports.default = (container) => {
    const element = (0, common_1.getMainElement)({
        title: "Advanced, yet simple scheduling features",
        text: "Ask your account administrator to sign up to Cogsworth and get your calendar right on our dashboard.",
    });
    container.innerHTML = "";
    container.append(element);
};
//# sourceMappingURL=ask-admin.js.map