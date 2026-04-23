"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCloudUploadOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoArrowForward,
  IoReceiptOutline,
  IoCubeOutline,
} from "react-icons/io5";

// --- Simulated extracted data from delivery note PO-68917 ---
const EXTRACTED_DATA = {
  document: {
    type: "Delivery Note",
    poNumber: "PO-68917",
    supplier: "Mr. Nauman",
    supplierLocation: "Dubai",
    recipient: "Skyhawk Catering Services LLC",
    recipientAddress: "Al Quoz, Hello Warehouse, Industrial Second, Dubai, UAE",
    date: "23/04/2026",
    paymentStatus: "Not Paid",
    taxable: true,
  },
  lineItems: [
    {
      description: "Millac Gold Whipping & Cooking Cream - 12x1L",
      qty: 1,
      unitPrice: 225.0,
      tax: 11.25,
      total: 236.25,
    },
  ],
};

const LEDGER_ENTRIES = [
  {
    date: "23/04/2026",
    ref: "PO-68917",
    account: "Inventory — Raw Materials",
    description: "Millac Gold Whipping & Cooking Cream - 12x1L",
    debit: 225.0,
    credit: null,
  },
  {
    date: "23/04/2026",
    ref: "PO-68917",
    account: "VAT Input Tax (5%)",
    description: "Tax on PO-68917",
    debit: 11.25,
    credit: null,
  },
  {
    date: "23/04/2026",
    ref: "PO-68917",
    account: "Accounts Payable — Mr. Nauman",
    description: "Millac Gold Whipping & Cooking Cream - 12x1L",
    debit: null,
    credit: 236.25,
  },
];

const INVENTORY_ENTRY = {
  section: "FOOD",
  productName: "MILLAC GOLD WHIPPING & COOKING CREAM - 12X1L",
  prdCat: "DAIRY",
  allocation: "",
  storage: "",
  package: "CARTON",
  qty: 1,
  price: 225.0,
  inventoryValue: 225.0,
};

// --- Steps ---
const STEPS = [
  { id: "upload", label: "Upload" },
  { id: "processing", label: "Processing" },
  { id: "results", label: "Results" },
];

export default function Home() {
  const [step, setStep] = useState("upload");
  const [fileName, setFileName] = useState(null);
  const [activeTab, setActiveTab] = useState("ledger");

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (file) {
      setFileName(file.name);
      setStep("processing");
      setTimeout(() => setStep("results"), 2800);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const resetDemo = () => {
    setStep("upload");
    setFileName(null);
    setActiveTab("ledger");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-cv-dark-deep border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/crossval-logo.png"
              alt="CrossVal"
              width={180}
              height={58}
              className="h-8 w-auto brightness-0 invert"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">Document Processing</span>
            <span className="inline-block w-2 h-2 rounded-full bg-primary-green" />
          </div>
        </div>
      </header>

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-mid">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const isActive = s.id === step;
              const isPast =
                STEPS.findIndex((x) => x.id === step) >
                STEPS.findIndex((x) => x.id === s.id);
              return (
                <div key={s.id} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className={`w-8 h-px ${isPast ? "bg-primary-green" : "bg-gray-mid"}`}
                    />
                  )}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isPast
                          ? "bg-primary-green text-white"
                          : isActive
                            ? "bg-primary-green text-white"
                            : "bg-gray-mid text-gray-dark"
                      }`}
                    >
                      {isPast ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-sm font-medium ${isActive ? "text-black" : isPast ? "text-primary-green" : "text-gray-dark"}`}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <UploadStep
              key="upload"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />
          )}
          {step === "processing" && (
            <ProcessingStep key="processing" fileName={fileName} />
          )}
          {step === "results" && (
            <ResultsStep
              key="results"
              fileName={fileName}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onReset={resetDemo}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-cv-dark-deep mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-white/40 text-xs">
            CrossVal Document Processing Demo
          </span>
          <span className="text-white/40 text-xs">crossval.com</span>
        </div>
      </footer>
    </div>
  );
}

