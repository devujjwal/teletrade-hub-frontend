import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const dataRoot = path.join(projectRoot, 'public', 'location-data');

async function readJson(relativePath) {
  const filePath = path.join(dataRoot, relativePath);
  const contents = await readFile(filePath, 'utf8');
  return JSON.parse(contents);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkDuplicates(items, getKey, label) {
  const seen = new Set();

  for (const item of items) {
    const key = getKey(item);
    assert(!seen.has(key), `Duplicate ${label}: ${key}`);
    seen.add(key);
  }
}

async function main() {
  const manifest = await readJson('manifest.json');
  const countries = await readJson('countries.json');

  checkDuplicates(countries, (country) => country.code, 'country code');

  let stateCount = 0;
  let cityCount = 0;

  for (const country of countries) {
    const states = await readJson(path.join('states', `${country.code}.json`));
    checkDuplicates(states, (state) => state.code, `state code in ${country.code}`);

    if (country.hasStates) {
      assert(
        states.length > 0,
        `Country ${country.code} is marked as having states but no state file entries were found`
      );
    }

    for (const state of states) {
      const cities = await readJson(
        path.join('cities', country.code, `${state.code}.json`)
      );
      checkDuplicates(
        cities,
        (city) => city.name.toLocaleLowerCase(),
        `city name in ${country.code}/${state.code}`
      );
      cityCount += cities.length;
    }

    const rootCities = await readJson(
      path.join('cities', country.code, '__root.json')
    );
    checkDuplicates(
      rootCities,
      (city) => city.name.toLocaleLowerCase(),
      `root city name in ${country.code}`
    );
    cityCount += rootCities.length;
    stateCount += states.length;
  }

  assert(
    manifest.counts.countries === countries.length,
    `Manifest country count mismatch: expected ${countries.length}, found ${manifest.counts.countries}`
  );
  assert(
    manifest.counts.states === stateCount,
    `Manifest state count mismatch: expected ${stateCount}, found ${manifest.counts.states}`
  );
  assert(
    manifest.counts.cities === cityCount,
    `Manifest city count mismatch: expected ${cityCount}, found ${manifest.counts.cities}`
  );

  console.log(
    `Validated ${countries.length} countries, ${stateCount} states, ${cityCount} cities from ${manifest.source.releaseTag}.`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
