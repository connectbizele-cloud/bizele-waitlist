import './FinalCTA.css';

interface FinalCTAProps {
  count: number;
  onJoinClick: () => void;
}

export default function FinalCTA({ count, onJoinClick }: FinalCTAProps) {
  return (
    <section className="final-cta section--dark" id="join">
      <div className="container final-cta__inner">
        <h2 className="final-cta__title">
          Don't Miss the First Wave
        </h2>
        <p className="final-cta__desc">
          <strong>{count.toLocaleString()}</strong> people have already joined.
          Get early access when Bizele launches.
        </p>
        <button className="btn btn--primary btn--lg" onClick={onJoinClick}>
          Join the Waitlist
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
