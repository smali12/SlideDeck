import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Slide } from '../lib/supabase';

interface PresentModeProps {
  slides: Slide[];
  theme: string;
  onExit: () => void;
}

export function PresentMode({ slides, theme, onExit }: PresentModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes(!showNotes);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showNotes]);

  function nextSlide() {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  const currentSlide = slides[currentIndex];

  const themeStyles = {
    navy: 'bg-gradient-to-br from-slate-900 to-slate-700 text-white',
    modern: 'bg-gradient-to-br from-blue-600 to-blue-400 text-white',
    minimal: 'bg-white text-slate-900',
    dark: 'bg-slate-950 text-white',
  };

  const bgClass = themeStyles[theme as keyof typeof themeStyles] || themeStyles.navy;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
        >
          {showNotes ? 'Hide' : 'Show'} Notes
        </button>
        <button
          onClick={onExit}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="h-full flex">
        <div className={`flex-1 flex items-center justify-center p-16 ${bgClass}`}>
          <div className="max-w-5xl w-full">
            <h1 className="text-6xl font-light mb-12">{currentSlide.title}</h1>
            <div className="space-y-6">
              {currentSlide.content.map((block, index) => (
                <div key={index}>
                  {block.type === 'heading' && (
                    <h2 className="text-4xl font-semibold mb-4">{block.value}</h2>
                  )}
                  {block.type === 'text' && (
                    <p className="text-2xl leading-relaxed opacity-90">{block.value}</p>
                  )}
                  {block.type === 'bullet' && (
                    <div className="flex items-start gap-4 text-2xl">
                      <span className="mt-2">•</span>
                      <span className="flex-1">{block.value}</span>
                    </div>
                  )}
                  {block.type === 'code' && (
                    <pre className="bg-slate-900 text-green-400 p-6 rounded-lg text-lg font-mono overflow-auto">
                      <code>{block.value}</code>
                    </pre>
                  )}
                  {block.type === 'image' && block.value && (
                    <img
                      src={block.value}
                      alt="Slide content"
                      className="max-w-full h-auto rounded-lg shadow-2xl"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {showNotes && (
          <div className="w-96 bg-slate-900 text-white p-8 overflow-auto border-l border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Presenter Notes</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {currentSlide.notes || 'No notes for this slide'}
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-6">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="px-6 py-3 bg-white/10 text-white rounded-lg backdrop-blur-sm">
          {currentIndex + 1} / {slides.length}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentIndex === slides.length - 1}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm">
        Use arrow keys or space to navigate • Press N for notes • ESC to exit
      </div>
    </div>
  );
}