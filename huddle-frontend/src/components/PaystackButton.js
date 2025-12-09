import React from 'react';

/**
 * Paystack Payment Button Component
 * 
 * This component is prepared for Paystack integration.
 * To integrate:
 * 1. Install: npm install react-paystack
 * 2. Get your public key from Paystack dashboard
 * 3. Uncomment and configure the payment handler
 * 
 * Example usage:
 * <PaystackButton 
 *   amount={itemPrice}
 *   email={userEmail}
 *   metadata={{ itemId, userId }}
 *   onSuccess={handlePaymentSuccess}
 *   onClose={handlePaymentClose}
 * />
 */

const PaystackButton = ({ 
  amount, 
  email, 
  metadata = {}, 
  onSuccess, 
  onClose,
  text = 'Pay with Paystack',
  className = 'btn btn-primary'
}) => {
  // TODO: Uncomment when Paystack is integrated
  // import { usePaystackPayment } from 'react-paystack';
  
  // const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
  
  // const config = {
  //   reference: new Date().getTime().toString(),
  //   email: email,
  //   amount: amount * 100, // Convert to kobo (Paystack uses kobo)
  //   publicKey: publicKey,
  //   metadata: {
  //     ...metadata,
  //     custom_fields: [
  //       {
  //         display_name: "Platform",
  //         variable_name: "platform",
  //         value: "Huddle"
  //       }
  //     ]
  //   }
  // };

  // const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    // TODO: Uncomment when Paystack is integrated
    // initializePayment({
    //   onSuccess: (reference) => {
    //     console.log('Payment successful:', reference);
    //     if (onSuccess) onSuccess(reference);
    //   },
    //   onClose: () => {
    //     console.log('Payment closed');
    //     if (onClose) onClose();
    //   }
    // });

    // Temporary placeholder
    alert('Paystack integration coming soon! Configure your Paystack public key in the PaystackButton component.');
  };

  return (
    <button 
      onClick={handlePayment} 
      className={className}
      style={{
        width: '100%',
        padding: '16px',
        fontSize: '1.05em',
        fontWeight: 600,
        cursor: 'pointer',
        border: 'none',
        borderRadius: '8px',
        transition: 'all 0.3s',
        background: '#003366',
        color: 'white'
      }}
    >
      {text}
    </button>
  );
};

export default PaystackButton;

