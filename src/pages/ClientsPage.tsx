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
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { usePayments } from "@/hooks/use-payments"; // Import usePayments

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
  const [searchTerm, setSearchTerm] = useState(""); // New state for search

  const handleOpenForm = (client?: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
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
      client.email?.toLowerCase().includes(lowerCaseSearch)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Clients</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Edit Client" : "Add New Client"}
              </DialogTitle>
            </DialogHeader>
            <ClientForm
              initialData={editingClient}
              onSubmit={handleSubmit}
              isSubmitting={isAdding || isUpdating}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </header>

      {/* Summary Cards */}
      <div className="max-w-4xl mx-auto space-y-4 mb-6">
        <h2 className="text-xl font-semibold">Financial Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">
                Total Balance Owing
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-xl font-bold text-red-600">
                  {formatCurrency(totalBalanceOwing)}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
              <CardTitle className="text-sm font-medium">
                Total Payments Recorded
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {isLoading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : (
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(totalPayments)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold">Client List</h2>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, code, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isClientsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : filteredClients.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              {searchTerm
                ? `No clients found matching "${searchTerm}".`
                : "No clients found. Start by adding one!"}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <Card key={client.id}>
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <CardTitle className="text-lg font-semibold">
                    {client.customer_name} ({client.customer_code})
                  </CardTitle>
                  <div
                    className={`text-lg font-bold ${
                      client.current_balance > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}>
                    {formatCurrency(client.current_balance)}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    <p>
                      <span className="font-medium">Owner:</span>{" "}
                      {client.owner || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Cell No:</span>{" "}
                      {client.phone_number || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">VAT No:</span>{" "}
                      {client.vat_no || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Reg No:</span>{" "}
                      {client.reg_no || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Price Cat:</span>{" "}
                      {client.price_category || "Standard"}
                    </p>
                    <p>
                      <span className="font-medium">Credit Limit:</span>{" "}
                      {formatCurrency(client.credit_limit)}
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium">Address:</span>{" "}
                      {client.address || "N/A"}
                    </p>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      // Placeholder for Sites feature
                      onClick={() => alert("Sites management coming soon!")}
                      disabled={isUpdating || isDeleting}>
                      <MapPin className="h-4 w-4 mr-1" /> Sites
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      {/* Link to Statements page in Financial Hub */}
                      <Link to="/financial-hub/statements">
                        <FileText className="h-4 w-4 mr-1" /> Statements
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenForm(client)}
                      disabled={isUpdating || isDeleting}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the client: {client.customer_name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(client.id)}
                            disabled={isDeleting}>
                            Continue
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
    </div>
  );
};

export default ClientsPage;
