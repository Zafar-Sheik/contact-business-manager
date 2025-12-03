"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  PackageCheck,
  Building,
  Calendar,
  FileText,
  CheckCircle,
  Truck,
  DollarSign,
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
import { useGrvs } from "@/hooks/use-grvs";
import { GrvInsert } from "@/types/grv";
import GrvForm from "@/components/GrvForm";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const GrvsPage: React.FC = () => {
  const { grvs, suppliers, stockItems, isLoading, addGrv, isAdding } =
    useGrvs();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = (data: GrvInsert) => {
    addGrv(data);
    handleCloseForm();
  };

  const getSupplierName = (supplierId: string | null) => {
    return (
      suppliers.find((s) => s.id === supplierId)?.supplier_name ||
      "Unknown Supplier"
    );
  };

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  // Calculate summary stats
  const totalGrvs = grvs.length;
  const uniqueSuppliers = [...new Set(grvs.map((g) => g.supplier_id))].length;
  const recentGrvs = grvs.slice(0, 5); // Show only 5 most recent

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
                <Link to="/financial-hub">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Goods Received Vouchers
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Track and manage incoming stock deliveries
                </p>
              </div>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <Button
                onClick={() => setIsFormOpen(true)}
                disabled={isLoading}
                className="h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-purple-500/20">
                <Plus className="h-4 w-4 mr-2" /> Record GRV
              </Button>
              <DialogContent className="sm:max-w-[700px] p-0 border-0 max-h-[90vh]">
                <DialogHeader className="p-6 border-b border-gray-100">
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Record New Goods Received Voucher
                  </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                  <GrvForm
                    suppliers={suppliers}
                    availableStock={stockItems as any}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total GRVs
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalGrvs}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <PackageCheck className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Unique Suppliers
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {uniqueSuppliers}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Recent Activity
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    {recentGrvs.length}
                  </p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GRV List */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Goods Received Vouchers
                </h3>
                <Badge variant="outline" className="ml-auto bg-white">
                  {grvs.length} total
                </Badge>
              </div>
            </div>

            <div className="p-5">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : grvs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <PackageCheck className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No GRVs recorded yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Start tracking incoming stock deliveries by recording your
                    first GRV.
                  </p>
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    className="mt-4 h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium">
                    <Plus className="h-4 w-4 mr-2" /> Record First GRV
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-800">
                      All GRV Records
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

                  {grvs.map((grv) => (
                    <Card
                      key={grv.id}
                      className="border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                          {/* GRV Header */}
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="p-2 bg-green-50 rounded-lg">
                                <PackageCheck className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg">
                                  GRV: {grv.reference}
                                </h4>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(new Date(grv.date), "PPP")}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center text-gray-600">
                                <Building className="h-3 w-3 mr-1" />
                                {getSupplierName(grv.supplier_id)}
                              </div>
                              {grv.order_no && (
                                <div className="flex items-center text-gray-600">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Order: {grv.order_no}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 h-8">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Received
                          </Badge>
                        </div>

                        {/* GRV Note */}
                        {grv.note && (
                          <>
                            <Separator className="my-4" />
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                              <div className="flex items-start">
                                <FileText className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                                <p className="text-sm text-gray-700 italic">
                                  {grv.note}
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                        <Separator className="my-4" />

                        {/* Items Preview */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Items received (item details feature coming soon)
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-blue-300 text-blue-600 hover:bg-blue-50"
                            disabled>
                            View Items
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {grvs.length > 0 && !isLoading && (
              <div className="border-t border-gray-100">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-green-50">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-3 md:mb-0">
                      <PackageCheck className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {grvs.length} GRVs recorded from {uniqueSuppliers}{" "}
                        supplier{uniqueSuppliers !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        GRV Management
                      </div>
                      <div className="text-sm text-gray-500">
                        Track all incoming stock deliveries
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                What is a GRV?
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                GRV stands for Goods Received Voucher
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                Used to record incoming stock from suppliers
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                Essential for inventory management and supplier payment
                processing
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                GRV Benefits
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                Accurate stock level tracking
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></div>
                Supplier payment verification
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></div>
                Discrepancy resolution with suppliers
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrvsPage;
