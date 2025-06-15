import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const SystemSettings = () => {
    const { toast } = useToast();
    const [generalSettings, setGeneralSettings] = useState({
        siteName: "Outdoor Rental System",
        tagline: "The best gear rental platform for outdoor enthusiasts",
        contactEmail: "contact@rentalcompany.com",
        contactPhone: "+1 (555) 123-4567",
        currency: "USD",
    });

    const handleGeneralChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setGeneralSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveSettings = (type: string) => {
        toast({
            title: "Settings saved",
            description: `Your ${type} settings have been saved successfully.`,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    System Settings
                </h1>
                <p className="text-gray-500 mt-1">
                    Configure and manage your system settings
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid grid-cols-4 sm:w-[500px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                General Settings
                            </h2>

                            <div className="grid gap-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="siteName">
                                            Site Name
                                        </Label>
                                        <Input
                                            id="siteName"
                                            name="siteName"
                                            value={generalSettings.siteName}
                                            onChange={handleGeneralChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tagline">Tagline</Label>
                                        <Input
                                            id="tagline"
                                            name="tagline"
                                            value={generalSettings.tagline}
                                            onChange={handleGeneralChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">
                                        Contact Email
                                    </Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        name="contactEmail"
                                        value={generalSettings.contactEmail}
                                        onChange={handleGeneralChange}
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactPhone">
                                            Contact Phone
                                        </Label>
                                        <Input
                                            id="contactPhone"
                                            name="contactPhone"
                                            value={generalSettings.contactPhone}
                                            onChange={handleGeneralChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="currency">
                                            Default Currency
                                        </Label>
                                        <Select
                                            defaultValue={
                                                generalSettings.currency
                                            }
                                        >
                                            <SelectTrigger id="currency">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USD">
                                                    USD ($)
                                                </SelectItem>
                                                <SelectItem value="EUR">
                                                    EUR (€)
                                                </SelectItem>
                                                <SelectItem value="GBP">
                                                    GBP (£)
                                                </SelectItem>
                                                <SelectItem value="CAD">
                                                    CAD ($)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button
                                    onClick={() =>
                                        handleSaveSettings("general")
                                    }
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Notification Preferences
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium">
                                            Email Notifications
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Send email notifications for new
                                            orders
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium">
                                            SMS Notifications
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Send SMS alerts for important
                                            updates
                                        </p>
                                    </div>
                                    <Switch />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium">
                                            Browser Notifications
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Show browser notifications for new
                                            activities
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <Button
                                    onClick={() =>
                                        handleSaveSettings("notifications")
                                    }
                                    variant="outline"
                                    className="mt-4"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Preferences
                                </Button>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Payment Gateways
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium">Stripe</h4>
                                        <p className="text-sm text-gray-500">
                                            Accept credit card payments via
                                            Stripe
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <Separator />

                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="stripeKey">
                                            API Key
                                        </Label>
                                        <Input
                                            id="stripeKey"
                                            type="password"
                                            value="sk_•••••••••••••••••••••••••••••"
                                            readOnly
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stripePublicKey">
                                            Public Key
                                        </Label>
                                        <Input
                                            id="stripePublicKey"
                                            type="password"
                                            value="pk_•••••••••••••••••••••••••••••"
                                            readOnly
                                        />
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                    >
                                        Update Stripe Keys
                                    </Button>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium">PayPal</h4>
                                        <p className="text-sm text-gray-500">
                                            Accept payments via PayPal
                                        </p>
                                    </div>
                                    <Switch />
                                </div>

                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="paypalClientId">
                                            Client ID
                                        </Label>
                                        <Input
                                            id="paypalClientId"
                                            placeholder="Enter PayPal Client ID"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="paypalSecret">
                                            Secret
                                        </Label>
                                        <Input
                                            id="paypalSecret"
                                            type="password"
                                            placeholder="Enter PayPal Secret"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={() =>
                                        handleSaveSettings("payment")
                                    }
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Payment Settings
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Tax Settings
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium">
                                            Enable Tax Calculation
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Automatically calculate taxes for
                                            orders
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="grid gap-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="taxRate">
                                                Default Tax Rate (%)
                                            </Label>
                                            <Input
                                                id="taxRate"
                                                type="number"
                                                defaultValue="8.5"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="taxName">
                                                Tax Name
                                            </Label>
                                            <Input
                                                id="taxName"
                                                defaultValue="Sales Tax"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleSaveSettings("tax")
                                        }
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Tax Settings
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Security Settings
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium">
                                            Two-Factor Authentication
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Require 2FA for all admin users
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-medium">
                                            Password Expiry
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Force password reset every 90 days
                                        </p>
                                    </div>
                                    <Switch />
                                </div>

                                <Separator />

                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="passwordPolicy">
                                            Password Policy
                                        </Label>
                                        <Select defaultValue="strong">
                                            <SelectTrigger id="passwordPolicy">
                                                <SelectValue placeholder="Select policy" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="basic">
                                                    Basic (min. 8 characters)
                                                </SelectItem>
                                                <SelectItem value="standard">
                                                    Standard (letters, numbers,
                                                    8+ chars)
                                                </SelectItem>
                                                <SelectItem value="strong">
                                                    Strong (letters, numbers,
                                                    symbols, 10+ chars)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sessionTimeout">
                                            Session Timeout (minutes)
                                        </Label>
                                        <Input
                                            id="sessionTimeout"
                                            type="number"
                                            defaultValue="30"
                                        />
                                    </div>

                                    <Button
                                        onClick={() =>
                                            handleSaveSettings("security")
                                        }
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Security Settings
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Access Logs
                            </h2>

                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">
                                    View and manage system access logs
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    IP Address
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date/Time
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {[
                                                {
                                                    user: "admin@example.com",
                                                    action: "Login",
                                                    ip: "192.168.1.1",
                                                    datetime:
                                                        "2025-05-19 10:24 AM",
                                                },
                                                {
                                                    user: "staff@example.com",
                                                    action: "Update Product",
                                                    ip: "192.168.1.5",
                                                    datetime:
                                                        "2025-05-19 09:15 AM",
                                                },
                                                {
                                                    user: "admin@example.com",
                                                    action: "Update Settings",
                                                    ip: "192.168.1.1",
                                                    datetime:
                                                        "2025-05-18 04:32 PM",
                                                },
                                            ].map((log, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {log.user}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {log.action}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {log.ip}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        {log.datetime}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    View All Logs
                                </Button>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-6">
                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Connected Services
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center mr-4">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-6 w-6 text-blue-600"
                                            >
                                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">
                                                GitHub
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Sync issues and code
                                                repositories
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Connected
                                    </Button>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center mr-4">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-6 w-6 text-green-600"
                                            >
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                <rect
                                                    x="2"
                                                    y="9"
                                                    width="4"
                                                    height="12"
                                                ></rect>
                                                <circle
                                                    cx="4"
                                                    cy="4"
                                                    r="2"
                                                ></circle>
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">
                                                Google Analytics
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Track website traffic and user
                                                behavior
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Connect
                                    </Button>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center mr-4">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-6 w-6 text-blue-600"
                                            >
                                                <path d="M7 10v12"></path>
                                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">
                                                Mailchimp
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Email marketing automation
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Connect
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                API Credentials
                            </h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="apiKey">API Key</Label>
                                    <div className="flex">
                                        <Input
                                            id="apiKey"
                                            value="api_key_•••••••••••••••••••••••••••••"
                                            readOnly
                                            className="rounded-r-none"
                                        />
                                        <Button
                                            variant="outline"
                                            className="rounded-l-none border-l-0"
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apiDocs">
                                        API Documentation
                                    </Label>
                                    <p className="text-sm text-gray-500">
                                        Access our API documentation to
                                        integrate with our services
                                        <a
                                            href="#"
                                            className="text-blue-600 ml-1 hover:underline"
                                        >
                                            View Documentation
                                        </a>
                                    </p>
                                </div>

                                <Button variant="outline">
                                    Generate New API Key
                                </Button>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SystemSettings;
