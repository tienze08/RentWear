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
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-fashion-DEFAULT">
          Account Settings
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-gray-200">
                {previewUrl || formData.avatar ? (
                  <AvatarImage
                    src={previewUrl || formData.avatar}
                    alt={formData.username}
                  />
                ) : (
                  <AvatarFallback className="text-2xl bg-fashion-accent text-white">
                    {getInitials(formData.username)}
                  </AvatarFallback>
                )}
              </Avatar>
              {previewUrl && (
                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                  <button
                    onClick={handleCancelUpload}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-fashion-DEFAULT mb-1">
                {formData.username}
              </h2>
              <p className="text-fashion-muted">{formData.email}</p>
              <div className="mt-3 flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sidebar-border hover:cursor-pointer"
                  onClick={handleChangeAvatar}
                >
                  Select Photo
                </Button>
                {selectedFile && (
                  <Button
                    size="sm"
                    className="bg-fashion-accent hover:bg-fashion-accent/90 hover:cursor-pointer"
                    onClick={handleConfirmUpload}
                  >
                    Confirm Upload
                  </Button>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-fashion-muted" />
                  User Name
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  className="border-gray-300"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-fashion-muted" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  className="border-gray-300"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-fashion-muted" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-fashion-muted" />
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                className="bg-fashion-accent hover:bg-fashion-accent/90 hover:cursor-pointer"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-fashion-DEFAULT">
            Password
          </h2>
          <Button
            variant="outline"
            className="border-fashion-muted text-fashion-DEFAULT border-sidebar-border hover:cursor-pointer"
            onClick={() => setShowChangePassword(true)}
          >
            Change Password
          </Button>
        </div>
      </div>
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </Layout>
  );
};

export default Settings;
