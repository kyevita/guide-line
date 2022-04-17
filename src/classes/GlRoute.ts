import { Router } from 'express';
import { GlRouterMiddlewares } from './GlRouter';
import GlController from './GlController';

type RouteMethod = 'delete' | 'get' | 'post' | 'patch' | 'put';

class GlRoute {
  private _path: string;
  private _method: RouteMethod;
  private _controller: GlController;
  private _middlewares?: GlRouterMiddlewares;

  constructor(
    path: string,
    method: RouteMethod,
    controller: GlController,
    middlewares?: GlRouterMiddlewares
  ) {
    this._path = path;
    this._method = method;
    this._controller = controller;
    this._middlewares = middlewares;
  }

  public build(expressRouter: Router) {
    expressRouter[this._method](
      this._path,
      ...(this._middlewares?.pre || []),
      (req, res, next) => this._controller.requestHanlder(req, res, next),
      ...(this._middlewares?.post || [])
    );
  }
}

export default GlRoute;
