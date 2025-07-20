import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1 flex-1">
              {title && (
                <ToastTitle className="flex items-center gap-2">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="leading-relaxed">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="hover:bg-black/10 rounded-full transition-colors duration-200" />
          </Toast>
        );
      })}
      <ToastViewport className="fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-4 sm:right-4 sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  );
}
