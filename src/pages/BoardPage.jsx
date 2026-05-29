import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, Download, PlusCircle, ArrowLeft, Paperclip, X, Image } from "lucide-react";

const DUMMY_NOTICES = [
  { id: 2, title: "2026 GCS Curriculum Updates", date: "2026-05-28", author: "Prof. Alkema", fileName: "curriculum_v2.pdf" },
  { id: 1, title: "Welcome to the new GCS Board!", date: "2026-05-25", author: "Prof. Alkema", fileName: null },
];

const DUMMY_FREE_POSTS = [
  { id: 2, title: "Is anyone taking the VWC midterm project?", author: "Student A", date: "2026-05-29", content: "Looking for team members.", hasFile: false, fileName: null },
  { id: 1, title: "Course recommendation for next semester", author: "Student B", date: "2026-05-27", content: "Any thoughts on the new English lecture?", hasFile: true, fileName: "recommended_structure.png" },
];

export default function BoardPage() {
  const [activeTab, setActiveTab] = useState("notice");
  const [posts, setPosts] = useState(DUMMY_FREE_POSTS);
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
  const [attachedFile, setAttachedFile] = useState(null);

  const handleLogout = () => {
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
      // 교수님은 관리자 업로드 페이지로
      navigate("/admin");
      return;
    }

    setIsWriteModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const newPost = {
      id: posts.length + 1,
      title: newTitle,
      content: newContent,
      author: currentUser.name || currentUser.email.split("@")[0],
      date: new Date().toISOString().split('T')[0],
      hasFile: attachedFile ? true : false,
      fileName: attachedFile ? attachedFile.name : null
    };

    setPosts([newPost, ...posts]);
    
    // Reset Form
    setNewTitle("");
    setNewContent("");
    setAttachedFile(null);
    setIsWriteModalOpen(false);

    if (attachedFile) {
      alert("글이 성공적으로 등록되었습니다!\n\n※ 자유게시판의 가독성을 보존하기 위해, 첨부된 이미지의 '본문 내 미리보기(썸네일)'는 미제공 상태로 업로드됩니다. 대신 파일 첨부 클립 아이콘이 함께 게시됩니다.");
    } else {
      alert("글이 성공적으로 등록되었습니다!");
    }
  };

  const handleRowClick = (post) => {
    let fileInfo = "";
    if (post.hasFile) {
      fileInfo = `\n\n[첨부 이미지: ${post.fileName || "이미지"} - 미리보기 미제공]`;
    }
    alert(`제목: ${post.title}\n작성자: ${post.author}\n작성일: ${post.date}\n\n내용:\n${post.content}${fileInfo}`);
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
          {activeTab === "notice" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <TableHeader />
                <tbody className="divide-y divide-gcs-100">
                  {DUMMY_NOTICES.map(notice => (
                    <tr key={notice.id} className="hover:bg-gcs-50 cursor-pointer group" onClick={() => alert(`교수님 공지글: ${notice.title}`)}>
                      <td className="px-3 py-2.5 text-center text-gcs-500 text-xs">{notice.id}</td>
                      <td className="px-4 py-2.5 font-medium text-gcs-900 group-hover:text-gcs-600 group-hover:underline flex items-center gap-2">
                        {notice.title}
                        {notice.fileName && <Paperclip size={12} className="text-gcs-400" title={`첨부파일: ${notice.fileName}`} />}
                      </td>
                      <td className="px-3 py-2.5 text-center text-gcs-600 text-xs">{notice.author}</td>
                      <td className="px-3 py-2.5 text-center text-gcs-400 text-xs">{notice.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-gcs-200 py-3 text-center text-xs text-gcs-400">
                공지사항 목록이 더 이상 없습니다.
              </div>
            </div>
          )}

          {activeTab === "free" && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <TableHeader />
                  <tbody className="divide-y divide-gcs-100">
                    {posts.map(post => (
                      <tr key={post.id} className="hover:bg-gcs-50 cursor-pointer group" onClick={() => handleRowClick(post)}>
                        <td className="px-3 py-2.5 text-center text-gcs-500 text-xs">{post.id}</td>
                        <td className="px-4 py-2.5 font-medium text-gcs-900 group-hover:text-gcs-600 group-hover:underline flex items-center gap-2">
                          {post.title}
                          {post.hasFile && <Paperclip size={12} className="text-gcs-500" title={`첨부파일: ${post.fileName}`} />}
                        </td>
                        <td className="px-3 py-2.5 text-center text-gcs-600 text-xs">{post.author}</td>
                        <td className="px-3 py-2.5 text-center text-gcs-400 text-xs">{post.date}</td>
                      </tr>
                    ))}
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
                      <Image size={14} className="text-gcs-600" /> 이미지 첨부하기
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ※ 자유게시판의 가독성을 해치지 않기 위해, 본문 내 미리보기 썸네일은 지원되지 않으며 파일 첨부 아이콘만 표시됩니다.
                    </span>
                  </div>
                  <label className="cursor-pointer bg-white border border-slate-200 hover:border-gcs-500 hover:text-gcs-600 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    파일 선택
                  </label>
                </div>
                {attachedFile && (
                  <div className="mt-2 text-xs text-gcs-600 font-bold bg-gcs-50 px-2 py-1 rounded flex justify-between items-center">
                    <span>첨부됨: {attachedFile.name}</span>
                    <button type="button" onClick={() => setAttachedFile(null)} className="text-red-500 hover:text-red-700 font-bold">삭제</button>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gcs-900 text-white text-xs font-bold rounded-lg hover:bg-gcs-800 shadow-md transition-colors"
                >
                  작성 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
