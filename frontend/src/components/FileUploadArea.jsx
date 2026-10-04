import { motion } from 'framer-motion';
import { useState } from 'react';

const FileUploadArea = ({ onFileSelect, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-cyan-600 bg-cyan-50' : 'border-cyan-300 bg-white'
      }`}
      whileHover={{ borderColor: '#0891B2' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={handleChange}
        className="hidden"
        id="file-upload"
        accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <motion.div
          animate={{ scale: isDragging ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-4xl mb-4">📁</div>
          {file ? (
            <div>
              <p className="text-green-600 font-semibold">{file.name}</p>
              <p className="text-gray-600 text-sm mt-2">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 font-semibold">
                Click to upload or drag & drop
              </p>
              <p className="text-gray-500 text-sm mt-2">
                PDF, DOCX, JPG, PNG up to 10MB
              </p>
            </div>
          )}
        </motion.div>
      </label>
    </motion.div>
  );
};

export default FileUploadArea;
