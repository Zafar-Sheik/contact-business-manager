import { Invoice, InvoiceItem, Customer, StockItemForInvoice } from "@/types/invoice";
import { Quote, QuoteItem } from "@/types/quote";
import { StockItem } from "@/types/stock";
import { Client } from "@/types/client";

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";
const MOCK_CLIENT_ID = "00000000-0000-0000-0000-000000000002";
const MOCK_STOCK_ID_1 = "00000000-0000-0000-0000-000000000003";
const MOCK_STOCK_ID_2 = "00000000-0000-0000-0000-000000000004";
const MOCK_STOCK_ID_3 = "00000000-0000-0000-0000-000000000005";

export const mockClients: Client[] = [
  {
    id: MOCK_CLIENT_ID,
    user_id: MOCK_USER_ID,
    customer_code: "CUST001",
    customer_name: "Acme Corp Ltd",
    owner: "Wile E. Coyote",
    address: "1 Road Runner Lane, ZA",
    phone_number: "0821234567",
    email: "wile@acmecorp.com",
    vat_no: "4000000001",
    reg_no: "2001/000001/07",
    price_category: "Standard",
    credit_limit: 50000.00,
    current_balance: 12500.00, // Example balance
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockCustomers: Customer[] = mockClients.map(c => ({
  id: c.id,
  customer_name: c.customer_name,
  phone_number: c.phone_number,
}));

export const mockStockItems: StockItem[] = [
  {
    id: MOCK_STOCK_ID_1,
    user_id: MOCK_USER_ID,
    stock_code: "CAB001",
    stock_descr: "10m Cat6 Cable",
    category: "Networking",
    size: "10m",
    cost_price: 50.00,
    selling_price: 150.00,
    price_a: 140.00,
    price_b: 130.00,
    price_d: 160.00,
    price_e: 170.00,
    last_cost: 50.00,
    quantity_on_hand: 150,
    quantity_in_warehouse: 50,
    supplier: "Tech Supplies",
    vat: 15,
    image_data_url: null,
    min_level: 20,
    max_level: 200,
    promotion: false,
    promo_start_date: null,
    promo_end_date: null,
    promo_price: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: MOCK_STOCK_ID_2,
    user_id: MOCK_USER_ID,
    stock_code: "SVC001",
    stock_descr: "On-site Service Fee (Hour)",
    category: "Service",
    size: null,
    cost_price: 0.00,
    selling_price: 850.00,
    price_a: 800.00,
    price_b: 750.00,
    price_d: 900.00,
    price_e: 950.00,
    last_cost: 0.00,
    quantity_on_hand: 999,
    quantity_in_warehouse: 0,
    supplier: null,
    vat: 15,
    image_data_url: null,
    min_level: 0,
    max_level: 0,
    promotion: false,
    promo_start_date: null,
    promo_end_date: null,
    promo_price: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: MOCK_STOCK_ID_3,
    user_id: MOCK_USER_ID,
    stock_code: "NONVAT",
    stock_descr: "Non-VAT Item/Labour",
    category: "Labour",
    size: null,
    cost_price: 100.00,
    selling_price: 300.00,
    price_a: 300.00,
    price_b: 300.00,
    price_d: 300.00,
    price_e: 300.00,
    last_cost: 100.00,
    quantity_on_hand: 50,
    quantity_in_warehouse: 0,
    supplier: null,
    vat: 0, // 0% VAT
    image_data_url: null,
    min_level: 0,
    max_level: 0,
    promotion: false,
    promo_start_date: null,
    promo_end_date: null,
    promo_price: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockStockItemsForInvoice: StockItemForInvoice[] = mockStockItems.map(s => ({
  id: s.id,
  stock_code: s.stock_code,
  stock_descr: s.stock_descr,
  selling_price: s.selling_price,
  vat: s.vat,
}));

// --- Invoices ---

const mockInvoiceItems1: InvoiceItem[] = [
  {
    id: "ii1",
    invoice_id: "inv1",
    stock_item_id: MOCK_STOCK_ID_1,
    description: mockStockItems[0].stock_descr,
    quantity: 10,
    unit_price: mockStockItems[0].selling_price, // 150.00
    vat_rate: 15,
    line_total: 1725.00,
    created_at: new Date().toISOString(),
  },
  {
    id: "ii2",
    invoice_id: "inv1",
    stock_item_id: MOCK_STOCK_ID_2,
    description: mockStockItems[1].stock_descr,
    quantity: 2,
    unit_price: mockStockItems[1].selling_price, // 850.00
    vat_rate: 15,
    line_total: 1955.00,
    created_at: new Date().toISOString(),
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv1",
    user_id: MOCK_USER_ID,
    invoice_no: "INV-001",
    date: "2024-09-10",
    customer_id: MOCK_CLIENT_ID,
    work_scope: "Network installation and configuration.",
    subtotal: 3200.00,
    vat_amount: 480.00,
    total_amount: 3680.00,
    status: 'Paid',
    is_vat_invoice: true, // FIX 1
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "inv2",
    user_id: MOCK_USER_ID,
    invoice_no: "INV-002",
    date: "2024-09-20",
    customer_id: MOCK_CLIENT_ID,
    work_scope: "Emergency server repair.",
    subtotal: 5000.00,
    vat_amount: 750.00,
    total_amount: 5750.00,
    status: 'Sent',
    is_vat_invoice: true, // FIX 2
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "inv3",
    user_id: MOCK_USER_ID,
    invoice_no: "INV-003",
    date: "2024-10-01",
    customer_id: MOCK_CLIENT_ID,
    work_scope: "Draft quote conversion.",
    subtotal: 3000.00,
    vat_amount: 450.00,
    total_amount: 3450.00,
    status: 'Draft',
    is_vat_invoice: true, // FIX 3
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockInvoiceItemsMap: Record<string, InvoiceItem[]> = {
    "inv1": mockInvoiceItems1,
    "inv2": [
        {
            id: "ii3",
            invoice_id: "inv2",
            stock_item_id: MOCK_STOCK_ID_2,
            description: mockStockItems[1].stock_descr,
            quantity: 5,
            unit_price: 1000.00,
            vat_rate: 15,
            line_total: 5750.00,
            created_at: new Date().toISOString(),
        }
    ],
    "inv3": [
        {
            id: "ii4",
            invoice_id: "inv3",
            stock_item_id: MOCK_STOCK_ID_3,
            description: mockStockItems[2].stock_descr,
            quantity: 10,
            unit_price: 300.00,
            vat_rate: 0,
            line_total: 3000.00,
            created_at: new Date().toISOString(),
        }
    ]
};

// --- Quotes ---

export const mockQuotes: Quote[] = [
  {
    id: "qte1",
    user_id: MOCK_USER_ID,
    quote_no: "QTE-001",
    date: "2024-09-05",
    customer_id: MOCK_CLIENT_ID,
    work_scope: "Quotation for new office setup.",
    subtotal: 8000.00,
    vat_amount: 1200.00,
    total_amount: 9200.00,
    status: 'Accepted',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "qte2",
    user_id: MOCK_USER_ID,
    quote_no: "QTE-002",
    date: "2024-09-15",
    customer_id: MOCK_CLIENT_ID,
    work_scope: "Annual maintenance contract.",
    subtotal: 12000.00,
    vat_amount: 1800.00,
    total_amount: 13800.00,
    status: 'Sent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockQuoteItemsMap: Record<string, QuoteItem[]> = {
    "qte1": [
        {
            id: "qi1",
            quote_id: "qte1",
            stock_item_id: MOCK_STOCK_ID_1,
            description: mockStockItems[0].stock_descr,
            quantity: 50,
            unit_price: 100.00,
            vat_rate: 15,
            line_total: 5750.00,
            created_at: new Date().toISOString(),
        },
        {
            id: "qi2",
            quote_id: "qte1",
            stock_item_id: MOCK_STOCK_ID_2,
            description: mockStockItems[1].stock_descr,
            quantity: 3,
            unit_price: 750.00,
            vat_rate: 15,
            line_total: 2587.50,
            created_at: new Date().toISOString(),
        }
    ],
    "qte2": [
        {
            id: "qi3",
            quote_id: "qte2",
            stock_item_id: MOCK_STOCK_ID_2,
            description: mockStockItems[1].stock_descr,
            quantity: 15,
            unit_price: 800.00,
            vat_rate: 15,
            line_total: 13800.00,
            created_at: new Date().toISOString(),
        }
    ]
};