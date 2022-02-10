"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
exports.default = (container, create) => {
    const element = (0, common_1.getMainElement)({
        title: 'Advanced, yet simple scheduling features',
        text: 'Add this business to Cogsworth and get your calendar right on our dashboard.',
    });
    const button = (0, common_1.getButton)({
        label: 'Add business',
        onClick: create,
    });
    element.append(button);
    container.innerHTML = '';
    container.append(element);
};
//# sourceMappingURL=new-business.js.map