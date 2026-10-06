async function fetchWithRetry(
  url,
  options,
  retries = 5,
  delay = 1000
) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (
        response.status === 429 &&
        retries > 0
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );

        return fetchWithRetry(
          url,
          options,
          retries - 1,
          delay * 2
        );
      }

      throw new Error(
        `Gemini API Error ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );

      return fetchWithRetry(
        url,
        options,
        retries - 1,
        delay * 2
      );
    }

    throw error;
  }
}

exports.generateTravelPlan = async ({
  destination,
  destinationType,
  destinationContext,
  durationDays,
  budgetTier,
  interests
}) => {
  const prompt = `
Create a ${durationDays} day travel itinerary.

Destination: ${destination}
Destination type: ${destinationType || "custom"}
Destination context: ${destinationContext || "Not specified"}

Important: If the destination is a state such as Karnataka, Kerala, Goa, Tamil Nadu, or Andhra Pradesh, treat it as the whole state and recommend suitable places across that state. If it is a city, focus on that city. If it is a country, cover suitable regions/cities in that country.

Budget Tier: ${budgetTier}

Interests:
${interests.join(", ")}

Return ONLY valid JSON.

{
  "itinerary":[
    {
      "dayNumber":1,
      "activities":[
        {
          "title":"string",
          "description":"string",
          "estimatedCostUSD":20,
          "timeOfDay":"Morning"
        }
      ]
    }
  ],

  "hotels":[
    {
      "name":"string",
      "tier":"Budget",
      "estimatedCostNightUSD":50,
      "rating":"4.5/5"
    }
  ],

  "estimatedBudget":{
    "transport":100,
    "accommodation":200,
    "food":100,
    "activities":50,
    "total":450
  },

  "packingList":[
    {
      "item":"Passport",
      "category":"Documents",
      "isPacked":false
    }
  ]
}
`;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],

    generationConfig: {
      responseMimeType:
        "application/json"
    }
  };

  const result = await fetchWithRetry(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify(
        requestBody
      )
    }
  );

  const text =
    result.candidates?.[0]?.content
      ?.parts?.[0]?.text;

  if (!text) {
    throw new Error(
      "Gemini returned empty response"
    );
  }

  return JSON.parse(text);
};