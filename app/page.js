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
  IoGridOutline,
  IoFolderOpenOutline,
  IoSettingsOutline,
  IoPersonOutline,
  IoChevronForward,
  IoAddCircleOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoDownloadOutline,
} from "react-icons/io5";

// ─── Pre-existing dummy data (Skyhawk inventory from Excel) ─────────────
const EXISTING_INVENTORY = [
  { section: "FOOD", productName: "BUTTER UNSALTED", prdCat: "DAIRY", allocation: "", storage: "Cold Store", package: "KG", qty: 12, price: 23.05, inventoryValue: 276.57 },
  { section: "FOOD", productName: "CREAM CHEESE", prdCat: "DAIRY", allocation: "", storage: "Cold Store", package: "KG", qty: 8.5, price: 40.00, inventoryValue: 340.00 },
  { section: "FOOD", productName: "EGGS 30PC MEDIUM", prdCat: "DAIRY", allocation: "Kitchen", storage: "Cold Store", package: "PC", qty: 300, price: 0.50, inventoryValue: 150.00 },
  { section: "FOOD", productName: "MILK FULL FAT", prdCat: "DAIRY", allocation: "Kitchen", storage: "Cold Store", package: "LITRE", qty: 24, price: 4.53, inventoryValue: 108.72 },
  { section: "FOOD", productName: "VEGAN WHIPPING CREAM", prdCat: "DAIRY", allocation: "", storage: "Cold Store", package: "KG", qty: 3, price: 38.00, inventoryValue: 114.00 },
  { section: "NONFOOD", productName: "BAKING PAPER", prdCat: "DISPOSABLE", allocation: "Kitchen", storage: "", package: "PC", qty: 2, price: 27.00, inventoryValue: 54.00 },
  { section: "NONFOOD", productName: "PIPING BAGS", prdCat: "DISPOSABLE", allocation: "Kitchen", storage: "", package: "ROLLS", qty: 6, price: 27.00, inventoryValue: 162.00 },
  { section: "FOOD", productName: "AACHAR GOST MASALA SHAN 50G", prdCat: "DRY", allocation: "", storage: "Dry Store", package: "KG", qty: 5.7, price: 124.00, inventoryValue: 706.80 },
  { section: "NONFOOD", productName: "4OZ COFFEE CUPS BROWN 1000PCS", prdCat: "DISPOSABLE", allocation: "Staff", storage: "", package: "CARTON", qty: 4, price: 130.00, inventoryValue: 520.00 },
  { section: "NONFOOD", productName: "ALUMINUM FOIL HOTPACK 45X150CM", prdCat: "CONSUMABLES", allocation: "Staff", storage: "", package: "PC", qty: 46, price: 23.67, inventoryValue: 1088.67 },
  { section: "FOOD", productName: "ALMOND BLANCHED PREMIUM 1KG", prdCat: "DRY", allocation: "", storage: "Dry Store", package: "KG", qty: 2, price: 34.00, inventoryValue: 68.00 },
  { section: "FOOD", productName: "APPLE GREEN FRESH", prdCat: "FRUITS AND VEG", allocation: "", storage: "Cold Store", package: "KG", qty: 15, price: 6.50, inventoryValue: 97.50 },
];

const NEW_INVENTORY_ENTRY = {
  section: "FOOD",
  productName: "MILLAC GOLD WHIPPING & COOKING CREAM - 12X1L",
  prdCat: "DAIRY",
  allocation: "",
  storage: "Cold Store",
  package: "CARTON",
  qty: 1,
  price: 225.00,
  inventoryValue: 225.00,
  isNew: true,
};

