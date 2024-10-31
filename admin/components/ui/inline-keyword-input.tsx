'use client';

import React, { KeyboardEvent, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface InlineKeywordInputProps extends React.HTMLProps<HTMLInputElement> {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
}

export const InlineKeywordInput: React.FC<InlineKeywordInputProps> = ({
  keywords,
  setKeywords,
  className,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && inputValue.trim()) {
      e.preventDefault();
      addKeyword();
    } else if (
      e.key === 'Backspace' &&
      inputValue === '' &&
      keywords.length > 0
    ) {
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  const addKeyword = () => {
    if (inputValue.trim() && !keywords.includes(inputValue.trim())) {
      setKeywords([...keywords, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  const handleWrapperClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <div
        className="flex flex-wrap items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={handleWrapperClick}
      >
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="inline-flex items-center m-1 px-2 py-1 rounded-full text-sm bg-primary text-primary-foreground"
          >
            {keyword}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeKeyword(keyword);
              }}
              className="ml-1 focus:outline-none"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className={cn(
            'flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0',
            className
          )}
          {...props}
          placeholder={keywords.length === 0 ? props.placeholder : ''}
        />
      </div>
    </div>
  );
};
