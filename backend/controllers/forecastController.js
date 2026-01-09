import OpenAI from "openai";

let openai = null;
let forecasts = [];

const getOpenAI = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

const generateMockForecast = (category, region, horizon) => {
  return {
    forecast: [450, 520, 580, 620, 680, 720],
    drivers: [
      "Seasonal demand increase",
      "Regional market growth",
      "Product popularity trend",
    ],
    risks: [
      "Supply chain disruptions",
      "Market volatility",
      "Competition impact",
    ],
    recommendations: [
      `Increase ${category} inventory by 20% for ${region}`,
      "Monitor daily sales trends",
      "Set up automated reorder points",
    ],
    confidence: 87,
    note: "Using mock data - OpenAI API not available",
  };
};

export const generateForecast = async (req, res) => {
  try {
    const { category, region, horizon, historicalData } = req.body;

    if (!category || !region) {
      return res
        .status(400)
        .json({ error: "Missing required fields: category, region" });
    }

    // Check if OpenAI is configured
    const hasOpenAI =
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "your_openai_api_key_here";

    let forecastData;

    if (hasOpenAI) {
      try {
        const prompt = `You are an AI inventory forecasting expert. Analyze the following historical sales data and generate a forecast.

Historical Data:
${JSON.stringify(historicalData || [], null, 2)}

Category: ${category}
Region: ${region}
Forecast Horizon: ${horizon || "30 Days"}

Provide a JSON response with:
1. forecast: Array of predicted values
2. drivers: List of demand drivers
3. risks: Potential risk factors
4. recommendations: Suggested actions
5. confidence: Confidence level (0-100)

Return only valid JSON.`;

        const ai = getOpenAI();
        const completion = await ai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        });

        const responseText = completion.choices[0].message.content;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        forecastData = jsonMatch
          ? JSON.parse(jsonMatch[0])
          : { raw: responseText };
      } catch (aiError) {
        console.log(
          "OpenAI API call failed, using mock data:",
          aiError.message
        );
        forecastData = generateMockForecast(category, region, horizon);
      }
    } else {
      // No API key configured, use mock data
      console.log("OpenAI not configured, using mock forecast data");
      forecastData = generateMockForecast(category, region, horizon);
    }

    const forecast = {
      id: Date.now(),
      category,
      region,
      horizon: horizon || "30 Days",
      data: forecastData,
      createdAt: new Date(),
    };

    forecasts.push(forecast);

    res.json({
      success: true,
      forecast,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Forecast error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAIAnalysis = async (req, res) => {
  try {
    const { productSku, days = 30 } = req.query;

    if (!productSku) {
      return res.status(400).json({ error: "productSku is required" });
    }

    const hasOpenAI =
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "your_openai_api_key_here";

    let analysis;

    if (hasOpenAI) {
      try {
        const prompt = `Generate a concise AI-powered inventory analysis for SKU: ${productSku}.
Provide 3 key insights about:
1. Current demand trend
2. Recommended stock level
3. Risk factors

Keep it brief and actionable. Return as JSON with keys: trend, stockRecommendation, risks.`;

        const ai = getOpenAI();
        const completion = await ai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 512,
        });

        analysis = completion.choices[0].message.content;
      } catch (aiError) {
        console.log(
          "OpenAI API call failed, using mock analysis:",
          aiError.message
        );
        analysis = JSON.stringify({
          trend: "Steady demand with seasonal fluctuations",
          stockRecommendation: "Maintain 250-300 units in stock",
          risks: "Monitor for supply chain delays",
          note: "Mock data - OpenAI API not available",
        });
      }
    } else {
      analysis = JSON.stringify({
        trend: "Steady demand with seasonal fluctuations",
        stockRecommendation: "Maintain 250-300 units in stock",
        risks: "Monitor for supply chain delays",
        note: "Mock data - OpenAI not configured",
      });
    }

    res.json({
      success: true,
      analysis,
      sku: productSku,
      days: parseInt(days),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getForecastHistory = (req, res) => {
  res.json({
    forecasts,
    total: forecasts.length,
  });
};
