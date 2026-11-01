import React, { useState } from 'react';
import { Star, X, Camera, Sparkles, Check, MessageSquare, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Restaurant, FoodItem } from '../../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  initialFoodId?: string;
  orderCode?: string;
}

const REVIEW_TAGS = [
  'Ngon chuẩn vị Đà Nẵng',
  'Giao nhanh 15p',
  'Đóng gói cẩn thận',
  'Món ăn nóng hổi',
  'Thịt tươi ngọt',
  'Đậm đà vừa miệng',
  'Rau sống sạch tươi',
  'Giá cả hợp lý',
  'Bánh tráng mè giòn',
  'Sẽ ủng hộ tiếp',
];

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop&q=80',
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  initialFoodId,
  orderCode,
}) => {
  const { currentUser, addReview } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedFoodId, setSelectedFoodId] = useState<string>(initialFoodId || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Ngon chuẩn vị Đà Nẵng', 'Giao nhanh 15p']);
  const [comment, setComment] = useState<string>('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [showPhotoPresets, setShowPhotoPresets] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSelectPresetPhoto = (url: string) => {
    if (!attachedImages.includes(url)) {
      setAttachedImages([...attachedImages, url]);
    }
  };

  const handleRemovePhoto = (url: string) => {
    setAttachedImages(attachedImages.filter((img) => img !== url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Vui lòng viết đôi lời cảm nhận của bạn về món ăn nhé!');
      return;
    }

    const selectedFood = restaurant.menu.find((f) => f.id === selectedFoodId);

    addReview({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      foodId: selectedFood?.id,
      foodName: selectedFood?.name || restaurant.menu[0]?.name,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment: comment.trim(),
      tags: selectedTags,
      images: attachedImages,
      orderCode: orderCode || `BE-DN-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    onClose();
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return 'Tuyệt vời, món ăn rất ngon! 😍';
      case 4:
        return 'Hài lòng, đồ ăn vừa miệng 👍';
      case 3:
        return 'Bình thường, tạm ổn 🙂';
      case 2:
        return 'Chưa ngon, cần cải thiện 🙁';
      case 1:
        return 'Rất tệ, không hài lòng 😡';
      default:
        return 'Chọn số sao đánh giá';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Viết đánh giá & bình luận món ăn
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{restaurant.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star Rating Selector */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 text-center space-y-2">
            <span className="font-bold text-slate-700 block text-xs">
              Mức độ hài lòng của bạn:
            </span>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1.5 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-black text-amber-800">
              {getRatingLabel(hoverRating || rating)}
            </div>
          </div>

          {/* Dish selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Bạn đang đánh giá món nào?
            </label>
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              <option value="">Toàn bộ trải nghiệm món ăn tại quán</option>
              {restaurant.menu.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name} ({food.price.toLocaleString('vi-VN')}đ)
                </option>
              ))}
            </select>
          </div>

          {/* Quick Tag Pills */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Chọn điểm bạn thích nhất:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {REVIEW_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-xs ring-1 ring-amber-400'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment text area */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Bình luận chi tiết: <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
              placeholder="Chia sẻ hương vị món ăn, độ tươi ngon, nước chấm và cảm nhận khi mở hộp món ăn BeFood giao đến..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed"
            />
          </div>

          {/* Attach Photos Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Camera className="w-4 h-4 text-amber-500" />
                <span>Hình ảnh thực tế món ăn ({attachedImages.length}/4)</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPhotoPresets(!showPhotoPresets)}
                className="text-amber-700 font-bold text-[11px] hover:underline cursor-pointer"
              >
                {showPhotoPresets ? 'Ẩn gợi ý ảnh' : '+ Chọn ảnh mẫu món ngon'}
              </button>
            </div>

            {/* Presets Gallery */}
            {showPhotoPresets && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-400 font-semibold block">
                  Bấm để đính kèm nhanh ảnh món ăn Đà Nẵng:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_PHOTO_PRESETS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Sample"
                      onClick={() => handleSelectPresetPhoto(url)}
                      className="w-full h-14 object-cover rounded-xl cursor-pointer hover:opacity-80 ring-1 ring-slate-200 hover:ring-2 hover:ring-amber-400 transition-all"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Attached thumbnails */}
            {attachedImages.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {attachedImages.map((imgUrl, i) => (
                  <div key={i} className="relative group shrink-0">
                    <img
                      src={imgUrl}
                      alt="Attached"
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(imgUrl)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/30 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Gửi Đánh Giá Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

