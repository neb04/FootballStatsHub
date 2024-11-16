import React, { useState, useEffect } from 'react';

export default function DisplayData(props) {
    const { data } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState(data ? { ...data.data } : {});
    const [displayData, setDisplayData] = useState(data ? { ...data.data } : {});

    useEffect(() => {
        if (data) {
            setEditableData({ ...data.data });
            setDisplayData({ ...data.data });
        }
    }, [data]);

    if (!data) return null;

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const handleSave = () => {
        console.log("Saving data:", editableData);
        setDisplayData(editableData);  // Update displayData to persist changes
        setIsEditing(false);
    };

    const handleDelete = () => {
        console.log("Deleting data:", data);
    };

    const handleChange = (key, value) => {
        setEditableData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const renderTable = () => {
        const tableData = displayData;  // Show updated displayData in table

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
                    style={{width: '170px'}}  // Set a fixed width or minimum width
                >
                    {isEditing ? "Disable Edit Mode" : "Enable Edit Mode"}
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md mr-auto" disabled={!isEditing}>
                    Save
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md">
                    Delete
                </button>
            </div>

            {renderTable()}
        </div>
    );
}
