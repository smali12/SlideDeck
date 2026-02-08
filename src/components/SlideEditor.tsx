import { useState } from 'react';
import { Slide, ContentBlock } from '../lib/supabase';
import { Type, List, Image as ImageIcon, Code, Trash2 } from 'lucide-react';

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (updates: Partial<Slide>) => void;
}

export function SlideEditor({ slide, onUpdate }: SlideEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function addContentBlock(type: ContentBlock['type']) {
    const newBlock: ContentBlock = {
      type,
      value: type === 'heading' ? 'New Heading' : type === 'bullet' ? 'New bullet point' : '',
      level: type === 'heading' ? 2 : undefined
    };
    onUpdate({ content: [...slide.content, newBlock] });
  }

  function updateBlock(index: number, updates: Partial<ContentBlock>) {
    const newContent = [...slide.content];
    newContent[index] = { ...newContent[index], ...updates };
    onUpdate({ content: newContent });
  }

  function removeBlock(index: number) {
    const newContent = slide.content.filter((_, i) => i !== index);
    onUpdate({ content: newContent });
  }

  function moveBlock(index: number, direction: 'up' | 'down') {
    const newContent = [...slide.content];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newContent.length) return;
    [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
    onUpdate({ content: newContent });
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-slate-200">
        <input
          type="text"
          value={slide.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="text-3xl font-light text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-slate-900 rounded px-2 py-1"
          placeholder="Slide Title"
        />
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {slide.content.map((block, index) => (
            <div
              key={index}
              className="group relative bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  {block.type === 'heading' && (
                    <input
                      type="text"
                      value={block.value}
                      onChange={(e) => updateBlock(index, { value: e.target.value })}
                      className="text-2xl font-semibold text-slate-900 w-full bg-transparent focus:outline-none"
                      placeholder="Heading"
                    />
                  )}
                  {block.type === 'text' && (
                    <textarea
                      value={block.value}
                      onChange={(e) => updateBlock(index, { value: e.target.value })}
                      className="text-base text-slate-700 w-full bg-transparent focus:outline-none resize-none"
                      rows={3}
                      placeholder="Enter text..."
                    />
                  )}
                  {block.type === 'bullet' && (
                    <div className="flex items-start gap-2">
                      <span className="text-slate-900 mt-1">•</span>
                      <input
                        type="text"
                        value={block.value}
                        onChange={(e) => updateBlock(index, { value: e.target.value })}
                        className="flex-1 text-base text-slate-700 bg-transparent focus:outline-none"
                        placeholder="Bullet point"
                      />
                    </div>
                  )}
                  {block.type === 'code' && (
                    <textarea
                      value={block.value}
                      onChange={(e) => updateBlock(index, { value: e.target.value })}
                      className="text-sm font-mono text-slate-900 w-full bg-slate-900 text-green-400 p-3 rounded focus:outline-none resize-none"
                      rows={5}
                      placeholder="// Enter code..."
                    />
                  )}
                  {block.type === 'image' && (
                    <input
                      type="text"
                      value={block.value}
                      onChange={(e) => updateBlock(index, { value: e.target.value })}
                      className="text-sm text-slate-600 w-full bg-transparent focus:outline-none"
                      placeholder="Image URL"
                    />
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === slide.content.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeBlock(index)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => addContentBlock('heading')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Type size={16} />
            Add Heading
          </button>
          <button
            onClick={() => addContentBlock('text')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Type size={16} />
            Add Text
          </button>
          <button
            onClick={() => addContentBlock('bullet')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <List size={16} />
            Add Bullet
          </button>
          <button
            onClick={() => addContentBlock('code')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Code size={16} />
            Add Code
          </button>
          <button
            onClick={() => addContentBlock('image')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ImageIcon size={16} />
            Add Image
          </button>
        </div>
      </div>

      <div className="p-6 border-t border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">Presenter Notes</label>
        <textarea
          value={slide.notes || ''}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
          rows={3}
          placeholder="Add notes for this slide..."
        />
      </div>
    </div>
  );
}