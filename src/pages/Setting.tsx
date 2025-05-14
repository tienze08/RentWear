import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserRound, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    address: "123 Fashion St, New York, NY 10001",
    avatar: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a backend
    toast.success("Profile updated successfully!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-fashion-DEFAULT">Account Settings</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <Avatar className="w-24 h-24 border-2 border-gray-200">
              {formData.avatar ? (
                <AvatarImage src={formData.avatar} alt={formData.name} />
              ) : (
                <AvatarFallback className="text-2xl bg-fashion-accent text-white">
                  {getInitials(formData.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold text-fashion-DEFAULT mb-1">{formData.name}</h2>
              <p className="text-fashion-muted">{formData.email}</p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="mr-2 border-sidebar-border">
                  Change Photo
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-fashion-muted" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-gray-300"
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
                  onChange={handleChange}
                  className="border-gray-300"
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
              <Button type="submit" className="bg-fashion-accent hover:bg-fashion-accent/90">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-fashion-DEFAULT">Password</h2>
          <Button variant="outline" className="border-fashion-muted text-fashion-DEFAULT border-sidebar-border">
            Change Password
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;