import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';

export const useFirebaseData = (path) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, path);
    // onValue sets up a listener that triggers on every change to the data
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Convert object to array of objects if needed, assuming keys are IDs
        const dataList = Object.keys(val).map(key => ({
          ...val[key],
          id: key
        }));
        setData(dataList);
      } else {
        setData([]);
      }
    });

    return () => unsubscribe();
  }, [path]);

  return data;
};
