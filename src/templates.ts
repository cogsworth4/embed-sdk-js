export const CLASSES = {
  CONTAINER: 'cogsworth-embed-container',
  IFRAME: 'cogsworth-embed-iframe',
  LOADING: 'cogsworth-embed-loading',
  LOADING_ICON: 'cogsworth-embed-loading-icon',
}

export const SIGNUP = `<div class="${CLASSES.CONTAINER}">
  <h2>Advanced, yet simple scheduling features</h2>
  <p>Sign up to Cogsworth and get your calendar right on our dashboard.</p>
  <button>Sign up</button>
</div>`

export const ASK_ADMIN = `<div class="${CLASSES.CONTAINER}">
  <h2>Advanced, yet simple scheduling features</h2>
  <p>Ask your account administrator to sign up to Cogsworth and get your calendar right on our dashboard.</p>
</div>`

export const NEW_BUSINESS = `<div class="${CLASSES.CONTAINER}">
  <h2>Advanced, yet simple scheduling features</h2>
  <p>Add this business to Cogsworth and get your calendar right on our dashboard.</p>
  <button>Add business</button>
</div>`

export const AUTHORIZE = `<div class="${CLASSES.CONTAINER}">
  <h2>Link your Cogsworth account</h2>
  <p>Authorize this site in your Cogsworth dashboard to show your calendar right here.</p>
  <a href="https://www.cogsworth.com/account/" target="_blank">Authorize</a>
</div>`

export const LOADING = `<div class="${CLASSES.LOADING}">
<div class="${CLASSES.LOADING_ICON}"><div></div><div></div><div></div></div>
<strong>Scheduling Widget Loading</strong>
</div>`

export const STYLES = `
  .${CLASSES.CONTAINER} {
    padding: 2rem;
    border: 1px solid #e5e7eb;
    background: #fff;
    text-align: center;
  }

  .${CLASSES.CONTAINER} h2 {
    color: #5f6a7e;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.25em;
  }

  .${CLASSES.CONTAINER} p {
    color: #5f6a7e;
    font-size: 1.25rem;
  }

  .${CLASSES.CONTAINER} button {
    display: inline-block;
    background-color: #7fcacb;
    color: #fff;
    font-weight: 500;
    border: none;
    padding: 0.5em 1.5em;
    border-radius: 5px;
    margin-top: 1em;
  }

  .${CLASSES.IFRAME} {
    width: 100%;
    min-height: 300px;
    height: 100%;
  }

  .${CLASSES.LOADING} {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #999;
  }
  .${CLASSES.LOADING} strong {
    display: block;
  }

  .${CLASSES.LOADING_ICON} {
    display: block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .${CLASSES.LOADING_ICON} div {
    display: inline-block;
    position: absolute;
    left: 8px;
    width: 16px;
    background: #ccc;
    animation: loading-icon-animation 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  }
  .${CLASSES.LOADING_ICON} div:nth-child(1) {
    left: 8px;
    animation-delay: -0.24s;
  }
  .${CLASSES.LOADING_ICON} div:nth-child(2) {
    left: 32px;
    animation-delay: -0.12s;
  }
  .${CLASSES.LOADING_ICON} div:nth-child(3) {
    left: 56px;
    animation-delay: 0;
  }
  @keyframes loading-icon-animation {
    0% {
      top: 8px;
      height: 64px;
    }
    50%, 100% {
      top: 24px;
      height: 32px;
    }
  }`

export default {
  SIGNUP,
  ASK_ADMIN,
  NEW_BUSINESS,
  AUTHORIZE,
  LOADING,
}
