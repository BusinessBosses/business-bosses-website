import React, { useState } from "react";
import { useNavigate } from "react-router";
import RoutesPath from "../../../../constants/Routes";

type Flow = "ranking" | "match" | null;
type Step = "form" | "result" | null;

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

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // 32bit
  }
  return Math.abs(hash);
}

function computeRankingPercent(
  name: string,
  industry: string,
  location: string,
) {
  const base = hashString(name + industry + location);

  // Top 5–40%
  return 5 + (base % 36);
}

function computeMatchPercent(industry: string, location: string, type: string) {
  const base = hashString(industry + location + type);

  // 40–95% match
  return 40 + (base % 56);
}

export default function Hero() {
  const [flow, setFlow] = useState<Flow>(null);
  const [step, setStep] = useState<Step>(null);

  const openRanking = () => {
    setFlow("ranking");
    setStep("form");
  };

  const openMatch = () => {
    setFlow("match");
    setStep("form");
  };

  const close = () => {
    setFlow(null);
    setStep(null);
  };

  const [rankingData, setRankingData] = useState<any>(null);
  const [matchData, setMatchData] = useState<any>(null);

  return (
    <section className="relative bg-white pt-20 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
          THE BUSINESS <span className="text-primary">DEMAND</span> ENGINE
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
          Rank, match, and connect with real-time business opportunities. Use
          demand intelligence to reach buyers, partners, and investors
          worldwide.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={openRanking}
            className="bg-primary text-white px-8 py-4 rounded-full font-semibold"
          >
            Check your Reach Ranking
          </button>

          <button
            onClick={openMatch}
            className="border px-8 py-4 rounded-full font-semibold"
          >
            Find Business Match
          </button>
        </div>
      </div>

      {/* FLOW SWITCH */}
      {flow === "ranking" && step === "form" && (
        <RankingFormModal
          onClose={close}
          onSubmit={(data) => {
            setRankingData(data);
            setStep("result");
          }}
        />
      )}

      {flow === "ranking" && step === "result" && (
        <RankingResultModal onClose={close} data={rankingData} />
      )}

      {flow === "match" && step === "form" && (
        <MatchFormModal
          onClose={close}
          onSubmit={(data) => {
            setMatchData(data);
            setStep("result");
          }}
        />
      )}

      {flow === "match" && step === "result" && (
        <MatchResultModal onClose={close} data={matchData} />
      )}
    </section>
  );
}

//////////////////////////////////////////////////////////
// MATCH FORM
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
// MATCH RESULT
//////////////////////////////////////////////////////////
function MatchResultModal({
  onClose,
  data,
}: {
  onClose: () => void;
  data: { industry: string; location: string; type: string };
}) {
  const percent = computeMatchPercent(data.industry, data.location, data.type);
  const navigate = useNavigate();

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        We found <span className="text-primary">{percent}%</span> business match
        for you
      </h2>

      <p className="text-gray-600 mb-6">This estimate is based on:</p>

      <ul className="text-left space-y-2 mb-6 text-gray-700">
        <li>• Business match based on your selection</li>
        <li>• Live opportunities available</li>
        <li>• Industry participation</li>
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
          <div className="text-xl mb-2">🔒</div>
          <div className="font-semibold">
            See all your matched opportunities
          </div>
        </div>
      </div>

      <button
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
        onClick={() => navigate(RoutesPath.login)}
      >
        Signup / Login
      </button>
    </ModalShell>
  );
}

//////////////////////////////////////////////////////////
// RANKING FORM + RESULT (unchanged)
//////////////////////////////////////////////////////////
function RankingFormModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    industry: string;
    location: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-2xl font-bold mb-3 text-gray-900">
        Check your Reach Ranking
      </h2>

      <p className="text-gray-600 mb-6">
        See your reach rank based on live buyer demand and interest
      </p>

      <div className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Business name"
          className="w-full border rounded-lg px-4 py-3"
        />

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
      </div>

      <button
        onClick={() => onSubmit({ name, industry, location })}
        className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold"
      >
        View My Ranking
      </button>
    </ModalShell>
  );
}

function RankingResultModal({
  onClose,
  data,
}: {
  onClose: () => void;
  data: { name: string; industry: string; location: string };
}) {
  const percent = computeRankingPercent(
    data.name,
    data.industry,
    data.location,
  );

  const navigate = useNavigate();

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        You’re currently ranked in the{" "}
        <span className="text-primary">Top {percent}%</span>
      </h2>

      <p className="text-gray-600 mb-6">This estimate is based on:</p>

      <ul className="text-left space-y-2 mb-6 text-gray-700">
        <li>• Business activity</li>
        <li>• Live buyer demand and interest</li>
        <li>• Industry participation</li>
      </ul>

      {/* LOCKED BREAKDOWN */}
      <div className="relative border rounded-xl p-5 mb-6 overflow-hidden">
        <div className="blur-sm select-none pointer-events-none">
          <div className="font-semibold mb-2">Full Reach Score Breakdown</div>
          <div className="h-3 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded mb-2 w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/70">
          <div className="text-xl mb-2">🔒</div>
          <div className="font-semibold">
            Unlock your full Reach Ranking details
          </div>
        </div>
      </div>

      <button
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
        onClick={() => navigate(RoutesPath.login)}
      >
        Signup / Login
      </button>
    </ModalShell>
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
          ✕
        </button>
      </div>
    </div>
  );
}
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
