"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Fuel,
  Car,
  Gauge,
  Zap,
  Droplets,
  DollarSign,
  MapPin,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FuelLogInsert } from "@/types/fuel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fuelLogSchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  vehicle: z.string().min(1, "Vehicle name/plate is required."),
  mileage: z.coerce.number().min(0, "Mileage must be non-negative."),
  km_used: z.coerce.number().min(0, "KM used must be non-negative."),
  litres_filled: z.coerce
    .number()
    .min(0.01, "Litres must be greater than zero."),
  rand_value: z.coerce
    .number()
    .min(0.01, "Rand value must be greater than zero."),
  garage_name: z.string().nullable().optional(),
});

type FuelLogFormValues = z.infer<typeof fuelLogSchema>;

interface FuelLogFormProps {
  onSubmit: (data: FuelLogInsert) => void;
  isSubmitting: boolean;
  onClose: () => void;
}

const FuelLogForm: React.FC<FuelLogFormProps> = ({
  onSubmit,
  isSubmitting,
  onClose,
}) => {
  const form = useForm<FuelLogFormValues>({
    resolver: zodResolver(fuelLogSchema),
    defaultValues: {
      date: new Date(),
      vehicle: "",
      mileage: 0,
      km_used: 0,
      litres_filled: 0,
      rand_value: 0,
      garage_name: "",
    },
  });

  const calculateFuelEfficiency = () => {
    const litres = form.watch("litres_filled");
    const kmUsed = form.watch("km_used");

    if (litres > 0 && kmUsed > 0) {
      const efficiency = kmUsed / litres;
      return efficiency.toFixed(2);
    }
    return "0.00";
  };

  const calculateCostPerKm = () => {
    const cost = form.watch("rand_value");
    const kmUsed = form.watch("km_used");

    if (cost > 0 && kmUsed > 0) {
      const costPerKm = cost / kmUsed;
      return costPerKm.toFixed(2);
    }
    return "0.00";
  };

  const handleSubmit = (values: FuelLogFormValues) => {
    const data: FuelLogInsert = {
      date: format(values.date, "yyyy-MM-dd"),
      vehicle: values.vehicle,
      mileage: values.mileage,
      km_used: values.km_used,
      litres_filled: values.litres_filled,
      rand_value: values.rand_value,
      garage_name: values.garage_name || null,
    };
    onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">New Fuel Log</h1>
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200">
              <Fuel className="h-3 w-3 mr-1" />
              Log
            </Badge>
          </div>
          <p className="text-gray-600 text-sm">
            Record fuel consumption and track vehicle efficiency
          </p>
        </div>

        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5">
                {/* Date and Vehicle Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Trip Details
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center mb-2">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                            Fill Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "h-11 w-full justify-start text-left font-normal bg-gray-50 border-gray-200 hover:bg-gray-100",
                                    !field.value && "text-muted-foreground"
                                  )}>
                                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="bg-white"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                            <Car className="h-3.5 w-3.5 mr-1.5" />
                            Vehicle
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Bakkie / Toyota Hilux / CA 123-456"
                                className="h-11 pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                              />
                              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Mileage Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Gauge className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Distance
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Current Mileage
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="1"
                                placeholder="120000"
                                className="h-11 pr-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                {...field}
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                km
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="km_used"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            KM Used
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="1"
                                placeholder="500"
                                className="h-11 pr-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                {...field}
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                km
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Fuel Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Droplets className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Fuel Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="litres_filled"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Litres Filled
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="50.00"
                                className="h-11 pr-10 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                {...field}
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                L
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rand_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Total Cost
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="1200.00"
                                className="h-11 pl-8 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                {...field}
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                R
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="garage_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1.5" />
                          Garage/Station
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Engen / Shell / BP"
                            className="h-11 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Efficiency Stats */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800">
                      Efficiency Stats
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">
                        Fuel Efficiency
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {calculateFuelEfficiency()}{" "}
                        <span className="text-sm font-medium text-gray-600">
                          km/L
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">
                        Cost per KM
                      </div>
                      <div className="text-lg font-bold text-orange-600">
                        R{calculateCostPerKm()}{" "}
                        <span className="text-sm font-medium text-gray-600">
                          /km
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium shadow-lg shadow-orange-500/20">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Recording...
                      </div>
                    ) : (
                      <>
                        <Fuel className="h-4 w-4 mr-2" />
                        Record Fuel Log
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="h-11 border-gray-300 text-gray-700 hover:bg-gray-50">
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FuelLogForm;
