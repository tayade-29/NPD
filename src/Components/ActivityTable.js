import React, { useState } from "react";
import { Plus, Trash2, Edit, X } from "lucide-react";

const ActivityTable = ({
  title,
  phases,
  isCheckpoints,
  buttonLabels,
  activityHeading,
  subActivityHeading,
  descriptionHeading,
}) => {
  const [activities, setActivities] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newActivity, setNewActivity] = useState({
    phase: "",
    subActivities: [""]
  });

  const addSubActivityField = () => {
    setNewActivity({
      ...newActivity,
      subActivities: [...newActivity.subActivities, ""]
    });
  };

  const handleSubActivityChange = (index, value) => {
    const updatedSubActivities = [...newActivity.subActivities];
    updatedSubActivities[index] = value;
    setNewActivity({
      ...newActivity,
      subActivities: updatedSubActivities
    });
  };

  const removeSubActivityField = (index) => {
    const updatedSubActivities = newActivity.subActivities.filter((_, i) => i !== index);
    setNewActivity({
      ...newActivity,
      subActivities: updatedSubActivities
    });
  };

  const saveActivity = () => {
    if (newActivity.phase && newActivity.subActivities.some(sa => sa.trim() !== "")) {
      if (isEditing && editingIndex !== null) {
        const updatedActivities = [...activities];
        updatedActivities[editingIndex] = {
          ...newActivity,
          subActivities: newActivity.subActivities.filter(sa => sa.trim() !== "")
        };
        setActivities(updatedActivities);
        setIsEditing(false);
        setEditingIndex(null);
      } else {
        setActivities([...activities, {
          ...newActivity,
          subActivities: newActivity.subActivities.filter(sa => sa.trim() !== "")
        }]);
      }
      setNewActivity({ phase: "", subActivities: [""] });
      setIsAdding(false);
    }
  };

  const deleteActivity = (activityIndex) => {
    setActivities(activities.filter((_, index) => index !== activityIndex));
  };

  const editActivity = (activityIndex) => {
    setNewActivity({
      phase: activities[activityIndex].phase,
      subActivities: [...activities[activityIndex].subActivities]
    });
    setEditingIndex(activityIndex);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleSubActivityEdit = (activityIndex, subActivityIndex, value) => {
    const updatedActivities = [...activities];
    updatedActivities[activityIndex].subActivities[subActivityIndex] = value;
    setActivities(updatedActivities);
  };

  const deleteSubActivity = (activityIndex, subActivityIndex) => {
    const updatedActivities = [...activities];
    updatedActivities[activityIndex].subActivities = updatedActivities[activityIndex].subActivities.filter((_, index) => index !== subActivityIndex);
    setActivities(updatedActivities);
  };

  const addSubActivityToExisting = (activityIndex) => {
    const updatedActivities = [...activities];
    updatedActivities[activityIndex].subActivities.push("");
    setActivities(updatedActivities);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <button
            onClick={() => {
              setIsAdding(true);
              setIsEditing(false);
              setEditingIndex(null);
              setNewActivity({ phase: "", subActivities: [""] });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-md"
            title={buttonLabels.addActivity.title}
          >
            <Plus size={20} />
            {buttonLabels.addActivity.label}
          </button>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 text-gray-700 font-semibold w-24">Sr No.</th>
                <th className="px-6 py-3 text-gray-700 font-semibold">{activityHeading}</th>
                <th className="px-6 py-3 text-gray-700 font-semibold w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, activityIndex) => (
                <React.Fragment key={activityIndex}>
                  {/* Main Activity Row */}
                  <tr className="border-t">
                    <td className="px-6 py-4 font-medium">{activityIndex + 1}</td>
                    <td className="px-6 py-4 font-medium">{activity.phase}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editActivity(activityIndex)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title={buttonLabels.editActivity.title}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => isCheckpoints ? addSubActivityToExisting(activityIndex) : addSubActivityField()}
                          className="p-1.5 text-green-600 hover:bg-blue-50 rounded-full transition-colors"
                          title={isCheckpoints ? buttonLabels.addDescription.title : buttonLabels.addSubActivity.title}
                        >
                          <Plus size={18} />
                        </button>
                        <button
                          onClick={() => deleteActivity(activityIndex)}
                          className="p-1.5 text-red-600 hover:bg-blue-50 rounded-full transition-colors"
                          title={buttonLabels.deleteActivity.title}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Sub-activities Rows */}
                  {activity.subActivities.map((subActivity, subIndex) => (
                    <tr key={`${activityIndex}-${subIndex}`} className="border-t bg-gray-50">
                      <td className="px-6 py-3 text-gray-500">
                        {activityIndex + 1}.{subIndex + 1}
                      </td>
                      <td className="px-6 py-3">
                        <textarea
                          value={subActivity}
                          onChange={(e) => handleSubActivityEdit(activityIndex, subIndex, e.target.value)}
                          className="w-full bg-transparent border rounded-lg p-2 min-h-[60px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors resize-y"
                          placeholder="Enter sub-activity details..."
                        />
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => deleteSubActivity(activityIndex, subIndex)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title={buttonLabels.deleteSubActivity.title}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Activity Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isEditing ? "Edit Activity" : "Add New Activity"}
                </h3>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                    setEditingIndex(null);
                    setNewActivity({ phase: "", subActivities: [""] });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Close dialog"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 space-y-4">
                {/* Activity Phase Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select {isCheckpoints ? "Checkpoint" : "Activity Phase"}
                  </label>
                  <select
                    value={newActivity.phase}
                    onChange={(e) => setNewActivity({ ...newActivity, phase: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a phase...</option>
                    {phases.map((phase, index) => (
                      <option key={index} value={phase}>
                        {phase}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-activities Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium text-gray-700">{isCheckpoints ? descriptionHeading : subActivityHeading}</h4>
                    <button
                      onClick={addSubActivityField}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1.5 transition-all duration-200"
                      title={isCheckpoints ? "Add Description" : "Add Sub-activity"}
                    >
                      <Plus size={16} /> {isCheckpoints ? "Add Description" : "Add Sub-activity"}
                    </button>
                  </div>

                  {newActivity.subActivities.map((subActivity, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <textarea
                        placeholder={`Sub-activity ${index + 1}`}
                        value={subActivity}
                        onChange={(e) => handleSubActivityChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] resize-y"
                      />
                      {newActivity.subActivities.length > 1 && (
                        <button
                          onClick={() => removeSubActivityField(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove this sub-activity"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                    setEditingIndex(null);
                    setNewActivity({ phase: "", subActivities: [""] });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveActivity}
                  disabled={!newActivity.phase || !newActivity.subActivities.some(sa => sa.trim() !== "")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditing ? "Update Activity" : "Save Activity"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTable;