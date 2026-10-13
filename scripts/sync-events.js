const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'nosotros-1e116';
const COLLECTION = 'events';
const OUTPUT_FILE = path.join(__dirname, '../data/events.json');

function parseFirestoreValue(val) {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('arrayValue' in val) {
    const values = val.arrayValue.values || [];
    return values.map(parseFirestoreValue);
  }
  if ('mapValue' in val) {
    const fields = val.mapValue.fields || {};
    const res = {};
    for (const [k, v] of Object.entries(fields)) {
      res[k] = parseFirestoreValue(v);
    }
    return res;
  }
  return null;
}

function parseFirestoreDoc(doc) {
  const id = doc.name.split('/').pop();
  const fields = doc.fields || {};
  const obj = { id };
  for (const [k, v] of Object.entries(fields)) {
    obj[k] = parseFirestoreValue(v);
  }
  return obj;
}

async function fetchAllEvents() {
  let events = [];
  let pageToken = '';

  do {
    const url = new URL(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`);
    url.searchParams.set('pageSize', '300');
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Failed to fetch from Firestore: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (data.documents) {
      events.push(...data.documents.map(parseFirestoreDoc));
    }
    pageToken = data.nextPageToken || '';
  } while (pageToken);

  // Sort by date ascending
  events.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  return events;
}

async function main() {
  console.log(`Fetching events from Firestore (${PROJECT_ID})...`);
  const events = await fetchAllEvents();
  console.log(`Fetched ${events.length} events.`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(events, null, 2), 'utf-8');
  console.log(`Successfully updated ${OUTPUT_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