// ---- Upload Step ----
function UploadStep({ onDrop, onDragOver }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="flex flex-col items-center"
    >
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-black mb-2">
          Upload Delivery Note or Purchase Order
        </h1>
        <p className="text-sm text-[#555]">
          We extract line items and route them to your accounting ledger and
          inventory automatically.
        </p>
      </div>

      <label
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="w-full max-w-lg border-2 border-dashed border-gray-300 rounded-lg p-16 flex flex-col items-center gap-4 cursor-pointer hover:border-primary-green hover:bg-secondary-green/30 transition-all duration-200"
      >
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={onDrop}
          className="hidden"
        />
        <IoCloudUploadOutline className="w-12 h-12 text-gray-dark" />
        <div className="text-center">
          <p className="text-sm font-medium text-black">
            Drop your file here, or click to browse
          </p>
          <p className="text-xs text-gray-dark mt-1">
            PDF, PNG, or JPEG up to 10 MB
          </p>
        </div>
      </label>

      {/* Info banner */}
      <div className="mt-6 w-full max-w-lg p-3 border border-blue-300 rounded-lg bg-blue-50">
        <p className="text-sm text-gray-700">
          Upload a delivery note or purchase order. CrossVal extracts the
          financial transactions into a double-entry ledger and maps inventory
          items to your existing inventory table format.
        </p>
      </div>
    </motion.div>
  );
}

// ---- Processing Step ----
function ProcessingStep({ fileName }) {
  const stages = [
    { label: "Reading document", delay: 0 },
    { label: "Extracting line items", delay: 0.6 },
    { label: "Mapping to accounting ledger", delay: 1.2 },
    { label: "Mapping to inventory table", delay: 1.8 },
    { label: "Validating entries", delay: 2.2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="flex flex-col items-center"
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-mid">
          <IoDocumentTextOutline className="w-5 h-5 text-primary-green" />
          <span className="text-sm font-medium text-black truncate">
            {fileName}
          </span>
        </div>

        <div className="space-y-4">
          {stages.map((stage) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: stage.delay, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: stage.delay + 0.3, type: "spring" }}
              >
                <IoCheckmarkCircle className="w-5 h-5 text-primary-green" />
              </motion.div>
              <span className="text-sm text-[#555]">{stage.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.6, ease: "easeInOut" }}
          className="mt-6 h-1 bg-primary-green rounded-full"
        />
      </div>
    </motion.div>
  );
}

