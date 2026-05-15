import InstitutionalHeader from './components/InstitutionalHeader';
import HeroSection from './components/HeroSection';
import QuickFilters from './components/QuickFilters';
import TrendChart from './components/TrendChart';
import RegionalChart from './components/RegionalChart';
import DataTable from './components/DataTable';
import InstitutionalFooter from './components/InstitutionalFooter';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <InstitutionalHeader />

      <HeroSection />

      <QuickFilters />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Main chart: Trend with benchmarks */}
        <TrendChart />

        {/* Regional comparison + data table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RegionalChart />
          <DataTable />
        </div>
      </main>

      <InstitutionalFooter />
    </div>
  );
}

export default App;
