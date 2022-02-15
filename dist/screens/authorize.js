"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
exports.default = (container) => {
    const element = (0, common_1.getMainElement)({
        title: 'Link your Cogsworth account',
        text: 'Authorize this site in your Cogsworth dashboard to show your calendar right here.',
    });
    const button = (0, common_1.getButton)({
        label: 'Authorize',
        link: 'https://www.cogsworth.com/account/',
    });
    element.append(button);
    container.innerHTML = '';
    container.append(element);
};
//# sourceMappingURL=authorize.js.map