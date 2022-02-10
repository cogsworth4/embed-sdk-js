"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (container, embedUrl) => {
    const element = document.createElement('iframe');
    element.setAttribute('src', embedUrl);
    element.setAttribute('style', 'width: 100%; min-height: 300px; height: 100%;');
    container.innerHTML = '';
    container.append(element);
};
//# sourceMappingURL=embed-app.js.map