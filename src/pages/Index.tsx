"use client";

import MobileDashboard from "@/components/MobileDashboard";

interface Transaction {
  id: string;
  type: "Sale" | "Expense";
  description: string;
  amount: number;
  date: string;
}

interface IndexProps {
  transactions: Transaction[];
}

const Index: React.FC<IndexProps> = ({ transactions }) => {
  return <MobileDashboard transactions={transactions} />;
};

export default Index;