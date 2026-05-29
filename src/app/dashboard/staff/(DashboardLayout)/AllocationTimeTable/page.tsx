'use server'

import PageContainer from "@/app/components/container/PageContainer";
import TimeTableAllocation from "@/app/components/StaffViews/TimeTableAllocation/TimeTableAllocation";


const AllocationTimeTable = () => {
    return (
        <PageContainer title="Profile" description="this is Profile">

            <TimeTableAllocation />

        </PageContainer>
    );
};

export default AllocationTimeTable;
