import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePinStore } from '../store/usePinStore';
import { Loader } from '../components/ui/Loader';
import { motion } from 'framer-motion';

export const PinDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchPinById, selectedPin, isLoading, setSelectedPin } = usePinStore();

  useEffect(() => {
    if (id) {
      fetchPinById(id);
    }
    
    // Cleanup on unmount if we leave the page
    return () => {
      if (selectedPin && selectedPin.id === id) {
        setSelectedPin(null);
      }
    };
  }, [id]); // Only depend on ID

  // If the user closes the modal (which sets selectedPin to null), go home
  useEffect(() => {
    if (!isLoading && !selectedPin) {
      navigate('/');
    }
  }, [selectedPin, isLoading, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen flex items-center justify-center pt-24"
    >
      {isLoading ? (
        <Loader text="Loading pin..." size="lg" />
      ) : (
        <div className="text-center text-muted-foreground">
          {/* The PinModal is globally rendered in App.tsx and will show up automatically when selectedPin is set */}
          <p>Opening pin...</p>
        </div>
      )}
    </motion.div>
  );
};
