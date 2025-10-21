import { useState } from "react";
import backgroundImage from "figma:asset/5a957da2c117ca8b97f1cfc3c25ae862f8edc83b.png";
import bipsuLogo from "figma:asset/361443aa4e0a27fb2ccdaa4a85ae3fcb8a577692.png";
import { Button } from "./components/ui/button";
import { AdminLogin } from "./components/AdminLogin";
import { CustodianLogin } from "./components/CustodianLogin";
import { StaffLogin } from "./components/StaffLogin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"main" | "admin" | "custodian" | "staff">("main");

  if (currentPage === "admin") {
    return <AdminLogin onBack={() => setCurrentPage("main")} />;
  }

  if (currentPage === "custodian") {
    return <CustodianLogin onBack={() => setCurrentPage("main")} />;
  }

  if (currentPage === "staff") {
    return <StaffLogin onBack={() => setCurrentPage("main")} />;
  }

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
        <div className="text-center mb-12">
          <h1 className="text-xl">
            Biliran Province State University
          </h1>
          <p className="text-[15px]">Naval, Biliran</p>
        </div>

        {/* Login Buttons */}
        <div className="w-full space-y-4">
          <Button
            className="w-full h-12 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg"
            onClick={() => setCurrentPage("admin")}
          >
            Administrator
          </Button>

          <Button
            className="w-full h-12 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg"
            onClick={() => setCurrentPage("custodian")}
          >
            Departmental Records Custodian
          </Button>

          <Button
            className="w-full h-12 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg"
            onClick={() => setCurrentPage("staff")}
          >
            Staff
          </Button>
        </div>
      </div>
    </div>
  );
}