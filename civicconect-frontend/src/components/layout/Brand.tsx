import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Brand() {
  return (
    <Link to="/" className="brand" aria-label="CivicConnect home">
      <span className="brand__mark">
        <Sparkles size={20} aria-hidden="true" />
      </span>
      <span className="brand__text">
        <span className="brand__name">CivicConnect</span>
        <span className="brand__tagline">Smart Civic, Stronger Community</span>
      </span>
    </Link>
  );
}
