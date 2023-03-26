import {saveLabel, getSavedLabels, deleteSavedLabel} from '../models/labels.js';

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

export async function deleteLabelAPI(req, res) {
  if (!req.body || !req.body.filename) {
    res.status(400);
    res.json({
      error: {
        msg: 'Post body with \'filename\' is required.',
      }
    });
    return;
  }

  await deleteSavedLabel(req.body.filename);
  res.json({});
}
