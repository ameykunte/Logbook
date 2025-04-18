// import React, { useState, useEffect } from 'react';
// import { createInteraction, updateInteraction } from '../../services/api';

// const InteractionForm = ({ relationId, interaction, onSuccess, onCancel }) => {
//   const isEdit = Boolean(interaction);

//   // State for edit mode
//   const [editData, setEditData] = useState({
//     timestamp: new Date().toISOString().slice(0,16),
//     content: ''
//   });

//   // State for new/chat mode
//   const [chatText, setChatText] = useState('');
//   const [chatFiles, setChatFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isEdit) {
//       setEditData({
//         timestamp: interaction.date.slice(0,16),
//         content: interaction.content || ''
//       });
//     }
//   }, [interaction, isEdit]);

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleChatSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       console.log('Sending to LLM createInteraction:', { text: chatText, files: chatFiles });
//       const newLog = await createInteraction(relationId, { text: chatText, files: chatFiles });
//       console.log('createInteraction response:', newLog);
//       onSuccess(newLog);
//     } catch (error) {
//       console.error('Error creating interaction via LLM:', error);
//       alert('Failed to create interaction. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('Updating interaction:', interaction.log_id, editData.content);
//       const updated = await updateInteraction(interaction.log_id, { text: editData.content });
//       console.log('updateInteraction response:', updated);
//       onSuccess(updated);
//     } catch (error) {
//       console.error('Error updating interaction:', error);
//       alert('Failed to update interaction. Please try again.');
//     }
//   };

//   // Render edit form if editing
//   if (isEdit) {
//     return (
//       <form onSubmit={handleEditSubmit} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
//         <h4>Edit Interaction</h4>
//         <div style={{ marginBottom: '0.5rem' }}>
//           <label>Time</label>
//           <input
//             type="datetime-local"
//             name="timestamp"
//             value={editData.timestamp}
//             onChange={handleEditChange}
//             required
//             style={{ width: '100%' }}
//           />
//         </div>
//         <div style={{ marginBottom: '0.5rem' }}>
//           <label>Content</label>
//           <textarea
//             name="content"
//             value={editData.content}
//             onChange={handleEditChange}
//             required
//             rows={3}
//             style={{ width: '100%' }}
//           />
//         </div>
//         <button type="submit" style={{ marginRight: '0.5rem' }}>Update</button>
//         <button type="button" onClick={onCancel}>Cancel</button>
//       </form>
//     );
//   }

//   // Otherwise render chat-style form for new interaction
//   return (
//     <form onSubmit={handleChatSubmit} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
//       <h4>New Interaction</h4>
//       <textarea
//         value={chatText}
//         onChange={(e) => setChatText(e.target.value)}
//         placeholder="Type your note…"
//         required
//         rows={3}
//         style={{ width: '100%', marginBottom: '0.5rem' }}
//       />
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={(e) => setChatFiles(Array.from(e.target.files))}
//         style={{ marginBottom: '0.5rem' }}
//       />
//       <div>
//         <button type="submit" disabled={loading} style={{ marginRight: '0.5rem' }}>
//           {loading ? 'Saving…' : 'Send'}
//         </button>
//         <button type="button" onClick={onCancel}>Cancel</button>
//       </div>
//     </form>
//   );
// };

// export default InteractionForm;
