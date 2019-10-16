import React from "react";
import { Router as DefaultRouter, Route, Switch } from "react-router-dom";
import dynamic from "umi/dynamic";
import renderRoutes from "umi/lib/renderRoutes";
import history from "@tmp/history";
import RendererWrapper0 from "/Users/Penelope/DatasheetDemo/src/pages/.umi/LocaleWrapper.jsx";

const Router = require("dva/router").routerRedux.ConnectedRouter;

const routes = [
  {
    path: "/user",
    component: require("../../layouts/UserLayout").default,
    routes: [
      {
        name: "login",
        path: "/user/login",
        component: require("../user/login").default,
        exact: true
      },
      {
        component: () =>
          React.createElement(
            require("/Users/Penelope/DatasheetDemo/node_modules/_umi-build-dev@1.13.10@umi-build-dev/lib/plugins/404/NotFound.js")
              .default,
            { pagesPath: "src/pages", hasRoutesInConfig: true }
          )
      }
    ]
  },
  {
    path: "/",
    component: require("../../layouts/SecurityLayout").default,
    routes: [
      {
        path: "/",
        component: require("../../layouts/BasicLayout").default,
        authority: ["admin", "user"],
        routes: [
          {
            path: "/",
            component: require("../Sheet").default,
            exact: true
          },
          {
            path: "/SheetTemplate",
            name: "SheetTemplate",
            component: require("../Template").default,
            exact: true
          },
          {
            path: "/SheetDocument",
            name: "SheetDocument",
            component: require("../Document").default,
            exact: true
          },
          {
            path: "/welcome",
            name: "welcome",
            icon: "smile",
            component: require("..").default,
            exact: true
          },
          {
            component: require("../404").default,
            exact: true
          },
          {
            component: () =>
              React.createElement(
                require("/Users/Penelope/DatasheetDemo/node_modules/_umi-build-dev@1.13.10@umi-build-dev/lib/plugins/404/NotFound.js")
                  .default,
                { pagesPath: "src/pages", hasRoutesInConfig: true }
              )
          }
        ]
      },
      {
        component: require("../404").default,
        exact: true
      },
      {
        component: () =>
          React.createElement(
            require("/Users/Penelope/DatasheetDemo/node_modules/_umi-build-dev@1.13.10@umi-build-dev/lib/plugins/404/NotFound.js")
              .default,
            { pagesPath: "src/pages", hasRoutesInConfig: true }
          )
      }
    ]
  },
  {
    component: require("../404").default,
    exact: true
  },
  {
    component: () =>
      React.createElement(
        require("/Users/Penelope/DatasheetDemo/node_modules/_umi-build-dev@1.13.10@umi-build-dev/lib/plugins/404/NotFound.js")
          .default,
        { pagesPath: "src/pages", hasRoutesInConfig: true }
      )
  }
];
window.g_routes = routes;
const plugins = require("umi/_runtimePlugin");
plugins.applyForEach("patchRoutes", { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach("onRouteChange", {
        initialValue: {
          routes,
          location,
          action
        }
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    routeChangeHandler(history.location);
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
