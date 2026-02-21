'use client';

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does AI auto-generation work?",
    answer: "Simply paste a URL, and our AI will automatically analyze the webpage to suggest relevant tags, categories, and descriptions. This saves you time and ensures consistent organization across all your bookmarks."
  },
  {
    question: "Can I use custom tags for my bookmarks?",
    answer: "Yes! You can add unlimited custom tags to any bookmark. Tags make it easy to filter and find related bookmarks quickly. The AI can also suggest tags automatically if you prefer."
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. All your bookmarks are encrypted and stored securely. Your data is completely private and only accessible to you. We never share or sell your information."
  },
  {
    question: "Can I access my bookmarks on multiple devices?",
    answer: "Yes! Your bookmarks sync in real-time across all your devices. Whether you're on your phone, tablet, or computer, you'll always have access to your latest bookmarks."
  },
  {
    question: "What categories are available for organizing bookmarks?",
    answer: "We provide predefined categories like Work, Personal, Learning, Shopping, Entertainment, News, Social Media, Development, and Design. You can also create custom categories to fit your specific needs."
  },
  {
    question: "How does the AI ChatBot help with bookmarks?",
    answer: "The AI ChatBot can answer questions about your bookmarks, help you find specific links, suggest organization strategies, and provide insights about your saved content. Just ask naturally!"
  },
  {
    question: "Can I archive bookmarks without deleting them?",
    answer: "Yes! The archive feature lets you hide bookmarks you don't need right now but might want later. Archived bookmarks are easy to restore whenever you need them again."
  },
  {
    question: "Is there a limit to how many bookmarks I can save?",
    answer: "No limits! You can save as many bookmarks as you need. Our powerful search and filtering features ensure you can always find what you're looking for, no matter how large your collection grows."
  }
];

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full py-4 sm:py-5 px-4 sm:px-6 flex items-start justify-between text-left hover:bg-muted/50 transition-colors"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-sm sm:text-base pr-4">{faq.question}</span>
        <ChevronDown 
          className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-base text-muted-foreground">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Everything you need to know about Smart Bookmarks
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
