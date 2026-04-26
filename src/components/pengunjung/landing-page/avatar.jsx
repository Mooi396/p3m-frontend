import { Avatar } from "@material-tailwind/react";
import { motion } from "framer-motion";

export function AvatarMarquee() {
  const avatars = [
    "https://docs.material-tailwind.com/img/face-1.jpg",
    "https://docs.material-tailwind.com/img/face-2.jpg",
    "https://docs.material-tailwind.com/img/face-3.jpg",
    "https://docs.material-tailwind.com/img/face-4.jpg",
    "https://docs.material-tailwind.com/img/face-5.jpg",
    "https://docs.material-tailwind.com/img/face-1.jpg",
    "https://docs.material-tailwind.com/img/face-2.jpg",
  ];

  return (
    <div className="relative flex overflow-hidden w-full py-10">
      <motion.div
        className="flex gap-10 px-5"
        animate={{
          x: [0, -1035],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {[...avatars, ...avatars].map((src, index) => (
          <div key={index} className="flex-shrink-0">
            <Avatar src={src} alt="avatar" size="xxl" className="hover:scale-110 transition-transform cursor-pointer" />
          </div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent"></div>
    </div>
  );
}