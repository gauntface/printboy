import {saveLabel} from '../models/labels.js';

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

  try {
    await saveLabel(req.body);
    res.json({});
  } catch (err) {
    res.status(400);
    res.json({
      error: {
        msg: `Failed to save label: ${err}`,
      },
    });
  }
}
