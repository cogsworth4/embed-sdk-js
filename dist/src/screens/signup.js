"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
exports.default = (container, signup) => {
    const element = (0, common_1.getMainElement)({
        title: "Advanced, yet simple scheduling features",
        text: "Sign up to Cogsworth and get your calendar right on our dashboard.",
    });
    const button = (0, common_1.getButton)({
        label: "Sign up",
        onClick: signup,
    });
    element.append(button);
    container.innerHTML = "";
    container.append(element);
};
//# sourceMappingURL=signup.js.map