
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { Invoice, Payment, VipClient, VipTransaction } from '../types';
import { COMPANY_INFO } from '../constants';
import { PrintIcon, MailIcon, PencilIcon, TrashIcon, PlusIcon, DocumentTextIcon, DotsVerticalIcon } from './lib/Icons';

type AccountsViewProps = {
    onBack: () => void;
    invoices: Invoice[];
    payments: Payment[];
    vipClients: VipClient[];
    transactions: VipTransaction[];
    onAddPayment: (payment: Payment) => void;
    onAddVipClient: (client: VipClient) => Promise<VipClient>;
    onUpdateVipClient: (client: VipClient) => Promise<VipClient>;
    onDeleteVipClient: (clientId: string) => Promise<boolean>;
};

const getStatusClass = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return 'bg-green-100 text-green-800';
        case 'Pending Payment': return 'bg-yellow-100 text-yellow-800';
        case 'Overdue': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800'
    }
};

const AccountsDashboard: React.FC<{invoices: Invoice[]}> = ({ invoices }) => {
    const { t, formatCurrency } = useI18n();

    const stats = useMemo(() => {
        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
        const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
        const totalDue = totalSales - totalPaid;
        const bestClient = invoices.length > 0 ? invoices.reduce((acc, inv) => {
            acc[inv.customerName] = (acc[inv.customerName] || 0) + inv.total;
            return acc;
        }, {} as {[key: string]: number}) : {};
        
        const topClientName = Object.keys(bestClient).sort((a,b) => bestClient[b] - bestClient[a])[0] || 'N/A';
        
        return { totalSales, totalPaid, totalDue, topClientName };
    }, [invoices]);

    return (
        <div>
            <h3 className="text-2xl font-black text-black mb-6">{t('dashboard.accounts.summary')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div className="bg-blue-50 p-6 rounded-lg shadow"><h4 className="font-black text-blue-800">{t('dashboard.accounts.totalSales')}</h4><p className="text-3xl font-black text-blue-600 mt-2">{formatCurrency(stats.totalSales)}</p></div>
                <div className="bg-green-50 p-6 rounded-lg shadow"><h4 className="font-black text-green-800">{t('dashboard.accounts.totalPaid')}</h4><p className="text-3xl font-black text-green-600 mt-2">{formatCurrency(stats.totalPaid)}</p></div>
                <div className="bg-yellow-50 p-6 rounded-lg shadow"><h4 className="font-black text-yellow-800">{t('dashboard.accounts.totalDue')}</h4><p className="text-3xl font-black text-yellow-600 mt-2">{formatCurrency(stats.totalDue)}</p></div>
                <div className="bg-purple-50 p-6 rounded-lg shadow"><h4 className="font-black text-purple-800">{t('dashboard.accounts.topClient')}</h4><p className="text-2xl font-black text-purple-600 mt-2 truncate">{stats.topClientName}</p></div>
            </div>
        </div>
    );
};

const InvoiceList: React.FC<{invoices: Invoice[], onSelect: (inv: Invoice) => void}> = ({ invoices, onSelect }) => {
    const { t, language, formatCurrency } = useI18n();
    return (
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
             <h3 className="text-2xl font-black text-black mb-4 p-2">{t('dashboard.accounts.invoices.title')}</h3>
             <table className="w-full text-right text-black">
                <thead className="border-b"><tr><th className="p-3 text-start font-black">{t('dashboard.accounts.invoices.id')}</th><th className="p-3 text-start font-black">{t('dashboard.accounts.invoices.client')}</th><th className="p-3 font-black">{t('dashboard.accounts.invoices.date')}</th><th className="p-3 font-black">{t('dashboard.accounts.invoices.total')}</th><th className="p-3 font-black">{t('dashboard.accounts.invoices.status')}</th><th className="p-3 text-center font-black">{t('dashboard.accounts.invoices.actions')}</th></tr></thead>
                <tbody>
                    {invoices.map(inv => (
                        <tr key={inv.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-extrabold">{inv.id}</td>
                            <td className="p-3 font-bold">{inv.customerName}</td>
                            <td className="p-3 font-bold">{inv.date}</td>
                            <td className="p-3 font-extrabold">{formatCurrency(inv.total)}</td>
                            <td className="p-3"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusClass(inv.status)}`}>{language === 'ar' ? inv.status_ar : inv.status}</span></td>
                            <td className="p-3 text-center"><button onClick={() => onSelect(inv)} className="text-primary hover:underline font-bold">{t('vip.dashboard.view')}</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PaymentList: React.FC<{payments: Payment[], invoices: Invoice[]}> = ({ payments, invoices }) => {
    const { t, language, formatCurrency } = useI18n();
    const paymentsWithClient = payments.map(p => {
        const invoice = invoices.find(inv => inv.id === p.invoiceId);
        return { ...p, customerName: invoice?.customerName || 'N/A' };
    });

    return (
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
             <h3 className="text-2xl font-black text-black mb-4 p-2">{t('dashboard.accounts.payments.title')}</h3>
             <table className="w-full text-right text-black">
                <thead className="border-b"><tr><th className="p-3 text-start font-black">{t('dashboard.accounts.payments.table.id')}</th><th className="p-3 text-start font-black">{t('dashboard.accounts.payments.table.invoiceId')}</th><th className="p-3 text-start font-black">{t('dashboard.accounts.payments.table.client')}</th><th className="p-3 font-black">{t('dashboard.accounts.payments.table.date')}</th><th className="p-3 font-black">{t('dashboard.accounts.payments.table.amount')}</th><th className="p-3 font-black">{t('dashboard.accounts.payments.table.method')}</th></tr></thead>
                <tbody>
                    {paymentsWithClient.map(p => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-extrabold">{p.id}</td>
                            <td className="p-3 font-bold">{p.invoiceId}</td>
                            <td className="p-3 font-bold">{p.customerName}</td>
                            <td className="p-3 font-bold">{p.date}</td>
                            <td className="p-3 font-extrabold">{formatCurrency(p.amount)}</td>
                            <td className="p-3 font-bold">{language === 'ar' ? p.method_ar : p.method}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const ClientFormModal: React.FC<{
  isOpen: boolean; onClose: () => void; onSubmit: (client: VipClient) => void; client?: VipClient | null;
}> = ({ isOpen, onClose, onSubmit, client }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<Partial<VipClient>>({});
  const [errors, setErrors] = useState<{ shippingAddress?: string }>({});
  
  useEffect(() => {
    setFormData(client || { id: '', phone: '', companyName: '', contactPerson: '', shippingAddress: '' });
    setErrors({});
  }, [client, isOpen]);
  
  if (!isOpen) return null;
  
  const validateAddress = (address: string): string | undefined => {
    if (!address || address.trim().length === 0) {
        return t('dashboard.accounts.clients.form.addressRequired');
    }
    if (address.trim().length < 10) {
        return t('dashboard.accounts.clients.form.addressMinLength');
    }
    const validAddressRegex = /^[a-zA-Z0-9\s,.\-ء-ي#]+$/;
    if (!validAddressRegex.test(address)) {
        return t('dashboard.accounts.clients.form.addressInvalidChars');
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'shippingAddress') {
        const error = validateAddress(value);
        setErrors(prev => ({ ...prev, shippingAddress: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addressError = validateAddress(formData.shippingAddress || '');
    if (addressError) {
        setErrors({ shippingAddress: addressError });
        return;
    }
    const clientData = { ...formData, id: formData.phone } as VipClient;
    onSubmit(clientData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <h2 className="text-2xl font-black text-primary mb-4">{client ? t('dashboard.accounts.clients.editTitle') : t('dashboard.accounts.clients.addTitle')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <input name="companyName" value={formData.companyName || ''} onChange={handleChange} placeholder={t('dashboard.accounts.clients.form.companyName')} required className="p-3 border rounded w-full font-semibold" />
            <input name="phone" value={formData.phone || ''} onChange={handleChange} placeholder={t('dashboard.accounts.clients.form.phone')} required className="p-3 border rounded w-full font-semibold" type="tel" />
            <input name="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} placeholder={t('dashboard.accounts.clients.form.contactPerson')} required className="p-3 border rounded w-full font-semibold" />
            <div>
              <textarea name="shippingAddress" value={formData.shippingAddress || ''} onChange={handleChange} placeholder={t('dashboard.accounts.clients.form.shippingAddress')} required className="p-3 border rounded w-full font-semibold" rows={2}></textarea>
              {errors.shippingAddress && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>}
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 text-black py-2 px-4 rounded font-bold">{t('dashboard.products.cancel')}</button>
              <button type="submit" disabled={!!errors.shippingAddress} className="bg-primary text-white py-2 px-4 rounded font-bold disabled:bg-gray-400 disabled:cursor-not-allowed">{t('dashboard.products.save')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ClientTransactionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  client: VipClient | null;
  transactions: VipTransaction[];
}> = ({ isOpen, onClose, client, transactions }) => {
  const { t, language, formatCurrency } = useI18n();

  const clientTransactions = useMemo(() => {
    if (!client) return [];
    return transactions
      .filter(tx => tx.clientId === client.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [client, transactions]);

  const handlePrint = () => {
      window.print();
  };

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center p-4 print:p-0 print:bg-white">
      <style>{`
        @media print { 
            .no-print { display: none !important; } 
            .printable-area { padding: 0 !important; box-shadow: none !important; width: 100% !important; max-width: none !important; } 
            body > * { display: none; } 
            #root, #root > div, .printable-area, .printable-area * { display: block !important; }
            .modal-container { position: static !important; width: 100% !important; height: auto !important; overflow: visible !important; }
        }
      `}</style>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto modal-container printable-area">
        <div className="p-8">
          {/* Print Header with Logo */}
          <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
              <div className="flex justify-between items-center">
                   <div>
                       <h1 className="text-2xl font-bold">{COMPANY_INFO.name}</h1>
                       <p className="text-sm">{language === 'ar' ? COMPANY_INFO.address : COMPANY_INFO.address_en}</p>
                       <p className="text-sm">{COMPANY_INFO.phone} | {COMPANY_INFO.email}</p>
                   </div>
                   <img src="https://lh3.googleusercontent.com/d/1-0qvsPmpVVnWdGJHrlJ4rbtecG-i5n4l" alt="Logo" className="w-20 h-20 object-contain"/>
              </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-black text-primary print:text-black">{t('dashboard.accounts.clients.transactionsTitle')}</h2>
                <p className="text-lg font-bold mt-1">{client.companyName} <span className="text-sm font-normal">({client.contactPerson})</span></p>
                <p className="text-sm text-gray-600 font-bold" dir="ltr">{client.phone}</p>
            </div>
            <div className="no-print flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700"><PrintIcon /> {t('vip.dashboard.print')}</button>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl font-bold">&times;</button>
            </div>
          </div>

          {/* Bank Info for Print */}
          <div className="hidden print:block mb-6 bg-gray-100 p-4 rounded border border-gray-300">
               <h3 className="font-bold mb-2 border-b border-gray-400 pb-1">Bank Account Details</h3>
               <div className="grid grid-cols-2 gap-4 text-sm">
                   <p><strong>Bank:</strong> {language === 'ar' ? COMPANY_INFO.bank.name : COMPANY_INFO.bank.name_en}</p>
                   <p><strong>Account Name:</strong> {language === 'ar' ? COMPANY_INFO.bank.account_name : COMPANY_INFO.bank.account_name_en}</p>
                   <p><strong>Account Number:</strong> {COMPANY_INFO.bank.account_number}</p>
                   <p><strong>IBAN:</strong> {COMPANY_INFO.bank.iban}</p>
               </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-black border-collapse border border-gray-200">
              <thead className="border-b bg-gray-50 print:bg-gray-200">
                <tr>
                  <th className="p-3 text-start font-black border">{t('vip.dashboard.financials.date')}</th>
                  <th className="p-3 text-start font-black border">{t('vip.dashboard.financials.description')}</th>
                  <th className="p-3 font-black border">{t('vip.dashboard.financials.debit')}</th>
                  <th className="p-3 font-black border">{t('vip.dashboard.financials.credit')}</th>
                  <th className="p-3 font-black border">{t('vip.dashboard.financials.balance')}</th>
                </tr>
              </thead>
              <tbody>
                {clientTransactions.length > 0 ? (
                  clientTransactions.map(tx => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50 print:hover:bg-transparent">
                      <td className="p-3 font-bold border">{tx.date}</td>
                      <td className="p-3 font-extrabold border">{language === 'ar' ? tx.description_ar : tx.description_en}</td>
                      <td className="p-3 text-red-600 font-bold border">{tx.debit > 0 ? formatCurrency(tx.debit) : '-'}</td>
                      <td className="p-3 text-green-600 font-bold border">{tx.credit > 0 ? formatCurrency(tx.credit) : '-'}</td>
                      <td className={`p-3 font-black border ${tx.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(tx.balance)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500 font-semibold border">
                      {t('dashboard.accounts.clients.noTransactions')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
           {/* Print Footer */}
           <div className="hidden print:block mt-12 text-center text-xs text-gray-500 border-t pt-4">
                <p>This document is system generated by Delta Stars Trading Platform.</p>
                <p>Date Printed: {new Date().toLocaleDateString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const ClientActionsDropdown: React.FC<{
    client: VipClient;
    onViewTransactions: (client: VipClient) => void;
    onEdit: (client: VipClient) => void;
    onDelete: (clientId: string) => void;
}> = ({ client, onViewTransactions, onEdit, onDelete }) => {
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <DotsVerticalIcon />
            </button>
            {isOpen && (
                <div className="absolute z-10 start-0 mt-2 w-56 bg-white rounded-md shadow-lg border">
                    <button onClick={() => handleAction(() => onViewTransactions(client))} className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-semibold">
                        <DocumentTextIcon /> {t('dashboard.accounts.clients.viewTransactions')}
                    </button>
                    <button onClick={() => handleAction(() => onEdit(client))} className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-semibold">
                        <PencilIcon /> {t('dashboard.accounts.clients.editTitle')}
                    </button>
                    <div className="border-t my-1"></div>
                    <button onClick={() => handleAction(() => onDelete(client.id))} className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold">
                        <TrashIcon /> {t('dashboard.accounts.clients.deleteClient')}
                    </button>
                </div>
            )}
        </div>
    );
};


const ClientList: React.FC<{
  clients: VipClient[]; transactions: VipTransaction[]; onAdd: (client: VipClient) => Promise<VipClient>; onUpdate: (client: VipClient) => Promise<VipClient>; onDelete: (clientId: string) => Promise<boolean>;
}> = ({ clients, transactions, onAdd, onUpdate, onDelete }) => {
    const { t } = useI18n();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<VipClient | null>(null);
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [selectedClientForTx, setSelectedClientForTx] = useState<VipClient | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredClients = useMemo(() => {
        return clients.filter(c => 
            c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.phone.includes(searchTerm)
        );
    }, [clients, searchTerm]);
    
    const handleOpenModal = (client?: VipClient) => {
        setEditingClient(client || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingClient(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (clientData: VipClient) => {
        if (editingClient) {
            await onUpdate(clientData);
        } else {
            await onAdd(clientData);
        }
        handleCloseModal();
    };

    const handleDelete = (clientId: string) => {
        if(window.confirm(t('dashboard.accounts.clients.confirmDelete'))) {
            onDelete(clientId);
        }
    };
    
    const handleViewTransactions = (client: VipClient) => {
        setSelectedClientForTx(client);
        setIsTxModalOpen(true);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <ClientFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} client={editingClient} />
            <ClientTransactionsModal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} client={selectedClientForTx} transactions={transactions} />
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h3 className="text-2xl font-black text-black p-2">{t('dashboard.accounts.clients.title')}</h3>
                <div className="flex-grow max-w-sm"><input type="text" placeholder={t('dashboard.accounts.clients.searchPlaceholder')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 border rounded font-semibold"/></div>
                <button onClick={() => handleOpenModal()} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-light flex items-center gap-2"><PlusIcon /> {t('dashboard.accounts.clients.addNew')}</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-right text-black">
                    <thead className="border-b"><tr>
                        <th className="p-3 text-start font-black">{t('dashboard.accounts.clients.table.companyName')}</th>
                        <th className="p-3 text-start font-black">{t('dashboard.accounts.clients.table.phone')}</th>
                        <th className="p-3 text-start font-black">{t('dashboard.accounts.clients.table.contactPerson')}</th>
                        <th className="p-3 text-center font-black">{t('dashboard.accounts.clients.table.actions')}</th>
                    </tr></thead>
                    <tbody>
                        {filteredClients.map(client => (
                            <tr key={client.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-extrabold">{client.companyName}</td>
                                <td className="p-3 font-bold" dir="ltr">{client.phone}</td>
                                <td className="p-3 font-bold">{client.contactPerson}</td>
                                <td className="p-3">
                                    <div className="flex justify-center items-center">
                                       <ClientActionsDropdown client={client} onViewTransactions={handleViewTransactions} onEdit={handleOpenModal} onDelete={handleDelete} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredClients.length === 0 && <p className="text-center p-8 text-gray-500 font-semibold">{t('dashboard.accounts.clients.noResults')}</p>}
            </div>
        </div>
    );
};

const InvoiceDetailModal: React.FC<{ invoice: Invoice, onClose: () => void }> = ({ invoice, onClose }) => {
    const { t, language, formatCurrency } = useI18n();
    const printAreaRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 print:p-0 print:bg-white">
            <style>{`
                @media print { .no-print { display: none !important; } .printable-area { padding: 0 !important; width: 100% !important; } body > * { display: none; } #root, #root > div, .printable-area, .printable-area * { display: block !important; } }
            `}</style>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-h-full">
                <div className="p-8 relative printable-area" ref={printAreaRef}>
                    <div className="no-print absolute top-4 end-4 flex gap-2">
                       <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl font-bold">&times;</button>
                    </div>
                    <div className="flex justify-between items-start mb-8 border-b pb-4">
                        <div>
                            <h2 className="text-3xl font-black text-primary">{t('dashboard.accounts.invoices.invoice')}</h2>
                            <p className="text-black font-extrabold">#{invoice.id}</p>
                        </div>
                        <div className="text-left">
                            <h3 className="font-black text-lg text-black">{COMPANY_INFO.name}</h3>
                            <p className="text-sm text-black font-bold">{language === 'ar' ? COMPANY_INFO.address : COMPANY_INFO.address_en}</p>
                            <p className="text-sm text-black font-bold">{COMPANY_INFO.email}</p>
                            <p className="text-sm text-black font-bold">{COMPANY_INFO.phone}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mb-8 text-black font-bold">
                        <div>
                            <h4 className="font-black text-gray-500 mb-1">{t('dashboard.accounts.invoices.billTo')}</h4>
                            <p className="font-black">{invoice.customerName}</p>
                            <p>{invoice.clientId}</p>
                        </div>
                        <div className="text-left">
                            <p><strong>{t('dashboard.accounts.invoices.date')}:</strong> {invoice.date}</p>
                            <p><strong>{t('dashboard.accounts.invoices.dueDate')}:</strong> {invoice.dueDate}</p>
                        </div>
                    </div>

                    <table className="w-full text-right mb-8 text-black border-collapse border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 font-black text-start border">{t('dashboard.accounts.invoices.item')}</th>
                                <th className="p-3 font-black border">{t('dashboard.accounts.invoices.qty')}</th>
                                <th className="p-3 font-black border">{t('dashboard.accounts.invoices.price')}</th>
                                <th className="p-3 font-black text-end border">{t('dashboard.accounts.invoices.total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map(item => (
                                <tr key={item.productId} className="border-b">
                                    <td className="p-3 font-bold text-start border">{language === 'ar' ? item.name_ar : item.name_en}</td>
                                    <td className="p-3 font-bold border">{item.quantity}</td>
                                    <td className="p-3 font-bold border">{formatCurrency(item.price)}</td>
                                    <td className="p-3 font-bold text-end border">{formatCurrency(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                     <div className="flex justify-end mb-8">
                        <div className="w-full max-w-xs space-y-2 text-black font-bold">
                           <div className="flex justify-between"><span className="text-gray-600">{t('dashboard.accounts.invoices.subtotal')}:</span><span>{formatCurrency(invoice.subtotal)}</span></div>
                           <div className="flex justify-between"><span className="text-gray-600">{t('dashboard.accounts.invoices.shipping')}:</span><span>{formatCurrency(invoice.shipping)}</span></div>
                           <div className="flex justify-between"><span className="text-gray-600">{t('dashboard.accounts.invoices.tax')} (15%):</span><span>{formatCurrency(invoice.tax)}</span></div>
                           <div className="flex justify-between border-t pt-2 mt-2 font-black text-xl"><span className="text-black">{t('dashboard.accounts.invoices.total')}:</span><span className="text-primary">{formatCurrency(invoice.total)}</span></div>
                        </div>
                    </div>
                    
                    <div className="border-t pt-4 text-black">
                        <h4 className="font-black mb-2">{t('dashboard.accounts.invoices.paymentInstructions')}</h4>
                        <p className="text-sm font-bold">{t('cart.checkout.transferDesc1')} {formatCurrency(invoice.total)} {t('cart.checkout.transferDesc2')}</p>
                        <div className="text-sm bg-gray-50 p-3 rounded-md mt-2 font-bold">
                            <p><strong>{t('cart.checkout.bankName')}:</strong> {language === 'ar' ? COMPANY_INFO.bank.name : COMPANY_INFO.bank.name_en}</p>
                            <p><strong>{t('cart.checkout.beneficiary')}:</strong> {language === 'ar' ? COMPANY_INFO.bank.account_name : COMPANY_INFO.bank.account_name_en}</p>
                            <p><strong>{t('cart.checkout.accountNumber')}:</strong> {COMPANY_INFO.bank.account_number}</p>
                            <p><strong>{t('cart.checkout.iban')}:</strong> {COMPANY_INFO.bank.iban}</p>
                        </div>
                    </div>

                     <div className="mt-8 flex justify-end gap-3 no-print">
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700"><PrintIcon /> {t('vip.dashboard.print')}</button>
                     </div>
                </div>
            </div>
        </div>
    );
};

const PaymentFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payment: Payment) => void;
    invoices: Invoice[];
}> = ({ isOpen, onClose, onSubmit, invoices }) => {
    const { t, formatCurrency } = useI18n();
    const [formData, setFormData] = useState<Partial<Payment>>({
        date: new Date().toISOString().split('T')[0],
        method: 'Bank Transfer'
    });

    useEffect(() => {
        if (isOpen) {
             setFormData({
                date: new Date().toISOString().split('T')[0],
                method: 'Bank Transfer'
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.invoiceId || !formData.amount) {
            alert("Please fill all fields.");
            return;
        }
        const selectedInvoice = invoices.find(inv => inv.id === formData.invoiceId);
        const newPayment: Payment = {
            ...formData,
            id: `PAY-${Date.now()}`,
            clientId: selectedInvoice?.clientId || '',
            status: 'Confirmed'
        } as Payment;
        onSubmit(newPayment);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isAmount = name === 'amount';
        setFormData(prev => ({ ...prev, [name]: isAmount ? parseFloat(value) : value }));
    };
    
    const handleInvoiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const invoiceId = e.target.value;
        const invoice = invoices.find(inv => inv.id === invoiceId);
        if (invoice) {
            setFormData(prev => ({
                ...prev,
                invoiceId: invoice.id,
                amount: invoice.total
            }));
        }
    };

    const unpaidInvoices = invoices.filter(inv => inv.status !== 'Paid');

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
             <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                 <div className="p-6">
                    <h2 className="text-2xl font-black text-primary mb-4">{t('dashboard.accounts.payments.recordTitle')}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 text-black font-extrabold">
                        <div>
                            <label className="block mb-1 font-extrabold">{t('dashboard.accounts.payments.invoiceId')}</label>
                            <select name="invoiceId" onChange={handleInvoiceSelect} value={formData.invoiceId || ''} className="w-full p-3 border rounded bg-white" required>
                                <option value="" disabled>{t('dashboard.accounts.payments.selectInvoice')}</option>
                                {unpaidInvoices.map(inv => (
                                    <option key={inv.id} value={inv.id}>{inv.id} - {inv.customerName} ({formatCurrency(inv.total)})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                             <label className="block mb-1 font-extrabold">{t('dashboard.accounts.payments.paymentDate')}</label>
                             <input type="date" name="date" value={formData.date || ''} onChange={handleChange} className="w-full p-3 border rounded" required />
                        </div>
                        <div>
                            <label className="block mb-1 font-extrabold">{t('dashboard.accounts.payments.amount')}</label>
                            <input type="number" step="0.01" name="amount" value={formData.amount || ''} onChange={handleChange} className="w-full p-3 border rounded" required />
                        </div>
                        <div>
                            <label className="block mb-1 font-extrabold">{t('dashboard.accounts.payments.method')}</label>
                            <select name="method" value={formData.method || ''} onChange={handleChange} className="w-full p-3 border rounded bg-white">
                                <option value="Bank Transfer">{t('dashboard.accounts.payments.methods.Bank Transfer')}</option>
                                <option value="Cash">{t('dashboard.accounts.payments.methods.Cash')}</option>
                                <option value="Card">{t('dashboard.accounts.payments.methods.Card')}</option>
                                <option value="Unknown">{t('dashboard.accounts.payments.methods.Unknown')}</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-black py-2 px-4 rounded font-bold">{t('dashboard.products.cancel')}</button>
                            <button type="submit" className="bg-primary text-white py-2 px-4 rounded font-bold">{t('dashboard.accounts.payments.confirm')}</button>
                        </div>
                    </form>
                 </div>
             </div>
         </div>
    );
};

export const AccountsView: React.FC<AccountsViewProps> = ({
    onBack, invoices, payments, vipClients, transactions, onAddPayment, onAddVipClient, onUpdateVipClient, onDeleteVipClient
}) => {
    const { t } = useI18n();
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    return (
        <div>
            {selectedInvoice && <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
            <PaymentFormModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onSubmit={onAddPayment} invoices={invoices} />
            <button onClick={onBack} className="mb-4 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">&larr; {t('dashboard.back')}</button>
            <h2 className="text-3xl font-black text-primary mb-6">{t('dashboard.accounts.title')}</h2>
            
            <div className="space-y-8">
                <AccountsDashboard invoices={invoices} />
                <div className="flex justify-end">
                    <button onClick={() => setIsPaymentModalOpen(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-light flex items-center gap-2">
                        <PlusIcon /> {t('dashboard.accounts.payments.recordNew')}
                    </button>
                </div>
                <InvoiceList invoices={invoices} onSelect={setSelectedInvoice} />
                <PaymentList payments={payments} invoices={invoices} />
                <ClientList 
                    clients={vipClients}
                    transactions={transactions}
                    onAdd={onAddVipClient}
                    onUpdate={onUpdateVipClient}
                    onDelete={onDeleteVipClient}
                />
            </div>
        </div>
    );
};
