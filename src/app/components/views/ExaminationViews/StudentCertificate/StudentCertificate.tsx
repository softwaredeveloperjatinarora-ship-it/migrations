'use client'
 
import React from 'react'
import CertificateTabs from './CertificateTabs';
import Breadcrumb from '@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

const StudentCertificate = () => {


    const BCrumb = [
        {
          to: "/dashboard",
          title: "Home",
        },
        {
          title: "Certificate Request",
        },
      ];
  return (
    <>
    <Breadcrumb title="Certificate Request" items={BCrumb} />
     <CertificateTabs/>
    </>
  )
}

export default StudentCertificate
