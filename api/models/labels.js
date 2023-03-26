import path from 'path';
import {writeFile} from 'node:fs/promises';
import {pathForLabelSettings} from './constants.js';
import {hashForValue} from '../utils/files.js';

const PRESET_LABELS_DIR = 'preset-labels';

/*
export async function getPresetLabels() {
	const p = await pathForLabelSettings(PRESET_LABELS_DIR);
	const values = [];
	const files = await readdir(p);
	for (const filename of files) {
		const filepath = path.join(p, filename);
		const label = JSON.parse((await readFile(filepath)).toString());
		values.push({
			filename,
			...label,
		});
	}
	return values
}
*/

export async function saveLabel(newLabelData, wf = writeFile, hv = hashForValue) {
	if (!newLabelData) {
		throw new Error('No label input given');
	}

	const fields = ["title", "body", "image"];

	const data = {};
	for (const key of fields) {
		if (newLabelData[key]) {
			data[key] = newLabelData[key];
		}
	}

	if (Object.keys(data).length < 1) {
		throw new Error(`At least one field required: ${fields.join(', ')}`);
	}

	const d = JSON.stringify(data);
	const p = await pathForLabelSettings(PRESET_LABELS_DIR);
	const filename = `${hv(d)}.json`;
	await wf(path.join(p, filename), d);
}

/*
export async function deletePresetLabel(filename) {
	const p = await pathForLabelSettings(PRESET_LABELS_DIR);
	await rm(path.join(p, filename));
}
*/
