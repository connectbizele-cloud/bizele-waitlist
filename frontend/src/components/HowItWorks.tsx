import './HowItWorks.css';

export default function HowItWorks() {
  const steps = [
    { num: '01', label: 'Sign Up', desc: 'Join the waitlist as a creator or brand' },
    { num: '02', label: 'Get Matched', desc: 'AI finds your ideal collaborations' },
    { num: '03', label: 'Collaborate', desc: 'Run campaigns and grow together' },
  ];

  return (
    <section className="section how-it-works" id="how-it-works">
      <div className="container">
        <span className="section__label">How It Works</span>
        <h2 className="section__title">Three Steps to Better Collaborations</h2>

        <div className="how-it-works__steps">
          {steps.map((step, i) => (
            <div className="how-it-works__step" key={step.num}>
              <span className="how-it-works__num">{step.num}</span>
              <h3 className="how-it-works__step-title">{step.label}</h3>
              <p className="how-it-works__step-desc">{step.desc}</p>
              {i < steps.length - 1 && <div className="how-it-works__connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
