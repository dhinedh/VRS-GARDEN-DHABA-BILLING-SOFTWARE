import React from 'react';

interface KOTPrintProps {
  tableNo: string;
  items: any[];
}

export const KOTPrint = React.forwardRef<HTMLDivElement, KOTPrintProps>(({ tableNo, items }, ref) => {
  return (
    <div ref={ref} className="p-4 bg-white text-black font-tamil w-[80mm] text-lg">
      <div className="text-center pb-2 border-b-2 border-black border-dashed mb-4">
        <h1 className="text-2xl font-bold uppercase">KOT - சமையலறை சீட்டு</h1>
      </div>
      
      <div className="flex justify-between font-bold mb-4 border-b border-black pb-2">
        <span>Table: {tableNo}</span>
        <span>{new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-2 text-xl">பொருள் / Item</th>
            <th className="text-right py-2 text-xl">Qty</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-black border-dashed">
              <td className="py-3">
                <div className="font-bold text-2xl">{item.name_ta}</div>
                <div className="text-lg opacity-80">{item.name_en}</div>
              </td>
              <td className="py-3 text-right text-3xl font-bold">{item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="text-center mt-6 text-sm border-t border-black pt-2">
        <p>Order Time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
});
