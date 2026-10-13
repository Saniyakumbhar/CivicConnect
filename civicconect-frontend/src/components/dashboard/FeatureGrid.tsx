import type { LucideIcon } from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

/** Placeholder cards for modules that will be built later. */
export default function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <ul className="feature-grid">
      {features.map(({ title, description, icon: Icon }) => (
        <li key={title} className="feature-card">
          <span className="feature-card__icon">
            <Icon size={22} aria-hidden="true" />
          </span>
          <h2 className="feature-card__title">{title}</h2>
          <p className="feature-card__text">{description}</p>
          <span className="feature-card__tag">Coming soon</span>
        </li>
      ))}
    </ul>
  );
}
