import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, Heart } from "lucide-react";
// import imageCompression from 'browser-image-compression'; // To be used when backend is connected

const DUMMY_PHOTOS = [
  { id: 1, url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800", title: "2026 GCS Orientation", date: "2026-03-02", likes: 12 },
  { id: 2, url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800", title: "VWC Midterm Presentations", date: "2026-04-15", likes: 8 },
  { id: 3, url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800", title: "Campus Life", date: "2026-05-10", likes: 24 },
  { id: 4, url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", title: "Group Study at GLC", date: "2026-05-20", likes: 5 },
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState(DUMMY_PHOTOS);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    alert("로그아웃되었습니다.");
  };

  const handleUploadMock = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    alert(`[이미지 압축 시뮬레이션]\n선택된 파일: ${file.name}\n\n실제 서버 연결 시 browser-image-compression을 통해 1MB 이하로 압축하여 Firebase Storage 비용을 최소화합니다.`);
    
    // Create a local URL for the mock UI
    const mockUrl = URL.createObjectURL(file);
    const newPhoto = {
      id: Date.now(),
      url: mockUrl,
      title: "새로 업로드된 사진",
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };
    
    setPhotos([newPhoto, ...photos]);
  };

  return (
    <div className="min-h-screen bg-gcs-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gcs-200 pb-4">
          <Link to="/" className="text-gcs-600 hover:text-gcs-900 flex items-center gap-2 font-bold text-sm">
            <ArrowLeft size={16} /> 홈으로
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-gcs-900">GCS Gallery</h1>
          </div>
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gcs-600 font-bold bg-white px-2.5 py-1.5 rounded-md border border-gcs-100 shadow-sm">
                {currentUser.name} ({currentUser.role === 'admin' ? '교수님' : '학생'})
              </span>
              <button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-md font-bold text-xs hover:bg-red-100 shadow-sm transition-colors">
                로그아웃
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="bg-white text-gcs-900 border border-gcs-200 px-3 py-1.5 rounded-md font-bold text-xs hover:bg-gcs-100 shadow-sm transition-colors">
              로그인 / 관리자
            </button>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gcs-600 text-sm font-medium">GCS 학부생들의 추억을 공유하세요.</p>
          
          {currentUser?.role === 'admin' ? (
            <label className="cursor-pointer bg-gcs-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gcs-800 shadow-md transition-all">
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadMock} />
              <ImagePlus size={18} /> 사진 올리기
            </label>
          ) : (
            <span className="text-xs text-slate-400 font-medium bg-white/50 px-3 py-2 rounded-lg border border-slate-100">
              * 갤러리 사진 업로드는 교수님(관리자)만 가능합니다.
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map(photo => (
            <div key={photo.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gcs-100 hover:shadow-lg transition-all group">
              <div className="aspect-square w-full overflow-hidden relative bg-gcs-100">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gcs-900 text-sm truncate mb-1">{photo.title}</h3>
                <div className="flex justify-between items-center text-xs text-gcs-500">
                  <span>{photo.date}</span>
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    <Heart size={14} /> {photo.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
