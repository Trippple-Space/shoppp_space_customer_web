import React from 'react';
import { passwordValidatorRegex } from '../../utility/utility';
import { motion } from 'framer-motion';

const getPasswordStrength = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = passwordValidatorRegex.test(password);
  
  if (password.length < 3) return 1;
  if (password.length <= 4) return 2;

  const meetsBaseCriteria = password.length >= 5 && hasSpecialChar && hasUpperCase && hasLowerCase && hasNumber;
  if (!meetsBaseCriteria) return 2;

  if (password.length >= 12) return 5;
  if (password.length > 8) return 4;
  return 3;
};

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const score = getPasswordStrength(password);
  const num = (score * 100) / 5; 

  const createPassLabel = () => {
    switch (score) {
      case 1:
        return (
          <p className="text-12 color-#00000099">
            <span className="weight-500 color-black">Password strength is too weak:</span> Enter at least 8 characters
          </p>
        );
      case 2:
        return (
          <p className="text-12 color-#00000099">
            <span className="weight-500 color-black">Password strength is weak:</span>
            Try adding 1 uppercase, 1 number and 1 special character.
          </p>
        );
      case 3:
        return 'Password is OK';
      case 4:
        return 'Password is Strong';
      case 5:
        return 'Password is very Strong';
      default:
        return '';
    }
  };

  const funcProgressColor = () => {
    switch (score) {
      case 1:
        return '#FF4B2B'; 
      case 2:
        return '#FF6A2B'; 
      case 3:
        return '#FFAD00'; 
      case 4:
        return '#9bc158'; 
      case 5:
        return '#37D90E'; 
      default:
        return '#F5F5F5';
    }
  };


  const progressStyle: React.CSSProperties = {
    width: `${num}%`,
    background: funcProgressColor(),
    height: '12px',
    borderTopLeftRadius: '6px',
    borderBottomLeftRadius: '6px',
  };


  if (num === 100) {
    progressStyle.borderTopRightRadius = '6px';
    progressStyle.borderBottomRightRadius = '6px';
  }

  return (
    <>
      <div className="radius-6" style={{ height: '12px', background: '#F5F5F5' }}>
        <motion.div 
          animate={{ width: progressStyle.width, background: progressStyle.background }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={progressStyle}
        />
      </div>
      <div className="text-12 mt-10">{createPassLabel()}</div>
    </>
  );
};

export default PasswordStrengthMeter;
