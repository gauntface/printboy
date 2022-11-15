import * as params from '@params';

export const apiDomain = params.Environment == "development" ? "http://localhost:1314" : "";
