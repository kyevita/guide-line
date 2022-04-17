import express, { ErrorRequestHandler, RequestHandler } from 'express';
import pino from 'pino';
import GlRouter from './GlRouter';

type ExpressHandler = RequestHandler<any> | ErrorRequestHandler;

export interface GlServerMiddlewares {
  pre: ExpressHandler[];
  post: ExpressHandler[];
}

export interface GlServerOptions {
  port?: number;
  appName?: string;
  development?: boolean;
}

const DEFAULT_PORT = 3000;

const app = express();
const logger = pino();

class GlServer {
  private _serverMiddlewares: GlServerMiddlewares;
  private _routers: GlRouter[];
  private _options: GlServerOptions;

  constructor(
    serverMiddlewares: GlServerMiddlewares,
    routers: GlRouter[],
    options?: GlServerOptions
  ) {
    this._serverMiddlewares = serverMiddlewares;
    this._routers = routers;
    this._options = options || {};

    if (!this._options.hasOwnProperty('development')) {
      this._options.development = true;
    }

    this._applyMiddlewares('pre');
    this._applyRouters();
  }

  private _applyMiddlewares(action: 'pre' | 'post') {
    for (const middleware of this._serverMiddlewares[action]) {
      app.use(middleware);
    }
  }

  private _applyRouters() {
    for (const router of this._routers) {
      router.build(app);
    }
  }

  public listen() {
    try {
      this._applyMiddlewares('post');
      const port = this._options?.port || DEFAULT_PORT;
      const appName = this._options.appName;

      app.listen(port, () => {
        if (this._options.development) {
          logger.info(
            `GuideLine App ${
              appName ? appName + ' ' : ''
            }Listening on Port ${port}`
          );
        }
      });

      if (this._options.development) {
        logger.info('**THIS APPLICATION IS RUNNING ON DEVELOPMENT MODE**');
      }

      return app;
    } catch (error: any) {
      logger.error(`An error occurred: ${error.message}`);
      logger.error(error);
      process.exit(1);
    }
  }
}

export default GlServer;
