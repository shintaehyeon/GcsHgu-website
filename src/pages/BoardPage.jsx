import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileText, Download, PlusCircle, ArrowLeft, X, MessageSquare, CornerDownRight, Trash2 } from "lucide-react";
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
  const [newPassword, setNewPassword] = useState("");
  const [uploading, setUploading] = useState(false);

  // Detail Modal & Comments States
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

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

  const fetchComments = async (postId) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err.message);
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

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    if (!newPassword.trim()) {
      alert("글 삭제 시 본인 인증에 필요한 비밀번호를 입력해주세요.");
      return;
    }

    setUploading(true);
    try {
      // Insert post row with password
      const { error: insertError } = await supabase.from("posts").insert([
        {
          title: newTitle,
          content: newContent,
          author_name: currentUser.name || currentUser.email.split("@")[0],
          author_email: currentUser.email,
          password: newPassword.trim(),
        },
      ]);

      if (insertError) throw insertError;

      alert("글이 성공적으로 등록되었습니다!");
      
      // Reset Form and refresh
      setNewTitle("");
      setNewContent("");
      setNewPassword("");
      setIsWriteModalOpen(false);
      fetchData();
    } catch (error) {
      alert("글 등록 실패: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRowClick = (post, isNotice = false) => {
    setSelectedPost({ ...post, isNotice });
    setIsDetailModalOpen(true);
    if (!isNotice) {
      setComments([]);
      fetchComments(post.id);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("이 게시글을 정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    if (currentUser.role === "admin") {
      // Admin master privilege override (no password needed)
      try {
        const table = selectedPost.isNotice ? "notices" : "posts";
        const { error } = await supabase
          .from(table)
          .delete()
          .eq("id", selectedPost.id);

        if (error) throw error;
        alert("관리자 권한으로 게시글이 정상 삭제되었습니다.");
        setIsDetailModalOpen(false);
        fetchData();
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다: " + error.message);
      }
    } else {
      // Student password authentication
      const passwordInput = window.prompt("본인 게시글 확인을 위해 비밀번호를 입력해 주세요:");
      if (passwordInput === null) return; // Cancelled

      if (passwordInput !== selectedPost.password) {
        alert("비밀번호가 올바르지 않습니다. 본인이 작성한 글만 삭제할 수 있습니다.");
        return;
      }

      try {
        const { error } = await supabase
          .from("posts")
          .delete()
          .eq("id", selectedPost.id);

        if (error) throw error;
        alert("게시글이 성공적으로 삭제되었습니다.");
        setIsDetailModalOpen(false);
        fetchData();
      } catch (error) {
        alert("삭제 실패: " + error.message);
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("로그인 후 댓글을 작성하실 수 있습니다.");
      return;
    }
    if (!newComment.trim()) return;

    setCommentSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert([
        {
          post_id: selectedPost.id,
          content: newComment.trim(),
          author_name: currentUser.name || currentUser.email.split("@")[0],
          author_email: currentUser.email,
        }
      ]);

      if (error) throw error;
      setNewComment("");
      fetchComments(selectedPost.id);
    } catch (error) {
      alert("댓글 작성 실패: " + error.message);
    } finally {
      setCommentSubmitting(false);
    }
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
                          {notice.file_url && <span className="text-xs text-gcs-600 font-bold bg-gcs-50 border border-gcs-200 px-1.5 py-0.5 rounded">PDF</span>}
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
                        return (
                          <tr key={post.id || index} className="hover:bg-gcs-50 cursor-pointer group" onClick={() => handleRowClick(post)}>
                            <td className="px-3 py-2.5 text-center text-gcs-500 text-xs">{posts.length - index}</td>
                            <td className="px-4 py-2.5 font-medium text-gcs-900 group-hover:text-gcs-600 group-hover:underline flex items-center gap-2">
                              {post.title}
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

      {/* Write Modal (Text-Only for Students, With Password Field) */}
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
                  placeholder="자유게시판은 깨끗한 커뮤니티 조성을 위해 텍스트 전용으로 운영됩니다." 
                  required
                  rows={6}
                  className="w-full text-sm border border-slate-200 focus:border-gcs-600 focus:ring-1 focus:ring-gcs-600 rounded-lg p-2.5 outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">글 삭제 비밀번호</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="본인 게시물 확인을 위한 비밀번호를 설정해주세요 (영문/숫자)" 
                  required
                  className="w-full text-sm border border-slate-200 focus:border-gcs-600 focus:ring-1 focus:ring-gcs-600 rounded-lg p-2.5 outline-none transition-colors"
                />
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
                  {uploading ? "등록 중..." : "작성 완료"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Beautiful Detail & Comments Modal */}
      {isDetailModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden my-8 max-h-[85vh]">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <span className="text-xs font-bold bg-gcs-900 text-white px-2 py-0.5 rounded">
                {selectedPost.isNotice ? "공지사항" : "자유게시글"}
              </span>
              <div className="flex items-center gap-2">
                {/* Delete button (Requires admin role or matches post password for students) */}
                {currentUser && (
                  <button 
                    onClick={handleDeletePost}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex items-center gap-1 font-bold text-xs"
                    title="게시글 삭제"
                  >
                    <Trash2 size={14} /> 삭제
                  </button>
                )}
                <button onClick={() => setIsDetailModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
                  <X size={18} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h2 className="text-xl font-black text-gcs-900 mb-2">{selectedPost.title}</h2>
                <div className="flex gap-3 text-xs text-gcs-500 pb-4 border-b border-slate-100">
                  <span>작성자: <strong className="text-gcs-800">{selectedPost.author_name || selectedPost.author || "익명"}</strong></span>
                  <span>|</span>
                  <span>등록일: {new Date(selectedPost.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Main Content Text */}
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[120px] bg-slate-50 p-4 rounded-xl border border-slate-100">
                {selectedPost.content}
              </div>

              {/* Attachments for Notices */}
              {selectedPost.isNotice && selectedPost.file_url && (
                <div className="bg-gcs-50 p-3 rounded-lg border border-gcs-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs font-bold text-gcs-900">
                    <FileText size={16} />
                    <span>{selectedPost.file_name || "첨부파일.pdf"}</span>
                  </div>
                  <a 
                    href={selectedPost.file_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-white border border-gcs-300 hover:bg-gcs-100 text-gcs-900 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <Download size={12} /> 다운로드
                  </a>
                </div>
              )}

              {/* Comments Section (Only for Free Board Posts) */}
              {!selectedPost.isNotice && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-sm font-bold text-gcs-900 flex items-center gap-1.5">
                    <MessageSquare size={16} className="text-gcs-600" /> 댓글 ({comments.length})
                  </h4>

                  {/* Comment List */}
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                    {comments.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">등록된 댓글이 없습니다. 첫 댓글을 달아보세요!</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs flex gap-2">
                          <CornerDownRight size={14} className="text-slate-400 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-gcs-800">{comment.author_name}</span>
                              <span className="text-[10px] text-slate-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-700 leading-normal">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment Input */}
                  {currentUser ? (
                    <form onSubmit={handleSubmitComment} className="flex gap-2 pt-2">
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="깨끗한 댓글을 입력해 주세요" 
                        required
                        className="flex-1 text-xs border border-slate-200 focus:border-gcs-600 focus:ring-1 focus:ring-gcs-600 rounded-lg p-2.5 outline-none transition-colors"
                      />
                      <button 
                        type="submit" 
                        disabled={commentSubmitting}
                        className="bg-gcs-900 hover:bg-gcs-800 text-white text-xs font-bold px-4 rounded-lg shrink-0 transition-colors"
                      >
                        {commentSubmitting ? "등록 중" : "등록"}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 text-center p-3 rounded-lg text-xs text-slate-500">
                      로그인한 사용자만 댓글 작성이 가능합니다.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
