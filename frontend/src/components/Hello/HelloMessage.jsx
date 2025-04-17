import React, { useEffect, useState } from 'react';
import { fetchHelloMessage } from '../../services/api';
import Loader from '../Common/Loader';
import ErrorAlert from '../Common/ErrorAlert';

const HelloMessage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetchHelloMessage();
        console.log(response.message);
        setMessage(response.message);
      } catch (err) {
        setError(err.message || 'Failed to fetch message');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default HelloMessage;