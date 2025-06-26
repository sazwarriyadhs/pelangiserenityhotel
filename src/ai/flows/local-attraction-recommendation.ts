'use server';

/**
 * @fileOverview Provides personalized recommendations for local attractions based on user interests.
 *
 * - recommendLocalAttractions - A function that handles the recommendation process.
 * - LocalAttractionRecommendationInput - The input type for the recommendLocalAttractions function.
 * - LocalAttractionRecommendationOutput - The return type for the recommendLocalAttractions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LocalAttractionRecommendationInputSchema = z.object({
  interests: z
    .string()
    .describe('A description of the guest\'s interests and preferences.'),
  hotelLocation: z
    .string()
    .describe('The location of the hotel (e.g., address or city, state).'),
  language: z
    .string()
    .describe('The language for the response (e.g., English, Indonesian).'),
});
export type LocalAttractionRecommendationInput = z.infer<typeof LocalAttractionRecommendationInputSchema>;

const LocalAttractionRecommendationOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of personalized recommendations for local attractions near the hotel.'),
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
  prompt: `You are an AI concierge at a luxury hotel. A guest has requested recommendations for local attractions near the hotel.

  Respond in the following language: {{{language}}}.

  Hotel Location: {{{hotelLocation}}}
  Guest Interests: {{{interests}}}

  Based on the guest's interests and the hotel's location, provide a list of personalized recommendations for local attractions.`,
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
