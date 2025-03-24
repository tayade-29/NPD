import React from "react";
import ActivityTable from "../Components/ActivityTable";

const APQPPage = () => {
    const ACTIVITY_PHASES_APQP = [
        "Plan & define phase",
        "Product design & development",
        "Process design & development",
        "Product & process validation",
        "Feedback analysis & corrective action"
    ];

    const buttonLabels = {
        addActivity: { label: "Add Activity", title: "Add a new activity phase" },
        editActivity: { label: "Edit", title: "Edit this activity" },
        addSubActivity: { label: "Add Sub-Activity", title: "Add a new sub-activity" },
        deleteActivity: { label: "Delete", title: "Delete this activity" },
        deleteSubActivity: { label: "Delete", title: "Delete this sub-activity" }
    };

    return (
        <ActivityTable
            title="APQP Time Plan"
            phases={ACTIVITY_PHASES_APQP}
            isCheckpoints={false}
            buttonLabels={buttonLabels}
            activityHeading="Activity"
            subActivityHeading="Sub-activities"
            descriptionHeading="Descriptions"
        />
    );
};

export default APQPPage;