// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock data structure for extraction
interface ParsedGrvData {
  supplier_name: string;
  reference: string;
  date: string;
  order_no: string | null; // Added order_no
  items: {
    stock_code: string;
    description: string;
    qty: number;
    cost_price: number;
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // NOTE: In a real application, complex PDF parsing (OCR/text extraction) 
  // would happen here using specialized libraries (e.g., Tesseract, pdf-parse).

  try {
    // Manual authentication check (required for Edge Functions)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }
    
    // --- SIMULATION START ---
    
    // The user specifically requested extraction for 'Elektra'.
    const mockExtractedData: ParsedGrvData = {
      supplier_name: "Elektra Distributors",
      reference: "PDF-GRV-12345",
      date: new Date().toISOString().split('T')[0], // Today's date
      order_no: "PO-9876", // Mock extracted order number
      items: [
        {
          stock_code: "CAB001",
          description: "10m Cat6 Cable",
          qty: 50,
          cost_price: 55.00,
        },
        {
          stock_code: "BULB05",
          description: "LED Bulb 5W",
          qty: 100,
          cost_price: 12.50,
        },
      ],
    };
    
    // --- SIMULATION END ---

    return new Response(JSON.stringify(mockExtractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});