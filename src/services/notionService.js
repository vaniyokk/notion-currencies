import { Client } from "@notionhq/client";
import { fetchCurrencies, fetchExchangeRates } from "./currencyService.js";

const initializeNotionClient = () => {
  return new Client({ auth: process.env.NOTION_API_KEY });
};

const getSupportedCurrencies = (currencies) => {
  const SUPPORTED_CURRENCIES = process.env.SUPPORTED_CURRENCIES.split(",");
  return Object.entries(currencies).filter(([code]) =>
    SUPPORTED_CURRENCIES.includes(code.toUpperCase())
  );
};

const upsertPage = async (notion, page, databaseId, properties) => {
  if (page) {
    await notion.pages.update({
      page_id: page.id,
      properties,
    });
  } else {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties,
    });
  }
};

export const updateCurrenciesList = async () => {
  const notion = initializeNotionClient();
  const databaseId = process.env.CURRENCIES_DATABASE_ID;
  const currencies = await fetchCurrencies();
  const supportedCurrencies = getSupportedCurrencies(currencies);

  for (let [code, title] of supportedCurrencies) {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Code",
        rich_text: { equals: code.toUpperCase() },
      },
    });

    const page = response.results[0];
    const properties = {
      Code: {
        rich_text: [{ text: { content: code.toUpperCase() } }],
      },
      Name: {
        title: [{ text: { content: title } }],
      },
    };

    await upsertPage(notion, page, databaseId, properties);
  }
};

export const updateCurrencyRates = async () => {
  const notion = initializeNotionClient();
  const databaseId = process.env.RATES_DATABASE_ID;
  const currencies = await fetchExchangeRates();
  const supportedCurrencies = getSupportedCurrencies(currencies);

  for (let [code, rate] of supportedCurrencies) {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Name",
        title: { equals: code.toUpperCase() },
      },
    });

    const page = response.results[0];
    const properties = {
      Name: {
        title: [{ text: { content: code.toUpperCase() } }],
      },
      "Exchange Rate": {
        number: rate,
      },
    };

    await upsertPage(notion, page, databaseId, properties);
  }
};
