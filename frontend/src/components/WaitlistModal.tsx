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
  // Step 1: Role Selection ("Who are you?"), Step 2: Information inputs
  const [step, setStep] = useState<1 | 2>(defaultUserType ? 2 : 1);
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
      setStep(defaultUserType ? 2 : 1);
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
      setStep(2);
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

  function validateField(field: string): boolean {
    const newErrors = { ...errors };

    if (field === 'fullName') {
      if (!fullName.trim()) {
        newErrors.fullName = 'Please enter your full name';
      } else {
        delete newErrors.fullName;
      }
    }

    if (field === 'email') {
      if (!email.trim()) {
        newErrors.email = 'Please enter your email address';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = 'Enter a valid email address (e.g. you@example.com)';
      } else {
        delete newErrors.email;
      }
    }

    if (userType === 'creator') {
      if (field === 'socialHandle') {
        if (!socialHandle.trim()) {
          newErrors.socialHandle = 'Social handle is required (e.g. @yourname)';
        } else {
          delete newErrors.socialHandle;
        }
      }
    } else {
      if (field === 'brandName') {
        if (!brandName.trim()) {
          newErrors.brandName = 'Brand or company name is required';
        } else {
          delete newErrors.brandName;
        }
      }
      if (field === 'website') {
        if (!website.trim()) {
          newErrors.website = 'Company website is required';
        } else if (!/^https?:\/\/.+/i.test(website.trim()) && !/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(website.trim())) {
          newErrors.website = 'Enter a valid website URL (e.g. https://yourbrand.com)';
        } else {
          delete newErrors.website;
        }
      }
      if (field === 'companySize') {
        if (!companySize) {
          newErrors.companySize = 'Please select your company size';
        } else {
          delete newErrors.companySize;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateAll(): boolean {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address (e.g. you@example.com)';
    }

    if (userType === 'creator') {
      if (!socialHandle.trim()) errs.socialHandle = 'Social handle is required (e.g. @yourname)';
    } else {
      if (!brandName.trim()) errs.brandName = 'Brand or company name is required';
      if (!website.trim()) {
        errs.website = 'Company website is required';
      } else if (!/^https?:\/\/.+/i.test(website.trim()) && !/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(website.trim())) {
        errs.website = 'Enter a valid website URL (e.g. https://yourbrand.com)';
      }
      if (!companySize) errs.companySize = 'Please select your company size';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateAll()) return;

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

  function handleSelectRole(selectedRole: UserType) {
    setUserType(selectedRole);
    setErrors({});
    setStep(2);
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  if (!isOpen) return null;

  // Success state (HCI Visibility of System Status)
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
        <div className="modal-content wm wm--animated" data-network-calm>
          <button className="wm__close" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
          <div className="wm__success">
            <div className="wm__success-icon">✓</div>
            <h2 className="wm__success-title">You're in.</h2>
            <p className="wm__success-desc">
              Thanks for joining the Bizele waitlist. We've reserved your spot and will be in touch with your priority wave access details.
            </p>
            <button className="btn btn--primary btn--lg" onClick={onClose}>
              Done
            </button>
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
      <div className="modal-content wm wm--animated" data-network-calm>
        <div className="wm__header">
          <div>
            <div className="wm__step-indicator">
              <span>Step {step} of 2</span>
            </div>
            <h2 className="wm__title">
              {step === 1 ? 'Who are you?' : userType === 'creator' ? 'Creator Early Access' : 'Brand Early Access'}
            </h2>
            <p className="wm__desc">
              {step === 1
                ? 'Select your role to personalize your Bizele experience.'
                : 'Enter your details below to secure your early access position.'}
            </p>
          </div>
          <button className="wm__close" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Error banner with friendly duplicate email handling */}
        {response && !response.success && (
          <div className="wm__error-banner" role="alert">
            {response.message === 'DUPLICATE_EMAIL'
              ? "This email is already registered on our waitlist! You're already set for early access."
              : response.message || 'Something went wrong. Please try again.'}
          </div>
        )}

        {/* STEP 1: Hick's Law Progressive Disclosure — Obvious role selection */}
        {step === 1 ? (
          <div className="wm__step-roles">
            <button
              type="button"
              className="wm__role-card"
              onClick={() => handleSelectRole('creator')}
            >
              <div className="wm__role-card-icon">🎨</div>
              <div className="wm__role-card-body">
                <h3 className="wm__role-card-title">I'm a Creator</h3>
                <p className="wm__role-card-desc">
                  Monetize your creative voice, match with vetted brands, and get guaranteed payouts.
                </p>
              </div>
              <span className="wm__role-card-arrow" aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="wm__role-card"
              onClick={() => handleSelectRole('brand')}
            >
              <div className="wm__role-card-icon">🏢</div>
              <div className="wm__role-card-body">
                <h3 className="wm__role-card-title">I'm a Brand</h3>
                <p className="wm__role-card-desc">
                  Discover authentic creators, automate contracts and briefs, and track verified ROAS.
                </p>
              </div>
              <span className="wm__role-card-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          /* STEP 2: Relevant Information Form */
          <form className="wm__form" onSubmit={handleSubmit} noValidate>
            {/* Role switch breadcrumb */}
            <div className="wm__role-bar">
              <span className="wm__role-active-badge">
                {userType === 'creator' ? '🎨 Creator' : '🏢 Brand'}
              </span>
              <button
                type="button"
                className="wm__change-role-btn"
                onClick={() => setStep(1)}
              >
                Change role
              </button>
            </div>

            {/* Common field: Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="wm-fullname">
                Full Name <span className="wm__req">*</span>
              </label>
              <input
                id="wm-fullname"
                className={`form-input ${errors.fullName ? 'form-input--error' : ''}`}
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                onBlur={() => validateField('fullName')}
                autoComplete="name"
                required
              />
              <span className="form-error">{errors.fullName || ''}</span>
            </div>

            {/* Common field: Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="wm-email">
                {userType === 'brand' ? 'Work Email' : 'Email Address'} <span className="wm__req">*</span>
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
                onBlur={() => validateField('email')}
                autoComplete="email"
                required
              />
              <span className="form-error">{errors.email || ''}</span>
            </div>

            {/* Creator-specific fields */}
            {userType === 'creator' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="wm-handle">
                    Social Handle <span className="wm__req">*</span>
                  </label>
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
                    onBlur={() => validateField('socialHandle')}
                    required
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
                  <label className="form-label" htmlFor="wm-brand">
                    Brand / Company Name <span className="wm__req">*</span>
                  </label>
                  <input
                    id="wm-brand"
                    className={`form-input ${errors.brandName ? 'form-input--error' : ''}`}
                    type="text"
                    placeholder="Acme Inc."
                    value={brandName}
                    onChange={(e) => {
                      setBrandName(e.target.value);
                      if (errors.brandName) setErrors((prev) => ({ ...prev, brandName: '' }));
                    }}
                    onBlur={() => validateField('brandName')}
                    required
                  />
                  <span className="form-error">{errors.brandName || ''}</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="wm-website">
                    Website URL <span className="wm__req">*</span>
                  </label>
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
                    onBlur={() => validateField('website')}
                    required
                  />
                  <span className="form-error">{errors.website || ''}</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="wm-size">
                    Company Size <span className="wm__req">*</span>
                  </label>
                  <select
                    id="wm-size"
                    className={`form-select ${errors.companySize ? 'form-input--error' : ''}`}
                    value={companySize}
                    onChange={(e) => {
                      setCompanySize(e.target.value);
                      if (errors.companySize) setErrors((prev) => ({ ...prev, companySize: '' }));
                    }}
                    onBlur={() => validateField('companySize')}
                    required
                  >
                    <option value="" disabled>Select company size</option>
                    {COMPANY_SIZES.map((s) => (
                      <option key={s} value={s}>{s} employees</option>
                    ))}
                  </select>
                  <span className="form-error">{errors.companySize || ''}</span>
                </div>
              </>
            )}

            <button
              className="btn btn--primary btn--lg wm__submit"
              type="submit"
              disabled={isSubmitting}
            >
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
        )}
      </div>
    </div>
  );
}
