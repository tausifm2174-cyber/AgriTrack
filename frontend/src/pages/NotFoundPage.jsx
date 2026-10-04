import { Link } from 'react-router-dom';
import { PageHeader, Card, Button } from '../components/common';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div>
      <PageHeader
        title="404 - Page Not Found"
        subtitle="The requested section does not exist or has been relocated"
      />
      <Card>
        <div className="agri-placeholder-card">
          <h2 className="agri-placeholder-title">Section Not Found</h2>
          <p className="agri-placeholder-desc">
            We couldn't find the page you are looking for. Please check the URL or return to the AgriTrack operational dashboard.
          </p>
          <Link to="/dashboard">
            <Button variant="primary" icon={<Home size={16} />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
