import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const getToken = async () => {
            const code = new URL(window.location.href).searchParams.get("code"); // 🔥 URL에서 code 추출
            if (code) {
                try {
                    const response = await fetch("https://kauth.kakao.com/oauth/token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: new URLSearchParams({
                            grant_type: "authorization_code",
                            client_id: "b656293336f5e166383d543eb8f22357",
                            redirect_uri: "https://localhost:3000/auth/kakao",
                            code: code,
                            
                        }),
                    });

                    const data = await response.json();
                    console.log("카카오 토큰:", data);

                    if (data.access_token) {
                        localStorage.setItem("kakao_token", data.access_token); // 🔥 토큰 저장
                        navigate("/About"); // 로그인 성공 시 대시보드로 이동
                    } else {
                        console.error("토큰 발급 실패", data);
                    }
                } catch (error) {
                    console.error("토큰 요청 중 오류 발생", error);
                }
            }
        };

        getToken();
    }, [navigate]);

    return <h2>카카오 로그인 중...</h2>;
};

export default KakaoAuth;
