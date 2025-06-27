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
import type { Locale } from "@/config/i18n-config";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCurrency } from "@/context/currency-provider";
import { priceRates, formatCurrency } from "@/lib/currency";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const getConciergeFormSchema = (dictionary: any) => z.object({
  interests: z.string().min(10, {
    message: dictionary.interestsError,
  }),
});

export function AiConcierge({ dictionary, lang }: { dictionary: any, lang: Locale }) {
  const [recommendation, setRecommendation] = useState<LocalAttractionRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useCurrency();
  
  const conciergeFormSchema = getConciergeFormSchema(dictionary);

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
        language: lang === 'id' ? 'Indonesian' : 'English'
      });
      setRecommendation(result);
    } catch (e) {
      setError(dictionary.error);
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
                <FormLabel className="text-foreground">{dictionary.interestsLabel}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={dictionary.interestsPlaceholder}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? dictionary.buttonLoading : dictionary.button}
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
              {dictionary.recommendationsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recommendation.recommendations && recommendation.recommendations.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                    {recommendation.recommendations.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-left hover:no-underline">
                                <div className="flex w-full items-center justify-between gap-4">
                                  <span className="flex-1">{item.title}</span>
                                  {item.category && <Badge variant="secondary">{item.category}</Badge>}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="whitespace-pre-wrap text-muted-foreground">
                                {item.description}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}

            {recommendation.flights && recommendation.flights.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">{dictionary.flightsTitle}</h3>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{dictionary.flightNumber}</TableHead>
                                <TableHead>{dictionary.airline}</TableHead>
                                <TableHead>{dictionary.departure}</TableHead>
                                <TableHead>{dictionary.arrival}</TableHead>
                                <TableHead className="text-right">{dictionary.price}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recommendation.flights.map((flight) => (
                                <TableRow key={flight.flightNumber}>
                                    <TableCell>{flight.flightNumber}</TableCell>
                                    <TableCell>{flight.airline}</TableCell>
                                    <TableCell>{flight.departureTime}</TableCell>
                                    <TableCell>{flight.arrivalTime}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(flight.price * priceRates[currency], currency)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
