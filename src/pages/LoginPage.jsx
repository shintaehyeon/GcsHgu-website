import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (isAdmin) => {
    if (isAdmin) {
      localStorage.setItem("user", JSON.stringify({ email: "bryan@handong.edu", role: "admin", name: "Prof. Alkema" }));
      alert("로그인 성공 (관리자: Prof. Alkema)");
      navigate("/admin");
    } else {
      localStorage.setItem("user", JSON.stringify({ email: "test_student@handong.ac.kr", role: "student", name: "한동인" }));
      alert("로그인 성공 (학생: test_student@handong.ac.kr)");
      navigate("/board");
    }
  };

  return (
    <div className="min-h-screen bg-gcs-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gcs-100 text-center">
        <h1 className="text-3xl font-black text-gcs-900 mb-2">GCS Community</h1>
        <p className="text-gcs-600 mb-8">로그인하여 게시판을 이용해보세요.</p>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin(false)}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-gcs-500 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            학생 로그인 (@handong.ac.kr)
          </button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-400">관리자 전용</span>
            </div>
          </div>

          <button
            onClick={() => handleLogin(true)}
            className="w-full bg-gcs-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-gcs-800 transition-colors shadow-lg"
          >
            교수님 로그인 (Admin)
          </button>
        </div>

        <button onClick={() => navigate("/")} className="mt-8 text-gcs-600 hover:text-gcs-900 font-medium text-sm underline">
          메인 홈페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
