import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

interface PasswordValidationProps {
  password?: string;
}

export const PasswordValidation: React.FC<PasswordValidationProps> = ({ password }) => {
  if (!password) return null;

  const checks = [
    { label: 'Must contain at least one number', pass: /[0-9]/.test(password) },
    { label: 'Must contain at least one lowercase letter', pass: /[a-z]/.test(password) },
    { label: 'Must contain at least one uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Must contain at least one special character', pass: /[^A-Za-z0-9]/.test(password) },
    { label: 'Length must be at least 8 characters', pass: password.length >= 8 },
  ];

  const allPassed = checks.every(c => c.pass);

  if (allPassed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute bottom-full left-0 right-0 mb-4 z-50 pointer-events-none"
    >
      <div className="bg-background/95 backdrop-blur-md border shadow-2xl rounded-2xl p-5 shadow-primary/10 select-none pointer-events-auto">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold tracking-tight">Password Validation</h3>
        </div>
        
        <ul className="space-y-2.5">
          {checks.map((c, i) => (
            <motion.li 
              key={i} 
              initial={false}
              animate={{ opacity: c.pass ? 1 : 0.6 }}
              className={`flex items-center gap-3 text-xs font-medium transition-colors ${c.pass ? 'text-green-600' : 'text-muted-foreground'}`}
            >
              {c.pass ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive shrink-0" />
              )}
              {c.label}
            </motion.li>
          ))}
        </ul>
      </div>
      
      {/* Tooltip Arrow */}
      <div className="w-3 h-3 bg-background border-r border-b rotate-45 mx-auto -mt-1.5" />
    </motion.div>
  );
};
