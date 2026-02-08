import { useState } from 'react';
import { PresentationList } from './components/PresentationList';
import { PresentationEditor } from './components/PresentationEditor';
import { supabase } from './lib/supabase';

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'editor'>('list');
  const [selectedPresentationId, setSelectedPresentationId] = useState<string | null>(null);

  async function handleNewPresentation() {
    const { data, error } = await supabase
      .from('presentations')
      .insert({
        title: 'Untitled Presentation',
        theme: 'navy',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating presentation:', error);
      return;
    }

    setSelectedPresentationId(data.id);
    setCurrentView('editor');
  }

  function handleSelectPresentation(id: string) {
    setSelectedPresentationId(id);
    setCurrentView('editor');
  }

  function handleBackToList() {
    setCurrentView('list');
    setSelectedPresentationId(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === 'list' ? (
        <PresentationList
          onSelectPresentation={handleSelectPresentation}
          onNewPresentation={handleNewPresentation}
        />
      ) : selectedPresentationId ? (
        <PresentationEditor
          presentationId={selectedPresentationId}
          onBack={handleBackToList}
        />
      ) : null}
    </div>
  );
}

export default App;
