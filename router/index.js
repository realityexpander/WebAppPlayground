import { matcher } from './matcher';

const DCE = document.createElement.bind(document);
const HPS = history.pushState.bind(history);
const HRS = history.replaceState.bind(history);
const WRE = window.removeEventListener.bind(window);
const WDE = window.dispatchEvent.bind(window);
const WAE = window.addEventListener.bind(window);

const Errors = {
  Router: {
    NoRoutes: "Router :: No routes were defined!"
  },
  RouteMixin: {
    NoRoute:
      "RouteMixin :: `navigate` method requires the ### component to have a route property/attribute"
  }
};

const startLocation = () => window.location.pathname || "/";

const Router = superClass =>
  class extends superClass {
    static get properties() {
      return {
        routes: Array,
        route: String,
        routeProps: Object,
        routeElement: String,
        lastRoute: String
      };
    }
    constructor() {
      super();

      const route = startLocation();
      this.routeProps = {};
      this.lastRoute = null;
      HRS({ route }, null, route);
    }
    connectedCallback() {
      super.connectedCallback();
      WAE("popstate", this.__handleNav.bind(this));
      WDE(new PopStateEvent("popstate", { state: { route: startLocation() } }));
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      WRE("popstate", this.__handleNav.bind(this));
    }
    __handleNav(ev) {
      if (!this.constructor.routes) throw Errors.Router.NoRoutes;

      // let overrideNavLocation = null;
      // let isLoginLocationInPath = ev.target.location.pathname.split("/")[1] == 'login';
      // let isPasswordResetInPath = ev.target.location.pathname.split("/")[1] == 'password-reset';
      // if (!isLoginLocationInPath) {
      //   if (localStorage.getItem('token') == null) {
      //     overrideNavLocation = '/login';
      //   }
      // }

      //const targetRoute = window.location.pathname; //ev.state.route;
      // const targetRoute = overrideNavLocation || ev.target.location.pathname; //ev.state.route;
      const targetRoute = ev.target.location.pathname; //ev.state.route;
      const targetRouteWithHash = ev.target.location.pathname + ev.target.location.hash;

      const match = matcher(this.constructor.routes, targetRoute);
      if (match) {

        // Check if location is secured
        if (match.route.secured) {
          if (localStorage.getItem('token') == null) { // If not logged in...
            window.location.href = '/login'; // ...then Redirect to login.
            return
          }
        }

        // Check if location is public-only (like login)
        if (match.route.publicOnly) {
          if (localStorage.getItem('token') != null) { // If logged in...
            window.location.href = '/'; // ...then Redirect to home.
            return
          }
        }

        this.route = match.route;
        this.route.path = this.route.path + ev.target.location.hash;
        this.routeProps = match.props;
      }
      if (this.lastRoute !== targetRouteWithHash) {
        this.setRouteElement();
        this.lastRoute = targetRouteWithHash;
      }
    }
    setRouteElement() {
      const setElement = () => {
        let element;
        if (typeof this.route.render === "function") {
          element = this.route.render(this.routeProps);
        } else {
          element = DCE(this.route.component);
          Object.assign(element, this.routeProps);
        }

        this.routeElement = element;
      };
      if (!this.route) {
        this.routeElement = null;
      } else if (
        !customElements.get(this.route.component) &&
        typeof this.route.import === "function"
      ) {
        this.route.import().then(setElement);
      } else {
        setElement();
      }
    }
  };

const RouteMixin = superClass =>
  class extends superClass {
    static get properties() {
      return {
        isRouteActive: Boolean
      };
    }
    connectedCallback() {
      super.connectedCallback();
      this.isRouteActive = this.route === window.location.pathname;
      WAE("popstate", this.__handleActive.bind(this));
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      WRE("popstate", this.__handleActive.bind(this));
    }
    __handleActive(ev) {
      this.isRouteActive = ev.state.route === this.route;
    }
    navigate(customRoute) {
      const route = customRoute ? customRoute : this.route;
      if (!route) throw Errors.RouteMixin.NoRoute.replace('###', this.nodeName);
      if (route === window.location.pathname) return;
      if (route.substring(0, 1) !== '/') {
        window.location.href = route;
        return;
      }

      const state = { route };
      HPS(state, null, route);
      WDE(new PopStateEvent("popstate", { state }));
    }
  };

export { Router, RouteMixin };
