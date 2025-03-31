import React from 'react';

interface ResponseModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const ResponseModal: React.FC<ResponseModalProps> = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Cerebro&apos;s response</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-brandPurple text-white font-semibold py-2 px-4 rounded-full hover:bg-brandPurple/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brandPurple/50 focus:ring-offset-2"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default ResponseModal; 