import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { X, Banknote, QrCode, Printer } from 'lucide-react';

interface PrintReceiptProps {
  billData: any;
}

const PrintReceipt = React.forwardRef<HTMLDivElement, PrintReceiptProps>(({ billData }, ref) => {
  if (!billData) return null;
  return (
    <div ref={ref} className="p-4 bg-white text-black font-tamil w-[80mm] text-sm">
      <div className="text-center pb-2 border-b-2 border-black border-dashed mb-2">
        <h1 className="text-xl font-bold">VRS Garden Dhaba</h1>
        <h2 className="text-lg">VRS கார்டன் தாபா</h2>
        <p className="text-xs mt-1">Tamil Nadu, India</p>
        <p className="text-xs">GSTIN: 33AABCU9603R1ZX</p>
      </div>
      
      <div className="flex justify-between text-xs mb-2">
        <span>பில் / Bill: {billData.billNo || 'VRS-001'}</span>
        <span>{new Date().toLocaleDateString('en-GB')}</span>
      </div>
      <div className="flex justify-between text-xs mb-2 border-b border-black border-dashed pb-2">
        <span>மேசை / Table: {billData.table}</span>
        <span>{new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
      </div>

      <table className="w-full text-xs mb-2">
        <thead>
          <tr className="border-b border-black border-dashed">
            <th className="text-left font-normal py-1">பொருள் / Item</th>
            <th className="text-right font-normal py-1">அளவு / Qty</th>
            <th className="text-right font-normal py-1">விலை / Rs</th>
          </tr>
        </thead>
        <tbody>
          {billData.items?.map((item: any, i: number) => (
            <tr key={i}>
              <td className="py-1">{item.name_ta}<br/><span className="text-[10px]">{item.name_en}</span></td>
              <td className="py-1 text-right">{item.qty}</td>
              <td className="py-1 text-right">{(item.qty * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t-2 border-black border-dashed pt-2 text-xs">
        <div className="flex justify-between mb-1">
          <span>Sub Total</span>
          <span>{parseFloat(billData.subTotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>CGST (2.5%)</span>
          <span>{(parseFloat(billData.gst) / 2).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>SGST (2.5%)</span>
          <span>{(parseFloat(billData.gst) / 2).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2 mb-2 p-1 bg-gray-100">
          <span>மொத்தம் / Total</span>
          <span>₹{parseFloat(billData.grandTotal).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="text-center text-xs border-t border-black border-dashed pt-2 mt-2">
        <p>Payment: {billData.paymentMethod}</p>
        <p className="mt-2 font-bold">நன்றி மீண்டும் வருக!</p>
        <p>Thank you, Visit Again!</p>
      </div>
    </div>
  );
});

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  subTotal: number;
  gst: number;
  grandTotal: number;
  onComplete: () => void;
}

export default function PaymentModal({ isOpen, onClose, cart, subTotal, gst, grandTotal, onComplete }: PaymentModalProps) {
  const { t } = useTranslation();
  const [method, setMethod] = useState<'cash' | 'upi' | 'split'>('cash');
  const [amountGiven, setAmountGiven] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  if (!isOpen) return null;

  const change = amountGiven ? (parseFloat(amountGiven) - grandTotal).toFixed(2) : '0.00';

  const handlePay = async () => {
    // API Call to complete bill
    const payload = {
      type: 'table',
      table_id: 1, // Hardcoded for demo,
      items: cart,
      sub_total: subTotal,
      gst_amount: gst,
      final_amount: grandTotal,
      total: subTotal,
      payment_method: method
    };

    try {
      const res = await fetch('http://localhost:5000/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(data.success) {
        handlePrint();
        onComplete();
      }
    } catch {
      alert("Error processing payment");
    }
  };

  const billData = {
    items: cart,
    subTotal,
    gst,
    grandTotal,
    paymentMethod: method.toUpperCase(),
    table: 'T-1'
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-0 md:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-darkSurface w-full max-w-4xl min-h-full md:min-h-0 md:h-[600px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Options */}
        <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r dark:border-darkBorder flex flex-col shrink-0 md:shrink">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-tamil">{t('Payment Options')}</h2>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setMethod('cash')}
              className={`flex-1 py-4 flex flex-col items-center gap-2 rounded-xl border-2 font-bold text-lg transition ${
                method === 'cash' ? 'border-brandGreen bg-brandGreen/10 text-brandGreen' : 'border-gray-200 text-gray-500'
              }`}
            >
              <Banknote size={32} />
              {t('Cash')}
            </button>
            <button 
              onClick={() => setMethod('upi')}
              className={`flex-1 py-4 flex flex-col items-center gap-2 rounded-xl border-2 font-bold text-lg transition ${
                method === 'upi' ? 'border-brandGreen bg-brandGreen/10 text-brandGreen' : 'border-gray-200 text-gray-500'
              }`}
            >
              <QrCode size={32} />
              {t('UPI')}
            </button>
          </div>

          {method === 'cash' && (
            <div className="flex-1">
              <label className="block text-gray-500 font-bold mb-2">Amount Given by Customer (₹)</label>
              <input 
                type="number" 
                value={amountGiven}
                onChange={e => setAmountGiven(e.target.value)}
                className="w-full text-3xl p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl font-mono focus:ring-2 focus:ring-brandGreen"
                placeholder="Enter amount..."
              />
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[100, 200, 500, 1000, 2000].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmountGiven((parseFloat(amountGiven || '0') + val).toString())}
                    className="py-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold hover:bg-gray-200"
                  >
                    +{val}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800">
                <div className="text-orange-600 dark:text-orange-400 font-bold text-sm uppercase mb-1">Return Change</div>
                <div className="text-4xl font-bold font-mono text-orange-600 dark:text-orange-400">
                  ₹{parseFloat(change) > 0 ? change : '0.00'}
                </div>
              </div>
            </div>
          )}

          {method === 'upi' && (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <QrCode size={120} className="text-gray-400 mb-4" />
              <p className="text-lg font-bold text-gray-500">Scan QR to pay ₹{grandTotal.toFixed(2)}</p>
            </div>
          )}

        </div>

        {/* Right Side - Summary & Print */}
        <div className="w-full md:w-1/2 bg-gray-50 dark:bg-gray-900 flex flex-col relative shrink-0 md:shrink">
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-8 bg-gray-200">
             {/* Receipt Preview Container */}
             <div className="shadow-lg transform scale-90 md:scale-110 origin-center bg-white p-2 shrink-0">
                 <PrintReceipt ref={printRef} billData={billData} />
             </div>
          </div>
          
          <div className="p-6 bg-white dark:bg-darkSurface border-t dark:border-darkBorder">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl text-gray-600">{t('Grand Total')}</span>
              <span className="text-3xl font-bold text-brandGreen font-mono">₹{grandTotal.toFixed(2)}</span>
            </div>
            <button 
               onClick={handlePay}
               className="w-full py-4 bg-brandGreen hover:bg-brandLightGreen text-white text-xl font-bold rounded-xl flex items-center justify-center gap-3 transition shadow-lg active:scale-95"
            >
              <Printer size={24} />
              Save & Print Bill
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
