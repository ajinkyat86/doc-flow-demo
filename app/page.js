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
  IoAddCircleOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoDownloadOutline,
  IoChevronDown,
  IoChevronForward,
  IoClose,
  IoConstructOutline,
  IoEllipsisHorizontal,
  IoCheckmark,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoStatsChartOutline,
  IoNotificationsOutline,
  IoGlobeOutline,
  IoPersonCircleOutline,
  IoLayersOutline,
} from "react-icons/io5";

// ─── Pre-existing inventory (Skyhawk) ───────────────────────────────────
const EXISTING_INVENTORY = [
  { id: "INV-001", section: "FOOD", productName: "BUTTER UNSALTED", prdCat: "DAIRY", allocation: "", storage: "Cold Store", package: "KG", qty: 12, price: 23.05, inventoryValue: 276.57 },
  { id: "INV-002", section: "FOOD", productName: "CREAM CHEESE", prdCat: "DAIRY", allocation: "", storage: "Cold Store", package: "KG", qty: 8.5, price: 40.00, inventoryValue: 340.00 },
  { id: "INV-003", section: "FOOD", productName: "EGGS 30PC MEDIUM", prdCat: "DAIRY", allocation: "Kitchen", storage: "Cold Store", package: "PC", qty: 300, price: 0.50, inventoryValue: 150.00 },
  { id: "INV-004", section: "FOOD", productName: "MILK FULL FAT", prdCat: "DAIRY", allocation: "Kitchen", storage: "Cold Store", package: "LITRE", qty: 24, price: 4.53, inventoryValue: 108.72 },
  { id: "INV-005", section: "FOOD", productName: "VEGAN WHIPPING CREAM", prdCat: "DAIRY", allocation: "", storage: "Cold Store", package: "KG", qty: 3, price: 38.00, inventoryValue: 114.00 },
  { id: "INV-006", section: "NONFOOD", productName: "BAKING PAPER", prdCat: "DISPOSABLE", allocation: "Kitchen", storage: "", package: "PC", qty: 2, price: 27.00, inventoryValue: 54.00 },
  { id: "INV-007", section: "NONFOOD", productName: "PIPING BAGS", prdCat: "DISPOSABLE", allocation: "Kitchen", storage: "", package: "ROLLS", qty: 6, price: 27.00, inventoryValue: 162.00 },
  { id: "INV-008", section: "FOOD", productName: "AACHAR GOST MASALA SHAN 50G", prdCat: "DRY", allocation: "", storage: "Dry Store", package: "KG", qty: 5.7, price: 124.00, inventoryValue: 706.80 },
  { id: "INV-009", section: "NONFOOD", productName: "4OZ COFFEE CUPS BROWN 1000PCS", prdCat: "DISPOSABLE", allocation: "Staff", storage: "", package: "CARTON", qty: 4, price: 130.00, inventoryValue: 520.00 },
  { id: "INV-010", section: "NONFOOD", productName: "ALUMINUM FOIL HOTPACK 45X150CM", prdCat: "CONSUMABLES", allocation: "Staff", storage: "", package: "PC", qty: 46, price: 23.67, inventoryValue: 1088.67 },
  { id: "INV-011", section: "FOOD", productName: "ALMOND BLANCHED PREMIUM 1KG", prdCat: "DRY", allocation: "", storage: "Dry Store", package: "KG", qty: 2, price: 34.00, inventoryValue: 68.00 },
  { id: "INV-012", section: "FOOD", productName: "APPLE GREEN FRESH", prdCat: "FRUITS AND VEG", allocation: "", storage: "Cold Store", package: "KG", qty: 15, price: 6.50, inventoryValue: 97.50 },
];

const NEW_INVENTORY_ENTRY = {
  id: "INV-013", section: "FOOD", productName: "MILLAC GOLD WHIPPING & COOKING CREAM - 12X1L", prdCat: "DAIRY", allocation: "", storage: "Cold Store", package: "CARTON", qty: 1, price: 225.00, inventoryValue: 225.00, isNew: true,
};

// ─── Pre-existing ledger ────────────────────────────────────────────────
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

