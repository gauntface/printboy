import { getAllPaperSizes, getCurrentPaperSize, saveCurrentPaperSize } from "../models/paper.js";

export async function getPaperSizesAPI(req, res) {
  res.json(await getAllPaperSizes());
}

export async function savePaperSizeAPI(req, res) {
  if (!req.body) {
    res.status(400);
    res.json({
      error: {
        msg: 'Post body is required.',
      }
    });
    return;
  }

  await saveCurrentPaperSize(req.body);
  res.json({});
}

export async function getPaperSizeAPI(req, res) {
  res.json(await getCurrentPaperSize());
}
