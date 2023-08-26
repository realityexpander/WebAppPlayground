import { LitElement, html } from 'lit';
import { Router, RouteMixin } from '../router/index.js';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { globalProp } from './globalProp.js';
import { authService } from './authenticationService.js';

// import './pages/page_home';
// import './components';

import './page_home'; // statically imported for fast loading.

class App extends Router(LitElement) {

    constructor() {
        super(authService.isLoggedIn); // pass the `isLoggedIn` callback **FUNCTION** to the Router

        this.appProp = "appProp1";
        // console.log('App constructor: globalProp = ' + globalProp);
        // console.log('App constructor: appProp = ' + this.appProp);

        authService.init();
    }

    // Not yet implemented
    start() {
        let id = setInterval(() => {
            this.requestUpdate();
        }, 1000);
    }

    static get routes() { // overrides Router.routes
        return [
            // Root path
            {
                path: "/",
                component: "page-home",
                //import: () => import("./page_home.js") // its already imported, so no need to import it again.
                secured: true
            },
            {
                path: "/home",
                component: "page-home",
                //import: () => import("./page_home.js") // its already imported, so no need to import it again.
                secured: true
            },
            {
                path: "/stocks",
                component: "page-stocks",
                import: () => import("./page_stocks.js"),
                secured: true
            },
            {
                path: "/files",
                component: "page-files",
                import: () => import("./page_files.js"),
                secured: true
            },
            {
                path: "/tabsandwindows",
                component: "page-tabsandwindows",
                import: () => import("./page_tabsandwindows.js"),
                secured: true
            },
            {
                path: "/broadcast-message",
                component: "page-broadcast-message",
                import: () => import("./page_broadcast_message.js"),
                secured: true
            },
            {
                path: "/web-worker",
                component: "page-web-worker",
                import: () => import("./page_web_worker.js"),
                secured: true
            },
            {
                path: "/reset-password/:?passwordResetToken",
                // component: "page-reset-password", // note: automatically extracts the passwordResetToken from the path
                render: routeProps => html`
                    <page-reset-password .passwordResetToken=${routeProps.passwordResetToken}>
                    </page-reset-password>
                `,
                import: () => import("./page_reset_password.js"),
                secured: false,
                publicOnly: false
            },
            // Using 'type' and 'day' variable.
            {
                path: "/stock/:type/:day",
                component: "page-stocks",
                import: () => import("./page_stocks.js"),
                secured: true
            },
            // Using 'stockId' and optionally 'againstRate' variable.
            {
                path: "/trade/:stockId/:?againstRate",
                component: "page-trade",
                import: () => import("./page_trade.js"),
                secured: true
            },
            {
                path: "/simpletables",
                component: "page-simpletables",
                import: () => import("./page_simpletables.js"),
                secured: true
            },
            {
                path: "/typescript-test",
                component: "page-typescript-test",
                import: () => import("./page_typescript_test.js"),
                secured: true
            },
            {
                path: "/virtualizers",
                component: "page-virtualizers",
                import: () => import("./page_virtualizers.js"),
                secured: true
            },
            {
                path: "/animation1",
                component: "page-animation1",
                import: () => import("./page_animation1.js"),
                secured: true
            },
            {
                path: "/slot-dialog",
                component: "page-slot-dialog",
                import: () => import("./page_slot_dialog.js"),
                secured: true
            },
            {
                path: "/library-app",
                component: "page-library-app",
                import: () => import("./page_library_app.js"),
                secured: true
            },
            {
                path: "/server-push",
                component: "page-server-push",
                import: () => import("./page_server_push.js"),
                secured: true
            },
            // Using 'category' variable, & is required.
            {
                path: "/news/:category",
                // component: "page-news",
                render: routeProps => html`
                    <page-news .category=${routeProps.category} .someOtherGlobalProp=${globalProp}>
                    </page-news>
                `,
                import: () => import("./page_news.js"),
                secured: true
            },
            // Login page
            {
                path: "/login/:?category",
                render: routeProps => html`
                    <page-login .category=${routeProps.category}>
                    </page-login>
                `,
                import: () => import("./page_login.js"),
                secured: false,
                publicOnly: true
            },
            // Logout page
            {
                path: "/logout",
                render: () => {
                    authService.logout();
                    return html`
                        <!-- center the text H & V -->
                        <style>
                            .centered {
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                            }
                        </style>
                        <div class="centered">
                            <h2>Logging out...</h2>
                        </div>
                    `;
                },
                secured: true,
                publicOnly: false
            },
            // Fallback for all unmatched routes.  
            {
                path: "*",
                render: () => html`
                <h2> 404 The requested page could not be found</h2>
                <br>
                requested location: <code>${window.location.href}</code> does not exist
                <br>
                <br>
                <a href="/">Home</a>
                `
            }
        ];
    }

    static styles = styles;

    render() {
        return (
            !this.isLoggedIn()) ?
            html`
            ${this.routeElement}
            `
            :
            html`
        <style>
            /*${this.app_style_css}*/
        </style>
        <body>
            ${this.app_drawer_html}
            ${this.app_content_begin_html}
            ${this.app_header_html}
            ${this.app_main_content_begin_html}
            ${this.routeElement}
            ${this.app_main_content_end_html}
            ${this.app_content_end_html}
        </body>
        `;
    }

    isLoggedIn() {
        return authService.isLoggedIn();
    }

    firstUpdated() {
        this.setupListeners();
    }

