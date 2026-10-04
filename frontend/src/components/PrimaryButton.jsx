import { motion } from 'framer-motion';

const PrimaryButton = ({ children, onClick, className = '', ...props }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2, boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)' }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default PrimaryButton;
