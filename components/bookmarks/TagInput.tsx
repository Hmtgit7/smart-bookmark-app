'use client';

import { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    disabled?: boolean;
}

export function TagInput({ tags, onChange, disabled = false }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    function addTag(value: string) {
        const cleaned = value.trim().toLowerCase().replace(/^#/, '');
        if (cleaned && !tags.includes(cleaned) && tags.length < 10) {
            onChange([...tags, cleaned]);
        }
        setInputValue('');
    }

    function removeTag(tag: string) {
        onChange(tags.filter((t) => t !== tag));
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    }

    return (
        <div
            className={`min-h-10 flex flex-wrap gap-1.5 items-center border rounded-md px-3 py-2 ${disabled ? 'opacity-50 cursor-not-allowed bg-muted' : 'bg-background focus-within:ring-1 focus-within:ring-ring'}`}
        >
            {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs gap-1 pr-1">
                    #{tag}
                    {!disabled && (
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-destructive transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </Badge>
            ))}
            {!disabled && (
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => inputValue && addTag(inputValue)}
                    placeholder={tags.length === 0 ? 'Add tags (press Enter or comma)' : ''}
                    className="flex-1 min-w-24 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                    disabled={disabled}
                />
            )}
        </div>
    );
}
