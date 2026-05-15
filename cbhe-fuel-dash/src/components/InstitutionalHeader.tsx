export default function InstitutionalHeader() {
  return (
    <header className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          {/* CBHE monogram */}
          <div className="w-10 h-10 rounded bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-sm tracking-tight flex-shrink-0">
            CBHE
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Observatorio de Precios de Combustibles
            </h1>
            <p className="text-xs text-slate-300">
              Cámara Boliviana de Hidrocarburos y Energía
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
