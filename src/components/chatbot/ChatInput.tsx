import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  role?: 'Customer' | 'Admin' | 'Merchant' | 'Driver';
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isTyping,
  role = 'Customer',
  placeholder,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Quick suggestion chips based on active role
  const getSuggestions = () => {
    switch (role) {
      case 'Admin':
        return [
          '📊 Báo cáo doanh thu hôm nay',
          '⚠️ Đơn hàng bất thường',
          '🏆 Top quán bán chạy Đà Nẵng',
          '🚴 Tình hình tài xế trực tuyến',
        ];
      case 'Merchant':
        return [
          '💡 Gợi ý combo món trưa hút khách',
          '✍️ Viết mô tả món Mì Quảng gà',
          '📦 Dự báo nguyên liệu cuối tuần',
          '⭐ Phân tích đánh giá khách hàng',
        ];
      case 'Driver':
        return [
          '🗺️ Lộ trình tránh kẹt xe Cầu Rồng',
          '💰 Tra cứu thu nhập & thưởng ngày',
          '🚨 Hướng dẫn xử lý khách không nghe máy',
          '🛵 Đơn hàng đang được phân công',
        ];
      case 'Customer':
      default:
        return [
          '🍜 Gợi ý món ngon dưới 50k',
          '🛵 Tra cứu đơn hàng đang giao',
          '🎁 Mã voucher giảm giá hôm nay',
          '🥢 Quán mì quảng ngon nhất Hải Châu',
          '📞 Gặp chuyên viên CSKH',
        ];
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText('Tìm quán mì quảng gà ngon quanh quận Hải Châu');
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-2 pt-2 border-t border-slate-200 bg-white">
      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Gợi ý:
        </span>
        {getSuggestions().map((chip, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isTyping}
            onClick={() => handleChipClick(chip)}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 whitespace-nowrap transition-all border border-slate-200/80 cursor-pointer disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="relative flex items-end gap-2 bg-slate-50 border-2 border-slate-200 rounded-2xl p-2 focus-within:border-amber-400 focus-within:bg-white transition-all">
        {/* Attachment button */}
        <button
          type="button"
          onClick={() => alert('Đính kèm hình ảnh món ăn hoặc hóa đơn')}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          title="Đính kèm ảnh"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          rows={1}
          placeholder={
            placeholder ||
            (role === 'Admin'
              ? 'Hỏi AI Admin về doanh thu, đơn hàng, tài xế...'
              : role === 'Merchant'
              ? 'Hỏi AI Quán Ăn về combo, mô tả món, nguyên liệu...'
              : role === 'Driver'
              ? 'Hỏi AI Tài Xế về lộ trình, thu nhập, sự cố...'
              : 'Nhập món bạn thèm, ngân sách hoặc hỏi mã giảm giá...')
          }
          className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none max-h-28 py-1.5 leading-relaxed"
        />

        {/* Voice Input button */}
        <button
          type="button"
          onClick={toggleRecording}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isRecording
              ? 'bg-rose-500 text-white animate-pulse'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
          }`}
          title="Nói với BeFood AI bằng giọng nói"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim() || isTyping}
          className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer ${
            inputText.trim() && !isTyping
              ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md scale-100'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          title="Gửi tin nhắn (Enter)"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
        <span>Nhấn Enter để gửi • Shift + Enter xuống dòng</span>
        <span className="flex items-center gap-1 font-semibold text-amber-700">
          <Sparkles className="w-3 h-3 text-amber-500" /> BeFood AI v2.5
        </span>
      </div>
    </div>
  );
};

