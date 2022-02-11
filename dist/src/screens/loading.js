"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (container) => {
    document.head.insertAdjacentHTML('beforeend', `<style>
    .loading-icon {
      display: block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .loading-icon div {
      display: inline-block;
      position: absolute;
      left: 8px;
      width: 16px;
      background: #ccc;
      animation: loading-icon 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    }
    .loading-icon div:nth-child(1) {
      left: 8px;
      animation-delay: -0.24s;
    }
    .loading-icon div:nth-child(2) {
      left: 32px;
      animation-delay: -0.12s;
    }
    .loading-icon div:nth-child(3) {
      left: 56px;
      animation-delay: 0;
    }
    @keyframes loading-icon {
      0% {
        top: 8px;
        height: 64px;
      }
      50%, 100% {
        top: 24px;
        height: 32px;
      }
    }
    #cogsworth-loading {
      color: #999;
    }
    #cogsworth-loading strong {
      display: block;
    }
  </style>`);
    const element = document.createElement('div');
    element.setAttribute('id', 'cogsworth-loading');
    element.innerHTML =
        '<div class="loading-icon"><div></div><div></div><div></div></div><strong>Scheduling Widget Loading</strong>';
    element.setAttribute('style', 'width: 100%; min-height: 300px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;');
    container.innerHTML = '';
    container.append(element);
};
//# sourceMappingURL=loading.js.map