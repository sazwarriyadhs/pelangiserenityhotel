"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { rooms } from "@/lib/constants";
import type { Booking } from "@/lib/bookings-constants";

const getBookingFormSchema = (dictionary: any) => z.object({
  guestName: z.string().min(2, {
    message: dictionary.errors.guestNameRequired,
  }),
  roomType: z.string({
    required_error: dictionary.errors.roomRequired,
  }),
  dates: z.object({
      from: z.date({
        required_error: dictionary.errors.checkinRequired,
      }),
      to: z.date({
        required_error: dictionary.errors.checkoutRequired,
      }),
    },
    {
      required_error: dictionary.errors.datesRequired,
    }
  ),
});

export function BookingForm({ dictionary }: { dictionary: any }) {
  const { toast } = useToast();
  
  const bookingFormSchema = getBookingFormSchema(dictionary);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guestName: "",
    }
  });

  function onSubmit(data: z.infer<typeof bookingFormSchema>) {
    // Simulate backend integration by storing in localStorage
    const roomDetails = rooms.find(r => r.name === data.roomType);
    if (!roomDetails) {
        // Should not happen if form is validated
        return;
    }

    const numberOfNights = differenceInDays(data.dates.to, data.dates.from);
    
    const newBooking: Booking = {
      id: `BK-${Math.floor(Math.random() * 10000)}`,
      guest: data.guestName,
      room: data.roomType,
      checkIn: format(data.dates.from, "yyyy-MM-dd"),
      checkOut: format(data.dates.to, "yyyy-MM-dd"),
      amount: roomDetails.price * numberOfNights,
      status: 'Confirmed',
    };

    try {
      const existingBookings: Booking[] = JSON.parse(localStorage.getItem('serenity-bookings') || '[]');
      const updatedBookings = [...existingBookings, newBooking];
      localStorage.setItem('serenity-bookings', JSON.stringify(updatedBookings));

      toast({
        title: dictionary.successTitle,
        description: dictionary.successDescription
          .replace('{guestName}', data.guestName)
          .replace('{roomType}', data.roomType)
          .replace('{from}', format(data.dates.from, "PPP"))
          .replace('{to}', format(data.dates.to, "PPP")),
      });
      form.reset();

    } catch (error) {
      console.error("Failed to save booking to localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save booking. Please try again.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
         <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.guestName}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.guestNamePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.roomType}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={dictionary.selectRoom} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.name} value={room.name}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dates"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{dictionary.dates}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} -{" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>{dictionary.pickDates}</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={{from: field.value?.from, to: field.value?.to}}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {dictionary.button}
        </Button>
      </form>
    </Form>
  );
}
