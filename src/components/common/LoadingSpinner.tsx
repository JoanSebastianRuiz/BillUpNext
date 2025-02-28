import { Loader } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: number;
  color?: string;
}

export default function LoadingSpinner({
  fullScreen = false,
  size = 40,
  color = "text-gray-900 dark:text-gray-100",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-black bg-opacity-30 z-50" : "h-20"
      }`}
    >
      <motion.div
        className="relative flex items-center justify-center"
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        <Loader className={`${color}`} style={{ width: size, height: size }} />
      </motion.div>
    </div>
  );
}
