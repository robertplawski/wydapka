import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import type { Translations } from '../lib/i18n';

export const DONT_SHOW_KEY = 'wydapka-hide-mobile-prompt';

function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isSmallScreen = window.innerWidth < 768;
  return !isMobile && !isSmallScreen;
}

interface MobilePromptProps {
  t: Translations;
}

export function MobilePrompt({ t }: MobilePromptProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dontShow = localStorage.getItem(DONT_SHOW_KEY);
    if (dontShow === 'true') return;

    if (isDesktop()) {
      setIsVisible(true);
    }
  }, []);

  const handleDontShowAgain = () => {
    localStorage.setItem(DONT_SHOW_KEY, 'true');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          {t.openOnMobile || 'Open on Mobile'}
        </h2>

        <div className="flex justify-center mb-4 border-8 border-white">
          <QRCodeSVG value={currentUrl} size={200} />
        </div>

        <button
          onClick={handleDontShowAgain}
          className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm"
        >
          {t.dontShowAgain || "Don't show again"}
        </button>
      </div>
    </div>
  );
}
