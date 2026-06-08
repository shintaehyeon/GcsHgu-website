import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, Download, PlusCircle, ArrowLeft, Paperclip, X, Image, AlertCircle } from "lucide-react";
import imageCompression from "browser-image-compression";
import { supabase } from "../supabase";

export default function BoardPage() {
  const [activeTab, setActiveTab] = useState("notice");
  const [notices, setNotices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Write Modal States
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]); // Array of up to 2 files
  const [uploading, setUploading] = useState(false);

  // Constants for limits
  const STUDENT_FILE_SIZE_LIMIT = 3 * 1024 * 1024; // 3MB
  const MAX_STUDENT_FILES = 2;

  // Fetch notices and free posts from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch notices
      const { data: noticesData, error: noticesError } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });

      if (noticesError) throw noticesError;
      setNotices(noticesData || []);

      // 2. Fetch free posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData || []);
    } catch (error) {
      console.error("데이터 로드 실패 (Supabase 설정 필요):", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    setCurrentUser(null);
    alert("로그아웃되었습니다.");
  };

  const handleOpenWriteModal = () => {
    if (!currentUser) {
      if (confirm("로그인이 필요한 서비스입니다.\n한동대 학생계정(@handong.ac.kr) 혹은 구글 로그인 정보가 필요합니다.\n로그인 페이지로 이동하시겠습니까?")) {
        navigate("/login");
      }
      return;
    }

    if (activeTab === "notice" && currentUser.role !== "admin") {
      alert("공지사항은 교수님(관리자)만 등록할 수 있습니다. 자유게시판 탭을 선택한 후 글을 작성해주세요!");
      setActiveTab("free");
      return;
    }

    if (activeTab === "notice" && currentUser.role === "admin") {
      navigate("/admin");
      return;
    }

    setIsWriteModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding these would exceed the 2-file limit
    if (attachedFiles.length + files.length > MAX_STUDENT_FILES) {
      alert(`이미지는 최대 ${MAX_STUDENT_FILES}개까지만 첨부할 수 있습니다.`);
      return;
    }

    // Check size limit (3MB) for each file
    const oversizedFiles = files.filter(file => file.size > STUDENT_FILE_SIZE_LIMIT);
    if (oversizedFiles.length > 0) {
      alert(`파일 용량 초과: 학생 업로드 이미지는 파일당 최대 3MB 이하만 가능합니다.\n(초과된 파일: ${oversizedFiles.map(f => f.name).join(", ")})`);
      return;
    }

    setAttachedFiles([...attachedFiles, ...files]);
  };

  const removeAttachedFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setUploading(true);
    try {
      const uploadedFileUrls = [];
      const uploadedFileNames = [];

      // 1. Compress and upload each file
      for (let i = 0; i < attachedFiles.length; i++) {
        const file = attachedFiles[i];
        
        // Compress image client-side to keep target sizes under 500KB and save storage costs
        const compressionOptions = {
          maxSizeMB: 0.5, // limit to 500KB
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, compressionOptions);

        const fileExt = file.name.split(".").pop();
        const filePath = `board/${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("board-attachments")
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from("board-attachments")
          .getPublicUrl(filePath);

        uploadedFileUrls.push(data.publicUrl);
        uploadedFileNames.push(file.name);
      }

      // 2. Insert post row with multiple attachments
      const { error: insertError } = await supabase.from("posts").insert([
        {
          title: newTitle,
          content: newContent,
          author_name: currentUser.name || currentUser.email.split("@")[0],
          author_email: currentUser.email,
          file_name_1: uploadedFileNames[0] || null,
          file_url_1: uploadedFileUrls[0] || null,
          file_name_2: uploadedFileNames[1] || null,
          file_url_2: uploadedFileUrls[1] || null,
        },
      ]);

      if (insertError) throw insertError;

      alert("글이 성공적으로 등록되었습니다!");
      
      // Reset Form and refresh
      setNewTitle("");
      setNewContent("");
      setAttachedFiles([]);
      setIsWriteModalOpen(false);
      fetchData();
    } catch (error) {
      alert("글 등록 실패: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRowClick = (post, isNotice = false) => {
    let fileInfo = "";
    const hasFiles = post.file_url || post.file_url_1 || post.file_url_2;
    
    if (hasFiles) {
      const fileNames = [];
      if (post.file_name) fileNames.push(post.file_name);
      if (post.file_name_1) fileNames.push(post.file_name_1);
      if (post.file_name_2) fileNames.push(post.file_name_2);

      fileInfo = `\n\n[첨부 이미지/파일: ${fileNames.join(", ")} - 미리보기 미제공]`;
      
      if (isNotice) {
        // Allow downloading for notices
        const downloadConfirm = confirm(`제목: ${post.title}\n작성자: ${post.author || "Prof. Alkema"}\n작성일: ${new Date(post.created_at).toLocaleDateString()}\n\n내용:\n${post.content}\n\n첨부파일: ${post.file_name}\n\n파일을 다운로드하시겠습니까?`);
        if (downloadConfirm) {
          window.open(post.file_url, "_blank");
        }
        return;
      }
    }
    alert(`제목: ${post.title}\n작성자: ${post.author_name || post.author || "익명"}\n작성일: ${new Date(post.created_at).toLocaleDateString()}\n\n내용:\n${post.content}${fileInfo}`);
  };

  const TableHeader = () => (
    <thead className="text-xs text-gcs-600 bg-gcs-50 border-t-2 border-gcs-800 border-b border-gcs-200">
      <tr>
        <th className="px-3 py-3 w-16 text-center font-bold">번호</th>
        <th className="px-4 py-3 text-center font-bold">제목</th>
        <th className="px-3 py-3 w-28 text-center font-bold">작성자</th>
        <th className="px-3 py-3 w-28 text-center font-bold">등록일</th>
      </tr>
    </thead>
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 border-b border-gcs-100 pb-4">
          <Link to="/" className="text-gcs-600 hover:text-gcs-900 flex items-center gap-2 font-bold text-sm">
            <ArrowLeft size={16} /> 홈으로
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-gcs-900">GCS Community</h1>
          </div>
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gcs-600 font-bold bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100 shadow-sm">
                {currentUser.name} ({currentUser.role === 'admin' ? '교수님' : '학생'})
              </span>
              <button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-md font-bold text-xs hover:bg-red-100 shadow-sm transition-colors">
                로그아웃
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="bg-white text-gcs-900 border border-gcs-200 px-3 py-1.5 rounded-md font-bold text-xs hover:bg-gcs-50 shadow-sm transition-colors">
              로그인 / 관리자
            </button>
          )}
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("notice")}
            className={`px-5 py-2 text-sm font-bold transition-all border border-b-0 rounded-t-lg ${activeTab === "notice" ? "bg-white text-gcs-900 border-gcs-800 border-t-2" : "bg-gcs-50 text-gcs-500 border-gcs-200 hover:text-gcs-800 hover:bg-white"}`}
          >
            공지사항 (Notices)
          </button>
          <button
            onClick={() => setActiveTab("free")}
            className={`px-5 py-2 text-sm font-bold transition-all border border-b-0 rounded-t-lg ${activeTab === "free" ? "bg-white text-gcs-900 border-gcs-800 border-t-2" : "bg-gcs-50 text-gcs-500 border-gcs-200 hover:text-gcs-800 hover:bg-white"}`}
          >
            자유게시판 (Free Board)
          </button>
        </div>

        {/* Board Content */}
        <div className="bg-white">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              데이터를 불러오는 중입니다...
            </div>
          ) : activeTab === "notice" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <TableHeader />
                <tbody className="divide-y divide-gcs-100">
                  {notices.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-slate-400 text-xs">등록된 공지사항이 없습니다.</td>
                    </tr>
                  ) : (
                    notices.map((notice, index) => (
                      <tr key={notice.id || index} className="hover:bg-gcs-50 cursor-pointer group" onClick={() => handleRowClick(notice, true)}>
                        <td className="px-3 py-2.5 text-center text-gcs-500 text-xs">{notices.length - index}</td>
                        <td className="px-4 py-2.5 font-medium text-gcs-900 group-hover:text-gcs-600 group-hover:underline flex items-center gap-2">
                          {notice.title}
                          {notice.file_url && <Paperclip size={12} className="text-gcs-400" title={`첨부파일: ${notice.file_name}`} />}
                        </td>
                        <td className="px-3 py-2.5 text-center text-gcs-600 text-xs">{notice.author}</td>
                        <td className="px-3 py-2.5 text-center text-gcs-400 text-xs">{new Date(notice.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <TableHeader />
                  <tbody className="divide-y divide-gcs-100">
                    {posts.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-10 text-slate-400 text-xs">등록된 자유 게시물이 없습니다.</td>
                      </tr>
                    ) : (
                      posts.map((post, index) => {
                        const hasFiles = post.file_url_1 || post.file_url_2 || post.file_url;
                        return (
                          <tr key={post.id || index} className="hover:bg-gcs-50 cursor-pointer group" onClick={() => handleRowClick(post)}>
                            <td className="px-3 py-2.5 text-center text-gcs-500 text-xs">{posts.length - index}</td>
                            <td className="px-4 py-2.5 font-medium text-gcs-900 group-hover:text-gcs-600 group-hover:underline flex items-center gap-2">
                              {post.title}
                              {hasFiles && <Paperclip size={12} className="text-gcs-500" title="이미지 첨부됨" />}
                            </td>
                            <td className="px-3 py-2.5 text-center text-gcs-600 text-xs">{post.author_name}</td>
                            <td className="px-3 py-2.5 text-center text-gcs-400 text-xs">{new Date(post.created_at).toLocaleDateString()}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gcs-200 p-3 flex justify-end bg-slate-50">
                <button onClick={handleOpenWriteModal} className="bg-gcs-600 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 hover:bg-gcs-700 shadow-sm transition-colors">
                  <PlusCircle size={14} /> 글쓰기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Beautiful Write Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">새 글 작성 (자유게시판)</h3>
              <button onClick={() => setIsWriteModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            
            {/* Modal Form */}
            <form onSubmit={handleSubmitPost} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">제목</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="제목을 입력해 주세요" 
                  required
                  className="w-full text-sm border border-slate-200 focus:border-gcs-600 focus:ring-1 focus:ring-gcs-600 rounded-lg p-2.5 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">내용</label>
                <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="내용을 입력해 주세요" 
                  required
                  rows={6}
                  className="w-full text-sm border border-slate-200 focus:border-gcs-600 focus:ring-1 focus:ring-gcs-600 rounded-lg p-2.5 outline-none transition-colors resize-none"
                />
              </div>

              {/* Photo Upload Attachment */}
              <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Image size={14} className="text-gcs-600" /> 이미지 첨부하기 (최대 {MAX_STUDENT_FILES}개)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ※ 파일당 최대 3MB 이하 업로드 가능 (업로드 시 자동 압축 진행)
                    </span>
                    <span className="text-[9px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={10} /> 가독성을 위해 첨부된 파일은 본문 내 썸네일 없이 텍스트 아이콘만 노출됩니다.
                    </span>
                  </div>
                  <label className={`cursor-pointer bg-white border border-slate-200 hover:border-gcs-500 hover:text-gcs-600 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${attachedFiles.length >= MAX_STUDENT_FILES ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleFileChange} 
                      className="hidden" 
                      disabled={attachedFiles.length >= MAX_STUDENT_FILES}
                    />
                    파일 추가
                  </label>
                </div>
                {attachedFiles.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {attachedFiles.map((file, idx) => (
                      <div key={idx} className="text-xs text-gcs-600 font-bold bg-gcs-50 px-2 py-1 rounded flex justify-between items-center border border-gcs-100">
                        <span className="truncate max-w-[80%]"># {idx + 1}: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
                        <button type="button" onClick={() => removeAttachedFile(idx)} className="text-red-500 hover:text-red-700 font-bold">삭제</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsWriteModalOpen(false)}
                  disabled={uploading}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-gcs-900 text-white text-xs font-bold rounded-lg hover:bg-gcs-800 shadow-md transition-colors flex items-center gap-1.5"
                >
                  {uploading ? "업로드 및 압축 중..." : "작성 완료"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
