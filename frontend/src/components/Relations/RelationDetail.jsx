import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRelationById } from '../../services/api';
import Navbar from '../Layout/Navbar';
import InteractionList from '../Interactions/InteractionList';
import Loader from '../Common/Loader';
import ErrorAlert from '../Common/ErrorAlert';
// import NoteSummarizer from '../Notes/NoteSummarizer';

const RelationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [relation, setRelation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('interactions'); // 'interactions' or 'notes'

  useEffect(() => {
    const loadRelation = async () => {
      setLoading(true);
      try {
        const data = await fetchRelationById(id);
        setRelation(data);
      } catch (err) {
        setError(err.message || 'Failed to load contact details');
      }
      setLoading(false);
    };

    loadRelation();
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="h-screen bg-gray-900 p-6">
      <ErrorAlert message={error} />
      <button 
        onClick={() => navigate('/dashboard')}
        className="mt-4 px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
      >
        Back to Dashboard
      </button>
    </div>
  );

  if (!relation) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-blue-400 hover:text-blue-300 flex items-center"
          >
            ← Back to Dashboard
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">{relation.name}</h1>
              <p className="text-blue-400 mt-1">{relation.category_type}</p>
            </div>
            
            <button 
              onClick={() => navigate(`/relations/${id}/edit`)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors"
            >
              Edit Contact
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Contact Information</h3>
              <div className="bg-gray-700 rounded-md p-4 space-y-2">
                {relation.email_address && (
                  <p className="text-gray-300">
                    <span className="font-medium">Email:</span>{' '}
                    <a href={`mailto:${relation.email_address}`} className="text-blue-400 hover:underline">
                      {relation.email_address}
                    </a>
                  </p>
                )}
                
                {relation.phone_number && (
                  <p className="text-gray-300">
                    <span className="font-medium">Phone:</span>{' '}
                    <a href={`tel:${relation.phone_number}`} className="text-blue-400 hover:underline">
                      {relation.phone_number}
                    </a>
                  </p>
                )}
                
                {relation.location && (
                  <p className="text-gray-300">
                    <span className="font-medium">Location:</span> {relation.location}
                  </p>
                )}
              </div>
            </div>
            
            
          </div>
        </div>
        
        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('interactions')}
                className={`py-4 px-1 ${
                  activeTab === 'interactions'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Interactions
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-4 px-1 ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Notes & Summaries
              </button>
            </nav>
          </div>
          
          {/* <div className="mt-6">
            {activeTab === 'interactions' ? (
              <InteractionList relationId={id} />
            ) : (
              <NoteSummarizer relationId={id} />
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default RelationDetail;