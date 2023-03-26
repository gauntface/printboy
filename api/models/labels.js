import path from 'path';
import {readFile, writeFile, readdir} from 'node:fs/promises';
import {pathForLabels} from './constants.js';
import {hashForValue} from '../utils/files.js';

export async function getSavedLabels() {
	const p = await pathForLabels();
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

export async function saveLabel(newLabelData) {
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
	const p = await pathForLabels();
	const filename = `${hashForValue(d)}.json`;
	await writeFile(path.join(p, filename), d);
}

/*
export async function deletePresetLabel(filename) {
	const p = await pathForLabelSettings(PRESET_LABELS_DIR);
	await rm(path.join(p, filename));
}
*/
