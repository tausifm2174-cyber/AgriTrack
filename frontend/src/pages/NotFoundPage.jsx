import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader, Card, Button } from '../components/common';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader
        title={t('common.pageNotFound', '404 - Page Not Found')}
        subtitle={t('common.pageNotFoundSubtitle', 'The requested section does not exist or has been relocated')}
      />
      <Card>
        <div className="agri-placeholder-card">
          <h2 className="agri-placeholder-title">{t('common.sectionNotFound', 'Section Not Found')}</h2>
          <p className="agri-placeholder-desc">
            {t('common.pageNotFoundDesc', "We couldn't find the page you are looking for. Please check the URL or return to the AgriTrack operational dashboard.")}
          </p>
          <Link to="/dashboard">
            <Button variant="primary" icon={<Home size={16} />}>
              {t('common.backToDashboard', 'Back to Dashboard')}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

