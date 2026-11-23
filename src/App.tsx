import React, { useState, useEffect } from 'react';
import { Client, CollectionRecord, EditRequest, UserRole } from './types/isp';
import {
  getClients,
  saveClients,
  getCollections,
  saveCollections,
  getEditRequests,
  saveEditRequests,
  getCurrentMonth,
  advanceToNextMonth,
  resetToDemoData,
  INITIAL_COLLECTORS,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Sidebar, AppTab } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { ExcelSheetView } from './components/ExcelSheetView';
import { CollectorPortal } from './components/CollectorPortal';
import { MonthlyCollectionPrint } from './components/MonthlyCollectionPrint';
import { ClientPortal } from './components/ClientPortal';
import { PaymentReceiptModal } from './components/PaymentReceiptModal';
import { ClientFormModal } from './components/ClientFormModal';
import { ClientKycModal } from './components/ClientKycModal';
import { EditRequestModal } from './components/EditRequestModal';
import { GoogleAppsScriptModal } from './components/GoogleAppsScriptModal';
import { CheckCircle2, Phone, Wifi } from 'lucide-react';

export default function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [editRequests, setEditRequests] = useState<EditRequest[]>([]);
  const [currentMonth, setMonth] = useState<string>('নভেম্বর ২০২৬');

  // Navigation & Role states
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard');
  const [currentCollectorId, setCurrentCollectorId] = useState<'C1' | 'C2'>('C1');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [receiptModalData, setReceiptModalData] = useState<CollectionRecord | null>(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [kycClient, setKycClient] = useState<Client | null>(null);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [editRequestModalData, setEditRequestModalData] = useState<{
    receipt: CollectionRecord;
    request?: EditRequest;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    setClients(getClients());
    setCollections(getCollections());
    setEditRequests(getEditRequests());
    setMonth(getCurrentMonth());
  }, []);

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'collector_1') {
      setCurrentCollectorId('C1');
      setCurrentTab('collector');
    } else if (role === 'collector_2') {
      setCurrentCollectorId('C2');
      setCurrentTab('collector');
    } else if (role === 'client') {
      setCurrentTab('client_portal');
    } else if (role === 'admin') {
      setCurrentTab('dashboard');
    }
  };

  const handleSwitchCollector = (id: 'C1' | 'C2') => {
    setCurrentCollectorId(id);
    setCurrentRole(id === 'C1' ? 'collector_1' : 'collector_2');
    showToast(`সক্রিয় কালেক্টর: ${id === 'C1' ? 'Collector-1 (জামাল আহমেদ)' : 'Collector-2 (কামাল হোসেন)'}`);
  };

  const handleUpdateClient = (updated: Client) => {
    const updatedList = clients.map((c) => (c.id === updated.id ? updated : c));
    setClients(updatedList);
    saveClients(updatedList);
    showToast(`${updated.clientName}-এর তথ্য হালনাগাদ করা হয়েছে।`);
  };

  const handleToggleClientStatus = (client: Client) => {
    const newStatus = client.status === 'active' ? 'inactive' : 'active';
    const updated: Client = {
      ...client,
      status: newStatus,
      currentMonthBill: newStatus === 'active' ? client.monthlyFee : 0,
    };
    handleUpdateClient(updated);
  };

  const handleSaveClientModal = (clientToSave: Client) => {
    let updatedList: Client[];
    const exists = clients.some((c) => c.id === clientToSave.id);

    if (exists) {
      updatedList = clients.map((c) => (c.id === clientToSave.id ? clientToSave : c));
      showToast(`ক্লায়েন্ট ${clientToSave.clientName} আপডেট সম্পন্ন।`);
    } else {
      updatedList = [clientToSave, ...clients];
      showToast(`নতুন ক্লায়েন্ট ${clientToSave.clientName} যুক্ত হয়েছে।`);
    }

    setClients(updatedList);
    saveClients(updatedList);
    setIsAddClientModalOpen(false);
    setEditingClient(null);
  };

  const handleCollectionSuccess = (receipt: CollectionRecord) => {
    setCollections(getCollections());
    setClients(getClients());
    setReceiptModalData(receipt);
    showToast(`রশিদ #${receipt.id} প্রস্তুত হয়েছে।`);
  };

  const handleSubmitEditRequest = (data: Omit<EditRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newReq: EditRequest = {
      ...data,
      id: `REQ-${Date.now().toString().slice(-4)}`,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    const updated = [newReq, ...editRequests];
    setEditRequests(updated);
    saveEditRequests(updated);
    showToast('অ্যাডমিনের নিকট এডিট রিকোয়েস্ট পাঠানো হয়েছে।');
  };

  const handleApproveRejectEditRequest = (
    requestId: string,
    newStatus: 'approved' | 'rejected',
    newAmount?: number
  ) => {
    const reqIndex = editRequests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) return;

    const req = editRequests[reqIndex];
    req.status = newStatus;
    req.reviewedAt = new Date().toISOString();

    if (newStatus === 'approved' && newAmount !== undefined) {
      req.requestedAmount = newAmount;

      const allCollections = getCollections();
      const colIndex = allCollections.findIndex((c) => c.id === req.receiptId);
      if (colIndex !== -1) {
        const diff = newAmount - allCollections[colIndex].amount;
        allCollections[colIndex].amount = newAmount;
        allCollections[colIndex].status = 'edited';
        saveCollections(allCollections);
        setCollections(allCollections);

        const allClients = getClients();
        const clientIndex = allClients.findIndex((c) => c.id === req.clientId);
        if (clientIndex !== -1) {
          allClients[clientIndex].paidThisMonth = (allClients[clientIndex].paidThisMonth || 0) + diff;
          saveClients(allClients);
          setClients(allClients);
        }
      }
      showToast(`অনুরোধ অনুমোদিত! নতুন পরিমাণ ৳${newAmount} সংরক্ষিত হয়েছে।`);
    } else {
      showToast('অনুরোধ প্রত্যাখ্যান করা হয়েছে।');
    }

    editRequests[reqIndex] = req;
    setEditRequests([...editRequests]);
    saveEditRequests(editRequests);
    setEditRequestModalData(null);
  };

  const handleAdvanceMonth = () => {
    const nextMonthName = currentMonth === 'নভেম্বর ২০২৬' ? 'ডিসেম্বর ২০২৬' : 'জানুয়ারি ২০২৭';
    const confirmMsg = `আপনি কি "${currentMonth}" থেকে "${nextMonthName}"-এ যেতে চান?\n\nযেসব ক্লায়েন্টের স্ট্যাটাস "ON" কিন্তু বিল পরিশোধ করেননি, তাদের বকেয়া স্বয়ংক্রিয়ভাবে পূর্বের বকেয়ার সাথে যোগ হবে।`;

    if (window.confirm(confirmMsg)) {
      const { updatedCount } = advanceToNextMonth(nextMonthName);
      setClients(getClients());
      setMonth(nextMonthName);
      showToast(`${nextMonthName}-এ রোলওভার সম্পন্ন! ${updatedCount} জন ক্লায়েন্টের বকেয়া আপডেট হয়েছে।`);
    }
  };

  const handleResetData = () => {
    if (window.confirm('আপনি কি সকল ডেটা মূল ডেমো অবস্থায় ফিরিয়ে নিতে চান?')) {
      resetToDemoData();
      setClients(getClients());
      setCollections(getCollections());
      setEditRequests(getEditRequests());
      setMonth(getCurrentMonth());
      showToast('ডেমো ডেটা সফলভাবে রিস্টোর করা হয়েছে।');
    }
  };

  const currentCollector = INITIAL_COLLECTORS.find((c) => c.id === currentCollectorId) || INITIAL_COLLECTORS[0];
  const otherCollector = INITIAL_COLLECTORS.find((c) => c.id !== currentCollectorId) || INITIAL_COLLECTORS[1];
  const pendingCount = editRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#eef4fc] text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#092b6b] border border-sky-400 text-white text-xs font-bold shadow-2xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Royal Blue Banner Header */}
      <Navbar
        currentRole={currentRole}
        currentTab={currentTab}
        currentMonth={currentMonth}
        pendingRequestsCount={pendingCount}
        currentCollectorId={currentCollectorId}
        collectors={INITIAL_COLLECTORS}
        onSelectTab={setCurrentTab}
        onSelectRole={handleSelectRole}
        onSwitchCollector={handleSwitchCollector}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
      />

      {/* Body Wrapper: Left Deep Blue Sidebar + Main Content Canvas */}
      <div className="flex-1 flex min-h-0">
        <Sidebar
          currentRole={currentRole}
          currentTab={currentTab}
          pendingRequestsCount={pendingCount}
          currentCollectorId={currentCollectorId}
          collectors={INITIAL_COLLECTORS}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onSelectTab={setCurrentTab}
          onSelectRole={handleSelectRole}
          onSwitchCollector={handleSwitchCollector}
          onOpenGasModal={() => setIsGasModalOpen(true)}
          onAdvanceMonth={handleAdvanceMonth}
          onResetData={handleResetData}
        />

        <main className="flex-1 min-w-0 overflow-x-hidden pb-10">
          {currentTab === 'dashboard' && (
            <AdminDashboard
              clients={clients}
              collectors={INITIAL_COLLECTORS}
              collections={collections}
              editRequests={editRequests}
              currentMonth={currentMonth}
              onNavigateToExcel={() => setCurrentTab('excel')}
              onNavigateToPrint={() => setCurrentTab('print')}
              onNavigateToCollector={(cId) => {
                handleSwitchCollector(cId);
                setCurrentTab('collector');
              }}
              onOpenEditModal={(receipt, req) => {
                setEditRequestModalData({ receipt, request: req });
              }}
              onAdvanceMonth={handleAdvanceMonth}
              onResetData={handleResetData}
              onAddClient={() => {
                setEditingClient(null);
                setIsAddClientModalOpen(true);
              }}
              onEditClient={(client) => {
                setEditingClient(client);
                setIsAddClientModalOpen(true);
              }}
              onViewClientKYC={(client) => setKycClient(client)}
              onToggleClientStatus={handleToggleClientStatus}
              onViewReceipt={(receipt) => setReceiptModalData(receipt)}
              onOpenGasModal={() => setIsGasModalOpen(true)}
            />
          )}

          {currentTab === 'excel' && (
            <ExcelSheetView
              clients={clients}
              currentMonth={currentMonth}
              onUpdateClient={handleUpdateClient}
              onAddClient={() => {
                setEditingClient(null);
                setIsAddClientModalOpen(true);
              }}
              onEditClient={(client) => {
                setEditingClient(client);
                setIsAddClientModalOpen(true);
              }}
              onViewClientKYC={(client) => setKycClient(client)}
              onAdvanceMonth={handleAdvanceMonth}
            />
          )}

          {currentTab === 'collector' && (
            <CollectorPortal
              currentCollector={currentCollector}
              otherCollector={otherCollector}
              clients={clients}
              collections={collections}
              editRequests={editRequests}
              currentMonth={currentMonth}
              onCollectionSuccess={handleCollectionSuccess}
              onRequestEdit={(record) => {
                const existingReq = editRequests.find((r) => r.receiptId === record.id);
                setEditRequestModalData({ receipt: record, request: existingReq });
              }}
              onSwitchCollector={handleSwitchCollector}
            />
          )}

          {currentTab === 'print' && (
            <MonthlyCollectionPrint
              clients={clients}
              collectors={INITIAL_COLLECTORS}
              currentMonth={currentMonth}
              onBack={() => setCurrentTab('dashboard')}
            />
          )}

          {currentTab === 'client_portal' && (
            <ClientPortal
              clients={clients}
              collections={collections}
              currentMonth={currentMonth}
              onUpdateClient={handleUpdateClient}
              onViewReceipt={(receipt) => setReceiptModalData(receipt)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {receiptModalData && (
        <PaymentReceiptModal
          receipt={receiptModalData}
          client={clients.find((c) => c.id === receiptModalData.clientId)}
          onClose={() => setReceiptModalData(null)}
        />
      )}

      {isAddClientModalOpen && (
        <ClientFormModal
          client={editingClient}
          totalClientsCount={clients.length}
          onSave={handleSaveClientModal}
          onClose={() => {
            setIsAddClientModalOpen(false);
            setEditingClient(null);
          }}
        />
      )}

      {kycClient && (
        <ClientKycModal
          client={kycClient}
          onClose={() => setKycClient(null)}
          onEdit={() => {
            setEditingClient(kycClient);
            setKycClient(null);
            setIsAddClientModalOpen(true);
          }}
        />
      )}

      {editRequestModalData && (
        <EditRequestModal
          receipt={editRequestModalData.receipt}
          collectorName={currentCollector.name}
          collectorId={currentCollector.id}
          existingRequest={editRequestModalData.request}
          isAdmin={currentRole === 'admin'}
          onClose={() => setEditRequestModalData(null)}
          onSubmitRequest={handleSubmitEditRequest}
          onApproveReject={handleApproveRejectEditRequest}
        />
      )}

      {isGasModalOpen && <GoogleAppsScriptModal onClose={() => setIsGasModalOpen(false)} />}

      {/* Corporate Navy Footer */}
      <footer className="no-print mt-auto bg-[#06245c] text-white py-3 px-4 sm:px-6 border-t border-blue-900">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-sky-100">
            <Wifi className="w-4 h-4 text-sky-300" />
            <span>SCN – Shilok Cable Network | All Rights Reserved © 2026</span>
          </div>

          <div className="font-signature text-lg sm:text-xl text-amber-300 leading-none">
            Your Trusted ISP Partner • সবার জন্য ইন্টারনেট
          </div>

          <div className="flex items-center gap-2 font-bold text-sky-100">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hotline: 01815528967, 01819-876543</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
