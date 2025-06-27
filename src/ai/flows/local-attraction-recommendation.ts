'use server';

/**
 * @fileOverview Provides personalized recommendations for local attractions and flights based on user interests.
 *
 * - recommendLocalAttractions - A function that handles the recommendation process.
 * - LocalAttractionRecommendationInput - The input type for the recommendLocalAttractions function.
 * - LocalAttractionRecommendationOutput - The return type for the recommendLocalAttractions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlightSearchInputSchema = z.object({
  origin: z.string().describe('The starting airport code, e.g., JFK.'),
  destination: z.string().describe('The destination airport code, e.g., LAX.'),
  date: z.string().describe('The date of the flight in YYYY-MM-DD format.'),
});

const FlightSchema = z.object({
    flightNumber: z.string(),
    departureTime: z.string(),
    arrivalTime: z.string(),
    price: z.number().describe("Price in USD"),
    airline: z.string(),
});

const FlightSearchOutputSchema = z.array(FlightSchema);

const searchFlights = ai.defineTool(
    {
        name: 'searchFlights',
        description: 'Searches for available flights between two locations on a specific date.',
        inputSchema: FlightSearchInputSchema,
        outputSchema: FlightSearchOutputSchema,
    },
    async (input) => {
        console.log(`Searching for flights from ${input.origin} to ${input.destination} on ${input.date}`);
        // In a real app, this would call a travel marketplace API.
        // For this prototype, we return mock data.
        return [
            { flightNumber: 'SA123', departureTime: '08:00', arrivalTime: '11:30', price: 350, airline: 'Serenity Air' },
            { flightNumber: 'SA456', departureTime: '14:00', arrivalTime: '17:30', price: 420, airline: 'Serenity Air' },
        ];
    }
);

const LocalAttractionRecommendationInputSchema = z.object({
  interests: z
    .string()
    .describe('A description of the guest\'s interests and preferences. This may include requests for flights or other travel arrangements.'),
  hotelLocation: z
    .string()
    .describe('The location of the hotel (e.g., address or city, state).'),
  language: z
    .string()
    .describe('The language for the response (e.g., English, Indonesian).'),
});
export type LocalAttractionRecommendationInput = z.infer<typeof LocalAttractionRecommendationInputSchema>;

const LocalAttractionRecommendationOutputSchema = z.object({
  recommendations: z.array(z.object({
    title: z.string().describe('The name or title of the local attraction.'),
    description: z.string().describe('A detailed description of the attraction and why it is recommended based on the user\'s interests.'),
    category: z.string().describe("A category for the attraction, for example: 'Museum', 'Restaurant', 'Park', 'Shopping', 'Music Venue'.")
  })).describe('A list of personalized recommendations for local attractions near the hotel. Each recommendation should have a title, a description, and a category.'),
  flights: z.array(FlightSchema).optional().describe('A list of flight options, if requested by the user.'),
});
export type LocalAttractionRecommendationOutput = z.infer<typeof LocalAttractionRecommendationOutputSchema>;

export async function recommendLocalAttractions(
  input: LocalAttractionRecommendationInput
): Promise<LocalAttractionRecommendationOutput> {
  return recommendLocalAttractionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'localAttractionRecommendationPrompt',
  input: {schema: LocalAttractionRecommendationInputSchema},
  output: {schema: LocalAttractionRecommendationOutputSchema},
  tools: [searchFlights],
  system: `You are an expert AI concierge for a luxury hotel. Your role is to provide guests with personalized local attraction recommendations and assist with flight searches.

You MUST follow these rules:
1. Your entire response MUST be in a valid JSON format that strictly adheres to the provided output schema.
2. Generate a list of local attraction recommendations based on the guest's interests. Each recommendation must include a title, a detailed description, and a category.
3. If and ONLY IF the guest's request explicitly mentions flights, you MUST use the 'searchFlights' tool to get flight information.
4. Populate the 'flights' field in the output with the results from the 'searchFlights' tool. If no flights are requested, this field should be omitted or be an empty array.
5. The 'recommendations' array should NEVER contain flight information. It is exclusively for local attractions.
6. All text in your response (titles, descriptions) MUST be in the requested language.`,
  prompt: `
  Language for response: {{{language}}}
  Hotel Location: {{{hotelLocation}}}
  Guest Interests and Requests: {{{interests}}}`,
});

const recommendLocalAttractionsFlow = ai.defineFlow(
  {
    name: 'recommendLocalAttractionsFlow',
    inputSchema: LocalAttractionRecommendationInputSchema,
    outputSchema: LocalAttractionRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to get a structured response from the language model.");
    }
    return output;
  }
);
