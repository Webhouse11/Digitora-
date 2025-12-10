import React from 'react';
import { X, ShieldCheck, Zap, Download } from 'lucide-react';
import { Course } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onPaymentSuccess: (courseId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, course, onPaymentSuccess }) => {
  if (!isOpen || !course) return null;

  const handleSimulatePayment = () => {
    // In a real application, this would be a webhook listener or payment gateway callback
    // For this demo, we manually trigger success
    onPaymentSuccess(course.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-brand-card border border-gold-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-gold-900/20 transform transition-all animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
            <Zap className="w-8 h-8 text-gold-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Secure Enrollment</h2>
          <p className="text-gray-400 text-sm">You are purchasing:</p>
          <p className="text-gold-400 font-semibold text-lg mt-1">{course.title}</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Course Price:</span>
            <span className="text-white font-mono">${course.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Processing Fee:</span>
            <span className="text-green-400 font-mono">$0.00</span>
          </div>
          <div className="h-px bg-gray-700 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-white font-bold">Total:</span>
            <span className="text-gold-400 font-bold font-mono text-xl">${course.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-center text-xs text-gray-500 mb-2">
            Click below to pay securely via NOWPayments.
          </p>
          
          <div className="flex justify-center transform hover:scale-105 transition-transform duration-200">
             {/* NOWPayments Button Code from prompt */}
            <a href="https://nowpayments.io/payment/?iid=5478273928&source=button" target="_blank" rel="noreferrer noopener" className="block">
                <img src="https://nowpayments.io/images/embeds/payment-button-white.svg" alt="Cryptocurrency & Bitcoin payment button by NOWPayments" />
            </a>
          </div>

          <div className="relative mt-4 pt-4 border-t border-gray-800 text-center">
             <p className="text-xs text-gray-400 mb-3">
               Once payment is complete, your download link will unlock instantly.
             </p>
             <button 
               onClick={handleSimulatePayment}
               className="text-xs text-green-500 hover:text-green-400 underline decoration-dotted underline-offset-4"
             >
               (Demo: Click here to simulate successful payment)
             </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
          <ShieldCheck className="w-4 h-4" />
          <span>Encrypted & Decentralized Payment</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;