"use client";

import React, { useRef } from "react";
import { Staff } from "@/types/staff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PayslipProps {
  staff: Staff;
}

const Payslip: React.FC<PayslipProps> = ({ staff }) => {
  const payslipRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (payslipRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write("<html><head><title>Payslip</title>");
        // Inject Tailwind CSS styles for printing
        printWindow.document.write("<style>");
        printWindow.document.write(
          "@media print { body { margin: 0; } .no-print { display: none; } }"
        );
        printWindow.document.write("</style>");
        printWindow.document.write("</head><body>");
        printWindow.document.write(
          '<div class="p-6 max-w-xl mx-auto border border-gray-300 shadow-lg">'
        );
        printWindow.document.write(payslipRef.current.innerHTML);
        printWindow.document.write("</div>");
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handlePrint} className="no-print">
        <Printer className="h-4 w-4 mr-2" /> Print Payslip
      </Button>

      <Card ref={payslipRef} className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Payslip
          </CardTitle>
          <p className="text-sm text-center text-muted-foreground">
            {staff.pay_method} Period Ending: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>

        <Separator className="mb-4" />

        <div className="grid grid-cols-2 gap-y-1 text-sm mb-4">
          <p className="font-medium">Employee:</p>
          <p className="text-right">
            {staff.first_name} {staff.last_name}
          </p>

          <p className="font-medium">ID Number:</p>
          <p className="text-right">{staff.id_number || "N/A"}</p>

          <p className="font-medium">Cell Number:</p>
          <p className="text-right">{staff.cell_number || "N/A"}</p>

          <p className="font-medium">Address:</p>
          <p className="text-right truncate">{staff.address || "N/A"}</p>
        </div>

        <Separator className="my-4" />

        <CardContent className="p-0 space-y-2">
          <h4 className="font-semibold text-lg mb-2">Earnings & Adjustments</h4>

          <div className="flex justify-between">
            <span className="font-medium">Rate ({staff.pay_method}):</span>
            <span>R{staff.rate.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span className="font-medium">Deductions:</span>
            <span>- R{staff.deductions.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span className="font-medium">Loans:</span>
            <span>- R{staff.loans.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span className="font-medium">Advance:</span>
            <span>+ R{staff.advance.toFixed(2)}</span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between text-lg font-bold pt-2">
            <span>NET PAY:</span>
            <span>R{staff.salary_total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payslip;
