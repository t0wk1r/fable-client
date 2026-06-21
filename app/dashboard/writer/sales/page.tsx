"use client";

import { useEffect, useState } from "react";
import api from "../../../../services/api";

export default function WriterSalesPage() {
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("fable-token");

    api
      .get("/writer-sales", { headers: { authorization: token } })
      .then((res) => setSales(res.data.data || []));
  }, []);

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm dark:bg-slate-900">
      <h1 className="mb-6 text-3xl font-black">Sales History</h1>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] text-left">
          <thead>
            <tr className="border-b text-sm text-slate-500">
              <th className="py-3">Ebook</th>
              <th>Buyer</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id} className="border-b">
                <td className="py-4 font-bold">{sale.ebookTitle}</td>
                <td>{sale.buyerName || sale.buyerEmail}</td>
                <td>${sale.amount}</td>
                <td>{sale.purchaseDate ? new Date(sale.purchaseDate).toLocaleDateString() : "N/A"}</td>
                <td>{sale.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}