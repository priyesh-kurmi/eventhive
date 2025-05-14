"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import clsx from "clsx";
import { X } from "lucide-react";

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={clsx(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  onClose?: () => void;
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, onClose, ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={clsx(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-gray-200 p-6 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full bg-white",
        className
      )}
      onEscapeKeyDown={onClose}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={clsx(
      "absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

// Add types for global toast function
declare global {
  interface Window {
    toast: (content: React.ReactNode) => void;
  }
}

export {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};

export function Toaster() {
  const [toasts, setToasts] = React.useState<React.ReactNode[]>([]);

  const add = React.useCallback(
    (toast: React.ReactNode) => {
      setToasts((prev) => [...prev, toast]);
    },
    []
  );

  const remove = React.useCallback(
    (index: number) => {
      setToasts((prev) => {
        const newToasts = [...prev];
        newToasts.splice(index, 1);
        return newToasts;
      });
    },
    []
  );

  // Create a global toast function
  React.useEffect(() => {
    window.toast = add;
  }, [add]);

  return (
    <ToastProvider>
      {toasts.map((toast, index) => (
        <Toast key={index} onClose={() => remove(index)}>
          {toast}
          <ToastClose onClick={() => remove(index)} />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}