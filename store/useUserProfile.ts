import { getAdminProfile } from "@/actions/admin/profile-actions";
import { create } from "zustand";

interface IUserProfileState {
  userData: any;
  isLoading: boolean;
  error: string | null;
  fetchAdminProfileData: () => Promise<void>;
  clearUserData: () => void;
  statusCode?: number;
  setUserData: (data: any) => void;
}

const useUserProfile = create<IUserProfileState>((set) => ({
  userData: null,
  isLoading: false,
  error: null,
  statusCode: 200,

  setUserData: (data: any) => set({ userData: data }),

  fetchAdminProfileData: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await getAdminProfile();

      // Check for errors
      if (!res?.status) {
        set({
          error: res.message,
          statusCode: res.statusCode,
          userData: null,
        });
        return; // Exit early on error
      }

      // Set success data
      if (res?.data) {
        set({
          userData: res.data?.data || res.data,
          error: null,
          statusCode: res.statusCode,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Unknown error",
        statusCode: error?.statusCode || 500,
        userData: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearUserData: () =>
    set({
      userData: null,
      error: null,
      statusCode: 200,
    }),
}));

export default useUserProfile;

export const getCurrentUserId = () => {
  return useUserProfile.getState().userData?._id;
};
