import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if there is an active session after redirection
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        const email = session.user.email;
        const name = session.user.user_metadata?.full_name || email.split("@")[0];
        
        let role = "student";
        if (email === "22101046@handong.ac.kr") {
          const chooseAdmin = window.confirm("관리자(Admin) 권한으로 로그인하시겠습니까?\n(취소를 누르면 학생 권한으로 로그인합니다.)");
          role = chooseAdmin ? "admin" : "student";
        } else if (email === "bryan@handong.edu" || email === "bryan@handong.ac.kr") {
          role = "admin";
        } else if (email.endsWith("@handong.ac.kr") || email.endsWith("@handong.edu")) {
          role = "student";
        } else {
          alert("허용되지 않은 메일 도메인입니다. @handong.ac.kr 또는 한동대 계정만 로그인 가능합니다.");
          await supabase.auth.signOut();
          localStorage.removeItem("user");
          return;
        }

        localStorage.setItem("user", JSON.stringify({ email, role, name }));
        alert(`로그인 성공 (${role === "admin" ? "관리자" : "학생"}: ${email})`);
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/board");
        }
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        checkSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/login"
        }
      });
      if (error) throw error;
    } catch (error) {
      alert("구글 로그인 시작 실패 (Supabase 설정 확인 필요): " + error.message);
      setLoading(false);
    }
  };

  const handleMockLogin = (isAdmin) => {
    // Keep mock login for fast testing
    if (isAdmin) {
      localStorage.setItem("user", JSON.stringify({ email: "22101046@handong.ac.kr", role: "admin", name: "Prof. Alkema (Test)" }));
      alert("로그인 성공 (테스트용 Mock 관리자: 22101046@handong.ac.kr)");
      navigate("/admin");
    } else {
      localStorage.setItem("user", JSON.stringify({ email: "22101046@handong.ac.kr", role: "student", name: "학생 테스트" }));
      alert("로그인 성공 (테스트용 Mock 학생: 22101046@handong.ac.kr)");
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
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-gcs-500 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all hover:shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            {loading ? "연결 중..." : "구글 계정 로그인 (@handong.ac.kr)"}
          </button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-400">개발/테스트용 임시 로그인</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleMockLogin(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-lg transition-colors"
            >
              학생 임시 로그인
            </button>
            <button
              onClick={() => handleMockLogin(true)}
              className="bg-gcs-900 hover:bg-gcs-800 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
            >
              교수 임시 로그인
            </button>
          </div>
        </div>

        <button onClick={() => navigate("/")} className="mt-8 text-gcs-600 hover:text-gcs-900 font-medium text-sm underline">
          메인 홈페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
