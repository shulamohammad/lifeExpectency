
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Step 1: Render the form
app.get("/", (req, res) => {
  res.render("index.ejs", { data: null, error: null });
});

// Step 2: Handle form submission and fetch total life expectancy data
app.post("/", async (req, res) => {
  const { country, dob, sex } = req.body;

  try {
    // Construct the API URL for total life expectancy calculation
    const response = await axios.get(
      `https://d6wn6bmjj722w.population.io:443/1.0/life-expectancy/total/${sex}/${country}/${dob}`
    );

    // Extract the response data and round the life expectancy
    const data = response.data;
    data.total_life_expectancy = Math.round(data.total_life_expectancy); // Round the life expectancy

    res.render("index.ejs", { data: data, error: null });
  } catch (error) {
    console.error("Failed to fetch data:", error.response ? error.response.data : error.message);
    res.render("index.ejs", {
      data: null,
      error: "Failed to fetch total life expectancy data. Please try again later.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
