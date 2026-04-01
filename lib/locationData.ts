export interface Country {
  code: string;
  name: string;
  hasStates: boolean;
}

export interface State {
  code: string;
  name: string;
}

export interface City {
  name: string;
}

export interface LocationManifest {
  source: {
    repository: string;
    releaseTag: string;
    license: string;
    generatedAt: string;
  };
  counts: {
    countries: number;
    states: number;
    cities: number;
  };
}

const LOCATION_DATA_BASE_PATH = '/location-data';
const countryCache: {
  promise: Promise<Country[]> | null;
  value: Country[] | null;
} = {
  promise: null,
  value: null,
};
const stateCache = new Map<string, Promise<State[]>>();
const cityCache = new Map<string, Promise<City[]>>();
let manifestPromise: Promise<LocationManifest> | null = null;

function normalizeLookupValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

async function fetchLocationJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    cache: 'force-cache',
  });

  if (response.status === 404) {
    return [] as T;
  }

  if (!response.ok) {
    throw new Error(`Failed to load location data from ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function getCountries() {
  if (countryCache.value) {
    return countryCache.value;
  }

  if (!countryCache.promise) {
    countryCache.promise = fetchLocationJson<Country[]>(
      `${LOCATION_DATA_BASE_PATH}/countries.json`
    ).then((countries) => {
      countryCache.value = countries;
      return countries;
    });
  }

  return countryCache.promise;
}

export async function getStates(countryCode: string) {
  const normalizedCountryCode = countryCode.toUpperCase();

  if (!stateCache.has(normalizedCountryCode)) {
    stateCache.set(
      normalizedCountryCode,
      fetchLocationJson<State[]>(
        `${LOCATION_DATA_BASE_PATH}/states/${normalizedCountryCode}.json`
      )
    );
  }

  return stateCache.get(normalizedCountryCode)!;
}

export async function getCities(countryCode: string, stateCode?: string) {
  const normalizedCountryCode = countryCode.toUpperCase();
  const normalizedStateCode = stateCode?.toUpperCase() || '__root';
  const cacheKey = `${normalizedCountryCode}:${normalizedStateCode}`;

  if (!cityCache.has(cacheKey)) {
    const fileName = stateCode ? normalizedStateCode : '__root';
    cityCache.set(
      cacheKey,
      fetchLocationJson<City[]>(
        `${LOCATION_DATA_BASE_PATH}/cities/${normalizedCountryCode}/${fileName}.json`
      )
    );
  }

  return cityCache.get(cacheKey)!;
}

export async function hasStates(countryCode: string) {
  const country = await findCountry(countryCode);
  return Boolean(country?.hasStates);
}

export async function findCountry(value: string) {
  const normalizedValue = normalizeLookupValue(value);
  const countries = await getCountries();

  return (
    countries.find((country) => normalizeLookupValue(country.code) === normalizedValue) ||
    countries.find((country) => normalizeLookupValue(country.name) === normalizedValue) ||
    null
  );
}

export async function findState(countryCode: string, value: string) {
  const normalizedValue = normalizeLookupValue(value);
  const states = await getStates(countryCode);

  return (
    states.find((state) => normalizeLookupValue(state.code) === normalizedValue) ||
    states.find((state) => normalizeLookupValue(state.name) === normalizedValue) ||
    null
  );
}

export async function findCity(countryCode: string, value: string, stateCode?: string) {
  const normalizedValue = normalizeLookupValue(value);
  const cities = await getCities(countryCode, stateCode);

  return (
    cities.find((city) => normalizeLookupValue(city.name) === normalizedValue) || null
  );
}

export async function getLocationManifest() {
  if (!manifestPromise) {
    manifestPromise = fetchLocationJson<LocationManifest>(
      `${LOCATION_DATA_BASE_PATH}/manifest.json`
    );
  }

  return manifestPromise;
}
