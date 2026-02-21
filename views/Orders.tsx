
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '../hooks/useOrders';

const PIPELINE_FULL = [
  'ORDER CONFIRMED',
  'AWAITING PAYMENT',
  'PAYMENT ESCROWED',
  'INSPECTION SCHEDULED',
  'INSPECTION PASSED',
  'GOODS PACKED',
  'GOODS SHIPPED',
  'IN TRANSIT',
  'CUSTOMS CLEARANCE',
  'ARRIVED AT DESTINATION',
  'DELIVERED & CONFIRMED',
];

const MOCK_ORDERS = [
  { 
    id: 'ORD-98221', crop: 'Yellow Maize', volume: '150 MT', status: 'IN TRANSIT',
    date: '2026-02-12', destination: 'Dubai, UAE', supplier: 'Mazaohub',
    price: 272, total: 40800, incoterm: 'CIF',
    vessel: 'MAERSK NAIROBI', container: 'MSKU-892341-0', eta: '2026-02-25',
  },
  { 
    id: 'ORD-98215', crop: 'Cashew Nuts', volume: '80 MT', status: 'INSPECTION PASSED',
    date: '2026-02-15', destination: 'Hamburg, Germany', supplier: 'Coastal Exports',
    price: 1240, total: 99200, incoterm: 'FOB',
    vessel: 'MSC ILONA', container: 'MSCU-112233-4', eta: '2026-03-10',
  },
  { 
    id: 'ORD-98204', crop: 'Long Grain Rice', volume: '200 MT', status: 'DELIVERED & CONFIRMED',
    date: '2026-02-01', destination: 'Mombasa, Kenya', supplier: 'Kilombero Agro',
    price: 480, total: 96000, incoterm: 'CIF',
    vessel: 'K-LINE HORIZON', container: 'KLUU-778899-1', eta: '2026-02-05',
  },
];

const Orders: React.FC = () => {
  const { orders: dbOrders, loading } = useOrders();
  const displayOrders = dbOrders.length > 0 ? dbOrders.map(o => ({
    id: o.id,
    crop: o.crop,
    volume: o.volume,
    status: o.status,
    date: o.created_at?.slice(0, 10),
    destination: o.destination,
    supplier: 'Verified Supplier',
    price: o.price,
    total: o.price * parseInt(o.volume),
    incoterm: o.incoterm,
    vessel: o.vessel || 'TBD',
    container: o.container || 'TBD',
    eta: o.eta || 'TBD',
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
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none mb-2">My Orders</h1>
          <p className="text-textMuted text-[10px] md:text-xs font-mono uppercase tracking-widest">
            {displayOrders.length} orders · Track shipments & logistics
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-[10px] text-textMuted font-bold uppercase">Active</p>
            <p className="text-xl font-black text-primary">{displayOrders.filter(o => o.status !== 'DELIVERED & CONFIRMED').length}</p>
          </div>
          <div>
            <p className="text-[10px] text-textMuted font-bold uppercase">Completed</p>
            <p className="text-xl font-black">{displayOrders.filter(o => o.status === 'DELIVERED & CONFIRMED').length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order List */}
        <div className="lg:col-span-4 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {displayOrders.map(order => {
            const isActive = order.id === selectedId;
            const isDone = order.status === 'DELIVERED & CONFIRMED';
            return (
              <div
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-surface border-primary/40' 
                    : 'bg-surface/50 border-border hover:border-borderHover'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold">{order.id}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isDone ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                    {isDone ? 'DELIVERED' : 'IN PROGRESS'}
                  </span>
                </div>
                <p className="text-sm font-bold mb-1">{order.crop}</p>
                <p className="text-[10px] text-textMuted">{order.volume} → {order.destination}</p>
                <div className="mt-3 h-1 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${(getStatusIndex(order.status) / (PIPELINE_FULL.length - 1)) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Detail */}
        {selectedOrder && (
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface border border-border p-5 md:p-8 rounded-2xl">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <h2 className="text-xl md:text-2xl font-black mb-1">{selectedOrder.crop}</h2>
                  <p className="text-xs text-textMuted">{selectedOrder.id} · Placed {selectedOrder.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary">${selectedOrder.total?.toLocaleString()}</p>
                  <p className="text-[10px] text-textMuted">{selectedOrder.incoterm} · {selectedOrder.volume}</p>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div>
                  <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Destination</p>
                  <p className="text-xs font-bold">{selectedOrder.destination}</p>
                </div>
                <div>
                  <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Vessel</p>
                  <p className="text-xs font-bold">{selectedOrder.vessel}</p>
                </div>
                <div>
                  <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Container</p>
                  <p className="text-xs font-bold">{selectedOrder.container}</p>
                </div>
                <div>
                  <p className="text-[9px] text-textMuted font-bold uppercase mb-1">ETA</p>
                  <p className="text-xs font-bold text-primary">{selectedOrder.eta}</p>
                </div>
              </div>

              {/* Status Pipeline */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Order Progress</h4>
                  <span className="text-[10px] font-bold text-primary">{selectedOrder.status}</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {PIPELINE_FULL.map((step, i) => (
                    <div
                      key={step}
                      className={`flex items-center gap-2 text-[9px] font-semibold py-1 ${
                        i <= statusIndex ? 'text-primary' : 'text-textMuted'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        i < statusIndex ? 'bg-primary border-primary' : 
                        i === statusIndex ? 'border-primary' : 'border-border'
                      }`}>
                        {i < statusIndex && <span className="text-background text-[7px]">✓</span>}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-background border border-border p-5 rounded-xl">
                <h4 className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-4">Cost Breakdown</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-textMuted">Unit Price</span>
                    <span className="font-bold">${selectedOrder.price}/{selectedOrder.incoterm === 'CIF' ? 'MT CIF' : 'MT FOB'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textMuted">Volume</span>
                    <span className="font-bold">{selectedOrder.volume}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border mt-2">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">${selectedOrder.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
