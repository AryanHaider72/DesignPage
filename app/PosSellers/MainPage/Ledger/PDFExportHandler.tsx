"use client";

import { CustomerLedgerGet } from "@/api/types/Posintegration/Ledger/Ledger";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useRef } from "react";

interface PDFExportHandlerProps {
  ledgerList: CustomerLedgerGet[];
  customerName: string;
  dateFrom: string;
  dateTo: string;
  onExportComplete?: () => void;
}

export default function PDFExportHandler({
  ledgerList,
  customerName,
  dateFrom,
  dateTo,
  onExportComplete,
}: PDFExportHandlerProps) {
  const hasExported = useRef(false);

  useEffect(() => {
    if (hasExported.current) return;
    hasExported.current = true;

    const exportPDF = async () => {
      try {
        const doc = new jsPDF();

        // Filter out "Remaining Amount" entries for the table
        const filterRecord = ledgerList.filter(
          (item) => item.entryType !== "Remaning Amount",
        );

        // Remaining Balance
        const remainingBalance =
          ledgerList.find((item) => item.entryType === "Remaning Amount")
            ?.creditAmount || 0;

        // Title
        doc.setFontSize(16);
        doc.text("Customer Ledger", 105, 15, { align: "center" });

        // Date Range
        doc.setFontSize(10);
        doc.text(`Date From: ${dateFrom}`, 14, 25);
        doc.text(`Date To: ${dateTo}`, 14, 30);

        // Remaining Balance (Top Right)
        doc.text(
          `Remaining Balance: ${remainingBalance.toLocaleString()}`,
          196,
          25,
          { align: "right" },
        );

        // Prepare Table Data
        const tableData = filterRecord.map((item, index) => {
          const prevBalance =
            index === 0
              ? 0
              : filterRecord
                  .slice(0, index)
                  .reduce(
                    (sum, r) => sum + (r.creditAmount - r.debitAmount),
                    0,
                  );

          const balance = prevBalance + (item.creditAmount - item.debitAmount);

          return [
            index + 1,
            item.postingDate
              ? new Date(item.postingDate).toLocaleDateString()
              : "-",
            item.entryType,
            item.debitAmount?.toLocaleString() || "0",
            item.creditAmount?.toLocaleString() || "0",
            balance.toLocaleString(),
          ];
        });

        // Table
        autoTable(doc, {
          startY: 35,
          head: [
            ["#", "Posting Date", "Entry Type", "Debit", "Credit", "Balance"],
          ],
          body: tableData,
        });

        // Save PDF
        doc.save(`Customer_Ledger_${customerName || "export"}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        onExportComplete?.();
      }
    };

    exportPDF();
  }, []); // Empty dependency array = run once when mounted

  return null;
}
