import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/contexts/AuthContext";

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    if (accessToken) {
      handleGoogleCallback(accessToken).then(() => {
        navigate("/");
      });
    } else {
      navigate("/login");
    }
  }, []);

  return <div className="text-center mt-12">Logging in with Google...</div>;
}
