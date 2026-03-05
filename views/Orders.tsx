
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '../hooks/useOrders';
import PageShell from '../components/PageShell';

const PIPELINE_FULL = [
  'ORDER CONFIRMED', 'AWAITING PAYMENT', 'PAYMENT ESCROWED', 'INSPECTION SCHEDULED',
  'INSPECTION PASSED', 'GOODS PACKED', 'GOODS SHIPPED', 'IN TRANSIT',
  'CUSTOMS CLEARANCE', 'ARRIVED AT DESTINATION', 'DELIVERED & CONFIRMED',
];

const MOCK_ORDERS = [
  { id: 'ORD-98221', crop: 'Yellow Maize', volume: '150 MT', status: 'IN TRANSIT', date: '2026-02-12', destination: 'Dubai, UAE', supplier: 'Mazaohub', price: 272, total: 40800, incoterm: 'CIF', vessel: 'MAERSK NAIROBI', container: 'MSKU-892341-0', eta: '2026-02-25' },
  { id: 'ORD-98215', crop: 'Cashew Nuts', volume: '80 MT', status: 'INSPECTION PASSED', date: '2026-02-15', destination: 'Hamburg, Germany', supplier: 'Coastal Exports', price: 1240, total: 99200, incoterm: 'FOB', vessel: 'MSC ILONA', container: 'MSCU-112233-4', eta: '2026-03-10' },
  { id: 'ORD-98204', crop: 'Long Grain Rice', volume: '200 MT', status: 'DELIVERED & CONFIRMED', date: '2026-02-01', destination: 'Mombasa, Kenya', supplier: 'Kilombero Agro', price: 480, total: 96000, incoterm: 'CIF', vessel: 'K-LINE HORIZON', container: 'KLUU-778899-1', eta: '2026-02-05' },
];

