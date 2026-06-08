import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UploadCloud, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "../supabase";

export default function AdminPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Constants for limits
  const ADMIN_FILE_SIZE_LIMIT = 15 * 1024 * 1024; // 15MB

  // Authentication check
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("교수님(관리자) 권한이 필요한 페이지입니다.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > ADMIN_FILE_SIZE_LIMIT) {
        alert("업로드 실패: 공지사항 첨부파일은 서버 용량 보존을 위해 파일당 최대 15MB까지만 업로드 가능합니다.");
        e.target.value = ""; // clear input
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("제목을 입력해주세요.");

    setSubmitting(true);
    try {
      let fileUrl = null;
      let fileName = null;

      // 1. Upload file to Supabase storage if selected
      if (file) {
        fileName = file.name;
        const fileExt = file.name.split(".").pop();
        const filePath = `notices/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("notice-attachments")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public download URL
        const { data } = supabase.storage
          .from("notice-attachments")
          .getPublicUrl(filePath);

        fileUrl = data.publicUrl;
      }

      // 2. Insert notice database entry
      const { error: insertError } = await supabase.from("notices").insert([
        {
          title,
          content: content || "",
          author: currentUser.name || "Prof. Alkema",
          file_name: fileName,
          file_url: fileUrl,
        },
      ]);

      if (insertError) throw insertError;

      alert(`공지사항 등록이 완료되었습니다!\n제목: ${title}`);
      setTitle("");
      setContent("");
      setFile(null);
      navigate("/board");
    } catch (error) {
      alert("공지사항 등록 실패: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gcs-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/board" className="text-gcs-600 hover:text-gcs-900 flex items-center gap-2 font-bold">
            <ArrowLeft size={20} /> 커뮤니티로 돌아가기
          </Link>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gcs-100">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gcs-100">
            <div className="w-12 h-12 bg-gcs-900 rounded-2xl flex items-center justify-center text-white">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gcs-900">Admin Dashboard</h1>
              <p className="text-gcs-500 text-sm">교수님 전용 공지사항 및 파일 업로드</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gcs-900 mb-2">공지사항 제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                required
                className="w-full px-4 py-3 rounded-xl border border-gcs-200 focus:outline-none focus:ring-2 focus:ring-gcs-500 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gcs-900 mb-2">상세 내용 (선택)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gcs-200 focus:outline-none focus:ring-2 focus:ring-gcs-500 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gcs-900 mb-2">파일 업로드 (English Course List, Faculty Description 등)</label>
              <div className="border-2 border-dashed border-gcs-300 rounded-2xl p-8 text-center hover:bg-gcs-50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud size={48} className="text-gcs-400 mb-4" />
                  <span className="text-gcs-900 font-bold mb-1">
                    {file ? file.name : "클릭하여 파일을 선택하세요"}
                  </span>
                  <span className="text-gcs-500 text-sm">PDF, DOCX 등 지원 (최대 15MB)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gcs-900 text-white font-bold py-4 rounded-xl hover:bg-gcs-800 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> 업로드 및 등록 중...
                </>
              ) : (
                "공지사항 등록하기"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
