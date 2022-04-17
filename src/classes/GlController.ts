import { Request, Response, NextFunction } from 'express';

class ControllerException extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class BadRequestException extends ControllerException {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class NotFoundException extends ControllerException {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class ForbbidenException extends ControllerException {
  constructor(message = 'Forbbiden') {
    super(message, 403);
  }
}

class UnauthorizedException extends ControllerException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ServerException extends ControllerException {
  constructor(message = 'Server Error') {
    super(message, 500);
  }
}

abstract class GlController {
  static ControllerException = ControllerException;
  static BadRequestException = BadRequestException;
  static NotFoundException = NotFoundException;
  static ForbbidenException = ForbbidenException;
  static UnauthorizedException = UnauthorizedException;
  static ServerException = ServerException;

  /**
   * Main flow if the request, here you will have to send the response manually using the express res object
   */
  protected abstract executeRequest(req: Request, res: Response): Promise<void>;

  //
  /**
   * This is an overridable method, you can override it in the new controllers you create.
   * Here you will validate the request when you need to, you can throw exceptions from here and
   * the base controller will handle then. For Bad request, or other status codees you can use the
   * built-in GlController exceptions.
   */
  protected async validateRequest(req: Request, res: Response) {}

  public async requestHanlder(req: Request, res: Response, next: NextFunction) {
    try {
      await this.validateRequest(req, res);
      await this.executeRequest(req, res);
    } catch (err: any) {
      if (!err.status) {
        err.status = err.statusCode || 500;
      }

      next(err);
    }
  }
}

export default GlController;
