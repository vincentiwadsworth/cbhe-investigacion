import InstitutionalHeader from './components/InstitutionalHeader';
import HeroSection from './components/HeroSection';
import MapSection from './components/MapSection';
import TrendChart from './components/TrendChart';
import InstitutionalFooter from './components/InstitutionalFooter';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <HeroSection />

      {/* Section 2: Map + Ranking with inline filters */}
      <MapSection />

      {/* Section 3: Oil price trend (interim — replaced by OilPriceSection in PR 3) */}
      <div className="max-w-7xl w-full mx-auto px-4 py-6">
        <TrendChart />
      </div>

      <InstitutionalFooter />
    </div>
  );
}

export default App;