const Orders: React.FC = () => {
  const { orders: dbOrders, loading } = useOrders();
  const displayOrders = dbOrders.length > 0 ? dbOrders.map(o => ({
    id: o.id, crop: o.crop, volume: o.volume, status: o.status,
    date: o.created_at?.slice(0, 10), destination: o.destination,
    supplier: 'Verified Supplier', price: o.price,
    total: o.price * parseInt(o.volume), incoterm: o.incoterm,
    vessel: o.vessel || 'TBD', container: o.container || 'TBD', eta: o.eta || 'TBD',
  })) : MOCK_ORDERS;

  const [selectedId, setSelectedId] = useState(displayOrders[0]?.id);
  const selectedOrder = displayOrders.find(o => o.id === selectedId) || displayOrders[0];

  const getStatusIndex = (status: string) => {
    const idx = PIPELINE_FULL.findIndex(s => s === status);
    return idx >= 0 ? idx : 0;
  };

  const statusIndex = getStatusIndex(selectedOrder?.status || '');
  const progress = (statusIndex / (PIPELINE_FULL.length - 1)) * 100;

  return (
    <PageShell
      title="My Orders"
      subtitle={`${displayOrders.length} orders · Track shipments & logistics`}
      rightContent={
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-[9px] text-text-muted font-bold uppercase">Active</p>
            <p className="text-lg font-black text-primary">{displayOrders.filter(o => o.status !== 'DELIVERED & CONFIRMED').length}</p>
          </div>
          <div>
            <p className="text-[9px] text-text-muted font-bold uppercase">Done</p>
            <p className="text-lg font-black">{displayOrders.filter(o => o.status === 'DELIVERED & CONFIRMED').length}</p>
          </div>
        </div>
      }
    >
      {/* Mobile: order selector as horizontal scroll, then detail below */}
      {/* Desktop: side-by-side list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Order List */}
        <div className="lg:col-span-4">
          {/* Mobile: horizontal scroll */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 snap-x snap-mandatory scrollbar-hide">
            {displayOrders.map(order => {
              const isActive = order.id === selectedId;
              const isDone = order.status === 'DELIVERED & CONFIRMED';
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedId(order.id)}
                  className={`snap-start flex-shrink-0 w-[200px] p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive ? 'bg-surface border-primary/40' : 'bg-surface/50 border-border'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold truncate">{order.id}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${isDone ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                      {isDone ? '✓' : '...'}
                    </span>
                  </div>
                  <p className="text-xs font-bold mb-0.5 truncate">{order.crop}</p>
                  <p className="text-[9px] text-text-muted truncate">{order.volume} → {order.destination}</p>
                  <div className="mt-2 h-1 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(getStatusIndex(order.status) / (PIPELINE_FULL.length - 1)) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Desktop: vertical list */}
          <div className="hidden lg:block space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {displayOrders.map(order => {
              const isActive = order.id === selectedId;
              const isDone = order.status === 'DELIVERED & CONFIRMED';
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedId(order.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isActive ? 'bg-surface border-primary/40' : 'bg-surface/50 border-border hover:border-border-hover'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold">{order.id}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isDone ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                      {isDone ? 'DELIVERED' : 'IN PROGRESS'}
                    </span>
                  </div>
                  <p className="text-sm font-bold mb-1">{order.crop}</p>
                  <p className="text-[10px] text-text-muted">{order.volume} → {order.destination}</p>
                  <div className="mt-3 h-1 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${(getStatusIndex(order.status) / (PIPELINE_FULL.length - 1)) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Detail */}
        {selectedOrder && (
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-surface border border-border p-4 md:p-6 rounded-xl">
              <div className="flex flex-col md:flex-row justify-between gap-3 mb-4 pb-4 border-b border-border">
                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl font-black mb-0.5 truncate">{selectedOrder.crop}</h2>
                  <p className="text-[10px] text-text-muted truncate">{selectedOrder.id} · Placed {selectedOrder.date}</p>
                </div>
                <div className="md:text-right flex-shrink-0">
                  <p className="text-xl md:text-2xl font-black text-primary">${selectedOrder.total?.toLocaleString()}</p>
                  <p className="text-[9px] text-text-muted">{selectedOrder.incoterm} · {selectedOrder.volume}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Destination', value: selectedOrder.destination },
                  { label: 'Vessel', value: selectedOrder.vessel },
                  { label: 'Container', value: selectedOrder.container },
                  { label: 'ETA', value: selectedOrder.eta, highlight: true },
                ].map((f, i) => (
                  <div key={i}>
                    <p className="text-[8px] text-text-muted font-bold uppercase mb-0.5">{f.label}</p>
                    <p className={`text-[10px] md:text-xs font-bold truncate ${f.highlight ? 'text-primary' : ''}`}>{f.value}</p>
                  </div>
                ))}
              </div>

              {/* Pipeline */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Progress</h4>
                  <span className="text-[9px] font-bold text-primary truncate ml-2">{selectedOrder.status}</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden mb-3">
                  <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
                  {PIPELINE_FULL.map((step, i) => (
                    <div key={step} className={`flex items-center gap-1.5 text-[8px] font-semibold py-0.5 ${i <= statusIndex ? 'text-primary' : 'text-text-muted'}`}>
                      <span className={`w-2.5 h-2.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        i < statusIndex ? 'bg-primary border-primary' : i === statusIndex ? 'border-primary' : 'border-border'
                      }`}>
                        {i < statusIndex && <span className="text-background text-[6px]">✓</span>}
                      </span>
                      <span className="truncate">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost */}
              <div className="bg-background border border-border p-4 rounded-xl">
                <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-3">Cost Breakdown</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-text-muted">Unit Price</span><span className="font-bold">${selectedOrder.price}/{selectedOrder.incoterm === 'CIF' ? 'MT CIF' : 'MT FOB'}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Volume</span><span className="font-bold">{selectedOrder.volume}</span></div>
                  <div className="flex justify-between pt-2 border-t border-border mt-2"><span className="font-bold">Total</span><span className="font-bold text-primary">${selectedOrder.total?.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default Orders;
