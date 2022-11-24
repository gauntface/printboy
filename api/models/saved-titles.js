import path from 'path';
import {writeFile, readdir, readFile} from 'node:fs/promises';
import {pathForLabelSettings} from './constants.js';
import {hashForValue} from '../utils/files.js';

const TITLE_DIR = 'titles';

export async function getPresetTitles() {
	const titlesPath = await pathForLabelSettings(TITLE_DIR);
	const values = [];
	const files = await readdir(titlesPath);
	for (const filename of files) {
		const filepath = path.join(titlesPath, filename);
		values.push({
			filename,
			text: (await readFile(filepath)).toString(),
		});
	}
	return values
}

export async function addTitle(newTitle) {
    const p = await pathForLabelSettings(TITLE_DIR);
    const filename = `${hashForValue(newTitle)}.txt`;
    await writeFile(path.join(p, filename), newTitle);
}