// ─── Pre-existing ledger entries ────────────────────────────────────────
const EXISTING_LEDGER = [
  { date: "01/04/2026", ref: "PO-68801", account: "Inventory — Raw Materials", description: "Monthly dairy order — Al Rawabi", debit: 3420.00, credit: null },
  { date: "01/04/2026", ref: "PO-68801", account: "VAT Input Tax (5%)", description: "Tax on PO-68801", debit: 171.00, credit: null },
  { date: "01/04/2026", ref: "PO-68801", account: "Accounts Payable — Al Rawabi", description: "Monthly dairy order — Al Rawabi", debit: null, credit: 3591.00 },
  { date: "05/04/2026", ref: "PO-68834", account: "Inventory — Raw Materials", description: "Dry goods restock — Bidfood", debit: 1876.50, credit: null },
  { date: "05/04/2026", ref: "PO-68834", account: "VAT Input Tax (5%)", description: "Tax on PO-68834", debit: 93.83, credit: null },
  { date: "05/04/2026", ref: "PO-68834", account: "Accounts Payable — Bidfood", description: "Dry goods restock — Bidfood", debit: null, credit: 1970.33 },
  { date: "12/04/2026", ref: "PO-68872", account: "Inventory — Raw Materials", description: "Fresh produce — Emirates Greens", debit: 945.00, credit: null },
  { date: "12/04/2026", ref: "PO-68872", account: "VAT Input Tax (5%)", description: "Tax on PO-68872", debit: 47.25, credit: null },
  { date: "12/04/2026", ref: "PO-68872", account: "Accounts Payable — Emirates Greens", description: "Fresh produce — Emirates Greens", debit: null, credit: 992.25 },
  { date: "18/04/2026", ref: "PO-68890", account: "Supplies Expense", description: "Disposables order — Hotpack", debit: 1640.00, credit: null },
  { date: "18/04/2026", ref: "PO-68890", account: "VAT Input Tax (5%)", description: "Tax on PO-68890", debit: 82.00, credit: null },
  { date: "18/04/2026", ref: "PO-68890", account: "Accounts Payable — Hotpack", description: "Disposables order — Hotpack", debit: null, credit: 1722.00 },
];

const NEW_LEDGER_ENTRIES = [
  { date: "23/04/2026", ref: "PO-68917", account: "Inventory — Raw Materials", description: "Millac Gold Whipping & Cooking Cream - 12x1L", debit: 225.00, credit: null, isNew: true },
  { date: "23/04/2026", ref: "PO-68917", account: "VAT Input Tax (5%)", description: "Tax on PO-68917", debit: 11.25, credit: null, isNew: true },
  { date: "23/04/2026", ref: "PO-68917", account: "Accounts Payable — Mr. Nauman", description: "Millac Gold Whipping & Cooking Cream - 12x1L", debit: null, credit: 236.25, isNew: true },
];

// ─── Extracted data from delivery note ──────────────────────────────────
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
    { description: "Millac Gold Whipping & Cooking Cream - 12x1L", qty: 1, unitPrice: 225.00, tax: 11.25, total: 236.25 },
  ],
};

const STEPS = [
  { id: "upload", label: "Upload" },
  { id: "processing", label: "Processing" },
  { id: "results", label: "Results" },
];

// ─── Sidebar nav items ──────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: IoGridOutline },
  { id: "documents", label: "Documents", icon: IoFolderOpenOutline },
  { id: "inventory", label: "Inventory", icon: IoCubeOutline },
  { id: "ledger", label: "General Ledger", icon: IoReceiptOutline },
];

