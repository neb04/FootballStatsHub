import React, { useState, useEffect } from 'react';

export default function DisplayData(props) {
    const { data } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState(data ? { ...data } : {});
    const [displayData, setDisplayData] = useState(data ? { ...data } : {});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (data) {
            setEditableData({ ...data });
            setDisplayData({ ...data });
        }
    }, [data]);

    if (!data) return null;

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
    
            // Calculate the changes by comparing editableData and displayData
            const changes = Object.entries(editableData).reduce((diff, [key, value]) => {
                if (displayData[key] !== value) {
                    diff[key] = value;
                }
                return diff;
            }, {});
    
            // If no changes are detected (other than IDs), inform the user and return
            if (Object.keys(changes).length === 0) {
                alert("No changes to save.");
                setIsEditing(false);
                setIsSaving(false);
                return;
            }
    
            // Include the original ID key
            if (editableData.playerID) {
                changes.originalPlayerID = displayData.playerID; // Use original ID from displayData
            } else if (editableData.teamID) {
                changes.originalTeamID = displayData.teamID; // Use original ID from displayData
            }
    
            console.log("Data to be saved:", changes);
    
            const response = await fetch('http://localhost:5000/api/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(changes),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log("Save successful:", result);
    
            // Filter out originalPlayerID and originalTeamID from changes before updating displayData
            const changesToApply = { ...changes };
            delete changesToApply.originalPlayerID;
            delete changesToApply.originalTeamID;
    
            // Update displayData with the filtered changes
            setDisplayData((prevData) => ({ ...prevData, ...changesToApply }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };
    
    
    

    const handleDelete = async () => {
        try {
            // Determine if we're deleting a player or a team
            const deleteData = {};
            if (data.playerID) {
                deleteData.playerID = data.playerID;
            } else if (data.teamID) {
                deleteData.teamID = data.teamID;
            }
    
            // Log the data being deleted
            console.log("Deleting data:", deleteData);
    
            // Make the POST request to the delete endpoint
            const response = await fetch('http://localhost:5000/api/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deleteData),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setEditableData({});
            setDisplayData({});
            const result = await response.json();
            console.log("Delete successful:", result);
    
            // Optionally, handle UI updates or notifications here
            alert("Deletion successful!");
            
        } catch (error) {
            console.error("Error deleting data:", error);
            alert("Failed to delete. Please try again.");
        }
    };
    

    const handleChange = (key, value) => {
        setEditableData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const renderTable = () => {
        const tableData = displayData;

        return (
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="w-1/2 border px-4 py-2">Attribute</th>
                        <th className="w-1/2 border px-4 py-2">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(tableData).map(([key, value]) => (
                        <tr key={key}>
                            <td className="border px-4 py-2 w-1/2">{key}</td>
                            <td className="border px-4 py-2 w-1/2">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editableData[key] || ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="w-full p-2 border rounded"
                                        style={{ boxSizing: 'border-box' }}
                                    />
                                ) : (
                                    <span className="block w-full">{value}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="p-4 my-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Details</h2>

            <div className="flex items-center mb-4">
                <button
                    onClick={handleEditToggle}
                    className={`px-4 py-2 rounded-md mr-4 ${
                        isEditing ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                    }`}
                    style={{width: '170px'}}
                >
                    {isEditing ? "Disable Edit Mode" : "Enable Edit Mode"}
                </button>
                <button 
                    onClick={handleSave} 
                    className={`px-4 py-2 bg-green-500 text-white rounded-md mr-auto ${
                        isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`} 
                    disabled={!isEditing || isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md">
                    Delete
                </button>
            </div>

            {renderTable()}
        </div>
    );
}