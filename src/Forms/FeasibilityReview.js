import React from "react";
import ActivityTable from "../Components/ActivityTable";

const FeasibilityReviewPage = () => {
    const CHECKPOINTS_FEASIBILITY = [
      "General ",
      "Engineering Drawings",
      "Material Specification ",
      "CAPACITY / INFRASTRUCTURE",
      "Risk Assessment"
    ];
  
    const buttonLabels = {
      addActivity: { label: "Add Checkpoint", title: "Add a new checkpoint" },
      editActivity: { label: "Edit", title: "Edit this checkpoint" },
      addSubActivity: { label: "Add Sub-Checkpoint", title: "Add a new sub-checkpoint" },
      deleteActivity: { label: "Delete", title: "Delete this checkpoint" },
      deleteSubActivity: { label: "Delete", title: "Delete this sub-checkpoint" }
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