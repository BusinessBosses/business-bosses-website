import React from "react";

export default function Solutions() {
  return (
    <>
      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-bb-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
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
      <section className="py-24 bg-white">
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

            {/* Card 1 */}
            <Card
              badge="Core"
              iconBg="bg-primary text-white"
              title="Reach Ranking™"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Card>

            {/* Card 2 */}
            <Card
              badge="Demand"
              iconBg="bg-primary text-white"
              title="Buyer Requests & Intent Signals"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Card>

            {/* Card 3 */}
            <Card
              badge="Visibility"
              iconBg="bg-primary text-white"
              title="Featured Business Visibility"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Card>

            {/* Card 4 */}
            <Card badge="Matching" iconBg="bg-primary text-white" title="Find My Match™">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Card>

            {/* Card 5 */}
            <Card badge="Intelligence" iconBg="bg-primary text-white" title="BizCenter™">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Card>

            {/* Card 6 */}
            <Card badge="Trust" iconBg="bg-primary text-white" title="Credibility Signals & Recognition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01.4 1.258A38.484 38.484 0 0112 21.75a38.484 38.484 0 01-11.23-11.77.75.75 0 01.4-1.258 60.65 60.65 0 0110.53-5.917z"/>
              </svg>
            </Card>

          </div>
        </div>
      </section>
    </>
  );
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <div className="relative group">
      <div className="text-bb-red font-mono text-lg font-bold mb-3">
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
  children: React.ReactNode;
};

function Card({ badge, iconBg, title, children }: CardProps) {
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
        Powerful tools to help your business grow and connect globally.
      </p>
    </div>
  );
}
