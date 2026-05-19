"use client";

import Toast from "@/components/shared/Toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import routes from "@/config/routes";
import { useFormSheet } from "@/context/FormSheetContext";
// import useUserProfile from "@/store/useUserProfile";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { PiLockKeyOpenFill, PiUserFill } from "react-icons/pi";

export default function UserMenu() {
  // const { userData, clearUserData } = useUserProfile();
  const [open, setOpen] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const { openSheet } = useFormSheet();
  const router = useRouter();

  //   logout function
  const handleLogout = async () => {
    await signOut({
      redirect: true
    });
    router.replace(routes.publicRoutes.adminLogin);
    Toast.success({ title: "Success", description: "Logout Successfully!" });
    // clearUserData();
  };

  const userData = {
    image: "https://github.com/shadcn.png",
    name: "Admin User",
    email: "shariard58@gmail.com"
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className='flex cursor-pointer items-center gap-1.5 rounded-md text-sm font-medium focus:outline-none'>
            <Avatar>
              <AvatarImage src={userData?.image || "https://github.com/shadcn.png"} alt='admin' />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className='dark:text-white'>{userData?.name}</span>
            <ChevronDown
              className={`text-primary h-5 w-5 transform cursor-pointer transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          className='mt-3.5 w-[240px] rounded-xl border border-gray-100 bg-white p-2 shadow-md dark:border-gray-800 dark:bg-gray-900'
        >
          <div className='px-3 py-2'>
            <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>{userData?.name}</p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>{userData?.email}</p>
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsChangePassword(false);
              openSheet();
              setOpen(false);
            }}
            className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            <PiUserFill className='text-xl!' />
            Edit Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          {/* ✅ Change Password */}
          <DropdownMenuItem
            onClick={() => {
              setIsChangePassword(true);
              openSheet();
              setOpen(false);
            }}
            className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            <PiLockKeyOpenFill className='text-xl!' />
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild onClick={() => handleLogout()}>
            <Link
              href='#'
              className='dark:text-primary text-primary flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10'
            >
              <HiOutlineLogout className='text-primary text-xl!' />
              Sign Out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
