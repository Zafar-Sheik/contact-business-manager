"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Fuel,
  Gauge,
  DollarSign,
  Truck,
  MapPin,
  Calendar,
  TrendingDown,
  BarChart3,
  Filter,
  Download,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useFuel } from "@/hooks/use-fuel";
import { FuelLogInsert } from "@/types/fuel";
import FuelLogForm from "@/components/FuelLogForm";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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

  const averagePricePerLitre =
    totalLitres > 0 ? totalRandValue / totalLitres : 0;
  const averageConsumption = totalKm > 0 ? (totalLitres / totalKm) * 100 : 0; // L/100km
  const averageCostPerKm = totalKm > 0 ? totalRandValue / totalKm : 0;

  // Calculate stats by vehicle
  const vehicleStats = fuelLogs.reduce((acc, log) => {
    if (!acc[log.vehicle]) {
      acc[log.vehicle] = { litres: 0, cost: 0, km: 0, fillups: 0 };
    }
    acc[log.vehicle].litres += log.litres_filled;
    acc[log.vehicle].cost += log.rand_value;
    acc[log.vehicle].km += log.km_used;
    acc[log.vehicle].fillups += 1;
    return acc;
  }, {} as Record<string, { litres: number; cost: number; km: number; fillups: number }>);

  const uniqueVehicles = Object.keys(vehicleStats).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-10 w-10 border-gray-200 hover:bg-gray-50">
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Fuel Management
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Track and analyze fleet fuel consumption
                </p>
              </div>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <Button
                onClick={() => setIsFormOpen(true)}
                disabled={isLoading}
                className="h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-purple-500/20">
                <Plus className="h-4 w-4 mr-2" /> Record Fill-up
              </Button>
              <DialogContent className="sm:max-w-[550px] p-0 border-0">
                <DialogHeader className="p-6 border-b border-gray-100">
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Record New Fuel Fill-up
                  </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                  <FuelLogForm
                    onSubmit={handleSubmit}
                    isSubmitting={isAdding}
                    onClose={handleCloseForm}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Spend
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {formatCurrency(totalRandValue)}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg. Price / Litre
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatCurrency(averagePricePerLitre)}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Fuel className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg. Consumption
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {averageConsumption.toFixed(2)} L/100km
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Gauge className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg. Cost / KM
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {formatCurrency(averageCostPerKm)}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Overview */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-0">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Fleet Overview
                </h3>
                <Badge variant="outline" className="ml-auto bg-white">
                  {uniqueVehicles} vehicle{uniqueVehicles !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>

            <div className="p-5">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : fuelLogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Fuel className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No fuel logs recorded yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Start tracking your fuel consumption by recording your first
                    fill-up.
                  </p>
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    className="mt-4 h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium">
                    <Plus className="h-4 w-4 mr-2" /> Record First Fill-up
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-800">
                      Recent Fill-ups
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 border-gray-300">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 border-gray-300">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {fuelLogs.map((log) => (
                    <Card
                      key={log.id}
                      className="border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                          {/* Vehicle and Garage Info */}
                          <div className="mb-4 md:mb-0 md:mr-6">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Truck className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg">
                                  {log.vehicle}
                                </h4>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(new Date(log.date), "PP")}
                                </div>
                              </div>
                            </div>

                            {log.garage_name && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-3 w-3 mr-1" />
                                {log.garage_name}
                              </div>
                            )}
                          </div>

                          {/* Fuel Details */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Litres</p>
                              <p className="text-xl font-bold text-blue-700">
                                {log.litres_filled.toFixed(2)} L
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-sm text-gray-600">Cost</p>
                              <p className="text-xl font-bold text-red-700">
                                {formatCurrency(log.rand_value)}
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-sm text-gray-600">Price/L</p>
                              <p className="text-xl font-bold text-green-700">
                                {formatCurrency(
                                  log.rand_value / log.litres_filled
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <p className="text-gray-600">Mileage</p>
                            <p className="font-semibold text-gray-900">
                              {log.mileage} KM
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-gray-600">KM Used</p>
                            <p className="font-semibold text-gray-900">
                              {log.km_used} KM
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-gray-600">Consumption</p>
                            <p className="font-semibold text-amber-700">
                              {(
                                (log.litres_filled / log.km_used) *
                                100
                              ).toFixed(2)}{" "}
                              L/100km
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-gray-600">Cost/KM</p>
                            <p className="font-semibold text-purple-700">
                              {formatCurrency(log.rand_value / log.km_used)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {fuelLogs.length > 0 && !isLoading && (
              <div className="border-t border-gray-100">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-3 md:mb-0">
                      <Fuel className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {fuelLogs.length} fill-ups • {totalLitres.toFixed(2)}{" "}
                        litres total
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        Total Fuel Spend:
                      </div>
                      <div className="text-lg font-bold text-red-700">
                        {formatCurrency(totalRandValue)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Summary */}
        {uniqueVehicles > 0 && !isLoading && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Vehicle Performance Summary
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(vehicleStats).map(([vehicle, stats]) => {
                const consumption =
                  stats.km > 0
                    ? ((stats.litres / stats.km) * 100).toFixed(2)
                    : "0";
                const costPerKm =
                  stats.km > 0 ? (stats.cost / stats.km).toFixed(2) : "0";

                return (
                  <div
                    key={vehicle}
                    className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-bold text-gray-900 mb-2">{vehicle}</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Fill-ups</p>
                        <p className="font-semibold">{stats.fillups}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Litres</p>
                        <p className="font-semibold text-blue-700">
                          {stats.litres.toFixed(2)} L
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Cost</p>
                        <p className="font-semibold text-red-700">
                          {formatCurrency(stats.cost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Consumption</p>
                        <p className="font-semibold text-green-700">
                          {consumption} L/100km
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelPage;
