import { Application, RequestHandler, Router } from 'express';
import GlRoute from './GlRoute';

export interface GlRouterMiddlewares {
  pre?: RequestHandler[];
  post?: RequestHandler[];
}

class GlRouter {
  private _expressRouter: Router;
  private _path: string;
  private _routes: GlRoute[];
  private _middlewares?: GlRouterMiddlewares;

  constructor(
    path: string,
    routes: GlRoute[],
    middlewares?: GlRouterMiddlewares
  ) {
    this._path = path;
    this._routes = routes;
    this._middlewares = middlewares;
    this._expressRouter = Router();
  }

  private _buildRoutes() {
    for (const route of this._routes) {
      route.build(this._expressRouter);
    }
  }

  public build(app: Application) {
    this._buildRoutes();
    app.use(
      this._path,
      ...(this._middlewares?.pre || []),
      this._expressRouter,
      ...(this._middlewares?.post || [])
    );
  }
}

export default GlRouter;
