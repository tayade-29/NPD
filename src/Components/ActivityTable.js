import React, { useState } from "react";
import { Plus, Trash2, Edit, X } from "lucide-react";

const ActivityTable = ({
    title = "Default Title",
    phases = [],
    isCheckpoints = false,
    buttonLabels = {
        addActivity: { title: "Add Activity", label: "Add" },
        editActivity: { title: "Edit Activity" },
        deleteActivity: { title: "Delete Activity" },
        addSubActivity: { title: "Add Sub-activity" },
        deleteSubActivity: { title: "Delete Sub-activity" },
        addDescription: { title: "Add Description" },
    },
    activityHeading = "Activity",
    subActivityHeading = "Sub-activities",
    descriptionHeading = "Description",
}) => {
    const [activities, setActivities] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newActivity, setNewActivity] = useState({ phase: "", subActivities: [""] });

    const addSubActivityField = () => {
        setNewActivity((prev) => ({
            ...prev,
            subActivities: [...prev.subActivities, ""],
        }));
    };

    const handleSubActivityChange = (index, value) => {
        setNewActivity((prev) => {
            const updatedSubActivities = [...prev.subActivities];
            updatedSubActivities[index] = value;
            return { ...prev, subActivities: updatedSubActivities };
        });
    };

    const removeSubActivityField = (index) => {
        setNewActivity((prev) => ({
            ...prev,
            subActivities: prev.subActivities.filter((_, i) => i !== index),
        }));
    };

    const saveActivity = () => {
        if (newActivity.phase && newActivity.subActivities.some((sa) => sa.trim() !== "")) {
            const updatedActivity = {
                phase: newActivity.phase,
                subActivities: newActivity.subActivities.filter((sa) => sa.trim() !== ""),
            };

            if (isEditing && editingIndex !== null) {
                const updatedActivities = [...activities];
                updatedActivities[editingIndex] = updatedActivity;
                setActivities(updatedActivities);
                setIsEditing(false);
                setEditingIndex(null);
            } else {
                setActivities([...activities, updatedActivity]);
            }

            setNewActivity({ phase: "", subActivities: [""] });
            setIsAdding(false);
        }
    };

    const deleteActivity = (activityIndex) => {
        const updatedActivities = activities.filter((_, index) => index !== activityIndex);
        setActivities(updatedActivities);
    };

    const editActivity = (activityIndex) => {
        const activityToEdit = activities[activityIndex];
        setNewActivity({
            phase: activityToEdit.phase,
            subActivities: [...activityToEdit.subActivities],
        });
        setEditingIndex(activityIndex);
        setIsEditing(true);
        setIsAdding(true);
    };

    const handleSubActivityEdit = (activityIndex, subActivityIndex, value) => {
        setActivities((prev) => {
            const updatedActivities = [...prev];
            updatedActivities[activityIndex].subActivities[subActivityIndex] = value;
            return updatedActivities;
        });
    };

    const deleteSubActivity = (activityIndex, subActivityIndex) => {
        setActivities((prev) => {
            const updatedActivities = [...prev];
            updatedActivities[activityIndex].subActivities = updatedActivities[activityIndex].subActivities.filter((_, index) => index !== subActivityIndex);
            return updatedActivities;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={() => {
                            setIsAdding(true);
                            setIsEditing(false);
                            setEditingIndex(null);
                            setNewActivity({ phase: "", subActivities: [""] });
                        }}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                        title={buttonLabels.addActivity.title}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {buttonLabels.addActivity.label}
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{activityHeading}</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {activities.map((activity, activityIndex) => (
                                    <React.Fragment key={activityIndex}>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activityIndex + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{activity.phase}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => editActivity(activityIndex)}
                                                        className="flex items-center text-gray-600 hover:text-blue-600"
                                                        title={buttonLabels.editActivity.title}
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteActivity(activityIndex)}
                                                        className="flex items-center text-red-600 hover:text-red-700"
                                                        title={buttonLabels.deleteActivity.title}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {activity.subActivities.map((subActivity, subIndex) => (
                                            <tr key={`${activityIndex}-${subIndex}`} className="bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {activityIndex + 1}.{subIndex + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <textarea
                                                        value={subActivity}
                                                        onChange={(e) => handleSubActivityEdit(activityIndex, subIndex, e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                                                        placeholder="Enter details..."
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => deleteSubActivity(activityIndex, subIndex)}
                                                        className="flex items-center text-red-600 hover:text-red-700"
                                                        title={buttonLabels.deleteSubActivity.title}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {isEditing ? "Edit" : "Add New"} {isCheckpoints ? "Checkpoint" : "Activity"}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setIsEditing(false);
                                    setEditingIndex(null);
                                    setNewActivity({ phase: "", subActivities: [""] });
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select {isCheckpoints ? "Checkpoint" : "Activity Phase"}
                                </label>
                                <select
                                    value={newActivity.phase}
                                    onChange={(e) => setNewActivity({ ...newActivity, phase: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Select...</option>
                                    {phases.map((phase, index) => (
                                        <option key={index} value={phase}>
                                            {phase}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {isCheckpoints ? descriptionHeading : subActivityHeading}
                                    </label>
                                    <button
                                        onClick={addSubActivityField}
                                        className="flex items-center text-blue-600 hover:text-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add {isCheckpoints ? "Description" : "Sub-activity"}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {newActivity.subActivities.map((subActivity, index) => (
                                        <div key={index} className="flex gap-2">
                                            <textarea
                                                placeholder={`Enter details for ${index + 1}`}
                                                value={subActivity}
                                                onChange={(e) => handleSubActivityChange(index, e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                                            />
                                            {newActivity.subActivities.length > 1 && (
                                                <button
                                                    onClick={() => removeSubActivityField(index)}
                                                    className="flex items-center text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setIsEditing(false);
                                    setEditingIndex(null);
                                    setNewActivity({ phase: "", subActivities: [""] });
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveActivity}
                                disabled={!newActivity.phase || !newActivity.subActivities.some((sa) => sa.trim() !== "")}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isEditing ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityTable;