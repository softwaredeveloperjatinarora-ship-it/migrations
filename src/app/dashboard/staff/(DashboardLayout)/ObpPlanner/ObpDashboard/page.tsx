"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import {
  Search,
  FilterList,
  School,
  Business,
  HealthAndSafety,
  Science,
  Public,
  Work,
  AccountBalance,
  LocalHospital,
  Computer,
  Book,
  Assessment,
  Build,
  ArrowBack,
} from "@mui/icons-material";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";

const wingsData = [
  {
    name: "Academic",
    division: "Academic",
    description: "Handles academic affairs and curriculum.",
    image: "academic.png",
    icon: School,
    subWings: [
      {
        name: "Curriculum Development",
        description: "Develops and updates academic curricula.",
        image: "academic.png",
      },
      {
        name: "Faculty Management",
        description: "Manages faculty appointments and development.",
        image: "academic.png",
      },
      {
        name: "Student Assessment",
        description: "Handles student evaluations and grading.",
        image: "academic.png",
      },
    ],
  },
  {
    name: "Accounts",
    division: "Administrative",
    description: "Manages financial operations.",
    image: "Accounts.png",
    icon: AccountBalance,
    subWings: [
      {
        name: "Budget Planning",
        description: "Plans and allocates departmental budgets.",
        image: "Accounts.png",
      },
      {
        name: "Financial Reporting",
        description: "Prepares financial statements and reports.",
        image: "Accounts.png",
      },
      {
        name: "Audit Compliance",
        description: "Ensures compliance with financial audits.",
        image: "Accounts.png",
      },
    ],
  },
  {
    name: "Administrative",
    division: "Administrative",
    description: "Oversees administrative functions.",
    image: "Administrative.png",
    icon: Work,
    subWings: [
      {
        name: "HR Management",
        description: "Manages human resources and staffing.",
        image: "Administrative.png",
      },
      {
        name: "Office Administration",
        description: "Handles day-to-day office operations.",
        image: "Administrative.png",
      },
      {
        name: "Policy Implementation",
        description: "Implements and enforces university policies.",
        image: "Administrative.png",
      },
    ],
  },
  {
    name: "Admissions",
    division: "Academic",
    description: "Manages student admissions.",
    image: "Admissions.png",
    icon: Book,
    subWings: [
      {
        name: "Application Processing",
        description: "Processes student applications.",
        image: "application.png",
      },
      {
        name: "Entrance Exams",
        description: "Organizes and conducts entrance examinations.",
        image: "exam.png",
      },
      {
        name: "Counseling Services",
        description: "Provides admission counseling to prospective students.",
        image: "counseling.png",
      },
    ],
  },
  {
    name: "Allied",
    division: "Academic",
    description: "Supports allied health programs.",
    image: "Allied.png",
    icon: HealthAndSafety,
    subWings: [
      {
        name: "Clinical Training",
        description: "Manages clinical training programs.",
        image: "clinical.png",
      },
      {
        name: "Health Education",
        description: "Develops health education curricula.",
        image: "health-edu.png",
      },
      {
        name: "Patient Care",
        description: "Oversees patient care services.",
        image: "patient-care.png",
      },
    ],
  },
  {
    name: "Dashboard Research",
    division: "Research",
    description: "Conducts research and analytics.",
    image: "DashboardResearch.png",
    icon: Science,
    subWings: [
      {
        name: "Data Analytics",
        description: "Analyzes data for insights and trends.",
        image: "analytics.png",
      },
      {
        name: "Research Grants",
        description: "Manages research funding and grants.",
        image: "grants.png",
      },
      {
        name: "Publication Support",
        description: "Assists with research publications.",
        image: "publication.png",
      },
    ],
  },
  {
    name: "Estate",
    division: "Administrative",
    description: "Manages university properties.",
    image: "Estate.png",
    icon: Public,
    subWings: [
      {
        name: "Property Maintenance",
        description: "Maintains university buildings and facilities.",
        image: "maintenance.png",
      },
      {
        name: "Land Development",
        description: "Handles land acquisition and development.",
        image: "land.png",
      },
      {
        name: "Security Services",
        description: "Provides campus security.",
        image: "security.png",
      },
    ],
  },
  {
    name: "Industry Career Relation",
    division: "Career Services",
    description: "Facilitates industry partnerships.",
    image: "IndustryCareerRelation.png",
    icon: Business,
    subWings: [
      {
        name: "Internship Programs",
        description: "Coordinates student internships.",
        image: "internship.png",
      },
      {
        name: "Corporate Partnerships",
        description: "Builds relationships with corporations.",
        image: "partnership.png",
      },
      {
        name: "Career Counseling",
        description: "Provides career guidance to students.",
        image: "career.png",
      },
    ],
  },
  {
    name: "International",
    division: "International",
    description: "Handles international affairs.",
    image: "International.png",
    icon: Public,
    subWings: [
      {
        name: "Exchange Programs",
        description: "Manages student and faculty exchange programs.",
        image: "exchange.png",
      },
      {
        name: "Visa Services",
        description: "Assists with visa and immigration processes.",
        image: "visa.png",
      },
      {
        name: "Global Outreach",
        description: "Promotes international collaborations.",
        image: "outreach.png",
      },
    ],
  },
  {
    name: "Legal",
    division: "Administrative",
    description: "Provides legal support.",
    image: "Legal.png",
    icon: Build,
    subWings: [
      {
        name: "Contract Management",
        description: "Handles legal contracts and agreements.",
        image: "contract.png",
      },
      {
        name: "Compliance",
        description: "Ensures legal compliance across departments.",
        image: "compliance.png",
      },
      {
        name: "Dispute Resolution",
        description: "Manages legal disputes and resolutions.",
        image: "dispute.png",
      },
    ],
  },
  {
    name: "LFB Abusiness",
    division: "Business",
    description: "Manages business operations.",
    image: "LFBAbusiness.png",
    icon: Business,
    subWings: [
      {
        name: "Business Development",
        description: "Drives business growth initiatives.",
        image: "business-dev.png",
      },
      {
        name: "Operations Management",
        description: "Oversees daily business operations.",
        image: "operations.png",
      },
      {
        name: "Strategic Planning",
        description: "Develops long-term business strategies.",
        image: "strategy.png",
      },
    ],
  },
  {
    name: "Medical",
    division: "Health",
    description: "Oversees medical services.",
    image: "medical.png",
    icon: LocalHospital,
    subWings: [
      {
        name: "Health Services",
        description: "Provides medical care to students and staff.",
        image: "health-services.png",
      },
      {
        name: "Emergency Response",
        description: "Manages medical emergencies on campus.",
        image: "emergency.png",
      },
      {
        name: "Mental Health",
        description: "Offers mental health support services.",
        image: "mental-health.png",
      },
    ],
  },
  {
    name: "Ninfotech",
    division: "Technology",
    description: "Manages IT infrastructure.",
    image: "Ninfotech.png",
    icon: Computer,
    subWings: [
      {
        name: "Network Management",
        description: "Maintains campus network infrastructure.",
        image: "network.png",
      },
      {
        name: "Software Development",
        description: "Develops custom software solutions.",
        image: "software.png",
      },
      {
        name: "IT Support",
        description: "Provides technical support to users.",
        image: "support.png",
      },
    ],
  },
  {
    name: "Online Education",
    division: "Academic",
    description: "Supports online learning.",
    image: "Online-Education.png",
    icon: Computer,
    subWings: [
      {
        name: "E-Learning Platforms",
        description: "Manages online learning platforms.",
        image: "elearning.png",
      },
      {
        name: "Virtual Classrooms",
        description: "Sets up and maintains virtual classrooms.",
        image: "virtual.png",
      },
      {
        name: "Digital Content",
        description: "Creates and distributes digital educational content.",
        image: "content.png",
      },
    ],
  },
  {
    name: "Overall (1)",
    division: "General",
    description: "General overview metrics.",
    image: "Overall (1).png",
    icon: Assessment,
    subWings: [
      {
        name: "Performance Metrics",
        description: "Tracks overall university performance.",
        image: "metrics.png",
      },
      {
        name: "Dashboard Analytics",
        description: "Provides analytical insights across departments.",
        image: "analytics-overall.png",
      },
      {
        name: "Summary Reports",
        description: "Generates comprehensive summary reports.",
        image: "summary.png",
      },
    ],
  },
  {
    name: "Overall",
    division: "General",
    description: "Comprehensive dashboard view.",
    image: "Overall.png",
    icon: Assessment,
    subWings: [
      {
        name: "Key Indicators",
        description: "Monitors key performance indicators.",
        image: "indicators.png",
      },
      {
        name: "Trend Analysis",
        description: "Analyzes trends across all divisions.",
        image: "trends.png",
      },
      {
        name: "Executive Summary",
        description: "Provides executive-level summaries.",
        image: "executive.png",
      },
    ],
  },
  {
    name: "Procurement",
    division: "Administrative",
    description: "Handles procurement processes.",
    image: "Procurement.png",
    icon: Build,
    subWings: [
      {
        name: "Vendor Management",
        description: "Manages relationships with vendors.",
        image: "vendor.png",
      },
      {
        name: "Purchase Orders",
        description: "Processes and tracks purchase orders.",
        image: "orders.png",
      },
      {
        name: "Inventory Control",
        description: "Manages inventory and supplies.",
        image: "inventory.png",
      },
    ],
  },
  {
    name: "Student Relationship",
    division: "Student Services",
    description: "Manages student relations.",
    image: "student-relationship.png",
    icon: School,
    subWings: [
      {
        name: "Student Support",
        description: "Provides support services to students.",
        image: "support-student.png",
      },
      {
        name: "Alumni Relations",
        description: "Maintains connections with alumni.",
        image: "alumni.png",
      },
      {
        name: "Feedback Systems",
        description: "Collects and analyzes student feedback.",
        image: "feedback.png",
      },
    ],
  },
  {
    name: "Technology",
    division: "Technology",
    description: "Advances technological initiatives.",
    image: "technology.png",
    icon: Computer,
    subWings: [
      {
        name: "Innovation Labs",
        description: "Supports technological innovation.",
        image: "innovation.png",
      },
      {
        name: "Digital Transformation",
        description: "Drives digital transformation initiatives.",
        image: "digital.png",
      },
      {
        name: "Tech Partnerships",
        description: "Builds partnerships with tech companies.",
        image: "tech-partners.png",
      },
    ],
  },
  {
    name: "Welfare",
    division: "Student Services",
    description: "Supports student welfare.",
    image: "Welfare.png",
    icon: HealthAndSafety,
    subWings: [
      {
        name: "Counseling Services",
        description: "Offers counseling to students.",
        image: "counseling-welfare.png",
      },
      {
        name: "Financial Aid",
        description: "Manages student financial assistance.",
        image: "aid.png",
      },
      {
        name: "Wellness Programs",
        description: "Promotes student health and wellness.",
        image: "wellness.png",
      },
    ],
  },
];

