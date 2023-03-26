import { getAllPaperSizes } from "../models/paper";

export async function getPaperSizesAPI(req, res) {
  res.json(await getAllPaperSizes());
}
