import InstitutionalHeader from './components/InstitutionalHeader';
import HeroSection from './components/HeroSection';
import MapSection from './components/MapSection';
import OilPriceSection from './components/OilPriceSection';
import InstitutionalFooter from './components/InstitutionalFooter';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <HeroSection />

      <MapSection />

      <OilPriceSection />

      <InstitutionalFooter />
    </div>
  );
}

export default App;
