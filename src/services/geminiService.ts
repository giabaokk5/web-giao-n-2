// src/services/geminiService.ts
// Google Gemini Live AI Integration for beFood Da Nang

const GEMINI_STORAGE_KEY = 'befood_gemini_api_key';

export const getGeminiApiKey = (): string => {
  return localStorage.getItem(GEMINI_STORAGE_KEY) || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
};

export const setGeminiApiKey = (key: string): void => {
  if (key.trim()) {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
  }
};

export const hasGeminiApiKey = (): boolean => {
  return !!getGeminiApiKey();
};

const SYSTEM_INSTRUCTION = `
Bạn là BeBot - Trợ lý ẩm thực AI thông minh cao cấp của beFood Đà Nẵng (thuộc hệ sinh thái Be Group).
Nhiệm vụ của bạn:
1. Tư vấn món ăn ngon, đặc sản Đà Nẵng chuẩn vị nhất:
   - Mì Quảng Bà Mua (Mì gà ta rút xương, mì ếch, mì tôm thịt)
   - Bánh tráng cuốn thịt heo 2 đầu da (Đặc Sản Trần, Đại Lộc)
   - Bún chả cá Hờn 113A Nguyễn Chí Thanh
   - Hải sản tươi sống Bé Mặn đường Võ Nguyên Giáp (biển Mỹ Khê)
   - Bánh xèo Bà Dưỡng kiệt 280 Hoàng Diệu
   - Chè Thái sầu riêng Cô Liên (Chè Sầu Liên Hoàng Diệu)
   - Bánh mì chả bò Đà Nẵng (Bà Lan)
   - Trà sữa Phúc Long, Cà phê muối Đà Nẵng
2. Hướng dẫn khách đặt hàng, áp mã giảm giá: FREESHIP0D, BEFOOD50 (giảm 50k), VIPGOLD.
3. Tư vấn theo thời điểm (ăn sáng bún chả cá/bánh mì, ăn trưa cơm gà/bánh tráng thịt heo, ăn chiều chè sầu/trà sữa, ăn tối hải sản biển Mỹ Khê).
4. Tư vấn theo ngân sách (dưới 50.000đ, tiệc nhóm, đặt hộ người thân).
Phong cách: Rất nhiệt tình, thân thiện, súc tích, đậm chất hiếu khách của người Đà Nẵng, dùng icon sinh động.
`;

export async function askGeminiAI(
  userQuery: string,
  history: { sender: 'user' | 'bot'; text: string }[] = []
): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  // Format contents for Gemini REST API
  const contents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    {
      role: 'model',
      parts: [{ text: 'Chào bạn! Mình là BeBot, trợ lý ẩm thực beFood Đà Nẵng. Mình đã sẵn sàng phục vụ và gợi ý món ngon cho bạn!' }],
    },
    ...history.slice(-6).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userQuery }],
    },
  ];

  // Try Gemini 2.5 Flash / 2.0 Flash / 1.5 Flash
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Lỗi API (${response.status})`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('Không thể kết nối tới máy chủ Google Gemini.');
}

export async function callGeminiWithFallback(userQuery: string): Promise<string> {
  try {
    if (hasGeminiApiKey()) {
      return await askGeminiAI(userQuery);
    }
  } catch (e) {
    console.warn('Gemini API call failed, falling back to local reasoning:', e);
  }

  // Domain expert fallback for BeFood Da Nang
  const queryLower = userQuery.toLowerCase();
  if (queryLower.includes('mì quảng') || queryLower.includes('gà')) {
    return 'Dạ tại Đà Nẵng, quán **Mì Quảng Bà Mua** (95A Nguyễn Tri Phương) nổi tiếng nhất với món **Mì Quảng Gà Ta Thả Vườn** thịt chắc ngọt, nước nhưn đậm đà, ăn kèm bánh tráng mè nướng giòn rụm! Em đã đính kèm thẻ món bên dưới để bạn bấm thêm vào giỏ nhé!';
  }
  if (queryLower.includes('voucher') || queryLower.includes('giảm giá') || queryLower.includes('khuyến mãi')) {
    return '🎁 Hôm nay bạn có thể dùng mã **BEFOOD50** (giảm 50k cho đơn từ 120k) hoặc **FREESHIP0D** (miễn phí giao hàng toàn quận Hải Châu, Thanh Khê) nhé!';
  }
  if (queryLower.includes('đơn') || queryLower.includes('giao')) {
    return '🛵 Đơn hàng của bạn đang được tài xế **Nguyễn Văn Be (43-C1 888.68)** giao bằng xe máy thùng giữ nhiệt BeBike, dự kiến đến trong 10-15 phút nữa nhé!';
  }
  return `Dạ chào bạn! BeFood Đà Nẵng đã ghi nhận yêu cầu "${userQuery}". Hôm nay các món đặc sản Mì Quảng Bà Mua, Bún Chả Cá 113A và Trà Sữa Phúc Long đang có ưu đãi Freeship và giao nhanh 15 phút. Bạn xem các món ngon em gợi ý bên dưới nha!`;
}

