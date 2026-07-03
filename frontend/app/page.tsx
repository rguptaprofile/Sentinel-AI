/// <reference types="react" />

import { ModuleGrid } from "@/components/module-grid";

const modules = [
  "Digital Arrest Scam Detection",
  "Counterfeit Currency Identification",
  "Fraud Network Graph Intelligence",
  "Geospatial Crime Pattern Intelligence",
  "Citizen Fraud Shield",
];

export default function HomePage() {
  return (
    <div className="page-shell" role="main">
      <section className="hero">
        <div className="hero-mark">
          <span aria-hidden="true" style={{ fontSize: 28, lineHeight: 1 }}>
            🛡️
          </span>
        </div>
        <div>
          <p className="eyebrow">Public safety intelligence</p>
          <h1>SentinelAI</h1>
          <p className="lede">
            Frontend scaffold for command center, citizen, police, bank, map, and chatbot workflows.
          </p>
        </div>
      </section>
      <ModuleGrid modules={modules} />
    </div>
  );
}
