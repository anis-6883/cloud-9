"use client";

import routes from "@/config/routes";
import useUserProfile from "@/store/useUserProfile";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const { fetchAdminProfileData, statusCode, userData } = useUserProfile();
  const token = session?.token;

  // Handle logout safely (NO early return)
  useEffect(() => {
    if (status === "unauthenticated" || statusCode === 401) {
      signOut({
        redirect: true,
        callbackUrl: routes.publicRoutes.home
      });
    } else {
      setIsLoading(false);
    }
  }, [status, statusCode]);

  // Fetch profile
  useEffect(() => {
    if (!token) return;

    fetchAdminProfileData();
  }, [token, fetchAdminProfileData]);

  //  Block UI during redirect (prevents dashboard flash)
  if (!userData || statusCode === 401 || isLoading) {
    return (
      <div className='bg-bg-gradient-neon flex min-h-screen items-center justify-center'>
        <div className='relative flex flex-col items-center'>
          <div className='absolute -top-20 flex items-center justify-center'>
            <img src='/logo.png' alt='Logo' className='w-52' />
          </div>

          {/* <Lottie animationData={brainloading} loop className="size-52" /> */}

          <p className='absolute -bottom-8 text-lg font-semibold text-white'>Please take a while...⏳</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
