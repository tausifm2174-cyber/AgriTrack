import { PageHeader, Card, Button } from '../components/common';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Clean placeholder view for Phase 1 router setup
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {string} props.phaseNote
 * @param {string[]} props.features
 */
export default function PlaceholderPage({
  title,
  subtitle,
  phaseNote = 'Planned in upcoming phase',
  features = [],
}) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Link to="/dashboard">
            <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />} iconPosition="right">
              Return to Dashboard
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="agri-placeholder-card">
          <div className="agri-placeholder-badge">
            <Sparkles size={14} />
            <span>{phaseNote}</span>
          </div>
          <h2 className="agri-placeholder-title">{title} Module</h2>
          <p className="agri-placeholder-desc">
            This module is structured and registered in the AgriTrack application router. Full interactive views and domain controls are being built in accordance with the project roadmap.
          </p>

          {features.length > 0 && (
            <div className="agri-placeholder-features">
              {features.map((feat) => (
                <span key={feat} className="agri-placeholder-tag">
                  {feat}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
