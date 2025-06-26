"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recommendLocalAttractions, LocalAttractionRecommendationOutput } from "@/ai/flows/local-attraction-recommendation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const conciergeFormSchema = z.object({
  interests: z.string().min(10, {
    message: "Please tell us a bit more about your interests.",
  }),
});

export function AiConcierge() {
  const [recommendation, setRecommendation] = useState<LocalAttractionRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof conciergeFormSchema>>({
    resolver: zodResolver(conciergeFormSchema),
    defaultValues: {
      interests: "",
    },
  });

  async function onSubmit(values: z.infer<typeof conciergeFormSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await recommendLocalAttractions({
        interests: values.interests,
        hotelLocation: "Beverly Hills, CA",
      });
      setRecommendation(result);
    } catch (e) {
      setError("We encountered an issue getting your recommendations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Your Interests</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., fine dining, modern art, live music, parks..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Generating..." : "Get Recommendations"}
            {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </Form>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {recommendation && (
        <Card className="mt-6 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Sparkles />
              Your Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-p:text-foreground/80 whitespace-pre-wrap">
              {recommendation.recommendations}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