    setupListeners() {
        if (!this.isLoggedIn()) return;

        const drawer = mdc.drawer.MDCDrawer.attachTo(this.shadowRoot.querySelector('.mdc-drawer'));
        const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(this.shadowRoot.getElementById('app-bar'));
        topAppBar.setScrollTarget(this.shadowRoot.getElementById('main-content'));

        // Listen for any nav events, close drawer.
        topAppBar.listen('MDCTopAppBar:nav', () => {
            drawer.open = !drawer.open;
        });

        // escape key closes drawer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                drawer.open = false;
            }
        });

        // add ripple effect to buttons
        const buttons = this.shadowRoot.querySelectorAll('.mdc-button');
        for (let i = 0, button; button = buttons[i]; i++) {
            mdc.ripple.MDCRipple.attachTo(button);
        }

        // listen for the drawer to open to add listeners for the close button
        drawer.listen('MDCDrawer:opened', () => {
            // add listener to close button
            const closeButtons = this.shadowRoot.querySelector("#close-btn");
            closeButtons.addEventListener('click', () => {
                drawer.open = false;
            });
        });

        // listen for the drawer to close to remove listeners for the close button
        drawer.listen('MDCDrawer:closed', () => {
            // remove listener to close button
            const closeButtons = this.shadowRoot.querySelector("#close-btn");
            closeButtons.removeEventListener('click', () => {
                drawer.open = false;
            });
        });
    }

    removeListeners() {
        topAppBar.unlisten('MDCTopAppBar:nav'); // todo - does this work? Need to know
        this.shadowRoot.removeEventListener('keydown');
    }

    app_drawer_html = html`
    <aside class="mdc-drawer mdc-drawer--dismissible">
        <div class="mdc-drawer__header">
            <span style="display: flex; justify-content: space-between;">
                <h3 class="mdc-drawer__title">The App Name</h3>
                <i id="close-btn" class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-hidden="true"
                    style="padding: 12px 0px; text-align: center;">close</i>
            </span>
            <h6 class="mdc-drawer__subtitle">chris@gmail.com</h6>
        </div>
        <div class="mdc-drawer__content">
            <nav class="mdc-list">
                <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
                    <span class="mdc-list-item__text">Inbox</span>
                </a>
                <a class="mdc-list-item" href="#">
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>
                    <span class="mdc-list-item__text">Outgoing</span>
                </a>
                <a class="mdc-list-item" href="#">
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>
                    <span class="mdc-list-item__text">Drafts</span>
                </a>
                <hr class="mdc-list-divider">
                <h6 class="mdc-list-group__subheader">Labels</h6>
                <a class="mdc-list-item" href="/home">
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
                    <span class="mdc-list-item__text">Home</span>
                </a>
                <a class="mdc-list-item" href="/news/tech">
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
                    <span class="mdc-list-item__text">News - Tech</span>
                </a>
                <a class="mdc-list-item" href="/news/breaking">
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
                    <span class="mdc-list-item__text">News - Breaking</span>
                </a>
                <a class="mdc-list-item" href="/trade/MSFT/3400">
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
                    <span class="mdc-list-item__text">Trade MSFT</span>
                </a>
                <hr class="mdc-list-divider">
                <h6 class="mdc-list-group__subheader">Preferences</h6>
                <a class="mdc-list-item" href="#">
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings</i>
                    <span class="mdc-list-item__text">Settings</span>
                </a>
                <a class="mdc-list-item" href="/reset-password">
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">lock_reset</i>
                    <span class="mdc-list-item__text">Reset Password</span>
                </a>
                <a class="mdc-list-item" href="#">
                    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">help</i>
                    <span class="mdc-list-item__text">Help</span>
                </a>
            </nav>
        </div>
    </aside>
  `;
    app_content_begin_html = html`
    <div class="mdc-drawer-app-content">
  `;
    app_header_html = html`
    <header class="mdc-top-app-bar app-bar" id="app-bar">
        <div class="mdc-top-app-bar__row">
            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
                <span class="mdc-top-app-bar__title">Application Title</span>
            </section>
            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
                <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                    aria-label="Favorite">favorite</button>
                <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                    aria-label="Search">search</button>
                <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                    aria-label="Options">more_vert</button>
            </section>
        </div>
    </header>
  `;
    app_main_content_begin_html = html`
    <class="main-content" id="main-content">
        <div class="mdc-top-app-bar--fixed-adjust">
  `;
    app_main_content_end_html = html`
    </div>
  `;
    app_content_end_html = html`
    </div>
  `;

    // Pare down the CSS to just what we need for this example.
    app_style_css = `
  /*
  * {
    font-family: system-ui, Roboto, sans-serif;
    font-size: 1rem;
    padding: 0;
    margin: 0;
  
    --mdc-theme-primary: midnightblue;
    --mdc-theme-background: #EEEEEE;
  
    --mdc-typography-subtitle1-font-size: 1rem;
  }
  */
  
  .mdc-drawer {
      border-color: rgba(0,0,0,.12);
      background-color: #fff;
      border-radius: 0 0 0 0;
      z-index: 6;
      width: 256px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: 100%;
      border-right-width: 1px;
      border-right-style: solid;
      overflow: hidden;
      -webkit-transition-property: -webkit-transform;
      transition-property: -webkit-transform;
      -o-transition-property: transform;
      transition-property: transform;
      transition-property: transform,-webkit-transform;
      -webkit-transition-timing-function: cubic-bezier(.4,0,.2,1);
      -o-transition-timing-function: cubic-bezier(.4,0,.2,1);
      transition-timing-function: cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-drawer .mdc-drawer__title {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-drawer .mdc-drawer__subtitle,.mdc-drawer .mdc-list-group__subheader,.mdc-drawer .mdc-list-item__graphic {
      color: rgba(0,0,0,.6)
  }
  
  .mdc-drawer .mdc-list-item {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-drawer .mdc-list-item--activated .mdc-list-item__graphic {
      color: #6200ee
  }
  
  .mdc-drawer .mdc-list-item--activated {
      color: rgba(98,0,238,.87)
  }
  
  .mdc-drawer[dir=rtl],[dir=rtl] .mdc-drawer {
      border-radius: 0 0 0 0
  }
  
  .mdc-drawer .mdc-list-item {
      border-radius: 4px
  }
  
  .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing)+.mdc-drawer-app-content {
      margin-left: 256px;
      margin-right: 0
  }
  
  .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing)+.mdc-drawer-app-content[dir=rtl],[dir=rtl] .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing)+.mdc-drawer-app-content {
      margin-left: 0;
      margin-right: 256px
  }
  
  .mdc-drawer[dir=rtl],[dir=rtl] .mdc-drawer {
      border-right-width: 0;
      border-left-width: 1px;
      border-right-style: none;
      border-left-style: solid
  }
  
  .mdc-drawer .mdc-list-item {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.375rem;
      font-weight: 500;
      letter-spacing: .0071428571em;
      text-decoration: inherit;
      text-transform: inherit;
      height: 40px;
      margin: 8px;
      padding: 0 8px
  }
  
  .mdc-drawer .mdc-list-item:first-child {
      margin-top: 2px
  }
  
  .mdc-drawer .mdc-list-item:last-child {
      margin-bottom: 0
  }
  
  .mdc-drawer .mdc-list-group__subheader {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin: 0;
      padding: 0 16px
  }
  
  .mdc-drawer .mdc-list-group__subheader:before {
      display: inline-block;
      width: 0;
      height: 24px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-drawer .mdc-list-divider {
      margin: 3px 0 4px
  }
  
  .mdc-drawer .mdc-list-item__graphic,.mdc-drawer .mdc-list-item__text {
      pointer-events: none
  }
  
  .mdc-drawer--animate {
      -webkit-transform: translateX(-100%);
      -ms-transform: translateX(-100%);
      transform: translateX(-100%)
  }
  
  .mdc-drawer--animate[dir=rtl],[dir=rtl] .mdc-drawer--animate {
      -webkit-transform: translateX(100%);
      -ms-transform: translateX(100%);
      transform: translateX(100%)
  }
  
  .mdc-drawer--opening {
      -webkit-transition-duration: .25s;
      -o-transition-duration: .25s;
      transition-duration: .25s
  }
  
  .mdc-drawer--opening,.mdc-drawer--opening[dir=rtl],[dir=rtl] .mdc-drawer--opening {
      -webkit-transform: translateX(0);
      -ms-transform: translateX(0);
      transform: translateX(0)
  }
  
  .mdc-drawer--closing {
      -webkit-transform: translateX(-100%);
      -ms-transform: translateX(-100%);
      transform: translateX(-100%);
      -webkit-transition-duration: .2s;
      -o-transition-duration: .2s;
      transition-duration: .2s
  }
  
  .mdc-drawer--closing[dir=rtl],[dir=rtl] .mdc-drawer--closing {
      -webkit-transform: translateX(100%);
      -ms-transform: translateX(100%);
      transform: translateX(100%)
  }
  
  .mdc-drawer__header {
      -ms-flex-negative: 0;
      flex-shrink: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      min-height: 64px;
      padding: 0 16px 4px
  }
  
  .mdc-drawer__title {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 500;
      letter-spacing: .0125em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin-bottom: -20px
  }
  
  .mdc-drawer__title:before {
      display: inline-block;
      width: 0;
      height: 36px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-drawer__title:after {
      display: inline-block;
      width: 0;
      height: 20px;
      content: "";
      vertical-align: -20px
  }
  
  .mdc-drawer__subtitle {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin-bottom: 0
  }
  
  .mdc-drawer__subtitle:before {
      display: inline-block;
      width: 0;
      height: 20px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-drawer__content {
      height: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch
  }
  
  .mdc-drawer--dismissible {
      left: 0;
      right: auto;
      display: none;
      position: absolute
  }
  
  .mdc-drawer--dismissible[dir=rtl],[dir=rtl] .mdc-drawer--dismissible {
      left: auto;
      right: 0
  }
  
  .mdc-drawer--dismissible.mdc-drawer--open {
      display: -ms-flexbox;
      display: flex
  }
  
  .mdc-drawer-app-content {
      position: relative
  }
  
  .mdc-drawer-app-content,.mdc-drawer-app-content[dir=rtl],[dir=rtl] .mdc-drawer-app-content {
      margin-left: 0;
      margin-right: 0
  }
  
  .mdc-drawer--modal {
      -webkit-box-shadow: 0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);
      box-shadow: 0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);
      left: 0;
      right: auto;
      display: none;
      position: fixed
  }
  
  .mdc-drawer--modal+.mdc-drawer-scrim {
      background-color: rgba(0,0,0,.32)
  }
  
  .mdc-drawer--modal[dir=rtl],[dir=rtl] .mdc-drawer--modal {
      left: auto;
      right: 0
  }
  
  .mdc-drawer--modal.mdc-drawer--open {
      display: -ms-flexbox;
      display: flex
  }
  
  .mdc-drawer-scrim {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      -webkit-transition-property: opacity;
      -o-transition-property: opacity;
      transition-property: opacity;
      -webkit-transition-timing-function: cubic-bezier(.4,0,.2,1);
      -o-transition-timing-function: cubic-bezier(.4,0,.2,1);
      transition-timing-function: cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-drawer--open+.mdc-drawer-scrim {
      display: block
  }
  
  .mdc-drawer--animate+.mdc-drawer-scrim {
      opacity: 0
  }
  
  .mdc-drawer--opening+.mdc-drawer-scrim {
      -webkit-transition-duration: .25s;
      -o-transition-duration: .25s;
      transition-duration: .25s;
      opacity: 1
  }
  
  .mdc-drawer--closing+.mdc-drawer-scrim {
      -webkit-transition-duration: .2s;
      -o-transition-duration: .2s;
      transition-duration: .2s;
      opacity: 0
  }
  
  .hero {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-flow: row nowrap;
      flex-flow: row nowrap;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      min-height: 360px;
      background-color: #f2f2f2;
      overflow: auto
  }
  
  .sidebar-active {
      font-weight: 600
  }
  
  .demo-title {
      border-bottom: 1px solid rgba(0,0,0,.87)
  }
  
  .resources-graphic {
      width: 30px;
      height: 30px
  }
  
  .demo-panel {
      display: -ms-flexbox;
      display: flex;
      position: relative;
      height: 100vh;
      overflow: hidden
  }
  
  .mdc-drawer--dismissible.demo-drawer {
      z-index: 1
  }
  
  .demo-drawer {
      height: 100%
  }
  
  .demo-drawer .mdc-list-item {
      cursor: pointer
  }
  
  .demo-drawer-header {
      position: absolute;
      top: 18px;
      opacity: .74
  }
  
  .demo-content {
      height: 100%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      max-width: 100%;
      padding: 40px 16px 100px;
      -webkit-transition: -webkit-transform .2s cubic-bezier(.4,0,.2,1) 50ms;
      transition: -webkit-transform .2s cubic-bezier(.4,0,.2,1) 50ms;
      -o-transition: .2s transform cubic-bezier(.4,0,.2,1) 50ms;
      transition: transform .2s cubic-bezier(.4,0,.2,1) 50ms;
      transition: transform .2s cubic-bezier(.4,0,.2,1) 50ms,-webkit-transform .2s cubic-bezier(.4,0,.2,1) 50ms;
      width: 100%;
      overflow: auto;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: start;
      justify-content: flex-start
  }
  
  @supports (-webkit-overflow-scrolling:touch) {
      .demo-content {
          overflow: scroll;
          -webkit-overflow-scrolling: touch
      }
  }
  
  .demo-content-transition {
      width: 100%;
      max-width: 1200px
  }
  
  .loadComponent-enter {
      opacity: 0;
      -webkit-transform: translateY(15px);
      -ms-transform: translateY(15px);
      transform: translateY(15px)
  }
  
  .loadComponent-enter.loadComponent-enter-active {
      opacity: 1;
      -webkit-transform: translateY(0);
      -ms-transform: translateY(0);
      transform: translateY(0);
      -webkit-transition: all 235ms linear .1s;
      -o-transition: all 235ms linear .1s;
      transition: all 235ms linear .1s
  }
  
  .loadComponent-enter.loadComponent-enter-active .mdc-snackbar,.loadComponent-exit,.loadComponent-exit-active,.loadComponent-exit-done {
      display: none
  }
  
  .catalog-hero-tab-bar {
      width: 100%;
      background-color: #fff
  }
  
  .hero-component {
      -ms-flex-flow: row nowrap;
      flex-flow: row nowrap;
      -ms-flex-align: center;
      -ms-flex-pack: center;
      max-width: 860px;
      -ms-flex-direction: column;
      flex-direction: column
  }
  
  .hero-component,.tab-container,.tab-content {
      align-items: center;
      justify-content: center;
      width: 100%;
      display: -ms-flexbox;
      display: flex
  }
  
  .tab-container,.tab-content {
      height: 0;
      min-height: 100%;
      max-width: 100%;
      padding: 24px 0;
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      -ms-flex-flow: row nowrap;
      flex-flow: row nowrap;
      -ms-flex-align: center;
      -ms-flex-pack: center;
      background-color: #f7f7f7
  }
  
  .tab-container {
      min-height: 360px;
      position: relative
  }
  
  .highlight-html {
      width: 100%;
      max-height: 100%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .hero-tab .mdc-tab-indicator .mdc-tab-indicator__content--underline {
      border-color: #000
  }
  
  .hero-tab.mdc-tab--active .mdc-tab__text-label {
      color: #000
  }
  
  .hero-tab .mdc-tab__ripple:after,.hero-tab .mdc-tab__ripple:before {
      background-color: #000
  }
  
  .hero-tab .mdc-tab__ripple:hover:before {
      opacity: .04
  }
  
  .hero-tab .mdc-tab__ripple.mdc-ripple-upgraded--background-focused:before,.hero-tab .mdc-tab__ripple:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .hero-tab .mdc-tab__ripple:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .hero-tab .mdc-tab__ripple:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .hero-tab .mdc-tab__ripple.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .hero-options {
      border-radius: 4px;
      max-height: 312px;
      width: 100%
  }
  
  .hero-options .catalog-tf-list-item {
      min-height: 65px;
      overflow: visible;
      padding-bottom: 24px
  }
  
  .hero-options .mdc-chip-set {
      padding: 16px 0
  }
  
  .hero-options .mdc-chip-set .mdc-chip {
      margin: 0 4px 0 0
  }
  
  .copy-all-button.copy-all-button {
      position: absolute;
      right: 16px;
      bottom: 16px
  }
  
  .hero-component__filter-chip-set-option .mdc-chip {
      border-radius: 4px;
      background-color: #fff;
      padding-right: 11px;
      padding-left: 11px;
      border: 1px solid rgba(25,25,25,.32)
  }
  
  .hero-component__filter-chip-set-option .mdc-chip .mdc-chip__ripple {
      border-radius: 4px;
      top: -1px;
      left: -1px;
      border: 1px solid transparent
  }
  
  .hero-component__filter-chip-set-option .mdc-chip.mdc-chip--selected {
      background-color: #f7f7f7
  }
  
  .mdc-typography--overline {
      padding: 0 0 16px
  }
  
  .react-syntax-highlighter-line-number {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none
  }
  
  .mdc-card {
      border-radius: 4px;
      background-color: #fff;
      background-color: var(--mdc-theme-surface,#fff);
      -webkit-box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12);
      box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12);
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .mdc-card--outlined {
      -webkit-box-shadow: 0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);
      box-shadow: 0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);
      border: 1px solid #e0e0e0
  }
  
  .mdc-card__media {
      position: relative;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: cover
  }
  
  .mdc-card__media:before {
      display: block;
      content: ""
  }
  
  .mdc-card__media:first-child {
      border-top-left-radius: inherit;
      border-top-right-radius: inherit
  }
  
  .mdc-card__media:last-child {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit
  }
  
  .mdc-card__media--square:before {
      margin-top: 100%
  }
  
  .mdc-card__media--16-9:before {
      margin-top: 56.25%
  }
  
  .mdc-card__media-content {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0
  }
  
  .mdc-card__media-content,.mdc-card__primary-action {
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .mdc-card__primary-action {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      position: relative;
      outline: none;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      overflow: hidden
  }
  
  .mdc-card__primary-action:first-child {
      border-top-left-radius: inherit;
      border-top-right-radius: inherit
  }
  
  .mdc-card__primary-action:last-child {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit
  }
  
  .mdc-card__actions {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: row;
      flex-direction: row;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      min-height: 52px;
      padding: 8px
  }
  
  .mdc-card__actions--full-bleed {
      padding: 0
  }
  
  .mdc-card__action-buttons,.mdc-card__action-icons {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: row;
      flex-direction: row;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .mdc-card__action-icons {
      color: rgba(0,0,0,.6);
      -ms-flex-positive: 1;
      flex-grow: 1;
      -ms-flex-pack: end;
      justify-content: flex-end
  }
  
  .mdc-card__action-buttons+.mdc-card__action-icons {
      margin-left: 16px;
      margin-right: 0
  }
  
  .mdc-card__action-buttons+.mdc-card__action-icons[dir=rtl],[dir=rtl] .mdc-card__action-buttons+.mdc-card__action-icons {
      margin-left: 0;
      margin-right: 16px
  }
  
  .mdc-card__action {
      display: -ms-inline-flexbox;
      display: inline-flex;
      -ms-flex-direction: row;
      flex-direction: row;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -ms-flex-pack: center;
      justify-content: center;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none
  }
  
  .mdc-card__action:focus {
      outline: none
  }
  
  .mdc-card__action--button {
      margin-left: 0;
      margin-right: 8px;
      padding: 0 8px
  }
  
  .mdc-card__action--button[dir=rtl],[dir=rtl] .mdc-card__action--button {
      margin-left: 8px;
      margin-right: 0
  }
  
  .mdc-card__action--button:last-child,.mdc-card__action--button:last-child[dir=rtl],[dir=rtl] .mdc-card__action--button:last-child {
      margin-left: 0;
      margin-right: 0
  }
  
  .mdc-card__actions--full-bleed .mdc-card__action--button {
      -ms-flex-pack: justify;
      justify-content: space-between;
      width: 100%;
      height: auto;
      max-height: none;
      margin: 0;
      padding: 8px 16px;
      text-align: left
  }
  
  .mdc-card__actions--full-bleed .mdc-card__action--button[dir=rtl],[dir=rtl] .mdc-card__actions--full-bleed .mdc-card__action--button {
      text-align: right
  }
  
  .mdc-card__action--icon {
      margin: -6px 0;
      padding: 12px
  }
  
  .mdc-card__action--icon:not(:disabled) {
      color: rgba(0,0,0,.6)
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-card__primary-action {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-card__primary-action:after,.mdc-card__primary-action:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-card__primary-action:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-card__primary-action.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-card__primary-action.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-card__primary-action.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-card__primary-action.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-card__primary-action.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-card__primary-action:after,.mdc-card__primary-action:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .mdc-card__primary-action.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-card__primary-action:after,.mdc-card__primary-action:before {
      background-color: #000
  }
  
  .mdc-card__primary-action:hover:before {
      opacity: .04
  }
  
  .mdc-card__primary-action.mdc-ripple-upgraded--background-focused:before,.mdc-card__primary-action:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-card__primary-action:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-card__primary-action:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-card__primary-action.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-ripple-surface {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      position: relative;
      outline: none;
      overflow: hidden
  }
  
  .mdc-ripple-surface:after,.mdc-ripple-surface:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-ripple-surface:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-ripple-surface:after,.mdc-ripple-surface:before {
      background-color: #000
  }
  
  .mdc-ripple-surface:hover:before {
      opacity: .04
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded--background-focused:before,.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-ripple-surface:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-ripple-surface:after,.mdc-ripple-surface:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-ripple-surface[data-mdc-ripple-is-unbounded] {
      overflow: visible
  }
  
  .mdc-ripple-surface[data-mdc-ripple-is-unbounded]:after,.mdc-ripple-surface[data-mdc-ripple-is-unbounded]:before {
      top: 0%;
      left: 0%;
      width: 100%;
      height: 100%
  }
  
  .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded:after,.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded:before {
      top: var(--mdc-ripple-top,0%);
      left: var(--mdc-ripple-left,0%);
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-ripple-surface--primary:after,.mdc-ripple-surface--primary:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-ripple-surface--primary:after,.mdc-ripple-surface--primary:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .mdc-ripple-surface--primary:hover:before {
      opacity: .04
  }
  
  .mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused:before,.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface--primary.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-ripple-surface--accent:after,.mdc-ripple-surface--accent:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-ripple-surface--accent:after,.mdc-ripple-surface--accent:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-ripple-surface--accent:hover:before {
      opacity: .04
  }
  
  .mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused:before,.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface--accent.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .demo-card {
      width: 350px;
      margin: 48px 0
  }
  
  .demo-card__primary {
      padding: 1rem
  }
  
  .demo-card__title {
      margin: 0
  }
  
  .demo-card__subtitle {
      margin: 0
  }
  
  .demo-card__secondary,.demo-card__subtitle {
      color: rgba(0,0,0,.54);
      color: var(--mdc-theme-text-secondary-on-background,rgba(0,0,0,.54))
  }
  
  .demo-card__secondary {
      padding: 0 1rem 8px
  }
  
  .demo-card-shaped {
      border-radius: 24px 8px
  }
  
  .demo-card-shaped[dir=rtl],[dir=rtl] .demo-card-shaped {
      border-radius: 8px 24px
  }
  
  .demo-card__media.mdc-card__media--square {
      /* width: 110px; */
  }
  
  .demo-basic-with-header .demo-card__secondary,.demo-basic-with-text-over-media .demo-card__secondary {
      padding-top: 1rem
  }
  
  .demo-basic-with-text-over-media .demo-card__media-content {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: end;
      align-items: flex-end
  }
  
  .demo-basic-with-text-over-media .demo-card__media-content .demo-card__subtitle,.demo-basic-with-text-over-media .demo-card__media-content .demo-card__title {
      color: #fff
  }
  
  .demo-ui-control .demo-card__primary-action {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: row;
      flex-direction: row
  }
  
  .mdc-floating-label {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1rem;
      line-height: 1.75rem;
      font-weight: 400;
      letter-spacing: .009375em;
      text-decoration: inherit;
      text-transform: inherit;
      position: absolute;
      left: 0;
      -webkit-transform-origin: left top;
      -ms-transform-origin: left top;
      transform-origin: left top;
      -webkit-transition: color .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);
      transition: color .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);
      -o-transition: transform .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1);
      transition: transform .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1);
      transition: transform .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);
      line-height: 1.15rem;
      text-align: left;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: text;
      overflow: hidden;
      will-change: transform
  }
  
  .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-floating-label {
      right: 0;
      left: auto;
      -webkit-transform-origin: right top;
      -ms-transform-origin: right top;
      transform-origin: right top;
      text-align: right
  }
  
  .mdc-floating-label--float-above {
      cursor: auto;
      -webkit-transform: translateY(-106%) scale(.75);
      -ms-transform: translateY(-106%) scale(.75);
      transform: translateY(-106%) scale(.75)
  }
  
  .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-standard .25s 1;
      animation: mdc-floating-label-shake-float-above-standard .25s 1
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-standard {
      0% {
          -webkit-transform: translateX(0%) translateY(-106%) scale(.75);
          transform: translateX(0%) translateY(-106%) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-106%) scale(.75);
          transform: translateX(4%) translateY(-106%) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-106%) scale(.75);
          transform: translateX(-4%) translateY(-106%) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-106%) scale(.75);
          transform: translateX(0%) translateY(-106%) scale(.75)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-standard {
      0% {
          -webkit-transform: translateX(0%) translateY(-106%) scale(.75);
          transform: translateX(0%) translateY(-106%) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-106%) scale(.75);
          transform: translateX(4%) translateY(-106%) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-106%) scale(.75);
          transform: translateX(-4%) translateY(-106%) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-106%) scale(.75);
          transform: translateX(0%) translateY(-106%) scale(.75)
      }
  }
  
  .mdc-line-ripple {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      -webkit-transform: scaleX(0);
      -ms-transform: scaleX(0);
      transform: scaleX(0);
      -webkit-transition: opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);
      transition: opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);
      -o-transition: transform .18s cubic-bezier(.4,0,.2,1),opacity .18s cubic-bezier(.4,0,.2,1);
      transition: transform .18s cubic-bezier(.4,0,.2,1),opacity .18s cubic-bezier(.4,0,.2,1);
      transition: transform .18s cubic-bezier(.4,0,.2,1),opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);
      opacity: 0;
      z-index: 2
  }
  
  .mdc-line-ripple--active {
      -webkit-transform: scaleX(1);
      -ms-transform: scaleX(1);
      transform: scaleX(1);
      opacity: 1
  }
  
  .mdc-line-ripple--deactivating {
      opacity: 0
  }
  
  .mdc-notched-outline {
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      right: 0;
      left: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      height: 100%;
      text-align: left;
      pointer-events: none
  }
  
  .mdc-notched-outline[dir=rtl],[dir=rtl] .mdc-notched-outline {
      text-align: right
  }
  
  .mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: 100%;
      border-top: 1px solid;
      border-bottom: 1px solid;
      pointer-events: none
  }
  
  .mdc-notched-outline__leading {
      border-left: 1px solid;
      border-right: none;
      width: 12px
  }
  
  .mdc-notched-outline__leading[dir=rtl],.mdc-notched-outline__trailing,[dir=rtl] .mdc-notched-outline__leading {
      border-left: none;
      border-right: 1px solid
  }
  
  .mdc-notched-outline__trailing {
      -ms-flex-positive: 1;
      flex-grow: 1
  }
  
  .mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-notched-outline__trailing {
      border-left: 1px solid;
      border-right: none
  }
  
  .mdc-notched-outline__notch {
      -ms-flex: 0 0 auto;
      flex: 0 0 auto;
      width: auto;
      max-width: calc(100% - 12px * 2)
  }
  
  .mdc-notched-outline .mdc-floating-label {
      display: inline-block;
      position: relative;
      max-width: 100%
  }
  
  .mdc-notched-outline .mdc-floating-label--float-above {
      -o-text-overflow: clip;
      text-overflow: clip
  }
  
  .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      max-width: 133.33333%
  }
  
  .mdc-notched-outline--notched .mdc-notched-outline__notch {
      padding-left: 0;
      padding-right: 8px;
      border-top: none
  }
  
  .mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl],[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {
      padding-left: 8px;
      padding-right: 0
  }
  
  .mdc-notched-outline--no-label .mdc-notched-outline__notch {
      padding: 0
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-text-field-helper-text {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .75rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0333333333em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin: 0;
      -webkit-transition: opacity .15s cubic-bezier(.4,0,.2,1);
      -o-transition: opacity .15s cubic-bezier(.4,0,.2,1);
      transition: opacity .15s cubic-bezier(.4,0,.2,1);
      opacity: 0;
      will-change: opacity
  }
  
  .mdc-text-field-helper-text:before {
      display: inline-block;
      width: 0;
      height: 16px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-text-field-helper-text--persistent {
      -webkit-transition: none;
      -o-transition: none;
      transition: none;
      opacity: 1;
      will-change: auto
  }
  
  .mdc-text-field-character-counter {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .75rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0333333333em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin-left: auto;
      margin-right: 0;
      padding-left: 16px;
      padding-right: 0;
      white-space: nowrap
  }
  
  .mdc-text-field-character-counter:before {
      display: inline-block;
      width: 0;
      height: 16px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-text-field-character-counter[dir=rtl],[dir=rtl] .mdc-text-field-character-counter {
      margin-left: 0;
      margin-right: auto;
      padding-left: 0;
      padding-right: 16px
  }
  
  .mdc-text-field--with-leading-icon .mdc-text-field__icon,.mdc-text-field--with-trailing-icon .mdc-text-field__icon {
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      cursor: pointer
  }
  
  .mdc-text-field__icon:not([tabindex]),.mdc-text-field__icon[tabindex="-1"] {
      cursor: default;
      pointer-events: none
  }
  
  .mdc-text-field {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      height: 56px;
      border-radius: 4px 4px 0 0;
      display: -ms-inline-flexbox;
      display: inline-flex;
      position: relative;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      overflow: hidden;
      will-change: opacity,transform,color
  }
  
  .mdc-text-field:after,.mdc-text-field:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-text-field:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-text-field.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-text-field.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-text-field.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-text-field.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-text-field.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-text-field:after,.mdc-text-field:before {
      background-color: rgba(0,0,0,.87)
  }
  
  .mdc-text-field:hover:before {
      opacity: .04
  }
  
  .mdc-text-field.mdc-ripple-upgraded--background-focused:before,.mdc-text-field:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-text-field:after,.mdc-text-field:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .mdc-text-field.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {
      color: rgba(0,0,0,.6)
  }
  
  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-text-field .mdc-text-field__input {
      caret-color: #6200ee;
      caret-color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input {
      border-bottom-color: rgba(0,0,0,.42)
  }
  
  .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input:hover {
      border-bottom-color: rgba(0,0,0,.87)
  }
  
  .mdc-text-field .mdc-line-ripple {
      background-color: #6200ee;
      background-color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-text-field:not(.mdc-text-field--disabled):not(.mdc-text-field--textarea) {
      border-bottom-color: rgba(0,0,0,.12)
  }
  
  .mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-character-counter,.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-helper-text,.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field-character-counter {
      color: rgba(0,0,0,.6)
  }
  
  .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon {
      color: rgba(0,0,0,.54)
  }
  
  .mdc-text-field:not(.mdc-text-field--disabled) {
      background-color: #f5f5f5
  }
  
  .mdc-text-field .mdc-floating-label {
      left: 16px;
      right: auto;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      pointer-events: none
  }
  
  .mdc-text-field .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field .mdc-floating-label {
      left: auto;
      right: 16px
  }
  
  .mdc-text-field .mdc-floating-label--float-above {
      -webkit-transform: translateY(-106%) scale(.75);
      -ms-transform: translateY(-106%) scale(.75);
      transform: translateY(-106%) scale(.75)
  }
  
  .mdc-text-field--textarea .mdc-floating-label {
      left: 4px;
      right: auto
  }
  
  .mdc-text-field--textarea .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--textarea .mdc-floating-label {
      left: auto;
      right: 4px
  }
  
  .mdc-text-field--outlined .mdc-floating-label {
      left: 4px;
      right: auto
  }
  
  .mdc-text-field--outlined .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {
      left: auto;
      right: 4px
  }
  
  .mdc-text-field--outlined--with-leading-icon .mdc-floating-label {
      left: 36px;
      right: auto
  }
  
  .mdc-text-field--outlined--with-leading-icon .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--outlined--with-leading-icon .mdc-floating-label {
      left: auto;
      right: 36px
  }
  
  .mdc-text-field--outlined--with-leading-icon .mdc-floating-label--float-above {
      left: 40px;
      right: auto
  }
  
  .mdc-text-field--outlined--with-leading-icon .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-text-field--outlined--with-leading-icon .mdc-floating-label--float-above {
      left: auto;
      right: 40px
  }
  
  .mdc-text-field__input {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1rem;
      font-weight: 400;
      letter-spacing: .009375em;
      text-decoration: inherit;
      text-transform: inherit;
      -ms-flex-item-align: end;
      align-self: flex-end;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 20px 16px 6px;
      -webkit-transition: opacity .15s cubic-bezier(.4,0,.2,1);
      -o-transition: opacity .15s cubic-bezier(.4,0,.2,1);
      transition: opacity .15s cubic-bezier(.4,0,.2,1);
      border: none;
      border-bottom: 1px solid;
      border-radius: 0;
      background: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none
  }
  
  .mdc-text-field__input::-webkit-input-placeholder {
      -webkit-transition: opacity 67ms cubic-bezier(.4,0,.2,1);
      -o-transition: opacity 67ms cubic-bezier(.4,0,.2,1);
      transition: opacity 67ms cubic-bezier(.4,0,.2,1);
      opacity: 0;
      color: rgba(0,0,0,.54)
  }
  
  .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field__input::-ms-input-placeholder {
      -webkit-transition: opacity 67ms cubic-bezier(.4,0,.2,1);
      -o-transition: opacity 67ms cubic-bezier(.4,0,.2,1);
      transition: opacity 67ms cubic-bezier(.4,0,.2,1);
      opacity: 0;
      color: rgba(0,0,0,.54)
  }
  
  .mdc-text-field__input::placeholder {
      -webkit-transition: opacity 67ms cubic-bezier(.4,0,.2,1);
      -o-transition: opacity 67ms cubic-bezier(.4,0,.2,1);
      transition: opacity 67ms cubic-bezier(.4,0,.2,1);
      opacity: 0;
      color: rgba(0,0,0,.54)
  }
  
  .mdc-text-field__input:-ms-input-placeholder {
      color: rgba(0,0,0,.54)!important
  }
  
  .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder,.mdc-text-field--fullwidth .mdc-text-field__input::-webkit-input-placeholder,.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder {
      -webkit-transition-delay: 40ms;
      transition-delay: 40ms;
      -webkit-transition-duration: .11s;
      transition-duration: .11s;
      opacity: 1
  }
  
  .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input::-ms-input-placeholder,.mdc-text-field--fullwidth .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--fullwidth .mdc-text-field__input::-ms-input-placeholder,.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--no-label .mdc-text-field__input::-ms-input-placeholder {
      transition-delay: 40ms;
      transition-duration: .11s;
      opacity: 1
  }
  
  .mdc-text-field--focused .mdc-text-field__input::placeholder,.mdc-text-field--fullwidth .mdc-text-field__input::placeholder,.mdc-text-field--no-label .mdc-text-field__input::placeholder {
      -webkit-transition-delay: 40ms;
      -o-transition-delay: 40ms;
      transition-delay: 40ms;
      -webkit-transition-duration: .11s;
      -o-transition-duration: .11s;
      transition-duration: .11s;
      opacity: 1
  }
  
  .mdc-text-field__input:focus {
      outline: none
  }
  
  .mdc-text-field__input:invalid {
      -webkit-box-shadow: none;
      box-shadow: none
  }
  
  .mdc-text-field__input:-webkit-autofill {
      z-index: auto!important
  }
  
  .mdc-text-field--no-label:not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input {
      padding-top: 16px;
      padding-bottom: 16px
  }
  
  .mdc-text-field__input:-webkit-autofill+.mdc-floating-label {
      -webkit-transform: translateY(-50%) scale(.75);
      transform: translateY(-50%) scale(.75);
      cursor: auto
  }
  
  .mdc-text-field--outlined {
      border: none;
      overflow: visible
  }
  
  .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: rgba(0,0,0,.38)
  }
  
  .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__trailing,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__trailing {
      border-color: rgba(0,0,0,.87)
  }
  
  .mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: #6200ee;
      border-color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-text-field--outlined .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined .25s 1;
      animation: mdc-floating-label-shake-float-above-text-field-outlined .25s 1
  }
  
  .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 4px 0 0 4px
  }
  
  .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl],.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing,[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 0 4px 4px 0
  }
  
  .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing {
      border-radius: 4px 0 0 4px
  }
  
  .mdc-text-field--outlined .mdc-floating-label--float-above {
      -webkit-transform: translateY(-37.25px) scale(1);
      -ms-transform: translateY(-37.25px) scale(1);
      transform: translateY(-37.25px) scale(1);
      font-size: .75rem
  }
  
  .mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      -webkit-transform: translateY(-34.75px) scale(.75);
      -ms-transform: translateY(-34.75px) scale(.75);
      transform: translateY(-34.75px) scale(.75);
      font-size: 1rem
  }
  
  .mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
      padding-top: 1px
  }
  
  .mdc-text-field--outlined:after,.mdc-text-field--outlined:before {
      content: none
  }
  
  .mdc-text-field--outlined:not(.mdc-text-field--disabled) {
      background-color: transparent
  }
  
  .mdc-text-field--outlined .mdc-text-field__input {
      display: -ms-flexbox;
      display: flex;
      padding: 12px 16px 14px;
      border: none!important;
      background-color: transparent;
      z-index: 1
  }
  
  .mdc-text-field--outlined .mdc-text-field__icon {
      z-index: 2
  }
  
  .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline--notched .mdc-notched-outline__notch {
      padding-top: 2px
  }
  
  .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__trailing {
      border-width: 2px
  }
  
  .mdc-text-field--outlined.mdc-text-field--disabled {
      background-color: transparent
  }
  
  .mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--outlined.mdc-text-field--disabled .mdc-notched-outline__trailing {
      border-color: rgba(0,0,0,.06)
  }
  
  .mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {
      border-bottom: none
  }
  
  .mdc-text-field--outlined.mdc-text-field--dense {
      height: 48px
  }
  
  .mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above {
      -webkit-transform: translateY(-134%) scale(1);
      -ms-transform: translateY(-134%) scale(1);
      transform: translateY(-134%) scale(1);
      font-size: .8rem
  }
  
  .mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      -webkit-transform: translateY(-120%) scale(.8);
      -ms-transform: translateY(-120%) scale(.8);
      transform: translateY(-120%) scale(.8);
      font-size: 1rem
  }
  
  .mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-dense .25s 1;
      animation: mdc-floating-label-shake-float-above-text-field-outlined-dense .25s 1
  }
  
  .mdc-text-field--outlined.mdc-text-field--dense .mdc-text-field__input {
      padding: 12px 12px 7px
  }
  
  .mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label {
      top: 14px
  }
  
  .mdc-text-field--outlined.mdc-text-field--dense .mdc-text-field__icon {
      top: 12px
  }
  
  .mdc-text-field--with-leading-icon .mdc-text-field__icon {
      left: 16px;
      right: auto
  }
  
  .mdc-text-field--with-leading-icon .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon .mdc-text-field__icon {
      left: auto;
      right: 16px
  }
  
  .mdc-text-field--with-leading-icon .mdc-text-field__input {
      padding-left: 48px;
      padding-right: 16px
  }
  
  .mdc-text-field--with-leading-icon .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon .mdc-text-field__input {
      padding-left: 16px;
      padding-right: 48px
  }
  
  .mdc-text-field--with-leading-icon .mdc-floating-label {
      left: 48px;
      right: auto
  }
  
  .mdc-text-field--with-leading-icon .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon .mdc-floating-label {
      left: auto;
      right: 48px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon {
      left: 16px;
      right: auto
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon {
      left: auto;
      right: 16px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__input {
      padding-left: 48px;
      padding-right: 16px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__input {
      padding-left: 16px;
      padding-right: 48px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above {
      -webkit-transform: translateY(-37.25px) translateX(-32px) scale(1);
      -ms-transform: translateY(-37.25px) translateX(-32px) scale(1);
      transform: translateY(-37.25px) translateX(-32px) scale(1)
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above {
      -webkit-transform: translateY(-37.25px) translateX(32px) scale(1);
      -ms-transform: translateY(-37.25px) translateX(32px) scale(1);
      transform: translateY(-37.25px) translateX(32px) scale(1)
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above {
      font-size: .75rem
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      -webkit-transform: translateY(-34.75px) translateX(-32px) scale(.75);
      -ms-transform: translateY(-34.75px) translateX(-32px) scale(.75);
      transform: translateY(-34.75px) translateX(-32px) scale(.75)
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      -webkit-transform: translateY(-34.75px) translateX(32px) scale(.75);
      -ms-transform: translateY(-34.75px) translateX(32px) scale(.75);
      transform: translateY(-34.75px) translateX(32px) scale(.75)
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      font-size: 1rem
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon .25s 1;
      animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon .25s 1
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=rtl] .mdc-floating-label--shake,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl .25s 1;
      animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl .25s 1
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label {
      left: 36px;
      right: auto
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label {
      left: auto;
      right: 36px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above {
      -webkit-transform: translateY(-134%) translateX(-21px) scale(1);
      -ms-transform: translateY(-134%) translateX(-21px) scale(1);
      transform: translateY(-134%) translateX(-21px) scale(1)
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above {
      -webkit-transform: translateY(-134%) translateX(21px) scale(1);
      -ms-transform: translateY(-134%) translateX(21px) scale(1);
      transform: translateY(-134%) translateX(21px) scale(1)
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--float-above {
      font-size: .8rem
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      -webkit-transform: translateY(-120%) translateX(-21px) scale(.8);
      -ms-transform: translateY(-120%) translateX(-21px) scale(.8);
      transform: translateY(-120%) translateX(-21px) scale(.8)
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      -webkit-transform: translateY(-120%) translateX(21px) scale(.8);
      -ms-transform: translateY(-120%) translateX(21px) scale(.8);
      transform: translateY(-120%) translateX(21px) scale(.8)
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      font-size: 1rem
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense .25s 1;
      animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense .25s 1
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense[dir=rtl] .mdc-floating-label--shake,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl .25s 1;
      animation: mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl .25s 1
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label {
      left: 32px;
      right: auto
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-text-field--dense .mdc-floating-label {
      left: auto;
      right: 32px
  }
  
  .mdc-text-field--with-trailing-icon .mdc-text-field__icon {
      left: auto;
      right: 12px
  }
  
  .mdc-text-field--with-trailing-icon .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon .mdc-text-field__icon {
      left: 12px;
      right: auto
  }
  
  .mdc-text-field--with-trailing-icon .mdc-text-field__input {
      padding-left: 16px;
      padding-right: 48px
  }
  
  .mdc-text-field--with-trailing-icon .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon .mdc-text-field__input {
      padding-left: 48px;
      padding-right: 16px
  }
  
  .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon {
      left: auto;
      right: 16px
  }
  
  .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon {
      left: 16px;
      right: auto
  }
  
  .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input {
      padding-left: 16px;
      padding-right: 48px
  }
  
  .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input {
      padding-left: 48px;
      padding-right: 16px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon {
      left: 16px;
      right: auto
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon {
      left: auto;
      right: 16px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon~.mdc-text-field__icon {
      right: 12px;
      left: auto
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon~.mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__icon~.mdc-text-field__icon {
      right: auto;
      left: 12px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__input,.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon .mdc-text-field__input {
      padding-left: 48px;
      padding-right: 48px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon,.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {
      bottom: 16px;
      -webkit-transform: scale(.8);
      -ms-transform: scale(.8);
      transform: scale(.8)
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon {
      left: 12px;
      right: auto
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon {
      left: auto;
      right: 12px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input {
      padding-left: 44px;
      padding-right: 16px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__input {
      padding-left: 16px;
      padding-right: 44px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label {
      left: 44px;
      right: auto
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-floating-label {
      left: auto;
      right: 44px
  }
  
  .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {
      left: auto;
      right: 12px
  }
  
  .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {
      left: 12px;
      right: auto
  }
  
  .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input {
      padding-left: 16px;
      padding-right: 44px
  }
  
  .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input {
      padding-left: 44px;
      padding-right: 16px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {
      left: 12px;
      right: auto
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon[dir=rtl],.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon~.mdc-text-field__icon,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {
      left: auto;
      right: 12px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon~.mdc-text-field__icon[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon~.mdc-text-field__icon {
      right: auto;
      left: 12px
  }
  
  .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input,.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input[dir=rtl],[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__input {
      padding-left: 44px;
      padding-right: 44px
  }
  
  .mdc-text-field--dense .mdc-floating-label--float-above {
      -webkit-transform: translateY(-70%) scale(.8);
      -ms-transform: translateY(-70%) scale(.8);
      transform: translateY(-70%) scale(.8)
  }
  
  .mdc-text-field--dense .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-text-field-dense .25s 1;
      animation: mdc-floating-label-shake-float-above-text-field-dense .25s 1
  }
  
  .mdc-text-field--dense .mdc-text-field__input {
      padding: 12px 12px 0
  }
  
  .mdc-text-field--dense .mdc-floating-label,.mdc-text-field--dense .mdc-floating-label--float-above {
      font-size: .813rem
  }
  
  .mdc-text-field__input:required~.mdc-floating-label:after,.mdc-text-field__input:required~.mdc-notched-outline .mdc-floating-label:after {
      margin-left: 1px;
      content: "*"
  }
  
  .mdc-text-field--textarea {
      display: -ms-inline-flexbox;
      display: inline-flex;
      width: auto;
      height: auto;
      -webkit-transition: none;
      -o-transition: none;
      transition: none;
      overflow: visible
  }
  
  .mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--textarea:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: rgba(0,0,0,.38)
  }
  
  .mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__trailing,.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--textarea:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__trailing {
      border-color: rgba(0,0,0,.87)
  }
  
  .mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--textarea:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: #6200ee;
      border-color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-text-field--textarea .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-textarea .25s 1;
      animation: mdc-floating-label-shake-float-above-textarea .25s 1
  }
  
  .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 4px 0 0 4px
  }
  
  .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl],.mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing,[dir=rtl] .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 0 4px 4px 0
  }
  
  .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-text-field--textarea .mdc-notched-outline .mdc-notched-outline__trailing {
      border-radius: 4px 0 0 4px
  }
  
  .mdc-text-field--textarea:after,.mdc-text-field--textarea:before {
      content: none
  }
  
  .mdc-text-field--textarea:not(.mdc-text-field--disabled) {
      background-color: transparent
  }
  
  .mdc-text-field--textarea .mdc-floating-label--float-above {
      -webkit-transform: translateY(-144%) scale(1);
      -ms-transform: translateY(-144%) scale(1);
      transform: translateY(-144%) scale(1);
      font-size: .75rem
  }
  
  .mdc-text-field--textarea.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      -webkit-transform: translateY(-130%) scale(.75);
      -ms-transform: translateY(-130%) scale(.75);
      transform: translateY(-130%) scale(.75);
      font-size: 1rem
  }
  
  .mdc-text-field--textarea .mdc-text-field-character-counter {
      left: auto;
      right: 16px;
      position: absolute;
      bottom: 13px
  }
  
  .mdc-text-field--textarea .mdc-text-field-character-counter[dir=rtl],[dir=rtl] .mdc-text-field--textarea .mdc-text-field-character-counter {
      left: 16px;
      right: auto
  }
  
  .mdc-text-field--textarea .mdc-text-field__input {
      -ms-flex-item-align: auto;
      align-self: auto;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: auto;
      margin: 8px 1px 1px 0;
      padding: 0 16px 16px;
      border: none;
      line-height: 1.75rem
  }
  
  .mdc-text-field--textarea .mdc-text-field-character-counter+.mdc-text-field__input {
      margin-bottom: 28px;
      padding-bottom: 0
  }
  
  .mdc-text-field--textarea .mdc-floating-label {
      top: 17px;
      width: auto;
      pointer-events: none
  }
  
  .mdc-text-field--textarea .mdc-floating-label:not(.mdc-floating-label--float-above) {
      -webkit-transform: none;
      -ms-transform: none;
      transform: none
  }
  
  .mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--textarea.mdc-text-field--focused .mdc-notched-outline__trailing {
      border-width: 2px
  }
  
  .mdc-text-field--fullwidth {
      width: 100%
  }
  
  .mdc-text-field--fullwidth:not(.mdc-text-field--textarea) {
      display: block
  }
  
  .mdc-text-field--fullwidth:not(.mdc-text-field--textarea):after,.mdc-text-field--fullwidth:not(.mdc-text-field--textarea):before {
      content: none
  }
  
  .mdc-text-field--fullwidth:not(.mdc-text-field--textarea):not(.mdc-text-field--disabled) {
      background-color: transparent
  }
  
  .mdc-text-field--fullwidth:not(.mdc-text-field--textarea) .mdc-text-field__input {
      padding: 0
  }
  
  .mdc-text-field--fullwidth.mdc-text-field--textarea .mdc-text-field__input {
      resize: vertical
  }
  
  .mdc-text-field--fullwidth.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--textarea) {
      border-bottom-color: #b00020;
      border-bottom-color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-text-field-helper-line {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .mdc-text-field--dense+.mdc-text-field-helper-line {
      margin-bottom: 4px
  }
  
  .mdc-text-field+.mdc-text-field-helper-line {
      padding-right: 16px;
      padding-left: 16px
  }
  
  .mdc-form-field>.mdc-text-field+label {
      -ms-flex-item-align: start;
      align-self: flex-start
  }
  
  .mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {
      color: rgba(98,0,238,.87)
  }
  
  .mdc-text-field--focused+.mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg) {
      opacity: 1
  }
  
  .mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--textarea.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: #6200ee;
      border-color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--outlined):not(.mdc-text-field--textarea) .mdc-text-field__input:hover {
      border-bottom-color: #b00020;
      border-bottom-color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple {
      background-color: #b00020;
      background-color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg {
      color: #b00020;
      color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-text-field--invalid .mdc-text-field__input {
      caret-color: #b00020;
      caret-color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-text-field--invalid.mdc-text-field--with-trailing-icon.mdc-text-field--with-leading-icon:not(.mdc-text-field--disabled) .mdc-text-field__icon~.mdc-text-field__icon,.mdc-text-field--invalid.mdc-text-field--with-trailing-icon:not(.mdc-text-field--with-leading-icon):not(.mdc-text-field--disabled) .mdc-text-field__icon {
      color: #b00020;
      color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg {
      opacity: 1
  }
  
  .mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__trailing,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__trailing,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__icon:hover~.mdc-notched-outline .mdc-notched-outline__trailing,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--textarea.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused) .mdc-text-field__input:hover~.mdc-notched-outline .mdc-notched-outline__trailing {
      border-color: #b00020;
      border-color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-text-field--disabled {
      background-color: #fafafa;
      border-bottom: none;
      pointer-events: none
  }
  
  .mdc-text-field--disabled .mdc-text-field__input {
      border-bottom-color: rgba(0,0,0,.06);
      color: rgba(0,0,0,.37)
  }
  
  .mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text,.mdc-text-field--disabled .mdc-floating-label,.mdc-text-field--disabled .mdc-text-field-character-counter {
      color: rgba(0,0,0,.37)
  }
  
  .mdc-text-field--disabled .mdc-text-field__icon {
      color: rgba(0,0,0,.3)
  }
  
  .mdc-text-field--disabled:not(.mdc-text-field--textarea) {
      border-bottom-color: rgba(0,0,0,.12)
  }
  
  .mdc-text-field--disabled .mdc-floating-label {
      cursor: default
  }
  
  .mdc-text-field--textarea.mdc-text-field--disabled {
      background-color: transparent;
      background-color: #f9f9f9
  }
  
  .mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--textarea.mdc-text-field--disabled .mdc-notched-outline__trailing {
      border-color: rgba(0,0,0,.06)
  }
  
  .mdc-text-field--textarea.mdc-text-field--disabled .mdc-text-field__input {
      border-bottom: none
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-text-field-dense {
      0% {
          -webkit-transform: translateX(0%) translateY(-70%) scale(.8);
          transform: translateX(0%) translateY(-70%) scale(.8)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-70%) scale(.8);
          transform: translateX(4%) translateY(-70%) scale(.8)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-70%) scale(.8);
          transform: translateX(-4%) translateY(-70%) scale(.8)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-70%) scale(.8);
          transform: translateX(0%) translateY(-70%) scale(.8)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-text-field-dense {
      0% {
          -webkit-transform: translateX(0%) translateY(-70%) scale(.8);
          transform: translateX(0%) translateY(-70%) scale(.8)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-70%) scale(.8);
          transform: translateX(4%) translateY(-70%) scale(.8)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-70%) scale(.8);
          transform: translateX(-4%) translateY(-70%) scale(.8)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-70%) scale(.8);
          transform: translateX(0%) translateY(-70%) scale(.8)
      }
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined {
      0% {
          -webkit-transform: translateX(0%) translateY(-34.75px) scale(.75);
          transform: translateX(0%) translateY(-34.75px) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-34.75px) scale(.75);
          transform: translateX(4%) translateY(-34.75px) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-34.75px) scale(.75);
          transform: translateX(-4%) translateY(-34.75px) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-34.75px) scale(.75);
          transform: translateX(0%) translateY(-34.75px) scale(.75)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-text-field-outlined {
      0% {
          -webkit-transform: translateX(0%) translateY(-34.75px) scale(.75);
          transform: translateX(0%) translateY(-34.75px) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-34.75px) scale(.75);
          transform: translateX(4%) translateY(-34.75px) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-34.75px) scale(.75);
          transform: translateX(-4%) translateY(-34.75px) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-34.75px) scale(.75);
          transform: translateX(0%) translateY(-34.75px) scale(.75)
      }
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-dense {
      0% {
          -webkit-transform: translateX(0%) translateY(-120%) scale(.8);
          transform: translateX(0%) translateY(-120%) scale(.8)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-120%) scale(.8);
          transform: translateX(4%) translateY(-120%) scale(.8)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-120%) scale(.8);
          transform: translateX(-4%) translateY(-120%) scale(.8)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-120%) scale(.8);
          transform: translateX(0%) translateY(-120%) scale(.8)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-text-field-outlined-dense {
      0% {
          -webkit-transform: translateX(0%) translateY(-120%) scale(.8);
          transform: translateX(0%) translateY(-120%) scale(.8)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-120%) scale(.8);
          transform: translateX(4%) translateY(-120%) scale(.8)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-120%) scale(.8);
          transform: translateX(-4%) translateY(-120%) scale(.8)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-120%) scale(.8);
          transform: translateX(0%) translateY(-120%) scale(.8)
      }
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon {
      0% {
          -webkit-transform: translateX(0) translateY(-34.75px) scale(.75);
          transform: translateX(0) translateY(-34.75px) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-34.75px) scale(.75);
          transform: translateX(4%) translateY(-34.75px) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-34.75px) scale(.75);
          transform: translateX(-4%) translateY(-34.75px) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0) translateY(-34.75px) scale(.75);
          transform: translateX(0) translateY(-34.75px) scale(.75)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon {
      0% {
          -webkit-transform: translateX(0) translateY(-34.75px) scale(.75);
          transform: translateX(0) translateY(-34.75px) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-34.75px) scale(.75);
          transform: translateX(4%) translateY(-34.75px) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-34.75px) scale(.75);
          transform: translateX(-4%) translateY(-34.75px) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0) translateY(-34.75px) scale(.75);
          transform: translateX(0) translateY(-34.75px) scale(.75)
      }
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense {
      0% {
          -webkit-transform: translateX(-21px) translateY(-120%) scale(.8);
          transform: translateX(-21px) translateY(-120%) scale(.8)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(calc(4% - 21px)) translateY(-120%) scale(.8);
          transform: translateX(calc(4% - 21px)) translateY(-120%) scale(.8)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(calc(-4% - 21px)) translateY(-120%) scale(.8);
          transform: translateX(calc(-4% - 21px)) translateY(-120%) scale(.8)
      }
  
      to {
          -webkit-transform: translateX(-21px) translateY(-120%) scale(.8);
          transform: translateX(-21px) translateY(-120%) scale(.8)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense {
      0% {
          -webkit-transform: translateX(-21px) translateY(-120%) scale(.8);
          transform: translateX(-21px) translateY(-120%) scale(.8)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(calc(4% - 21px)) translateY(-120%) scale(.8);
          transform: translateX(calc(4% - 21px)) translateY(-120%) scale(.8)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(calc(-4% - 21px)) translateY(-120%) scale(.8);
          transform: translateX(calc(-4% - 21px)) translateY(-120%) scale(.8)
      }
  
      to {
          -webkit-transform: translateX(-21px) translateY(-120%) scale(.8);
          transform: translateX(-21px) translateY(-120%) scale(.8)
      }
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl {
      0% {
          -webkit-transform: translateX(0) translateY(-34.75px) scale(.75);
          transform: translateX(0) translateY(-34.75px) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-34.75px) scale(.75);
          transform: translateX(4%) translateY(-34.75px) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-34.75px) scale(.75);
          transform: translateX(-4%) translateY(-34.75px) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0) translateY(-34.75px) scale(.75);
          transform: translateX(0) translateY(-34.75px) scale(.75)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl {
      0% {
          -webkit-transform: translateX(0) translateY(-34.75px) scale(.75);
          transform: translateX(0) translateY(-34.75px) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-34.75px) scale(.75);
          transform: translateX(4%) translateY(-34.75px) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-34.75px) scale(.75);
          transform: translateX(-4%) translateY(-34.75px) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0) translateY(-34.75px) scale(.75);
          transform: translateX(0) translateY(-34.75px) scale(.75)
      }
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl {
      0% {
          -webkit-transform: translateX(21px) translateY(-120%) scale(.8);
          transform: translateX(21px) translateY(-120%) scale(.8)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(calc(4% - -21px)) translateY(-120%) scale(.8);
          transform: translateX(calc(4% - -21px)) translateY(-120%) scale(.8)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(calc(-4% - -21px)) translateY(-120%) scale(.8);
          transform: translateX(calc(-4% - -21px)) translateY(-120%) scale(.8)
      }
  
      to {
          -webkit-transform: translateX(21px) translateY(-120%) scale(.8);
          transform: translateX(21px) translateY(-120%) scale(.8)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-dense-rtl {
      0% {
          -webkit-transform: translateX(21px) translateY(-120%) scale(.8);
          transform: translateX(21px) translateY(-120%) scale(.8)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(calc(4% - -21px)) translateY(-120%) scale(.8);
          transform: translateX(calc(4% - -21px)) translateY(-120%) scale(.8)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(calc(-4% - -21px)) translateY(-120%) scale(.8);
          transform: translateX(calc(-4% - -21px)) translateY(-120%) scale(.8)
      }
  
      to {
          -webkit-transform: translateX(21px) translateY(-120%) scale(.8);
          transform: translateX(21px) translateY(-120%) scale(.8)
      }
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-textarea {
      0% {
          -webkit-transform: translateX(0%) translateY(-130%) scale(.75);
          transform: translateX(0%) translateY(-130%) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-130%) scale(.75);
          transform: translateX(4%) translateY(-130%) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-130%) scale(.75);
          transform: translateX(-4%) translateY(-130%) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-130%) scale(.75);
          transform: translateX(0%) translateY(-130%) scale(.75)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-textarea {
      0% {
          -webkit-transform: translateX(0%) translateY(-130%) scale(.75);
          transform: translateX(0%) translateY(-130%) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-130%) scale(.75);
          transform: translateX(4%) translateY(-130%) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-130%) scale(.75);
          transform: translateX(-4%) translateY(-130%) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-130%) scale(.75);
          transform: translateX(0%) translateY(-130%) scale(.75)
      }
  }
  
  .text-field-row {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: start;
      align-items: flex-start;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap
  }
  
  .text-field-row .text-field {
      width: 100%
  }
  
  .text-field-row-fullwidth {
      display: block
  }
  
  .text-field-row-fullwidth .text-field-container {
      margin-bottom: 8px
  }
  
  .text-field-variant-container {
      display: -ms-flexbox;
      display: flex
  }
  
  .text-field-container {
      min-width: 240px
  }
  
  .demo-text-field-shaped {
      border-radius: 16px 16px 0 0
  }
  
  .demo-text-field-outlined-shaped .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 28px 0 0 28px;
      width: 28px
  }
  
  .demo-text-field-outlined-shaped .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl],[dir=rtl] .demo-text-field-outlined-shaped .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 0 28px 28px 0
  }
  
  .demo-text-field-outlined-shaped .mdc-notched-outline .mdc-notched-outline__notch {
      max-width: calc(100% - 28px * 2)
  }
  
  .demo-text-field-outlined-shaped .mdc-notched-outline .mdc-notched-outline__trailing {
      border-radius: 0 28px 28px 0
  }
  
  .demo-text-field-outlined-shaped .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .demo-text-field-outlined-shaped .mdc-notched-outline .mdc-notched-outline__trailing {
      border-radius: 28px 0 0 28px
  }
  
  .demo-text-field-outlined-shaped .mdc-text-field__input {
      padding-left: 32px;
      padding-right: 0
  }
  
  .demo-text-field-outlined-shaped .mdc-text-field__input[dir=rtl],[dir=rtl] .demo-text-field-outlined-shaped .mdc-text-field__input {
      padding-left: 0;
      padding-right: 32px
  }
  
  .demo-text-field-outlined-shaped+.mdc-text-field-helper-line {
      padding-left: 32px;
      padding-right: 28px
  }
  
  .demo-text-field-outlined-shaped+.mdc-text-field-helper-line[dir=rtl],[dir=rtl] .demo-text-field-outlined-shaped+.mdc-text-field-helper-line {
      padding-left: 28px;
      padding-right: 32px
  }
  
  .hero-text-field-container {
      display: -ms-flexbox;
      display: flex;
      -ms-flex: 1 1 100%;
      flex: 1 1 100%;
      -ms-flex-pack: distribute;
      justify-content: space-around;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap
  }
  
  .hero-text-field-container .text-field-container {
      padding: 20px
  }
  
  .demos-display {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      min-height: 200px
  }
  
  .demo {
      display: inline-block;
      -ms-flex: 1 1 45%;
      flex: 1 1 45%;
      -ms-flex-pack: distribute;
      justify-content: space-around;
      min-height: 200px;
      min-width: 400px;
      padding: 15px
  }
  
  .frame {
      width: 100%;
      height: 200px
  }
  
  .hero-top-app-bar.mdc-top-app-bar {
      position: relative;
      z-index: 0
  }
  
  .hero-top-app-bar:not(.mdc-top-app-bar--short-collapsed) {
      width: 80%;
      min-width: 300px
  }
  
  .mdc-form-field {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      color: rgba(0,0,0,.87);
      color: var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87));
      display: -ms-inline-flexbox;
      display: inline-flex;
      -ms-flex-align: center;
      align-items: center;
      vertical-align: middle
  }
  
  .mdc-form-field>label {
      margin-left: 0;
      margin-right: auto;
      padding-left: 4px;
      padding-right: 0;
      -ms-flex-order: 0;
      order: 0
  }
  
  .mdc-form-field--align-end>label,.mdc-form-field>label[dir=rtl],[dir=rtl] .mdc-form-field>label {
      margin-left: auto;
      margin-right: 0;
      padding-left: 0;
      padding-right: 4px
  }
  
  .mdc-form-field--align-end>label {
      -ms-flex-order: -1;
      order: -1
  }
  
  .mdc-form-field--align-end>label[dir=rtl],[dir=rtl] .mdc-form-field--align-end>label {
      margin-left: 0;
      margin-right: auto;
      padding-left: 4px;
      padding-right: 0
  }
  
  .mdc-touch-target-wrapper {
      display: inline
  }
  
  .mdc-radio {
      padding: 10px;
      display: inline-block;
      position: relative;
      -ms-flex: 0 0 auto;
      flex: 0 0 auto;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      width: 20px;
      height: 20px;
      cursor: pointer;
      will-change: opacity,transform,border-color,color
  }
  
  .mdc-radio .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle {
      border-color: rgba(0,0,0,.54)
  }
  
  .mdc-radio .mdc-radio__native-control:enabled+.mdc-radio__background .mdc-radio__inner-circle,.mdc-radio .mdc-radio__native-control:enabled:checked+.mdc-radio__background .mdc-radio__outer-circle {
      border-color: #018786;
      border-color: var(--mdc-theme-secondary,#018786)
  }
  
  .mdc-radio .mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__inner-circle,.mdc-radio .mdc-radio__native-control:disabled:checked+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio .mdc-radio__native-control:disabled:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio [aria-disabled=true] .mdc-radio__native-control+.mdc-radio__background .mdc-radio__inner-circle,.mdc-radio [aria-disabled=true] .mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio [aria-disabled=true] .mdc-radio__native-control:not(:checked)+.mdc-radio__background .mdc-radio__outer-circle {
      border-color: rgba(0,0,0,.26)
  }
  
  .mdc-radio .mdc-radio__background:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-radio .mdc-radio__background:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-radio .mdc-radio__background:before {
      top: -10px;
      left: -10px;
      width: 40px;
      height: 40px
  }
  
  .mdc-radio .mdc-radio__native-control {
      top: 0;
      right: 0;
      left: 0;
      width: 40px;
      height: 40px
  }
  
  .mdc-radio__background {
      display: inline-block;
      position: relative;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 20px;
      height: 20px
  }
  
  .mdc-radio__background:before {
      position: absolute;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: "";
      -webkit-transition: opacity .12s cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform .12s cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity .12s cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform .12s cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: opacity .12s 0ms cubic-bezier(.4,0,.6,1),transform .12s 0ms cubic-bezier(.4,0,.6,1);
      transition: opacity .12s cubic-bezier(.4,0,.6,1) 0ms,transform .12s cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity .12s cubic-bezier(.4,0,.6,1) 0ms,transform .12s cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform .12s cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-radio__outer-circle {
      border-width: 2px;
      -webkit-transition: border-color .12s cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: border-color .12s 0ms cubic-bezier(.4,0,.6,1);
      transition: border-color .12s cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-radio__inner-circle,.mdc-radio__outer-circle {
      position: absolute;
      top: 0;
      left: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-style: solid;
      border-radius: 50%
  }
  
  .mdc-radio__inner-circle {
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      border-width: 10px;
      -webkit-transition: border-color .12s cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform .12s cubic-bezier(.4,0,.6,1) 0ms;
      transition: border-color .12s cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform .12s cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: transform .12s 0ms cubic-bezier(.4,0,.6,1),border-color .12s 0ms cubic-bezier(.4,0,.6,1);
      transition: transform .12s cubic-bezier(.4,0,.6,1) 0ms,border-color .12s cubic-bezier(.4,0,.6,1) 0ms;
      transition: transform .12s cubic-bezier(.4,0,.6,1) 0ms,border-color .12s cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform .12s cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-radio__native-control {
      position: absolute;
      margin: 0;
      padding: 0;
      opacity: 0;
      cursor: inherit;
      z-index: 1
  }
  
  .mdc-radio--touch {
      margin: 4px
  }
  
  .mdc-radio--touch .mdc-radio__native-control {
      top: -4px;
      right: -4px;
      left: -4px;
      width: 48px;
      height: 48px
  }
  
  .mdc-radio__native-control:checked+.mdc-radio__background,.mdc-radio__native-control:disabled+.mdc-radio__background {
      -webkit-transition: opacity .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: opacity .12s 0ms cubic-bezier(0,0,.2,1),transform .12s 0ms cubic-bezier(0,0,.2,1);
      transition: opacity .12s cubic-bezier(0,0,.2,1) 0ms,transform .12s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity .12s cubic-bezier(0,0,.2,1) 0ms,transform .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms
  }
  
  .mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__outer-circle,.mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__outer-circle {
      -webkit-transition: border-color .12s cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: border-color .12s 0ms cubic-bezier(0,0,.2,1);
      transition: border-color .12s cubic-bezier(0,0,.2,1) 0ms
  }
  
  .mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__inner-circle,.mdc-radio__native-control:disabled+.mdc-radio__background .mdc-radio__inner-circle {
      -webkit-transition: border-color .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms;
      transition: border-color .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: transform .12s 0ms cubic-bezier(0,0,.2,1),border-color .12s 0ms cubic-bezier(0,0,.2,1);
      transition: transform .12s cubic-bezier(0,0,.2,1) 0ms,border-color .12s cubic-bezier(0,0,.2,1) 0ms;
      transition: transform .12s cubic-bezier(0,0,.2,1) 0ms,border-color .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms
  }
  
  .mdc-radio--disabled {
      cursor: default;
      pointer-events: none
  }
  
  .mdc-radio__native-control:checked+.mdc-radio__background .mdc-radio__inner-circle {
      -webkit-transform: scale(.5);
      -ms-transform: scale(.5);
      transform: scale(.5);
      -webkit-transition: border-color .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms;
      transition: border-color .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: transform .12s 0ms cubic-bezier(0,0,.2,1),border-color .12s 0ms cubic-bezier(0,0,.2,1);
      transition: transform .12s cubic-bezier(0,0,.2,1) 0ms,border-color .12s cubic-bezier(0,0,.2,1) 0ms;
      transition: transform .12s cubic-bezier(0,0,.2,1) 0ms,border-color .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms
  }
  
  .mdc-radio__native-control:disabled+.mdc-radio__background,[aria-disabled=true] .mdc-radio__native-control+.mdc-radio__background {
      cursor: default
  }
  
  .mdc-radio__native-control:focus+.mdc-radio__background:before {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      opacity: .12;
      -webkit-transition: opacity .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: opacity .12s 0ms cubic-bezier(0,0,.2,1),transform .12s 0ms cubic-bezier(0,0,.2,1);
      transition: opacity .12s cubic-bezier(0,0,.2,1) 0ms,transform .12s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity .12s cubic-bezier(0,0,.2,1) 0ms,transform .12s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .12s cubic-bezier(0,0,.2,1) 0ms
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-radio {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-radio .mdc-radio__ripple:after,.mdc-radio .mdc-radio__ripple:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-radio .mdc-radio__ripple:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-radio.mdc-ripple-upgraded .mdc-radio__ripple:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-radio.mdc-ripple-upgraded .mdc-radio__ripple:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-radio.mdc-ripple-upgraded--unbounded .mdc-radio__ripple:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-radio.mdc-ripple-upgraded--foreground-activation .mdc-radio__ripple:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-radio.mdc-ripple-upgraded--foreground-deactivation .mdc-radio__ripple:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-radio .mdc-radio__ripple:after,.mdc-radio .mdc-radio__ripple:before {
      top: 0%;
      left: 0%;
      width: 100%;
      height: 100%
  }
  
  .mdc-radio.mdc-ripple-upgraded .mdc-radio__ripple:after,.mdc-radio.mdc-ripple-upgraded .mdc-radio__ripple:before {
      top: var(--mdc-ripple-top,0%);
      left: var(--mdc-ripple-left,0%);
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-radio.mdc-ripple-upgraded .mdc-radio__ripple:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-radio .mdc-radio__ripple:after,.mdc-radio .mdc-radio__ripple:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-radio .mdc-radio__ripple:after,.mdc-radio .mdc-radio__ripple:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-radio:hover .mdc-radio__ripple:before {
      opacity: .04
  }
  
  .mdc-radio.mdc-ripple-upgraded--background-focused .mdc-radio__ripple:before,.mdc-radio:not(.mdc-ripple-upgraded):focus .mdc-radio__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-radio:not(.mdc-ripple-upgraded) .mdc-radio__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-radio:not(.mdc-ripple-upgraded):active .mdc-radio__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-radio.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-radio.mdc-ripple-upgraded--background-focused .mdc-radio__background:before {
      content: none
  }
  
  .mdc-radio__ripple {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none
  }
  
  .demo-radio,.demo-radio-form-field {
      margin: 0 10px
  }
  
  .mdc-menu-surface {
      display: none;
      position: absolute;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 32px);
      margin: 0;
      padding: 0;
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: top left;
      -ms-transform-origin: top left;
      transform-origin: top left;
      opacity: 0;
      overflow: auto;
      will-change: transform,opacity;
      z-index: 8;
      -webkit-transition: opacity .03s linear,-webkit-transform .12s cubic-bezier(0,0,.2,1);
      transition: opacity .03s linear,-webkit-transform .12s cubic-bezier(0,0,.2,1);
      -o-transition: opacity .03s linear,transform .12s cubic-bezier(0,0,.2,1);
      transition: opacity .03s linear,transform .12s cubic-bezier(0,0,.2,1);
      transition: opacity .03s linear,transform .12s cubic-bezier(0,0,.2,1),-webkit-transform .12s cubic-bezier(0,0,.2,1);
      -webkit-box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);
      box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);
      background-color: #fff;
      background-color: var(--mdc-theme-surface,#fff);
      color: #000;
      color: var(--mdc-theme-on-surface,#000);
      border-radius: 4px;
      transform-origin-left: top left;
      transform-origin-right: top right
  }
  
  .mdc-menu-surface:focus {
      outline: none
  }
  
  .mdc-menu-surface--open {
      display: inline-block;
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      opacity: 1
  }
  
  .mdc-menu-surface--animating-open {
      display: inline-block;
      -webkit-transform: scale(.8);
      -ms-transform: scale(.8);
      transform: scale(.8);
      opacity: 0
  }
  
  .mdc-menu-surface--animating-closed {
      display: inline-block;
      opacity: 0;
      -webkit-transition: opacity 75ms linear;
      -o-transition: opacity 75ms linear;
      transition: opacity 75ms linear
  }
  
  .mdc-menu-surface[dir=rtl],[dir=rtl] .mdc-menu-surface {
      transform-origin-left: top right;
      transform-origin-right: top left
  }
  
  .mdc-menu-surface--anchor {
      position: relative;
      overflow: visible
  }
  
  .mdc-menu-surface--fixed {
      position: fixed
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-menu {
      min-width: 112px
  }
  
  .mdc-menu .mdc-list,.mdc-menu .mdc-list-item__graphic,.mdc-menu .mdc-list-item__meta {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-menu .mdc-list-divider {
      margin: 8px 0
  }
  
  .mdc-menu .mdc-list-item {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none
  }
  
  .mdc-menu .mdc-list-item--disabled {
      cursor: auto
  }
  
  .mdc-menu a.mdc-list-item .mdc-list-item__graphic,.mdc-menu a.mdc-list-item .mdc-list-item__text {
      pointer-events: none
  }
  
  .mdc-menu__selection-group {
      padding: 0;
      fill: currentColor
  }
  
  .mdc-menu__selection-group .mdc-list-item {
      padding-left: 56px;
      padding-right: 16px
  }
  
  .mdc-menu__selection-group .mdc-list-item[dir=rtl],[dir=rtl] .mdc-menu__selection-group .mdc-list-item {
      padding-left: 16px;
      padding-right: 56px
  }
  
  .mdc-menu__selection-group .mdc-menu__selection-group-icon {
      left: 16px;
      right: auto;
      display: none;
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%)
  }
  
  .mdc-menu__selection-group .mdc-menu__selection-group-icon[dir=rtl],[dir=rtl] .mdc-menu__selection-group .mdc-menu__selection-group-icon {
      left: auto;
      right: 16px
  }
  
  .mdc-menu-item--selected .mdc-menu__selection-group-icon {
      display: inline
  }
  
  @-webkit-keyframes mdc-select-float-native-control {
      0% {
          -webkit-transform: translateY(8px);
          transform: translateY(8px);
          opacity: 0
      }
  
      to {
          -webkit-transform: translateY(0);
          transform: translateY(0);
          opacity: 1
      }
  }
  
  @keyframes mdc-select-float-native-control {
      0% {
          -webkit-transform: translateY(8px);
          transform: translateY(8px);
          opacity: 0
      }
  
      to {
          -webkit-transform: translateY(0);
          transform: translateY(0);
          opacity: 1
      }
  }
  
  .mdc-line-ripple {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      -webkit-transform: scaleX(0);
      -ms-transform: scaleX(0);
      transform: scaleX(0);
      -webkit-transition: opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);
      transition: opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);
      -o-transition: transform .18s cubic-bezier(.4,0,.2,1),opacity .18s cubic-bezier(.4,0,.2,1);
      transition: transform .18s cubic-bezier(.4,0,.2,1),opacity .18s cubic-bezier(.4,0,.2,1);
      transition: transform .18s cubic-bezier(.4,0,.2,1),opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);
      opacity: 0;
      z-index: 2
  }
  
  .mdc-line-ripple--active {
      -webkit-transform: scaleX(1);
      -ms-transform: scaleX(1);
      transform: scaleX(1);
      opacity: 1
  }
  
  .mdc-line-ripple--deactivating {
      opacity: 0
  }
  
  .mdc-notched-outline {
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      right: 0;
      left: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      height: 100%;
      text-align: left;
      pointer-events: none
  }
  
  .mdc-notched-outline[dir=rtl],[dir=rtl] .mdc-notched-outline {
      text-align: right
  }
  
  .mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: 100%;
      border-top: 1px solid;
      border-bottom: 1px solid;
      pointer-events: none
  }
  
  .mdc-notched-outline__leading {
      border-left: 1px solid;
      border-right: none;
      width: 12px
  }
  
  .mdc-notched-outline__leading[dir=rtl],.mdc-notched-outline__trailing,[dir=rtl] .mdc-notched-outline__leading {
      border-left: none;
      border-right: 1px solid
  }
  
  .mdc-notched-outline__trailing {
      -ms-flex-positive: 1;
      flex-grow: 1
  }
  
  .mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-notched-outline__trailing {
      border-left: 1px solid;
      border-right: none
  }
  
  .mdc-notched-outline__notch {
      -ms-flex: 0 0 auto;
      flex: 0 0 auto;
      width: auto;
      max-width: calc(100% - 12px * 2)
  }
  
  .mdc-notched-outline .mdc-floating-label {
      display: inline-block;
      position: relative;
      max-width: 100%
  }
  
  .mdc-notched-outline .mdc-floating-label--float-above {
      -o-text-overflow: clip;
      text-overflow: clip
  }
  
  .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      max-width: 133.33333%
  }
  
  .mdc-notched-outline--notched .mdc-notched-outline__notch {
      padding-left: 0;
      padding-right: 8px;
      border-top: none
  }
  
  .mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl],[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {
      padding-left: 8px;
      padding-right: 0
  }
  
  .mdc-notched-outline--no-label .mdc-notched-outline__notch {
      padding: 0
  }
  
  .mdc-floating-label {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1rem;
      line-height: 1.75rem;
      font-weight: 400;
      letter-spacing: .009375em;
      text-decoration: inherit;
      text-transform: inherit;
      position: absolute;
      left: 0;
      -webkit-transform-origin: left top;
      -ms-transform-origin: left top;
      transform-origin: left top;
      -webkit-transition: color .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);
      transition: color .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);
      -o-transition: transform .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1);
      transition: transform .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1);
      transition: transform .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);
      line-height: 1.15rem;
      text-align: left;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: text;
      overflow: hidden;
      will-change: transform
  }
  
  .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-floating-label {
      right: 0;
      left: auto;
      -webkit-transform-origin: right top;
      -ms-transform-origin: right top;
      transform-origin: right top;
      text-align: right
  }
  
  .mdc-floating-label--float-above {
      cursor: auto;
      -webkit-transform: translateY(-106%) scale(.75);
      -ms-transform: translateY(-106%) scale(.75);
      transform: translateY(-106%) scale(.75)
  }
  
  .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-standard .25s 1;
      animation: mdc-floating-label-shake-float-above-standard .25s 1
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-standard {
      0% {
          -webkit-transform: translateX(0%) translateY(-106%) scale(.75);
          transform: translateX(0%) translateY(-106%) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-106%) scale(.75);
          transform: translateX(4%) translateY(-106%) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-106%) scale(.75);
          transform: translateX(-4%) translateY(-106%) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-106%) scale(.75);
          transform: translateX(0%) translateY(-106%) scale(.75)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-standard {
      0% {
          -webkit-transform: translateX(0%) translateY(-106%) scale(.75);
          transform: translateX(0%) translateY(-106%) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(4%) translateY(-106%) scale(.75);
          transform: translateX(4%) translateY(-106%) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-4%) translateY(-106%) scale(.75);
          transform: translateX(-4%) translateY(-106%) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(0%) translateY(-106%) scale(.75);
          transform: translateX(0%) translateY(-106%) scale(.75)
      }
  }
  
  .mdc-select--with-leading-icon:not(.mdc-select--disabled) .mdc-select__icon {
      color: #000;
      color: var(--mdc-theme-on-surface,#000)
  }
  
  .mdc-select--with-leading-icon .mdc-select__icon {
      display: inline-block;
      position: absolute;
      bottom: 16px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 24px;
      height: 24px;
      border: none;
      background-color: transparent;
      fill: currentColor;
      opacity: .54;
      text-decoration: none;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none
  }
  
  .mdc-select__icon:not([tabindex]),.mdc-select__icon[tabindex="-1"] {
      cursor: default;
      pointer-events: none
  }
  
  .mdc-select-helper-text {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .75rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0333333333em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin: 0;
      -webkit-transition: opacity .18s cubic-bezier(.4,0,.2,1);
      -o-transition: opacity .18s cubic-bezier(.4,0,.2,1);
      transition: opacity .18s cubic-bezier(.4,0,.2,1);
      opacity: 0;
      will-change: opacity
  }
  
  .mdc-select-helper-text:before {
      display: inline-block;
      width: 0;
      height: 16px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-select-helper-text--persistent {
      -webkit-transition: none;
      -o-transition: none;
      transition: none;
      opacity: 1;
      will-change: auto
  }
  
  .mdc-select {
      position: relative
  }
  
  .mdc-select:not(.mdc-select--disabled) .mdc-select__anchor {
      background-color: #f5f5f5
  }
  
  .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-select:not(.mdc-select--disabled) .mdc-floating-label {
      color: rgba(0,0,0,.6)
  }
  
  .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text {
      border-bottom-color: rgba(0,0,0,.42)
  }
  
  .mdc-select:not(.mdc-select--disabled) .mdc-select__anchor+.mdc-select-helper-text {
      color: rgba(0,0,0,.6)
  }
  
  .mdc-select .mdc-select__anchor {
      border-radius: 4px 4px 0 0
  }
  
  .mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-line-ripple {
      background-color: #6200ee;
      background-color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {
      color: rgba(98,0,238,.87)
  }
  
  .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text:hover {
      border-bottom-color: rgba(0,0,0,.87)
  }
  
  .mdc-select .mdc-floating-label {
      left: 16px;
      right: auto;
      top: 21px;
      pointer-events: none
  }
  
  .mdc-select .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-select .mdc-floating-label {
      left: auto;
      right: 16px
  }
  
  .mdc-select.mdc-select--with-leading-icon .mdc-floating-label {
      left: 48px;
      right: auto
  }
  
  .mdc-select.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-select.mdc-select--with-leading-icon .mdc-floating-label {
      left: auto;
      right: 48px
  }
  
  .mdc-select.mdc-select--outlined .mdc-floating-label {
      left: 4px;
      right: auto;
      top: 17px
  }
  
  .mdc-select.mdc-select--outlined .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-select.mdc-select--outlined .mdc-floating-label {
      left: auto;
      right: 4px
  }
  
  .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label {
      left: 36px;
      right: auto
  }
  
  .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label {
      left: auto;
      right: 36px
  }
  
  .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above {
      left: 36px;
      right: auto
  }
  
  .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above {
      left: auto;
      right: 36px
  }
  
  .mdc-select__dropdown-icon {
      background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='5' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' opacity='.54' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat 50%;
      left: auto;
      right: 8px;
      position: absolute;
      bottom: 16px;
      width: 24px;
      height: 24px;
      -webkit-transition: -webkit-transform .15s cubic-bezier(.4,0,.2,1);
      transition: -webkit-transform .15s cubic-bezier(.4,0,.2,1);
      -o-transition: transform .15s cubic-bezier(.4,0,.2,1);
      transition: transform .15s cubic-bezier(.4,0,.2,1);
      transition: transform .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);
      pointer-events: none
  }
  
  .mdc-select__dropdown-icon[dir=rtl],[dir=rtl] .mdc-select__dropdown-icon {
      left: 8px;
      right: auto
  }
  
  .mdc-select--focused .mdc-select__dropdown-icon {
      background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='5' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%236200ee' fill-rule='evenodd' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat 50%
  }
  
  .mdc-select--activated .mdc-select__dropdown-icon {
      -webkit-transform: rotate(180deg) translateY(-5px);
      -ms-transform: rotate(180deg) translateY(-5px);
      transform: rotate(180deg) translateY(-5px);
      -webkit-transition: -webkit-transform .15s cubic-bezier(.4,0,.2,1);
      transition: -webkit-transform .15s cubic-bezier(.4,0,.2,1);
      -o-transition: transform .15s cubic-bezier(.4,0,.2,1);
      transition: transform .15s cubic-bezier(.4,0,.2,1);
      transition: transform .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-select__anchor {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      display: -ms-inline-flexbox;
      display: inline-flex;
      position: relative;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: 56px;
      overflow: hidden;
      will-change: opacity,transform,color
  }
  
  .mdc-select__anchor:after,.mdc-select__anchor:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-select__anchor:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-select__anchor.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-select__anchor.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-select__anchor.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-select__anchor.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-select__anchor.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-select__anchor:after,.mdc-select__anchor:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .mdc-select__anchor.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-select__anchor:after,.mdc-select__anchor:before {
      background-color: rgba(0,0,0,.87)
  }
  
  .mdc-select__anchor:hover:before {
      opacity: .04
  }
  
  .mdc-select__anchor.mdc-ripple-upgraded--background-focused:before,.mdc-select__anchor:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-select__anchor .mdc-floating-label--float-above {
      -webkit-transform: translateY(-70%) scale(.75);
      -ms-transform: translateY(-70%) scale(.75);
      transform: translateY(-70%) scale(.75)
  }
  
  .mdc-select__anchor.mdc-select--focused .mdc-line-ripple:after {
      -webkit-transform: scaleY(2);
      -ms-transform: scaleY(2);
      transform: scaleY(2);
      opacity: 1
  }
  
  .mdc-select__anchor+.mdc-select-helper-text {
      margin-right: 12px;
      margin-left: 12px
  }
  
  .mdc-select--outlined .mdc-select__anchor+.mdc-select-helper-text {
      margin-right: 16px;
      margin-left: 16px
  }
  
  .mdc-select--focused .mdc-select__anchor+.mdc-select-helper-text:not(.mdc-select-helper-text--validation-msg) {
      opacity: 1
  }
  
  .mdc-select__selected-text {
      padding: 20px 52px 4px 16px;
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1rem;
      line-height: 1.75rem;
      font-weight: 400;
      letter-spacing: .009375em;
      text-decoration: inherit;
      text-transform: inherit;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      min-width: 200px;
      height: 56px;
      border: none;
      border-bottom: 1px solid;
      outline: none;
      background-color: transparent;
      color: inherit;
      white-space: nowrap;
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none
  }
  
  .mdc-select__selected-text[dir=rtl],[dir=rtl] .mdc-select__selected-text {
      padding-left: 52px;
      padding-right: 16px
  }
  
  .mdc-select__selected-text::-ms-expand {
      display: none
  }
  
  .mdc-select__selected-text::-ms-value {
      background-color: transparent;
      color: inherit
  }
  
  @-moz-document url-prefix("") {
      .mdc-select__selected-text {
          text-indent: -2px
      }
  }
  
  .mdc-select--outlined {
      border: none
  }
  
  .mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing {
      border-color: rgba(0,0,0,.38)
  }
  
  .mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__trailing {
      border-color: rgba(0,0,0,.87)
  }
  
  .mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {
      border-width: 2px;
      border-color: #6200ee;
      border-color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 4px 0 0 4px
  }
  
  .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl],.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing,[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 0 4px 4px 0
  }
  
  .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing {
      border-radius: 4px 0 0 4px
  }
  
  .mdc-select--outlined .mdc-select__selected-text {
      border-radius: 4px
  }
  
  .mdc-select--outlined:not(.mdc-select--disabled) .mdc-select__anchor {
      background-color: transparent
  }
  
  .mdc-select--outlined .mdc-select__anchor {
      overflow: visible
  }
  
  .mdc-select--outlined .mdc-select__anchor:after,.mdc-select--outlined .mdc-select__anchor:before {
      content: none
  }
  
  .mdc-select--outlined .mdc-select__anchor .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-text-field-outlined .25s 1;
      animation: mdc-floating-label-shake-float-above-text-field-outlined .25s 1
  }
  
  .mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above {
      -webkit-transform: translateY(-144%) scale(1);
      -ms-transform: translateY(-144%) scale(1);
      transform: translateY(-144%) scale(1);
      font-size: .75rem
  }
  
  .mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      -webkit-transform: translateY(-130%) scale(.75);
      -ms-transform: translateY(-130%) scale(.75);
      transform: translateY(-130%) scale(.75);
      font-size: 1rem
  }
  
  .mdc-select--outlined .mdc-select__selected-text {
      padding: 14px 52px 12px 16px;
      display: -ms-flexbox;
      display: flex;
      border: none;
      background-color: transparent;
      z-index: 1
  }
  
  .mdc-select--outlined .mdc-select__selected-text[dir=rtl],[dir=rtl] .mdc-select--outlined .mdc-select__selected-text {
      padding-left: 52px;
      padding-right: 16px
  }
  
  .mdc-select--outlined .mdc-select__icon {
      z-index: 2
  }
  
  .mdc-select--outlined .mdc-floating-label {
      line-height: 1.15rem;
      pointer-events: auto
  }
  
  .mdc-select--invalid:not(.mdc-select--disabled) .mdc-floating-label {
      color: #b00020;
      color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__selected-text {
      border-bottom-color: #b00020;
      border-bottom-color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-line-ripple {
      background-color: #b00020;
      background-color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {
      color: #b00020
  }
  
  .mdc-select--invalid:not(.mdc-select--disabled).mdc-select--invalid .mdc-select__anchor+.mdc-select-helper-text--validation-msg {
      color: #b00020;
      color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__selected-text:hover {
      border-bottom-color: #b00020;
      border-bottom-color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__trailing {
      border-color: #b00020;
      border-color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing {
      border-width: 2px;
      border-color: #b00020;
      border-color: var(--mdc-theme-error,#b00020)
  }
  
  .mdc-select--invalid .mdc-select__dropdown-icon {
      background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='5' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23b00020' fill-rule='evenodd' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat 50%
  }
  
  .mdc-select--invalid+.mdc-select-helper-text--validation-msg {
      opacity: 1
  }
  
  .mdc-select--required .mdc-floating-label:after {
      content: "*"
  }
  
  .mdc-select--disabled {
      cursor: default;
      pointer-events: none
  }
  
  .mdc-select--disabled .mdc-select__anchor {
      background-color: #fafafa
  }
  
  .mdc-select--disabled .mdc-floating-label {
      color: rgba(0,0,0,.37)
  }
  
  .mdc-select--disabled .mdc-select__dropdown-icon {
      background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='5' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' opacity='.37' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat 50%
  }
  
  .mdc-select--disabled .mdc-line-ripple {
      display: none
  }
  
  .mdc-select--disabled .mdc-select__icon {
      color: rgba(0,0,0,.37)
  }
  
  .mdc-select--disabled .mdc-select__selected-text {
      color: rgba(0,0,0,.37);
      border-bottom-style: dotted;
      pointer-events: none
  }
  
  .mdc-select--disabled.mdc-select--outlined .mdc-select__anchor {
      background-color: transparent
  }
  
  .mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__leading,.mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__notch,.mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__trailing {
      border-color: rgba(0,0,0,.16)
  }
  
  .mdc-select--disabled.mdc-select--outlined .mdc-select__selected-text {
      border-bottom-style: none
  }
  
  .mdc-select--no-label:not(.mdc-select--outlined) .mdc-select__anchor .mdc-select__selected-text {
      padding-top: 14px
  }
  
  .mdc-select--with-leading-icon .mdc-select__icon {
      left: 16px;
      right: auto
  }
  
  .mdc-select--with-leading-icon .mdc-select__icon[dir=rtl],[dir=rtl] .mdc-select--with-leading-icon .mdc-select__icon {
      left: auto;
      right: 16px
  }
  
  .mdc-select--with-leading-icon .mdc-select__selected-text {
      padding-left: 48px;
      padding-right: 32px
  }
  
  .mdc-select--with-leading-icon .mdc-select__selected-text[dir=rtl],[dir=rtl] .mdc-select--with-leading-icon .mdc-select__selected-text {
      padding-left: 32px;
      padding-right: 48px
  }
  
  .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above {
      -webkit-transform: translateY(-144%) translateX(-32px) scale(1);
      -ms-transform: translateY(-144%) translateX(-32px) scale(1);
      transform: translateY(-144%) translateX(-32px) scale(1)
  }
  
  .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above {
      -webkit-transform: translateY(-144%) translateX(32px) scale(1);
      -ms-transform: translateY(-144%) translateX(32px) scale(1);
      transform: translateY(-144%) translateX(32px) scale(1)
  }
  
  .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above {
      font-size: .75rem
  }
  
  .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      -webkit-transform: translateY(-130%) translateX(-32px) scale(.75);
      -ms-transform: translateY(-130%) translateX(-32px) scale(.75);
      transform: translateY(-130%) translateX(-32px) scale(.75)
  }
  
  .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      -webkit-transform: translateY(-130%) translateX(32px) scale(.75);
      -ms-transform: translateY(-130%) translateX(32px) scale(.75);
      transform: translateY(-130%) translateX(32px) scale(.75)
  }
  
  .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      font-size: 1rem
  }
  
  .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon .25s 1;
      animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon .25s 1
  }
  
  .mdc-select--with-leading-icon.mdc-select--outlined[dir=rtl] .mdc-floating-label--shake,[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--shake {
      -webkit-animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl .25s 1;
      animation: mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl .25s 1
  }
  
  .mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text,.mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text[dir=rtl],[dir=rtl] .mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text {
      padding-left: 32px;
      padding-right: 32px
  }
  
  .mdc-select__menu .mdc-list .mdc-list-item--selected {
      color: #000;
      color: var(--mdc-theme-on-surface,#000)
  }
  
  .mdc-select__menu .mdc-list .mdc-list-item--selected:after,.mdc-select__menu .mdc-list .mdc-list-item--selected:before {
      background-color: #000
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-select__menu .mdc-list .mdc-list-item--selected:after,.mdc-select__menu .mdc-list .mdc-list-item--selected:before {
          background-color: var(--mdc-theme-on-surface,#000)
      }
  }
  
  .mdc-select__menu .mdc-list .mdc-list-item--selected:hover:before {
      opacity: .04
  }
  
  .mdc-select__menu .mdc-list .mdc-list-item--selected.mdc-ripple-upgraded--background-focused:before,.mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-select__menu .mdc-list .mdc-list-item--selected.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon {
      0% {
          -webkit-transform: translateX(-32px) translateY(-130%) scale(.75);
          transform: translateX(-32px) translateY(-130%) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(calc(4% - 32px)) translateY(-130%) scale(.75);
          transform: translateX(calc(4% - 32px)) translateY(-130%) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(calc(-4% - 32px)) translateY(-130%) scale(.75);
          transform: translateX(calc(-4% - 32px)) translateY(-130%) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(-32px) translateY(-130%) scale(.75);
          transform: translateX(-32px) translateY(-130%) scale(.75)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon {
      0% {
          -webkit-transform: translateX(-32px) translateY(-130%) scale(.75);
          transform: translateX(-32px) translateY(-130%) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(calc(4% - 32px)) translateY(-130%) scale(.75);
          transform: translateX(calc(4% - 32px)) translateY(-130%) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(calc(-4% - 32px)) translateY(-130%) scale(.75);
          transform: translateX(calc(-4% - 32px)) translateY(-130%) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(-32px) translateY(-130%) scale(.75);
          transform: translateX(-32px) translateY(-130%) scale(.75)
      }
  }
  
  @-webkit-keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl {
      0% {
          -webkit-transform: translateX(32px) translateY(-130%) scale(.75);
          transform: translateX(32px) translateY(-130%) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(calc(4% - -32px)) translateY(-130%) scale(.75);
          transform: translateX(calc(4% - -32px)) translateY(-130%) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(calc(-4% - -32px)) translateY(-130%) scale(.75);
          transform: translateX(calc(-4% - -32px)) translateY(-130%) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(32px) translateY(-130%) scale(.75);
          transform: translateX(32px) translateY(-130%) scale(.75)
      }
  }
  
  @keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl {
      0% {
          -webkit-transform: translateX(32px) translateY(-130%) scale(.75);
          transform: translateX(32px) translateY(-130%) scale(.75)
      }
  
      33% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(calc(4% - -32px)) translateY(-130%) scale(.75);
          transform: translateX(calc(4% - -32px)) translateY(-130%) scale(.75)
      }
  
      66% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(calc(-4% - -32px)) translateY(-130%) scale(.75);
          transform: translateX(calc(-4% - -32px)) translateY(-130%) scale(.75)
      }
  
      to {
          -webkit-transform: translateX(32px) translateY(-130%) scale(.75);
          transform: translateX(32px) translateY(-130%) scale(.75)
      }
  }
  
  .custom-enhanced-select-width {
      width: 240px
  }
  
  .demo-select-box-shaped .mdc-select__anchor {
      border-radius: 17.92px 17.92px 0 0
  }
  
  .demo-select-outline-shaped .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 28px 0 0 28px;
      width: 28px
  }
  
  .demo-select-outline-shaped .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl],[dir=rtl] .demo-select-outline-shaped .mdc-notched-outline .mdc-notched-outline__leading {
      border-radius: 0 28px 28px 0
  }
  
  .demo-select-outline-shaped .mdc-notched-outline .mdc-notched-outline__notch {
      max-width: calc(100% - 28px * 2)
  }
  
  .demo-select-outline-shaped .mdc-notched-outline .mdc-notched-outline__trailing {
      border-radius: 0 28px 28px 0
  }
  
  .demo-select-outline-shaped .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .demo-select-outline-shaped .mdc-notched-outline .mdc-notched-outline__trailing {
      border-radius: 28px 0 0 28px
  }
  
  .demo-select-outline-shaped .mdc-select__selected-text {
      border-radius: 28px;
      padding-left: 32px;
      padding-right: 52px
  }
  
  .demo-select-outline-shaped .mdc-select__selected-text[dir=rtl],[dir=rtl] .demo-select-outline-shaped .mdc-select__selected-text {
      padding-left: 52px;
      padding-right: 32px
  }
  
  .demo-select-outline-shaped+.mdc-select-helper-text {
      margin-left: 32px;
      margin-right: 16px
  }
  
  .demo-select-outline-shaped+.mdc-select-helper-text[dir=rtl],[dir=rtl] .demo-select-outline-shaped+.mdc-select-helper-text {
      margin-left: 16px;
      margin-right: 32px
  }
  
  .select-row {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: start;
      align-items: flex-start;
      -ms-flex-pack: start;
      justify-content: flex-start;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap
  }
  
  .select-row .mdc-select {
      margin-right: 5em
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-chip {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      will-change: transform,opacity;
      border-radius: 16px;
      background-color: #e0e0e0;
      color: rgba(0,0,0,.87);
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      height: 32px;
      display: -ms-inline-flexbox;
      display: inline-flex;
      position: relative;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 7px 12px;
      outline: none;
      cursor: pointer;
      overflow: hidden
  }
  
  .mdc-chip:after,.mdc-chip:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-chip:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-chip.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-chip.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-chip.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-chip.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: 225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards;
      animation: 225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards
  }
  
  .mdc-chip.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: .15s mdc-ripple-fg-opacity-out;
      animation: .15s mdc-ripple-fg-opacity-out;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-chip:after,.mdc-chip:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .mdc-chip.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-chip:after,.mdc-chip:before {
      background-color: rgba(0,0,0,.87)
  }
  
  .mdc-chip:hover:before {
      opacity: .04
  }
  
  .mdc-chip.mdc-ripple-upgraded--background-focused:before,.mdc-chip:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-chip:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-chip:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .16
  }
  
  .mdc-chip.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.16
  }
  
  .mdc-chip:hover {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-chip.mdc-chip--selected .mdc-chip__checkmark,.mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden) {
      margin: -4px 4px -4px -4px
  }
  
  .mdc-chip:hover {
      color: #000;
      color: var(--mdc-theme-on-surface,#000)
  }
  
  .mdc-chip__icon--leading,.mdc-chip__icon--trailing {
      color: rgba(0,0,0,.54)
  }
  
  .mdc-chip__icon--trailing:hover {
      color: rgba(0,0,0,.62)
  }
  
  .mdc-chip__icon--trailing:focus {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-chip__icon.mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden) {
      width: 20px;
      height: 20px;
      font-size: 20px
  }
  
  .mdc-chip__icon.mdc-chip__icon--trailing {
      width: 18px;
      height: 18px;
      font-size: 18px
  }
  
  .mdc-chip__icon--trailing {
      margin: 0 -4px 0 4px
  }
  
  .mdc-chip--exit {
      -webkit-transition: opacity 75ms cubic-bezier(.4,0,.2,1),width .15s cubic-bezier(0,0,.2,1),padding .1s linear,margin .1s linear;
      -o-transition: opacity 75ms cubic-bezier(.4,0,.2,1),width .15s cubic-bezier(0,0,.2,1),padding .1s linear,margin .1s linear;
      transition: opacity 75ms cubic-bezier(.4,0,.2,1),width .15s cubic-bezier(0,0,.2,1),padding .1s linear,margin .1s linear;
      opacity: 0
  }
  
  .mdc-chip__text {
      white-space: nowrap
  }
  
  .mdc-chip__icon {
      border-radius: 50%;
      outline: none;
      vertical-align: middle
  }
  
  .mdc-chip__checkmark {
      height: 20px
  }
  
  .mdc-chip__checkmark-path {
      -webkit-transition: stroke-dashoffset .15s cubic-bezier(.4,0,.6,1) 50ms;
      -o-transition: stroke-dashoffset .15s 50ms cubic-bezier(.4,0,.6,1);
      transition: stroke-dashoffset .15s cubic-bezier(.4,0,.6,1) 50ms;
      stroke-width: 2px;
      stroke-dashoffset: 29.7833385;
      stroke-dasharray: 29.7833385
  }
  
  .mdc-chip--selected .mdc-chip__checkmark-path {
      stroke-dashoffset: 0
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:before {
      opacity: .08
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:after,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:after,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:hover:before {
      opacity: .12
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded--background-focused:before,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .2
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.24
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected {
      color: #6200ee;
      color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__icon--leading {
      color: rgba(98,0,238,.54)
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:hover {
      color: #6200ee;
      color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-chip-set--choice .mdc-chip .mdc-chip__checkmark-path {
      stroke: #6200ee;
      stroke: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-chip-set--choice .mdc-chip--selected {
      background-color: #fff;
      background-color: var(--mdc-theme-surface,#fff)
  }
  
  .mdc-chip__checkmark-svg {
      width: 0;
      height: 20px;
      -webkit-transition: width .15s cubic-bezier(.4,0,.2,1);
      -o-transition: width .15s cubic-bezier(.4,0,.2,1);
      transition: width .15s cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-chip--selected .mdc-chip__checkmark-svg {
      width: 20px
  }
  
  .mdc-chip-set--filter .mdc-chip__icon--leading {
      -webkit-transition: opacity 75ms linear;
      -o-transition: opacity 75ms linear;
      transition: opacity 75ms linear;
      -webkit-transition-delay: -50ms;
      -o-transition-delay: -50ms;
      transition-delay: -50ms;
      opacity: 1
  }
  
  .mdc-chip-set--filter .mdc-chip__icon--leading+.mdc-chip__checkmark {
      -webkit-transition: opacity 75ms linear;
      -o-transition: opacity 75ms linear;
      transition: opacity 75ms linear;
      -webkit-transition-delay: 80ms;
      -o-transition-delay: 80ms;
      transition-delay: 80ms;
      opacity: 0
  }
  
  .mdc-chip-set--filter .mdc-chip__icon--leading+.mdc-chip__checkmark .mdc-chip__checkmark-svg {
      -webkit-transition: width 0ms;
      -o-transition: width 0ms;
      transition: width 0ms
  }
  
  .mdc-chip-set--filter .mdc-chip--selected .mdc-chip__icon--leading {
      opacity: 0
  }
  
  .mdc-chip-set--filter .mdc-chip--selected .mdc-chip__icon--leading+.mdc-chip__checkmark {
      width: 0;
      opacity: 1
  }
  
  .mdc-chip-set--filter .mdc-chip__icon--leading-hidden.mdc-chip__icon--leading {
      width: 0;
      opacity: 0
  }
  
  .mdc-chip-set--filter .mdc-chip__icon--leading-hidden.mdc-chip__icon--leading+.mdc-chip__checkmark {
      width: 20px
  }
  
  @-webkit-keyframes mdc-chip-entry {
      0% {
          -webkit-transform: scale(.8);
          transform: scale(.8);
          opacity: .4
      }
  
      to {
          -webkit-transform: scale(1);
          transform: scale(1);
          opacity: 1
      }
  }
  
  @keyframes mdc-chip-entry {
      0% {
          -webkit-transform: scale(.8);
          transform: scale(.8);
          opacity: .4
      }
  
      to {
          -webkit-transform: scale(1);
          transform: scale(1);
          opacity: 1
      }
  }
  
  .mdc-chip-set {
      padding: 4px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .mdc-chip-set .mdc-chip {
      margin: 4px
  }
  
  .mdc-chip-set--input .mdc-chip {
      -webkit-animation: mdc-chip-entry .1s cubic-bezier(0,0,.2,1);
      animation: mdc-chip-entry .1s cubic-bezier(0,0,.2,1)
  }
  
  .demo-content {
      padding: 64px 16px 0
  }
  
  .component-catalog-panel {
      margin-top: 24px;
      padding-bottom: 24px
  }
  
  .component-catalog-panel.component-catalog-panel--v2-hero .component-catalog-panel__header {
      -ms-flex: 1 1 40%;
      flex: 1 1 40%
  }
  
  .component-catalog-panel__header {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-flow: column wrap;
      flex-flow: column wrap;
      height: 550px;
      -ms-flex-align: start;
      align-items: flex-start
  }
  
  .component-catalog-panel__header.component-catalog-panel--v2-hero {
      -ms-flex: 1 1 auto;
      flex: 1 1 auto
  }
  
  .component-catalog-panel__hero-area {
      height: 100%;
      margin-bottom: 48px
  }
  
  .component-catalog-panel__header-elements {
      max-width: 300px;
      padding-right: 40px
  }
  
  .component-catalog-panel .hero {
      -ms-flex-order: 4;
      order: 4;
      -ms-flex: 1 1 100%;
      flex: 1 1 100%;
      width: calc(100% - 340px);
      height: 550px;
      padding: 24px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .component-catalog-panel .hero-options {
      -ms-flex: 1 1 auto;
      flex: 1 1 auto
  }
  
  .component-catalog-panel .hero-component {
      -ms-flex-order: 4;
      order: 4;
      -ms-flex: 1 1 100%;
      flex: 1 1 100%;
      height: 550px;
      width: calc(100% - 340px);
      margin-top: 32px
  }
  
  @media screen and (max-width: 820px) {
      .component-catalog-panel.component-catalog-panel--v2-hero .hero-component {
          -ms-flex-order:0;
          order: 0;
          -ms-flex: 1 1 auto;
          flex: 1 1 auto;
          height: auto
      }
  
      .component-catalog-panel__header-elements {
          max-width: none
      }
  
      .component-catalog-panel__header {
          -ms-flex-flow: column nowrap;
          flex-flow: column nowrap;
          height: auto
      }
  
      .component-catalog-panel .hero-options {
          max-height: none
      }
  
      .component-catalog-panel .hero,.component-catalog-panel .hero-component {
          width: 100%
      }
  }
  
  .hero-select {
      width: 250px
  }
  
  .hero-iframe {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-flow: row nowrap;
      flex-flow: row nowrap;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      background-color: rgba(0,0,0,.05);
      -ms-flex: 1 1 100%;
      flex: 1 1 100%;
      height: 408px;
      padding: 24px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .component-catalog-resources {
      margin: 0;
      padding: 0;
      list-style: none
  }
  
  .mdc-touch-target-wrapper {
      display: inline
  }
  
  .mdc-button {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 2.25rem;
      font-weight: 500;
      letter-spacing: .0892857143em;
      text-decoration: none;
      text-transform: uppercase;
      padding: 0 8px;
      display: -ms-inline-flexbox;
      display: inline-flex;
      position: relative;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      min-width: 64px;
      border: none;
      outline: none;
      line-height: inherit;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-appearance: none;
      overflow: visible;
      vertical-align: middle;
      border-radius: 4px
  }
  
  .mdc-button::-moz-focus-inner {
      padding: 0;
      border: 0
  }
  
  .mdc-button:active {
      outline: none
  }
  
  .mdc-button:hover {
      cursor: pointer
  }
  
  .mdc-button:disabled {
      background-color: transparent;
      color: rgba(0,0,0,.37);
      cursor: default;
      pointer-events: none
  }
  
  .mdc-button .mdc-button__ripple {
      border-radius: 4px
  }
  
  .mdc-button:not(:disabled) {
      background-color: transparent
  }
  
  .mdc-button .mdc-button__icon {
      margin-left: 0;
      margin-right: 8px;
      display: inline-block;
      width: 18px;
      height: 18px;
      font-size: 18px;
      vertical-align: top
  }
  
  .mdc-button .mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button .mdc-button__icon {
      margin-left: 8px;
      margin-right: 0
  }
  
  .mdc-button .mdc-button__touch {
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      height: 48px;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%)
  }
  
  .mdc-button:not(:disabled) {
      color: #6200ee;
      color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-button__label+.mdc-button__icon {
      margin-left: 8px;
      margin-right: 0
  }
  
  .mdc-button__label+.mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button__label+.mdc-button__icon {
      margin-left: 0;
      margin-right: 8px
  }
  
  svg.mdc-button__icon {
      fill: currentColor
  }
  
  .mdc-button--outlined .mdc-button__icon,.mdc-button--raised .mdc-button__icon,.mdc-button--unelevated .mdc-button__icon {
      margin-left: -4px;
      margin-right: 8px
  }
  
  .mdc-button--outlined .mdc-button__icon[dir=rtl],.mdc-button--outlined .mdc-button__label+.mdc-button__icon,.mdc-button--raised .mdc-button__icon[dir=rtl],.mdc-button--raised .mdc-button__label+.mdc-button__icon,.mdc-button--unelevated .mdc-button__icon[dir=rtl],.mdc-button--unelevated .mdc-button__label+.mdc-button__icon,[dir=rtl] .mdc-button--outlined .mdc-button__icon,[dir=rtl] .mdc-button--raised .mdc-button__icon,[dir=rtl] .mdc-button--unelevated .mdc-button__icon {
      margin-left: 8px;
      margin-right: -4px
  }
  
  .mdc-button--outlined .mdc-button__label+.mdc-button__icon[dir=rtl],.mdc-button--raised .mdc-button__label+.mdc-button__icon[dir=rtl],.mdc-button--unelevated .mdc-button__label+.mdc-button__icon[dir=rtl],[dir=rtl] .mdc-button--outlined .mdc-button__label+.mdc-button__icon,[dir=rtl] .mdc-button--raised .mdc-button__label+.mdc-button__icon,[dir=rtl] .mdc-button--unelevated .mdc-button__label+.mdc-button__icon {
      margin-left: -4px;
      margin-right: 8px
  }
  
  .mdc-button--raised,.mdc-button--unelevated {
      padding: 0 16px
  }
  
  .mdc-button--raised:disabled,.mdc-button--unelevated:disabled {
      background-color: rgba(0,0,0,.12);
      color: rgba(0,0,0,.37)
  }
  
  .mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled) {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled) {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .mdc-button--raised:not(:disabled),.mdc-button--unelevated:not(:disabled) {
      color: #fff;
      color: var(--mdc-theme-on-primary,#fff)
  }
  
  .mdc-button--raised {
      -webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
      -webkit-transition: -webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);
      transition: -webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);
      -o-transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
      transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
      transition: box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-button--raised:focus,.mdc-button--raised:hover {
      -webkit-box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);
      box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)
  }
  
  .mdc-button--raised:active {
      -webkit-box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);
      box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)
  }
  
  .mdc-button--raised:disabled {
      -webkit-box-shadow: 0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);
      box-shadow: 0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)
  }
  
  .mdc-button--outlined {
      border-style: solid;
      padding: 0 15px;
      border-width: 1px
  }
  
  .mdc-button--outlined:disabled {
      border-color: rgba(0,0,0,.37)
  }
  
  .mdc-button--outlined .mdc-button__ripple {
      top: -1px;
      left: -1px;
      border: 1px solid transparent
  }
  
  .mdc-button--outlined:not(:disabled) {
      border-color: #6200ee;
      border-color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-button--touch {
      margin-top: 6px;
      margin-bottom: 6px
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-button {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-button .mdc-button__ripple:after,.mdc-button .mdc-button__ripple:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-button .mdc-button__ripple:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-button.mdc-ripple-upgraded .mdc-button__ripple:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-button.mdc-ripple-upgraded .mdc-button__ripple:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-button.mdc-ripple-upgraded--unbounded .mdc-button__ripple:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-button.mdc-ripple-upgraded--foreground-activation .mdc-button__ripple:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-button.mdc-ripple-upgraded--foreground-deactivation .mdc-button__ripple:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-button .mdc-button__ripple:after,.mdc-button .mdc-button__ripple:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .mdc-button.mdc-ripple-upgraded .mdc-button__ripple:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-button .mdc-button__ripple:after,.mdc-button .mdc-button__ripple:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-button .mdc-button__ripple:after,.mdc-button .mdc-button__ripple:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .mdc-button:hover .mdc-button__ripple:before {
      opacity: .04
  }
  
  .mdc-button.mdc-ripple-upgraded--background-focused .mdc-button__ripple:before,.mdc-button:not(.mdc-ripple-upgraded):focus .mdc-button__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-button:not(.mdc-ripple-upgraded) .mdc-button__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-button:not(.mdc-ripple-upgraded):active .mdc-button__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-button.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-button .mdc-button__ripple {
      position: absolute;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      width: 100%;
      height: 100%;
      overflow: hidden
  }
  
  .mdc-button:not(.mdc-button--outlined) .mdc-button__ripple {
      top: 0;
      left: 0
  }
  
  .mdc-button--raised .mdc-button__ripple:after,.mdc-button--raised .mdc-button__ripple:before,.mdc-button--unelevated .mdc-button__ripple:after,.mdc-button--unelevated .mdc-button__ripple:before {
      background-color: #fff
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-button--raised .mdc-button__ripple:after,.mdc-button--raised .mdc-button__ripple:before,.mdc-button--unelevated .mdc-button__ripple:after,.mdc-button--unelevated .mdc-button__ripple:before {
          background-color: var(--mdc-theme-on-primary,#fff)
      }
  }
  
  .mdc-button--raised:hover .mdc-button__ripple:before,.mdc-button--unelevated:hover .mdc-button__ripple:before {
      opacity: .08
  }
  
  .mdc-button--raised.mdc-ripple-upgraded--background-focused .mdc-button__ripple:before,.mdc-button--raised:not(.mdc-ripple-upgraded):focus .mdc-button__ripple:before,.mdc-button--unelevated.mdc-ripple-upgraded--background-focused .mdc-button__ripple:before,.mdc-button--unelevated:not(.mdc-ripple-upgraded):focus .mdc-button__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-button--raised:not(.mdc-ripple-upgraded) .mdc-button__ripple:after,.mdc-button--unelevated:not(.mdc-ripple-upgraded) .mdc-button__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-button--raised:not(.mdc-ripple-upgraded):active .mdc-button__ripple:after,.mdc-button--unelevated:not(.mdc-ripple-upgraded):active .mdc-button__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-button--raised.mdc-ripple-upgraded,.mdc-button--unelevated.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.24
  }
  
  .mdc-button {
      height: 36px
  }
  
  .demo-button {
      margin: 8px 16px
  }
  
  .hero-button {
      margin: 16px 32px
  }
  
  .hero-button-container {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-flow: row nowrap;
      flex-flow: row nowrap;
      -ms-flex-align: center;
      align-items: center
  }
  
  @media screen and (max-width: 600px) {
      .hero-button-container {
          -ms-flex-flow:column nowrap;
          flex-flow: column nowrap
      }
  }
  
  .demo-button-shaped,.demo-button-shaped .mdc-button__ripple {
      border-radius: 18px
  }
  
  .mdc-touch-target-wrapper {
      display: inline
  }
  
  @-webkit-keyframes mdc-checkbox-unchecked-checked-checkmark-path {
      0%,50% {
          stroke-dashoffset: 29.7833385
      }
  
      50% {
          -webkit-animation-timing-function: cubic-bezier(0,0,.2,1);
          animation-timing-function: cubic-bezier(0,0,.2,1)
      }
  
      to {
          stroke-dashoffset: 0
      }
  }
  
  @keyframes mdc-checkbox-unchecked-checked-checkmark-path {
      0%,50% {
          stroke-dashoffset: 29.7833385
      }
  
      50% {
          -webkit-animation-timing-function: cubic-bezier(0,0,.2,1);
          animation-timing-function: cubic-bezier(0,0,.2,1)
      }
  
      to {
          stroke-dashoffset: 0
      }
  }
  
  @-webkit-keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
      0%,68.2% {
          -webkit-transform: scaleX(0);
          transform: scaleX(0)
      }
  
      68.2% {
          -webkit-animation-timing-function: cubic-bezier(0,0,0,1);
          animation-timing-function: cubic-bezier(0,0,0,1)
      }
  
      to {
          -webkit-transform: scaleX(1);
          transform: scaleX(1)
      }
  }
  
  @keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
      0%,68.2% {
          -webkit-transform: scaleX(0);
          transform: scaleX(0)
      }
  
      68.2% {
          -webkit-animation-timing-function: cubic-bezier(0,0,0,1);
          animation-timing-function: cubic-bezier(0,0,0,1)
      }
  
      to {
          -webkit-transform: scaleX(1);
          transform: scaleX(1)
      }
  }
  
  @-webkit-keyframes mdc-checkbox-checked-unchecked-checkmark-path {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,1,1);
          animation-timing-function: cubic-bezier(.4,0,1,1);
          opacity: 1;
          stroke-dashoffset: 0
      }
  
      to {
          opacity: 0;
          stroke-dashoffset: -29.7833385
      }
  }
  
  @keyframes mdc-checkbox-checked-unchecked-checkmark-path {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,1,1);
          animation-timing-function: cubic-bezier(.4,0,1,1);
          opacity: 1;
          stroke-dashoffset: 0
      }
  
      to {
          opacity: 0;
          stroke-dashoffset: -29.7833385
      }
  }
  
  @-webkit-keyframes mdc-checkbox-checked-indeterminate-checkmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(0,0,.2,1);
          animation-timing-function: cubic-bezier(0,0,.2,1);
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  
      to {
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          opacity: 0
      }
  }
  
  @keyframes mdc-checkbox-checked-indeterminate-checkmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(0,0,.2,1);
          animation-timing-function: cubic-bezier(0,0,.2,1);
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  
      to {
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          opacity: 0
      }
  }
  
  @-webkit-keyframes mdc-checkbox-indeterminate-checked-checkmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.14,0,0,1);
          animation-timing-function: cubic-bezier(.14,0,0,1);
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          opacity: 0
      }
  
      to {
          -webkit-transform: rotate(1turn);
          transform: rotate(1turn);
          opacity: 1
      }
  }
  
  @keyframes mdc-checkbox-indeterminate-checked-checkmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.14,0,0,1);
          animation-timing-function: cubic-bezier(.14,0,0,1);
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          opacity: 0
      }
  
      to {
          -webkit-transform: rotate(1turn);
          transform: rotate(1turn);
          opacity: 1
      }
  }
  
  @-webkit-keyframes mdc-checkbox-checked-indeterminate-mixedmark {
      0% {
          -webkit-animation-timing-function: mdc-animation-deceleration-curve-timing-function;
          animation-timing-function: mdc-animation-deceleration-curve-timing-function;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          opacity: 0
      }
  
      to {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  }
  
  @keyframes mdc-checkbox-checked-indeterminate-mixedmark {
      0% {
          -webkit-animation-timing-function: mdc-animation-deceleration-curve-timing-function;
          animation-timing-function: mdc-animation-deceleration-curve-timing-function;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          opacity: 0
      }
  
      to {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  }
  
  @-webkit-keyframes mdc-checkbox-indeterminate-checked-mixedmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.14,0,0,1);
          animation-timing-function: cubic-bezier(.14,0,0,1);
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  
      to {
          -webkit-transform: rotate(315deg);
          transform: rotate(315deg);
          opacity: 0
      }
  }
  
  @keyframes mdc-checkbox-indeterminate-checked-mixedmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.14,0,0,1);
          animation-timing-function: cubic-bezier(.14,0,0,1);
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  
      to {
          -webkit-transform: rotate(315deg);
          transform: rotate(315deg);
          opacity: 0
      }
  }
  
  @-webkit-keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          -webkit-transform: scaleX(1);
          transform: scaleX(1);
          opacity: 1
      }
  
      32.8%,to {
          -webkit-transform: scaleX(0);
          transform: scaleX(0);
          opacity: 0
      }
  }
  
  @keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          -webkit-transform: scaleX(1);
          transform: scaleX(1);
          opacity: 1
      }
  
      32.8%,to {
          -webkit-transform: scaleX(0);
          transform: scaleX(0);
          opacity: 0
      }
  }
  
  .mdc-checkbox {
      display: inline-block;
      position: relative;
      -ms-flex: 0 0 18px;
      flex: 0 0 18px;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      width: 18px;
      height: 18px;
      line-height: 0;
      white-space: nowrap;
      cursor: pointer;
      vertical-align: bottom;
      padding: 11px
  }
  
  .mdc-checkbox .mdc-checkbox__native-control:checked~.mdc-checkbox__background:before,.mdc-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-checkbox .mdc-checkbox__native-control:checked~.mdc-checkbox__background:before,.mdc-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple:before {
      opacity: .04
  }
  
  .mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple:before,.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-checkbox .mdc-checkbox__background {
      top: 11px;
      left: 11px
  }
  
  .mdc-checkbox .mdc-checkbox__background:before {
      top: -13px;
      left: -13px;
      width: 40px;
      height: 40px
  }
  
  .mdc-checkbox .mdc-checkbox__native-control {
      top: 0;
      right: 0;
      left: 0;
      width: 40px;
      height: 40px
  }
  
  .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background {
      border-color: rgba(0,0,0,.54);
      background-color: transparent
  }
  
  .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background {
      border-color: #018786;
      border-color: var(--mdc-theme-secondary,#018786);
      background-color: #018786;
      background-color: var(--mdc-theme-secondary,#018786)
  }
  
  @-webkit-keyframes mdc-checkbox-fade-in-background-u2nmdlf {
      0% {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  
      50% {
          border-color: #018786;
          border-color: var(--mdc-theme-secondary,#018786);
          background-color: #018786;
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  @keyframes mdc-checkbox-fade-in-background-u2nmdlf {
      0% {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  
      50% {
          border-color: #018786;
          border-color: var(--mdc-theme-secondary,#018786);
          background-color: #018786;
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  @-webkit-keyframes mdc-checkbox-fade-out-background-u2nmdlf {
      0%,80% {
          border-color: #018786;
          border-color: var(--mdc-theme-secondary,#018786);
          background-color: #018786;
          background-color: var(--mdc-theme-secondary,#018786)
      }
  
      to {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  }
  
  @keyframes mdc-checkbox-fade-out-background-u2nmdlf {
      0%,80% {
          border-color: #018786;
          border-color: var(--mdc-theme-secondary,#018786);
          background-color: #018786;
          background-color: var(--mdc-theme-secondary,#018786)
      }
  
      to {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  }
  
  .mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background {
      -webkit-animation-name: mdc-checkbox-fade-in-background-u2nmdlf;
      animation-name: mdc-checkbox-fade-in-background-u2nmdlf
  }
  
  .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background {
      -webkit-animation-name: mdc-checkbox-fade-out-background-u2nmdlf;
      animation-name: mdc-checkbox-fade-out-background-u2nmdlf
  }
  
  .mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate)~.mdc-checkbox__background {
      border-color: rgba(0,0,0,.26);
      background-color: transparent
  }
  
  .mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background {
      border-color: transparent;
      background-color: rgba(0,0,0,.26)
  }
  
  .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark {
      color: #fff
  }
  
  .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__mixedmark {
      border-color: #fff
  }
  
  .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark {
      color: #fff
  }
  
  .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark {
      border-color: #fff
  }
  
  @media screen and (-ms-high-contrast:active) {
      .mdc-checkbox__mixedmark {
          margin: 0 1px
      }
  }
  
  .mdc-checkbox--disabled {
      cursor: default;
      pointer-events: none
  }
  
  .mdc-checkbox__background {
      display: -ms-inline-flexbox;
      display: inline-flex;
      position: absolute;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      border: 2px solid currentColor;
      border-radius: 2px;
      background-color: transparent;
      pointer-events: none;
      will-change: background-color,border-color;
      -webkit-transition: background-color 90ms cubic-bezier(.4,0,.6,1) 0ms,border-color 90ms cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: background-color 90ms 0ms cubic-bezier(.4,0,.6,1),border-color 90ms 0ms cubic-bezier(.4,0,.6,1);
      transition: background-color 90ms cubic-bezier(.4,0,.6,1) 0ms,border-color 90ms cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-checkbox__background .mdc-checkbox__background:before {
      background-color: #000
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-checkbox__background .mdc-checkbox__background:before {
          background-color: var(--mdc-theme-on-surface,#000)
      }
  }
  
  .mdc-checkbox__checkmark {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      opacity: 0;
      -webkit-transition: opacity .18s cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: opacity .18s 0ms cubic-bezier(.4,0,.6,1);
      transition: opacity .18s cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-checkbox--upgraded .mdc-checkbox__checkmark {
      opacity: 1
  }
  
  .mdc-checkbox__checkmark-path {
      -webkit-transition: stroke-dashoffset .18s cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: stroke-dashoffset .18s 0ms cubic-bezier(.4,0,.6,1);
      transition: stroke-dashoffset .18s cubic-bezier(.4,0,.6,1) 0ms;
      stroke: currentColor;
      stroke-width: 3.12px;
      stroke-dashoffset: 29.7833385;
      stroke-dasharray: 29.7833385
  }
  
  .mdc-checkbox__mixedmark {
      width: 100%;
      height: 0;
      -webkit-transform: scaleX(0) rotate(0deg);
      -ms-transform: scaleX(0) rotate(0deg);
      transform: scaleX(0) rotate(0deg);
      border-width: 1px;
      border-style: solid;
      opacity: 0;
      -webkit-transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: opacity 90ms 0ms cubic-bezier(.4,0,.6,1),transform 90ms 0ms cubic-bezier(.4,0,.6,1);
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-checkbox--upgraded .mdc-checkbox__background,.mdc-checkbox--upgraded .mdc-checkbox__checkmark,.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,.mdc-checkbox--upgraded .mdc-checkbox__mixedmark {
      -webkit-transition: none!important;
      -o-transition: none!important;
      transition: none!important
  }
  
  .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background {
      -webkit-animation-duration: .18s;
      animation-duration: .18s;
      -webkit-animation-timing-function: linear;
      animation-timing-function: linear
  }
  
  .mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {
      -webkit-animation: mdc-checkbox-unchecked-checked-checkmark-path .18s linear 0s;
      animation: mdc-checkbox-unchecked-checked-checkmark-path .18s linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {
      -webkit-animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;
      animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {
      -webkit-animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;
      animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {
      -webkit-animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;
      animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {
      -webkit-animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;
      animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {
      -webkit-animation: mdc-checkbox-indeterminate-checked-checkmark .5s linear 0s;
      animation: mdc-checkbox-indeterminate-checked-checkmark .5s linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {
      -webkit-animation: mdc-checkbox-indeterminate-checked-mixedmark .5s linear 0s;
      animation: mdc-checkbox-indeterminate-checked-mixedmark .5s linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {
      -webkit-animation: mdc-checkbox-indeterminate-unchecked-mixedmark .3s linear 0s;
      animation: mdc-checkbox-indeterminate-unchecked-mixedmark .3s linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background {
      -webkit-transition: border-color 90ms cubic-bezier(0,0,.2,1) 0ms,background-color 90ms cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: border-color 90ms 0ms cubic-bezier(0,0,.2,1),background-color 90ms 0ms cubic-bezier(0,0,.2,1);
      transition: border-color 90ms cubic-bezier(0,0,.2,1) 0ms,background-color 90ms cubic-bezier(0,0,.2,1) 0ms
  }
  
  .mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path {
      stroke-dashoffset: 0
  }
  
  .mdc-checkbox__background:before {
      position: absolute;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: "";
      will-change: opacity,transform;
      -webkit-transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: opacity 90ms 0ms cubic-bezier(.4,0,.6,1),transform 90ms 0ms cubic-bezier(.4,0,.6,1);
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-checkbox__native-control:focus~.mdc-checkbox__background:before {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      opacity: .12;
      -webkit-transition: opacity 80ms cubic-bezier(0,0,.2,1) 0ms,-webkit-transform 80ms cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity 80ms cubic-bezier(0,0,.2,1) 0ms,-webkit-transform 80ms cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: opacity 80ms 0ms cubic-bezier(0,0,.2,1),transform 80ms 0ms cubic-bezier(0,0,.2,1);
      transition: opacity 80ms cubic-bezier(0,0,.2,1) 0ms,transform 80ms cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity 80ms cubic-bezier(0,0,.2,1) 0ms,transform 80ms cubic-bezier(0,0,.2,1) 0ms,-webkit-transform 80ms cubic-bezier(0,0,.2,1) 0ms
  }
  
  .mdc-checkbox__native-control {
      position: absolute;
      margin: 0;
      padding: 0;
      opacity: 0;
      cursor: inherit
  }
  
  .mdc-checkbox__native-control:disabled {
      cursor: default;
      pointer-events: none
  }
  
  .mdc-checkbox--touch {
      margin: 4px
  }
  
  .mdc-checkbox--touch .mdc-checkbox__native-control {
      top: -4px;
      right: -4px;
      left: -4px;
      width: 48px;
      height: 48px
  }
  
  .mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark {
      -webkit-transition: opacity .18s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .18s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity .18s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .18s cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: opacity .18s 0ms cubic-bezier(0,0,.2,1),transform .18s 0ms cubic-bezier(0,0,.2,1);
      transition: opacity .18s cubic-bezier(0,0,.2,1) 0ms,transform .18s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity .18s cubic-bezier(0,0,.2,1) 0ms,transform .18s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .18s cubic-bezier(0,0,.2,1) 0ms;
      opacity: 1
  }
  
  .mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__mixedmark {
      -webkit-transform: scaleX(1) rotate(-45deg);
      -ms-transform: scaleX(1) rotate(-45deg);
      transform: scaleX(1) rotate(-45deg)
  }
  
  .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark {
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      opacity: 0;
      -webkit-transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: opacity 90ms 0ms cubic-bezier(.4,0,.6,1),transform 90ms 0ms cubic-bezier(.4,0,.6,1);
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__mixedmark {
      -webkit-transform: scaleX(1) rotate(0deg);
      -ms-transform: scaleX(1) rotate(0deg);
      transform: scaleX(1) rotate(0deg);
      opacity: 1
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-checkbox {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-checkbox .mdc-checkbox__ripple:after,.mdc-checkbox .mdc-checkbox__ripple:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-checkbox .mdc-checkbox__ripple:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-checkbox.mdc-ripple-upgraded--unbounded .mdc-checkbox__ripple:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-checkbox.mdc-ripple-upgraded--foreground-activation .mdc-checkbox__ripple:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-checkbox.mdc-ripple-upgraded--foreground-deactivation .mdc-checkbox__ripple:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-checkbox .mdc-checkbox__ripple:after,.mdc-checkbox .mdc-checkbox__ripple:before {
      background-color: #000
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-checkbox .mdc-checkbox__ripple:after,.mdc-checkbox .mdc-checkbox__ripple:before {
          background-color: var(--mdc-theme-on-surface,#000)
      }
  }
  
  .mdc-checkbox:hover .mdc-checkbox__ripple:before {
      opacity: .04
  }
  
  .mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple:before,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-checkbox:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-checkbox:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-checkbox.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-checkbox .mdc-checkbox__ripple:after,.mdc-checkbox .mdc-checkbox__ripple:before {
      top: 0%;
      left: 0%;
      width: 100%;
      height: 100%
  }
  
  .mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple:after,.mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple:before {
      top: var(--mdc-ripple-top,0%);
      left: var(--mdc-ripple-left,0%);
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-checkbox__ripple {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none
  }
  
  .mdc-ripple-upgraded--background-focused .mdc-checkbox__background:before {
      content: none
  }
  
  .demo-checkbox {
      margin: 8px 16px
  }
  
  .mdc-chip__icon--leading,.mdc-chip__icon--trailing {
      color: rgba(0,0,0,.54)
  }
  
  .mdc-chip__icon--trailing:hover {
      color: rgba(0,0,0,.62)
  }
  
  .mdc-chip__icon--trailing:focus {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-chip__icon.mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden) {
      width: 20px;
      height: 20px;
      font-size: 20px
  }
  
  .mdc-chip__icon.mdc-chip__icon--trailing {
      width: 18px;
      height: 18px;
      font-size: 18px
  }
  
  .mdc-chip__icon--trailing {
      margin-left: 4px;
      margin-right: -4px
  }
  
  .mdc-chip__icon--trailing[dir=rtl],[dir=rtl] .mdc-chip__icon--trailing {
      margin-left: -4px;
      margin-right: 4px
  }
  
  .mdc-touch-target-wrapper {
      display: inline
  }
  
  .mdc-chip {
      background-color: #e0e0e0;
      color: rgba(0,0,0,.87);
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      height: 32px;
      display: -ms-inline-flexbox;
      display: inline-flex;
      position: relative;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 0 12px;
      border-width: 0;
      outline: none;
      cursor: pointer;
      -webkit-appearance: none
  }
  
  .mdc-chip,.mdc-chip .mdc-chip__ripple {
      border-radius: 16px
  }
  
  .mdc-chip:hover {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-chip.mdc-chip--selected .mdc-chip__checkmark,.mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden) {
      margin-left: -4px;
      margin-right: 4px
  }
  
  .mdc-chip.mdc-chip--selected .mdc-chip__checkmark[dir=rtl],.mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden)[dir=rtl],[dir=rtl] .mdc-chip.mdc-chip--selected .mdc-chip__checkmark,[dir=rtl] .mdc-chip .mdc-chip__icon--leading:not(.mdc-chip__icon--leading-hidden) {
      margin-left: 4px;
      margin-right: -4px
  }
  
  .mdc-chip::-moz-focus-inner {
      padding: 0;
      border: 0
  }
  
  .mdc-chip:hover {
      color: #000;
      color: var(--mdc-theme-on-surface,#000)
  }
  
  .mdc-chip .mdc-chip__touch {
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      height: 48px;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%)
  }
  
  .mdc-chip--exit {
      -webkit-transition: opacity 75ms cubic-bezier(.4,0,.2,1),width .15s cubic-bezier(0,0,.2,1),padding .1s linear,margin .1s linear;
      -o-transition: opacity 75ms cubic-bezier(.4,0,.2,1),width .15s cubic-bezier(0,0,.2,1),padding .1s linear,margin .1s linear;
      transition: opacity 75ms cubic-bezier(.4,0,.2,1),width .15s cubic-bezier(0,0,.2,1),padding .1s linear,margin .1s linear;
      opacity: 0
  }
  
  .mdc-chip__text {
      white-space: nowrap
  }
  
  .mdc-chip__icon {
      border-radius: 50%;
      outline: none;
      vertical-align: middle
  }
  
  .mdc-chip__checkmark {
      height: 20px
  }
  
  .mdc-chip__checkmark-path {
      -webkit-transition: stroke-dashoffset .15s cubic-bezier(.4,0,.6,1) 50ms;
      -o-transition: stroke-dashoffset .15s 50ms cubic-bezier(.4,0,.6,1);
      transition: stroke-dashoffset .15s cubic-bezier(.4,0,.6,1) 50ms;
      stroke-width: 2px;
      stroke-dashoffset: 29.7833385;
      stroke-dasharray: 29.7833385
  }
  
  .mdc-chip__text:focus {
      outline: none
  }
  
  .mdc-chip--selected .mdc-chip__checkmark-path {
      stroke-dashoffset: 0
  }
  
  .mdc-chip__icon--leading,.mdc-chip__icon--trailing {
      position: relative
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected {
      color: #6200ee;
      color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__icon--leading {
      color: rgba(98,0,238,.54)
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:hover {
      color: #6200ee;
      color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-chip-set--choice .mdc-chip .mdc-chip__checkmark-path {
      stroke: #6200ee;
      stroke: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-chip-set--choice .mdc-chip--selected {
      background-color: #fff;
      background-color: var(--mdc-theme-surface,#fff)
  }
  
  .mdc-chip__checkmark-svg {
      width: 0;
      height: 20px;
      -webkit-transition: width .15s cubic-bezier(.4,0,.2,1);
      -o-transition: width .15s cubic-bezier(.4,0,.2,1);
      transition: width .15s cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-chip--selected .mdc-chip__checkmark-svg {
      width: 20px
  }
  
  .mdc-chip-set--filter .mdc-chip__icon--leading {
      -webkit-transition: opacity 75ms linear;
      -o-transition: opacity 75ms linear;
      transition: opacity 75ms linear;
      -webkit-transition-delay: -50ms;
      -o-transition-delay: -50ms;
      transition-delay: -50ms;
      opacity: 1
  }
  
  .mdc-chip-set--filter .mdc-chip__icon--leading+.mdc-chip__checkmark {
      -webkit-transition: opacity 75ms linear;
      -o-transition: opacity 75ms linear;
      transition: opacity 75ms linear;
      -webkit-transition-delay: 80ms;
      -o-transition-delay: 80ms;
      transition-delay: 80ms;
      opacity: 0
  }
  
  .mdc-chip-set--filter .mdc-chip__icon--leading+.mdc-chip__checkmark .mdc-chip__checkmark-svg {
      -webkit-transition: width 0ms;
      -o-transition: width 0ms;
      transition: width 0ms
  }
  
  .mdc-chip-set--filter .mdc-chip--selected .mdc-chip__icon--leading {
      opacity: 0
  }
  
  .mdc-chip-set--filter .mdc-chip--selected .mdc-chip__icon--leading+.mdc-chip__checkmark {
      width: 0;
      opacity: 1
  }
  
  .mdc-chip-set--filter .mdc-chip__icon--leading-hidden.mdc-chip__icon--leading {
      width: 0;
      opacity: 0
  }
  
  .mdc-chip-set--filter .mdc-chip__icon--leading-hidden.mdc-chip__icon--leading+.mdc-chip__checkmark {
      width: 20px
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-chip {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-chip .mdc-chip__ripple:after,.mdc-chip .mdc-chip__ripple:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-chip .mdc-chip__ripple:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-chip.mdc-ripple-upgraded .mdc-chip__ripple:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-chip.mdc-ripple-upgraded .mdc-chip__ripple:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-chip.mdc-ripple-upgraded--unbounded .mdc-chip__ripple:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-chip.mdc-ripple-upgraded--foreground-activation .mdc-chip__ripple:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-chip.mdc-ripple-upgraded--foreground-deactivation .mdc-chip__ripple:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-chip .mdc-chip__ripple:after,.mdc-chip .mdc-chip__ripple:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .mdc-chip.mdc-ripple-upgraded .mdc-chip__ripple:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-chip .mdc-chip__ripple:after,.mdc-chip .mdc-chip__ripple:before {
      background-color: rgba(0,0,0,.87)
  }
  
  .mdc-chip:hover .mdc-chip__ripple:before {
      opacity: .04
  }
  
  .mdc-chip.mdc-ripple-upgraded--background-focused .mdc-chip__ripple:before,.mdc-chip.mdc-ripple-upgraded:focus-within .mdc-chip__ripple:before,.mdc-chip:not(.mdc-ripple-upgraded):focus-within .mdc-chip__ripple:before,.mdc-chip:not(.mdc-ripple-upgraded):focus .mdc-chip__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-chip:not(.mdc-ripple-upgraded) .mdc-chip__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-chip:not(.mdc-ripple-upgraded):active .mdc-chip__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-chip.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-chip .mdc-chip__ripple {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__ripple:before {
      opacity: .08
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__ripple:after,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__ripple:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__ripple:after,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected .mdc-chip__ripple:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:hover .mdc-chip__ripple:before {
      opacity: .12
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded--background-focused .mdc-chip__ripple:before,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded:focus-within .mdc-chip__ripple:before,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):focus-within .mdc-chip__ripple:before,.mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):focus .mdc-chip__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .2
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded) .mdc-chip__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected:not(.mdc-ripple-upgraded):active .mdc-chip__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .2
  }
  
  .mdc-chip-set--choice .mdc-chip.mdc-chip--selected.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.2
  }
  
  @-webkit-keyframes mdc-chip-entry {
      0% {
          -webkit-transform: scale(.8);
          transform: scale(.8);
          opacity: .4
      }
  
      to {
          -webkit-transform: scale(1);
          transform: scale(1);
          opacity: 1
      }
  }
  
  @keyframes mdc-chip-entry {
      0% {
          -webkit-transform: scale(.8);
          transform: scale(.8);
          opacity: .4
      }
  
      to {
          -webkit-transform: scale(1);
          transform: scale(1);
          opacity: 1
      }
  }
  
  .mdc-chip-set {
      padding: 4px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .mdc-chip-set .mdc-chip {
      margin: 4px
  }
  
  .mdc-chip-set .mdc-chip--touch {
      margin-top: 8px;
      margin-bottom: 8px
  }
  
  .mdc-chip-set--input .mdc-chip {
      -webkit-animation: mdc-chip-entry .1s cubic-bezier(0,0,.2,1);
      animation: mdc-chip-entry .1s cubic-bezier(0,0,.2,1)
  }
  
  .demo-chip-shaped,.demo-chip-shaped .mdc-chip__ripple {
      border-radius: 4px
  }
  
  .mdc-touch-target-wrapper {
      display: inline
  }
  
  @-webkit-keyframes mdc-checkbox-unchecked-checked-checkmark-path {
      0%,50% {
          stroke-dashoffset: 29.7833385
      }
  
      50% {
          -webkit-animation-timing-function: cubic-bezier(0,0,.2,1);
          animation-timing-function: cubic-bezier(0,0,.2,1)
      }
  
      to {
          stroke-dashoffset: 0
      }
  }
  
  @keyframes mdc-checkbox-unchecked-checked-checkmark-path {
      0%,50% {
          stroke-dashoffset: 29.7833385
      }
  
      50% {
          -webkit-animation-timing-function: cubic-bezier(0,0,.2,1);
          animation-timing-function: cubic-bezier(0,0,.2,1)
      }
  
      to {
          stroke-dashoffset: 0
      }
  }
  
  @-webkit-keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
      0%,68.2% {
          -webkit-transform: scaleX(0);
          transform: scaleX(0)
      }
  
      68.2% {
          -webkit-animation-timing-function: cubic-bezier(0,0,0,1);
          animation-timing-function: cubic-bezier(0,0,0,1)
      }
  
      to {
          -webkit-transform: scaleX(1);
          transform: scaleX(1)
      }
  }
  
  @keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
      0%,68.2% {
          -webkit-transform: scaleX(0);
          transform: scaleX(0)
      }
  
      68.2% {
          -webkit-animation-timing-function: cubic-bezier(0,0,0,1);
          animation-timing-function: cubic-bezier(0,0,0,1)
      }
  
      to {
          -webkit-transform: scaleX(1);
          transform: scaleX(1)
      }
  }
  
  @-webkit-keyframes mdc-checkbox-checked-unchecked-checkmark-path {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,1,1);
          animation-timing-function: cubic-bezier(.4,0,1,1);
          opacity: 1;
          stroke-dashoffset: 0
      }
  
      to {
          opacity: 0;
          stroke-dashoffset: -29.7833385
      }
  }
  
  @keyframes mdc-checkbox-checked-unchecked-checkmark-path {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,1,1);
          animation-timing-function: cubic-bezier(.4,0,1,1);
          opacity: 1;
          stroke-dashoffset: 0
      }
  
      to {
          opacity: 0;
          stroke-dashoffset: -29.7833385
      }
  }
  
  @-webkit-keyframes mdc-checkbox-checked-indeterminate-checkmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(0,0,.2,1);
          animation-timing-function: cubic-bezier(0,0,.2,1);
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  
      to {
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          opacity: 0
      }
  }
  
  @keyframes mdc-checkbox-checked-indeterminate-checkmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(0,0,.2,1);
          animation-timing-function: cubic-bezier(0,0,.2,1);
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  
      to {
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          opacity: 0
      }
  }
  
  @-webkit-keyframes mdc-checkbox-indeterminate-checked-checkmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.14,0,0,1);
          animation-timing-function: cubic-bezier(.14,0,0,1);
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          opacity: 0
      }
  
      to {
          -webkit-transform: rotate(1turn);
          transform: rotate(1turn);
          opacity: 1
      }
  }
  
  @keyframes mdc-checkbox-indeterminate-checked-checkmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.14,0,0,1);
          animation-timing-function: cubic-bezier(.14,0,0,1);
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          opacity: 0
      }
  
      to {
          -webkit-transform: rotate(1turn);
          transform: rotate(1turn);
          opacity: 1
      }
  }
  
  @-webkit-keyframes mdc-checkbox-checked-indeterminate-mixedmark {
      0% {
          -webkit-animation-timing-function: mdc-animation-deceleration-curve-timing-function;
          animation-timing-function: mdc-animation-deceleration-curve-timing-function;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          opacity: 0
      }
  
      to {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  }
  
  @keyframes mdc-checkbox-checked-indeterminate-mixedmark {
      0% {
          -webkit-animation-timing-function: mdc-animation-deceleration-curve-timing-function;
          animation-timing-function: mdc-animation-deceleration-curve-timing-function;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          opacity: 0
      }
  
      to {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  }
  
  @-webkit-keyframes mdc-checkbox-indeterminate-checked-mixedmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.14,0,0,1);
          animation-timing-function: cubic-bezier(.14,0,0,1);
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  
      to {
          -webkit-transform: rotate(315deg);
          transform: rotate(315deg);
          opacity: 0
      }
  }
  
  @keyframes mdc-checkbox-indeterminate-checked-mixedmark {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.14,0,0,1);
          animation-timing-function: cubic-bezier(.14,0,0,1);
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          opacity: 1
      }
  
      to {
          -webkit-transform: rotate(315deg);
          transform: rotate(315deg);
          opacity: 0
      }
  }
  
  @-webkit-keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          -webkit-transform: scaleX(1);
          transform: scaleX(1);
          opacity: 1
      }
  
      32.8%,to {
          -webkit-transform: scaleX(0);
          transform: scaleX(0);
          opacity: 0
      }
  }
  
  @keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          -webkit-transform: scaleX(1);
          transform: scaleX(1);
          opacity: 1
      }
  
      32.8%,to {
          -webkit-transform: scaleX(0);
          transform: scaleX(0);
          opacity: 0
      }
  }
  
  .mdc-checkbox {
      display: inline-block;
      position: relative;
      -ms-flex: 0 0 18px;
      flex: 0 0 18px;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      width: 18px;
      height: 18px;
      line-height: 0;
      white-space: nowrap;
      cursor: pointer;
      vertical-align: bottom;
      padding: 11px
  }
  
  .mdc-checkbox .mdc-checkbox__native-control:checked~.mdc-checkbox__background:before,.mdc-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-checkbox .mdc-checkbox__native-control:checked~.mdc-checkbox__background:before,.mdc-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple:before {
      opacity: .04
  }
  
  .mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple:before,.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-checkbox .mdc-checkbox__background {
      top: 11px;
      left: 11px
  }
  
  .mdc-checkbox .mdc-checkbox__background:before {
      top: -13px;
      left: -13px;
      width: 40px;
      height: 40px
  }
  
  .mdc-checkbox .mdc-checkbox__native-control {
      top: 0;
      right: 0;
      left: 0;
      width: 40px;
      height: 40px
  }
  
  .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background {
      border-color: rgba(0,0,0,.54);
      background-color: transparent
  }
  
  .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background {
      border-color: #018786;
      border-color: var(--mdc-theme-secondary,#018786);
      background-color: #018786;
      background-color: var(--mdc-theme-secondary,#018786)
  }
  
  @-webkit-keyframes mdc-checkbox-fade-in-background-u2nmdls {
      0% {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  
      50% {
          border-color: #018786;
          border-color: var(--mdc-theme-secondary,#018786);
          background-color: #018786;
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  @keyframes mdc-checkbox-fade-in-background-u2nmdls {
      0% {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  
      50% {
          border-color: #018786;
          border-color: var(--mdc-theme-secondary,#018786);
          background-color: #018786;
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  @-webkit-keyframes mdc-checkbox-fade-out-background-u2nmdls {
      0%,80% {
          border-color: #018786;
          border-color: var(--mdc-theme-secondary,#018786);
          background-color: #018786;
          background-color: var(--mdc-theme-secondary,#018786)
      }
  
      to {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  }
  
  @keyframes mdc-checkbox-fade-out-background-u2nmdls {
      0%,80% {
          border-color: #018786;
          border-color: var(--mdc-theme-secondary,#018786);
          background-color: #018786;
          background-color: var(--mdc-theme-secondary,#018786)
      }
  
      to {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  }
  
  .mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background {
      -webkit-animation-name: mdc-checkbox-fade-in-background-u2nmdls;
      animation-name: mdc-checkbox-fade-in-background-u2nmdls
  }
  
  .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background {
      -webkit-animation-name: mdc-checkbox-fade-out-background-u2nmdls;
      animation-name: mdc-checkbox-fade-out-background-u2nmdls
  }
  
  .mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate)~.mdc-checkbox__background {
      border-color: rgba(0,0,0,.26);
      background-color: transparent
  }
  
  .mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background {
      border-color: transparent;
      background-color: rgba(0,0,0,.26)
  }
  
  .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark {
      color: #fff
  }
  
  .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__mixedmark {
      border-color: #fff
  }
  
  .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark {
      color: #fff
  }
  
  .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark {
      border-color: #fff
  }
  
  @media screen and (-ms-high-contrast:active) {
      .mdc-checkbox__mixedmark {
          margin: 0 1px
      }
  }
  
  .mdc-checkbox--disabled {
      cursor: default;
      pointer-events: none
  }
  
  .mdc-checkbox__background {
      display: -ms-inline-flexbox;
      display: inline-flex;
      position: absolute;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      border: 2px solid currentColor;
      border-radius: 2px;
      background-color: transparent;
      pointer-events: none;
      will-change: background-color,border-color;
      -webkit-transition: background-color 90ms cubic-bezier(.4,0,.6,1) 0ms,border-color 90ms cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: background-color 90ms 0ms cubic-bezier(.4,0,.6,1),border-color 90ms 0ms cubic-bezier(.4,0,.6,1);
      transition: background-color 90ms cubic-bezier(.4,0,.6,1) 0ms,border-color 90ms cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-checkbox__background .mdc-checkbox__background:before {
      background-color: #000
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-checkbox__background .mdc-checkbox__background:before {
          background-color: var(--mdc-theme-on-surface,#000)
      }
  }
  
  .mdc-checkbox__checkmark {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      opacity: 0;
      -webkit-transition: opacity .18s cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: opacity .18s 0ms cubic-bezier(.4,0,.6,1);
      transition: opacity .18s cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-checkbox--upgraded .mdc-checkbox__checkmark {
      opacity: 1
  }
  
  .mdc-checkbox__checkmark-path {
      -webkit-transition: stroke-dashoffset .18s cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: stroke-dashoffset .18s 0ms cubic-bezier(.4,0,.6,1);
      transition: stroke-dashoffset .18s cubic-bezier(.4,0,.6,1) 0ms;
      stroke: currentColor;
      stroke-width: 3.12px;
      stroke-dashoffset: 29.7833385;
      stroke-dasharray: 29.7833385
  }
  
  .mdc-checkbox__mixedmark {
      width: 100%;
      height: 0;
      -webkit-transform: scaleX(0) rotate(0deg);
      -ms-transform: scaleX(0) rotate(0deg);
      transform: scaleX(0) rotate(0deg);
      border-width: 1px;
      border-style: solid;
      opacity: 0;
      -webkit-transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: opacity 90ms 0ms cubic-bezier(.4,0,.6,1),transform 90ms 0ms cubic-bezier(.4,0,.6,1);
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-checkbox--upgraded .mdc-checkbox__background,.mdc-checkbox--upgraded .mdc-checkbox__checkmark,.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,.mdc-checkbox--upgraded .mdc-checkbox__mixedmark {
      -webkit-transition: none!important;
      -o-transition: none!important;
      transition: none!important
  }
  
  .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background {
      -webkit-animation-duration: .18s;
      animation-duration: .18s;
      -webkit-animation-timing-function: linear;
      animation-timing-function: linear
  }
  
  .mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {
      -webkit-animation: mdc-checkbox-unchecked-checked-checkmark-path .18s linear 0s;
      animation: mdc-checkbox-unchecked-checked-checkmark-path .18s linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {
      -webkit-animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;
      animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {
      -webkit-animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;
      animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {
      -webkit-animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;
      animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {
      -webkit-animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;
      animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {
      -webkit-animation: mdc-checkbox-indeterminate-checked-checkmark .5s linear 0s;
      animation: mdc-checkbox-indeterminate-checked-checkmark .5s linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {
      -webkit-animation: mdc-checkbox-indeterminate-checked-mixedmark .5s linear 0s;
      animation: mdc-checkbox-indeterminate-checked-mixedmark .5s linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {
      -webkit-animation: mdc-checkbox-indeterminate-unchecked-mixedmark .3s linear 0s;
      animation: mdc-checkbox-indeterminate-unchecked-mixedmark .3s linear 0s;
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background {
      -webkit-transition: border-color 90ms cubic-bezier(0,0,.2,1) 0ms,background-color 90ms cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: border-color 90ms 0ms cubic-bezier(0,0,.2,1),background-color 90ms 0ms cubic-bezier(0,0,.2,1);
      transition: border-color 90ms cubic-bezier(0,0,.2,1) 0ms,background-color 90ms cubic-bezier(0,0,.2,1) 0ms
  }
  
  .mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path {
      stroke-dashoffset: 0
  }
  
  .mdc-checkbox__background:before {
      position: absolute;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: "";
      will-change: opacity,transform;
      -webkit-transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: opacity 90ms 0ms cubic-bezier(.4,0,.6,1),transform 90ms 0ms cubic-bezier(.4,0,.6,1);
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-checkbox__native-control:focus~.mdc-checkbox__background:before {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      opacity: .12;
      -webkit-transition: opacity 80ms cubic-bezier(0,0,.2,1) 0ms,-webkit-transform 80ms cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity 80ms cubic-bezier(0,0,.2,1) 0ms,-webkit-transform 80ms cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: opacity 80ms 0ms cubic-bezier(0,0,.2,1),transform 80ms 0ms cubic-bezier(0,0,.2,1);
      transition: opacity 80ms cubic-bezier(0,0,.2,1) 0ms,transform 80ms cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity 80ms cubic-bezier(0,0,.2,1) 0ms,transform 80ms cubic-bezier(0,0,.2,1) 0ms,-webkit-transform 80ms cubic-bezier(0,0,.2,1) 0ms
  }
  
  .mdc-checkbox__native-control {
      position: absolute;
      margin: 0;
      padding: 0;
      opacity: 0;
      cursor: inherit
  }
  
  .mdc-checkbox__native-control:disabled {
      cursor: default;
      pointer-events: none
  }
  
  .mdc-checkbox--touch {
      margin: 4px
  }
  
  .mdc-checkbox--touch .mdc-checkbox__native-control {
      top: -4px;
      right: -4px;
      left: -4px;
      width: 48px;
      height: 48px
  }
  
  .mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark {
      -webkit-transition: opacity .18s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .18s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity .18s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .18s cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: opacity .18s 0ms cubic-bezier(0,0,.2,1),transform .18s 0ms cubic-bezier(0,0,.2,1);
      transition: opacity .18s cubic-bezier(0,0,.2,1) 0ms,transform .18s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity .18s cubic-bezier(0,0,.2,1) 0ms,transform .18s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .18s cubic-bezier(0,0,.2,1) 0ms;
      opacity: 1
  }
  
  .mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__mixedmark {
      -webkit-transform: scaleX(1) rotate(-45deg);
      -ms-transform: scaleX(1) rotate(-45deg);
      transform: scaleX(1) rotate(-45deg)
  }
  
  .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark {
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      opacity: 0;
      -webkit-transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: opacity 90ms 0ms cubic-bezier(.4,0,.6,1),transform 90ms 0ms cubic-bezier(.4,0,.6,1);
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms;
      transition: opacity 90ms cubic-bezier(.4,0,.6,1) 0ms,transform 90ms cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform 90ms cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__mixedmark {
      -webkit-transform: scaleX(1) rotate(0deg);
      -ms-transform: scaleX(1) rotate(0deg);
      transform: scaleX(1) rotate(0deg);
      opacity: 1
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-checkbox {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-checkbox .mdc-checkbox__ripple:after,.mdc-checkbox .mdc-checkbox__ripple:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-checkbox .mdc-checkbox__ripple:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-checkbox.mdc-ripple-upgraded--unbounded .mdc-checkbox__ripple:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-checkbox.mdc-ripple-upgraded--foreground-activation .mdc-checkbox__ripple:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-checkbox.mdc-ripple-upgraded--foreground-deactivation .mdc-checkbox__ripple:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-checkbox .mdc-checkbox__ripple:after,.mdc-checkbox .mdc-checkbox__ripple:before {
      background-color: #000
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-checkbox .mdc-checkbox__ripple:after,.mdc-checkbox .mdc-checkbox__ripple:before {
          background-color: var(--mdc-theme-on-surface,#000)
      }
  }
  
  .mdc-checkbox:hover .mdc-checkbox__ripple:before {
      opacity: .04
  }
  
  .mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple:before,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-checkbox:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-checkbox:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-checkbox.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-checkbox .mdc-checkbox__ripple:after,.mdc-checkbox .mdc-checkbox__ripple:before {
      top: 0%;
      left: 0%;
      width: 100%;
      height: 100%
  }
  
  .mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple:after,.mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple:before {
      top: var(--mdc-ripple-top,0%);
      left: var(--mdc-ripple-left,0%);
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-checkbox.mdc-ripple-upgraded .mdc-checkbox__ripple:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-checkbox__ripple {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none
  }
  
  .mdc-ripple-upgraded--background-focused .mdc-checkbox__background:before {
      content: none
  }
  
  .mdc-data-table__content {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit
  }
  
  .mdc-data-table {
      background-color: #fff;
      background-color: var(--mdc-theme-surface,#fff);
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,.12);
      -webkit-overflow-scrolling: touch;
      display: -ms-inline-flexbox;
      display: inline-flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      overflow-x: auto
  }
  
  .mdc-data-table__header-row,.mdc-data-table__row {
      background-color: inherit
  }
  
  .mdc-data-table__row--selected {
      background-color: rgba(98,0,238,.04)
  }
  
  .mdc-data-table__row {
      border-top-color: rgba(0,0,0,.12);
      border-top-width: 1px;
      border-top-style: solid
  }
  
  .mdc-data-table__row:not(.mdc-data-table__row--selected):hover {
      background-color: rgba(0,0,0,.04)
  }
  
  .mdc-data-table__cell,.mdc-data-table__header-cell {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-data-table__cell {
      height: 52px
  }
  
  .mdc-data-table__header-cell {
      height: 56px
  }
  
  .mdc-data-table__cell,.mdc-data-table__header-cell {
      padding-right: 16px;
      padding-left: 16px
  }
  
  .mdc-data-table__cell--checkbox,.mdc-data-table__header-cell--checkbox {
      padding-left: 16px;
      padding-right: 0
  }
  
  .mdc-data-table__cell--checkbox[dir=rtl],.mdc-data-table__header-cell--checkbox[dir=rtl],[dir=rtl] .mdc-data-table__cell--checkbox,[dir=rtl] .mdc-data-table__header-cell--checkbox {
      padding-left: 0;
      padding-right: 16px
  }
  
  .mdc-data-table__table {
      min-width: 100%;
      border: 0;
      white-space: nowrap;
      border-collapse: collapse;
      table-layout: fixed
  }
  
  .mdc-data-table__cell {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      overflow: hidden
  }
  
  .mdc-data-table__cell--numeric {
      text-align: right
  }
  
  .mdc-data-table__cell--numeric[dir=rtl],[dir=rtl] .mdc-data-table__cell--numeric {
      text-align: left
  }
  
  .mdc-data-table__header-cell {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.375rem;
      font-weight: 500;
      letter-spacing: .0071428571em;
      text-decoration: inherit;
      text-transform: inherit;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: left;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      overflow: hidden
  }
  
  .mdc-data-table__header-cell--numeric,.mdc-data-table__header-cell[dir=rtl],[dir=rtl] .mdc-data-table__header-cell {
      text-align: right
  }
  
  .mdc-data-table__header-cell--numeric[dir=rtl],[dir=rtl] .mdc-data-table__header-cell--numeric {
      text-align: left
  }
  
  .mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:checked~.mdc-checkbox__background:before,.mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background:before,.mdc-data-table__row-checkbox .mdc-checkbox__native-control:checked~.mdc-checkbox__background:before,.mdc-data-table__row-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:checked~.mdc-checkbox__background:before,.mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background:before,.mdc-data-table__row-checkbox .mdc-checkbox__native-control:checked~.mdc-checkbox__background:before,.mdc-data-table__row-checkbox .mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .mdc-data-table__header-row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-data-table__header-row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:before,.mdc-data-table__row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-data-table__row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-data-table__header-row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-data-table__header-row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:before,.mdc-data-table__row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-data-table__row-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .mdc-data-table__header-row-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple:before,.mdc-data-table__row-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple:before {
      opacity: .04
  }
  
  .mdc-data-table__header-row-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple:before,.mdc-data-table__header-row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple:before,.mdc-data-table__row-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple:before,.mdc-data-table__row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-data-table__header-row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple:after,.mdc-data-table__row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-data-table__header-row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple:after,.mdc-data-table__row-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-data-table__header-row-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded,.mdc-data-table__row-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-data-table__header-row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-data-table__header-row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:before,.mdc-data-table__row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-data-table__row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-data-table__header-row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-data-table__header-row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:before,.mdc-data-table__row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:after,.mdc-data-table__row-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background,.mdc-data-table__row-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate)~.mdc-checkbox__background {
      border-color: rgba(0,0,0,.54);
      background-color: transparent
  }
  
  .mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-data-table__header-row-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-data-table__row-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-data-table__row-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background {
      border-color: #6200ee;
      border-color: var(--mdc-theme-primary,#6200ee);
      background-color: #6200ee;
      background-color: var(--mdc-theme-primary,#6200ee)
  }
  
  @-webkit-keyframes mdc-checkbox-fade-in-background-u2nmdm2 {
      0% {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  
      50% {
          border-color: #6200ee;
          border-color: var(--mdc-theme-primary,#6200ee);
          background-color: #6200ee;
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  @keyframes mdc-checkbox-fade-in-background-u2nmdm2 {
      0% {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  
      50% {
          border-color: #6200ee;
          border-color: var(--mdc-theme-primary,#6200ee);
          background-color: #6200ee;
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  @-webkit-keyframes mdc-checkbox-fade-out-background-u2nmdm2 {
      0%,80% {
          border-color: #6200ee;
          border-color: var(--mdc-theme-primary,#6200ee);
          background-color: #6200ee;
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  
      to {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  }
  
  @keyframes mdc-checkbox-fade-out-background-u2nmdm2 {
      0%,80% {
          border-color: #6200ee;
          border-color: var(--mdc-theme-primary,#6200ee);
          background-color: #6200ee;
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  
      to {
          border-color: rgba(0,0,0,.54);
          background-color: transparent
      }
  }
  
  .mdc-data-table__header-row-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-data-table__header-row-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-data-table__row-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-data-table__row-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background {
      -webkit-animation-name: mdc-checkbox-fade-in-background-u2nmdm2;
      animation-name: mdc-checkbox-fade-in-background-u2nmdm2
  }
  
  .mdc-data-table__header-row-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-data-table__header-row-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-data-table__row-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-data-table__row-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background {
      -webkit-animation-name: mdc-checkbox-fade-out-background-u2nmdm2;
      animation-name: mdc-checkbox-fade-out-background-u2nmdm2
  }
  
  .demo-data-table-header {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1rem;
      line-height: 1.75rem;
      font-weight: 400;
      letter-spacing: .009375em;
      text-decoration: inherit;
      text-transform: inherit;
      margin-top: 32px
  }
  
  .mdc-dialog,.mdc-dialog__scrim {
      position: fixed;
      top: 0;
      left: 0;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 100%
  }
  
  .mdc-dialog {
      display: none;
      z-index: 7
  }
  
  .mdc-dialog .mdc-dialog__surface {
      background-color: #fff;
      background-color: var(--mdc-theme-surface,#fff)
  }
  
  .mdc-dialog .mdc-dialog__scrim {
      background-color: rgba(0,0,0,.32)
  }
  
  .mdc-dialog .mdc-dialog__title {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-dialog .mdc-dialog__content {
      color: rgba(0,0,0,.6)
  }
  
  .mdc-dialog.mdc-dialog--scrollable .mdc-dialog__actions,.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__title {
      border-color: rgba(0,0,0,.12)
  }
  
  .mdc-dialog .mdc-dialog__surface {
      min-width: 280px
  }
  
  @media (max-width: 592px) {
      .mdc-dialog .mdc-dialog__surface {
          max-width:calc(100vw - 32px)
      }
  }
  
  @media (min-width: 592px) {
      .mdc-dialog .mdc-dialog__surface {
          max-width:560px
      }
  }
  
  .mdc-dialog .mdc-dialog__surface {
      max-height: calc(100% - 32px)
  }
  
  .mdc-dialog .mdc-dialog__surface {
      border-radius: 4px
  }
  
  .mdc-dialog__scrim {
      opacity: 0;
      z-index: -1
  }
  
  .mdc-dialog__container {
      -ms-flex-direction: row;
      flex-direction: row;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: distribute;
      justify-content: space-around;
      height: 100%;
      -webkit-transform: scale(.8);
      -ms-transform: scale(.8);
      transform: scale(.8);
      opacity: 0;
      pointer-events: none
  }
  
  .mdc-dialog__container,.mdc-dialog__surface {
      display: -ms-flexbox;
      display: flex;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .mdc-dialog__surface {
      -webkit-box-shadow: 0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);
      box-shadow: 0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-positive: 0;
      flex-grow: 0;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      max-width: 100%;
      max-height: 100%;
      pointer-events: auto;
      overflow-y: auto
  }
  
  .mdc-dialog[dir=rtl] .mdc-dialog__surface,[dir=rtl] .mdc-dialog .mdc-dialog__surface {
      text-align: right
  }
  
  .mdc-dialog__title {
      margin-top: 0;
      line-height: normal;
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 500;
      letter-spacing: .0125em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      position: relative;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      padding: 0 24px 9px;
      border-bottom: 1px solid transparent
  }
  
  .mdc-dialog__title:before {
      display: inline-block;
      width: 0;
      height: 40px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-dialog[dir=rtl] .mdc-dialog__title,[dir=rtl] .mdc-dialog .mdc-dialog__title {
      text-align: right
  }
  
  .mdc-dialog--scrollable .mdc-dialog__title {
      padding-bottom: 15px
  }
  
  .mdc-dialog__content {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 400;
      letter-spacing: .03125em;
      text-decoration: inherit;
      text-transform: inherit;
      -ms-flex-positive: 1;
      flex-grow: 1;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      padding: 20px 24px;
      overflow: auto;
      -webkit-overflow-scrolling: touch
  }
  
  .mdc-dialog__content>:first-child {
      margin-top: 0
  }
  
  .mdc-dialog__content>:last-child {
      margin-bottom: 0
  }
  
  .mdc-dialog__title+.mdc-dialog__content {
      padding-top: 0
  }
  
  .mdc-dialog--scrollable .mdc-dialog__content {
      padding-top: 8px;
      padding-bottom: 8px
  }
  
  .mdc-dialog__content .mdc-list:first-child:last-child {
      padding: 6px 0 0
  }
  
  .mdc-dialog--scrollable .mdc-dialog__content .mdc-list:first-child:last-child {
      padding: 0
  }
  
  .mdc-dialog__actions {
      display: -ms-flexbox;
      display: flex;
      position: relative;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: end;
      justify-content: flex-end;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      min-height: 52px;
      margin: 0;
      padding: 8px;
      border-top: 1px solid transparent
  }
  
  .mdc-dialog--stacked .mdc-dialog__actions {
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-align: end;
      align-items: flex-end
  }
  
  .mdc-dialog__button {
      margin-left: 8px;
      margin-right: 0;
      max-width: 100%;
      text-align: right
  }
  
  .mdc-dialog__button[dir=rtl],[dir=rtl] .mdc-dialog__button {
      margin-left: 0;
      margin-right: 8px
  }
  
  .mdc-dialog__button:first-child,.mdc-dialog__button:first-child[dir=rtl],[dir=rtl] .mdc-dialog__button:first-child {
      margin-left: 0;
      margin-right: 0
  }
  
  .mdc-dialog[dir=rtl] .mdc-dialog__button,[dir=rtl] .mdc-dialog .mdc-dialog__button {
      text-align: left
  }
  
  .mdc-dialog--stacked .mdc-dialog__button:not(:first-child) {
      margin-top: 12px
  }
  
  .mdc-dialog--closing,.mdc-dialog--open,.mdc-dialog--opening {
      display: -ms-flexbox;
      display: flex
  }
  
  .mdc-dialog--opening .mdc-dialog__scrim {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-dialog--opening .mdc-dialog__container {
      -webkit-transition: opacity 75ms linear,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity 75ms linear,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: opacity 75ms linear,transform .15s 0ms cubic-bezier(0,0,.2,1);
      transition: opacity 75ms linear,transform .15s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity 75ms linear,transform .15s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms
  }
  
  .mdc-dialog--closing .mdc-dialog__container,.mdc-dialog--closing .mdc-dialog__scrim {
      -webkit-transition: opacity 75ms linear;
      -o-transition: opacity 75ms linear;
      transition: opacity 75ms linear
  }
  
  .mdc-dialog--closing .mdc-dialog__container {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1)
  }
  
  .mdc-dialog--open .mdc-dialog__scrim {
      opacity: 1
  }
  
  .mdc-dialog--open .mdc-dialog__container {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      opacity: 1
  }
  
  .mdc-dialog-scroll-lock {
      overflow: hidden
  }
  
  .hero-demo {
      position: relative;
      z-index: 0
  }
  
  .mdc-dialog__content a:focus {
      outline: 1px solid currentColor
  }
  
  .drawer-demos-display {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      min-height: 400px
  }
  
  .drawer-demo {
      display: inline-block;
      -ms-flex: 1 1 80%;
      flex: 1 1 80%;
      -ms-flex-pack: distribute;
      justify-content: space-around;
      min-height: 400px;
      min-width: 400px;
      padding: 15px
  }
  
  .drawer-iframe {
      width: 100%;
      height: 400px
  }
  
  .mdc-elevation--z0 {
      -webkit-box-shadow: 0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);
      box-shadow: 0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z1 {
      -webkit-box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12);
      box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z2 {
      -webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z3 {
      -webkit-box-shadow: 0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12);
      box-shadow: 0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z4 {
      -webkit-box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);
      box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z5 {
      -webkit-box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px 0 rgba(0,0,0,.14),0 1px 14px 0 rgba(0,0,0,.12);
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px 0 rgba(0,0,0,.14),0 1px 14px 0 rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z6 {
      -webkit-box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z7 {
      -webkit-box-shadow: 0 4px 5px -2px rgba(0,0,0,.2),0 7px 10px 1px rgba(0,0,0,.14),0 2px 16px 1px rgba(0,0,0,.12);
      box-shadow: 0 4px 5px -2px rgba(0,0,0,.2),0 7px 10px 1px rgba(0,0,0,.14),0 2px 16px 1px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z8 {
      -webkit-box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);
      box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z9 {
      -webkit-box-shadow: 0 5px 6px -3px rgba(0,0,0,.2),0 9px 12px 1px rgba(0,0,0,.14),0 3px 16px 2px rgba(0,0,0,.12);
      box-shadow: 0 5px 6px -3px rgba(0,0,0,.2),0 9px 12px 1px rgba(0,0,0,.14),0 3px 16px 2px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z10 {
      -webkit-box-shadow: 0 6px 6px -3px rgba(0,0,0,.2),0 10px 14px 1px rgba(0,0,0,.14),0 4px 18px 3px rgba(0,0,0,.12);
      box-shadow: 0 6px 6px -3px rgba(0,0,0,.2),0 10px 14px 1px rgba(0,0,0,.14),0 4px 18px 3px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z11 {
      -webkit-box-shadow: 0 6px 7px -4px rgba(0,0,0,.2),0 11px 15px 1px rgba(0,0,0,.14),0 4px 20px 3px rgba(0,0,0,.12);
      box-shadow: 0 6px 7px -4px rgba(0,0,0,.2),0 11px 15px 1px rgba(0,0,0,.14),0 4px 20px 3px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z12 {
      -webkit-box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12);
      box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z13 {
      -webkit-box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 13px 19px 2px rgba(0,0,0,.14),0 5px 24px 4px rgba(0,0,0,.12);
      box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 13px 19px 2px rgba(0,0,0,.14),0 5px 24px 4px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z14 {
      -webkit-box-shadow: 0 7px 9px -4px rgba(0,0,0,.2),0 14px 21px 2px rgba(0,0,0,.14),0 5px 26px 4px rgba(0,0,0,.12);
      box-shadow: 0 7px 9px -4px rgba(0,0,0,.2),0 14px 21px 2px rgba(0,0,0,.14),0 5px 26px 4px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z15 {
      -webkit-box-shadow: 0 8px 9px -5px rgba(0,0,0,.2),0 15px 22px 2px rgba(0,0,0,.14),0 6px 28px 5px rgba(0,0,0,.12);
      box-shadow: 0 8px 9px -5px rgba(0,0,0,.2),0 15px 22px 2px rgba(0,0,0,.14),0 6px 28px 5px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z16 {
      -webkit-box-shadow: 0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);
      box-shadow: 0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z17 {
      -webkit-box-shadow: 0 8px 11px -5px rgba(0,0,0,.2),0 17px 26px 2px rgba(0,0,0,.14),0 6px 32px 5px rgba(0,0,0,.12);
      box-shadow: 0 8px 11px -5px rgba(0,0,0,.2),0 17px 26px 2px rgba(0,0,0,.14),0 6px 32px 5px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z18 {
      -webkit-box-shadow: 0 9px 11px -5px rgba(0,0,0,.2),0 18px 28px 2px rgba(0,0,0,.14),0 7px 34px 6px rgba(0,0,0,.12);
      box-shadow: 0 9px 11px -5px rgba(0,0,0,.2),0 18px 28px 2px rgba(0,0,0,.14),0 7px 34px 6px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z19 {
      -webkit-box-shadow: 0 9px 12px -6px rgba(0,0,0,.2),0 19px 29px 2px rgba(0,0,0,.14),0 7px 36px 6px rgba(0,0,0,.12);
      box-shadow: 0 9px 12px -6px rgba(0,0,0,.2),0 19px 29px 2px rgba(0,0,0,.14),0 7px 36px 6px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z20 {
      -webkit-box-shadow: 0 10px 13px -6px rgba(0,0,0,.2),0 20px 31px 3px rgba(0,0,0,.14),0 8px 38px 7px rgba(0,0,0,.12);
      box-shadow: 0 10px 13px -6px rgba(0,0,0,.2),0 20px 31px 3px rgba(0,0,0,.14),0 8px 38px 7px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z21 {
      -webkit-box-shadow: 0 10px 13px -6px rgba(0,0,0,.2),0 21px 33px 3px rgba(0,0,0,.14),0 8px 40px 7px rgba(0,0,0,.12);
      box-shadow: 0 10px 13px -6px rgba(0,0,0,.2),0 21px 33px 3px rgba(0,0,0,.14),0 8px 40px 7px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z22 {
      -webkit-box-shadow: 0 10px 14px -6px rgba(0,0,0,.2),0 22px 35px 3px rgba(0,0,0,.14),0 8px 42px 7px rgba(0,0,0,.12);
      box-shadow: 0 10px 14px -6px rgba(0,0,0,.2),0 22px 35px 3px rgba(0,0,0,.14),0 8px 42px 7px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z23 {
      -webkit-box-shadow: 0 11px 14px -7px rgba(0,0,0,.2),0 23px 36px 3px rgba(0,0,0,.14),0 9px 44px 8px rgba(0,0,0,.12);
      box-shadow: 0 11px 14px -7px rgba(0,0,0,.2),0 23px 36px 3px rgba(0,0,0,.14),0 9px 44px 8px rgba(0,0,0,.12)
  }
  
  .mdc-elevation--z24 {
      -webkit-box-shadow: 0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);
      box-shadow: 0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12)
  }
  
  .mdc-elevation-transition {
      -webkit-transition: -webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);
      transition: -webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);
      -o-transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
      transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
      transition: box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);
      will-change: box-shadow
  }
  
  .elevation-demo-surface {
      display: -ms-inline-flexbox;
      display: inline-flex;
      -ms-flex-pack: distribute;
      justify-content: space-around;
      min-height: 100px;
      min-width: 200px;
      margin: 15px;
      -ms-flex-align: center;
      align-items: center
  }
  
  .elevation--custom-color-z16 {
      -webkit-box-shadow: 0 8px 10px -5px rgba(1,135,134,.3),0 16px 24px 2px rgba(1,135,134,.24),0 6px 30px 5px rgba(1,135,134,.22);
      box-shadow: 0 8px 10px -5px rgba(1,135,134,.3),0 16px 24px 2px rgba(1,135,134,.24),0 6px 30px 5px rgba(1,135,134,.22)
  }
  
  .elevation-hero .elevation-demo-surface {
      width: 120px;
      height: 48px;
      margin: 24px;
      background-color: #212121;
      color: #f0f0f0
  }
  
  .elevation-demo-container {
      display: -ms-flexbox;
      display: flex;
      margin: auto;
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -ms-flex-pack: justify;
      justify-content: space-between;
      width: 100%
  }
  
  .mdc-fab {
      -webkit-box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);
      display: -ms-inline-flexbox;
      display: inline-flex;
      position: relative;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 56px;
      height: 56px;
      padding: 0;
      border: none;
      fill: currentColor;
      text-decoration: none;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      -webkit-transition: opacity 15ms linear 30ms,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .27s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity 15ms linear 30ms,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .27s cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: box-shadow .28s cubic-bezier(.4,0,.2,1),opacity 15ms linear 30ms,transform .27s 0ms cubic-bezier(0,0,.2,1);
      transition: box-shadow .28s cubic-bezier(.4,0,.2,1),opacity 15ms linear 30ms,transform .27s cubic-bezier(0,0,.2,1) 0ms;
      transition: box-shadow .28s cubic-bezier(.4,0,.2,1),opacity 15ms linear 30ms,transform .27s cubic-bezier(0,0,.2,1) 0ms,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .27s cubic-bezier(0,0,.2,1) 0ms;
      background-color: #018786;
      color: #fff;
      color: var(--mdc-theme-on-secondary,#fff)
  }
  
  .mdc-fab:not(.mdc-fab--extended),.mdc-fab:not(.mdc-fab--extended) .mdc-fab__ripple {
      border-radius: 50%
  }
  
  .mdc-fab::-moz-focus-inner {
      padding: 0;
      border: 0
  }
  
  .mdc-fab:focus,.mdc-fab:hover {
      -webkit-box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);
      box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)
  }
  
  .mdc-fab:active {
      -webkit-box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12);
      box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)
  }
  
  .mdc-fab:active,.mdc-fab:focus {
      outline: none
  }
  
  .mdc-fab:hover {
      cursor: pointer
  }
  
  .mdc-fab>svg {
      width: 100%
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-fab {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-fab .mdc-fab__icon {
      width: 24px;
      height: 24px;
      font-size: 24px
  }
  
  .mdc-fab--mini {
      width: 40px;
      height: 40px
  }
  
  .mdc-fab--extended {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 2.25rem;
      font-weight: 500;
      letter-spacing: .0892857143em;
      text-decoration: none;
      text-transform: uppercase;
      border-radius: 24px;
      padding: 0 20px;
      width: auto;
      max-width: 100%;
      height: 48px
  }
  
  .mdc-fab--extended .mdc-fab__ripple {
      border-radius: 24px
  }
  
  .mdc-fab--extended .mdc-fab__icon {
      margin-left: -8px;
      margin-right: 12px
  }
  
  .mdc-fab--extended .mdc-fab__icon[dir=rtl],.mdc-fab--extended .mdc-fab__label+.mdc-fab__icon,[dir=rtl] .mdc-fab--extended .mdc-fab__icon {
      margin-left: 12px;
      margin-right: -8px
  }
  
  .mdc-fab--extended .mdc-fab__label+.mdc-fab__icon[dir=rtl],[dir=rtl] .mdc-fab--extended .mdc-fab__label+.mdc-fab__icon {
      margin-left: -8px;
      margin-right: 12px
  }
  
  .mdc-fab__label {
      -ms-flex-pack: start;
      justify-content: flex-start;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden
  }
  
  .mdc-fab__icon {
      -webkit-transition: -webkit-transform .18s cubic-bezier(0,0,.2,1) 90ms;
      transition: -webkit-transform .18s cubic-bezier(0,0,.2,1) 90ms;
      -o-transition: transform .18s 90ms cubic-bezier(0,0,.2,1);
      transition: transform .18s cubic-bezier(0,0,.2,1) 90ms;
      transition: transform .18s cubic-bezier(0,0,.2,1) 90ms,-webkit-transform .18s cubic-bezier(0,0,.2,1) 90ms;
      fill: currentColor;
      will-change: transform
  }
  
  .mdc-fab .mdc-fab__icon {
      display: -ms-inline-flexbox;
      display: inline-flex;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center
  }
  
  .mdc-fab--exited {
      opacity: 0;
      -webkit-transition: opacity 15ms linear .15s,-webkit-transform .18s cubic-bezier(.4,0,1,1) 0ms;
      transition: opacity 15ms linear .15s,-webkit-transform .18s cubic-bezier(.4,0,1,1) 0ms;
      -o-transition: opacity 15ms linear .15s,transform .18s 0ms cubic-bezier(.4,0,1,1);
      transition: opacity 15ms linear .15s,transform .18s cubic-bezier(.4,0,1,1) 0ms;
      transition: opacity 15ms linear .15s,transform .18s cubic-bezier(.4,0,1,1) 0ms,-webkit-transform .18s cubic-bezier(.4,0,1,1) 0ms
  }
  
  .mdc-fab--exited,.mdc-fab--exited .mdc-fab__icon {
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0)
  }
  
  .mdc-fab--exited .mdc-fab__icon {
      -webkit-transition: -webkit-transform 135ms cubic-bezier(.4,0,1,1) 0ms;
      transition: -webkit-transform 135ms cubic-bezier(.4,0,1,1) 0ms;
      -o-transition: transform 135ms 0ms cubic-bezier(.4,0,1,1);
      transition: transform 135ms cubic-bezier(.4,0,1,1) 0ms;
      transition: transform 135ms cubic-bezier(.4,0,1,1) 0ms,-webkit-transform 135ms cubic-bezier(.4,0,1,1) 0ms
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-fab {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-fab .mdc-fab__ripple:after,.mdc-fab .mdc-fab__ripple:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-fab .mdc-fab__ripple:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-fab.mdc-ripple-upgraded .mdc-fab__ripple:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-fab.mdc-ripple-upgraded .mdc-fab__ripple:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-fab.mdc-ripple-upgraded--unbounded .mdc-fab__ripple:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-fab.mdc-ripple-upgraded--foreground-activation .mdc-fab__ripple:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-fab.mdc-ripple-upgraded--foreground-deactivation .mdc-fab__ripple:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-fab .mdc-fab__ripple:after,.mdc-fab .mdc-fab__ripple:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .mdc-fab.mdc-ripple-upgraded .mdc-fab__ripple:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-fab .mdc-fab__ripple:after,.mdc-fab .mdc-fab__ripple:before {
      background-color: #fff
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-fab .mdc-fab__ripple:after,.mdc-fab .mdc-fab__ripple:before {
          background-color: var(--mdc-theme-on-secondary,#fff)
      }
  }
  
  .mdc-fab:hover .mdc-fab__ripple:before {
      opacity: .08
  }
  
  .mdc-fab.mdc-ripple-upgraded--background-focused .mdc-fab__ripple:before,.mdc-fab:not(.mdc-ripple-upgraded):focus .mdc-fab__ripple:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-fab:not(.mdc-ripple-upgraded) .mdc-fab__ripple:after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-fab:not(.mdc-ripple-upgraded):active .mdc-fab__ripple:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-fab.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.24
  }
  
  .mdc-fab .mdc-fab__ripple {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden
  }
  
  .demo-fab-shaped {
      display: -ms-flexbox;
      display: flex
  }
  
  .demo-fab-shaped--one {
      margin-right: 24px
  }
  
  .demo-fab-shaped--one:not(.mdc-fab--extended) {
      border-radius: 50% 0
  }
  
  .demo-fab-shaped--one:not(.mdc-fab--extended)[dir=rtl],[dir=rtl] .demo-fab-shaped--one:not(.mdc-fab--extended) {
      border-radius: 0 50%
  }
  
  .demo-fab-shaped--one:not(.mdc-fab--extended) .mdc-fab__ripple {
      border-radius: 50% 0
  }
  
  .demo-fab-shaped--one:not(.mdc-fab--extended) .mdc-fab__ripple[dir=rtl],[dir=rtl] .demo-fab-shaped--one:not(.mdc-fab--extended) .mdc-fab__ripple {
      border-radius: 0 50%
  }
  
  .demo-fab-shaped--two {
      margin-right: 24px
  }
  
  .demo-fab-shaped--two:not(.mdc-fab--extended),.demo-fab-shaped--two:not(.mdc-fab--extended) .mdc-fab__ripple {
      border-radius: 8px
  }
  
  .demo-fab-shaped--three {
      border-radius: 12px;
      margin-right: 24px
  }
  
  .demo-fab-shaped--three .mdc-fab__ripple {
      border-radius: 12px
  }
  
  .mdc-icon-button {
      display: inline-block;
      position: relative;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border: none;
      outline: none;
      background-color: transparent;
      fill: currentColor;
      color: inherit;
      font-size: 24px;
      text-decoration: none;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      width: 48px;
      height: 48px;
      padding: 12px
  }
  
  .mdc-icon-button img,.mdc-icon-button svg {
      width: 24px;
      height: 24px
  }
  
  .mdc-icon-button:disabled {
      color: rgba(0,0,0,.38);
      color: var(--mdc-theme-text-disabled-on-light,rgba(0,0,0,.38));
      cursor: default;
      pointer-events: none
  }
  
  .mdc-icon-button__icon {
      display: inline-block
  }
  
  .mdc-icon-button--on .mdc-icon-button__icon,.mdc-icon-button__icon.mdc-icon-button__icon--on {
      display: none
  }
  
  .mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on {
      display: inline-block
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-icon-button {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-icon-button:after,.mdc-icon-button:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-icon-button:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-icon-button.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-icon-button.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-icon-button.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-icon-button.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-icon-button.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-icon-button:after,.mdc-icon-button:before {
      top: 0%;
      left: 0%;
      width: 100%;
      height: 100%
  }
  
  .mdc-icon-button.mdc-ripple-upgraded:after,.mdc-icon-button.mdc-ripple-upgraded:before {
      top: var(--mdc-ripple-top,0%);
      left: var(--mdc-ripple-left,0%);
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-icon-button.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-icon-button:after,.mdc-icon-button:before {
      background-color: #000
  }
  
  .mdc-icon-button:hover:before {
      opacity: .04
  }
  
  .mdc-icon-button.mdc-ripple-upgraded--background-focused:before,.mdc-icon-button:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-icon-button:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-icon-button:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-icon-button.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .hero-image-list {
      width: 300px;
      margin: 0
  }
  
  .hero-image-list .mdc-image-list__item {
      width: calc(100% / 5 - 4.2px);
      margin: 2px
  }
  
  .hero-image-list .mdc-image-list__image {
      background-color: #000
  }
  
  .standard-image-list {
      max-width: 900px
  }
  
  .standard-image-list .mdc-image-list__image-aspect-container {
      padding-bottom: 66.66667%
  }
  
  .standard-image-list .mdc-image-list__item {
      width: calc(100% / 5 - 4.2px);
      margin: 2px
  }
  
  .standard-image-list .mdc-image-list__image {
      border-radius: 8px
  }
  
  .standard-image-list.mdc-image-list--with-text-protection .mdc-image-list__supporting {
      border-radius: 0 0 8px 8px
  }
  
  .masonry-image-list {
      -webkit-column-count: 5;
      column-count: 5;
      -webkit-column-gap: 16px;
      column-gap: 16px;
      max-width: 900px
  }
  
  .masonry-image-list .mdc-image-list__item {
      margin-bottom: 16px
  }
  
  @media (max-width: 599px) {
      .standard-image-list .mdc-image-list__item {
          width:calc(100% / 3 - 4.3333333333px);
          margin: 2px
      }
  
      .masonry-image-list {
          -webkit-column-count: 3;
          column-count: 3;
          -webkit-column-gap: 16px;
          column-gap: 16px
      }
  
      .masonry-image-list .mdc-image-list__item {
          margin-bottom: 16px
      }
  }
  
  :root {
      --mdc-layout-grid-margin-desktop: 24px;
      --mdc-layout-grid-gutter-desktop: 24px;
      --mdc-layout-grid-column-width-desktop: 72px;
      --mdc-layout-grid-margin-tablet: 16px;
      --mdc-layout-grid-gutter-tablet: 16px;
      --mdc-layout-grid-column-width-tablet: 72px;
      --mdc-layout-grid-margin-phone: 16px;
      --mdc-layout-grid-gutter-phone: 16px;
      --mdc-layout-grid-column-width-phone: 72px
  }
  
  @media (min-width: 840px) {
      .mdc-layout-grid {
          -webkit-box-sizing:border-box;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 24px;
          padding: var(--mdc-layout-grid-margin-desktop,24px)
      }
  }
  
  @media (min-width: 480px) and (max-width:839px) {
      .mdc-layout-grid {
          -webkit-box-sizing:border-box;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 16px;
          padding: var(--mdc-layout-grid-margin-tablet,16px)
      }
  }
  
  @media (max-width: 479px) {
      .mdc-layout-grid {
          -webkit-box-sizing:border-box;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 16px;
          padding: var(--mdc-layout-grid-margin-phone,16px)
      }
  }
  
  @media (min-width: 840px) {
      .mdc-layout-grid__inner {
          display:-ms-flexbox;
          display: flex;
          -ms-flex-flow: row wrap;
          flex-flow: row wrap;
          -ms-flex-align: stretch;
          align-items: stretch;
          margin: -12px;
          margin: calc(var(--mdc-layout-grid-gutter-desktop, 24px) / 2 * -1)
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__inner {
              display:grid;
              margin: 0;
              grid-gap: 24px;
              grid-gap: var(--mdc-layout-grid-gutter-desktop,24px);
              grid-template-columns: repeat(12,minmax(0,1fr))
          }
      }
  }
  
  @media (min-width: 480px) and (max-width:839px) {
      .mdc-layout-grid__inner {
          display:-ms-flexbox;
          display: flex;
          -ms-flex-flow: row wrap;
          flex-flow: row wrap;
          -ms-flex-align: stretch;
          align-items: stretch;
          margin: -8px;
          margin: calc(var(--mdc-layout-grid-gutter-tablet, 16px) / 2 * -1)
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__inner {
              display:grid;
              margin: 0;
              grid-gap: 16px;
              grid-gap: var(--mdc-layout-grid-gutter-tablet,16px);
              grid-template-columns: repeat(8,minmax(0,1fr))
          }
      }
  }
  
  @media (max-width: 479px) {
      .mdc-layout-grid__inner {
          display:-ms-flexbox;
          display: flex;
          -ms-flex-flow: row wrap;
          flex-flow: row wrap;
          -ms-flex-align: stretch;
          align-items: stretch;
          margin: -8px;
          margin: calc(var(--mdc-layout-grid-gutter-phone, 16px) / 2 * -1)
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__inner {
              display:grid;
              margin: 0;
              grid-gap: 16px;
              grid-gap: var(--mdc-layout-grid-gutter-phone,16px);
              grid-template-columns: repeat(4,minmax(0,1fr))
          }
      }
  }
  
  @media (min-width: 840px) {
      .mdc-layout-grid__cell {
          width:calc(33.3333333333% - 24px);
          width: calc(33.3333333333% - var(--mdc-layout-grid-gutter-desktop, 24px));
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin: 12px;
          margin: calc(var(--mdc-layout-grid-gutter-desktop, 24px) / 2)
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell {
              width:auto;
              grid-column-end: span 4;
              margin: 0
          }
      }
  
      .mdc-layout-grid__cell--span-1,.mdc-layout-grid__cell--span-1-desktop {
          width: calc(8.3333333333% - 24px);
          width: calc(8.3333333333% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-1,.mdc-layout-grid__cell--span-1-desktop {
              width:auto;
              grid-column-end: span 1
          }
      }
  
      .mdc-layout-grid__cell--span-2,.mdc-layout-grid__cell--span-2-desktop {
          width: calc(16.6666666667% - 24px);
          width: calc(16.6666666667% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-2,.mdc-layout-grid__cell--span-2-desktop {
              width:auto;
              grid-column-end: span 2
          }
      }
  
      .mdc-layout-grid__cell--span-3,.mdc-layout-grid__cell--span-3-desktop {
          width: calc(25% - 24px);
          width: calc(25% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-3,.mdc-layout-grid__cell--span-3-desktop {
              width:auto;
              grid-column-end: span 3
          }
      }
  
      .mdc-layout-grid__cell--span-4,.mdc-layout-grid__cell--span-4-desktop {
          width: calc(33.3333333333% - 24px);
          width: calc(33.3333333333% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-4,.mdc-layout-grid__cell--span-4-desktop {
              width:auto;
              grid-column-end: span 4
          }
      }
  
      .mdc-layout-grid__cell--span-5,.mdc-layout-grid__cell--span-5-desktop {
          width: calc(41.6666666667% - 24px);
          width: calc(41.6666666667% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-5,.mdc-layout-grid__cell--span-5-desktop {
              width:auto;
              grid-column-end: span 5
          }
      }
  
      .mdc-layout-grid__cell--span-6,.mdc-layout-grid__cell--span-6-desktop {
          width: calc(50% - 24px);
          width: calc(50% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-6,.mdc-layout-grid__cell--span-6-desktop {
              width:auto;
              grid-column-end: span 6
          }
      }
  
      .mdc-layout-grid__cell--span-7,.mdc-layout-grid__cell--span-7-desktop {
          width: calc(58.3333333333% - 24px);
          width: calc(58.3333333333% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-7,.mdc-layout-grid__cell--span-7-desktop {
              width:auto;
              grid-column-end: span 7
          }
      }
  
      .mdc-layout-grid__cell--span-8,.mdc-layout-grid__cell--span-8-desktop {
          width: calc(66.6666666667% - 24px);
          width: calc(66.6666666667% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-8,.mdc-layout-grid__cell--span-8-desktop {
              width:auto;
              grid-column-end: span 8
          }
      }
  
      .mdc-layout-grid__cell--span-9,.mdc-layout-grid__cell--span-9-desktop {
          width: calc(75% - 24px);
          width: calc(75% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-9,.mdc-layout-grid__cell--span-9-desktop {
              width:auto;
              grid-column-end: span 9
          }
      }
  
      .mdc-layout-grid__cell--span-10,.mdc-layout-grid__cell--span-10-desktop {
          width: calc(83.3333333333% - 24px);
          width: calc(83.3333333333% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-10,.mdc-layout-grid__cell--span-10-desktop {
              width:auto;
              grid-column-end: span 10
          }
      }
  
      .mdc-layout-grid__cell--span-11,.mdc-layout-grid__cell--span-11-desktop {
          width: calc(91.6666666667% - 24px);
          width: calc(91.6666666667% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-11,.mdc-layout-grid__cell--span-11-desktop {
              width:auto;
              grid-column-end: span 11
          }
      }
  
      .mdc-layout-grid__cell--span-12,.mdc-layout-grid__cell--span-12-desktop {
          width: calc(100% - 24px);
          width: calc(100% - var(--mdc-layout-grid-gutter-desktop, 24px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-12,.mdc-layout-grid__cell--span-12-desktop {
              width:auto;
              grid-column-end: span 12
          }
      }
  }
  
  @media (min-width: 480px) and (max-width:839px) {
      .mdc-layout-grid__cell {
          width:calc(50% - 16px);
          width: calc(50% - var(--mdc-layout-grid-gutter-tablet, 16px));
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin: 8px;
          margin: calc(var(--mdc-layout-grid-gutter-tablet, 16px) / 2)
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell {
              width:auto;
              grid-column-end: span 4;
              margin: 0
          }
      }
  
      .mdc-layout-grid__cell--span-1,.mdc-layout-grid__cell--span-1-tablet {
          width: calc(12.5% - 16px);
          width: calc(12.5% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-1,.mdc-layout-grid__cell--span-1-tablet {
              width:auto;
              grid-column-end: span 1
          }
      }
  
      .mdc-layout-grid__cell--span-2,.mdc-layout-grid__cell--span-2-tablet {
          width: calc(25% - 16px);
          width: calc(25% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-2,.mdc-layout-grid__cell--span-2-tablet {
              width:auto;
              grid-column-end: span 2
          }
      }
  
      .mdc-layout-grid__cell--span-3,.mdc-layout-grid__cell--span-3-tablet {
          width: calc(37.5% - 16px);
          width: calc(37.5% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-3,.mdc-layout-grid__cell--span-3-tablet {
              width:auto;
              grid-column-end: span 3
          }
      }
  
      .mdc-layout-grid__cell--span-4,.mdc-layout-grid__cell--span-4-tablet {
          width: calc(50% - 16px);
          width: calc(50% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-4,.mdc-layout-grid__cell--span-4-tablet {
              width:auto;
              grid-column-end: span 4
          }
      }
  
      .mdc-layout-grid__cell--span-5,.mdc-layout-grid__cell--span-5-tablet {
          width: calc(62.5% - 16px);
          width: calc(62.5% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-5,.mdc-layout-grid__cell--span-5-tablet {
              width:auto;
              grid-column-end: span 5
          }
      }
  
      .mdc-layout-grid__cell--span-6,.mdc-layout-grid__cell--span-6-tablet {
          width: calc(75% - 16px);
          width: calc(75% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-6,.mdc-layout-grid__cell--span-6-tablet {
              width:auto;
              grid-column-end: span 6
          }
      }
  
      .mdc-layout-grid__cell--span-7,.mdc-layout-grid__cell--span-7-tablet {
          width: calc(87.5% - 16px);
          width: calc(87.5% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-7,.mdc-layout-grid__cell--span-7-tablet {
              width:auto;
              grid-column-end: span 7
          }
      }
  
      .mdc-layout-grid__cell--span-8,.mdc-layout-grid__cell--span-8-tablet {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-8,.mdc-layout-grid__cell--span-8-tablet {
              width:auto;
              grid-column-end: span 8
          }
      }
  
      .mdc-layout-grid__cell--span-9,.mdc-layout-grid__cell--span-9-tablet {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-9,.mdc-layout-grid__cell--span-9-tablet {
              width:auto;
              grid-column-end: span 8
          }
      }
  
      .mdc-layout-grid__cell--span-10,.mdc-layout-grid__cell--span-10-tablet {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-10,.mdc-layout-grid__cell--span-10-tablet {
              width:auto;
              grid-column-end: span 8
          }
      }
  
      .mdc-layout-grid__cell--span-11,.mdc-layout-grid__cell--span-11-tablet {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-11,.mdc-layout-grid__cell--span-11-tablet {
              width:auto;
              grid-column-end: span 8
          }
      }
  
      .mdc-layout-grid__cell--span-12,.mdc-layout-grid__cell--span-12-tablet {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-tablet, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-12,.mdc-layout-grid__cell--span-12-tablet {
              width:auto;
              grid-column-end: span 8
          }
      }
  }
  
  @media (max-width: 479px) {
      .mdc-layout-grid__cell {
          width:calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-phone, 16px));
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin: 8px;
          margin: calc(var(--mdc-layout-grid-gutter-phone, 16px) / 2)
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell {
              width:auto;
              grid-column-end: span 4;
              margin: 0
          }
      }
  
      .mdc-layout-grid__cell--span-1,.mdc-layout-grid__cell--span-1-phone {
          width: calc(25% - 16px);
          width: calc(25% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-1,.mdc-layout-grid__cell--span-1-phone {
              width:auto;
              grid-column-end: span 1
          }
      }
  
      .mdc-layout-grid__cell--span-2,.mdc-layout-grid__cell--span-2-phone {
          width: calc(50% - 16px);
          width: calc(50% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-2,.mdc-layout-grid__cell--span-2-phone {
              width:auto;
              grid-column-end: span 2
          }
      }
  
      .mdc-layout-grid__cell--span-3,.mdc-layout-grid__cell--span-3-phone {
          width: calc(75% - 16px);
          width: calc(75% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-3,.mdc-layout-grid__cell--span-3-phone {
              width:auto;
              grid-column-end: span 3
          }
      }
  
      .mdc-layout-grid__cell--span-4,.mdc-layout-grid__cell--span-4-phone {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-4,.mdc-layout-grid__cell--span-4-phone {
              width:auto;
              grid-column-end: span 4
          }
      }
  
      .mdc-layout-grid__cell--span-5,.mdc-layout-grid__cell--span-5-phone {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-5,.mdc-layout-grid__cell--span-5-phone {
              width:auto;
              grid-column-end: span 4
          }
      }
  
      .mdc-layout-grid__cell--span-6,.mdc-layout-grid__cell--span-6-phone {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-6,.mdc-layout-grid__cell--span-6-phone {
              width:auto;
              grid-column-end: span 4
          }
      }
  
      .mdc-layout-grid__cell--span-7,.mdc-layout-grid__cell--span-7-phone {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-7,.mdc-layout-grid__cell--span-7-phone {
              width:auto;
              grid-column-end: span 4
          }
      }
  
      .mdc-layout-grid__cell--span-8,.mdc-layout-grid__cell--span-8-phone {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-8,.mdc-layout-grid__cell--span-8-phone {
              width:auto;
              grid-column-end: span 4
          }
      }
  
      .mdc-layout-grid__cell--span-9,.mdc-layout-grid__cell--span-9-phone {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-9,.mdc-layout-grid__cell--span-9-phone {
              width:auto;
              grid-column-end: span 4
          }
      }
  
      .mdc-layout-grid__cell--span-10,.mdc-layout-grid__cell--span-10-phone {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-10,.mdc-layout-grid__cell--span-10-phone {
              width:auto;
              grid-column-end: span 4
          }
      }
  
      .mdc-layout-grid__cell--span-11,.mdc-layout-grid__cell--span-11-phone {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-11,.mdc-layout-grid__cell--span-11-phone {
              width:auto;
              grid-column-end: span 4
          }
      }
  
      .mdc-layout-grid__cell--span-12,.mdc-layout-grid__cell--span-12-phone {
          width: calc(100% - 16px);
          width: calc(100% - var(--mdc-layout-grid-gutter-phone, 16px))
      }
  
      @supports (display: grid) {
          .mdc-layout-grid__cell--span-12,.mdc-layout-grid__cell--span-12-phone {
              width:auto;
              grid-column-end: span 4
          }
      }
  }
  
  .mdc-layout-grid__cell--order-1 {
      -ms-flex-order: 1;
      order: 1
  }
  
  .mdc-layout-grid__cell--order-2 {
      -ms-flex-order: 2;
      order: 2
  }
  
  .mdc-layout-grid__cell--order-3 {
      -ms-flex-order: 3;
      order: 3
  }
  
  .mdc-layout-grid__cell--order-4 {
      -ms-flex-order: 4;
      order: 4
  }
  
  .mdc-layout-grid__cell--order-5 {
      -ms-flex-order: 5;
      order: 5
  }
  
  .mdc-layout-grid__cell--order-6 {
      -ms-flex-order: 6;
      order: 6
  }
  
  .mdc-layout-grid__cell--order-7 {
      -ms-flex-order: 7;
      order: 7
  }
  
  .mdc-layout-grid__cell--order-8 {
      -ms-flex-order: 8;
      order: 8
  }
  
  .mdc-layout-grid__cell--order-9 {
      -ms-flex-order: 9;
      order: 9
  }
  
  .mdc-layout-grid__cell--order-10 {
      -ms-flex-order: 10;
      order: 10
  }
  
  .mdc-layout-grid__cell--order-11 {
      -ms-flex-order: 11;
      order: 11
  }
  
  .mdc-layout-grid__cell--order-12 {
      -ms-flex-order: 12;
      order: 12
  }
  
  .mdc-layout-grid__cell--align-top {
      -ms-flex-item-align: start;
      align-self: flex-start
  }
  
  @supports (display: grid) {
      .mdc-layout-grid__cell--align-top {
          -ms-flex-item-align:start;
          align-self: start
      }
  }
  
  .mdc-layout-grid__cell--align-middle {
      -ms-flex-item-align: center;
      align-self: center
  }
  
  .mdc-layout-grid__cell--align-bottom {
      -ms-flex-item-align: end;
      align-self: flex-end
  }
  
  @supports (display: grid) {
      .mdc-layout-grid__cell--align-bottom {
          -ms-flex-item-align:end;
          align-self: end
      }
  }
  
  @media (min-width: 840px) {
      .mdc-layout-grid--fixed-column-width {
          width:1176px;
          width: calc(var(--mdc-layout-grid-column-width-desktop, 72px) * 12 + var(--mdc-layout-grid-gutter-desktop, 24px) * 11 + var(--mdc-layout-grid-margin-desktop, 24px) * 2)
      }
  }
  
  @media (min-width: 480px) and (max-width:839px) {
      .mdc-layout-grid--fixed-column-width {
          width:720px;
          width: calc(var(--mdc-layout-grid-column-width-tablet, 72px) * 8 + var(--mdc-layout-grid-gutter-tablet, 16px) * 7 + var(--mdc-layout-grid-margin-tablet, 16px) * 2)
      }
  }
  
  @media (max-width: 479px) {
      .mdc-layout-grid--fixed-column-width {
          width:368px;
          width: calc(var(--mdc-layout-grid-column-width-phone, 72px) * 4 + var(--mdc-layout-grid-gutter-phone, 16px) * 3 + var(--mdc-layout-grid-margin-phone, 16px) * 2)
      }
  }
  
  .mdc-layout-grid--align-left {
      margin-right: auto;
      margin-left: 0
  }
  
  .mdc-layout-grid--align-right {
      margin-right: 0;
      margin-left: auto
  }
  
  .demo-grid {
      background: rgba(0,0,0,.2);
      min-width: 360px
  }
  
  .demo-grid--alignment {
      max-width: 800px
  }
  
  .demo-grid--cell-alignment,.demo-inner {
      min-height: 200px
  }
  
  .demo-cell {
      background: rgba(0,0,0,.2);
      height: 100px
  }
  
  .demo-cell--alignment {
      max-height: 50px
  }
  
  @-webkit-keyframes mdc-linear-progress-primary-indeterminate-translate {
      0% {
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      20% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      59.15% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(83.67142%);
          transform: translateX(83.67142%)
      }
  
      to {
          -webkit-transform: translateX(200.611057%);
          transform: translateX(200.611057%)
      }
  }
  
  @keyframes mdc-linear-progress-primary-indeterminate-translate {
      0% {
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      20% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      59.15% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(83.67142%);
          transform: translateX(83.67142%)
      }
  
      to {
          -webkit-transform: translateX(200.611057%);
          transform: translateX(200.611057%)
      }
  }
  
  @-webkit-keyframes mdc-linear-progress-primary-indeterminate-scale {
      0% {
          -webkit-transform: scaleX(.08);
          transform: scaleX(.08)
      }
  
      36.65% {
          -webkit-animation-timing-function: cubic-bezier(.334731,.12482,.785844,1);
          animation-timing-function: cubic-bezier(.334731,.12482,.785844,1);
          -webkit-transform: scaleX(.08);
          transform: scaleX(.08)
      }
  
      69.15% {
          -webkit-animation-timing-function: cubic-bezier(.06,.11,.6,1);
          animation-timing-function: cubic-bezier(.06,.11,.6,1);
          -webkit-transform: scaleX(.661479);
          transform: scaleX(.661479)
      }
  
      to {
          -webkit-transform: scaleX(.08);
          transform: scaleX(.08)
      }
  }
  
  @keyframes mdc-linear-progress-primary-indeterminate-scale {
      0% {
          -webkit-transform: scaleX(.08);
          transform: scaleX(.08)
      }
  
      36.65% {
          -webkit-animation-timing-function: cubic-bezier(.334731,.12482,.785844,1);
          animation-timing-function: cubic-bezier(.334731,.12482,.785844,1);
          -webkit-transform: scaleX(.08);
          transform: scaleX(.08)
      }
  
      69.15% {
          -webkit-animation-timing-function: cubic-bezier(.06,.11,.6,1);
          animation-timing-function: cubic-bezier(.06,.11,.6,1);
          -webkit-transform: scaleX(.661479);
          transform: scaleX(.661479)
      }
  
      to {
          -webkit-transform: scaleX(.08);
          transform: scaleX(.08)
      }
  }
  
  @-webkit-keyframes mdc-linear-progress-secondary-indeterminate-translate {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.15,0,.515058,.409685);
          animation-timing-function: cubic-bezier(.15,0,.515058,.409685);
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      25% {
          -webkit-animation-timing-function: cubic-bezier(.31033,.284058,.8,.733712);
          animation-timing-function: cubic-bezier(.31033,.284058,.8,.733712);
          -webkit-transform: translateX(37.651913%);
          transform: translateX(37.651913%)
      }
  
      48.35% {
          -webkit-animation-timing-function: cubic-bezier(.4,.627035,.6,.902026);
          animation-timing-function: cubic-bezier(.4,.627035,.6,.902026);
          -webkit-transform: translateX(84.386165%);
          transform: translateX(84.386165%)
      }
  
      to {
          -webkit-transform: translateX(160.277782%);
          transform: translateX(160.277782%)
      }
  }
  
  @keyframes mdc-linear-progress-secondary-indeterminate-translate {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.15,0,.515058,.409685);
          animation-timing-function: cubic-bezier(.15,0,.515058,.409685);
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      25% {
          -webkit-animation-timing-function: cubic-bezier(.31033,.284058,.8,.733712);
          animation-timing-function: cubic-bezier(.31033,.284058,.8,.733712);
          -webkit-transform: translateX(37.651913%);
          transform: translateX(37.651913%)
      }
  
      48.35% {
          -webkit-animation-timing-function: cubic-bezier(.4,.627035,.6,.902026);
          animation-timing-function: cubic-bezier(.4,.627035,.6,.902026);
          -webkit-transform: translateX(84.386165%);
          transform: translateX(84.386165%)
      }
  
      to {
          -webkit-transform: translateX(160.277782%);
          transform: translateX(160.277782%)
      }
  }
  
  @-webkit-keyframes mdc-linear-progress-secondary-indeterminate-scale {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.205028,.057051,.57661,.453971);
          animation-timing-function: cubic-bezier(.205028,.057051,.57661,.453971);
          -webkit-transform: scaleX(.08);
          transform: scaleX(.08)
      }
  
      19.15% {
          -webkit-animation-timing-function: cubic-bezier(.152313,.196432,.648374,1.004315);
          animation-timing-function: cubic-bezier(.152313,.196432,.648374,1.004315);
          -webkit-transform: scaleX(.457104);
          transform: scaleX(.457104)
      }
  
      44.15% {
          -webkit-animation-timing-function: cubic-bezier(.257759,-.003163,.211762,1.38179);
          animation-timing-function: cubic-bezier(.257759,-.003163,.211762,1.38179);
          -webkit-transform: scaleX(.72796);
          transform: scaleX(.72796)
      }
  
      to {
          -webkit-transform: scaleX(.08);
          transform: scaleX(.08)
      }
  }
  
  @keyframes mdc-linear-progress-secondary-indeterminate-scale {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.205028,.057051,.57661,.453971);
          animation-timing-function: cubic-bezier(.205028,.057051,.57661,.453971);
          -webkit-transform: scaleX(.08);
          transform: scaleX(.08)
      }
  
      19.15% {
          -webkit-animation-timing-function: cubic-bezier(.152313,.196432,.648374,1.004315);
          animation-timing-function: cubic-bezier(.152313,.196432,.648374,1.004315);
          -webkit-transform: scaleX(.457104);
          transform: scaleX(.457104)
      }
  
      44.15% {
          -webkit-animation-timing-function: cubic-bezier(.257759,-.003163,.211762,1.38179);
          animation-timing-function: cubic-bezier(.257759,-.003163,.211762,1.38179);
          -webkit-transform: scaleX(.72796);
          transform: scaleX(.72796)
      }
  
      to {
          -webkit-transform: scaleX(.08);
          transform: scaleX(.08)
      }
  }
  
  @-webkit-keyframes mdc-linear-progress-buffering {
      to {
          -webkit-transform: translateX(-10px);
          transform: translateX(-10px)
      }
  }
  
  @keyframes mdc-linear-progress-buffering {
      to {
          -webkit-transform: translateX(-10px);
          transform: translateX(-10px)
      }
  }
  
  @-webkit-keyframes mdc-linear-progress-primary-indeterminate-translate-reverse {
      0% {
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      20% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      59.15% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-83.67142%);
          transform: translateX(-83.67142%)
      }
  
      to {
          -webkit-transform: translateX(-200.611057%);
          transform: translateX(-200.611057%)
      }
  }
  
  @keyframes mdc-linear-progress-primary-indeterminate-translate-reverse {
      0% {
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      20% {
          -webkit-animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          animation-timing-function: cubic-bezier(.5,0,.701732,.495819);
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      59.15% {
          -webkit-animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          animation-timing-function: cubic-bezier(.302435,.381352,.55,.956352);
          -webkit-transform: translateX(-83.67142%);
          transform: translateX(-83.67142%)
      }
  
      to {
          -webkit-transform: translateX(-200.611057%);
          transform: translateX(-200.611057%)
      }
  }
  
  @-webkit-keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.15,0,.515058,.409685);
          animation-timing-function: cubic-bezier(.15,0,.515058,.409685);
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      25% {
          -webkit-animation-timing-function: cubic-bezier(.31033,.284058,.8,.733712);
          animation-timing-function: cubic-bezier(.31033,.284058,.8,.733712);
          -webkit-transform: translateX(-37.651913%);
          transform: translateX(-37.651913%)
      }
  
      48.35% {
          -webkit-animation-timing-function: cubic-bezier(.4,.627035,.6,.902026);
          animation-timing-function: cubic-bezier(.4,.627035,.6,.902026);
          -webkit-transform: translateX(-84.386165%);
          transform: translateX(-84.386165%)
      }
  
      to {
          -webkit-transform: translateX(-160.277782%);
          transform: translateX(-160.277782%)
      }
  }
  
  @keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.15,0,.515058,.409685);
          animation-timing-function: cubic-bezier(.15,0,.515058,.409685);
          -webkit-transform: translateX(0);
          transform: translateX(0)
      }
  
      25% {
          -webkit-animation-timing-function: cubic-bezier(.31033,.284058,.8,.733712);
          animation-timing-function: cubic-bezier(.31033,.284058,.8,.733712);
          -webkit-transform: translateX(-37.651913%);
          transform: translateX(-37.651913%)
      }
  
      48.35% {
          -webkit-animation-timing-function: cubic-bezier(.4,.627035,.6,.902026);
          animation-timing-function: cubic-bezier(.4,.627035,.6,.902026);
          -webkit-transform: translateX(-84.386165%);
          transform: translateX(-84.386165%)
      }
  
      to {
          -webkit-transform: translateX(-160.277782%);
          transform: translateX(-160.277782%)
      }
  }
  
  @-webkit-keyframes mdc-linear-progress-buffering-reverse {
      to {
          -webkit-transform: translateX(10px);
          transform: translateX(10px)
      }
  }
  
  @keyframes mdc-linear-progress-buffering-reverse {
      to {
          -webkit-transform: translateX(10px);
          transform: translateX(10px)
      }
  }
  
  .mdc-linear-progress {
      position: relative;
      width: 100%;
      height: 4px;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      outline: 1px solid transparent;
      overflow: hidden;
      -webkit-transition: opacity .25s cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: opacity .25s 0ms cubic-bezier(.4,0,.6,1);
      transition: opacity .25s cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-linear-progress__bar {
      height: 100%;
      -webkit-transform-origin: top left;
      -ms-transform-origin: top left;
      transform-origin: top left;
      -webkit-transition: -webkit-transform .25s cubic-bezier(.4,0,.6,1) 0ms;
      transition: -webkit-transform .25s cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: transform .25s 0ms cubic-bezier(.4,0,.6,1);
      transition: transform .25s cubic-bezier(.4,0,.6,1) 0ms;
      transition: transform .25s cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform .25s cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-linear-progress__bar,.mdc-linear-progress__bar-inner {
      position: absolute;
      width: 100%;
      -webkit-animation: none;
      animation: none
  }
  
  .mdc-linear-progress__bar-inner {
      display: inline-block;
      border-top: 4px solid
  }
  
  .mdc-linear-progress__buffering-dots {
      position: absolute;
      width: 100%;
      height: 100%;
      background-repeat: repeat-x;
      background-size: 10px 4px;
      -webkit-animation: mdc-linear-progress-buffering .25s infinite linear;
      animation: mdc-linear-progress-buffering .25s infinite linear
  }
  
  .mdc-linear-progress__buffer {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-transform-origin: top left;
      -ms-transform-origin: top left;
      transform-origin: top left;
      -webkit-transition: -webkit-transform .25s cubic-bezier(.4,0,.6,1) 0ms;
      transition: -webkit-transform .25s cubic-bezier(.4,0,.6,1) 0ms;
      -o-transition: transform .25s 0ms cubic-bezier(.4,0,.6,1);
      transition: transform .25s cubic-bezier(.4,0,.6,1) 0ms;
      transition: transform .25s cubic-bezier(.4,0,.6,1) 0ms,-webkit-transform .25s cubic-bezier(.4,0,.6,1) 0ms
  }
  
  .mdc-linear-progress__primary-bar {
      -webkit-transform: scaleX(0);
      -ms-transform: scaleX(0);
      transform: scaleX(0)
  }
  
  .mdc-linear-progress__secondary-bar {
      visibility: hidden
  }
  
  .mdc-linear-progress--indeterminate .mdc-linear-progress__bar {
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
      left: -145.166611%;
      -webkit-animation: mdc-linear-progress-primary-indeterminate-translate 2s infinite linear;
      animation: mdc-linear-progress-primary-indeterminate-translate 2s infinite linear
  }
  
  .mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner {
      -webkit-animation: mdc-linear-progress-primary-indeterminate-scale 2s infinite linear;
      animation: mdc-linear-progress-primary-indeterminate-scale 2s infinite linear
  }
  
  .mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
      left: -54.888891%;
      visibility: visible;
      -webkit-animation: mdc-linear-progress-secondary-indeterminate-translate 2s infinite linear;
      animation: mdc-linear-progress-secondary-indeterminate-translate 2s infinite linear
  }
  
  .mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner {
      -webkit-animation: mdc-linear-progress-secondary-indeterminate-scale 2s infinite linear;
      animation: mdc-linear-progress-secondary-indeterminate-scale 2s infinite linear
  }
  
  .mdc-linear-progress--reversed .mdc-linear-progress__bar,.mdc-linear-progress--reversed .mdc-linear-progress__buffer {
      right: 0;
      -webkit-transform-origin: center right;
      -ms-transform-origin: center right;
      transform-origin: center right
  }
  
  .mdc-linear-progress--reversed .mdc-linear-progress__primary-bar {
      -webkit-animation-name: mdc-linear-progress-primary-indeterminate-translate-reverse;
      animation-name: mdc-linear-progress-primary-indeterminate-translate-reverse
  }
  
  .mdc-linear-progress--reversed .mdc-linear-progress__secondary-bar {
      -webkit-animation-name: mdc-linear-progress-secondary-indeterminate-translate-reverse;
      animation-name: mdc-linear-progress-secondary-indeterminate-translate-reverse
  }
  
  .mdc-linear-progress--reversed .mdc-linear-progress__buffering-dots {
      -webkit-animation: mdc-linear-progress-buffering-reverse .25s infinite linear;
      animation: mdc-linear-progress-buffering-reverse .25s infinite linear
  }
  
  .mdc-linear-progress--closed {
      opacity: 0;
      -webkit-animation: none;
      animation: none
  }
  
  .mdc-linear-progress__bar-inner {
      border-color: #6200ee;
      border-color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-linear-progress__buffering-dots {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E")
  }
  
  .mdc-linear-progress__buffer {
      background-color: #e6e6e6
  }
  
  .mdc-linear-progress--indeterminate.mdc-linear-progress--reversed .mdc-linear-progress__primary-bar {
      right: -145.166611%;
      left: auto
  }
  
  .mdc-linear-progress--indeterminate.mdc-linear-progress--reversed .mdc-linear-progress__secondary-bar {
      right: -54.888891%;
      left: auto
  }
  
  .hero-linear-progress-indicator {
      width: 100%
  }
  
  .demo-linear-progress-indicator {
      margin-top: 32px
  }
  
  .hero-list {
      background: #fff
  }
  
  .demo-list {
      max-width: 600px;
      border: 1px solid rgba(0,0,0,.1)
  }
  
  .mdc-list--avatar-list .mdc-list-item__graphic {
      background-color: rgba(0,0,0,.3);
      color: #fff
  }
  
  .demo-list-item-shaped .mdc-list-item {
      border-radius: 0 32px 32px 0
  }
  
  .demo-list-item-shaped .mdc-list-item[dir=rtl],[dir=rtl] .demo-list-item-shaped .mdc-list-item {
      border-radius: 32px 0 0 32px
  }
  
  .mdc-menu-surface {
      display: none;
      position: absolute;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 32px);
      margin: 0;
      padding: 0;
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      -webkit-transform-origin: top left;
      -ms-transform-origin: top left;
      transform-origin: top left;
      opacity: 0;
      overflow: auto;
      will-change: transform,opacity;
      z-index: 8;
      -webkit-transition: opacity .03s linear,-webkit-transform .12s cubic-bezier(0,0,.2,1);
      transition: opacity .03s linear,-webkit-transform .12s cubic-bezier(0,0,.2,1);
      -o-transition: opacity .03s linear,transform .12s cubic-bezier(0,0,.2,1);
      transition: opacity .03s linear,transform .12s cubic-bezier(0,0,.2,1);
      transition: opacity .03s linear,transform .12s cubic-bezier(0,0,.2,1),-webkit-transform .12s cubic-bezier(0,0,.2,1);
      -webkit-box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);
      box-shadow: 0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);
      background-color: #fff;
      background-color: var(--mdc-theme-surface,#fff);
      color: #000;
      color: var(--mdc-theme-on-surface,#000);
      border-radius: 4px;
      transform-origin-left: top left;
      transform-origin-right: top right
  }
  
  .mdc-menu-surface:focus {
      outline: none
  }
  
  .mdc-menu-surface--open {
      display: inline-block;
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      opacity: 1
  }
  
  .mdc-menu-surface--animating-open {
      display: inline-block;
      -webkit-transform: scale(.8);
      -ms-transform: scale(.8);
      transform: scale(.8);
      opacity: 0
  }
  
  .mdc-menu-surface--animating-closed {
      display: inline-block;
      opacity: 0;
      -webkit-transition: opacity 75ms linear;
      -o-transition: opacity 75ms linear;
      transition: opacity 75ms linear
  }
  
  .mdc-menu-surface[dir=rtl],[dir=rtl] .mdc-menu-surface {
      transform-origin-left: top right;
      transform-origin-right: top left
  }
  
  .mdc-menu-surface--anchor {
      position: relative;
      overflow: visible
  }
  
  .mdc-menu-surface--fixed {
      position: fixed
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-menu {
      min-width: 112px
  }
  
  .mdc-menu .mdc-list,.mdc-menu .mdc-list-item__graphic,.mdc-menu .mdc-list-item__meta {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-menu .mdc-list-divider {
      margin: 8px 0
  }
  
  .mdc-menu .mdc-list-item {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none
  }
  
  .mdc-menu .mdc-list-item--disabled {
      cursor: auto
  }
  
  .mdc-menu a.mdc-list-item .mdc-list-item__graphic,.mdc-menu a.mdc-list-item .mdc-list-item__text {
      pointer-events: none
  }
  
  .mdc-menu__selection-group {
      padding: 0;
      fill: currentColor
  }
  
  .mdc-menu__selection-group .mdc-list-item {
      padding-left: 56px;
      padding-right: 16px
  }
  
  .mdc-menu__selection-group .mdc-list-item[dir=rtl],[dir=rtl] .mdc-menu__selection-group .mdc-list-item {
      padding-left: 16px;
      padding-right: 56px
  }
  
  .mdc-menu__selection-group .mdc-menu__selection-group-icon {
      left: 16px;
      right: auto;
      display: none;
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%)
  }
  
  .mdc-menu__selection-group .mdc-menu__selection-group-icon[dir=rtl],[dir=rtl] .mdc-menu__selection-group .mdc-menu__selection-group-icon {
      left: auto;
      right: 16px
  }
  
  .mdc-menu-item--selected .mdc-menu__selection-group-icon {
      display: inline
  }
  
  .hero-menu {
      position: relative;
      z-index: 0
  }
  
  .hero-ripple-surface {
      width: 100%;
      min-height: 360px
  }
  
  .ripple-demos {
      display: -ms-flexbox;
      display: flex;
      -ms-flex: 1 1 45%;
      flex: 1 1 45%;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap
  }
  
  .ripple-demo-col {
      min-width: 400px
  }
  
  .ripple-demo-box,.ripple-demo-icon {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      cursor: pointer;
      outline: none
  }
  
  .ripple-demo-box:after,.ripple-demo-box:before,.ripple-demo-icon:after,.ripple-demo-icon:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .ripple-demo-box:before,.ripple-demo-icon:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .ripple-demo-box.mdc-ripple-upgraded:before,.ripple-demo-icon.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .ripple-demo-box.mdc-ripple-upgraded:after,.ripple-demo-icon.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .ripple-demo-box.mdc-ripple-upgraded--unbounded:after,.ripple-demo-icon.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .ripple-demo-box.mdc-ripple-upgraded--foreground-activation:after,.ripple-demo-icon.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .ripple-demo-box.mdc-ripple-upgraded--foreground-deactivation:after,.ripple-demo-icon.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .ripple-demo-box:after,.ripple-demo-box:before,.ripple-demo-icon:after,.ripple-demo-icon:before {
      background-color: #000
  }
  
  .ripple-demo-box:hover:before,.ripple-demo-icon:hover:before {
      opacity: .04
  }
  
  .ripple-demo-box.mdc-ripple-upgraded--background-focused:before,.ripple-demo-box:not(.mdc-ripple-upgraded):focus:before,.ripple-demo-icon.mdc-ripple-upgraded--background-focused:before,.ripple-demo-icon:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .ripple-demo-box:not(.mdc-ripple-upgraded):after,.ripple-demo-icon:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .ripple-demo-box:not(.mdc-ripple-upgraded):active:after,.ripple-demo-icon:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .ripple-demo-box.mdc-ripple-upgraded,.ripple-demo-icon.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .ripple-demo-box {
      -webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      width: 200px;
      height: 100px;
      padding: 1rem;
      cursor: pointer;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-select: none;
      background-color: #fff;
      overflow: hidden
  }
  
  .ripple-demo-box:after,.ripple-demo-box:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .ripple-demo-box.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .ripple-demo-box--primary {
      color: #6200ee;
      color: var(--mdc-theme-primary,#6200ee)
  }
  
  .ripple-demo-box--primary:after,.ripple-demo-box--primary:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .ripple-demo-box--primary:after,.ripple-demo-box--primary:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .ripple-demo-box--primary:hover:before {
      opacity: .04
  }
  
  .ripple-demo-box--primary.mdc-ripple-upgraded--background-focused:before,.ripple-demo-box--primary:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .ripple-demo-box--primary:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .ripple-demo-box--primary:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .ripple-demo-box--primary.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .ripple-demo-box--secondary {
      color: #018786;
      color: var(--mdc-theme-secondary,#018786)
  }
  
  .ripple-demo-box--secondary:after,.ripple-demo-box--secondary:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .ripple-demo-box--secondary:after,.ripple-demo-box--secondary:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .ripple-demo-box--secondary:hover:before {
      opacity: .04
  }
  
  .ripple-demo-box--secondary.mdc-ripple-upgraded--background-focused:before,.ripple-demo-box--secondary:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .ripple-demo-box--secondary:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .ripple-demo-box--secondary:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .ripple-demo-box--secondary.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .ripple-demo-icon {
      width: 24px;
      height: 24px;
      font-size: 24px;
      padding: 12px;
      overflow: visible
  }
  
  .ripple-demo-icon:after,.ripple-demo-icon:before {
      top: 0%;
      left: 0%;
      width: 100%;
      height: 100%
  }
  
  .ripple-demo-icon.mdc-ripple-upgraded:after,.ripple-demo-icon.mdc-ripple-upgraded:before {
      top: var(--mdc-ripple-top,0%);
      left: var(--mdc-ripple-left,0%);
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .ripple-demo-icon.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  @-webkit-keyframes mdc-slider-emphasize {
      0% {
          -webkit-animation-timing-function: ease-out;
          animation-timing-function: ease-out
      }
  
      50% {
          -webkit-animation-timing-function: ease-in;
          animation-timing-function: ease-in;
          -webkit-transform: scale(.85);
          transform: scale(.85)
      }
  
      to {
          -webkit-transform: scale(.571);
          transform: scale(.571)
      }
  }
  
  @keyframes mdc-slider-emphasize {
      0% {
          -webkit-animation-timing-function: ease-out;
          animation-timing-function: ease-out
      }
  
      50% {
          -webkit-animation-timing-function: ease-in;
          animation-timing-function: ease-in;
          -webkit-transform: scale(.85);
          transform: scale(.85)
      }
  
      to {
          -webkit-transform: scale(.571);
          transform: scale(.571)
      }
  }
  
  .mdc-slider {
      position: relative;
      width: 100%;
      height: 48px;
      cursor: pointer;
      -ms-touch-action: pan-x;
      touch-action: pan-x;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-slider:not(.mdc-slider--disabled) .mdc-slider__track {
      background-color: #018786;
      background-color: var(--mdc-theme-secondary,#018786)
  }
  
  .mdc-slider:not(.mdc-slider--disabled) .mdc-slider__track-container {
      background-color: rgba(1,135,134,.26)
  }
  
  .mdc-slider:not(.mdc-slider--disabled) .mdc-slider__track-marker-container {
      background-color: #018786;
      background-color: var(--mdc-theme-secondary,#018786)
  }
  
  .mdc-slider:not(.mdc-slider--disabled) .mdc-slider__thumb {
      fill: #018786;
      fill: var(--mdc-theme-secondary,#018786);
      stroke: #018786;
      stroke: var(--mdc-theme-secondary,#018786)
  }
  
  .mdc-slider:not(.mdc-slider--disabled) .mdc-slider__focus-ring,.mdc-slider:not(.mdc-slider--disabled) .mdc-slider__pin {
      background-color: #018786;
      background-color: var(--mdc-theme-secondary,#018786)
  }
  
  .mdc-slider:not(.mdc-slider--disabled) .mdc-slider__pin {
      color: #fff;
      color: var(--mdc-theme-text-primary-on-dark,#fff)
  }
  
  .mdc-slider--disabled {
      cursor: auto
  }
  
  .mdc-slider--disabled .mdc-slider__track {
      background-color: #9a9a9a
  }
  
  .mdc-slider--disabled .mdc-slider__track-container {
      background-color: hsla(0,0%,60%,.26)
  }
  
  .mdc-slider--disabled .mdc-slider__track-marker-container {
      background-color: #9a9a9a
  }
  
  .mdc-slider--disabled .mdc-slider__thumb {
      fill: #9a9a9a;
      stroke: #9a9a9a;
      stroke: #fff;
      stroke: var(--mdc-slider-bg-color-behind-component,#fff)
  }
  
  .mdc-slider:focus {
      outline: none
  }
  
  .mdc-slider__track-container {
      position: absolute;
      top: 50%;
      width: 100%;
      height: 2px;
      overflow: hidden
  }
  
  .mdc-slider__track {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-transform-origin: left top;
      -ms-transform-origin: left top;
      transform-origin: left top;
      will-change: transform
  }
  
  .mdc-slider[dir=rtl] .mdc-slider__track,[dir=rtl] .mdc-slider .mdc-slider__track {
      -webkit-transform-origin: right top;
      -ms-transform-origin: right top;
      transform-origin: right top
  }
  
  .mdc-slider__track-marker-container {
      display: -ms-flexbox;
      display: flex;
      margin-right: 0;
      margin-left: -1px;
      visibility: hidden
  }
  
  .mdc-slider[dir=rtl] .mdc-slider__track-marker-container,[dir=rtl] .mdc-slider .mdc-slider__track-marker-container {
      margin-right: -1px;
      margin-left: 0
  }
  
  .mdc-slider__track-marker-container:after {
      display: block;
      width: 2px;
      height: 2px;
      content: ""
  }
  
  .mdc-slider__track-marker {
      -ms-flex: 1 1;
      flex: 1 1
  }
  
  .mdc-slider__track-marker:after {
      display: block;
      width: 2px;
      height: 2px;
      content: ""
  }
  
  .mdc-slider__track-marker:first-child:after {
      width: 3px
  }
  
  .mdc-slider__thumb-container {
      position: absolute;
      top: 15px;
      left: 0;
      width: 21px;
      height: 100%;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      will-change: transform
  }
  
  .mdc-slider__thumb {
      position: absolute;
      top: 0;
      left: 0;
      -webkit-transform: scale(.571);
      -ms-transform: scale(.571);
      transform: scale(.571);
      stroke-width: 3.5;
      -webkit-transition: fill .1s ease-out,stroke .1s ease-out,-webkit-transform .1s ease-out;
      transition: fill .1s ease-out,stroke .1s ease-out,-webkit-transform .1s ease-out;
      -o-transition: transform .1s ease-out,fill .1s ease-out,stroke .1s ease-out;
      transition: transform .1s ease-out,fill .1s ease-out,stroke .1s ease-out;
      transition: transform .1s ease-out,fill .1s ease-out,stroke .1s ease-out,-webkit-transform .1s ease-out
  }
  
  .mdc-slider__focus-ring {
      width: 21px;
      height: 21px;
      border-radius: 50%;
      opacity: 0;
      -webkit-transition: opacity .26667s ease-out,background-color .26667s ease-out,-webkit-transform .26667s ease-out;
      transition: opacity .26667s ease-out,background-color .26667s ease-out,-webkit-transform .26667s ease-out;
      -o-transition: transform .26667s ease-out,opacity .26667s ease-out,background-color .26667s ease-out;
      transition: transform .26667s ease-out,opacity .26667s ease-out,background-color .26667s ease-out;
      transition: transform .26667s ease-out,opacity .26667s ease-out,background-color .26667s ease-out,-webkit-transform .26667s ease-out
  }
  
  .mdc-slider__pin {
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      margin-top: -2px;
      margin-left: -2px;
      -webkit-transform: rotate(-45deg) scale(0) translate(0);
      -ms-transform: rotate(-45deg) scale(0) translate(0);
      transform: rotate(-45deg) scale(0) translate(0);
      border-radius: 50% 50% 50% 0;
      z-index: 1;
      -webkit-transition: -webkit-transform .1s ease-out;
      transition: -webkit-transform .1s ease-out;
      -o-transition: transform .1s ease-out;
      transition: transform .1s ease-out;
      transition: transform .1s ease-out,-webkit-transform .1s ease-out
  }
  
  .mdc-slider__pin-value-marker {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg)
  }
  
  .mdc-slider--active .mdc-slider__thumb {
      -webkit-transform: scaleX(1);
      transform: scaleX(1)
  }
  
  .mdc-slider--focus .mdc-slider__thumb {
      -webkit-animation: mdc-slider-emphasize .26667s linear;
      animation: mdc-slider-emphasize .26667s linear
  }
  
  .mdc-slider--focus .mdc-slider__focus-ring {
      -webkit-transform: scale3d(1.55,1.55,1.55);
      transform: scale3d(1.55,1.55,1.55);
      opacity: .25
  }
  
  .mdc-slider--in-transit .mdc-slider__thumb {
      -webkit-transition-delay: .14s;
      -o-transition-delay: .14s;
      transition-delay: .14s
  }
  
  .mdc-slider--in-transit .mdc-slider__thumb-container,.mdc-slider--in-transit .mdc-slider__track,.mdc-slider:focus:not(.mdc-slider--active) .mdc-slider__thumb-container,.mdc-slider:focus:not(.mdc-slider--active) .mdc-slider__track {
      -webkit-transition: -webkit-transform 80ms ease;
      transition: -webkit-transform 80ms ease;
      -o-transition: transform 80ms ease;
      transition: transform 80ms ease;
      transition: transform 80ms ease,-webkit-transform 80ms ease
  }
  
  .mdc-slider--discrete.mdc-slider--active .mdc-slider__thumb {
      -webkit-transform: scale(0.57143);
      -ms-transform: scale(0.57143);
      transform: scale(0.57143)
  }
  
  .mdc-slider--discrete.mdc-slider--active .mdc-slider__pin {
      -webkit-transform: rotate(-45deg) scale(1) translate(19px,-20px);
      -ms-transform: rotate(-45deg) scale(1) translate(19px,-20px);
      transform: rotate(-45deg) scale(1) translate(19px,-20px)
  }
  
  .mdc-slider--discrete.mdc-slider--focus .mdc-slider__thumb {
      -webkit-animation: none;
      animation: none
  }
  
  .mdc-slider--discrete.mdc-slider--display-markers .mdc-slider__track-marker-container {
      visibility: visible
  }
  
  .demo-slider {
      margin-top: 32px
  }
  
  .mdc-snackbar {
      z-index: 8;
      margin: 8px;
      display: none;
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      pointer-events: none;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-snackbar__surface {
      background-color: #333
  }
  
  .mdc-snackbar__label {
      color: hsla(0,0%,100%,.87)
  }
  
  .mdc-snackbar__surface {
      min-width: 344px
  }
  
  @media (max-width: 344px),(max-width:480px) {
      .mdc-snackbar__surface {
          min-width:100%
      }
  }
  
  .mdc-snackbar__surface {
      max-width: 672px;
      -webkit-box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);
      border-radius: 4px
  }
  
  .mdc-snackbar--closing,.mdc-snackbar--open,.mdc-snackbar--opening {
      display: -ms-flexbox;
      display: flex
  }
  
  .mdc-snackbar--leading {
      -ms-flex-pack: start;
      justify-content: flex-start
  }
  
  .mdc-snackbar--stacked .mdc-snackbar__surface {
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-align: start;
      align-items: flex-start
  }
  
  .mdc-snackbar--stacked .mdc-snackbar__actions {
      -ms-flex-item-align: end;
      align-self: flex-end;
      margin-bottom: 8px
  }
  
  .mdc-snackbar__surface {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: start;
      justify-content: flex-start;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-transform: scale(.8);
      -ms-transform: scale(.8);
      transform: scale(.8);
      opacity: 0
  }
  
  .mdc-snackbar--open .mdc-snackbar__surface {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      opacity: 1;
      pointer-events: auto;
      -webkit-transition: opacity .15s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity .15s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms;
      -o-transition: opacity .15s 0ms cubic-bezier(0,0,.2,1),transform .15s 0ms cubic-bezier(0,0,.2,1);
      transition: opacity .15s cubic-bezier(0,0,.2,1) 0ms,transform .15s cubic-bezier(0,0,.2,1) 0ms;
      transition: opacity .15s cubic-bezier(0,0,.2,1) 0ms,transform .15s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms
  }
  
  .mdc-snackbar--closing .mdc-snackbar__surface {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      -webkit-transition: opacity 75ms cubic-bezier(.4,0,1,1) 0ms;
      -o-transition: opacity 75ms 0ms cubic-bezier(.4,0,1,1);
      transition: opacity 75ms cubic-bezier(.4,0,1,1) 0ms
  }
  
  .mdc-snackbar__label {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      -ms-flex-positive: 1;
      flex-grow: 1;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      padding: 14px 16px
  }
  
  .mdc-snackbar__label:before {
      display: inline;
      content: attr(data-mdc-snackbar-label-text)
  }
  
  .mdc-snackbar__actions {
      margin-left: 0;
      margin-right: 8px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .mdc-snackbar__actions[dir=rtl],[dir=rtl] .mdc-snackbar__actions {
      margin-left: 8px;
      margin-right: 0
  }
  
  .mdc-snackbar__action:not(:disabled) {
      color: #bb86fc
  }
  
  .mdc-snackbar__action:after,.mdc-snackbar__action:before {
      background-color: #bb86fc
  }
  
  .mdc-snackbar__action:hover:before {
      opacity: .08
  }
  
  .mdc-snackbar__action.mdc-ripple-upgraded--background-focused:before,.mdc-snackbar__action:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-snackbar__action:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-snackbar__action:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-snackbar__action.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.24
  }
  
  .mdc-snackbar__dismiss {
      color: hsla(0,0%,100%,.87)
  }
  
  .mdc-snackbar__dismiss:after,.mdc-snackbar__dismiss:before {
      background-color: hsla(0,0%,100%,.87)
  }
  
  .mdc-snackbar__dismiss:hover:before {
      opacity: .08
  }
  
  .mdc-snackbar__dismiss.mdc-ripple-upgraded--background-focused:before,.mdc-snackbar__dismiss:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-snackbar__dismiss:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-snackbar__dismiss:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-snackbar__dismiss.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.24
  }
  
  .mdc-snackbar__dismiss.mdc-snackbar__dismiss {
      width: 36px;
      height: 36px;
      padding: 9px;
      font-size: 18px
  }
  
  .mdc-snackbar__dismiss.mdc-snackbar__dismiss img,.mdc-snackbar__dismiss.mdc-snackbar__dismiss svg {
      width: 18px;
      height: 18px
  }
  
  .mdc-snackbar__action+.mdc-snackbar__dismiss {
      margin-left: 8px;
      margin-right: 0
  }
  
  .mdc-snackbar__action+.mdc-snackbar__dismiss[dir=rtl],[dir=rtl] .mdc-snackbar__action+.mdc-snackbar__dismiss {
      margin-left: 0;
      margin-right: 8px
  }
  
  .snackbar-hero .mdc-snackbar {
      position: relative
  }
  
  .snackbar-demo-button {
      margin: 8px 16px
  }
  
  .mdc-switch__thumb-underlay {
      left: -18px;
      right: auto;
      top: -17px;
      width: 48px;
      height: 48px
  }
  
  .mdc-switch__thumb-underlay[dir=rtl],[dir=rtl] .mdc-switch__thumb-underlay {
      left: auto;
      right: -18px
  }
  
  .mdc-switch__native-control {
      width: 68px;
      height: 48px
  }
  
  .mdc-switch {
      display: inline-block;
      position: relative;
      outline: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none
  }
  
  .mdc-switch.mdc-switch--checked .mdc-switch__thumb,.mdc-switch.mdc-switch--checked .mdc-switch__track {
      background-color: #018786;
      background-color: var(--mdc-theme-secondary,#018786);
      border-color: #018786;
      border-color: var(--mdc-theme-secondary,#018786)
  }
  
  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__track {
      background-color: #000;
      border-color: #000
  }
  
  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb {
      background-color: #fff;
      border-color: #fff
  }
  
  .mdc-switch__native-control {
      left: 0;
      right: auto;
      position: absolute;
      top: 0;
      margin: 0;
      opacity: 0;
      cursor: pointer;
      pointer-events: auto
  }
  
  .mdc-switch__native-control[dir=rtl],[dir=rtl] .mdc-switch__native-control {
      left: auto;
      right: 0
  }
  
  .mdc-switch__track {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 32px;
      height: 14px;
      border: 1px solid;
      border-radius: 7px;
      opacity: .38;
      -webkit-transition: opacity 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1),border-color 90ms cubic-bezier(.4,0,.2,1);
      -o-transition: opacity 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1),border-color 90ms cubic-bezier(.4,0,.2,1);
      transition: opacity 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1),border-color 90ms cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-switch__thumb-underlay {
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-transform: translateX(0);
      -ms-transform: translateX(0);
      transform: translateX(0);
      -webkit-transition: background-color 90ms cubic-bezier(.4,0,.2,1),border-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);
      transition: background-color 90ms cubic-bezier(.4,0,.2,1),border-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1);
      -o-transition: transform 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1),border-color 90ms cubic-bezier(.4,0,.2,1);
      transition: transform 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1),border-color 90ms cubic-bezier(.4,0,.2,1);
      transition: transform 90ms cubic-bezier(.4,0,.2,1),background-color 90ms cubic-bezier(.4,0,.2,1),border-color 90ms cubic-bezier(.4,0,.2,1),-webkit-transform 90ms cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-switch__thumb {
      -webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      border: 10px solid;
      border-radius: 50%;
      pointer-events: none;
      z-index: 1
  }
  
  .mdc-switch--checked .mdc-switch__track {
      opacity: .54
  }
  
  .mdc-switch--checked .mdc-switch__thumb-underlay {
      -webkit-transform: translateX(20px);
      -ms-transform: translateX(20px);
      transform: translateX(20px)
  }
  
  .mdc-switch--checked .mdc-switch__native-control,.mdc-switch--checked .mdc-switch__thumb-underlay[dir=rtl],[dir=rtl] .mdc-switch--checked .mdc-switch__thumb-underlay {
      -webkit-transform: translateX(-20px);
      -ms-transform: translateX(-20px);
      transform: translateX(-20px)
  }
  
  .mdc-switch--checked .mdc-switch__native-control[dir=rtl],[dir=rtl] .mdc-switch--checked .mdc-switch__native-control {
      -webkit-transform: translateX(20px);
      -ms-transform: translateX(20px);
      transform: translateX(20px)
  }
  
  .mdc-switch--disabled {
      opacity: .38;
      pointer-events: none
  }
  
  .mdc-switch--disabled .mdc-switch__thumb {
      border-width: 1px
  }
  
  .mdc-switch--disabled .mdc-switch__native-control {
      cursor: default;
      pointer-events: none
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay:after,.mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay:before {
      background-color: #9e9e9e
  }
  
  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay:hover:before {
      opacity: .08
  }
  
  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay.mdc-ripple-upgraded--background-focused:before,.mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb-underlay.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.24
  }
  
  .mdc-switch__thumb-underlay {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  .mdc-switch__thumb-underlay:after,.mdc-switch__thumb-underlay:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-switch__thumb-underlay:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-switch__thumb-underlay.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-switch__thumb-underlay.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-switch__thumb-underlay.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-switch__thumb-underlay.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-switch__thumb-underlay.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-switch__thumb-underlay:after,.mdc-switch__thumb-underlay:before {
      top: 0%;
      left: 0%;
      width: 100%;
      height: 100%
  }
  
  .mdc-switch__thumb-underlay.mdc-ripple-upgraded:after,.mdc-switch__thumb-underlay.mdc-ripple-upgraded:before {
      top: var(--mdc-ripple-top,0%);
      left: var(--mdc-ripple-left,0%);
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-switch__thumb-underlay.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-switch__thumb-underlay:after,.mdc-switch__thumb-underlay:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-switch__thumb-underlay:after,.mdc-switch__thumb-underlay:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-switch__thumb-underlay:hover:before {
      opacity: .04
  }
  
  .mdc-switch__thumb-underlay.mdc-ripple-upgraded--background-focused:before,.mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-switch__thumb-underlay:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-switch__thumb-underlay.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-switch+label {
      margin-left: 10px
  }
  
  .mdc-tab-bar {
      width: 100%
  }
  
  .mdc-tab {
      height: 48px
  }
  
  .mdc-tab--stacked {
      height: 72px
  }
  
  .mdc-tab-indicator {
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      -ms-flex-pack: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1
  }
  
  .mdc-tab-indicator .mdc-tab-indicator__content--underline {
      border-color: #6200ee;
      border-color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-tab-indicator .mdc-tab-indicator__content--icon {
      color: #018786;
      color: var(--mdc-theme-secondary,#018786)
  }
  
  .mdc-tab-indicator .mdc-tab-indicator__content--underline {
      border-top-width: 2px
  }
  
  .mdc-tab-indicator .mdc-tab-indicator__content--icon {
      height: 34px;
      font-size: 34px
  }
  
  .mdc-tab-indicator__content {
      -webkit-transform-origin: left;
      -ms-transform-origin: left;
      transform-origin: left;
      opacity: 0
  }
  
  .mdc-tab-indicator__content--underline {
      -ms-flex-item-align: end;
      align-self: flex-end;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      border-top-style: solid
  }
  
  .mdc-tab-indicator__content--icon {
      -ms-flex-item-align: center;
      align-self: center;
      margin: 0 auto
  }
  
  .mdc-tab-indicator--active .mdc-tab-indicator__content {
      opacity: 1
  }
  
  .mdc-tab-indicator .mdc-tab-indicator__content {
      -webkit-transition: -webkit-transform .25s cubic-bezier(.4,0,.2,1);
      transition: -webkit-transform .25s cubic-bezier(.4,0,.2,1);
      -o-transition: .25s transform cubic-bezier(.4,0,.2,1);
      transition: transform .25s cubic-bezier(.4,0,.2,1);
      transition: transform .25s cubic-bezier(.4,0,.2,1),-webkit-transform .25s cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-tab-indicator--no-transition .mdc-tab-indicator__content {
      -webkit-transition: none;
      -o-transition: none;
      transition: none
  }
  
  .mdc-tab-indicator--fade .mdc-tab-indicator__content {
      -webkit-transition: opacity .15s linear;
      -o-transition: .15s opacity linear;
      transition: opacity .15s linear
  }
  
  .mdc-tab-indicator--active.mdc-tab-indicator--fade .mdc-tab-indicator__content {
      -webkit-transition-delay: .1s;
      -o-transition-delay: .1s;
      transition-delay: .1s
  }
  
  .mdc-tab-scroller {
      overflow-y: hidden
  }
  
  .mdc-tab-scroller.mdc-tab-scroller--animating .mdc-tab-scroller__scroll-content {
      -webkit-transition: -webkit-transform .25s cubic-bezier(.4,0,.2,1);
      transition: -webkit-transform .25s cubic-bezier(.4,0,.2,1);
      -o-transition: .25s transform cubic-bezier(.4,0,.2,1);
      transition: transform .25s cubic-bezier(.4,0,.2,1);
      transition: transform .25s cubic-bezier(.4,0,.2,1),-webkit-transform .25s cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-tab-scroller__test {
      position: absolute;
      top: -9999px;
      width: 100px;
      height: 100px;
      overflow-x: scroll
  }
  
  .mdc-tab-scroller__scroll-area {
      -webkit-overflow-scrolling: touch;
      display: -ms-flexbox;
      display: flex;
      overflow-x: hidden
  }
  
  .mdc-tab-scroller__scroll-area::-webkit-scrollbar,.mdc-tab-scroller__test::-webkit-scrollbar {
      display: none
  }
  
  .mdc-tab-scroller__scroll-area--scroll {
      overflow-x: scroll
  }
  
  .mdc-tab-scroller__scroll-content {
      position: relative;
      display: -ms-flexbox;
      display: flex;
      -ms-flex: 1 0 auto;
      flex: 1 0 auto;
      -webkit-transform: none;
      -ms-transform: none;
      transform: none;
      will-change: transform
  }
  
  .mdc-tab-scroller--align-start .mdc-tab-scroller__scroll-content {
      -ms-flex-pack: start;
      justify-content: flex-start
  }
  
  .mdc-tab-scroller--align-end .mdc-tab-scroller__scroll-content {
      -ms-flex-pack: end;
      justify-content: flex-end
  }
  
  .mdc-tab-scroller--align-center .mdc-tab-scroller__scroll-content {
      -ms-flex-pack: center;
      justify-content: center
  }
  
  .mdc-tab-scroller--animating .mdc-tab-scroller__scroll-area {
      -webkit-overflow-scrolling: auto
  }
  
  .mdc-tab {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 2.25rem;
      font-weight: 500;
      letter-spacing: .0892857143em;
      text-decoration: none;
      text-transform: uppercase;
      padding: 0 24px;
      position: relative;
      display: -ms-flexbox;
      display: flex;
      -ms-flex: 1 0 auto;
      flex: 1 0 auto;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      border: none;
      outline: none;
      background: none;
      text-align: center;
      white-space: nowrap;
      cursor: pointer;
      -webkit-appearance: none;
      z-index: 1
  }
  
  .mdc-tab .mdc-tab__text-label {
      color: rgba(0,0,0,.6)
  }
  
  .mdc-tab .mdc-tab__icon {
      color: rgba(0,0,0,.54);
      fill: currentColor
  }
  
  .mdc-tab::-moz-focus-inner {
      padding: 0;
      border: 0
  }
  
  .mdc-tab--min-width {
      -ms-flex: 0 1 auto;
      flex: 0 1 auto
  }
  
  .mdc-tab__content {
      position: relative;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      height: inherit;
      pointer-events: none
  }
  
  .mdc-tab__text-label {
      display: inline-block;
      line-height: 1
  }
  
  .mdc-tab__icon,.mdc-tab__text-label {
      -webkit-transition: color .15s linear;
      -o-transition: .15s color linear;
      transition: color .15s linear;
      z-index: 2
  }
  
  .mdc-tab__icon {
      width: 24px;
      height: 24px;
      font-size: 24px
  }
  
  .mdc-tab--stacked .mdc-tab__content {
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center
  }
  
  .mdc-tab--stacked .mdc-tab__text-label {
      padding-top: 6px;
      padding-bottom: 4px
  }
  
  .mdc-tab--active .mdc-tab__icon,.mdc-tab--active .mdc-tab__text-label {
      color: #6200ee;
      color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-tab--active .mdc-tab__icon {
      fill: currentColor
  }
  
  .mdc-tab--active .mdc-tab__icon,.mdc-tab--active .mdc-tab__text-label {
      -webkit-transition-delay: .1s;
      -o-transition-delay: .1s;
      transition-delay: .1s
  }
  
  .mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label {
      padding-left: 8px;
      padding-right: 0
  }
  
  .mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label[dir=rtl],[dir=rtl] .mdc-tab:not(.mdc-tab--stacked) .mdc-tab__icon+.mdc-tab__text-label {
      padding-left: 0;
      padding-right: 8px
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-tab__ripple {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden
  }
  
  .mdc-tab__ripple:after,.mdc-tab__ripple:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-tab__ripple:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-tab__ripple.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-tab__ripple.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-tab__ripple.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-tab__ripple.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-tab__ripple.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-tab__ripple:after,.mdc-tab__ripple:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .mdc-tab__ripple.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-tab__ripple:after,.mdc-tab__ripple:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-tab__ripple:after,.mdc-tab__ripple:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .mdc-tab__ripple:hover:before {
      opacity: .04
  }
  
  .mdc-tab__ripple.mdc-ripple-upgraded--background-focused:before,.mdc-tab__ripple:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-tab__ripple:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-tab__ripple:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-tab__ripple.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-drawer {
      border-color: rgba(0,0,0,.12);
      background-color: #fff;
      border-radius: 0 0 0 0;
      z-index: 6;
      width: 256px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: 100%;
      border-right-width: 1px;
      border-right-style: solid;
      overflow: hidden;
      -webkit-transition-property: -webkit-transform;
      transition-property: -webkit-transform;
      -o-transition-property: transform;
      transition-property: transform;
      transition-property: transform,-webkit-transform;
      -webkit-transition-timing-function: cubic-bezier(.4,0,.2,1);
      -o-transition-timing-function: cubic-bezier(.4,0,.2,1);
      transition-timing-function: cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-drawer .mdc-drawer__title {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-drawer .mdc-drawer__subtitle,.mdc-drawer .mdc-list-group__subheader,.mdc-drawer .mdc-list-item__graphic {
      color: rgba(0,0,0,.6)
  }
  
  .mdc-drawer .mdc-list-item {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-drawer .mdc-list-item--activated .mdc-list-item__graphic {
      color: #6200ee
  }
  
  .mdc-drawer .mdc-list-item--activated {
      color: rgba(98,0,238,.87)
  }
  
  .mdc-drawer[dir=rtl],[dir=rtl] .mdc-drawer {
      border-radius: 0 0 0 0
  }
  
  .mdc-drawer .mdc-list-item {
      border-radius: 4px
  }
  
  .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing)+.mdc-drawer-app-content {
      margin-left: 256px;
      margin-right: 0
  }
  
  .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing)+.mdc-drawer-app-content[dir=rtl],[dir=rtl] .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing)+.mdc-drawer-app-content {
      margin-left: 0;
      margin-right: 256px
  }
  
  .mdc-drawer[dir=rtl],[dir=rtl] .mdc-drawer {
      border-right-width: 0;
      border-left-width: 1px;
      border-right-style: none;
      border-left-style: solid
  }
  
  .mdc-drawer .mdc-list-item {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.375rem;
      font-weight: 500;
      letter-spacing: .0071428571em;
      text-decoration: inherit;
      text-transform: inherit;
      height: 40px;
      margin: 8px;
      padding: 0 8px
  }
  
  .mdc-drawer .mdc-list-item:first-child {
      margin-top: 2px
  }
  
  .mdc-drawer .mdc-list-item:last-child {
      margin-bottom: 0
  }
  
  .mdc-drawer .mdc-list-group__subheader {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin: 0;
      padding: 0 16px
  }
  
  .mdc-drawer .mdc-list-group__subheader:before {
      display: inline-block;
      width: 0;
      height: 24px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-drawer .mdc-list-divider {
      margin: 3px 0 4px
  }
  
  .mdc-drawer .mdc-list-item__graphic,.mdc-drawer .mdc-list-item__text {
      pointer-events: none
  }
  
  .mdc-drawer--animate {
      -webkit-transform: translateX(-100%);
      -ms-transform: translateX(-100%);
      transform: translateX(-100%)
  }
  
  .mdc-drawer--animate[dir=rtl],[dir=rtl] .mdc-drawer--animate {
      -webkit-transform: translateX(100%);
      -ms-transform: translateX(100%);
      transform: translateX(100%)
  }
  
  .mdc-drawer--opening {
      -webkit-transition-duration: .25s;
      -o-transition-duration: .25s;
      transition-duration: .25s
  }
  
  .mdc-drawer--opening,.mdc-drawer--opening[dir=rtl],[dir=rtl] .mdc-drawer--opening {
      -webkit-transform: translateX(0);
      -ms-transform: translateX(0);
      transform: translateX(0)
  }
  
  .mdc-drawer--closing {
      -webkit-transform: translateX(-100%);
      -ms-transform: translateX(-100%);
      transform: translateX(-100%);
      -webkit-transition-duration: .2s;
      -o-transition-duration: .2s;
      transition-duration: .2s
  }
  
  .mdc-drawer--closing[dir=rtl],[dir=rtl] .mdc-drawer--closing {
      -webkit-transform: translateX(100%);
      -ms-transform: translateX(100%);
      transform: translateX(100%)
  }
  
  .mdc-drawer__header {
      -ms-flex-negative: 0;
      flex-shrink: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      min-height: 64px;
      padding: 0 16px 4px
  }
  
  .mdc-drawer__title {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 500;
      letter-spacing: .0125em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin-bottom: -20px
  }
  
  .mdc-drawer__title:before {
      display: inline-block;
      width: 0;
      height: 36px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-drawer__title:after {
      display: inline-block;
      width: 0;
      height: 20px;
      content: "";
      vertical-align: -20px
  }
  
  .mdc-drawer__subtitle {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin-bottom: 0
  }
  
  .mdc-drawer__subtitle:before {
      display: inline-block;
      width: 0;
      height: 20px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-drawer__content {
      height: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch
  }
  
  .mdc-drawer--dismissible {
      left: 0;
      right: auto;
      display: none;
      position: absolute
  }
  
  .mdc-drawer--dismissible[dir=rtl],[dir=rtl] .mdc-drawer--dismissible {
      left: auto;
      right: 0
  }
  
  .mdc-drawer--dismissible.mdc-drawer--open {
      display: -ms-flexbox;
      display: flex
  }
  
  .mdc-drawer-app-content {
      position: relative
  }
  
  .mdc-drawer-app-content,.mdc-drawer-app-content[dir=rtl],[dir=rtl] .mdc-drawer-app-content {
      margin-left: 0;
      margin-right: 0
  }
  
  .mdc-drawer--modal {
      -webkit-box-shadow: 0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);
      box-shadow: 0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);
      left: 0;
      right: auto;
      display: none;
      position: fixed
  }
  
  .mdc-drawer--modal+.mdc-drawer-scrim {
      background-color: rgba(0,0,0,.32)
  }
  
  .mdc-drawer--modal[dir=rtl],[dir=rtl] .mdc-drawer--modal {
      left: auto;
      right: 0
  }
  
  .mdc-drawer--modal.mdc-drawer--open {
      display: -ms-flexbox;
      display: flex
  }
  
  .mdc-drawer-scrim {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      -webkit-transition-property: opacity;
      -o-transition-property: opacity;
      transition-property: opacity;
      -webkit-transition-timing-function: cubic-bezier(.4,0,.2,1);
      -o-transition-timing-function: cubic-bezier(.4,0,.2,1);
      transition-timing-function: cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-drawer--open+.mdc-drawer-scrim {
      display: block
  }
  
  .mdc-drawer--animate+.mdc-drawer-scrim {
      opacity: 0
  }
  
  .mdc-drawer--opening+.mdc-drawer-scrim {
      -webkit-transition-duration: .25s;
      -o-transition-duration: .25s;
      transition-duration: .25s;
      opacity: 1
  }
  
  .mdc-drawer--closing+.mdc-drawer-scrim {
      -webkit-transition-duration: .2s;
      -o-transition-duration: .2s;
      transition-duration: .2s;
      opacity: 0
  }
  
  .hero {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-flow: row nowrap;
      flex-flow: row nowrap;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      min-height: 360px;
      background-color: #f2f2f2;
      overflow: auto
  }
  
  .sidebar-active {
      font-weight: 600
  }
  
  .demo-title {
      border-bottom: 1px solid rgba(0,0,0,.87)
  }
  
  .resources-graphic {
      width: 30px;
      height: 30px
  }
  
  .demo-panel {
      display: -ms-flexbox;
      display: flex;
      position: relative;
      height: 100vh;
      overflow: hidden
  }
  
  .mdc-drawer--dismissible.demo-drawer {
      z-index: 1
  }
  
  .demo-drawer {
      height: 100%
  }
  
  .demo-drawer .mdc-list-item {
      cursor: pointer
  }
  
  .demo-drawer-header {
      position: absolute;
      top: 18px;
      opacity: .74
  }
  
  .demo-content {
      height: 100%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      max-width: 100%;
      padding: 40px 16px 100px;
      -webkit-transition: -webkit-transform .2s cubic-bezier(.4,0,.2,1) 50ms;
      transition: -webkit-transform .2s cubic-bezier(.4,0,.2,1) 50ms;
      -o-transition: .2s transform cubic-bezier(.4,0,.2,1) 50ms;
      transition: transform .2s cubic-bezier(.4,0,.2,1) 50ms;
      transition: transform .2s cubic-bezier(.4,0,.2,1) 50ms,-webkit-transform .2s cubic-bezier(.4,0,.2,1) 50ms;
      width: 100%;
      overflow: auto;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: start;
      justify-content: flex-start
  }
  
  @supports (-webkit-overflow-scrolling:touch) {
      .demo-content {
          overflow: scroll;
          -webkit-overflow-scrolling: touch
      }
  }
  
  .demo-content-transition {
      width: 100%;
      max-width: 1200px
  }
  
  .loadComponent-enter {
      opacity: 0;
      -webkit-transform: translateY(15px);
      -ms-transform: translateY(15px);
      transform: translateY(15px)
  }
  
  .loadComponent-enter.loadComponent-enter-active {
      opacity: 1;
      -webkit-transform: translateY(0);
      -ms-transform: translateY(0);
      transform: translateY(0);
      -webkit-transition: all 235ms linear .1s;
      -o-transition: all 235ms linear .1s;
      transition: all 235ms linear .1s
  }
  
  .loadComponent-enter.loadComponent-enter-active .mdc-snackbar,.loadComponent-exit,.loadComponent-exit-active,.loadComponent-exit-done {
      display: none
  }
  
  .mdc-top-app-bar {
      background-color: #6200ee;
      background-color: var(--mdc-theme-primary,#6200ee);
      color: #fff;
      display: -ms-flexbox;
      display: flex;
      position: fixed;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      z-index: 4
  }
  
  .mdc-top-app-bar .mdc-top-app-bar__action-item,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon {
      color: #fff;
      color: var(--mdc-theme-on-primary,#fff)
  }
  
  .mdc-top-app-bar .mdc-top-app-bar__action-item:after,.mdc-top-app-bar .mdc-top-app-bar__action-item:before,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon:after,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon:before {
      background-color: #fff
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-top-app-bar .mdc-top-app-bar__action-item:after,.mdc-top-app-bar .mdc-top-app-bar__action-item:before,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon:after,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon:before {
          background-color: var(--mdc-theme-on-primary,#fff)
      }
  }
  
  .mdc-top-app-bar .mdc-top-app-bar__action-item:hover:before,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon:hover:before {
      opacity: .08
  }
  
  .mdc-top-app-bar .mdc-top-app-bar__action-item.mdc-ripple-upgraded--background-focused:before,.mdc-top-app-bar .mdc-top-app-bar__action-item:not(.mdc-ripple-upgraded):focus:before,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon.mdc-ripple-upgraded--background-focused:before,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-top-app-bar .mdc-top-app-bar__action-item:not(.mdc-ripple-upgraded):after,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-top-app-bar .mdc-top-app-bar__action-item:not(.mdc-ripple-upgraded):active:after,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  .mdc-top-app-bar .mdc-top-app-bar__action-item.mdc-ripple-upgraded,.mdc-top-app-bar .mdc-top-app-bar__navigation-icon.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.24
  }
  
  .mdc-top-app-bar__row {
      display: -ms-flexbox;
      display: flex;
      position: relative;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 64px
  }
  
  .mdc-top-app-bar__section {
      display: -ms-inline-flexbox;
      display: inline-flex;
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      -ms-flex-align: center;
      align-items: center;
      min-width: 0;
      padding: 8px 12px;
      z-index: 1
  }
  
  .mdc-top-app-bar__section--align-start {
      -ms-flex-pack: start;
      justify-content: flex-start;
      -ms-flex-order: -1;
      order: -1
  }
  
  .mdc-top-app-bar__section--align-end {
      -ms-flex-pack: end;
      justify-content: flex-end;
      -ms-flex-order: 1;
      order: 1
  }
  
  .mdc-top-app-bar__title {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 500;
      letter-spacing: .0125em;
      text-decoration: inherit;
      text-transform: inherit;
      padding-left: 20px;
      padding-right: 0;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      z-index: 1
  }
  
  .mdc-top-app-bar__title[dir=rtl],[dir=rtl] .mdc-top-app-bar__title {
      padding-left: 0;
      padding-right: 20px
  }
  
  .mdc-top-app-bar--short-collapsed {
      border-radius: 0 0 24px 0
  }
  
  .mdc-top-app-bar--short-collapsed[dir=rtl],[dir=rtl] .mdc-top-app-bar--short-collapsed {
      border-radius: 0 0 0 24px
  }
  
  .mdc-top-app-bar--short {
      top: 0;
      right: auto;
      left: 0;
      width: 100%;
      -webkit-transition: width .25s cubic-bezier(.4,0,.2,1);
      -o-transition: width .25s cubic-bezier(.4,0,.2,1);
      transition: width .25s cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-top-app-bar--short[dir=rtl],[dir=rtl] .mdc-top-app-bar--short {
      right: 0;
      left: auto
  }
  
  .mdc-top-app-bar--short .mdc-top-app-bar__row {
      height: 56px
  }
  
  .mdc-top-app-bar--short .mdc-top-app-bar__section {
      padding: 4px
  }
  
  .mdc-top-app-bar--short .mdc-top-app-bar__title {
      -webkit-transition: opacity .2s cubic-bezier(.4,0,.2,1);
      -o-transition: opacity .2s cubic-bezier(.4,0,.2,1);
      transition: opacity .2s cubic-bezier(.4,0,.2,1);
      opacity: 1
  }
  
  .mdc-top-app-bar--short-collapsed {
      -webkit-box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);
      box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);
      width: 56px;
      -webkit-transition: width .3s cubic-bezier(.4,0,.2,1);
      -o-transition: width .3s cubic-bezier(.4,0,.2,1);
      transition: width .3s cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-top-app-bar--short-collapsed .mdc-top-app-bar__title {
      display: none
  }
  
  .mdc-top-app-bar--short-collapsed .mdc-top-app-bar__action-item {
      -webkit-transition: padding .15s cubic-bezier(.4,0,.2,1);
      -o-transition: padding .15s cubic-bezier(.4,0,.2,1);
      transition: padding .15s cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-top-app-bar--short-collapsed.mdc-top-app-bar--short-has-action-item {
      width: 112px
  }
  
  .mdc-top-app-bar--short-collapsed.mdc-top-app-bar--short-has-action-item .mdc-top-app-bar__section--align-end {
      padding-left: 0;
      padding-right: 12px
  }
  
  .mdc-top-app-bar--short-collapsed.mdc-top-app-bar--short-has-action-item .mdc-top-app-bar__section--align-end[dir=rtl],[dir=rtl] .mdc-top-app-bar--short-collapsed.mdc-top-app-bar--short-has-action-item .mdc-top-app-bar__section--align-end {
      padding-left: 12px;
      padding-right: 0
  }
  
  .mdc-top-app-bar--dense .mdc-top-app-bar__row {
      height: 48px
  }
  
  .mdc-top-app-bar--dense .mdc-top-app-bar__section {
      padding: 0 4px
  }
  
  .mdc-top-app-bar--dense .mdc-top-app-bar__title {
      padding-left: 12px;
      padding-right: 0
  }
  
  .mdc-top-app-bar--dense .mdc-top-app-bar__title[dir=rtl],[dir=rtl] .mdc-top-app-bar--dense .mdc-top-app-bar__title {
      padding-left: 0;
      padding-right: 12px
  }
  
  .mdc-top-app-bar--prominent .mdc-top-app-bar__row {
      height: 128px
  }
  
  .mdc-top-app-bar--prominent .mdc-top-app-bar__title {
      -ms-flex-item-align: end;
      align-self: flex-end;
      padding-bottom: 2px
  }
  
  .mdc-top-app-bar--prominent .mdc-top-app-bar__action-item,.mdc-top-app-bar--prominent .mdc-top-app-bar__navigation-icon {
      -ms-flex-item-align: start;
      align-self: flex-start
  }
  
  .mdc-top-app-bar--fixed,.mdc-top-app-bar--fixed-scrolled {
      -webkit-transition: -webkit-box-shadow .2s linear;
      transition: -webkit-box-shadow .2s linear;
      -o-transition: box-shadow .2s linear;
      transition: box-shadow .2s linear;
      transition: box-shadow .2s linear,-webkit-box-shadow .2s linear
  }
  
  .mdc-top-app-bar--fixed-scrolled {
      -webkit-box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);
      box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)
  }
  
  .mdc-top-app-bar--dense.mdc-top-app-bar--prominent .mdc-top-app-bar__row {
      height: 96px
  }
  
  .mdc-top-app-bar--dense.mdc-top-app-bar--prominent .mdc-top-app-bar__section {
      padding: 0 12px
  }
  
  .mdc-top-app-bar--dense.mdc-top-app-bar--prominent .mdc-top-app-bar__title {
      padding-left: 20px;
      padding-right: 0;
      padding-bottom: 9px
  }
  
  .mdc-top-app-bar--dense.mdc-top-app-bar--prominent .mdc-top-app-bar__title[dir=rtl],[dir=rtl] .mdc-top-app-bar--dense.mdc-top-app-bar--prominent .mdc-top-app-bar__title {
      padding-left: 0;
      padding-right: 20px
  }
  
  .mdc-top-app-bar--fixed-adjust {
      padding-top: 64px
  }
  
  .mdc-top-app-bar--dense-fixed-adjust {
      padding-top: 48px
  }
  
  .mdc-top-app-bar--short-fixed-adjust {
      padding-top: 56px
  }
  
  .mdc-top-app-bar--prominent-fixed-adjust {
      padding-top: 128px
  }
  
  .mdc-top-app-bar--dense-prominent-fixed-adjust {
      padding-top: 96px
  }
  
  @media (max-width: 599px) {
      .mdc-top-app-bar__row {
          height:56px
      }
  
      .mdc-top-app-bar__section {
          padding: 4px
      }
  
      .mdc-top-app-bar--short {
          -webkit-transition: width .2s cubic-bezier(.4,0,.2,1);
          -o-transition: width .2s cubic-bezier(.4,0,.2,1);
          transition: width .2s cubic-bezier(.4,0,.2,1)
      }
  
      .mdc-top-app-bar--short-collapsed {
          -webkit-transition: width .25s cubic-bezier(.4,0,.2,1);
          -o-transition: width .25s cubic-bezier(.4,0,.2,1);
          transition: width .25s cubic-bezier(.4,0,.2,1)
      }
  
      .mdc-top-app-bar--short-collapsed .mdc-top-app-bar__section--align-end {
          padding-left: 0;
          padding-right: 12px
      }
  
      .mdc-top-app-bar--short-collapsed .mdc-top-app-bar__section--align-end[dir=rtl],[dir=rtl] .mdc-top-app-bar--short-collapsed .mdc-top-app-bar__section--align-end {
          padding-left: 12px;
          padding-right: 0
      }
  
      .mdc-top-app-bar--prominent .mdc-top-app-bar__title {
          padding-bottom: 6px
      }
  
      .mdc-top-app-bar--fixed-adjust {
          padding-top: 56px
      }
  }
  
  .catalog-top-app-bar {
      background-color: #212121;
      position: absolute
  }
  
  .catalog-top-app-bar__title {
      text-transform: uppercase;
      font-family: Roboto Mono,serif;
      font-weight: 400
  }
  
  .catalog-top-app-bar__title--small-screen {
      display: none
  }
  
  @media (max-width: 599px) {
      .catalog-top-app-bar__title--small-screen {
          display:inline-block
      }
  
      .catalog-top-app-bar__title--large-screen {
          display: none
      }
  }
  
  .catalog-page-container {
      position: relative
  }
  
  .top-app-bar__frame {
      height: 200vh
  }
  
  .mdc-drawer {
      border-color: rgba(0,0,0,.12);
      background-color: #fff;
      border-radius: 0 0 0 0;
      z-index: 6;
      width: 256px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: 100%;
      border-right-width: 1px;
      border-right-style: solid;
      overflow: hidden;
      -webkit-transition-property: -webkit-transform;
      transition-property: -webkit-transform;
      -o-transition-property: transform;
      transition-property: transform;
      transition-property: transform,-webkit-transform;
      -webkit-transition-timing-function: cubic-bezier(.4,0,.2,1);
      -o-transition-timing-function: cubic-bezier(.4,0,.2,1);
      transition-timing-function: cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-drawer .mdc-drawer__title {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-drawer .mdc-drawer__subtitle,.mdc-drawer .mdc-list-group__subheader,.mdc-drawer .mdc-list-item__graphic {
      color: rgba(0,0,0,.6)
  }
  
  .mdc-drawer .mdc-list-item {
      color: rgba(0,0,0,.87)
  }
  
  .mdc-drawer .mdc-list-item--activated .mdc-list-item__graphic {
      color: #6200ee
  }
  
  .mdc-drawer .mdc-list-item--activated {
      color: rgba(98,0,238,.87)
  }
  
  .mdc-drawer[dir=rtl],[dir=rtl] .mdc-drawer {
      border-radius: 0 0 0 0
  }
  
  .mdc-drawer .mdc-list-item {
      border-radius: 4px
  }
  
  .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing)+.mdc-drawer-app-content {
      margin-left: 256px;
      margin-right: 0
  }
  
  .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing)+.mdc-drawer-app-content[dir=rtl],[dir=rtl] .mdc-drawer.mdc-drawer--open:not(.mdc-drawer--closing)+.mdc-drawer-app-content {
      margin-left: 0;
      margin-right: 256px
  }
  
  .mdc-drawer[dir=rtl],[dir=rtl] .mdc-drawer {
      border-right-width: 0;
      border-left-width: 1px;
      border-right-style: none;
      border-left-style: solid
  }
  
  .mdc-drawer .mdc-list-item {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      /* line-height: 1.375rem; */
      font-weight: 500;
      letter-spacing: .0071428571em;
      text-decoration: inherit;
      text-transform: inherit;
      height: 40px;
      margin: 8px;
      padding: 0 8px
  }
  
  .mdc-drawer .mdc-list-item:first-child {
      margin-top: 2px
  }
  
  .mdc-drawer .mdc-list-item:last-child {
      margin-bottom: 0
  }
  
  .mdc-drawer .mdc-list-group__subheader {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin: 0;
      padding: 0 16px
  }
  
  .mdc-drawer .mdc-list-group__subheader:before {
      display: inline-block;
      width: 0;
      height: 24px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-drawer .mdc-list-divider {
      margin: 3px 0 4px
  }
  
  .mdc-drawer .mdc-list-item__graphic,.mdc-drawer .mdc-list-item__text {
      pointer-events: none
  }
  
  .mdc-drawer--animate {
      -webkit-transform: translateX(-100%);
      -ms-transform: translateX(-100%);
      transform: translateX(-100%)
  }
  
  .mdc-drawer--animate[dir=rtl],[dir=rtl] .mdc-drawer--animate {
      -webkit-transform: translateX(100%);
      -ms-transform: translateX(100%);
      transform: translateX(100%)
  }
  
  .mdc-drawer--opening {
      -webkit-transition-duration: .25s;
      -o-transition-duration: .25s;
      transition-duration: .25s
  }
  
  .mdc-drawer--opening,.mdc-drawer--opening[dir=rtl],[dir=rtl] .mdc-drawer--opening {
      -webkit-transform: translateX(0);
      -ms-transform: translateX(0);
      transform: translateX(0)
  }
  
  .mdc-drawer--closing {
      -webkit-transform: translateX(-100%);
      -ms-transform: translateX(-100%);
      transform: translateX(-100%);
      -webkit-transition-duration: .2s;
      -o-transition-duration: .2s;
      transition-duration: .2s
  }
  
  .mdc-drawer--closing[dir=rtl],[dir=rtl] .mdc-drawer--closing {
      -webkit-transform: translateX(100%);
      -ms-transform: translateX(100%);
      transform: translateX(100%)
  }
  
  .mdc-drawer__header {
      -ms-flex-negative: 0;
      flex-shrink: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      min-height: 64px;
      padding: 0 16px 4px
  }
  
  .mdc-drawer__title {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 500;
      letter-spacing: .0125em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin-bottom: -20px
  }
  
  .mdc-drawer__title:before {
      display: inline-block;
      width: 0;
      height: 36px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-drawer__title:after {
      display: inline-block;
      width: 0;
      height: 20px;
      content: "";
      vertical-align: -20px
  }
  
  .mdc-drawer__subtitle {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      display: block;
      margin-top: 0;
      line-height: normal;
      margin-bottom: 0
  }
  
  .mdc-drawer__subtitle:before {
      display: inline-block;
      width: 0;
      height: 20px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-drawer__content {
      height: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch
  }
  
  .mdc-drawer--dismissible {
      left: 0;
      right: auto;
      display: none;
      position: absolute
  }
  
  .mdc-drawer--dismissible[dir=rtl],[dir=rtl] .mdc-drawer--dismissible {
      left: auto;
      right: 0
  }
  
  .mdc-drawer--dismissible.mdc-drawer--open {
      display: -ms-flexbox;
      display: flex
  }
  
  .mdc-drawer-app-content {
      position: relative
  }
  
  .mdc-drawer-app-content,.mdc-drawer-app-content[dir=rtl],[dir=rtl] .mdc-drawer-app-content {
      margin-left: 0;
      margin-right: 0
  }
  
  .mdc-drawer--modal {
      -webkit-box-shadow: 0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);
      box-shadow: 0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);
      left: 0;
      right: auto;
      display: none;
      position: fixed
  }
  
  .mdc-drawer--modal+.mdc-drawer-scrim {
      background-color: rgba(0,0,0,.32)
  }
  
  .mdc-drawer--modal[dir=rtl],[dir=rtl] .mdc-drawer--modal {
      left: auto;
      right: 0
  }
  
  .mdc-drawer--modal.mdc-drawer--open {
      display: -ms-flexbox;
      display: flex
  }
  
  .mdc-drawer-scrim {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      -webkit-transition-property: opacity;
      -o-transition-property: opacity;
      transition-property: opacity;
      -webkit-transition-timing-function: cubic-bezier(.4,0,.2,1);
      -o-transition-timing-function: cubic-bezier(.4,0,.2,1);
      transition-timing-function: cubic-bezier(.4,0,.2,1)
  }
  
  .mdc-drawer--open+.mdc-drawer-scrim {
      display: block
  }
  
  .mdc-drawer--animate+.mdc-drawer-scrim {
      opacity: 0
  }
  
  .mdc-drawer--opening+.mdc-drawer-scrim {
      -webkit-transition-duration: .25s;
      -o-transition-duration: .25s;
      transition-duration: .25s;
      opacity: 1
  }
  
  .mdc-drawer--closing+.mdc-drawer-scrim {
      -webkit-transition-duration: .2s;
      -o-transition-duration: .2s;
      transition-duration: .2s;
      opacity: 0
  }
  
  .drawer-frame-root {
      display: -ms-flexbox;
      display: flex;
      height: 100vh
  }
  
  .drawer-app-content {
      -ms-flex: auto;
      flex: auto;
      overflow: auto
  }
  
  .drawer-main-content {
      overflow: auto;
      height: 100%;
      padding: 0 18px
  }
  
  .drawer-top-app-bar {
      position: absolute
  }
  
  .drawer-frame-app-content {
      position: relative
  }
  
  .mdc-typography {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased
  }
  
  .mdc-typography--headline1 {
      font-size: 6rem;
      line-height: 6rem;
      letter-spacing: -.015625em
  }
  
  .mdc-typography--headline1,.mdc-typography--headline2 {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-weight: 300;
      text-decoration: inherit;
      text-transform: inherit
  }
  
  .mdc-typography--headline2 {
      font-size: 3.75rem;
      line-height: 3.75rem;
      letter-spacing: -.0083333333em
  }
  
  .mdc-typography--headline3 {
      font-size: 3rem;
      line-height: 3.125rem;
      letter-spacing: normal
  }
  
  .mdc-typography--headline3,.mdc-typography--headline4 {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-weight: 400;
      text-decoration: inherit;
      text-transform: inherit
  }
  
  .mdc-typography--headline4 {
      font-size: 2.125rem;
      line-height: 2.5rem;
      letter-spacing: .0073529412em
  }
  
  .mdc-typography--headline5 {
      font-size: 1.5rem;
      font-weight: 400;
      letter-spacing: normal
  }
  
  .mdc-typography--headline5,.mdc-typography--headline6 {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      line-height: 2rem;
      text-decoration: inherit;
      text-transform: inherit
  }
  
  .mdc-typography--headline6 {
      font-size: 1.25rem;
      font-weight: 500;
      letter-spacing: .0125em
  }
  
  .mdc-typography--subtitle1 {
      font-size: 1rem;
      line-height: 1.75rem;
      font-weight: 400;
      letter-spacing: .009375em
  }
  
  .mdc-typography--subtitle1,.mdc-typography--subtitle2 {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      text-decoration: inherit;
      text-transform: inherit
  }
  
  .mdc-typography--subtitle2 {
      font-size: .875rem;
      line-height: 1.375rem;
      font-weight: 500;
      letter-spacing: .0071428571em
  }
  
  .mdc-typography--body1 {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 400;
      letter-spacing: .03125em;
      text-decoration: inherit;
      text-transform: inherit
  }
  
  .mdc-typography--body2 {
      font-size: .875rem;
      letter-spacing: .0178571429em
  }
  
  .mdc-typography--body2,.mdc-typography--caption {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      line-height: 1.25rem;
      font-weight: 400;
      text-decoration: inherit;
      text-transform: inherit
  }
  
  .mdc-typography--caption {
      font-size: .75rem;
      letter-spacing: .0333333333em
  }
  
  .mdc-typography--button {
      font-size: .875rem;
      line-height: 2.25rem;
      letter-spacing: .0892857143em
  }
  
  .mdc-typography--button,.mdc-typography--overline {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-weight: 500;
      text-decoration: none;
      text-transform: uppercase
  }
  
  .mdc-typography--overline {
      font-size: .75rem;
      line-height: 2rem;
      letter-spacing: .1666666667em
  }
  
  .mdc-image-list {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      margin: 0 auto;
      padding: 0
  }
  
  .mdc-image-list__image-aspect-container,.mdc-image-list__item {
      position: relative;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
  }
  
  .mdc-image-list__item {
      list-style-type: none
  }
  
  .mdc-image-list__image {
      width: 100%
  }
  
  .mdc-image-list__image-aspect-container .mdc-image-list__image {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 100%;
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: cover
  }
  
  .mdc-image-list__image-aspect-container {
      padding-bottom: 100%
  }
  
  .mdc-image-list__image {
      border-radius: 0
  }
  
  .mdc-image-list--with-text-protection .mdc-image-list__supporting {
      border-radius: 0 0 0 0
  }
  
  .mdc-image-list__supporting {
      color: rgba(0,0,0,.87);
      color: var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87));
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 8px 0;
      line-height: 24px
  }
  
  .mdc-image-list__label {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 
      1rem;
      line-height: 1.75rem;
      font-weight: 400;
      letter-spacing: .009375em;
      text-decoration: inherit;
      text-transform: inherit;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden
  }
  
  .mdc-image-list--with-text-protection .mdc-image-list__supporting {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 48px;
      padding: 0 16px;
      background: rgba(0,0,0,.6);
      color: #fff
  }
  
  .mdc-image-list--masonry {
      display: block
  }
  
  .mdc-image-list--masonry .mdc-image-list__item {
      -webkit-column-break-inside: avoid;
      break-inside: avoid-column
  }
  
  .mdc-image-list--masonry .mdc-image-list__image {
      display: block;
      height: auto
  }
  
  @-webkit-keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @keyframes mdc-ripple-fg-radius-in {
      0% {
          -webkit-animation-timing-function: cubic-bezier(.4,0,.2,1);
          animation-timing-function: cubic-bezier(.4,0,.2,1);
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);
          transform: translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)
      }
  
      to {
          -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
          transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-in {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: 0
      }
  
      to {
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  }
  
  @-webkit-keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  @keyframes mdc-ripple-fg-opacity-out {
      0% {
          -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
          opacity: var(--mdc-ripple-fg-opacity,0)
      }
  
      to {
          opacity: 0
      }
  }
  
  .mdc-ripple-surface--test-edge-var-bug {
      --mdc-ripple-surface-test-edge-var: 1px solid #000;
      visibility: hidden
  }
  
  .mdc-ripple-surface--test-edge-var-bug:before {
      border: var(--mdc-ripple-surface-test-edge-var)
  }
  
  .mdc-ripple-surface {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      position: relative;
      outline: none;
      overflow: hidden
  }
  
  .mdc-ripple-surface:after,.mdc-ripple-surface:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  .mdc-ripple-surface:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  .mdc-ripple-surface:after,.mdc-ripple-surface:before {
      background-color: #000
  }
  
  .mdc-ripple-surface:hover:before {
      opacity: .04
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded--background-focused:before,.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-ripple-surface:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-ripple-surface:after,.mdc-ripple-surface:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  .mdc-ripple-surface.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-ripple-surface[data-mdc-ripple-is-unbounded] {
      overflow: visible
  }
  
  .mdc-ripple-surface[data-mdc-ripple-is-unbounded]:after,.mdc-ripple-surface[data-mdc-ripple-is-unbounded]:before {
      top: 0%;
      left: 0%;
      width: 100%;
      height: 100%
  }
  
  .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded:after,.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded:before {
      top: var(--mdc-ripple-top,0%);
      left: var(--mdc-ripple-left,0%);
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  .mdc-ripple-surface--primary:after,.mdc-ripple-surface--primary:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-ripple-surface--primary:after,.mdc-ripple-surface--primary:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  .mdc-ripple-surface--primary:hover:before {
      opacity: .04
  }
  
  .mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused:before,.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface--primary.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-ripple-surface--accent:after,.mdc-ripple-surface--accent:before {
      background-color: #018786
  }
  
  @supports not (-ms-ime-align:auto) {
      .mdc-ripple-surface--accent:after,.mdc-ripple-surface--accent:before {
          background-color: var(--mdc-theme-secondary,#018786)
      }
  }
  
  .mdc-ripple-surface--accent:hover:before {
      opacity: .04
  }
  
  .mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused:before,.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  .mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  .mdc-ripple-surface--accent.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  .mdc-list {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1rem;
      line-height: 1.75rem;
      font-weight: 400;
      letter-spacing: .009375em;
      text-decoration: inherit;
      text-transform: inherit;
      line-height: 1.5rem;
      margin: 0;
      padding: 8px 0;
      list-style-type: none;
      color: rgba(0,0,0,.87);
      color: var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87))
  }
  
  .mdc-list:focus {
      outline: none
  }
  
  .mdc-list-item {
      height: 48px
  }
  
  .mdc-list-item__secondary-text {
      color: rgba(0,0,0,.54);
      color: var(--mdc-theme-text-secondary-on-background,rgba(0,0,0,.54))
  }
  
  .mdc-list-item__graphic {
      background-color: transparent;
      color: rgba(0,0,0,.38);
      color: var(--mdc-theme-text-icon-on-background,rgba(0,0,0,.38))
  }
  
  .mdc-list-item__meta {
      color: rgba(0,0,0,.38);
      color: var(--mdc-theme-text-hint-on-background,rgba(0,0,0,.38))
  }
  
  .mdc-list-group__subheader {
      color: rgba(0,0,0,.87);
      color: var(--mdc-theme-text-primary-on-background,rgba(0,0,0,.87))
  }
  
  .mdc-list-item--disabled .mdc-list-item__text {
      opacity: .38;
      color: #000;
      color: var(--mdc-theme-on-surface,#000)
  }
  
  .mdc-list--dense {
      padding-top: 4px;
      padding-bottom: 4px;
      font-size: .812rem
  }
  
  .mdc-list-item {
      display: -ms-flexbox;
      display: flex;
      position: relative;
      -ms-flex-align: center;
      align-items: center !important;
      -ms-flex-pack: start;
      justify-content: flex-start;
      padding: 0 16px;
      overflow: hidden
  }
  
  .mdc-list-item:focus {
      outline: none
  }
  
  .mdc-list-item--activated,.mdc-list-item--activated .mdc-list-item__graphic,.mdc-list-item--selected,.mdc-list-item--selected .mdc-list-item__graphic {
      color: #6200ee;
      color: var(--mdc-theme-primary,#6200ee)
  }
  
  .mdc-list-item__graphic {
      margin-left: 0;
      margin-right: 32px;
      width: 24px;
      height: 24px;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      -ms-flex-align: center;
      align-items: baseline;
      -ms-flex-pack: center;
      justify-content: center;
      fill: currentColor
  }
  
  .mdc-list-item[dir=rtl] .mdc-list-item__graphic,[dir=rtl] .mdc-list-item .mdc-list-item__graphic {
      margin-left: 32px;
      margin-right: 0
  }
  
  .mdc-list .mdc-list-item__graphic {
      display: -ms-inline-flexbox;
      display: inline-flex
  }
  
  .mdc-list-item__meta {
      margin-left: auto;
      margin-right: 0
  }
  
  .mdc-list-item__meta:not(.material-icons) {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .75rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0333333333em;
      text-decoration: inherit;
      text-transform: inherit
  }
  
  .mdc-list-item[dir=rtl] .mdc-list-item__meta,[dir=rtl] .mdc-list-item .mdc-list-item__meta {
      margin-left: 0;
      margin-right: auto
  }
  
  .mdc-list-item__text {
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden
  }
  
  .mdc-list-item__text[for] {
      pointer-events: none
  }
  
  .mdc-list-item__primary-text {
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-top: 0;
      line-height: normal;
      margin-bottom: -20px;
      display: block
  }
  
  .mdc-list-item__primary-text:before {
      display: inline-block;
      width: 0;
      height: 32px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-list-item__primary-text:after {
      display: inline-block;
      width: 0;
      height: 20px;
      content: "";
      vertical-align: -20px
  }
  
  .mdc-list--dense .mdc-list-item__primary-text {
      display: block;
      margin-top: 0;
      line-height: normal;
      margin-bottom: -20px
  }
  
  .mdc-list--dense .mdc-list-item__primary-text:before {
      display: inline-block;
      width: 0;
      height: 24px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-list--dense .mdc-list-item__primary-text:after {
      display: inline-block;
      width: 0;
      height: 20px;
      content: "";
      vertical-align: -20px
  }
  
  .mdc-list-item__secondary-text {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: .875rem;
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: .0178571429em;
      text-decoration: inherit;
      text-transform: inherit;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-top: 0;
      line-height: normal;
      display: block
  }
  
  .mdc-list-item__secondary-text:before {
      display: inline-block;
      width: 0;
      height: 20px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-list--dense .mdc-list-item__secondary-text {
      display: block;
      margin-top: 0;
      line-height: normal;
      font-size: inherit
  }
  
  .mdc-list--dense .mdc-list-item__secondary-text:before {
      display: inline-block;
      width: 0;
      height: 20px;
      content: "";
      vertical-align: 0
  }
  
  .mdc-list--dense .mdc-list-item {
      height: 40px
  }
  
  .mdc-list--dense .mdc-list-item__graphic {
      margin-left: 0;
      margin-right: 36px;
      width: 20px;
      height: 20px
  }
  
  .mdc-list-item[dir=rtl] .mdc-list--dense .mdc-list-item__graphic,[dir=rtl] .mdc-list-item .mdc-list--dense .mdc-list-item__graphic {
      margin-left: 36px;
      margin-right: 0
  }
  
  .mdc-list--avatar-list .mdc-list-item {
      height: 56px
  }
  
  .mdc-list--avatar-list .mdc-list-item__graphic {
      margin-left: 0;
      margin-right: 16px;
      width: 40px;
      height: 40px;
      border-radius: 50%
  }
  
  .mdc-list-item[dir=rtl] .mdc-list--avatar-list .mdc-list-item__graphic,[dir=rtl] .mdc-list-item .mdc-list--avatar-list .mdc-list-item__graphic {
      margin-left: 16px;
      margin-right: 0
  }
  
  .mdc-list--two-line .mdc-list-item__text {
      -ms-flex-item-align: start;
      align-self: flex-start
  }
  
  .mdc-list--two-line .mdc-list-item {
      height: 72px
  }
  
  .mdc-list--avatar-list.mdc-list--dense .mdc-list-item,.mdc-list--two-line.mdc-list--dense .mdc-list-item {
      height: 60px
  }
  
  .mdc-list--avatar-list.mdc-list--dense .mdc-list-item__graphic {
      margin-left: 0;
      margin-right: 20px;
      width: 36px;
      height: 36px
  }
  
  .mdc-list-item[dir=rtl] .mdc-list--avatar-list.mdc-list--dense .mdc-list-item__graphic,[dir=rtl] .mdc-list-item .mdc-list--avatar-list.mdc-list--dense .mdc-list-item__graphic {
      margin-left: 20px;
      margin-right: 0
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item {
      cursor: pointer
  }
  
  a.mdc-list-item {
      color: inherit;
      text-decoration: none
  }
  
  .mdc-list-divider {
      height: 0;
      margin: 0;
      border: none;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: rgba(0,0,0,.12)
  }
  
  .mdc-list-divider--padded {
      margin: 0 16px
  }
  
  .mdc-list-divider--inset {
      margin-left: 72px;
      margin-right: 0;
      width: calc(100% - 72px)
  }
  
  .mdc-list-group[dir=rtl] .mdc-list-divider--inset,[dir=rtl] .mdc-list-group .mdc-list-divider--inset {
      margin-left: 0;
      margin-right: 72px
  }
  
  .mdc-list-divider--inset.mdc-list-divider--padded {
      width: calc(100% - 72px - 16px)
  }
  
  .mdc-list-group .mdc-list {
      padding: 0
  }
  
  .mdc-list-group__subheader {
      font-family: Roboto,sans-serif;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-size: 1rem;
      line-height: 1.75rem;
      font-weight: 400;
      letter-spacing: .009375em;
      text-decoration: inherit;
      text-transform: inherit;
      margin: .75rem 16px
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:after,:not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:after,:not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:after,:not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:before {
      background-color: #000
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:hover:before {
      opacity: .04
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item.mdc-ripple-upgraded--background-focused:before,:not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.12
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated:before {
      opacity: .12
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated:after,:not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated:after,:not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated:hover:before {
      opacity: .16
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated.mdc-ripple-upgraded--background-focused:before,:not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .24
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--activated.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.24
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected:before {
      opacity: .08
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected:after,:not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected:before {
      background-color: #6200ee
  }
  
  @supports not (-ms-ime-align:auto) {
      :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected:after,:not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected:before {
          background-color: var(--mdc-theme-primary,#6200ee)
      }
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected:hover:before {
      opacity: .12
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected.mdc-ripple-upgraded--background-focused:before,:not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .2
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected:not(.mdc-ripple-upgraded):after {
      -webkit-transition: opacity .15s linear;
      -o-transition: opacity .15s linear;
      transition: opacity .15s linear
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected:not(.mdc-ripple-upgraded):active:after {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .2
  }
  
  :not(.mdc-list--non-interactive)>:not(.mdc-list-item--disabled).mdc-list-item--selected.mdc-ripple-upgraded {
      --mdc-ripple-fg-opacity: 0.2
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled {
      --mdc-ripple-fg-size: 0;
      --mdc-ripple-left: 0;
      --mdc-ripple-top: 0;
      --mdc-ripple-fg-scale: 1;
      --mdc-ripple-fg-translate-end: 0;
      --mdc-ripple-fg-translate-start: 0;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled:after,:not(.mdc-list--non-interactive)>.mdc-list-item--disabled:before {
      position: absolute;
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      content: ""
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled:before {
      -webkit-transition: opacity 15ms linear,background-color 15ms linear;
      -o-transition: opacity 15ms linear,background-color 15ms linear;
      transition: opacity 15ms linear,background-color 15ms linear;
      z-index: 1
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled.mdc-ripple-upgraded:before {
      -webkit-transform: scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: scale(var(--mdc-ripple-fg-scale,1));
      transform: scale(var(--mdc-ripple-fg-scale,1))
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled.mdc-ripple-upgraded:after {
      top: 0;
      left: 0;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled.mdc-ripple-upgraded--unbounded:after {
      top: var(--mdc-ripple-top,0);
      left: var(--mdc-ripple-left,0)
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled.mdc-ripple-upgraded--foreground-activation:after {
      -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;
      animation: mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled.mdc-ripple-upgraded--foreground-deactivation:after {
      -webkit-animation: mdc-ripple-fg-opacity-out .15s;
      animation: mdc-ripple-fg-opacity-out .15s;
      -webkit-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      -ms-transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));
      transform: translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled:after,:not(.mdc-list--non-interactive)>.mdc-list-item--disabled:before {
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled.mdc-ripple-upgraded:after {
      width: var(--mdc-ripple-fg-size,100%);
      height: var(--mdc-ripple-fg-size,100%)
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled:after,:not(.mdc-list--non-interactive)>.mdc-list-item--disabled:before {
      background-color: #000
  }
  
  :not(.mdc-list--non-interactive)>.mdc-list-item--disabled.mdc-ripple-upgraded--background-focused:before,:not(.mdc-list--non-interactive)>.mdc-list-item--disabled:not(.mdc-ripple-upgraded):focus:before {
      -webkit-transition-duration: 75ms;
      -o-transition-duration: 75ms;
      transition-duration: 75ms;
      opacity: .12
  }
  
  body {
      margin: 0
  }
  
  #catalog-image-list {
      max-width: 900px;
      padding-top: 128px;
      padding-bottom: 100px
  }
  
  #catalog-image-list .mdc-image-list__image-aspect-container {
      padding-bottom: 100%
  }
  
  #catalog-image-list .mdc-image-list__item {
      width: calc(100% / 4 - 8.25px);
      margin: 4px
  }
  
  @media (max-width: 599px) {
      #catalog-image-list .mdc-image-list__item {
          width:calc(100% / 3 - 8.3333333333px);
          margin: 4px
      }
  }
  
  @media (max-width: 320px) {
      #catalog-image-list .mdc-image-list__item {
          width:calc(100% / 2 - 8.5px);
          margin: 4px
      }
  }
  
  .catalog-image-list-item-container {
      background-color: #f5f5f5
  }
  
  .catalog-image-list-label {
      font-weight: 500;
      color: #212121
  }
  
  a.catalog-image-link {
      text-decoration: none
  }
`;


}
customElements.define('app-root', App);