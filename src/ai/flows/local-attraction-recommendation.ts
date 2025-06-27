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
            { flightNumber: 'TS123', departureTime: '08:00', arrivalTime: '11:30', price: 350, airline: 'Tranquil Air' },
            { flightNumber: 'TS456', departureTime: '14:00', arrivalTime: '17:30', price: 420, airline: 'Tranquil Air' },
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
  prompt: `You are an AI concierge at a luxury hotel. Your primary goal is to provide a list of personalized recommendations for local attractions based on the guest's interests. For each recommendation, you must provide a title, a detailed description, and a relevant category.

  If the guest's request also mentions needing to find flights, use the 'searchFlights' tool to find flight options. Populate the 'flights' field in the output with the search results. Do not mention the flights in the 'recommendations' array.

  The 'recommendations' array should only contain local attraction recommendations.

  Respond in the following language: {{{language}}}.

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
    return output!;
  }
);
