// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   fetchInteractions,
//   createInteraction,
//   updateInteraction,
//   deleteInteraction
// } from '../../services/api';
// import Loader from '../Common/Loader';
// import ErrorAlert from '../Common/ErrorAlert';
// import InteractionItem from './InteractionItem';
// import InteractionForm from './InteractionForm';

// const InteractionList = () => {
//   const { id: relationId } = useParams();
//   const [interactions, setInteractions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [currentInteraction, setCurrentInteraction] = useState(null);

//   const loadInteractions = async () => {
//     setLoading(true);
//     try {
//       console.log('Loading interactions for relation:', relationId);
//       const data = await fetchInteractions(relationId);
//       console.log('Loaded interactions:', data);
//       setInteractions(data);
//     } catch (err) {
//       console.error('Error loading interactions:', err);
//       setError(err.message || 'Failed to load interactions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadInteractions();
//   }, [relationId]);

//   const handleDelete = async (log_id) => {
//     try {
//       console.log('Deleting interaction:', log_id);
//       await deleteInteraction(log_id);
//       loadInteractions();
//     } catch (err) {
//       console.error('Error deleting interaction:', err);
//       alert('Failed to delete interaction.');
//     }
//   };

//   const handleEdit = (interaction) => {
//     console.log('Editing interaction:', interaction.log_id);
//     setCurrentInteraction(interaction);
//     setShowForm(true);
//   };

//   const handleCreate = () => {
//     setCurrentInteraction(null);
//     setShowForm(true);
//   };

//   const handleFormSuccess = (result) => {
//     console.log('Form submitted:', result);
//     setShowForm(false);
//     setCurrentInteraction(null);
//     loadInteractions();
//   };

//   return (
//     <div>
//       {loading ? (
//         <Loader />
//       ) : error ? (
//         <ErrorAlert message={error} />
//       ) : (
//         <>
//           <button onClick={handleCreate} style={{ marginBottom: '1rem' }}>
//             Add Interaction
//           </button>

//           {showForm && (
//             <InteractionForm
//               relationId={relationId}
//               interaction={currentInteraction}
//               onSuccess={handleFormSuccess}
//               onCancel={() => {
//                 setShowForm(false);
//                 setCurrentInteraction(null);
//               }}
//             />
//           )}

//           {interactions.length === 0 ? (
//             <p>No interactions yet.</p>
//           ) : (
//             interactions.map((interaction) => (
//               <InteractionItem
//                 key={interaction.log_id}
//                 interaction={interaction}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default InteractionList;
