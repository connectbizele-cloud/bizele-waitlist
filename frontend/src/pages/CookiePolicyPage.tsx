import LegalPage from '../components/LegalPage';
import { useCookieConsent } from '../context/CookieConsentContext';
import './CookiePolicyPage.css';

export default function CookiePolicyPage() {
  const { openBanner } = useCookieConsent();

  return (
    <LegalPage title="Cookie Policy" lastUpdated="20 October 2026">
      <>
      <h2 key="legal-0">1. What Are Cookies?</h2>
      <p key="legal-1">Cookies are small text files stored on your device when you visit our website. They help Bizele operate efficiently, remember your preferences, understand how visitors use our platform and improve your experience.</p>
      <h2 key="legal-2">2. Types of Cookies We Use</h2>
      <p key="legal-3">Bizele may use the following types of cookies:</p>
      <p key="legal-4">Essential Cookies: Necessary for website functionality, security, account access and core platform features.</p>
      <p key="legal-5">Analytics Cookies: Help us understand website traffic, user behaviour and platform performance through tools such as Google Analytics.</p>
      <p key="legal-6">Functional Cookies: Remember your preferences and settings to provide a more personalised experience.</p>
      <p key="legal-7">Marketing Cookies: May be used to measure advertising performance and deliver relevant marketing content, where applicable.</p>
      <h2 key="legal-8">3. Managing Cookies</h2>
      <p key="legal-9">You can manage or disable cookies through your browser settings and, where available, our cookie consent banner.</p>
      <p key="legal-10">Disabling certain cookies may affect the functionality or availability of some features. Essential cookies may be necessary for the website to operate properly.</p>
      <p key="legal-11">Where required by applicable law, we will obtain your consent before using non-essential cookies.</p>
      <h2 key="legal-12">4. Third-Party Cookies</h2>
      <p key="legal-13">Some cookies may be placed by third-party services integrated into Bizele, such as analytics providers or advertising partners. These third parties may process information according to their own privacy policies.</p>
      <p key="legal-14">We encourage you to review their policies to understand how they use cookies and related technologies.</p>
      <h2 key="legal-15">5. Updates to This Policy</h2>
      <p key="legal-16">We may update this Cookie Policy to reflect changes in our technology, services or legal requirements. Any updates will be published on this page with a revised date.</p>
      <h2 key="legal-17">6. Contact Us</h2>
      <p key="legal-18">If you have questions about this Cookie Policy or our use of cookies, please contact us at support.bizele@gmail.com .</p>
      <p key="legal-19">Bizele — One ecosystem. Built for growth.</p>
      </>
      <p>
        <button
          type="button"
          className="cookie-policy__settings-link"
          onClick={openBanner}
        >
          Cookie Settings
        </button>
      </p>
    </LegalPage>
  );
}
