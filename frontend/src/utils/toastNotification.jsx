import { toast } from "react-toastify";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const toastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    ...toastConfig,
    icon: <CheckCircle size={20} />,
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    ...toastConfig,
    icon: <AlertCircle size={20} />,
  });
};

export const showWarningToast = (message) => {
  toast.warning(message, {
    ...toastConfig,
    icon: <AlertTriangle size={20} />,
  });
};

export const showInfoToast = (message) => {
  toast.info(message, {
    ...toastConfig,
    icon: <Info size={20} />,
  });
};
