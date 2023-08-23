import path from 'path';
import {writeFile, readdir, readFile, rm} from 'node:fs/promises';
import {pathForLabelSettings} from './constants.js';
import {hashForValue} from '../utils/files.js';
import {getPresetImage} from './saved-images.js';
import { getPresetTitle } from './saved-titles.js';
import { getPresetAddress } from './saved-addresses.js';

const PRESET_LABELS_DIR = 'preset-labels';

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

export async function getSavedLabel(filename) {
	const p = await pathForLabelSettings(PRESET_LABELS_DIR);
	const filepath = path.join(p, filename);
	const label = JSON.parse((await readFile(filepath)).toString());
	return label;
}

export async function addLabel(newLabel) {
	const fields = {
		"image": {
			name: "imageFilename",
			fn: getPresetImage,
		},
		"title": {
			name: "title",
		},
		"content": {
			name: "content",
		},
	};
	const data = {};
	for (const [key, field] of Object.entries(fields)) {
		const value = newLabel[field.name];
		if (value == undefined) {
			throw new Error(`Required field '${field.name}' is not defined.`);
		}

		if (!value) {
			data[key] = "";
			continue;
		}

		if (field.fn) {
			data[key] = (await field.fn(value));
		} else {
			data[key] = value;
		}
	}

	// TODO: Switch to saving a snapshot of the data
	const d = JSON.stringify(data);
	const p = await pathForLabelSettings(PRESET_LABELS_DIR);
	const filename = `${hashForValue(d)}.json`;
	await writeFile(path.join(p, filename), d);
	return filename;
}

export async function deletePresetLabel(filename) {
	const p = await pathForLabelSettings(PRESET_LABELS_DIR);
	await rm(path.join(p, filename));
}
