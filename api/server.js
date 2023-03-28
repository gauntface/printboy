import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import { URL } from 'url';
import exp from 'express';

import {saveLabelAPI, getLabelsAPI, deleteLabelAPI} from './endpoints/labels.js';
import {getPaperSizesAPI, savePaperSizeAPI, getPaperSizeAPI} from './endpoints/printer.js';
import { printAPI } from './endpoints/print.js';
import { express } from './utils/express.js';

export function createApp(args) {
  const app = express();

  if (args && args.cors) {
    console.warn(`⚠️ Enabling cors for ${args.cors}`);
    app.use(cors({
      origin: args.cors,
    }))
  }

  app.use(fileUpload());
  app.use(exp.urlencoded({ extended: true }));
  app.use(exp.json({ extended: true }));
  app.use(exp.static(path.join(new URL('.', import.meta.url).pathname, 'static')));

  app.postAsync('/api/label', saveLabelAPI);
  app.getAsync('/api/labels', getLabelsAPI);
  app.deleteAsync('/api/label', deleteLabelAPI);


  app.getAsync('/api/printer/sizes', getPaperSizesAPI);
  app.postAsync('/api/printer/size', savePaperSizeAPI);
  app.getAsync('/api/printer/size', getPaperSizeAPI);

  app.postAsync('/api/print', printAPI);

  // Error handler
  app.use((err, req, res, next) => {
    res.status(500);
    res.json({
      error: {
        msg: `Unexpected error occurred: ${err}`,
      },
    });
  });

  return app;
}
