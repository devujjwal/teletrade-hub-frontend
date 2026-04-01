import { gunzipSync } from 'node:zlib';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputRoot = path.join(projectRoot, 'public', 'location-data');

const SOURCE = {
  repository: 'https://github.com/dr5hn/countries-states-cities-database',
  releaseTag: 'v3.1-export.2',
  license: 'ODbL-1.0',
};

const SOURCE_URLS = {
  countries:
    'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/v3.1-export.2/json/countries.json',
  states:
    'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/v3.1-export.2/json/states.json',
  cities:
    'https://github.com/dr5hn/countries-states-cities-database/releases/download/v3.1-export.2/json-cities.json.gz',
};

function compareByName(left, right) {
  return left.name.localeCompare(right.name, undefined, {
    sensitivity: 'base',
    numeric: true,
  });
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.json();
}

async function fetchGzipJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return JSON.parse(gunzipSync(Buffer.from(await response.arrayBuffer())).toString('utf8'));
}

async function writeJson(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data)}\n`, 'utf8');
}

function normalizeCountries(rawCountries, statesByCountry) {
  return rawCountries
    .filter((country) => country.iso2 && country.name)
    .map((country) => ({
      code: country.iso2.toUpperCase(),
      name: country.name,
      hasStates: (statesByCountry.get(country.iso2.toUpperCase()) || []).length > 0,
    }))
    .sort(compareByName);
}

function normalizeStates(rawStates) {
  const statesByCountry = new Map();
  const statesById = new Map();

  for (const state of rawStates) {
    if (!state.country_code || !state.iso2 || !state.name) {
      continue;
    }

    const normalizedState = {
      id: state.id,
      countryCode: state.country_code.toUpperCase(),
      code: state.iso2.toUpperCase(),
      name: state.name,
    };

    statesById.set(normalizedState.id, normalizedState);

    if (!statesByCountry.has(normalizedState.countryCode)) {
      statesByCountry.set(normalizedState.countryCode, []);
    }

    statesByCountry.get(normalizedState.countryCode).push({
      code: normalizedState.code,
      name: normalizedState.name,
    });
  }

  for (const states of statesByCountry.values()) {
    states.sort(compareByName);
  }

  return {
    statesByCountry,
    statesById,
  };
}

function normalizeCities(rawCities, statesById) {
  const citiesByKey = new Map();
  let totalCities = 0;

  for (const city of rawCities) {
    if (!city.country_code || !city.name) {
      continue;
    }

    const countryCode = city.country_code.toUpperCase();
    const stateCodeFromCity = city.state_code?.toUpperCase() || null;
    const stateCodeFromStateId = statesById.get(city.state_id)?.code || null;
    const stateCode = stateCodeFromCity || stateCodeFromStateId || '__root';
    const key = `${countryCode}:${stateCode}`;

    if (!citiesByKey.has(key)) {
      citiesByKey.set(key, new Map());
    }

    const cityBucket = citiesByKey.get(key);
    const dedupeKey = city.name.trim().toLocaleLowerCase();

    if (!cityBucket.has(dedupeKey)) {
      cityBucket.set(dedupeKey, {
        name: city.name.trim(),
      });
      totalCities += 1;
    }
  }

  return {
    citiesByKey,
    totalCities,
  };
}

async function getExistingManifest() {
  try {
    const manifestPath = path.join(outputRoot, 'manifest.json');
    const contents = await readFile(manifestPath, 'utf8');
    return JSON.parse(contents);
  } catch {
    return null;
  }
}

async function main() {
  const existingManifest = await getExistingManifest();

  if (existingManifest?.source?.releaseTag === SOURCE.releaseTag) {
    console.log(`Location data already generated for ${SOURCE.releaseTag}`);
    return;
  }

  const [rawCountries, rawStates, rawCities] = await Promise.all([
    fetchJson(SOURCE_URLS.countries),
    fetchJson(SOURCE_URLS.states),
    fetchGzipJson(SOURCE_URLS.cities),
  ]);

  const { statesByCountry, statesById } = normalizeStates(rawStates);
  const countries = normalizeCountries(rawCountries, statesByCountry);
  const { citiesByKey, totalCities } = normalizeCities(rawCities, statesById);

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(path.join(outputRoot, 'states'), { recursive: true });
  await mkdir(path.join(outputRoot, 'cities'), { recursive: true });

  await writeJson(path.join(outputRoot, 'countries.json'), countries);

  for (const country of countries) {
    const states = statesByCountry.get(country.code) || [];
    await writeJson(
      path.join(outputRoot, 'states', `${country.code}.json`),
      states
    );

    const countryCityDirectory = path.join(outputRoot, 'cities', country.code);
    await mkdir(countryCityDirectory, { recursive: true });

    if (country.hasStates) {
      for (const state of states) {
        const cities = [...(citiesByKey.get(`${country.code}:${state.code}`)?.values() || [])].sort(
          compareByName
        );
        await writeJson(
          path.join(countryCityDirectory, `${state.code}.json`),
          cities
        );
      }
    }

    const rootCities = [...(citiesByKey.get(`${country.code}:__root`)?.values() || [])].sort(
      compareByName
    );
    await writeJson(path.join(countryCityDirectory, '__root.json'), rootCities);
  }

  await writeJson(path.join(outputRoot, 'manifest.json'), {
    source: {
      ...SOURCE,
      generatedAt: new Date().toISOString(),
    },
    counts: {
      countries: countries.length,
      states: [...statesByCountry.values()].reduce((total, states) => total + states.length, 0),
      cities: totalCities,
    },
  });

  console.log(
    `Generated location data for ${countries.length} countries, ` +
      `${[...statesByCountry.values()].reduce((total, states) => total + states.length, 0)} states, ` +
      `${totalCities} cities.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
