"use client";

import AdminLoginForm from "@/components/admin/admin-login-from";

export default function AdminLogin() {
  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-[#F0F8FC]'>
      {/* Soft gradient to add subtle depth using your core brand colors */}
      <div className='absolute inset-0 bg-linear-to-br from-[#F0F8FC] via-[#E6F2FA] to-[#DBEEFA]' />

      {/* Grid overlay with subtle dark borders instead of light ones */}
      <div
        className='absolute inset-0 opacity-40'
        style={{
          backgroundImage: `
            linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px"
        }}
      />

      {/* Soft light vignette for premium blend (no harsh dark edges) */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,rgba(240,248,252,0.1)_80%)]' />

      {/* Content */}
      <div className='relative z-10 flex min-h-screen items-center justify-center p-4'>
        <AdminLoginForm />
      </div>
    </div>
  );
}
