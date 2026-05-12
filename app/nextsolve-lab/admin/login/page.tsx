"use client";

import AdminLoginForm from "@/components/admin/admin-login-from";

export default function AdminLogin() {
  return (
    <div className='relative min-h-screen w-full overflow-hidden'>
      {/* Base gradient background */}
      <div className='absolute inset-0 bg-gradient-to-br from-[#07243a] via-[#0b3a4a] to-[#041827]' />

      {/* Grid overlay */}
      <div
        className='absolute inset-0 opacity-40'
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px"
        }}
      />

      {/* Soft vignette (edge darkening) */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_70%)]' />

      {/* Content */}
      <div className='relative z-10 flex min-h-screen items-center justify-center'>
        <AdminLoginForm />
      </div>
    </div>
  );
}