// ---- Results Step ----
function ResultsStep({ fileName, activeTab, setActiveTab, onReset }) {
  const data = EXTRACTED_DATA;
  const totals = {
    debit: LEDGER_ENTRIES.reduce((s, e) => s + (e.debit || 0), 0),
    credit: LEDGER_ENTRIES.reduce((s, e) => s + (e.credit || 0), 0),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Document summary card */}
      <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary-green flex items-center justify-center">
              <IoDocumentTextOutline className="w-5 h-5 text-primary-green" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-black">
                {data.document.type} — {data.document.poNumber}
              </h2>
              <p className="text-sm text-[#555]">
                {data.document.supplier} ({data.document.supplierLocation})
                &nbsp;→&nbsp; {data.document.recipient}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
              {data.document.paymentStatus}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary-green text-primary-green border border-primary-green/20">
              {data.document.date}
            </span>
          </div>
        </div>

        {/* Line items summary */}
        <div className="mt-4 pt-4 border-t border-gray-mid">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-gray-dark uppercase tracking-wider font-medium">
                Items
              </span>
              <p className="text-sm font-semibold text-black mt-0.5">
                {data.lineItems.length}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-dark uppercase tracking-wider font-medium">
                Subtotal
              </span>
              <p className="text-sm font-semibold text-black mt-0.5">
                AED{" "}
                {data.lineItems
                  .reduce((s, i) => s + i.unitPrice * i.qty, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-dark uppercase tracking-wider font-medium">
                Tax (5% VAT)
              </span>
              <p className="text-sm font-semibold text-black mt-0.5">
                AED{" "}
                {data.lineItems.reduce((s, i) => s + i.tax, 0).toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-dark uppercase tracking-wider font-medium">
                Total
              </span>
              <p className="text-sm font-semibold text-primary-green mt-0.5">
                AED{" "}
                {data.lineItems.reduce((s, i) => s + i.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Flow visualization */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-mid text-sm">
          <IoDocumentTextOutline className="w-4 h-4 text-primary-green" />
          <span className="font-medium">Delivery Note</span>
        </div>
        <IoArrowForward className="w-5 h-5 text-gray-dark" />
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-green/10 rounded-lg border border-primary-green/30 text-sm">
            <IoReceiptOutline className="w-4 h-4 text-primary-green" />
            <span className="font-medium text-primary-green">
              Accounting Ledger
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-green/10 rounded-lg border border-primary-green/30 text-sm">
            <IoCubeOutline className="w-4 h-4 text-primary-green" />
            <span className="font-medium text-primary-green">
              Inventory Table
            </span>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex border-b border-gray-mid">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "ledger"
                ? "border-primary-green text-primary-green"
                : "border-transparent text-[#555] hover:text-black"
            }`}
          >
            <IoReceiptOutline className="w-4 h-4" />
            Accounting Ledger
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === "inventory"
                ? "border-primary-green text-primary-green"
                : "border-transparent text-[#555] hover:text-black"
            }`}
          >
            <IoCubeOutline className="w-4 h-4" />
            Inventory Table
          </button>
        </div>

        <div className="p-0">
          {activeTab === "ledger" ? <LedgerTable /> : <InventoryTable />}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-mid flex items-center justify-between bg-gray-light">
          <p className="text-xs text-[#555]">
            {activeTab === "ledger"
              ? `${LEDGER_ENTRIES.length} journal entries • Debits: AED ${totals.debit.toFixed(2)} = Credits: AED ${totals.credit.toFixed(2)}`
              : `${1} item mapped to Skyhawk Catering inventory format`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-black bg-gray-mid rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Upload Another
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary-green rounded-lg hover:bg-[#005c14] transition-all duration-200 active:scale-[0.98]">
              Confirm & Save
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Ledger Table ----
function LedgerTable() {
  const totals = {
    debit: LEDGER_ENTRIES.reduce((s, e) => s + (e.debit || 0), 0),
    credit: LEDGER_ENTRIES.reduce((s, e) => s + (e.credit || 0), 0),
  };

  return (
    <div className="overflow-x-auto">
      <table className="cv-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Ref</th>
            <th>Account</th>
            <th>Description</th>
            <th className="text-right">Debit (AED)</th>
            <th className="text-right">Credit (AED)</th>
          </tr>
        </thead>
        <tbody>
          {LEDGER_ENTRIES.map((entry, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <td className="whitespace-nowrap">{entry.date}</td>
              <td>
                <span className="font-mono text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                  {entry.ref}
                </span>
              </td>
              <td className="font-medium">{entry.account}</td>
              <td className="text-[#555]">{entry.description}</td>
              <td className="text-right font-mono">
                {entry.debit != null ? entry.debit.toFixed(2) : ""}
              </td>
              <td className="text-right font-mono">
                {entry.credit != null ? entry.credit.toFixed(2) : ""}
              </td>
            </motion.tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-light font-semibold">
            <td colSpan={4} className="text-right text-xs uppercase tracking-wider text-[#555] !border-t-2 !border-gray-mid">
              Totals
            </td>
            <td className="text-right font-mono !border-t-2 !border-gray-mid">
              {totals.debit.toFixed(2)}
            </td>
            <td className="text-right font-mono !border-t-2 !border-gray-mid">
              {totals.credit.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ---- Inventory Table (Skyhawk format) ----
function InventoryTable() {
  const inv = INVENTORY_ENTRY;

  return (
    <div className="overflow-x-auto">
      <table className="cv-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>Product Name</th>
            <th>Prd Cat</th>
            <th>Allocation</th>
            <th>Storage</th>
            <th>Package</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Price (AED)</th>
            <th className="text-right">Inventory Value</th>
          </tr>
        </thead>
        <tbody>
          <motion.tr
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <td>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary-green text-primary-green">
                {inv.section}
              </span>
            </td>
            <td className="font-medium max-w-[280px]">{inv.productName}</td>
            <td>{inv.prdCat}</td>
            <td className="text-gray-dark">{inv.allocation || "—"}</td>
            <td className="text-gray-dark">{inv.storage || "—"}</td>
            <td>{inv.package}</td>
            <td className="text-right font-mono">{inv.qty}</td>
            <td className="text-right font-mono">{inv.price.toFixed(2)}</td>
            <td className="text-right font-mono font-semibold">
              {inv.inventoryValue.toFixed(2)}
            </td>
          </motion.tr>
        </tbody>
        <tfoot>
          <tr className="bg-gray-light font-semibold">
            <td
              colSpan={8}
              className="text-right text-xs uppercase tracking-wider text-[#555] !border-t-2 !border-gray-mid"
            >
              Total Inventory Value
            </td>
            <td className="text-right font-mono !border-t-2 !border-gray-mid">
              {inv.inventoryValue.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
