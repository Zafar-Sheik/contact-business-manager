"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FileText,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Users,
  Phone,
  Mail,
  Building,
  CreditCard,
  Shield,
  User,
  Loader2,
  BarChart3,
  Wallet,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useClients } from "@/hooks/use-clients";
import { Client, ClientInsert } from "@/types/client";
import ClientForm from "@/components/ClientForm";
import { Separator } from "@/components/ui/separator";
import { usePayments } from "@/hooks/use-payments";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ClientsPage: React.FC = () => {
  const {
    clients,
    totalBalanceOwing,
    isLoading: isClientsLoading,
    addClient,
    updateClient,
    deleteClient,
    isAdding,
    isUpdating,
    isDeleting,
  } = useClients();

  const { totalPayments, isLoading: isPaymentsLoading } = usePayments();

  const isLoading = isClientsLoading || isPaymentsLoading;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenForm = (client?: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
    setMobileMenuOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingClient(undefined);
  };

  const handleSubmit = (data: ClientInsert) => {
    if (editingClient) {
      updateClient({ id: editingClient.id, ...data });
    } else {
      addClient(data);
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
  };

  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  // Filter clients based on search term
  const filteredClients = clients.filter((client) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      client.customer_name.toLowerCase().includes(lowerCaseSearch) ||
      client.customer_code.toLowerCase().includes(lowerCaseSearch) ||
      client.phone_number?.includes(searchTerm) ||
      client.email?.toLowerCase().includes(lowerCaseSearch) ||
      client.owner?.toLowerCase().includes(lowerCaseSearch) ||
      client.address?.toLowerCase().includes(lowerCaseSearch)
    );
  });

  // Calculate statistics
  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter((c) => c.current_balance <= c.credit_limit)
      .length,
    overLimitClients: clients.filter((c) => c.current_balance > c.credit_limit)
      .length,
    averageBalance: clients.length > 0 ? totalBalanceOwing / clients.length : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Clients</h1>
              <p className="text-xs text-gray-600">Manage client accounts</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[320px] p-0">
                <SheetHeader className="p-4 border-b border-gray-200">
                  <SheetTitle>Client Actions</SheetTitle>
                </SheetHeader>
                <div className="p-2">
                  <Button
                    onClick={() => handleOpenForm()}
                    className="w-full justify-start h-11 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-3" />
                    Add New Client
                  </Button>

                  <div className="space-y-1">
                    <div className="relative px-2">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 bg-white border-gray-200"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <Users className="h-4 w-4 mr-3" />
                      View All ({clients.length})
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 text-sm">
                      <FileText className="h-4 w-4 mr-3" />
                      Statements
                    </Button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 px-2 mb-2">
                      Client Stats
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Clients
                        </span>
                        <span className="font-semibold">
                          {stats.totalClients}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Owed
                        </span>
                        <span className="font-semibold text-red-700">
                          {formatCurrency(totalBalanceOwing)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Total Payments
                        </span>
                        <span className="font-semibold text-green-700">
                          {formatCurrency(totalPayments)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <span className="text-sm text-gray-600">
                          Over Limit
                        </span>
                        <span className="font-semibold text-amber-700">
                          {stats.overLimitClients}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-3">
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
                Clients Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage all client accounts and information
              </p>
            </div>
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <Button
              onClick={() => handleOpenForm()}
              className="h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg shadow-purple-500/20">
              <Plus className="h-4 w-4 mr-2" /> Add New Client
            </Button>
            <DialogContent className="sm:max-w-[600px] p-0 border-0 overflow-y-auto">
              <DialogHeader className="p-6 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {editingClient ? "Edit Client" : "Add New Client"}
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <ClientForm
                  initialData={editingClient}
                  onSubmit={handleSubmit}
                  isSubmitting={isAdding || isUpdating}
                  onClose={handleCloseForm}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4 max-w-7xl mx-auto">
        {/* Mobile Add Button - Fixed at bottom */}
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <Button
            onClick={() => handleOpenForm()}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl shadow-purple-500/30">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Summary Cards - Mobile Stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Clients
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.totalClients}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Owed
                  </p>
                  <p className="text-xl font-bold text-red-700">
                    {formatCurrency(totalBalanceOwing)}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Total Payments
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(totalPayments)}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Over Limit
                  </p>
                  <p className="text-xl font-bold text-amber-700">
                    {stats.overLimitClients}
                  </p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Shield className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Client List */}
        <Card className="border-0 shadow-sm lg:shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 lg:p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                    Client Directory
                  </h3>
                  <Badge variant="outline" className="ml-2 bg-white text-xs">
                    {filteredClients.length}
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 pl-10 bg-white border-gray-200 w-48 lg:w-64"
                    />
                  </div>
                  <div className="lg:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                          <Search className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        <div className="p-2">
                          <Input
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9"
                          />
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 lg:p-5">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border border-gray-100">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-32 lg:w-48" />
                            <Skeleton className="h-4 w-24 lg:w-32" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-20 lg:w-24" />
                            <Skeleton className="h-4 w-12 lg:w-16" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-8 lg:py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 lg:h-8 w-6 lg:w-8 text-gray-400" />
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                    {searchTerm
                      ? "No matching clients found"
                      : "No clients yet"}
                  </h3>
                  <p className="text-gray-500 text-sm lg:text-base max-w-md mx-auto px-4">
                    {searchTerm
                      ? `No clients match "${searchTerm}". Try a different search term.`
                      : "Get started by adding your first client to the system."}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => handleOpenForm()}
                      className="mt-4 h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium">
                      <Plus className="h-4 w-4 mr-2" /> Add First Client
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClients.map((client) => (
                    <Card
                      key={client.id}
                      className="border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all">
                      <CardContent className="p-4 lg:p-6">
                        {/* Client Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 lg:p-3 rounded-lg ${
                                client.current_balance > 0
                                  ? "bg-red-50"
                                  : "bg-green-50"
                              }`}>
                              {client.current_balance > 0 ? (
                                <TrendingDown className="h-5 w-5 text-red-600" />
                              ) : (
                                <TrendingUp className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-1 sm:gap-0">
                                <h3 className="text-base lg:text-lg font-bold text-gray-900 truncate">
                                  {client.customer_name}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
                                    <User className="h-3 w-3 mr-1" />
                                    {client.customer_code}
                                  </Badge>
                                  {client.current_balance >
                                    client.credit_limit && (
                                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                                      Over Limit
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:text-sm text-gray-600 mt-1">
                                {client.owner && (
                                  <span className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    {client.owner}
                                  </span>
                                )}
                                {client.price_category && (
                                  <span className="flex items-center">
                                    <CreditCard className="h-3 w-3 mr-1" />
                                    {client.price_category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right sm:text-left sm:min-w-[120px]">
                            <div
                              className={`text-xl lg:text-2xl font-bold ${
                                client.current_balance > 0
                                  ? "text-red-700"
                                  : "text-green-700"
                              }`}>
                              {formatCurrency(client.current_balance)}
                            </div>
                            <div className="text-xs lg:text-sm text-gray-500">
                              Limit: {formatCurrency(client.credit_limit)}
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3 lg:p-4 bg-gray-50 rounded-lg">
                          {client.phone_number && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700 truncate">
                                {client.phone_number}
                              </span>
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700 truncate">
                                {client.email}
                              </span>
                            </div>
                          )}
                          {client.address && (
                            <div className="flex items-center">
                              <Building className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700 truncate">
                                {client.address}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Additional Details */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">VAT Number</p>
                            <p className="text-sm font-medium truncate">
                              {client.vat_no || "Not set"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Registration
                            </p>
                            <p className="text-sm font-medium truncate">
                              {client.reg_no || "Not set"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Credit Available
                            </p>
                            <p
                              className={`text-sm font-bold ${
                                client.credit_limit - client.current_balance > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}>
                              {formatCurrency(
                                client.credit_limit - client.current_balance
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Utilization</p>
                            <div className="flex items-center">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    client.current_balance > client.credit_limit
                                      ? "bg-red-600"
                                      : client.current_balance /
                                          client.credit_limit >
                                        0.8
                                      ? "bg-amber-600"
                                      : "bg-green-600"
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      (client.current_balance /
                                        client.credit_limit) *
                                        100,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium ml-2">
                                {Math.round(
                                  (client.current_balance /
                                    client.credit_limit) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              alert("Sites management coming soon!")
                            }
                            disabled={isUpdating || isDeleting}
                            className="h-9 border-gray-300 hover:bg-gray-50 text-xs">
                            <MapPin className="h-3.5 w-3.5 mr-2" /> Sites
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-9 border-gray-300 hover:bg-gray-50 text-xs">
                            <Link to="/financial-hub/statements">
                              <FileText className="h-3.5 w-3.5 mr-2" />{" "}
                              Statements
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenForm(client)}
                            disabled={isUpdating || isDeleting}
                            className="h-9 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-xs">
                            <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isDeleting}
                                className="h-9 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs">
                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md mx-4">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center text-base">
                                  <Trash2 className="h-5 w-5 text-red-600 mr-2" />
                                  Delete Client
                                </AlertDialogTitle>
                                <AlertDialogDescription className="pt-4">
                                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                                    <div className="flex items-center mb-2">
                                      <div className="p-2 bg-white rounded-lg mr-3">
                                        <User className="h-4 w-4 text-red-600" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-red-800">
                                          {client.customer_name}
                                        </p>
                                        <p className="text-sm text-red-600">
                                          Code: {client.customer_code}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-sm text-red-700">
                                      This action cannot be undone. This will
                                      permanently delete the client and all
                                      associated data.
                                    </p>
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-300">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(client.id)}
                                  disabled={isDeleting}
                                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-sm">
                                  {isDeleting ? (
                                    <div className="flex items-center">
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      Deleting...
                                    </div>
                                  ) : (
                                    "Delete Client"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {filteredClients.length > 0 && !isLoading && (
              <div className="border-t border-gray-100">
                <div className="p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-xs lg:text-sm font-medium text-gray-700">
                        Showing {filteredClients.length} of {clients.length}{" "}
                        clients
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs lg:text-sm font-medium text-gray-700">
                        Total Amount Due:
                      </div>
                      <div className="text-base lg:text-lg font-bold text-red-700">
                        {formatCurrency(totalBalanceOwing)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section - Mobile Stacked */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Wallet className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Client Credit
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Green balance: client has credit available
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2 mt-1 flex-shrink-0"></div>
                Red balance: client owes money
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2 mt-1 flex-shrink-0"></div>
                Over 80% credit utilization: amber warning
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BarChart3 className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">
                Quick Actions
              </h4>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2 mt-1 flex-shrink-0"></div>
                Tap any client card to view full details
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2 mt-1 flex-shrink-0"></div>
                Use search to quickly find clients
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 mt-1 flex-shrink-0"></div>
                Statements button for client financials
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Hint */}
        <div className="lg:hidden mt-6 text-center">
          <p className="text-xs text-gray-500">
            Tap on any client to view more details
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
