'use client';

import React, { useEffect, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BaseHeading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import ListKeymap from '@tiptap/extension-list-keymap';
import TextAlign from '@tiptap/extension-text-align';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { useEditor, EditorContent } from '@tiptap/react';
import { mergeAttributes } from '@tiptap/core';

import { Toggle } from './toggle';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronsUpDown,
  IndentDecrease,
  IndentIncrease,
  Italic,
  List,
  ListOrdered,
  LucideUnderline,
} from 'lucide-react';
import { Button } from './button';

type Levels = 1 | 2 | 3;

const levels: Levels[] = [1, 2, 3];

const classes: Record<Levels, string> = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-bold',
  3: 'text-2xl font-bold',
};

const Heading = BaseHeading.configure({ levels: [1, 2, 3] }).extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `${classes[level]}`,
      }),
      0,
    ];
  },
});

export const TextEditor = ({
  description,
  onChange,
}: {
  description: string;
  onChange: (richText: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('Normal');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        paragraph: false,
        orderedList: false,
        text: false,
        listItem: false,
      }),
      Underline,
      Paragraph,
      Text,
      Heading,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'block list-decimal my-4 pl-10',
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'block list-disc my-4 pl-10',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: `list-item 
            [&>ul]:list-[circle] 
            [&>ul>li>ul]:list-[square] 
            [&>ul]:pl-8 
            [&>ul]:my-2
            [&>ol]:list-[lower-alpha] 
            [&>ol>li>ol]:list-[lower-roman] 
            [&>ol]:pl-8 
            [&>ol]:my-2`,
        },
      }),
      ListKeymap,
    ],
    editorProps: {
      attributes: {
        class:
          'rounded-md border border-input min-h-[200px] bg-background p-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      },
    },
    immediatelyRender: false,
    content: description,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const headingActive = levels.find((level) =>
    editor?.isActive('heading', { level })
  );

  useEffect(() => {
    if (editor) {
      if (headingActive) {
        setValue(`Heading ${headingActive}`);
      } else {
        setValue('Normal');
      }
    }
  }, [editor, headingActive]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap border rounded-md bg-background p-1 gap-1">
        <Toggle
          onClick={() => editor.commands.toggleBold()}
          data-state={editor.isActive('bold') ? 'on' : 'off'}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.commands.toggleItalic()}
          data-state={editor.isActive('italic') ? 'on' : 'off'}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.commands.toggleUnderline()}
          data-state={editor.isActive('underline') ? 'on' : 'off'}
        >
          <LucideUnderline className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-state={editor.isActive('bulletList') ? 'on' : 'off'}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-state={editor.isActive('orderedList') ? 'on' : 'off'}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
          data-state={'off'}
        >
          <IndentIncrease className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
          data-state={'off'}
        >
          <IndentDecrease className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          data-state={editor.isActive({ textAlign: 'left' }) ? 'on' : 'off'}
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          data-state={editor.isActive({ textAlign: 'center' }) ? 'on' : 'off'}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          data-state={editor.isActive({ textAlign: 'right' }) ? 'on' : 'off'}
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Toggle
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          data-state={editor.isActive({ textAlign: 'justify' }) ? 'on' : 'off'}
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {levels.map((level) => (
                    <CommandItem
                      key={level}
                      onSelect={() => {
                        editor.commands.setHeading({ level });
                        setValue(`Heading ${level}`);
                        setOpen(false);
                      }}
                    >
                      <h1 className={classes[level]}>Heading {level}</h1>
                    </CommandItem>
                  ))}
                  <CommandItem
                    onSelect={() => {
                      editor.commands.setParagraph();
                      setValue('Normal');
                      setOpen(false);
                    }}
                  >
                    Normal
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
