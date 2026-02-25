"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const industries: string[] = [
  "Agriculture, Food & Beverage",
  "Business Services & Consulting",
  "Learning & Education",
  "Construction & Real Estate",
  "Fashion & Beauty",
  "Finance & Legal",
  "Healthcare & Wellness",
  "Home, Gardens & Outdoors",
  "Jewellery & Timepieces",
  "Media & Entertainment",
  "Security, Safety & Equipment",
  "Technology, Games & Electronic",
  "Vehicle & Transportation",
];

export const countries: string[] = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function computeMatchPercent(industry: string, location: string, type: string) {
  const base = hashString(industry + location + type);
  return 40 + (base % 56);
}

export default function Solutions() {
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchStep, setMatchStep] = useState<"form" | "result">("form");
  const [matchData, setMatchData] = useState<{
    industry: string;
    location: string;
    type: string;
  } | null>(null);

  const openMatchModal = () => {
    setShowMatchModal(true);
    setMatchStep("form");
    setMatchData(null);
  };

  const closeMatchModal = () => {
    setShowMatchModal(false);
    setMatchStep("form");
    setMatchData(null);
  };

  return (
    <>
      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-red-50 text-bb-red border border-red-100 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              From Demand Signals to Growth Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Step n={1} title="Buyer Demand Flows In" />
            <Step n={2} title="Businesses Get Ranked" />
            <Step n={3} title="Smart Matches Are Made" />
            <Step n={4} title="Growth Compounds" />
          </div>

        </div>
      </section>

      {/* Solutions Cards */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-red-50 text-bb-red border border-red-100 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Our Unique Solution and Capabilities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need to Succeed
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card 1 - Reach Ranking */}
            <Card
              badge="Core"
              iconBg="bg-primary text-white"
              title="Reach Ranking™"
              description="Track your business's visibility and demand ranking in real-time. See how buyers perceive your brand and discover opportunities to increase your reach."
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Card>

            {/* Card 2 - Buyer Requests */}
            <Card
              badge="Demand"
              iconBg="bg-primary text-white"
              title="Buyer Requests & Intent Signals"
              description="Access verified buyer requests and intent signals from businesses actively seeking products and services like yours."
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Card>

            {/* Card 3 - Featured Visibility */}
            <Card
              badge="Visibility"
              iconBg="bg-primary text-white"
              title="Featured Business Visibility"
              description="Get featured prominently to attract more buyers. Stand out with enhanced visibility and showcase your offerings to a wider audience."
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Card>

            {/* Card 4 - Find My Match */}
            <Card 
              badge="Matching" 
              iconBg="bg-primary text-white" 
              title="Find My Match™"
              description="Our smart AI algorithm matches you with ideal buyers, partners, and investors based on your business profile and preferences."
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Card>

            {/* Card 5 - BizCenter */}
            <Card 
              badge="Intelligence" 
              iconBg="bg-primary text-white" 
              title="BizCenter™"
              description="Your dedicated business hub to manage partnerships, track deals, and showcase your brand to potential buyers and investors."
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3.75 7.5l5.25 3.75 4.5-2.25 4.5 2.25v9.75a1.5 1.5 0 01-1.5 1.5h-13.5a1.5 1.5 0 01-1.5-1.5V7.5z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.25 7.5h18" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 7.5v6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Card>

            {/* Card 6 - Credibility */}
            <Card 
              badge="Trust" 
              iconBg="bg-primary text-white" 
              title="Credibility Signals & Recognition"
              description="Build trust with verified badges, reviews, and recognition from industry leaders. Showcase your credibility to attract more business."
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01.4 1.258A38.484 38.484 0 0112 21.75a38.484 38.484 0 01-11.23-11.77.75.75 0 01.4-1.258 60.65 60.65 0 0110.53-5.917z"/>
              </svg>
            </Card>

          </div>

          {/* Find Business Match Link - under all cards */}
          <div className="mt-12 text-center">
            <button
              onClick={openMatchModal}
              className="inline-flex items-center gap-2 text-black font-semibold underline-offset-4 hover:underline"
            >
              Find your business match
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Match Modal */}
      {showMatchModal && matchStep === "form" && (
        <MatchFormModal
          onClose={closeMatchModal}
          onSubmit={(data) => {
            setMatchData(data);
            setMatchStep("result");
          }}
        />
      )}

      {showMatchModal && matchStep === "result" && matchData && (
        <MatchResultModal onClose={closeMatchModal} data={matchData} />
      )}
    </>
  );
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <div className="relative group">
      <div className="text-red-500 font-mono text-lg font-bold mb-3">
        {n} →
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        We aggregate thousands of real-time requests from verified buyers looking for services and products globally.
      </p>
    </div>
  );
}

