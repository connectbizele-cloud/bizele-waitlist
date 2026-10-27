import { useEffect } from 'react';
import LegalPage from '../components/LegalPage';
import '../components/LegalPage.css';
import './FAQPage.css';

const faqs = [
  {
    question: 'Who can join Bizele?',
    answer:
      "Bizele is being built for businesses, brands, marketers, creators, and influencers. Whether you're looking to grow your business, discover collaboration opportunities, or connect with the right people, Bizele aims to bring both sides together in one ecosystem.",
  },
  {
    question: 'How will Bizele help my business grow?',
    answer:
      'Bizele aims to help businesses understand their performance, identify growth opportunities, access AI-powered insights, and simplify everyday growth activities. The platform is also being designed to support more relevant brand–creator collaborations.',
  },
  {
    question: 'How will creators connect with brands on Bizele?',
    answer:
      "Our vision is to help creators discover relevant brand opportunities and help businesses find creators who align with their goals, audience, and industry. We're working towards making collaboration more informed and accessible.",
  },
  {
    question: 'Do I need to be an established business or creator to join?',
    answer:
      "Not necessarily. Bizele is being developed with different growth stages in mind. Whether you're building your brand, growing your business, or developing your presence as a creator, you can join the waitlist to stay informed about upcoming opportunities.",
  },
  {
    question: 'Is Bizele available yet?',
    answer:
      'Bizele is currently in development as we continue building and refining the platform. By joining the waitlist, you’ll be able to stay updated on new features, development milestones, and launch announcements.',
  },
  {
    question: 'What happens after I join the waitlist?',
    answer:
      "Once you join, you'll be on our list to receive updates about Bizele's progress and launch. We'll share relevant announcements as we move closer to making the platform available. Joining the waitlist does not guarantee immediate access.",
  },
  {
    question: 'Is Bizele only an influencer marketing platform?',
    answer:
      'No. Bizele is being built as a broader AI-powered growth ecosystem. Alongside brand–creator collaboration, our vision includes business intelligence, actionable AI insights, and tools designed to help businesses make smarter decisions and grow more effectively.',
  },
  {
    question: 'How can I stay updated on Bizele?',
    answer:
      'Join our waitlist to hear about our progress, upcoming features, and launch announcements. You can also follow Bizele on our social media channels to be part of the journey.',
  },
];

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};

export default function FAQPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Frequently Asked Questions | Bizele';

    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute('content');
    description?.setAttribute(
      'content',
      'Find answers about Bizele, the AI-powered growth ecosystem connecting businesses, brands, creators, and influencers.',
    );
    const canonical = document.querySelector('link[rel="canonical"]') ?? document.createElement('link');
    const previousCanonical = canonical.getAttribute('href');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `${window.location.origin}/faq`);
    if (!canonical.parentNode) document.head.appendChild(canonical);

    return () => {
      document.title = previousTitle;
      if (description && previousDescription) {
        description.setAttribute('content', previousDescription);
      }
      if (previousCanonical) {
        canonical.setAttribute('href', previousCanonical);
      } else {
        canonical.remove();
      }
    };
  }, []);

  return (
    <>
      <LegalPage title="Frequently Asked Questions" lastUpdated="October 2026">
        <p className="faq-page__intro">
          Learn more about Bizele, our vision for AI-powered growth, and what to expect when you join the waitlist.
        </p>
        <div className="faq-page__list">
          {faqs.map(({ question, answer }) => (
            <details className="faq-page__item" key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </LegalPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