const divisions = [...new Set(wingsData.map((w) => w.division))];

export default function Page() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWing, setSelectedWing] = useState<string | null>(null);

  const BCrumb = [
    {
      to: "/dashboard/staff",
      title: "Dashboard",
    },
    {
      to: "/dashboard/staff/ObpPlanner/ObpDashboard",
      title: "OBP Dashboard",
    },
    ...(selectedWing ? [{
      to: "/dashboard/staff/ObpPlanner/ObpDashboard",
      title: wingsData.find(w => w.name === selectedWing)?.division || "Division",
    }] : []),
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number | string) => {
    setTabValue(typeof newValue === 'string' ? parseInt(newValue, 10) : newValue);
  };

  const filteredWings = wingsData.filter(
    (wing) =>
      wing.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (tabValue === 0 || wing.division === divisions[tabValue - 1]),
  );

  return (
    <Box
      sx={{ flexGrow: 1, p: 4, backgroundColor: "#f0f4f8", minHeight: "100vh" }}
    >
      <Breadcrumb title="OBP Dashboard" items={BCrumb} />
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src="/images/logos/lpu_logo.png"
            sx={{ width: 70, height: 70, mr: 3, border: "3px solid #1976d2" }}
          />
          <Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "#1976d2",
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {selectedWing ? `${selectedWing} Sub-Wings (${wingsData.find(w => w.name === selectedWing)?.division})` : "OBP Dashboard"}
            </Typography>
            

          </Box>
        </Box>
        {!selectedWing && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search wings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                outline: "none",
                width: "200px",
                marginRight: "10px",
              }}
            />
            <IconButton sx={{ color: "#1976d2" }}>
              <FilterList />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Tabs for Divisions */}
      {!selectedWing && (
        <Box
          sx={{
            mb: 4,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 3,
            p: 1,
            boxShadow: 2,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                color: "#555",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                minHeight: 48,
                borderRadius: 2,
                margin: "0 4px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  color: "#1976d2",
                },
                "&.Mui-selected": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  boxShadow: 2,
                },
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            <Tab label="All" />
            {divisions.map((division, index) => (
              <Tab key={index} label={division} />
            ))}
          </Tabs>
        </Box>
      )}

      {/* Wings Grid */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {(selectedWing
          ? (() => {
              const subWings = wingsData.find((w) => w.name === selectedWing)?.subWings || [];
              console.log('selectedWing:', selectedWing, 'subWings:', subWings);
              return subWings;
            })()
          : filteredWings
        ).map((item, index) => (
          <Card
            key={index}
            onClick={() => {
              if (!selectedWing) {
                setSelectedWing(item.name);
              } else {
                const division = wingsData.find(w => w.name === selectedWing)?.division;
                router.push(`/dashboard/staff/ObpPlanner/ObpHeads?division=${encodeURIComponent(division || '')}`);
              }
            }}
            sx={{
              width: "calc(16.666% - 16px)",
              minWidth: 180,
              height: 200,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderColor: "#1976d2",
              },
              backgroundColor: "#ffffff",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
              <Box
                sx={{
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  // backgroundColor: "#f5f5f5",
                }}
              >
                {/* <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#f5f5f5' }}> */}

                <img
                  src={`/images/ObpWingsImage/Wings/${item.image}`}
                  alt={item.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    pointerEvents: "none",
                  }}
                />
              </Box>
              <Box
                sx={{
                  p: 2,
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{
                    fontWeight: "600",
                    color: "#333",
                    textAlign: "center",
                    fontSize: "0.9rem",
                    lineHeight: 1.2,
                    width: "100%",
                  }}
                >
                  {item.name.replace(/([A-Z])/g, " $1").trim()}
                </Typography>
              </Box>
            </Card>
        ))}
      </Box>
    </Box>
  );
}
