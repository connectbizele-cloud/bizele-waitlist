import type { Role } from '../context/RoleContext';

export interface RoleHeroContent {
  badge: string;
  titleLines: [string, string];
  titleAccent: string;
  subtitle: string;
  ctaLabel: string;
}

export interface RoleCTAContent {
  pill: string;
  title: string;
  countSuffix: string;
  callToAction: string;
}

export interface RoleConfigEntry {
  hero: RoleHeroContent;
  cta: RoleCTAContent;
}

export const roleConfig: Record<Role, RoleConfigEntry> = {
  creator: {
    hero: {
      badge: 'Creator Early Access — Join the Wave',
      titleLines: ['Build Your', 'Creator Identity.'],
      titleAccent: 'Get Discovered by Brands.',
      subtitle:
        'Create your professional portfolio, get matched with brands that fit your niche, and turn your audience into real career opportunities.',
      ctaLabel: 'Join as Creator',
    },
    cta: {
      pill: 'CREATOR WAVE ONE',
      title: 'Your Audience Deserves Real Opportunities',
      countSuffix: 'people already waiting to connect.',
      callToAction: 'Secure your creator profile before launch.',
    },
  },
  business: {
    hero: {
      badge: 'Business Early Access — Priority Launch',
      titleLines: ['Find the Right', 'Creators.'],
      titleAccent: 'Launch Smarter Campaigns.',
      subtitle:
        'AI-powered insights help you discover authentic creators, understand what\u2019s working, and turn social influence into measurable growth.',
      ctaLabel: 'Join as Business',
    },
    cta: {
      pill: 'BUSINESS WAVE ONE',
      title: 'Turn Influence Into Measurable Growth',
      countSuffix: 'people already waiting.',
      callToAction: 'Get priority access to AI-powered creator discovery.',
    },
  },
};

/** Map display role to backend userType */
export function roleToUserType(role: Role): 'creator' | 'brand' {
  return role === 'business' ? 'brand' : 'creator';
}
