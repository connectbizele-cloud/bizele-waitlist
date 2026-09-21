import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { ApiResponse, BrandPayload, CreatorPayload, SocialPlatform, UserType } from '../types/waitlist';
import './WaitlistModal.css';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatorPayload | BrandPayload) => Promise<void>;
  isSubmitting: boolean;
  response: ApiResponse | null;
  defaultUserType?: UserType;
}

const PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'other', label: 'Other' },
];

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

export default function WaitlistModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  response,
  defaultUserType,
}: WaitlistModalProps) {
  const [userType, setUserType] = useState<UserType>(defaultUserType || 'creator');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>('instagram');
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Synchronize state during render on prop changes without cascading effect renders
  const [prevDefaultUserType, setPrevDefaultUserType] = useState(defaultUserType);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setUserType(defaultUserType || 'creator');
      setFullName('');
      setEmail('');
      setSocialHandle('');
      setSocialPlatform('instagram');
      setBrandName('');
      setWebsite('');
      setCompanySize('');
      setErrors({});
    }
  } else if (defaultUserType !== prevDefaultUserType) {
    setPrevDefaultUserType(defaultUserType);
    if (defaultUserType) {
      setUserType(defaultUserType);
    }
  }

  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while modal is open
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

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email';
    }

    if (userType === 'creator') {
      if (!socialHandle.trim()) errs.socialHandle = 'Social handle is required';
    } else {
      if (!brandName.trim()) errs.brandName = 'Brand name is required';
      if (!website.trim()) {
        errs.website = 'Website is required';
      } else if (!/^https?:\/\/.+/i.test(website.trim()) && !/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(website.trim())) {
        errs.website = 'Enter a valid website URL';
      }
      if (!companySize) errs.companySize = 'Select company size';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (userType === 'creator') {
      await onSubmit({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        userType: 'creator',
        socialHandle: socialHandle.trim(),
        socialPlatform,
      });
    } else {
      let formattedWebsite = website.trim();
      if (!/^https?:\/\//i.test(formattedWebsite)) {
        formattedWebsite = `https://${formattedWebsite}`;
      }
      await onSubmit({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        userType: 'brand',
        brandName: brandName.trim(),
        website: formattedWebsite,
        companySize,
      });
    }
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  if (!isOpen) return null;

  // Success state
  if (response?.success) {
    return (
      <div
        className="modal-overlay"
        ref={overlayRef}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label="Waitlist registration success"
      >
        <div className="modal-content wm wm--animated">
          <button className="wm__close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className="wm__success">
            <div className="wm__success-icon">✓</div>
            <h2 className="wm__success-title">You're on the list!</h2>
            <p className="wm__success-desc">
              Thanks for joining the Bizele waitlist. We'll be in touch soon with early access details.
            </p>
            <button className="btn btn--primary" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Join the waitlist"
    >
      <div className="modal-content wm wm--animated">
        <div className="wm__header">
          <div>
            <h2 className="wm__title">Join the Waitlist</h2>
            <p className="wm__desc">Get early access to Bizele.</p>
          </div>
          <button className="wm__close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Error banner */}
        {response && !response.success && (
          <div className="wm__error-banner" role="alert">
            {response.code === 'DUPLICATE_EMAIL'
              ? 'This email is already on the waitlist!'
              : response.message || 'Something went wrong. Please try again.'}
          </div>
        )}

        <form className="wm__form" onSubmit={handleSubmit} noValidate>
          {/* User type toggle */}
          <div className="wm__toggle-wrap">
            <div className="toggle-group" role="tablist" aria-label="Select role">
              <button
                type="button"
                role="tab"
                aria-selected={userType === 'creator'}
                className={`toggle-pill ${userType === 'creator' ? 'toggle-pill--active' : ''}`}
                onClick={() => {
                  setUserType('creator');
                  setErrors({});
                }}
              >
                🎨 Creator
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={userType === 'brand'}
                className={`toggle-pill ${userType === 'brand' ? 'toggle-pill--active' : ''}`}
                onClick={() => {
                  setUserType('brand');
                  setErrors({});
                }}
              >
                🏢 Brand
              </button>
            </div>
          </div>

          {/* Common fields */}
          <div className="form-group">
            <label className="form-label" htmlFor="wm-fullname">Full Name</label>
            <input
              id="wm-fullname"
              className={`form-input ${errors.fullName ? 'form-input--error' : ''}`}
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              autoComplete="name"
            />
            <span className="form-error">{errors.fullName || ''}</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="wm-email">
              {userType === 'brand' ? 'Work Email' : 'Email'}
            </label>
            <input
              id="wm-email"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              type="email"
              placeholder={userType === 'brand' ? 'you@company.com' : 'you@example.com'}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              autoComplete="email"
            />
            <span className="form-error">{errors.email || ''}</span>
          </div>

          {/* Creator-specific fields */}
          {userType === 'creator' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="wm-handle">Social Handle</label>
                <input
                  id="wm-handle"
                  className={`form-input ${errors.socialHandle ? 'form-input--error' : ''}`}
                  type="text"
                  placeholder="@yourhandle"
                  value={socialHandle}
                  onChange={(e) => {
                    setSocialHandle(e.target.value);
                    if (errors.socialHandle) setErrors((prev) => ({ ...prev, socialHandle: '' }));
                  }}
                />
                <span className="form-error">{errors.socialHandle || ''}</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="wm-platform">Primary Platform</label>
                <select
                  id="wm-platform"
                  className="form-select"
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value as SocialPlatform)}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Brand-specific fields */}
          {userType === 'brand' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="wm-brand">Brand / Business Name</label>
                <input
                  id="wm-brand"
                  className={`form-input ${errors.brandName ? 'form-input--error' : ''}`}
                  type="text"
                  placeholder="Your brand or company"
                  value={brandName}
                  onChange={(e) => {
                    setBrandName(e.target.value);
                    if (errors.brandName) setErrors((prev) => ({ ...prev, brandName: '' }));
                  }}
                />
                <span className="form-error">{errors.brandName || ''}</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="wm-website">Website</label>
                <input
                  id="wm-website"
                  className={`form-input ${errors.website ? 'form-input--error' : ''}`}
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    if (errors.website) setErrors((prev) => ({ ...prev, website: '' }));
                  }}
                />
                <span className="form-error">{errors.website || ''}</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="wm-size">Company Size</label>
                <select
                  id="wm-size"
                  className={`form-select ${errors.companySize ? 'form-input--error' : ''}`}
                  value={companySize}
                  onChange={(e) => {
                    setCompanySize(e.target.value);
                    if (errors.companySize) setErrors((prev) => ({ ...prev, companySize: '' }));
                  }}
                >
                  <option value="" disabled>Select size</option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s} value={s}>{s} employees</option>
                  ))}
                </select>
                <span className="form-error">{errors.companySize || ''}</span>
              </div>
            </>
          )}

          <button className="btn btn--primary btn--lg wm__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Joining...
              </>
            ) : (
              'Join the Waitlist'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
