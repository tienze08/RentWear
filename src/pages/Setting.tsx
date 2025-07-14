import { useState, useRef, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserRound, Mail, Phone, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import ChangePassword from "@/components/user/ChangePassword";
import { useAuth } from "@/components/contexts/AuthContext";
import { User } from "@/lib/types";
import { useUser } from "@/components/contexts/UserContext";

interface FormData {
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

const Settings = () => {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { changeInfo, updateAvatar } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const initializeFormData = useCallback(
    (userData: User | null): FormData => ({
      username: userData?.username || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
      avatar: userData?.avatar || "",
    }),
    []
  );

  const [formData, setFormData] = useState<FormData>(() =>
    initializeFormData(user)
  );
  useEffect(() => {
    setFormData(initializeFormData(user));
  }, [user, initializeFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changeInfo(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      throw error;
    }
  };

  const handleChangeAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    try {
      await updateAvatar(selectedFile);
      setPreviewUrl(null);
      setSelectedFile(null);
      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (!user) {
    return null; // or some loading/error state
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto py-12 px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Cài Đặt Tài Khoản
            </h1>
            <p className="text-gray-600 text-lg">
              Quản lý thông tin cá nhân và cài đặt bảo mật của bạn
            </p>
          </div>

          {/* Profile Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-10 border border-white/20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  {previewUrl || formData.avatar ? (
                    <AvatarImage
                      src={previewUrl || formData.avatar}
                      alt={formData.username}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-3xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                      {getInitials(formData.username)}
                    </AvatarFallback>
                  )}
                </Avatar>
                {previewUrl && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <button
                      onClick={handleCancelUpload}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-4 border-white"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {formData.username}
                </h2>
                <p className="text-gray-600 text-lg mb-6">{formData.email}</p>
                <div className="flex gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    onClick={handleChangeAvatar}
                    className="flex items-center gap-2 border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Chọn Ảnh
                  </Button>
                  {selectedFile && (
                    <Button
                      onClick={handleConfirmUpload}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Xác Nhận
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="username"
                    className="flex items-center gap-3 text-gray-700 font-semibold"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <UserRound className="h-4 w-4 text-indigo-600" />
                    </div>
                    Tên Người Dùng
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    className="border-2 border-gray-200 focus:border-indigo-400 rounded-xl py-3 px-4 transition-all duration-300"
                    disabled
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-3 text-gray-700 font-semibold"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-purple-600" />
                    </div>
                    Địa Chỉ Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    className="border-2 border-gray-200 focus:border-purple-400 rounded-xl py-3 px-4 transition-all duration-300"
                    disabled
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="flex items-center gap-3 text-gray-700 font-semibold"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    Số Điện Thoại
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-2 border-gray-200 focus:border-green-400 rounded-xl py-3 px-4 transition-all duration-300"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="address"
                    className="flex items-center gap-3 text-gray-700 font-semibold"
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-orange-600" />
                    </div>
                    Địa Chỉ
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border-2 border-gray-200 focus:border-orange-400 rounded-xl py-3 px-4 transition-all duration-300"
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Lưu Thay Đổi
                </Button>
              </div>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Bảo Mật</h2>
                <p className="text-gray-600">
                  Quản lý mật khẩu và cài đặt bảo mật
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
              onClick={() => setShowChangePassword(true)}
            >
              Đổi Mật Khẩu
            </Button>
          </div>
        </div>
      </div>
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </Layout>
  );
};

export default Settings;
