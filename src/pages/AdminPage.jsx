import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UploadCloud, CheckCircle2, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert("제목을 입력해주세요.");
    
    // In the future, this will upload file to Firebase Storage
    // and save data to Firestore
    alert(`[공지사항 등록 완료]\n제목: ${title}\n첨부파일: ${file ? file.name : "없음"}`);
    setTitle("");
    setContent("");
    setFile(null);
    navigate("/board");
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
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <UploadCloud size={48} className="text-gcs-400 mb-4" />
                  <span className="text-gcs-900 font-bold mb-1">
                    {file ? file.name : "클릭하여 파일을 선택하세요"}
                  </span>
                  <span className="text-gcs-500 text-sm">PDF, DOCX 등 지원</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gcs-900 text-white font-bold py-4 rounded-xl hover:bg-gcs-800 transition-colors shadow-lg"
            >
              공지사항 등록하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
