import { useEffect } from 'react';
import { X } from 'lucide-react';
import Sidebar from './Sidebar';

/**
 * Mobile off-canvas drawer navigation
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 */
export default function MobileSidebar({ isOpen, onClose }) {
  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="agri-mobile-drawer-root" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
      {/* Backdrop Overlay */}
      <div
        className="agri-mobile-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="agri-mobile-drawer">
        <button
          type="button"
          className="agri-mobile-drawer__close-btn"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>

        <div className="agri-mobile-drawer__content">
          <Sidebar onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
