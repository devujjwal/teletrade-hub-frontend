// Location data for cascading dropdowns
export interface LocationData {
  countries: Country[];
}

export interface Country {
  code: string;
  name: string;
  states?: State[];
  cities?: string[]; // Direct cities if no states
}

export interface State {
  code: string;
  name: string;
  cities: string[];
}

export const locationData: LocationData = {
  countries: [
    {
      code: "DE",
      name: "Germany",
      states: [
        {
          code: "BE",
          name: "Berlin",
          cities: ["Berlin"],
        },
        {
          code: "BY",
          name: "Bavaria",
          cities: ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Würzburg"],
        },
        {
          code: "BW",
          name: "Baden-Württemberg",
          cities: ["Stuttgart", "Karlsruhe", "Mannheim", "Freiburg", "Heidelberg"],
        },
        {
          code: "HE",
          name: "Hesse",
          cities: ["Frankfurt", "Wiesbaden", "Kassel", "Darmstadt", "Offenbach"],
        },
        {
          code: "NW",
          name: "North Rhine-Westphalia",
          cities: ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Bonn"],
        },
        {
          code: "HH",
          name: "Hamburg",
          cities: ["Hamburg"],
        },
        {
          code: "SN",
          name: "Saxony",
          cities: ["Dresden", "Leipzig", "Chemnitz"],
        },
      ],
    },
    {
      code: "AT",
      name: "Austria",
      states: [
        {
          code: "W",
          name: "Vienna",
          cities: ["Vienna"],
        },
        {
          code: "S",
          name: "Salzburg",
          cities: ["Salzburg", "Hallein"],
        },
        {
          code: "T",
          name: "Tyrol",
          cities: ["Innsbruck", "Kufstein"],
        },
      ],
    },
    {
      code: "CH",
      name: "Switzerland",
      cities: ["Zurich", "Geneva", "Basel", "Bern", "Lausanne"],
    },
    {
      code: "FR",
      name: "France",
      states: [
        {
          code: "IDF",
          name: "Île-de-France",
          cities: ["Paris", "Versailles", "Boulogne-Billancourt"],
        },
        {
          code: "PAC",
          name: "Provence-Alpes-Côte d'Azur",
          cities: ["Marseille", "Nice", "Toulon", "Aix-en-Provence"],
        },
        {
          code: "ARA",
          name: "Auvergne-Rhône-Alpes",
          cities: ["Lyon", "Grenoble", "Saint-Étienne"],
        },
      ],
    },
    {
      code: "IT",
      name: "Italy",
      states: [
        {
          code: "LOM",
          name: "Lombardy",
          cities: ["Milan", "Bergamo", "Brescia"],
        },
        {
          code: "LAZ",
          name: "Lazio",
          cities: ["Rome", "Latina"],
        },
        {
          code: "TOS",
          name: "Tuscany",
          cities: ["Florence", "Pisa", "Siena"],
        },
        {
          code: "VEN",
          name: "Veneto",
          cities: ["Venice", "Verona", "Padua"],
        },
      ],
    },
    {
      code: "ES",
      name: "Spain",
      states: [
        {
          code: "MD",
          name: "Community of Madrid",
          cities: ["Madrid", "Alcalá de Henares"],
        },
        {
          code: "CT",
          name: "Catalonia",
          cities: ["Barcelona", "Girona", "Tarragona"],
        },
        {
          code: "AN",
          name: "Andalusia",
          cities: ["Seville", "Málaga", "Granada", "Córdoba"],
        },
        {
          code: "VC",
          name: "Valencian Community",
          cities: ["Valencia", "Alicante"],
        },
      ],
    },
    {
      code: "NL",
      name: "Netherlands",
      cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
    },
    {
      code: "BE",
      name: "Belgium",
      cities: ["Brussels", "Antwerp", "Ghent", "Bruges", "Liège"],
    },
    {
      code: "PL",
      name: "Poland",
      cities: ["Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk"],
    },
    {
      code: "CZ",
      name: "Czech Republic",
      cities: ["Prague", "Brno", "Ostrava", "Plzeň"],
    },
    {
      code: "SK",
      name: "Slovakia",
      cities: ["Bratislava", "Košice", "Prešov", "Žilina", "Nitra"],
    },
    {
      code: "HU",
      name: "Hungary",
      cities: ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs"],
    },
    {
      code: "GB",
      name: "United Kingdom",
      states: [
        {
          code: "ENG",
          name: "England",
          cities: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
        },
        {
          code: "SCT",
          name: "Scotland",
          cities: ["Edinburgh", "Glasgow", "Aberdeen"],
        },
        {
          code: "WLS",
          name: "Wales",
          cities: ["Cardiff", "Swansea"],
        },
      ],
    },
  ],
};

export const getCountries = () => locationData.countries;

export const getStates = (countryCode: string) => {
  const country = locationData.countries.find((c) => c.code === countryCode);
  return country?.states || [];
};

export const getCities = (countryCode: string, stateCode?: string) => {
  const country = locationData.countries.find((c) => c.code === countryCode);
  if (!country) return [];
  
  // Country has direct cities (no states)
  if (country.cities) return country.cities;
  
  // Country has states
  if (country.states && stateCode) {
    const state = country.states.find((s) => s.code === stateCode);
    return state?.cities || [];
  }
  
  return [];
};

export const hasStates = (countryCode: string) => {
  const country = locationData.countries.find((c) => c.code === countryCode);
  return Boolean(country?.states && country.states.length > 0);
};

export const getCountryByName = (name: string) => {
  return locationData.countries.find((c) => c.name === name);
};

export const getStateByName = (countryCode: string, stateName: string) => {
  const states = getStates(countryCode);
  return states.find((s) => s.name === stateName);
};

