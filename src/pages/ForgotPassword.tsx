import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import ApiConstants from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await axiosInstance.post(ApiConstants.FORGOT_PASSWORD, { email });
      setMsg("Check your email for reset instructions.");
    } catch {
      setMsg("Email not found or error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <input
          className="border p-2 w-full mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          type="email"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
        {msg && (
          <div className="mt-4 text-center text-sm text-blue-700">{msg}</div>
        )}
      </form>
    </div>
  );
}
