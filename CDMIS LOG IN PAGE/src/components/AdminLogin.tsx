import backgroundImage from "figma:asset/5a957da2c117ca8b97f1cfc3c25ae862f8edc83b.png";
import bipsuLogo from "figma:asset/361443aa4e0a27fb2ccdaa4a85ae3fcb8a577692.png";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AdminLoginProps {
  onBack?: () => void;
}

export function AdminLogin({ onBack }: AdminLoginProps) {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Admin login submitted");
  };

  return (
    <div className="size-full flex">
      {/* Left side - Background Image */}
      <div className="flex-1 relative overflow-hidden">
        <img 
          src={backgroundImage} 
          alt="BIPSU Campus" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Panel */}
      <div className="w-full max-w-md bg-white flex flex-col items-center justify-center px-12 py-16">
        {/* BIPSU Logo */}
        <div className="mb-8">
          <img 
            src={bipsuLogo} 
            alt="BIPSU Logo" 
            className="w-32 h-32"
          />
        </div>

        {/* University Name */}
        <div className="text-center mb-8">
          <h1 className="text-[15px] leading-tight mb-1">
            Biliran Province State University
          </h1>
          <p className="text-[15px]">
            Naval, Biliran
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full">
          {/* Administrator Label */}
          <div className="mb-6">
            <Button 
              className="w-full h-12 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg"
              disabled
            >
              Administrator
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* User ID Input */}
            <div>
              <label htmlFor="userId" className="block text-sm mb-2">
                User id
              </label>
              <Input
                id="userId"
                type="text"
                className="w-full h-12 bg-white border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-gray-500"
                placeholder=""
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                className="w-full h-12 bg-white border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-gray-500"
                placeholder=""
              />
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <Button 
                type="submit"
                className="w-full h-12 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
