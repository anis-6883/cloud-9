import { ToastMessageTypes, ToastOptions } from "@/lib/types";
import { toast as hotToast } from "react-hot-toast";

const Toast = {
  success: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast.success(JSON.stringify(parsed), {
      duration: options?.duration || 3000,
      id: options?.id
    });
  },

  error: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast.error(JSON.stringify(parsed), {
      duration: options?.duration || 3000,
      id: options?.id
    });
  },

  warning: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast(JSON.stringify({ ...parsed, type: "warning" }), {
      duration: options?.duration || 3000,
      id: options?.id,
      icon: "⚠️"
    });
  },
  clickable: (message: ToastMessageTypes, onClick: () => void, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);

    return hotToast.custom(
      t => (
        <div
          role='button'
          tabIndex={0}
          onClick={() => {
            onClick();
            hotToast.dismiss(t.id);
          }}
          onTouchEnd={e => {
            e.preventDefault();
            onClick();
            hotToast.dismiss(t.id);
          }}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              onClick();
              hotToast.dismiss(t.id);
            }
          }}
          className={`group border-primary/40 hover:border-primary/40 relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-gradient-to-r from-black via-black to-black px-5 py-4 text-white shadow-2xl transition-all hover:-translate-y-1 hover:shadow-purple-500/50 active:scale-95 ${
            t.visible ? "animate-in fade-in slide-in-from-bottom-3 duration-500" : "animate-leave"
          }`}
          style={{
            boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3), 0 0 20px rgba(236, 72, 153, 0.2)"
          }}
        >
          {/* Animated background glow */}
          <div className='to-primary absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-black opacity-0 blur-xl transition-opacity group-hover:opacity-20' />

          {/* Sparkles */}
          <span className='absolute -top-3 -right-3 animate-bounce text-2xl'>✨</span>
          <span className='absolute top-1 left-1 animate-pulse text-xl'>⭐</span>
          <span className='absolute -right-1 -bottom-1 animate-bounce text-lg' style={{ animationDelay: "0.3s" }}>
            💫
          </span>

          {/* Icon with gradient background */}
          <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-all group-hover:bg-white/30'>
            <svg
              width={18}
              height={18}
              viewBox='0 0 16 16'
              fill='none'
              stroke='currentColor'
              strokeWidth={2.5}
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='8' cy='8' r='6' />
              <path d='M8 8v3M8 5.5v.5' />
            </svg>
          </div>

          {/* Text */}
          <div className='min-w-0 flex-1'>
            {parsed.title && <p className='mb-1 text-[14px] leading-snug font-bold text-white drop-shadow-lg'>{parsed.title}</p>}
            <p className='m-0 text-[13px] leading-relaxed text-white/95 drop-shadow-md'>{parsed.description}</p>
          </div>

          {/* Animated Arrow */}
          <svg
            className='flex-shrink-0 text-white transition-transform group-hover:translate-x-1'
            width={18}
            height={18}
            viewBox='0 0 16 16'
            fill='none'
            stroke='currentColor'
            strokeWidth={2.5}
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M3 8h10M9 4l4 4-4 4' />
          </svg>
        </div>
      ),
      { duration: options?.duration ?? 3000, id: options?.id }
    );
  },
  info: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast(JSON.stringify({ ...parsed, type: "info" }), {
      duration: options?.duration || 3000,
      id: options?.id
    });
  },

  loading: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast.loading(JSON.stringify(parsed), {
      duration: options?.duration || Infinity,
      id: options?.id
    });
  },

  custom: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast(
      JSON.stringify({
        ...parsed,
        type: "custom",
        hasCustomIcon: !!options?.icon
      }),
      {
        duration: options?.duration || 3000,
        id: options?.id,
        icon: options?.icon
      }
    );
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: ToastMessageTypes;
      success: ToastMessageTypes;
      error: ToastMessageTypes;
    },
    options?: ToastOptions
  ) => {
    return hotToast.promise(
      promise,
      {
        loading: JSON.stringify(parseToastMessage(messages.loading)),
        success: JSON.stringify(parseToastMessage(messages.success)),
        error: JSON.stringify(parseToastMessage(messages.error))
      },
      {
        duration: options?.duration || 3000,
        id: options?.id
      }
    );
  },

  dismiss: (toastId?: string) => hotToast.dismiss(toastId),
  remove: (toastId?: string) => hotToast.remove(toastId)
};

export default Toast;

const parseToastMessage = (message: ToastMessageTypes) => {
  if (typeof message === "string") {
    return { description: message };
  }
  return {
    title: message.title,
    description: message.description || message.message || ""
  };
};

// Example: Loading Toast
// const t = Toast.loading("Redirecting to dashboard...");
// setTimeout(() => {
//   Toast.dismiss(t);
//   Toast.success("Login successful!", { id: t });
// }, 3000);
