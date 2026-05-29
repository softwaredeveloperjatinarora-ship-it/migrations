'use server'

import PageContainer from "@/app/components/container/PageContainer";
import MainHomepage from "@/app/components/views/HomePageViews/MainHomepage";


const SamplePage = () => {
  return (
    <PageContainer title="Home Page" description="Student Dashboard">
      {/* <MainHomepage/> */}
      <h1>Header Part</h1>
    </PageContainer>
  );
};

export default SamplePage;