// ═══════════════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function Home() {
  const [phase, setPhase] = useState("flow"); // "flow" | "app"
  const [step, setStep] = useState("upload");
  const [fileName, setFileName] = useState(null);
  const [activeTab, setActiveTab] = useState("ledger");
  const [appPage, setAppPage] = useState("inventory");

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (file) {
      setFileName(file.name);
      setStep("processing");
      setTimeout(() => setStep("results"), 2800);
    }
  }, []);

  const handleDragOver = useCallback((e) => e.preventDefault(), []);

  const handleConfirm = () => {
    setPhase("app");
    setAppPage("inventory");
  };

  const resetDemo = () => {
    setPhase("flow");
    setStep("upload");
    setFileName(null);
    setActiveTab("ledger");
  };

  if (phase === "app") {
    return <AppShell appPage={appPage} setAppPage={setAppPage} onNewUpload={resetDemo} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <FlowHeader />
      <StepIndicator step={step} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {step === "upload" && <UploadStep key="upload" onDrop={handleDrop} onDragOver={handleDragOver} />}
          {step === "processing" && <ProcessingStep key="processing" fileName={fileName} />}
          {step === "results" && (
            <ResultsStep key="results" activeTab={activeTab} setActiveTab={setActiveTab} onConfirm={handleConfirm} />
          )}
        </AnimatePresence>
      </main>
      <footer className="bg-cv-dark-deep mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-white/40 text-xs">CrossVal Document Processing Demo</span>
          <span className="text-white/40 text-xs">crossval.com</span>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FLOW HEADER & STEP INDICATOR
// ═══════════════════════════════════════════════════════════════════════
function FlowHeader() {
  return (
    <header className="bg-cv-dark-deep border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Image src="/images/crossval-logo.png" alt="CrossVal" width={180} height={58} className="h-8 w-auto brightness-0 invert" priority />
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-sm">Document Processing</span>
          <span className="inline-block w-2 h-2 rounded-full bg-primary-green" />
        </div>
      </div>
    </header>
  );
}

function StepIndicator({ step }) {
  return (
    <div className="bg-white border-b border-gray-mid">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const isActive = s.id === step;
            const isPast = STEPS.findIndex((x) => x.id === step) > STEPS.findIndex((x) => x.id === s.id);
            return (
              <div key={s.id} className="flex items-center gap-2">
                {i > 0 && <div className={`w-8 h-px ${isPast ? "bg-primary-green" : "bg-gray-mid"}`} />}
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isPast || isActive ? "bg-primary-green text-white" : "bg-gray-mid text-gray-dark"}`}>
                    {isPast ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? "text-black" : isPast ? "text-primary-green" : "text-gray-dark"}`}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// UPLOAD STEP
// ═══════════════════════════════════════════════════════════════════════
function UploadStep({ onDrop, onDragOver }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-black mb-2">Upload Delivery Note or Purchase Order</h1>
        <p className="text-sm text-[#555]">We extract line items and route them to your accounting ledger and inventory automatically.</p>
      </div>
      <label onDrop={onDrop} onDragOver={onDragOver} className="w-full max-w-lg border-2 border-dashed border-gray-300 rounded-lg p-16 flex flex-col items-center gap-4 cursor-pointer hover:border-primary-green hover:bg-secondary-green/30 transition-all duration-200">
        <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={onDrop} className="hidden" />
        <IoCloudUploadOutline className="w-12 h-12 text-gray-dark" />
        <div className="text-center">
          <p className="text-sm font-medium text-black">Drop your file here, or click to browse</p>
          <p className="text-xs text-gray-dark mt-1">PDF, PNG, or JPEG up to 10 MB</p>
        </div>
      </label>
      <div className="mt-6 w-full max-w-lg p-3 border border-blue-300 rounded-lg bg-blue-50">
        <p className="text-sm text-gray-700">Upload a delivery note or purchase order. CrossVal extracts the financial transactions into a double-entry ledger and maps inventory items to your existing inventory table format.</p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PROCESSING STEP
// ═══════════════════════════════════════════════════════════════════════
function ProcessingStep({ fileName }) {
  const stages = [
    { label: "Reading document", delay: 0 },
    { label: "Extracting line items", delay: 0.6 },
    { label: "Mapping to accounting ledger", delay: 1.2 },
    { label: "Mapping to inventory table", delay: 1.8 },
    { label: "Validating entries", delay: 2.2 },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-mid">
          <IoDocumentTextOutline className="w-5 h-5 text-primary-green" />
          <span className="text-sm font-medium text-black truncate">{fileName}</span>
        </div>
        <div className="space-y-4">
          {stages.map((stage) => (
            <motion.div key={stage.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stage.delay, duration: 0.3 }} className="flex items-center gap-3">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: stage.delay + 0.3, type: "spring" }}>
                <IoCheckmarkCircle className="w-5 h-5 text-primary-green" />
              </motion.div>
              <span className="text-sm text-[#555]">{stage.label}</span>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.6, ease: "easeInOut" }} className="mt-6 h-1 bg-primary-green rounded-full" />
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// RESULTS STEP (intermediate — before entering full app)
// ═══════════════════════════════════════════════════════════════════════
function ResultsStep({ activeTab, setActiveTab, onConfirm }) {
  const data = EXTRACTED_DATA;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
      {/* Document summary */}
      <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary-green flex items-center justify-center">
              <IoDocumentTextOutline className="w-5 h-5 text-primary-green" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-black">{data.document.type} — {data.document.poNumber}</h2>
              <p className="text-sm text-[#555]">{data.document.supplier} ({data.document.supplierLocation}) → {data.document.recipient}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">{data.document.paymentStatus}</span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary-green text-primary-green border border-primary-green/20">{data.document.date}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-mid grid grid-cols-4 gap-4">
          <div><span className="text-xs text-gray-dark uppercase tracking-wider font-medium">Items</span><p className="text-sm font-semibold text-black mt-0.5">{data.lineItems.length}</p></div>
          <div><span className="text-xs text-gray-dark uppercase tracking-wider font-medium">Subtotal</span><p className="text-sm font-semibold text-black mt-0.5">AED {data.lineItems.reduce((s, i) => s + i.unitPrice * i.qty, 0).toFixed(2)}</p></div>
          <div><span className="text-xs text-gray-dark uppercase tracking-wider font-medium">Tax (5% VAT)</span><p className="text-sm font-semibold text-black mt-0.5">AED {data.lineItems.reduce((s, i) => s + i.tax, 0).toFixed(2)}</p></div>
          <div><span className="text-xs text-gray-dark uppercase tracking-wider font-medium">Total</span><p className="text-sm font-semibold text-primary-green mt-0.5">AED {data.lineItems.reduce((s, i) => s + i.total, 0).toFixed(2)}</p></div>
        </div>
      </div>

      {/* Flow viz */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-mid text-sm">
          <IoDocumentTextOutline className="w-4 h-4 text-primary-green" />
          <span className="font-medium">Delivery Note</span>
        </div>
        <IoArrowForward className="w-5 h-5 text-gray-dark" />
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-green/10 rounded-lg border border-primary-green/30 text-sm">
          <IoReceiptOutline className="w-4 h-4 text-primary-green" />
          <span className="font-medium text-primary-green">Accounting Ledger</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-green/10 rounded-lg border border-primary-green/30 text-sm">
          <IoCubeOutline className="w-4 h-4 text-primary-green" />
          <span className="font-medium text-primary-green">Inventory Table</span>
        </div>
      </div>

      {/* Preview tabs */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex border-b border-gray-mid">
          <button onClick={() => setActiveTab("ledger")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === "ledger" ? "border-primary-green text-primary-green" : "border-transparent text-[#555] hover:text-black"}`}>
            <IoReceiptOutline className="w-4 h-4" /> Accounting Ledger
          </button>
          <button onClick={() => setActiveTab("inventory")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === "inventory" ? "border-primary-green text-primary-green" : "border-transparent text-[#555] hover:text-black"}`}>
            <IoCubeOutline className="w-4 h-4" /> Inventory Table
          </button>
        </div>
        <div>{activeTab === "ledger" ? <PreviewLedger /> : <PreviewInventory />}</div>
        <div className="px-6 py-4 border-t border-gray-mid flex items-center justify-between bg-gray-light">
          <p className="text-xs text-[#555]">
            {activeTab === "ledger" ? "3 journal entries extracted • Debits = Credits" : "1 item mapped to Skyhawk Catering inventory format"}
          </p>
          <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-medium text-white bg-primary-green rounded-lg hover:bg-[#005c14] transition-all duration-200 active:scale-[0.98]">
            Confirm & Save
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Preview tables (just new items, used in flow results step)
function PreviewLedger() {
  return (
    <div className="overflow-x-auto">
      <table className="cv-table">
        <thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead>
        <tbody>
          {NEW_LEDGER_ENTRIES.map((e, i) => (
            <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }}>
              <td className="whitespace-nowrap">{e.date}</td>
              <td><span className="font-mono text-xs px-1.5 py-0.5 bg-gray-100 rounded">{e.ref}</span></td>
              <td className="font-medium">{e.account}</td>
              <td className="text-[#555]">{e.description}</td>
              <td className="text-right font-mono">{e.debit != null ? e.debit.toFixed(2) : ""}</td>
              <td className="text-right font-mono">{e.credit != null ? e.credit.toFixed(2) : ""}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PreviewInventory() {
  const inv = NEW_INVENTORY_ENTRY;
  return (
    <div className="overflow-x-auto">
      <table className="cv-table">
        <thead><tr><th>Section</th><th>Product Name</th><th>Prd Cat</th><th>Allocation</th><th>Storage</th><th>Package</th><th className="text-right">Qty</th><th className="text-right">Price (AED)</th><th className="text-right">Inventory Value</th></tr></thead>
        <tbody>
          <motion.tr initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
            <td><span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary-green text-primary-green">{inv.section}</span></td>
            <td className="font-medium max-w-[280px]">{inv.productName}</td>
            <td>{inv.prdCat}</td>
            <td className="text-gray-dark">{inv.allocation || "—"}</td>
            <td className="text-gray-dark">{inv.storage || "—"}</td>
            <td>{inv.package}</td>
            <td className="text-right font-mono">{inv.qty}</td>
            <td className="text-right font-mono">{inv.price.toFixed(2)}</td>
            <td className="text-right font-mono font-semibold">{inv.inventoryValue.toFixed(2)}</td>
          </motion.tr>
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FULL APP SHELL — shown after Confirm & Save
// ═══════════════════════════════════════════════════════════════════════
function AppShell({ appPage, setAppPage, onNewUpload }) {
  const allInventory = [...EXISTING_INVENTORY, NEW_INVENTORY_ENTRY];
  const allLedger = [...EXISTING_LEDGER, ...NEW_LEDGER_ENTRIES];
  const totalInventoryValue = allInventory.reduce((s, i) => s + i.inventoryValue, 0);
  const totalDebit = allLedger.reduce((s, e) => s + (e.debit || 0), 0);
  const totalCredit = allLedger.reduce((s, e) => s + (e.credit || 0), 0);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-cv-dark-deep flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <Image src="/images/crossval-logo.png" alt="CrossVal" width={180} height={58} className="h-7 w-auto brightness-0 invert" priority />
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.id === appPage;
            return (
              <button key={item.id} onClick={() => setAppPage(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active ? "bg-primary-green text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
                {item.id === "inventory" && <span className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{allInventory.length}</span>}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">
            <IoSettingsOutline className="w-[18px] h-[18px]" /> Settings
          </button>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-7 h-7 rounded-full bg-primary-green flex items-center justify-center text-white text-xs font-semibold">SD</div>
            <div>
              <p className="text-sm text-white/80 font-medium leading-none">Shaan Dewan</p>
              <p className="text-xs text-white/40 mt-0.5">Skyhawk Catering</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-light">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-mid px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-black capitalize">{appPage === "ledger" ? "General Ledger" : appPage}</h1>
            <p className="text-sm text-[#555]">Skyhawk Catering Services LLC — April 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onNewUpload} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-green rounded-lg hover:bg-[#005c14] transition-all duration-200 active:scale-[0.98]">
              <IoAddCircleOutline className="w-4 h-4" /> Upload Document
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            {appPage === "dashboard" && <DashboardPage key="dash" allInventory={allInventory} allLedger={allLedger} totalInventoryValue={totalInventoryValue} totalDebit={totalDebit} setAppPage={setAppPage} />}
            {appPage === "documents" && <DocumentsPage key="docs" />}
            {appPage === "inventory" && <InventoryPage key="inv" allInventory={allInventory} totalInventoryValue={totalInventoryValue} />}
            {appPage === "ledger" && <LedgerPage key="led" allLedger={allLedger} totalDebit={totalDebit} totalCredit={totalCredit} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────
function DashboardPage({ allInventory, allLedger, totalInventoryValue, totalDebit, setAppPage }) {
  const stats = [
    { label: "Total Inventory Value", value: `AED ${totalInventoryValue.toFixed(2)}`, sub: `${allInventory.length} items` },
    { label: "Ledger Entries", value: allLedger.length.toString(), sub: "April 2026" },
    { label: "Total Debits", value: `AED ${totalDebit.toFixed(2)}`, sub: "This month" },
    { label: "Documents Processed", value: "5", sub: "4 POs, 1 DN" },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg p-5 shadow-sm border border-gray-mid">
            <p className="text-xs text-gray-dark uppercase tracking-wider font-medium mb-1">{s.label}</p>
            <p className="text-xl font-semibold text-black">{s.value}</p>
            <p className="text-xs text-[#555] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-mid p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-black">Recent Inventory</h3>
            <button onClick={() => setAppPage("inventory")} className="text-xs text-primary-green font-medium hover:underline">View all</button>
          </div>
          <table className="cv-table">
            <thead><tr><th>Product</th><th>Category</th><th className="text-right">Value</th></tr></thead>
            <tbody>
              {allInventory.slice(-5).reverse().map((inv, i) => (
                <tr key={i} className={inv.isNew ? "bg-secondary-green/40" : ""}>
                  <td className="text-sm">{inv.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-2" />}{inv.productName}</td>
                  <td className="text-sm text-[#555]">{inv.prdCat}</td>
                  <td className="text-sm text-right font-mono">{inv.inventoryValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-mid p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-black">Recent Ledger Entries</h3>
            <button onClick={() => setAppPage("ledger")} className="text-xs text-primary-green font-medium hover:underline">View all</button>
          </div>
          <table className="cv-table">
            <thead><tr><th>Account</th><th className="text-right">Debit</th><th className="text-right">Credit</th></tr></thead>
            <tbody>
              {allLedger.slice(-5).reverse().map((e, i) => (
                <tr key={i} className={e.isNew ? "bg-secondary-green/40" : ""}>
                  <td className="text-sm">{e.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-2" />}{e.account}</td>
                  <td className="text-sm text-right font-mono">{e.debit != null ? e.debit.toFixed(2) : ""}</td>
                  <td className="text-sm text-right font-mono">{e.credit != null ? e.credit.toFixed(2) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Documents Page ─────────────────────────────────────────────────────
function DocumentsPage() {
  const docs = [
    { name: "PO-68801 — Al Rawabi Dairy.pdf", type: "Purchase Order", date: "01/04/2026", status: "Processed" },
    { name: "PO-68834 — Bidfood Dry Goods.pdf", type: "Purchase Order", date: "05/04/2026", status: "Processed" },
    { name: "PO-68872 — Emirates Greens.pdf", type: "Purchase Order", date: "12/04/2026", status: "Processed" },
    { name: "PO-68890 — Hotpack Disposables.pdf", type: "Purchase Order", date: "18/04/2026", status: "Processed" },
    { name: "DN-68917 — Mr. Nauman Delivery.pdf", type: "Delivery Note", date: "23/04/2026", status: "Processed", isNew: true },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-mid overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-mid flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-mid rounded-lg text-sm text-[#555]">
              <IoSearchOutline className="w-4 h-4" /> Search documents...
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-mid rounded-lg text-sm text-[#555] hover:border-gray-400 transition-colors"><IoFilterOutline className="w-4 h-4" /> Filter</button>
          </div>
          <span className="text-xs text-[#555]">{docs.length} documents</span>
        </div>
        <table className="cv-table">
          <thead><tr><th>Document</th><th>Type</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {docs.map((d, i) => (
              <tr key={i} className={d.isNew ? "bg-secondary-green/40" : ""}>
                <td className="font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <IoDocumentTextOutline className="w-4 h-4 text-gray-dark" />
                    {d.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green" />}
                    {d.name}
                  </div>
                </td>
                <td className="text-sm text-[#555]">{d.type}</td>
                <td className="text-sm text-[#555]">{d.date}</td>
                <td><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary-green text-primary-green">{d.status}</span></td>
                <td className="text-right"><button className="text-gray-dark hover:text-black"><IoDownloadOutline className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Full Inventory Page ────────────────────────────────────────────────
function InventoryPage({ allInventory, totalInventoryValue }) {
  const categories = [...new Set(allInventory.map((i) => i.prdCat))];
  const catCounts = categories.map((c) => ({ cat: c, count: allInventory.filter((i) => i.prdCat === c).length }));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-mid">
          <p className="text-xs text-gray-dark uppercase tracking-wider font-medium">Total Value</p>
          <p className="text-lg font-semibold text-black mt-1">AED {totalInventoryValue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-mid">
          <p className="text-xs text-gray-dark uppercase tracking-wider font-medium">Total Items</p>
          <p className="text-lg font-semibold text-black mt-1">{allInventory.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-mid">
          <p className="text-xs text-gray-dark uppercase tracking-wider font-medium">Categories</p>
          <p className="text-lg font-semibold text-black mt-1">{categories.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-mid">
          <p className="text-xs text-gray-dark uppercase tracking-wider font-medium">Last Updated</p>
          <p className="text-lg font-semibold text-primary-green mt-1">Just Now</p>
        </div>
      </div>

      {/* Info banner for new item */}
      <div className="mb-4 p-3 border border-primary-green/30 rounded-lg bg-secondary-green/50 flex items-center gap-3">
        <IoCheckmarkCircle className="w-5 h-5 text-primary-green shrink-0" />
        <p className="text-sm text-black"><span className="font-semibold">1 new item added</span> from Delivery Note PO-68917 — Millac Gold Whipping & Cooking Cream - 12x1L</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-mid overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-mid flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-mid rounded-lg text-sm text-[#555]">
              <IoSearchOutline className="w-4 h-4" /> Search inventory...
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-mid rounded-lg text-sm text-[#555] hover:border-gray-400 transition-colors"><IoFilterOutline className="w-4 h-4" /> Filter</button>
          </div>
          <div className="flex items-center gap-2">
            {catCounts.map((c) => (
              <span key={c.cat} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-[#555]">{c.cat} ({c.count})</span>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="cv-table">
            <thead>
              <tr>
                <th>Section</th><th>Product Name</th><th>Prd Cat</th><th>Allocation</th><th>Storage</th><th>Package</th><th className="text-right">Qty</th><th className="text-right">Price (AED)</th><th className="text-right">Inventory Value</th>
              </tr>
            </thead>
            <tbody>
              {allInventory.map((inv, i) => (
                <motion.tr key={i} initial={inv.isNew ? { opacity: 0, backgroundColor: "#d4edda" } : {}} animate={{ opacity: 1, backgroundColor: inv.isNew ? "#EAF1EB" : "transparent" }} transition={{ delay: inv.isNew ? 0.3 : 0, duration: 0.5 }} className={inv.isNew ? "ring-1 ring-primary-green/20" : ""}>
                  <td><span className={`text-xs font-semibold px-2 py-0.5 rounded ${inv.section === "FOOD" ? "bg-secondary-green text-primary-green" : "bg-gray-100 text-[#555]"}`}>{inv.section}</span></td>
                  <td className="font-medium text-sm max-w-[260px]">
                    {inv.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-2" />}
                    {inv.productName}
                  </td>
                  <td className="text-sm">{inv.prdCat}</td>
                  <td className="text-sm text-gray-dark">{inv.allocation || "—"}</td>
                  <td className="text-sm text-gray-dark">{inv.storage || "—"}</td>
                  <td className="text-sm">{inv.package}</td>
                  <td className="text-right font-mono text-sm">{inv.qty}</td>
                  <td className="text-right font-mono text-sm">{inv.price.toFixed(2)}</td>
                  <td className="text-right font-mono text-sm font-semibold">{inv.inventoryValue.toFixed(2)}</td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-light font-semibold">
                <td colSpan={8} className="text-right text-xs uppercase tracking-wider text-[#555] !border-t-2 !border-gray-mid">Total Inventory Value</td>
                <td className="text-right font-mono !border-t-2 !border-gray-mid">{totalInventoryValue.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Full Ledger Page ───────────────────────────────────────────────────
function LedgerPage({ allLedger, totalDebit, totalCredit }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-mid">
          <p className="text-xs text-gray-dark uppercase tracking-wider font-medium">Total Debits</p>
          <p className="text-lg font-semibold text-black mt-1">AED {totalDebit.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-mid">
          <p className="text-xs text-gray-dark uppercase tracking-wider font-medium">Total Credits</p>
          <p className="text-lg font-semibold text-black mt-1">AED {totalCredit.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-mid">
          <p className="text-xs text-gray-dark uppercase tracking-wider font-medium">Balance</p>
          <p className={`text-lg font-semibold mt-1 ${Math.abs(totalDebit - totalCredit) < 0.01 ? "text-primary-green" : "text-red-600"}`}>
            {Math.abs(totalDebit - totalCredit) < 0.01 ? "Balanced" : `AED ${(totalDebit - totalCredit).toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* New entries banner */}
      <div className="mb-4 p-3 border border-primary-green/30 rounded-lg bg-secondary-green/50 flex items-center gap-3">
        <IoCheckmarkCircle className="w-5 h-5 text-primary-green shrink-0" />
        <p className="text-sm text-black"><span className="font-semibold">3 new journal entries</span> from Delivery Note PO-68917 — Accounts Payable: Mr. Nauman, AED 236.25</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-mid overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-mid flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-mid rounded-lg text-sm text-[#555]">
              <IoSearchOutline className="w-4 h-4" /> Search ledger...
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-mid rounded-lg text-sm text-[#555] hover:border-gray-400 transition-colors"><IoFilterOutline className="w-4 h-4" /> Filter</button>
          </div>
          <span className="text-xs text-[#555]">{allLedger.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="cv-table">
            <thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead>
            <tbody>
              {allLedger.map((e, i) => (
                <motion.tr key={i} initial={e.isNew ? { opacity: 0, backgroundColor: "#d4edda" } : {}} animate={{ opacity: 1, backgroundColor: e.isNew ? "#EAF1EB" : "transparent" }} transition={{ delay: e.isNew ? 0.3 : 0, duration: 0.5 }} className={e.isNew ? "ring-1 ring-primary-green/20" : ""}>
                  <td className="whitespace-nowrap text-sm">{e.date}</td>
                  <td><span className="font-mono text-xs px-1.5 py-0.5 bg-gray-100 rounded">{e.ref}</span></td>
                  <td className="font-medium text-sm">
                    {e.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-2" />}
                    {e.account}
                  </td>
                  <td className="text-sm text-[#555]">{e.description}</td>
                  <td className="text-right font-mono text-sm">{e.debit != null ? e.debit.toFixed(2) : ""}</td>
                  <td className="text-right font-mono text-sm">{e.credit != null ? e.credit.toFixed(2) : ""}</td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-light font-semibold">
                <td colSpan={4} className="text-right text-xs uppercase tracking-wider text-[#555] !border-t-2 !border-gray-mid">Totals</td>
                <td className="text-right font-mono !border-t-2 !border-gray-mid">{totalDebit.toFixed(2)}</td>
                <td className="text-right font-mono !border-t-2 !border-gray-mid">{totalCredit.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
