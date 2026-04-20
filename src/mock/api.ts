
import { MOCK_PINS, MOCK_USERS, Pin, User } from './data';

const DELAY = 800;

export const mockFetchPins = async (): Promise<Pin[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_PINS]), DELAY);
  });
};

export const mockLogin = async (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email);
      if (user && password === 'password') { // simple password check
        resolve(user);
      } else {
        resolve(null);
      }
    }, DELAY);
  });
};

export const mockUploadPin = async (pin: Omit<Pin, 'id' | 'createdAt'>): Promise<Pin> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPin: Pin = {
        ...pin,
        id: `p${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      MOCK_PINS.unshift(newPin); // Add to local mock array
      resolve(newPin);
    }, 1500); // Slower for upload simulation
  });
};

export const mockDeletePin = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_PINS.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PINS.splice(index, 1);
        resolve(true);
      }
      resolve(false);
    }, DELAY);
  });
};
