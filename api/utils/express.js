import exp from 'express';

export function express() {
  const app = exp();
  app['postAsync'] = (p, fn) => {
    app.post(p, async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  };
  app['getAsync'] = (p, fn) => {
    app.get(p, async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  };
  app['deleteAsync'] = (p, fn) => {
    app.delete(p, async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  };

  return app;
}
