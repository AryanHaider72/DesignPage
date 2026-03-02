"use client";

import { ReturnSale } from "@/api/types/Posintegration/ReturnItem/ReturnItem";
import { useEffect } from "react";

interface getExportData {
  getData: ReturnSale[];
}
export default function ReceiptPrintModal({ getData }: getExportData) {
  useEffect(() => {
    console.log(getData);
  }, [getData]);
  return (
    <>
      <div></div>
    </>
  );
}
