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
        </div>

        <button onClick={() => navigate("/")} className="mt-8 text-gcs-600 hover:text-gcs-900 font-medium text-sm underline">
          메인 홈페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