// ─── Projects ───────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "PRJ-001",
    name: "Ramadan Iftar Buffet — DIFC Office Tower",
    client: "DIFC Management",
    status: "active",
    startDate: "01/04/2026",
    endDate: "30/04/2026",
    budget: 18500.00,
    spent: 12340.00,
    inventoryAllocated: ["INV-001", "INV-002", "INV-003", "INV-004", "INV-008", "INV-012"],
    ledgerRefs: ["PO-68801", "PO-68872"],
    completion: 65,
  },
  {
    id: "PRJ-002",
    name: "Weekly Corporate Lunch — Emirates NBD",
    client: "Emirates NBD HQ",
    status: "active",
    startDate: "07/04/2026",
    endDate: "28/04/2026",
    budget: 8200.00,
    spent: 5460.00,
    inventoryAllocated: ["INV-003", "INV-004", "INV-005", "INV-011"],
    ledgerRefs: ["PO-68834"],
    completion: 75,
  },
  {
    id: "PRJ-003",
    name: "Staff Canteen Restock — April",
    client: "Internal",
    status: "active",
    startDate: "01/04/2026",
    endDate: "30/04/2026",
    budget: 4500.00,
    spent: 3362.00,
    inventoryAllocated: ["INV-006", "INV-007", "INV-009", "INV-010"],
    ledgerRefs: ["PO-68890"],
    completion: 80,
  },
  {
    id: "PRJ-004",
    name: "Private Dinner — Al Maktoum Residence",
    client: "Al Maktoum Family Office",
    status: "planned",
    startDate: "25/04/2026",
    endDate: "25/04/2026",
    budget: 3200.00,
    spent: 236.25,
    inventoryAllocated: ["INV-013"],
    ledgerRefs: ["PO-68917"],
    completion: 10,
  },
];

const EXTRACTED_DATA = {
  document: { type: "Delivery Note", poNumber: "PO-68917", supplier: "Mr. Nauman", supplierLocation: "Dubai", recipient: "Skyhawk Catering Services LLC", date: "23/04/2026", paymentStatus: "Not Paid" },
  lineItems: [{ description: "Millac Gold Whipping & Cooking Cream - 12x1L", qty: 1, unitPrice: 225.00, tax: 11.25, total: 236.25 }],
};

const STEPS = [
  { id: "upload", label: "Upload" },
  { id: "processing", label: "Processing" },
  { id: "results", label: "Results" },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: IoGridOutline },
  { id: "inventory", label: "Inventory", icon: IoCubeOutline },
  { id: "ledger", label: "General Ledger", icon: IoReceiptOutline },
  { id: "projects", label: "Projects", icon: IoConstructOutline },
  { id: "documents", label: "Documents", icon: IoFolderOpenOutline },
];

// ═══════════════════════════════════════════════════════════════════════
export default function Home() {
  const [phase, setPhase] = useState("flow");
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

  const handleConfirm = () => { setPhase("app"); setAppPage("inventory"); };
  const resetDemo = () => { setPhase("flow"); setStep("upload"); setFileName(null); setActiveTab("ledger"); };

  if (phase === "app") return <AppShell appPage={appPage} setAppPage={setAppPage} onNewUpload={resetDemo} />;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <FlowHeader />
      <StepIndicator step={step} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {step === "upload" && <UploadStep key="upload" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} />}
          {step === "processing" && <ProcessingStep key="processing" fileName={fileName} />}
          {step === "results" && <ResultsStep key="results" activeTab={activeTab} setActiveTab={setActiveTab} onConfirm={handleConfirm} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FLOW COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
function FlowHeader() {
  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <Image src="/images/crossval-logo.png" alt="CrossVal" width={180} height={58} className="h-7 w-auto" priority />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Document Processing</span>
          <span className="inline-block w-2 h-2 rounded-full bg-primary-green" />
        </div>
      </div>
    </header>
  );
}

