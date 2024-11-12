import dotenv from "dotenv";
import express from "express";
import {
  updateCurrenciesList,
  updateCurrencyRates,
} from "./services/notionService.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    await updateCurrenciesList();
    await updateCurrencyRates();

    res.status(200).json({ message: "Rates updated successfully" });
  } catch (error) {
    console.error("Error updating currency rates:", error);
    res.status(500).send("Error updating currency rates.");
  }
});

// Schedule the task to run every hour
// cron.schedule("0 * * * *", async () => {
//   try {
//     await updateCryptoPrices();
//   } catch (error) {
//     console.error("Error during scheduled update:", error);
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
