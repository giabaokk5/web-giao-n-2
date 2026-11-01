import React, { useState } from 'react';
import { Bot, User, Sparkles, ThumbsUp, ThumbsDown, Copy, Check, ShieldCheck } from 'lucide-react';
import { FoodRecommendationCard, FoodRecommendationItem } from './FoodRecommendationCard';

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'bot' | 'system';
  content: string;
  role?: 'Customer' | 'Admin' | 'Merchant' | 'Driver';
  timestamp: string;
  recommendations?: FoodRecommendationItem[];
}

interface ChatMessageProps {
  message: ChatMessageItem;
  onFeedback?: (messageId: string, rating: number) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onFeedback }) => {
  const isBot = message.sender === 'bot';
  const isSystem = message.sender === 'system';
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<number | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (rating: number) => {
    setFeedback(rating);
    if (onFeedback) onFeedback(message.id, rating);
  };

  // Render markdown text (bold, lists, backticks)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Bullet points
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-amber-500 font-black">•</span>
                <span>{renderInlineStyles(line.substring(2))}</span>
              </div>
            );
          }

          // Numbered lists
          const numMatch = line.match(/^(\d+)\.\s(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-amber-600 font-bold">{numMatch[1]}.</span>
                <span>{renderInlineStyles(numMatch[2])}</span>
              </div>
            );
          }

          return <p key={idx}>{renderInlineStyles(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineStyles = (text: string) => {
    // Basic bold and code styling
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-slate-950 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded-md font-mono text-xs font-bold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-200">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 my-3 animate-in fade-in ${
        isBot ? 'items-start' : 'items-start flex-row-reverse'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {isBot ? (
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md ring-2 ring-amber-300">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[#00204A] text-white flex items-center justify-center font-bold shadow-md">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Bubble & Metadata */}
      <div className={`max-w-[85%] sm:max-w-[78%] space-y-2 ${isBot ? 'items-start' : 'items-end'}`}>
        {/* Name & Time */}
        <div
          className={`flex items-center gap-2 text-[10px] text-slate-400 font-semibold ${
            isBot ? 'justify-start' : 'justify-end'
          }`}
        >
          <span>
            {isBot
              ? message.role === 'Admin'
                ? 'AI Super Admin'
                : message.role === 'Merchant'
                ? 'AI Trợ Lý Quán Ăn'
                : message.role === 'Driver'
                ? 'AI Hỗ Trợ Tài Xế'
                : 'Trợ Lý BeFood AI'
              : 'Bạn'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Text Container */}
        <div
          className={`p-3.5 sm:p-4 rounded-2xl shadow-xs ${
            isBot
              ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
              : 'bg-[#00204A] text-white rounded-tr-xs'
          }`}
        >
          {renderFormattedContent(message.content)}
        </div>

        {/* Structured Food Recommendations Cards */}
        {isBot && message.recommendations && message.recommendations.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Gợi ý món phù hợp nhất dành cho bạn:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {message.recommendations.map((item) => (
                <FoodRecommendationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Actions bar for Bot message */}
        {isBot && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Sao chép câu trả lời"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Sao chép</span>
                </>
              )}
            </button>

            <span className="text-slate-200">•</span>

            <button
              onClick={() => handleFeedback(1)}
              className={`p-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                feedback === 1
                  ? 'text-emerald-600 font-bold bg-emerald-50'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Hữu ích"
            >
              <ThumbsUp className="w-3 h-3 inline mr-1" />
              <span>Thích</span>
            </button>

            <button
              onClick={() => handleFeedback(-1)}
              className={`p-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                feedback === -1
                  ? 'text-rose-600 font-bold bg-rose-50'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Chưa hài lòng"
            >
              <ThumbsDown className="w-3 h-3 inline mr-1" />
              <span>Chưa đúng</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

