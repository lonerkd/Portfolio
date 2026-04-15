const https = require('https');

const urls = [
  'https://drive.google.com/drive/folders/1TCVfeal-Ah64ZQeru9duzCglV6iHjBiA',
  'https://drive.google.com/drive/folders/1Qp8gVXBj1bd9N4O0YLOdq2MKHPkEx-gV',
  'https://drive.google.com/drive/folders/1lSB3tY2YH-C2OWXS3FUKEETFHp4c9zgY'
];

async function fetchIds(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const regex = /\["([a-zA-Z0-9_-]{33})"/g;
        const matches = [...data.matchAll(regex)];
        const ids = [...new Set(matches.map(m => m[1]))];
        resolve(ids);
      });
    }).on('error', reject);
  });
}

async function run() {
  const allIds = new Set();
  for (const url of urls) {
    try {
      console.log(`Fetching ${url}...`);
      const ids = await fetchIds(url);
      console.log(`Found ${ids.length} potential IDs`);
      ids.forEach(id => allIds.add(id));
    } catch (e) {
      console.error(e);
    }
  }
  console.log("ALL IDS FOUND:");
  console.log([...allIds]);
}

run();