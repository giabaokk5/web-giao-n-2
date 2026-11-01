// src/components/ai/GeminiApiKeyModal.tsx
import React, { useState } from 'react';
import {
  X,
  Key,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey, askGeminiAI } from '../../services/geminiService';

interface GeminiApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setGeminiApiKey('');
      setTestResult({ success: true, message: 'Đã xóa API Key. Hệ thống sẽ dùng AI nội bộ beFood.' });
      onKeySaved?.();
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    // Temporarily set to test
    setGeminiApiKey(apiKeyInput.trim());

    try {
      const response = await askGeminiAI('Chào bạn, hãy giới thiệu 1 câu ngắn gọn về ẩm thực Đà Nẵng.');
      setTestResult({
        success: true,
        message: `Kết nối Gemini AI thành công! Phản hồi: "${response.slice(0, 100)}..."`,
      });
      onKeySaved?.();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Lỗi kết nối: ${err.message || 'API Key không hợp lệ hoặc đã hết hạn.'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearKey = () => {
    setGeminiApiKey('');
    setApiKeyInput('');
    setTestResult({ success: true, message: 'Đã xóa API Key. Đang sử dụng AI nội bộ.' });
    onKeySaved?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-[#00204A] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-xl shadow-xs">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">
                Google AI Studio
              </span>
              <h3 className="font-extrabold text-sm text-white">Cấu hình Gemini API Live</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleTestAndSave} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Kích hoạt trí tuệ nhân tạo không giới hạn:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Khi dán API Key, BeBot sẽ gọi trực tiếp mô hình <strong>Google Gemini Flash</strong> để giải đáp mọi câu hỏi, làm thơ về ẩm thực Đà Nẵng, tính toán calo và tư vấn thực đơn chi tiết.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 underline mt-1"
            >
              <span>Lấy API Key miễn phí tại Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Google Gemini API Key:
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <span className="text-[11px] leading-relaxed">{testResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 gap-2">
            {getGeminiApiKey() && (
              <button
                type="button"
                onClick={handleClearKey}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Xóa Key
              </button>
            )}

            <button
              type="submit"
              disabled={isTesting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-300/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang kiểm tra kết nối...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Lưu &amp; Kích Hoạt Gemini Live</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

