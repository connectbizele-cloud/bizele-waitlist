import LegalPage from '../components/LegalPage';
import { useCookieConsent } from '../context/CookieConsentContext';
import './CookiePolicyPage.css';

/* ⚠️  DRAFT — Requires review by a qualified legal adviser before publication.
        Placeholders are marked [PLACEHOLDER] and must be replaced with
        verified business details before going live. */

export default function CookiePolicyPage() {
  const { openBanner } = useCookieConsent();
  return (
    <LegalPage title="Cookie Policy" lastUpdated="20 October 2026">
      <div className="legal-review-notice">
        <p>
          ⚠️ <strong>Legal Review Required.</strong> This document contains draft text and
          unverified placeholders. It must be reviewed by a qualified legal adviser and
          updated with accurate details about cookies actually in use before publication.
          It does not constitute legal advice.
        </p>
      </div>

      <p>
        This Cookie Policy explains what cookies are, which ones Bizele uses, why we use
        them and how you can manage your preferences. It should be read alongside our{' '}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device (computer, tablet or mobile) when
        you visit a website. They help websites operate efficiently, remember your preferences,
        understand how visitors use a site and — where consent is given — support analytics and
        marketing activities.
      </p>
      <p>
        Other similar technologies (such as local storage, session storage and pixel tags) may
        work in a comparable way. References to "cookies" in this policy include these
        technologies where relevant.
      </p>

      <h2>2. Types of Cookies We Use</h2>

      <h3>2.1 Essential Cookies</h3>
      <p>
        Essential cookies are strictly necessary for the website to function correctly. They
        enable core features such as security, session management and basic site navigation.
        Without these cookies, services you have requested (such as joining the waitlist)
        cannot be provided.
      </p>
      <p>
        These cookies do not require your consent and cannot be disabled through our cookie
        preference panel, although you can block them in your browser settings (which may
        affect site functionality).
      </p>
      <p>
        <strong>Examples of essential cookie functions:</strong> session security,
        role-selection memory (sessionStorage), CSRF protection.
      </p>

      <h3>2.2 Analytics Cookies</h3>
      <p>
        Analytics cookies help us understand how visitors interact with our website — for
        example, which pages are visited most often, how long users stay and any errors
        encountered. This helps us improve the platform.
      </p>
      <p>
        We only place analytics cookies after you have given your consent via our cookie
        preference panel. Analytics tools we may use include:{' '}
        <span className="legal-placeholder">
          [PLACEHOLDER: List specific analytics providers and cookies once confirmed, e.g.
          Google Analytics 4 (GA4)]
        </span>
        .
      </p>

      <h3>2.3 Functional Cookies</h3>
      <p>
        Functional cookies remember your settings and preferences to provide a more
        personalised experience. For example, they may remember your role selection (Creator
        or Business) across sessions.
      </p>
      <p>
        <span className="legal-placeholder">
          [PLACEHOLDER: Confirm whether functional cookies are classified as essential or
          optional and whether consent is required for your specific implementation.]
        </span>
      </p>

      <h3>2.4 Marketing Cookies</h3>
      <p>
        Marketing cookies may be used to measure advertising effectiveness and, where
        applicable, to deliver relevant marketing content. We only place marketing cookies
        after you have given your explicit consent.
      </p>
      <p>
        <span className="legal-placeholder">
          [PLACEHOLDER: List specific marketing providers and cookies once confirmed,
          e.g. Meta Pixel, LinkedIn Insight Tag. Remove this section if marketing cookies
          are not used.]
        </span>
      </p>

      <h2>3. Managing Your Cookie Preferences</h2>
      <p>
        When you first visit Bizele, we display a cookie banner. You can choose to:
      </p>
      <ul>
        <li>
          <strong>Accept All</strong> — consent to all categories of cookies, including
          analytics and marketing.
        </li>
        <li>
          <strong>Reject Optional</strong> — only essential cookies will be placed; analytics
          and marketing cookies will not be activated.
        </li>
        <li>
          <strong>Customize</strong> — choose which optional categories to enable or disable
          individually.
        </li>
      </ul>
      <p>
        You can change your preferences at any time by clicking{' '}
        <button
          type="button"
          className="cookie-policy__settings-link"
          onClick={openBanner}
        >
          Cookie Settings
        </button>{' '}
        here or in the website footer. Your choice is stored in your
        browser's local storage and will be remembered on return visits on the same device
        and browser.
      </p>
      <p>
        You can also manage or delete cookies directly through your browser settings. Most
        browsers allow you to block or delete cookies. Note that blocking certain cookies may
        affect the functionality or availability of some features of the website.
      </p>
      <p>For more information on managing cookies in your browser, visit:</p>
      <ul>
        <li>
          <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
            Google Chrome
          </a>
        </li>
        <li>
          <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">
            Apple Safari
          </a>
        </li>
        <li>
          <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
            Microsoft Edge
          </a>
        </li>
      </ul>

      <h2>4. Third-Party Cookies</h2>
      <p>
        Some cookies may be placed by third-party services integrated into Bizele, such as
        analytics providers or advertising partners. These third parties may process
        information about your use of our website according to their own privacy policies.
        We encourage you to review their policies to understand how they use cookies.
      </p>
      <p>
        We do not control third-party cookies. Where required by applicable law, we obtain your
        consent before allowing third-party optional cookies to be placed.
      </p>

      <h2>5. Cookie Consent and Legal Compliance</h2>
      <p>
        Our cookie banner and preference panel are designed to help users understand and
        control their cookie choices. However, cookie consent requirements vary significantly
        by jurisdiction, and this system may not satisfy the requirements of all applicable
        laws in all territories.
      </p>
      <p>
        <strong>
          These tools do not guarantee legal compliance. Bizele's cookie consent
          implementation must be reviewed by a qualified legal adviser before publication.
        </strong>
      </p>

      <h2>6. Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy to reflect changes in our technology, services or
        legal requirements. Any updates will be published on this page with a revised date.
        We encourage you to review this policy periodically.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have questions about this Cookie Policy or our use of cookies, please contact
        us at{' '}
        <span className="legal-placeholder">[Insert Official Bizele Contact Email]</span>.
      </p>
      <p>
        You can also manage your preferences directly using the{' '}
        <button
          className="cookie-policy__settings-link"
          onClick={() => {
            // Dispatch a custom event that the App can listen to for reopening the cookie banner
            window.dispatchEvent(new CustomEvent('bizele:open-cookie-settings'));
          }}
        >
          Cookie Settings
        </button>{' '}
        control in the website footer.
      </p>

      <hr />
      <p>
        <em>
          This document is a draft prepared for review. It is not a final legal document.
          Bizele does not guarantee that this policy constitutes legal compliance in any
          jurisdiction. It must be reviewed by a qualified legal adviser before publication.
        </em>
      </p>
    </LegalPage>
  );
}
