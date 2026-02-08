import { useState, useEffect } from 'react';
import { Plus, Presentation as PresentationIcon, Calendar } from 'lucide-react';
import { supabase, Presentation } from '../lib/supabase';

interface PresentationListProps {
  onSelectPresentation: (id: string) => void;
  onNewPresentation: () => void;
}

export function PresentationList({ onSelectPresentation, onNewPresentation }: PresentationListProps) {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPresentations();
  }, []);

  async function loadPresentations() {
    try {
      const { data, error } = await supabase
        .from('presentations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setPresentations(data || []);
    } catch (error) {
      console.error('Error loading presentations:', error);
      setPresentations([]);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading presentations...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-light text-slate-900 mb-2">Your Presentations</h1>
          <p className="text-slate-600">Create and manage your slide decks</p>
        </div>
        <button
          onClick={onNewPresentation}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus size={20} />
          New Presentation
        </button>
      </div>

      {presentations.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <PresentationIcon size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-medium text-slate-700 mb-2">No presentations yet</h3>
          <p className="text-slate-500 mb-6">Get started by creating your first presentation</p>
          <button
            onClick={onNewPresentation}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus size={20} />
            Create Presentation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((presentation) => (
            <div
              key={presentation.id}
              onClick={() => onSelectPresentation(presentation.id)}
              className="group cursor-pointer bg-white rounded-xl border border-slate-200 hover:border-slate-900 hover:shadow-xl transition-all duration-200"
            >
              <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-700 rounded-t-xl flex items-center justify-center">
                <PresentationIcon size={48} className="text-white/30" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-medium text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                  {presentation.title}
                </h3>
                {presentation.description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{presentation.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar size={14} />
                  <span>Updated {formatDate(presentation.updated_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}