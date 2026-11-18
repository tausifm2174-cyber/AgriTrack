import { useTranslation } from 'react-i18next';
import { Eye, PlusCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Button } from '../common';
import { formatCurrency } from '../../utils/formatters';
import { translateCrop, translateVariety } from '../../utils/displayLabels';

export default function MarketPriceTable({ marketPrices, onViewDetails, onCreateSale }) {
  const { t } = useTranslation();

  return (
    <div className="agri-market-table-container">
      <div className="agri-market-table-scroll">
        <table className="agri-market-table">
          <thead>
            <tr>
              <th>{t('marketPrices.cropVariety', 'Crop & Variety')}</th>
              <th>{t('marketPrices.mandiLocation', 'Mandi & Location')}</th>
              <th>{t('marketPrices.benchmarkQuintal', 'Benchmark / Quintal')}</th>
              <th>{t('marketPrices.priceKg', 'Price / Kg')}</th>
              <th>{t('marketPrices.prevRate', 'Previous Rate')}</th>
              <th>{t('marketPrices.change24h', '24h Change')}</th>
              <th>{t('marketPrices.priceTrend', 'Trend')}</th>
              <th>{t('marketPrices.bulletinDate', 'Bulletin Date')}</th>
              <th style={{ textAlign: 'right' }}>{t('common.actions', 'Actions')}</th>
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
                        {translateCrop(mp.crop, t)}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        {translateVariety(mp.variety, t)} • {t('harvests.quality', 'Grade')} {mp.qualityGrade}
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
                        /{t('units.quintal', 'quintal')}
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
                      {mp.previousPrice != null ? `${formatCurrency(mp.previousPrice)}/q` : '—'}
                    </span>
                  </td>
                  <td>
                    {mp.change != null ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontWeight: 700,
                          color: isRising ? '#059669' : isFalling ? '#dc2626' : 'var(--slate-600)',
                        }}
                      >
                        {isRising ? '+' : ''}₹{mp.change}
                        {mp.changePercent != null ? ` (${isRising ? '+' : ''}${mp.changePercent}%)` : ''}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>—</span>
                    )}
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
                      <span>
                        {isRising
                          ? t('marketPrices.rising', 'Rising')
                          : isFalling
                          ? t('marketPrices.falling', 'Falling')
                          : t('marketPrices.stable', 'Stable')}
                      </span>
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
                        aria-label={`${t('marketPrices.viewTrend', 'View trend for')} ${mp.crop}`}
                      >
                        <Eye size={14} />
                        <span>{t('marketPrices.trend', 'Trend')}</span>
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onCreateSale(mp)}
                        aria-label={`${t('sales.addSale', 'Create sale from')} ${mp.crop}`}
                      >
                        <PlusCircle size={14} />
                        <span>{t('sales.addSale', 'Sell')}</span>
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
