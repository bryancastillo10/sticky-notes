import { createContext, useContext, useState, useCallback } from "react";
import Toast from "@/components/Toast";

export interface ToastProps{
    status: "success"|"error" | "warning";
    message: string;
    onClose?: () => void;
    isVisible?: boolean;
}

interface ToastContextType {
  showToast: (props: Omit<ToastProps, "onClose">) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [toastProps, setToastProps] = useState<ToastProps>({
    status: "warning",
    message: "",
  });

  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  const showToastWithProps = useCallback(
    (props: Omit<ToastProps, "onClose">) => {
      setToastProps({ ...props, onClose: hideToast });
      setIsVisible(true);

      const timeoutId = setTimeout(() => {
        hideToast();
      }, 5000);

      return () => clearTimeout(timeoutId);
    },
    [hideToast]
  );

  return (
    <ToastContext.Provider value={{ showToast: showToastWithProps, hideToast }}>
      {children}
          {isVisible && <Toast {...toastProps} isVisible={isVisible} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within the CustomToastProvider");
  }
  return context;
};

export default ToastProvider;
