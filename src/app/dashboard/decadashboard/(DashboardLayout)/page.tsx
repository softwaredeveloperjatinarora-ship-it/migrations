'use server'

import PageContainer from "@/app/components/container/PageContainer";
import ExaminationDashboard from "@/app/components/DECAViews/Dashboard/dashboard";
// import MainHomepage from "@/app/components/views/HomePageViews/MainHomepage";

const SamplePage = () => {
    
  return (
     <PageContainer title="Home Page" description="Student Dashboard">
      {/* <DashboardCard title="Sample Page"> */}
        {/* <Typography>This is a sample2222 page</Typography> */}
        <ExaminationDashboard/>
        {/* <h1>test</h1> */}
        {/* <PacketConsuming/> */}
        {/* <ProductCheckout/> */}
      {/* </DashboardCard> */}
    </PageContainer>
  );
};

export default SamplePage;
