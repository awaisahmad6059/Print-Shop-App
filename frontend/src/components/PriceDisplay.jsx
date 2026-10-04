import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

const PriceDisplay = ({ amount = 0, currency = 'Rs.' }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest * 100) / 100);

  useEffect(() => {
    const animation = animate(count, amount, {
      duration: 0.8,
      ease: 'easeOut',
    });

    return animation.stop;
  }, [amount, count]);

  return (
    <motion.div
      className="text-4xl font-bold text-orange-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {currency} {rounded.get().toFixed(2)}
    </motion.div>
  );
};

export default PriceDisplay;
