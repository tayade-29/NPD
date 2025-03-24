import React from "react";
import ActivityTable from "../Components/ActivityTable";

const FeasibilityReviewPage = () => {
    const CHECKPOINTS_FEASIBILITY = [
        "General",
        "Engineering Drawings",
        "Material Specification",
        "CAPACITY / INFRASTRUCTURE",
        "Risk Assessment"
    ];

    const buttonLabels = {
        addActivity: { title: "Add a new checkpoint", label: "Add Checkpoint" },
        editActivity: { title: "Edit this checkpoint", label: "Edit" },
        deleteActivity: { title: "Delete this checkpoint", label: "Delete" },
        addSubActivity: { title: "Add a new sub-checkpoint", label: "Add Sub-Checkpoint" },
        deleteSubActivity: { title: "Delete this sub-checkpoint", label: "Delete" },
        addDescription: { title: "Add Description", label: "Add Description" }
    };

    return (
        <ActivityTable
            title="Feasibility Review"
            phases={CHECKPOINTS_FEASIBILITY}
            isCheckpoints={true}
            buttonLabels={buttonLabels}
            activityHeading="Checkpoint"
            subActivityHeading="Sub-Checkpoints"
            descriptionHeading="Descriptions"
        />
    );
};

export default FeasibilityReviewPage;