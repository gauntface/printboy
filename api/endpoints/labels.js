import {saveLabel, getSavedLabels} from '../models/labels.js';

export async function saveLabelAPI(req, res) {
  if (!req.body) {
    res.status(400);
    res.json({
      error: {
        msg: 'Post body is required.',
      }
    });
    return;
  }

  await saveLabel(req.body);
  res.json({});
}

export async function getLabelAPI(req, res) {
  res.json(await getSavedLabels());
}
