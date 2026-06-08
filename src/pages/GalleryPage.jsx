import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, Heart, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { supabase } from "../supabase";

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Fetch photos from Supabase 'gallery' table
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("갤러리 로딩 실패 (Supabase 설정 필요):", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    setCurrentUser(null);
    alert("로그아웃되었습니다.");
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Compress image client-side to minimize storage usage & backend costs
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);

      // 2. Upload file to Supabase storage bucket 'gallery-photos'
      const fileExt = file.name.split(".").pop();
      const filePath = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery-photos")
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data } = supabase.storage
        .from("gallery-photos")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // 4. Save metadata to Database
      const title = prompt("사진 제목을 입력하세요:", file.name.split(".")[0]);
      if (title === null) return; // cancel flow

      const { error: insertError } = await supabase.from("gallery").insert([
        {
          url: publicUrl,
          title: title || "GCS Moment",
          likes: 0,
        },
      ]);

      if (insertError) throw insertError;

      alert("사진이 성공적으로 업로드되었습니다!");
      fetchPhotos();
    } catch (error) {
      alert("업로드 실패: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (photoId, currentLikes) => {
    try {
      const { error } = await supabase
        .from("gallery")
        .update({ likes: currentLikes + 1 })
        .eq("id", photoId);

      if (error) throw error;
      
      // Update UI state locally
      setPhotos(photos.map(p => p.id === photoId ? { ...p, likes: currentLikes + 1 } : p));
    } catch (error) {
      console.error("좋아요 업데이트 실패:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gcs-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
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

        {/* Upload Button Notice Banner */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <p className="text-gcs-600 text-sm font-medium">GCS 학부생들의 추억을 공유하세요.</p>
          
          {currentUser?.role === 'admin' ? (
            <label className={`cursor-pointer bg-gcs-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gcs-800 shadow-md transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> 업로드 중...
                </>
              ) : (
                <>
                  <ImagePlus size={18} /> 사진 올리기
                </>
              )}
            </label>
          ) : (
            <span className="text-xs text-slate-400 font-medium bg-white/50 px-3 py-2 rounded-lg border border-slate-100">
              * 갤러리 사진 업로드는 교수님(관리자)만 가능합니다.
            </span>
          )}
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            사진들을 불러오는 중입니다...
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            등록된 갤러리 이미지가 없습니다.
          </div>
        ) : (
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
                    <span>{new Date(photo.created_at || Date.now()).toLocaleDateString()}</span>
                    <button 
                      onClick={() => handleLike(photo.id, photo.likes)}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors text-slate-400 font-bold"
                    >
                      <Heart size={14} className="fill-current" /> {photo.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
