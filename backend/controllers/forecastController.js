import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

let forecasts = [];

export const generateForecast = async (req, res) => {
  try {
    const { category, region, horizon, historicalData } = req.body;

    if (!category || !region) {
      return res
        .status(400)
        .json({ error: "Missing required fields: category, region" });
    }

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

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const forecastData = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { raw: responseText };

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

    const prompt = `Generate a concise AI-powered inventory analysis for SKU: ${productSku}.
Provide 3 key insights about:
1. Current demand trend
2. Recommended stock level
3. Risk factors

Keep it brief and actionable. Return as JSON with keys: trend, stockRecommendation, risks.`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const analysis =
      message.content[0].type === "text" ? message.content[0].text : "";

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
