import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

interface BirthdayWish {
  id: string;
  recipientName: string;
  message: string;
  senderName: string;
  createdAt: string;
  isPublic: boolean;
}

interface BirthdayContextType {
  birthdayWishes: BirthdayWish[];
  loading: boolean;
  error: string | null;
  createBirthdayWish: (wish: Omit<BirthdayWish, 'id' | 'createdAt'>) => Promise<void>;
  fetchBirthdayWishes: () => Promise<void>;
  updateBirthdayWish: (id: string, updates: Partial<BirthdayWish>) => Promise<void>;
  deleteBirthdayWish: (id: string) => Promise<void>;
}

const BirthdayContext = createContext<BirthdayContextType | undefined>(undefined);

export const useBirthday = () => {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error('useBirthday must be used within a BirthdayProvider');
  }
  return context;
};

interface BirthdayProviderProps {
  children: ReactNode;
}

export const BirthdayProvider: React.FC<BirthdayProviderProps> = ({ children }) => {
  const [birthdayWishes, setBirthdayWishes] = useState<BirthdayWish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBirthdayWishes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const wishesQuery = query(
        collection(db, 'birthdayWishes'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(wishesQuery);
      const wishes: BirthdayWish[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        wishes.push({
          id: doc.id,
          recipientName: data.recipientName,
          message: data.message,
          senderName: data.senderName,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          isPublic: data.isPublic !== false // 默认为公开
        });
      });
      
      setBirthdayWishes(wishes);
    } catch (err) {
      console.error('获取生日祝福失败:', err);
      setError('获取生日祝福失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const createBirthdayWish = async (wish: Omit<BirthdayWish, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'birthdayWishes'), {
        ...wish,
        createdAt: Timestamp.now()
      });
      
      // 添加到本地状态
      const newWish: BirthdayWish = {
        id: docRef.id,
        ...wish,
        createdAt: new Date().toISOString()
      };
      
      setBirthdayWishes(prev => [newWish, ...prev]);
    } catch (err) {
      console.error('创建生日祝福失败:', err);
      setError('创建生日祝福失败，请稍后再试');
      throw err;
    }
  };

  const updateBirthdayWish = async (id: string, updates: Partial<BirthdayWish>) => {
    try {
      const wishRef = doc(db, 'birthdayWishes', id);
      await updateDoc(wishRef, updates);
      
      // 更新本地状态
      setBirthdayWishes(prev => 
        prev.map(wish => 
          wish.id === id ? { ...wish, ...updates } : wish
        )
      );
    } catch (err) {
      console.error('更新生日祝福失败:', err);
      setError('更新生日祝福失败，请稍后再试');
      throw err;
    }
  };

  const deleteBirthdayWish = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'birthdayWishes', id));
      
      // 从本地状态中移除
      setBirthdayWishes(prev => prev.filter(wish => wish.id !== id));
    } catch (err) {
      console.error('删除生日祝福失败:', err);
      setError('删除生日祝福失败，请稍后再试');
      throw err;
    }
  };

  useEffect(() => {
    fetchBirthdayWishes();
  }, []);

  const value: BirthdayContextType = {
    birthdayWishes,
    loading,
    error,
    createBirthdayWish,
    fetchBirthdayWishes,
    updateBirthdayWish,
    deleteBirthdayWish
  };

  return (
    <BirthdayContext.Provider value={value}>
      {children}
    </BirthdayContext.Provider>
  );
};

export default BirthdayContext;