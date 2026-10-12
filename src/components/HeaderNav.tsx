import React from 'react';
import { Crown, FileText, MapPin, Sparkles, Menu, Compass } from 'lucide-react';
import { HISTORICAL_POINTS, HistoricalPoint } from '../data/historicalData';

interface HeaderNavProps {
  onOpenPassport: () => void;
  onSelectPoint: (point: HistoricalPoint) => void;
  onToggleSheet: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenPassport,
  onSelectPoint,
  onToggleSheet,
}) => {
  const handleFocusRabiya = () => {
    onSelectPoint(HISTORICAL_POINTS[0]);
    onToggleSheet();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[450] px-3 sm:px-6 py-2.5 bg-stone-950/85 backdrop-blur-xl border-b border-amber-500/30 flex items-center justify-between">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div
          onClick={handleFocusRabiya}
          className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-teal-600 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <Crown className="w-5 h-5 text-amber-200" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-extrabold text-stone-100 tracking-tight flex items-center gap-1.5">
              <span>Рабия Сұлтан Бегім</span>
              <span className="hidden md:inline text-amber-400 font-normal">|</span>
              <span className="hidden md:inline text-stone-300 font-medium text-xs">
                Ұлы даланың ықпалды ханшайымы
              </span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
              XV ғ.
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-stone-400 truncate max-w-xs sm:max-w-md">
            Түркістандағы кесене & Leaflet геоақпараттық платформасы
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenPassport}
          className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition active:scale-95 shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Жоба паспорты</span>
          <span className="sm:hidden">Паспорт</span>
        </button>

        <button
          onClick={handleFocusRabiya}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-lg"
        >
          <MapPin className="w-3.5 h-3.5 text-stone-950" />
          <span className="hidden sm:inline">Кесенені ашу</span>
          <span className="sm:hidden">Кесене</span>
        </button>
      </div>
    </header>
  );
};