type CardProps = {
  badge: string;
  iconBg: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

function Card({ badge, iconBg, title, description, children }: CardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-bb-red/30 hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${iconBg}`}>
          {children}
        </div>
        <span className="bg-bb-redLight text-bb-red text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
          {badge}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-bb-red transition-colors">
        {title}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

//////////////////////////////////////////////////////////
// MODAL SHELL
//////////////////////////////////////////////////////////
function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 z-10">
        {children}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////
// SEARCHABLE SELECT
//////////////////////////////////////////////////////////
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="relative">
      {/* Input */}
      <input
        value={open ? query : value}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full border rounded-lg px-4 py-3"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-lg border bg-white shadow-lg">
          {filtered.length === 0 && (
            <div className="px-4 py-2 text-gray-500 text-sm">No results</div>
          )}

          {filtered.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setQuery(opt);
                setOpen(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-50"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

//////////////////////////////////////////////////////////
// MATCH FORM MODAL
//////////////////////////////////////////////////////////
function MatchFormModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: {
    industry: string;
    location: string;
    type: string;
  }) => void;
}) {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-2xl font-bold mb-3 text-gray-900">
        Find Business Match
      </h2>

      <p className="text-gray-600 mb-6">
        Select your business filters to discover matching opportunities
      </p>

      <div className="space-y-4">
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">Industry</option>
          {industries.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>

        <SearchableSelect
          options={countries}
          value={location}
          onChange={setLocation}
          placeholder="Location"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">Opportunity Type</option>
          <option>Buyers</option>
          <option>Partners</option>
          <option>Investors</option>
        </select>
      </div>

      <button
        onClick={() => onSubmit({ industry, location, type })}
        className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold"
      >
        Find Matches
      </button>
    </ModalShell>
  );
}

//////////////////////////////////////////////////////////
// MATCH RESULT MODAL
//////////////////////////////////////////////////////////
function MatchResultModal({
  onClose,
  data,
}: {
  onClose: () => void;
  data: { industry: string; location: string; type: string };
}) {
  const percent = computeMatchPercent(data.industry, data.location, data.type);

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        We found <span className="text-primary">{percent}%</span> business match
        for you
      </h2>

      <p className="text-gray-600 mb-6">This estimate is based on:</p>

      <ul className="text-left space-y-2 mb-6 text-gray-700">
        <li>Business match based on your selection</li>
        <li>Live opportunities available</li>
        <li>Industry participation</li>
      </ul>

      {/* LOCKED MATCHES */}
      <div className="relative border rounded-xl p-5 mb-6 overflow-hidden">
        <div className="blur-sm select-none pointer-events-none">
          <div className="font-semibold mb-2">Matches found</div>
          <div className="h-3 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded mb-2 w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/70">
          <div className="text-xl mb-2">&#128274;</div>
          <div className="font-semibold">
            See all your matched opportunities
          </div>
        </div>
      </div>

      <button
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
        onClick={() =>
          (window.location.href = "https://businessbosses.onelink.me/xLWk/36a2ff16")
        }
      >
        Signup / Login
      </button>
    </ModalShell>
  );
}
