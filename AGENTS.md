# Bizele Development Instructions

## Objective
Build a production-ready dynamic waitlist website for Bizele.

## Engineering principles
- Keep architecture simple.
- Do not create unnecessary files.
- Do not introduce dependencies without justification.
- Reuse existing components.
- Keep components modular.
- Follow strict TypeScript typing.
- No hardcoded production data.
- Never expose secrets in frontend code.
- Validate all user input.
- Handle loading, success and error states.
- Build responsive-first.
- Optimize for performance and accessibility.

## Before modifying code
1. Inspect existing architecture.
2. Reuse existing utilities/components.
3. Check database schema before creating new tables.
4. Avoid duplicating functionality.

## UI principles
- Premium SaaS aesthetic.
- Strong visual hierarchy.
- Responsive.
- Accessible.
- Fast.
- Minimal unnecessary animation.

## Database principles
- Server-side writes where appropriate.
- Never expose privileged database credentials.
- Validate data before insertion.
- Prevent duplicate waitlist registrations.