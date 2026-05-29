import PageContainer from "@/app/components/container/PageContainer";
import FirstPageView from "@/app/components/views/FirstPageView/firstpage";

 
  export default async function FirstPage() {
  return (
    <PageContainer  title="First Page"   description="First Page" >      
        
       <FirstPageView/>
     </PageContainer>
  );
};