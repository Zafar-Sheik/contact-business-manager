import { InvoiceItemInsert } from "@/types/invoice";
import { QuoteItemInsert } from "@/types/quote";

type DocumentItemInsert = InvoiceItemInsert | QuoteItemInsert;

export const calculateDocumentTotals = (items: DocumentItemInsert[]) => {
  let subtotal = 0;
  let vat_amount = 0;
  
  items.forEach(item => {
    const itemSubtotal = item.quantity * item.unit_price;
    const itemVat = itemSubtotal * (item.vat_rate / 100);
    
    subtotal += itemSubtotal;
    vat_amount += itemVat;
  });
  
  const total_amount = subtotal + vat_amount;
  
  return { subtotal, vat_amount, total_amount };
};