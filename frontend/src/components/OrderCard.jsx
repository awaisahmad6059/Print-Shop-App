import { motion } from 'framer-motion';
import PrimaryButton from './PrimaryButton';

const statusColors = {
  Submitted: 'bg-blue-100 text-blue-800',
  Accepted: 'bg-blue-100 text-blue-800',
  Printing: 'bg-purple-100 text-purple-800',
  'Ready for Pickup': 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Cancelled: 'bg-gray-100 text-gray-800',
  'Print Failed': 'bg-red-100 text-red-800',
};

const OrderCard = ({ order, onAccept, onReject, onReadyForPickup, onComplete, showActions = true }) => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 12, duration: 0.4 }}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
      className="bg-white p-6 rounded-xl border border-gray-200 mb-4 transition-all"
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-cyan-600">
              Order #{order.order_number}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
              {order.status}
            </span>
          </div>
          <p className="text-gray-900 font-medium">{order.file?.file_name}</p>
          <div className="text-sm text-gray-500 mt-2 space-y-1">
            <p>
              {order.print_config?.color_mode}, {order.print_config?.double_sided ? 'Double' : 'Single'}-sided,{' '}
              {order.print_config?.number_of_copies} copies, {order.print_config?.paper_size || 'A4'}
            </p>
            {order.file?.file_url && (
              <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${order.file.file_url}`} target="_blank" rel="noreferrer" className="text-cyan-600 underline">
                Download File
              </a>
            )}
            {order.customer?.name && <p>Customer: {order.customer.name}</p>}
            {order.customer?.phone && <p>Phone: {order.customer.phone}</p>}
            <p>Created: {new Date(order.timestamps?.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-orange-500">
            Rs. {order.pricing?.total_amount?.toFixed(2)}
          </div>
          {showActions && order.status === 'Submitted' && (
            <div className="flex gap-2 mt-3">
              <PrimaryButton onClick={() => onAccept(order)}>
                Accept & Print
              </PrimaryButton>
              {onReject && (
                <PrimaryButton onClick={() => onReject(order)} className="bg-red-600 hover:bg-red-700">
                  Reject
                </PrimaryButton>
              )}
            </div>
          )}
          {showActions && (order.status === 'Printing' || order.status === 'Accepted') && (
            <PrimaryButton onClick={() => onReadyForPickup(order)} className="mt-3 bg-yellow-600 hover:bg-yellow-700">
              Ready for Pickup
            </PrimaryButton>
          )}
          {showActions && order.status === 'Ready for Pickup' && (
            <PrimaryButton onClick={() => onComplete(order)} className="mt-3 bg-green-600 hover:bg-green-700">
              Mark Complete
            </PrimaryButton>
          )}
          {showActions && order.status === 'Print Failed' && (
            <PrimaryButton onClick={() => onAccept(order)} className="mt-3 bg-orange-600 hover:bg-orange-700">
              Retry Print
            </PrimaryButton>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
