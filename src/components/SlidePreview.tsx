import { Slide } from '../lib/supabase';

interface SlidePreviewProps {
  slide: Slide;
  theme: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SlidePreview({ slide, theme, isActive, onClick }: SlidePreviewProps) {
  const themeStyles = {
    navy: 'bg-gradient-to-br from-slate-900 to-slate-700 text-white',
    modern: 'bg-gradient-to-br from-blue-600 to-blue-400 text-white',
    minimal: 'bg-white text-slate-900 border-2 border-slate-200',
    dark: 'bg-slate-950 text-white',
  };

  const bgClass = themeStyles[theme as keyof typeof themeStyles] || themeStyles.navy;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
        isActive ? 'ring-4 ring-slate-900 shadow-xl' : 'hover:shadow-lg'
      }`}
    >
      <div className={`aspect-video p-6 flex flex-col justify-center ${bgClass}`}>
        <h3 className="text-lg font-semibold mb-3 line-clamp-2">{slide.title}</h3>
        <div className="space-y-2">
          {slide.content.slice(0, 3).map((block, index) => (
            <div key={index} className="text-xs opacity-60 line-clamp-1">
              {block.type === 'bullet' && '• '}
              {block.value}
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 bg-slate-100 text-xs text-slate-600">
        Slide {slide.order_index + 1}
      </div>
    </div>
  );
}