import { parse } from 'csv-parse/sync';

export async function post({ request }) {
  const body = await request.text();
  const csvRecords = parse(body);
  return {
    status: 200,
    body: csvRecords.slice(1),
  };
}