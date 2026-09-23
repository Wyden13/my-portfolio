"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
export default function Section({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={className ? className : ""}
    >
      {children}
    </motion.div>
  );
}
