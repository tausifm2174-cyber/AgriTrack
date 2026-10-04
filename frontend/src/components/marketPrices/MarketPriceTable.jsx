import { Eye, PlusCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Button } from '../common';
import { formatCurrency } from '../../utils/formatters';

export default function MarketPriceTable({ marketPrices, onViewDetails, onCreateSale }) {
  return (
    <div className="agri-market-table-container">
      <div className="agri-market-table-scroll">
        <table className="agri-market-table">
          <thead>
            <tr>
              <th>Crop & Variety</th>
              <th>Mandi & Location</th>
              <th>Benchmark / Quintal</th>
              <th>Price / Kg</th>
              <th>Previous Rate</th>
              <th>24h Change</th>
              <th>Trend</th>
              <th>Bulletin Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {marketPrices.map((mp) => {
              const isRising = mp.trend === 'RISING';
              const isFalling = mp.trend === 'FALLING';
              const trendClass = isRising
                ? 'agri-trend-pill--rising'
                : isFalling
                ? 'agri-trend-pill--falling'
                : 'agri-trend-pill--stable';

              return (
                <tr key={mp.id}>
                  <td>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                        {mp.crop}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        {mp.variety} • Grade {mp.qualityGrade}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                        {mp.market}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        {mp.location}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span style={{ fontWeight: 800, color: 'var(--slate-900)', fontSize: '1rem' }}>
                        {formatCurrency(mp.pricePerQuintal)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        /quintal
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>
                      ₹{Number(mp.pricePerKg).toFixed(2)}/kg
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>
                      {formatCurrency(mp.previousPrice)}/q
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontWeight: 700,
                        color: isRising ? '#059669' : isFalling ? '#dc2626' : 'var(--slate-600)',
                      }}
                    >
                      {isRising ? '+' : ''}₹{mp.change} ({isRising ? '+' : ''}
                      {mp.changePercent}%)
                    </div>
                  </td>
                  <td>
                    <span className={`agri-trend-pill ${trendClass}`}>
                      {isRising ? (
                        <ArrowUpRight size={14} />
                      ) : isFalling ? (
                        <ArrowDownRight size={14} />
                      ) : (
                        <Minus size={14} />
                      )}
                      <span>{mp.trend}</span>
                    </span>
                  </td>
                  <td>
                    <span style={{ whiteSpace: 'nowrap', color: 'var(--slate-600)', fontSize: '0.85rem' }}>
                      {mp.date}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(mp)}
                        aria-label={`View trend for ${mp.crop}`}
                      >
                        <Eye size={14} />
                        <span>Trend</span>
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onCreateSale(mp)}
                        aria-label={`Create sale from ${mp.crop} rate`}
                      >
                        <PlusCircle size={14} />
                        <span>Sell</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
