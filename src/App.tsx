/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapComponent } from './components/MapComponent';
import { BottomSheet } from './components/BottomSheet';
import { HeaderNav } from './components/HeaderNav';
import { ProjectPassportModal } from './components/ProjectPassportModal';
import { HISTORICAL_POINTS, HistoricalPoint } from './data/historicalData';

export default function App() {
  const [selectedPoint, setSelectedPoint] = useState<HistoricalPoint | null>(
    HISTORICAL_POINTS[0]
  );
  // Initial state is 'half' as requested: "бет ашылғанда төменнен сырғып шығатын заманауи мобильді панель"
  const [sheetState, setSheetState] = useState<'collapsed' | 'half' | 'expanded'>('half');
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  const handleSelectPoint = (pt: HistoricalPoint) => {
    setSelectedPoint(pt);
  };

  const handleOpenPanel = () => {
    if (sheetState === 'collapsed') {
      setSheetState('half');
    }
  };

  const handleToggleSheet = () => {
    setSheetState((prev) => (prev === 'collapsed' ? 'half' : 'collapsed'));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans select-none">
      {/* Top Navigation */}
      <HeaderNav
        onOpenPassport={() => setIsPassportOpen(true)}
        onSelectPoint={handleSelectPoint}
        onToggleSheet={handleToggleSheet}
      />

      {/* Main Map View Area */}
      <main className="w-full h-full pt-14 pb-16">
        <MapComponent
          selectedPoint={selectedPoint}
          onSelectPoint={handleSelectPoint}
          onOpenPanel={handleOpenPanel}
        />
      </main>

      {/* Modern Bottom Sheet with Scientific Dossier */}
      <BottomSheet
        sheetState={sheetState}
        setSheetState={setSheetState}
        selectedPoint={selectedPoint}
        onSelectPoint={handleSelectPoint}
      />

      {/* Scientific Research Project Passport Modal */}
      <ProjectPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
      />
    </div>
  );
}