function StepIndicator({ step }) {
  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2">
        {STEPS.map((s, i) => {
          const isActive = s.id === step;
          const isPast = STEPS.findIndex((x) => x.id === step) > STEPS.findIndex((x) => x.id === s.id);
          return (
            <div key={s.id} className="flex items-center gap-2">
              {i > 0 && <div className={`w-8 h-px ${isPast ? "bg-primary-green" : "bg-gray-200"}`} />}
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isPast || isActive ? "bg-primary-green text-white" : "bg-gray-100 text-gray-400"}`}>
                  {isPast ? "✓" : i + 1}
                </div>
                <span className={`text-sm font-medium ${isActive ? "text-black" : isPast ? "text-primary-green" : "text-gray-400"}`}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UploadStep({ onDrop, onDragOver }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-black mb-2">Upload Delivery Note or Purchase Order</h1>
        <p className="text-sm text-gray-500">We extract line items and route them to your accounting ledger and inventory automatically.</p>
      </div>
      <label onDrop={onDrop} onDragOver={onDragOver} className="w-full max-w-lg border-2 border-dashed border-gray-200 rounded-lg p-16 flex flex-col items-center gap-4 cursor-pointer hover:border-primary-green hover:bg-secondary-green/20 transition-all duration-200">
        <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={onDrop} className="hidden" />
        <IoCloudUploadOutline className="w-12 h-12 text-gray-300" />
        <div className="text-center">
          <p className="text-sm font-medium text-black">Drop your file here, or click to browse</p>
          <p className="text-xs text-gray-400 mt-1">PDF, PNG, or JPEG up to 10 MB</p>
        </div>
      </label>
      <div className="mt-6 w-full max-w-lg p-3 border border-blue-200 rounded-lg bg-blue-50">
        <p className="text-sm text-gray-600">Upload a delivery note or purchase order. CrossVal extracts the financial transactions into a double-entry ledger and maps inventory items to your existing inventory table format.</p>
      </div>
    </motion.div>
  );
}

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
      <div className="w-full max-w-md bg-white rounded-lg border border-border shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <IoDocumentTextOutline className="w-5 h-5 text-primary-green" />
          <span className="text-sm font-medium text-black truncate">{fileName}</span>
        </div>
        <div className="space-y-4">
          {stages.map((stage) => (
            <motion.div key={stage.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stage.delay, duration: 0.3 }} className="flex items-center gap-3">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: stage.delay + 0.3, type: "spring" }}>
                <IoCheckmarkCircle className="w-5 h-5 text-primary-green" />
              </motion.div>
              <span className="text-sm text-gray-600">{stage.label}</span>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.6, ease: "easeInOut" }} className="mt-6 h-1 bg-primary-green rounded-full" />
      </div>
    </motion.div>
  );
}

function ResultsStep({ activeTab, setActiveTab, onConfirm }) {
  const data = EXTRACTED_DATA;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
      <div className="bg-white rounded-lg border border-border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary-green flex items-center justify-center"><IoDocumentTextOutline className="w-5 h-5 text-primary-green" /></div>
            <div>
              <h2 className="text-sm font-semibold text-black">{data.document.type} — {data.document.poNumber}</h2>
              <p className="text-sm text-gray-500">{data.document.supplier} ({data.document.supplierLocation}) → {data.document.recipient}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{data.document.paymentStatus}</span>
            <span className="text-xs font-medium px-2 py-1 rounded bg-gray-50 text-gray-600 border border-gray-200">{data.document.date}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-4">
          <div><span className="text-xs text-gray-400 font-medium">Items</span><p className="text-sm font-semibold text-black mt-0.5">{data.lineItems.length}</p></div>
          <div><span className="text-xs text-gray-400 font-medium">Subtotal</span><p className="text-sm font-semibold text-black mt-0.5">AED 225.00</p></div>
          <div><span className="text-xs text-gray-400 font-medium">Tax (5% VAT)</span><p className="text-sm font-semibold text-black mt-0.5">AED 11.25</p></div>
          <div><span className="text-xs text-gray-400 font-medium">Total</span><p className="text-sm font-semibold text-primary-green mt-0.5">AED 236.25</p></div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-border text-sm"><IoDocumentTextOutline className="w-4 h-4 text-primary-green" /><span className="font-medium">Delivery Note</span></div>
        <IoArrowForward className="w-4 h-4 text-gray-300" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-green/50 rounded-lg border border-primary-green/20 text-sm"><IoReceiptOutline className="w-4 h-4 text-primary-green" /><span className="font-medium text-primary-green">Ledger</span></div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-green/50 rounded-lg border border-primary-green/20 text-sm"><IoCubeOutline className="w-4 h-4 text-primary-green" /><span className="font-medium text-primary-green">Inventory</span></div>
      </div>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[["ledger", "Ledger", IoReceiptOutline], ["inventory", "Inventory", IoCubeOutline]].map(([id, label, Icon]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === id ? "border-primary-green text-primary-green" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
        <div>{activeTab === "ledger" ? <PreviewLedger /> : <PreviewInventory />}</div>
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-xs text-gray-400">{activeTab === "ledger" ? "3 journal entries extracted" : "1 item mapped to Skyhawk inventory format"}</p>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-primary-green rounded-lg hover:bg-[#005c14] transition-all active:scale-[0.98]">Confirm & Save</button>
        </div>
      </div>
    </motion.div>
  );
}

function PreviewLedger() {
  return (
    <div className="overflow-x-auto"><table className="cv-table"><thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead><tbody>
      {NEW_LEDGER_ENTRIES.map((e, i) => (<tr key={i}><td className="whitespace-nowrap">{e.date}</td><td><span className="font-mono text-xs px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{e.ref}</span></td><td className="font-medium">{e.account}</td><td className="text-gray-500">{e.description}</td><td className="text-right font-mono">{e.debit != null ? e.debit.toFixed(2) : ""}</td><td className="text-right font-mono">{e.credit != null ? e.credit.toFixed(2) : ""}</td></tr>))}
    </tbody></table></div>
  );
}

function PreviewInventory() {
  const inv = NEW_INVENTORY_ENTRY;
  return (
    <div className="overflow-x-auto"><table className="cv-table"><thead><tr><th>Section</th><th>Product Name</th><th>Prd Cat</th><th>Storage</th><th>Package</th><th className="text-right">Qty</th><th className="text-right">Price (AED)</th><th className="text-right">Value</th></tr></thead><tbody>
      <tr><td><span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary-green text-primary-green">{inv.section}</span></td><td className="font-medium">{inv.productName}</td><td>{inv.prdCat}</td><td className="text-gray-400">{inv.storage || "—"}</td><td>{inv.package}</td><td className="text-right font-mono">{inv.qty}</td><td className="text-right font-mono">{inv.price.toFixed(2)}</td><td className="text-right font-mono font-semibold">{inv.inventoryValue.toFixed(2)}</td></tr>
    </tbody></table></div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FULL APP SHELL — matches CrossVal platform screenshot
// ═══════════════════════════════════════════════════════════════════════
function AppShell({ appPage, setAppPage, onNewUpload }) {
  const allInventory = [...EXISTING_INVENTORY, NEW_INVENTORY_ENTRY];
  const allLedger = [...EXISTING_LEDGER, ...NEW_LEDGER_ENTRIES];
  const totalInvValue = allInventory.reduce((s, i) => s + i.inventoryValue, 0);
  const totalDebit = allLedger.reduce((s, e) => s + (e.debit || 0), 0);
  const totalCredit = allLedger.reduce((s, e) => s + (e.credit || 0), 0);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar — white, matching CrossVal platform */}
      <aside className="w-56 bg-white border-r border-border flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <Image src="/images/crossval-logo.png" alt="CrossVal" width={180} height={58} className="h-6 w-auto" priority />
          <p className="text-xs text-gray-400 mt-1.5">Skyhawk Catering Services LLC</p>
        </div>
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.id === appPage;
            return (
              <button key={item.id} onClick={() => setAppPage(item.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${active ? "bg-secondary-green text-primary-green font-medium" : "text-gray-600 hover:bg-gray-50 font-normal"}`}>
                <Icon className={`w-[18px] h-[18px] ${active ? "text-primary-green" : "text-gray-400"}`} />
                {item.label}
                {item.id === "projects" && <span className="ml-auto text-[10px] bg-primary-green text-white px-1.5 py-0.5 rounded-full font-medium">{PROJECTS.length}</span>}
              </button>
            );
          })}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <button onClick={() => setMoreOpen(!moreOpen)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <IoChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              More
            </button>
            {moreOpen && (
              <div className="ml-4 mt-1 space-y-0.5">
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><IoStatsChartOutline className="w-4 h-4 text-gray-400" />Insights</button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><IoLayersOutline className="w-4 h-4 text-gray-400" />Budgets</button>
              </div>
            )}
          </div>
        </nav>
        <div className="px-2 py-3 border-t border-border">
          <button onClick={onNewUpload} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-primary-green text-white text-sm font-medium rounded-lg hover:bg-[#005c14] transition-all active:scale-[0.98]">
            <IoCloudUploadOutline className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar — matching platform */}
        <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
          <div>
            <p className="text-sm text-gray-500">Hi <span className="font-semibold text-black">Admin</span></p>
            <h1 className="text-lg font-semibold text-black capitalize">{appPage === "ledger" ? "General Ledger" : appPage}</h1>
            <p className="text-xs text-gray-400">Simplify your financial tasks here</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 rounded-full border border-yellow-300 bg-yellow-50 text-yellow-700 font-medium">Trial Plan</span>
            <div className="flex items-center gap-1 text-sm text-gray-500"><IoGlobeOutline className="w-4 h-4" /> English</div>
            <IoNotificationsOutline className="w-5 h-5 text-gray-400" />
            <div className="w-8 h-8 rounded-full bg-primary-green flex items-center justify-center text-white text-xs font-semibold">SD</div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-light p-6">
          <AnimatePresence mode="wait">
            {appPage === "dashboard" && <DashboardPage key="dash" allInventory={allInventory} allLedger={allLedger} totalInvValue={totalInvValue} totalDebit={totalDebit} setAppPage={setAppPage} />}
            {appPage === "inventory" && <InventoryPage key="inv" allInventory={allInventory} totalInvValue={totalInvValue} />}
            {appPage === "ledger" && <LedgerPage key="led" allLedger={allLedger} totalDebit={totalDebit} totalCredit={totalCredit} />}
            {appPage === "projects" && <ProjectsPage key="prj" allInventory={allInventory} allLedger={allLedger} />}
            {appPage === "documents" && <DocumentsPage key="docs" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────
function DashboardPage({ allInventory, allLedger, totalInvValue, totalDebit, setAppPage }) {
  const stats = [
    { label: "Inventory Value", value: `AED ${totalInvValue.toFixed(2)}`, sub: `${allInventory.length} items` },
    { label: "Ledger Entries", value: allLedger.length.toString(), sub: "April 2026" },
    { label: "Active Projects", value: PROJECTS.filter(p => p.status === "active").length.toString(), sub: `${PROJECTS.length} total` },
    { label: "Documents", value: "5", sub: "All processed" },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg p-4 border border-border">
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            <p className="text-xl font-semibold text-black mt-1">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-black">Active Projects</h3><button onClick={() => setAppPage("projects")} className="text-xs text-primary-green font-medium hover:underline">View all</button></div>
          {PROJECTS.filter(p => p.status === "active").map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div><p className="text-sm font-medium text-black">{p.name}</p><p className="text-xs text-gray-400">{p.client}</p></div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary-green rounded-full" style={{ width: `${p.completion}%` }} /></div>
                <span className="text-xs font-medium text-gray-500">{p.completion}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-black">Recent Inventory</h3><button onClick={() => setAppPage("inventory")} className="text-xs text-primary-green font-medium hover:underline">View all</button></div>
          {allInventory.slice(-5).reverse().map((inv, i) => (
            <div key={i} className={`flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 ${inv.isNew ? "bg-secondary-green/30 -mx-2 px-2 rounded" : ""}`}>
              <div className="flex items-center gap-2">{inv.isNew && <span className="w-1.5 h-1.5 rounded-full bg-primary-green" />}<p className="text-sm text-black">{inv.productName}</p></div>
              <span className="text-sm font-mono text-gray-500">{inv.inventoryValue.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Inventory Page ─────────────────────────────────────────────────────
function InventoryPage({ allInventory, totalInvValue }) {
  const categories = [...new Set(allInventory.map((i) => i.prdCat))];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label="Total Value" value={`AED ${totalInvValue.toFixed(2)}`} />
        <StatCard label="Total Items" value={allInventory.length.toString()} />
        <StatCard label="Categories" value={categories.length.toString()} />
        <StatCard label="Last Updated" value="Just Now" green />
      </div>
      <div className="mb-3 p-3 border border-primary-green/20 rounded-lg bg-secondary-green/40 flex items-center gap-2">
        <IoCheckmarkCircle className="w-4 h-4 text-primary-green shrink-0" />
        <p className="text-sm text-black"><span className="font-medium">1 new item added</span> from Delivery Note PO-68917</p>
      </div>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <TableToolbar placeholder="Search inventory..." count={`${allInventory.length} items`} />
        <div className="overflow-x-auto">
          <table className="cv-table"><thead><tr><th>Section</th><th>Product Name</th><th>Prd Cat</th><th>Storage</th><th>Package</th><th className="text-right">Qty</th><th className="text-right">Price (AED)</th><th className="text-right">Value</th></tr></thead>
            <tbody>
              {allInventory.map((inv, i) => (
                <tr key={i} className={inv.isNew ? "bg-secondary-green/30" : ""}>
                  <td><span className={`text-xs font-medium px-2 py-0.5 rounded ${inv.section === "FOOD" ? "bg-secondary-green text-primary-green" : "bg-gray-50 text-gray-500"}`}>{inv.section}</span></td>
                  <td className="font-medium text-sm">{inv.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{inv.productName}</td>
                  <td className="text-sm text-gray-500">{inv.prdCat}</td>
                  <td className="text-sm text-gray-400">{inv.storage || "—"}</td>
                  <td className="text-sm">{inv.package}</td>
                  <td className="text-right font-mono text-sm">{inv.qty}</td>
                  <td className="text-right font-mono text-sm">{inv.price.toFixed(2)}</td>
                  <td className="text-right font-mono text-sm font-semibold">{inv.inventoryValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr className="bg-gray-50"><td colSpan={7} className="text-right text-xs font-medium text-gray-400">Total</td><td className="text-right font-mono font-semibold text-sm">{totalInvValue.toFixed(2)}</td></tr></tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Ledger Page ────────────────────────────────────────────────────────
function LedgerPage({ allLedger, totalDebit, totalCredit }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Debits" value={`AED ${totalDebit.toFixed(2)}`} />
        <StatCard label="Total Credits" value={`AED ${totalCredit.toFixed(2)}`} />
        <StatCard label="Balance" value={Math.abs(totalDebit - totalCredit) < 0.01 ? "Balanced" : `AED ${(totalDebit - totalCredit).toFixed(2)}`} green={Math.abs(totalDebit - totalCredit) < 0.01} />
      </div>
      <div className="mb-3 p-3 border border-primary-green/20 rounded-lg bg-secondary-green/40 flex items-center gap-2">
        <IoCheckmarkCircle className="w-4 h-4 text-primary-green shrink-0" />
        <p className="text-sm text-black"><span className="font-medium">3 new entries</span> from Delivery Note PO-68917</p>
      </div>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <TableToolbar placeholder="Search ledger..." count={`${allLedger.length} entries`} />
        <div className="overflow-x-auto">
          <table className="cv-table"><thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead>
            <tbody>
              {allLedger.map((e, i) => (
                <tr key={i} className={e.isNew ? "bg-secondary-green/30" : ""}>
                  <td className="whitespace-nowrap text-sm">{e.date}</td>
                  <td><span className="font-mono text-xs px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{e.ref}</span></td>
                  <td className="font-medium text-sm">{e.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{e.account}</td>
                  <td className="text-sm text-gray-500">{e.description}</td>
                  <td className="text-right font-mono text-sm">{e.debit != null ? e.debit.toFixed(2) : ""}</td>
                  <td className="text-right font-mono text-sm">{e.credit != null ? e.credit.toFixed(2) : ""}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr className="bg-gray-50"><td colSpan={4} className="text-right text-xs font-medium text-gray-400">Totals</td><td className="text-right font-mono font-semibold text-sm">{totalDebit.toFixed(2)}</td><td className="text-right font-mono font-semibold text-sm">{totalCredit.toFixed(2)}</td></tr></tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Projects Page ──────────────────────────────────────────────────────
function ProjectsPage({ allInventory, allLedger }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [tab, setTab] = useState("overview");

  if (selectedProject) {
    const proj = PROJECTS.find(p => p.id === selectedProject);
    return <ProjectDetail project={proj} allInventory={allInventory} allLedger={allLedger} onBack={() => { setSelectedProject(null); setTab("overview"); }} tab={tab} setTab={setTab} />;
  }

  const activeProjects = PROJECTS.filter(p => p.status === "active");
  const plannedProjects = PROJECTS.filter(p => p.status === "planned");
  const totalBudget = PROJECTS.reduce((s, p) => s + p.budget, 0);
  const totalSpent = PROJECTS.reduce((s, p) => s + p.spent, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label="Active Projects" value={activeProjects.length.toString()} />
        <StatCard label="Total Budget" value={`AED ${totalBudget.toLocaleString()}`} />
        <StatCard label="Total Spent" value={`AED ${totalSpent.toLocaleString()}`} />
        <StatCard label="Budget Utilization" value={`${Math.round(totalSpent / totalBudget * 100)}%`} />
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">All Projects</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-green text-white text-xs font-medium rounded-lg hover:bg-[#005c14] transition-all">
            <IoAddCircleOutline className="w-3.5 h-3.5" /> New Project
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {PROJECTS.map((proj) => {
            const invCount = proj.inventoryAllocated.length;
            const ledgerEntries = allLedger.filter(e => proj.ledgerRefs.includes(e.ref));
            return (
              <div key={proj.id} onClick={() => setSelectedProject(proj.id)} className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-black">{proj.name}</h4>
                      <StatusBadge status={proj.status} />
                      {proj.id === "PRJ-004" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-green text-white font-medium">New</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{proj.client} · {proj.startDate} — {proj.endDate}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500"><span className="font-medium text-black">{invCount}</span> inventory items</span>
                      <span className="text-xs text-gray-500"><span className="font-medium text-black">{ledgerEntries.length}</span> ledger entries</span>
                      <span className="text-xs text-gray-500">Budget: <span className="font-medium text-black">AED {proj.budget.toLocaleString()}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Spent</p>
                      <p className="text-sm font-semibold text-black">AED {proj.spent.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary-green rounded-full transition-all" style={{ width: `${proj.completion}%` }} /></div>
                      <span className="text-xs font-medium text-gray-500 w-8">{proj.completion}%</span>
                    </div>
                    <IoChevronForward className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Project Detail ─────────────────────────────────────────────────────
function ProjectDetail({ project, allInventory, allLedger, onBack, tab, setTab }) {
  const projInventory = allInventory.filter(i => project.inventoryAllocated.includes(i.id));
  const projLedger = allLedger.filter(e => project.ledgerRefs.includes(e.ref));
  const projInvValue = projInventory.reduce((s, i) => s + i.inventoryValue, 0);
  const projDebit = projLedger.reduce((s, e) => s + (e.debit || 0), 0);
  const projCredit = projLedger.reduce((s, e) => s + (e.credit || 0), 0);
  const remaining = project.budget - project.spent;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-sm text-primary-green hover:underline font-medium">Projects</button>
        <IoChevronForward className="w-3 h-3 text-gray-300" />
        <span className="text-sm text-gray-500">{project.name}</span>
      </div>

      {/* Project header */}
      <div className="bg-white rounded-lg border border-border p-5 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-black">{project.name}</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-gray-400 mt-0.5">{project.client} · {project.startDate} — {project.endDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg border border-border hover:bg-gray-100"><IoPencilOutline className="w-3.5 h-3.5 inline mr-1" />Edit</button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div><p className="text-xs text-gray-400">Budget</p><p className="text-sm font-semibold text-black mt-0.5">AED {project.budget.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-400">Spent</p><p className="text-sm font-semibold text-black mt-0.5">AED {project.spent.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-400">Remaining</p><p className={`text-sm font-semibold mt-0.5 ${remaining > 0 ? "text-primary-green" : "text-red-600"}`}>AED {remaining.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-400">Inventory Items</p><p className="text-sm font-semibold text-black mt-0.5">{projInventory.length}</p></div>
          <div>
            <p className="text-xs text-gray-400">Completion</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary-green rounded-full" style={{ width: `${project.completion}%` }} /></div>
              <span className="text-xs font-semibold text-black">{project.completion}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[["overview", "Overview"], ["inventory", "Inventory"], ["financials", "Financials"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all ${tab === id ? "border-primary-green text-primary-green" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="p-5">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-black mb-3">Allocated Inventory ({projInventory.length} items)</h4>
                <div className="space-y-2">
                  {projInventory.map((inv) => (
                    <div key={inv.id} className={`flex items-center justify-between py-2 px-3 rounded-lg border ${inv.isNew ? "border-primary-green/20 bg-secondary-green/30" : "border-gray-100"}`}>
                      <div className="flex items-center gap-2">
                        {inv.isNew && <span className="w-1.5 h-1.5 rounded-full bg-primary-green" />}
                        <span className="text-sm text-black">{inv.productName}</span>
                        <span className="text-xs text-gray-400">{inv.prdCat}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono text-gray-600">{inv.qty} {inv.package}</span>
                        <span className="text-xs text-gray-400 ml-2">AED {inv.inventoryValue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                  <span className="text-xs text-gray-400 font-medium">Total Inventory Value</span>
                  <span className="text-sm font-semibold font-mono">AED {projInvValue.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-black mb-3">Financial Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-600">Total Debits</span>
                    <span className="text-sm font-mono font-semibold">AED {projDebit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-600">Total Credits</span>
                    <span className="text-sm font-mono font-semibold">AED {projCredit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg border border-primary-green/20 bg-secondary-green/30">
                    <span className="text-sm font-medium text-primary-green">Budget Remaining</span>
                    <span className="text-sm font-mono font-semibold text-primary-green">AED {remaining.toLocaleString()}</span>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-black mt-6 mb-3">Linked Purchase Orders</h4>
                <div className="space-y-1.5">
                  {project.ledgerRefs.map(ref => (
                    <div key={ref} className="flex items-center gap-2 py-1.5 px-3 rounded border border-gray-100">
                      <span className="font-mono text-xs px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{ref}</span>
                      <span className="text-xs text-gray-400">{allLedger.find(e => e.ref === ref)?.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "inventory" && (
          <div className="overflow-x-auto">
            <table className="cv-table"><thead><tr><th>Section</th><th>Product Name</th><th>Prd Cat</th><th>Storage</th><th>Package</th><th className="text-right">Qty Allocated</th><th className="text-right">Unit Price</th><th className="text-right">Value</th></tr></thead>
              <tbody>
                {projInventory.map((inv, i) => (
                  <tr key={i} className={inv.isNew ? "bg-secondary-green/30" : ""}>
                    <td><span className={`text-xs font-medium px-2 py-0.5 rounded ${inv.section === "FOOD" ? "bg-secondary-green text-primary-green" : "bg-gray-50 text-gray-500"}`}>{inv.section}</span></td>
                    <td className="font-medium text-sm">{inv.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{inv.productName}</td>
                    <td className="text-sm text-gray-500">{inv.prdCat}</td>
                    <td className="text-sm text-gray-400">{inv.storage || "—"}</td>
                    <td className="text-sm">{inv.package}</td>
                    <td className="text-right font-mono text-sm">{inv.qty}</td>
                    <td className="text-right font-mono text-sm">{inv.price.toFixed(2)}</td>
                    <td className="text-right font-mono text-sm font-semibold">{inv.inventoryValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="bg-gray-50"><td colSpan={7} className="text-right text-xs font-medium text-gray-400">Total</td><td className="text-right font-mono font-semibold text-sm">{projInvValue.toFixed(2)}</td></tr></tfoot>
            </table>
          </div>
        )}

        {tab === "financials" && (
          <div className="overflow-x-auto">
            <table className="cv-table"><thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead>
              <tbody>
                {projLedger.map((e, i) => (
                  <tr key={i} className={e.isNew ? "bg-secondary-green/30" : ""}>
                    <td className="whitespace-nowrap text-sm">{e.date}</td>
                    <td><span className="font-mono text-xs px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{e.ref}</span></td>
                    <td className="font-medium text-sm">{e.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{e.account}</td>
                    <td className="text-sm text-gray-500">{e.description}</td>
                    <td className="text-right font-mono text-sm">{e.debit != null ? e.debit.toFixed(2) : ""}</td>
                    <td className="text-right font-mono text-sm">{e.credit != null ? e.credit.toFixed(2) : ""}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="bg-gray-50"><td colSpan={4} className="text-right text-xs font-medium text-gray-400">Totals</td><td className="text-right font-mono font-semibold text-sm">{projDebit.toFixed(2)}</td><td className="text-right font-mono font-semibold text-sm">{projCredit.toFixed(2)}</td></tr></tfoot>
            </table>
          </div>
        )}
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
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <TableToolbar placeholder="Search documents..." count={`${docs.length} documents`} />
        <table className="cv-table"><thead><tr><th>Document</th><th>Type</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {docs.map((d, i) => (
              <tr key={i} className={d.isNew ? "bg-secondary-green/30" : ""}>
                <td className="font-medium text-sm"><div className="flex items-center gap-2"><IoDocumentTextOutline className="w-4 h-4 text-gray-400" />{d.isNew && <span className="w-1.5 h-1.5 rounded-full bg-primary-green" />}{d.name}</div></td>
                <td className="text-sm text-gray-500">{d.type}</td>
                <td className="text-sm text-gray-500">{d.date}</td>
                <td><span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary-green text-primary-green">{d.status}</span></td>
                <td className="text-right"><IoDownloadOutline className="w-4 h-4 text-gray-400 hover:text-black cursor-pointer" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Shared Components ──────────────────────────────────────────────────
function StatCard({ label, value, green }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-border">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className={`text-lg font-semibold mt-1 ${green ? "text-primary-green" : "text-black"}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    active: "bg-green-50 text-green-700 border-green-200",
    planned: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${styles[status] || styles.planned}`}>{status}</span>;
}

function TableToolbar({ placeholder, count }) {
  return (
    <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400"><IoSearchOutline className="w-4 h-4" />{placeholder}</div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400 hover:border-gray-300"><IoFilterOutline className="w-4 h-4" />Filter</button>
      </div>
      <span className="text-xs text-gray-400">{count}</span>
    </div>
  );
}
