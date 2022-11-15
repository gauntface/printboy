import {stat} from 'node:fs/promises';

export async function exists(p) {
	try {
		await stat(p);
		return true;
	} catch (e) {
		return false;
	}
}
