import path from 'path';
import {readFile, writeFile, readdir, rm} from 'node:fs/promises';
import {getConfigDir} from './config.js';
import {exists, hashForValue} from '../utils/files.js';

export const LABEL_DIR = 'labels';

export async function getSavedLabels() {
	const p = await getConfigDir(LABEL_DIR);
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
	const p = await getConfigDir(LABEL_DIR);
	const filename = `${hashForValue(d)}.json`;
	await writeFile(path.join(p, filename), d);
}

export async function deleteSavedLabel(filename) {
	const f = path.join(await getConfigDir(LABEL_DIR), filename);
	if (!(await exists(f))) {
		throw new Error(`Label file '${filename}' does not exist`);
	}
	await rm(f);
}
