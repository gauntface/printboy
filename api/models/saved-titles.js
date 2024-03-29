import path from 'path';
import {writeFile, readdir, readFile, rm} from 'node:fs/promises';
import {pathForLabelSettings} from './constants.js';
import {hashForValue} from '../utils/files.js';

const TITLE_DIR = 'titles';

export async function getPresetTitles() {
	const titlesPath = await pathForLabelSettings(TITLE_DIR);
	const values = [];
	const files = await readdir(titlesPath);
	for (const filename of files) {
		values.push(await getPresetTitle(filename));
	}
	return values
}

export async function getPresetTitle(filename) {
	const titlesPath = await pathForLabelSettings(TITLE_DIR);
	const filepath = path.join(titlesPath, filename);
	return {
		filename,
		text: (await readFile(filepath)).toString(),
	};

}

export async function addTitle(newTitle) {
    const p = await pathForLabelSettings(TITLE_DIR);
    const filename = `${hashForValue(newTitle)}.txt`;
    await writeFile(path.join(p, filename), newTitle);
}

export async function deletePresetTitle(filename) {
	const p = await pathForLabelSettings(TITLE_DIR);
	await rm(path.join(p, filename));
}
