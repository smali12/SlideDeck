import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Play, Trash2, Settings } from 'lucide-react';
import { supabase, Presentation, Slide } from '../lib/supabase';
import { SlideEditor } from './SlideEditor';
import { SlidePreview } from './SlidePreview';
import { PresentMode } from './PresentMode';

interface PresentationEditorProps {
  presentationId: string;
  onBack: () => void;
}

export function PresentationEditor({ presentationId, onBack }: PresentationEditorProps) {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresentMode, setIsPresentMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPresentation();
    loadSlides();
  }, [presentationId]);

  async function loadPresentation() {
    try {
      const { data, error } = await supabase
        .from('presentations')
        .select('*')
        .eq('id', presentationId)
        .maybeSingle();

      if (error) {
        console.error('Error loading presentation:', error);
        return;
      }
      setPresentation(data);
    } finally {
      setLoading(false);
    }
  }

  async function loadSlides() {
    try {
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .eq('presentation_id', presentationId)
        .order('order_index');

      if (error) {
        console.error('Error loading slides:', error);
        return;
      }
      setSlides(data || []);
    } catch (error) {
      console.error('Error in loadSlides:', error);
    }
  }

  async function addSlide() {
    const newSlide = {
      presentation_id: presentationId,
      order_index: slides.length,
      title: `Slide ${slides.length + 1}`,
      content: [],
      layout: 'title-content',
    };

    const { data, error } = await supabase
      .from('slides')
      .insert(newSlide)
      .select()
      .single();

    if (error) {
      console.error('Error adding slide:', error);
      return;
    }
    setSlides([...slides, data]);
    setCurrentSlideIndex(slides.length);
  }

  async function updateSlide(slideId: string, updates: Partial<Slide>) {
    const { error } = await supabase
      .from('slides')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', slideId);

    if (error) {
      console.error('Error updating slide:', error);
      return;
    }

    setSlides(slides.map(s => s.id === slideId ? { ...s, ...updates } : s));
  }

  async function deleteSlide(slideId: string) {
    const { error } = await supabase
      .from('slides')
      .delete()
      .eq('id', slideId);

    if (error) {
      console.error('Error deleting slide:', error);
      return;
    }

    const newSlides = slides.filter(s => s.id !== slideId);
    setSlides(newSlides);
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(Math.max(0, newSlides.length - 1));
    }
  }

  async function updatePresentation(updates: Partial<Presentation>) {
    const { error } = await supabase
      .from('presentations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', presentationId);

    if (error) {
      console.error('Error updating presentation:', error);
      return;
    }

    if (presentation) {
      setPresentation({ ...presentation, ...updates });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400">Loading presentation...</div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400">Presentation not found</div>
      </div>
    );
  }

  if (isPresentMode) {
    return (
      <PresentMode
        slides={slides}
        theme={presentation.theme}
        onExit={() => setIsPresentMode(false)}
      />
    );
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <input
                type="text"
                value={presentation.title}
                onChange={(e) => updatePresentation({ title: e.target.value })}
                className="text-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded px-2 py-1"
              />
              <p className="text-sm text-slate-500">{slides.length} slides</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings size={18} />
              Settings
            </button>
            <button
              onClick={() => setIsPresentMode(true)}
              disabled={slides.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={18} />
              Present
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
            <div className="flex gap-2">
              {['navy', 'modern', 'minimal', 'dark'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => updatePresentation({ theme })}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    presentation.theme === theme
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r border-slate-200 overflow-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">Slides</h3>
            <button
              onClick={addSlide}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div key={slide.id} className="relative group">
                <SlidePreview
                  slide={slide}
                  theme={presentation.theme}
                  isActive={index === currentSlideIndex}
                  onClick={() => setCurrentSlideIndex(index)}
                />
                <button
                  onClick={() => deleteSlide(slide.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-hidden">
          {currentSlide ? (
            <SlideEditor
              slide={currentSlide}
              onUpdate={(updates) => updateSlide(currentSlide.id, updates)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-slate-500 mb-4">No slides yet</p>
                <button
                  onClick={addSlide}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Plus size={20} />
                  Add First Slide
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}