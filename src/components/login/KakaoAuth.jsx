import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URL(window.location.href).searchParams;
        const code = urlParams.get("code"); // 🔥 카카오 인가 코드 가져오기

        if (code) {
            getAccessToken(code);
        } else {
            console.error("인가 코드가 없음!");
            navigate("/login");
        }
    }, [navigate]);

    const getAccessToken = async (code) => {
        try {
            const response = await fetch("http://localhost:3001/auth/kakao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: code }),
            });

            const data = await response.json();
            console.log("백엔드 응답:", data); // ✅ 회원 코드 및 JWT 확인

            if (data.token) {
                localStorage.setItem("jwt", data.token); // 🔥 JWT 저장
                navigate("/About"); // ✅ 로그인 성공 후 이동
            } else {
                console.error("로그인 실패", data);
            }
        } catch (error) {
            console.error("토큰 요청 중 오류 발생", error);
        }
    };

    return <h2>카카오 로그인 중...</h2>;
};

export default KakaoAuth;
