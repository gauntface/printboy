import {apiDomain} from '../../themes/printboy/assets/ts/config';
import { LabelPreview } from "../render/labelpreview";

export async function printLabel(lp: LabelPreview, copies: number) {
	await fetch(`${apiDomain}/api/print`, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			copies: copies,
			base64: lp.labelAsBase64(),
			widthInches: lp.widthInInches(),
			heightInches: lp.heightInInches(),
		}),
	})
}
