"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Fuel, Gauge, DollarSign } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useFuel } from "@/hooks/use-fuel";
import { FuelLogInsert } from "@/types/fuel";
import FuelLogForm from "@/components/FuelLogForm";
import { Separator } from "@/components/ui/separator";

const FuelPage: React.FC = () => {
  const { fuelLogs, isLoading, addFuelLog, isAdding } = useFuel();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (data: FuelLogInsert) => {
    addFuelLog(data);
    handleCloseForm();
  };
  
  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;
  
  // Summary Calculations
  const totalLitres = fuelLogs.reduce((sum, log) => sum + log.litres_filled, 0);
  const totalRandValue = fuelLogs.reduce((sum, log) => sum + log.rand_value, 0);
  const totalKm = fuelLogs.reduce((sum, log) => sum + log.km_used, 0);
  
  const averagePricePerLitre = totalLitres > 0 ? totalRandValue / totalLitres : 0;
  const averageConsumption = totalKm > 0 ? totalLitres / totalKm * 100 : 0; // L/100km

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Fuel Management</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsFormOpen(true)} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" /> Record Fill-up
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Record New Fuel Log</DialogTitle>
            </DialogHeader>
            <FuelLogForm
              onSubmit={handleSubmit}
              isSubmitting={isAdding}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </header>
      
      {/* Summary Cards */}
      <div className="max-w-4xl mx-auto space-y-4 mb-6">
        <h2 className="text-xl font-semibold">Fleet Overview (All Time)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-xl font-bold text-red-600">
                  {formatCurrency(totalRandValue)}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Avg. Price / Litre</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-xl font-bold">
                  {formatCurrency(averagePricePerLitre)}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">Avg. Consumption</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-xl font-bold">
                  {averageConsumption.toFixed(2)} L/100km
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold mb-4">Recent Fill-ups</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : fuelLogs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No fuel logs recorded yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {fuelLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4 space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-semibold text-lg">{log.vehicle}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(log.date), "PPP")} @ {log.garage_name || 'Unknown Garage'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(log.rand_value)}
                      </p>
                      <p className="text-sm text-muted-foreground">{log.litres_filled.toFixed(2)} Litres</p>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-3 text-xs text-muted-foreground">
                    <p>Mileage: {log.mileage} KM</p>
                    <p>KM Used: {log.km_used} KM</p>
                    <p className="text-right">L/KM: {(log.litres_filled / log.km_used * 100).toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelPage;