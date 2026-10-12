import React from 'react';
import { X, Award, FileText, CheckCircle2, BookmarkCheck, Library, Globe } from 'lucide-react';
import { SCIENTIFIC_PROJECT_DATA } from '../data/historicalData';

interface ProjectPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectPassportModal: React.FC<ProjectPassportModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const data = SCIENTIFIC_PROJECT_DATA;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-100 text-sm sm:text-base">
                Ғылыми-зерттеу жобасының ресми паспорты
              </h3>
              <p className="text-[11px] text-amber-400">
                Қазақстан тарихы және цифрлық гуманитаристика бағыты
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-300">
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Жоба тақырыбы:
            </span>
            <p className="font-bold text-stone-100 text-sm sm:text-base leading-snug">
              {data.title}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-stone-950/50 border border-stone-800">
              <span className="text-[11px] text-stone-400 block mb-1">Ғылыми бағыты:</span>
              <p className="font-semibold text-stone-200">{data.field}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950/50 border border-stone-800">
              <span className="text-[11px] text-stone-400 block mb-1">Зерттеу нысаны:</span>
              <p className="font-semibold text-stone-200">
                Рабия Сұлтан Бегім тұлғасы және Түркістандағы кесенесі
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/50 border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">Зерттеу пәні:</span>
            <p className="font-semibold text-stone-200">
              XV ғасырдағы Дешті Қыпшақ пен Мауереннахр арасындағы дипломатиялық, саяси және мәдени байланыстарды нығайту тетіктері, сәулет өнерінің сабақтастығы.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-300 font-bold mb-1.5 text-xs">
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <span>Ғылыми жаңашылдығы:</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Рабия Сұлтан Бегімнің тарихи тұлғасы мен кесене сәулетін дәстүрлі кітаби сипаттау шеңберінен шығарып, Leaflet.js геоақпараттық технологиясы, заманауи интерактивті UI панелі (Bottom Sheet) және AI талдау құралдарымен кешенді цифрлық форматта насихаттау.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800">
            <div className="flex items-center gap-2 text-stone-200 font-bold mb-2 text-xs">
              <Library className="w-4 h-4 text-amber-400" />
              <span>Негізгі тарихи дереккөздер мен әдебиеттер:</span>
            </div>
            <ul className="space-y-1 text-xs text-stone-400">
              <li>• Мырза Мұхаммед Хайдар Дулати. «Тарих-и Рашиди»</li>
              <li>• Фазлаллах ибн Рузбихан Исфахани. «Михман-наме-йи Бухара»</li>
              <li>• Ш.И. Вяткин. «Түркістан сәулет ескерткіштерін зерттеу материалдары»</li>
              <li>• ҚР Ұлттық Ғылым академиясының археологиялық есептері мен «Әзірет Сұлтан» қорық-музейінің ғылыми қорлары</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
          >
            Түсінікті, жабу
          </button>
        </div>
      </div>
    </div>
  );
};
