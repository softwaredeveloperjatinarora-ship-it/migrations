
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
  Chip,
  Button,
} from "@mui/material";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";

const headsData = [
  {
    name: "Pooja Verma (O-III)",
    role: "Head",
    school: "Department of Software Development-III",
    profileMatching: "Yes ()",
    obpScore: 3.71,
    obpGrade: "A++",
    obpRank: 1,
    progress: "92.71%",
    hodScore: 14,
    selfScore: 20,
    pmsScore: "",
    pmsGrade: "",
    image: "/images/profile/user-1.jpg",
    team: [
      {
        name: "Joohi Rani",
        role: "Software Developer (O-I)",
        school: "Department of Software Development-III",
        profileMatching: "Yes ()",
        obpScore: 4.00,
        obpGrade: "A++",
        obpRank: 1,
        progress: "100.00%",
        hodScore: 0,
        selfScore: 9,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user1.jpg",
        score: 85
      },
      {
        name: "Parminder Singh",
        role: "Assistant Software Developer (S-I)",
        school: "Department of Software Development-III",
        profileMatching: "Yes ()",
        obpScore: 3.99,
        obpGrade: "A++",
        obpRank: 2,
        progress: "99.69%",
        hodScore: 0,
        selfScore: 8,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user2.jpg",
        score: 90
      },
      {
        name: "Rakhi Sharma",
        role: "Assistant Software Developer (S-I)",
        school: "Department of Software Development-III",
        profileMatching: "Yes ()",
        obpScore: 3.98,
        obpGrade: "A++",
        obpRank: 3,
        progress: "99.62%",
        hodScore: 0,
        selfScore: 7,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user3.jpg",
        score: 85
      },
      {
        name: "Pooja Verma",
        role: "Team Lead (O-III)",
        school: "Department of Software Development-III",
        profileMatching: "Yes ()",
        obpScore: 3.83,
        obpGrade: "A++",
        obpRank: 4,
        progress: "95.78%",
        hodScore: 0,
        selfScore: 20,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user4.jpg",
        score: 90
      },
      {
        name: "Vishal Sharma",
        role: "Senior Software Developer (O-II)",
        school: "Department of Software Development-III",
        profileMatching: "Yes ()",
        obpScore: 3.67,
        obpGrade: "A++",
        obpRank: 5,
        progress: "91.66%",
        hodScore: 0,
        selfScore: 10,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user5.jpg",
        score: 85
      },
      {
        name: "Sandeep Panesar",
        role: "Deputy Software Developer (S-II)",
        school: "Department of Software Development-III",
        profileMatching: "Yes ()",
        obpScore: 3.66,
        obpGrade: "A++",
        obpRank: 6,
        progress: "91.49%",
        hodScore: 0,
        selfScore: 9,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user1.jpg",
        score: 90
      },
      {
        name: "Akhil Sharma",
        role: "Deputy Software Developer (S-II)",
        school: "Department of Software Development-III",
        profileMatching: "Yes ()",
        obpScore: 3.65,
        obpGrade: "A++",
        obpRank: 7,
        progress: "91.34%",
        hodScore: 0,
        selfScore: 11,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user2.jpg",
        score: 85
      },
      {
        name: "Raunak Singh",
        role: "Software Developer (O-I)",
        school: "Department of Software Development-III",
        profileMatching: "Yes ()",
        obpScore: 3.64,
        obpGrade: "A++",
        obpRank: 8,
        progress: "91.04%",
        hodScore: 0,
        selfScore: 11,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user3.jpg",
        score: 90
      },
      {
        name: "Gourav Dhankhar",
        role: "Assistant Software Developer (S-I)",
        school: "Department of Software Development-III",
        profileMatching: "Yes ()",
        obpScore: 3.52,
        obpGrade: "A++",
        obpRank: 9,
        progress: "87.91%",
        hodScore: 0,
        selfScore: 7,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user4.jpg",
        score: 85
      },
      {
        name: "Munish Kumar",
        role: "Deputy Software Developer (S-II)",
        school: "Department of Software Development-III",
        profileMatching: "Yes ()",
        obpScore: 3.30,
        obpGrade: "A+",
        obpRank: 10,
        progress: "82.44%",
        hodScore: 0,
        selfScore: 10,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user5.jpg",
        score: 90
      },
    ],
  },
  {
    name: "Umesh Chand (O-III)",
    role: "Head",
    school: "Department of Software Development-I",
    profileMatching: "Yes ()",
    obpScore: 3.45,
    obpGrade: "A+",
    obpRank: 2,
    progress: "86.36%",
    hodScore: 18,
    selfScore: 15,
    pmsScore: "",
    pmsGrade: "",
    image: "/images/profile/user-2.jpg",
    team: [
      {
        name: "Team Member 3",
        role: "Analyst",
        school: "Department of Software Development-I",
        profileMatching: "Yes ()",
        obpScore: 3.2,
        obpGrade: "A",
        obpRank: 3,
        progress: "80.0%",
        hodScore: 15,
        selfScore: 16,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user3.jpg",
        score: 78
      },
      {
        name: "Team Member 4",
        role: "Tester",
        school: "Department of Software Development-I",
        profileMatching: "Yes ()",
        obpScore: 3.1,
        obpGrade: "A",
        obpRank: 4,
        progress: "77.5%",
        hodScore: 14,
        selfScore: 15,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user4.jpg",
        score: 82
      },
    ],
  },
  {
    name: "Pritpal Singh Saini (D-I)",
    role: "Head",
    school: "Department of Software Development-IV",
    profileMatching: "Yes ()",
    obpScore: 3.42,
    obpGrade: "A+",
    obpRank: 3,
    progress: "85.52%",
    hodScore: 14,
    selfScore: 19,
    pmsScore: "",
    pmsGrade: "",
    image: "/images/profile/user-3.jpg",
    team: [
      {
        name: "Team Member 5",
        role: "Manager",
        school: "Department of Software Development-IV",
        profileMatching: "Yes ()",
        obpScore: 3.3,
        obpGrade: "A+",
        obpRank: 2,
        progress: "82.5%",
        hodScore: 16,
        selfScore: 17,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user5.jpg",
        score: 88
      },
    ],
  },
  {
    name: "Puneet Gupta (D-I)",
    role: "Head",
    school: "Department of Data Development(iv)   ",
    profileMatching: "Yes ()",
    obpScore: 3.40,
    obpGrade: "A+",
    obpRank: 4,
    progress: "84.92%",
    hodScore: 25,
    selfScore: 26,
    pmsScore: "",
    pmsGrade: "",
    image: "/images/profile/user-4.jpg",
    team: [
      {
        name: "Team Member 6",
        role: "Engineer",
        school: "Department of Data Centre",
        profileMatching: "Yes ()",
        obpScore: 2.8,
        obpGrade: "B+",
        obpRank: 5,
        progress: "70.0%",
        hodScore: 22,
        selfScore: 23,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user1.jpg",
        score: 75
      },
      {
        name: "Team Member 7",
        role: "Support",
        school: "Department of Data Centre",
        profileMatching: "Yes ()",
        obpScore: 3.0,
        obpGrade: "A",
        obpRank: 4,
        progress: "75.0%",
        hodScore: 24,
        selfScore: 25,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user2.jpg",
        score: 80
      },
    ],
  },
  {
    name: "Jatin Sarpal (O-III)",
    role: "Head",
    school: "Department of Software Development-V",
    profileMatching: "Yes ()",
    obpScore: 3.05,
    obpGrade: "A",
    obpRank: 5,
    progress: "76.34%",
    hodScore: 21,
    selfScore: 17,
    pmsScore: "",
    pmsGrade: "",
    image: "/images/profile/user-5.jpg",
    team: [
      {
        name: "Team Member 8",
        role: "Developer",
        school: "Department of Software Development-V",
        profileMatching: "Yes ()",
        obpScore: 2.6,
        obpGrade: "B",
        obpRank: 6,
        progress: "65.0%",
        hodScore: 19,
        selfScore: 20,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user3.jpg",
        score: 70
      },
    ],
  },
  {
    name: "Lakhwinder Singh (D-II)",
    role: "Head",
    school: "Department of Software Development-II",
    profileMatching: "Yes ()",
    obpScore: 3.02,
    obpGrade: "A",
    obpRank: 6,
    progress: "75.48%",
    hodScore: 13,
    selfScore: 21,
    pmsScore: "",
    pmsGrade: "",
    image: "/images/profile/user1.jpg",
    team: [
      {
        name: "Team Member 9",
        role: "Tester",
        school: "Department of Software Development-II",
        profileMatching: "Yes ()",
        obpScore: 3.4,
        obpGrade: "A+",
        obpRank: 3,
        progress: "85.0%",
        hodScore: 15,
        selfScore: 16,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user4.jpg",
        score: 85
      },
      {
        name: "Team Member 10",
        role: "Designer",
        school: "Department of Software Development-II",
        profileMatching: "Yes ()",
        obpScore: 3.5,
        obpGrade: "A+",
        obpRank: 2,
        progress: "87.5%",
        hodScore: 17,
        selfScore: 18,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user5.jpg",
        score: 90
      },
    ],
  },
  {
    name: "Vinay Anand (D-V)",
    role: "Head",
    school: "Office Management Cell (Division Of Info...",
    profileMatching: "Yes ()",
    obpScore: 1.69,
    obpGrade: "C",
    obpRank: 7,
    progress: "42.24%",
    hodScore: 30,
    selfScore: 30,
    pmsScore: "",
    pmsGrade: "",
    image: "/images/profile/user2.jpg",
    team: [
      {
        name: "Team Member 11",
        role: "Coordinator",
        school: "Office Management Cell",
        profileMatching: "Yes ()",
        obpScore: 2.5,
        obpGrade: "B",
        obpRank: 1,
        progress: "62.5%",
        hodScore: 25,
        selfScore: 30,
        pmsScore: "",
        pmsGrade: "",
        image: "/images/profile/user1.jpg",
        score: 60
      },
    ],
  },
];

export default function Page() {
  const router = useRouter();
  const [selectedHead, setSelectedHead] = useState<typeof headsData[0] | null>(null);
  const [view, setView] = useState<'heads' | 'team'>('heads');

  const getBreadcrumb = () => {
    const base = [
      { to: "/dashboard/staff", title: "Dashboard" },
      { to: "/dashboard/staff/ObpPlanner/ObpDashboard", title: "OBP Dashboard" },
    ];

    if (selectedHead) {
      // Assuming wing and sub wing based on context
      base.push({ to: "", title: "Administrative (wing)" });
      base.push({ to: "", title: "Administrative Office (sub wing)" });
      base.push({ to: "", title: "Heads of that wing" });
      if (view === 'team') {
        base.push({ to: "", title: `Team of ${selectedHead.name}` });
      }
    } else {
      base.push({ to: "", title: "OBP Heads" });
    }

    return base;
  };

  return (
    <Box
      sx={{ flexGrow: 1, p: 4, backgroundColor: "#f0f4f8", minHeight: "100vh" }}
    >
      <Breadcrumb title="OBP Heads" items={getBreadcrumb()} />
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
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
            OBP Heads Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#666" }}>
            View performance metrics for Heads of Schools, Departments, and Centers
          </Typography>
        </Box>
      </Box>

      {view === 'heads' ? (
        /* Heads Grid */
        <Grid container spacing={3}>
          {headsData.slice(0, 4).map((head, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={index}>
              <Card
                onClick={() => {
                  setSelectedHead(head);
                  setView('team');
                }}
                sx={{
                  width: "100%",
                  minHeight: 400,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    borderColor: "#1976d2",
                  },
                  backgroundColor: "#ffffff",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={head.image}
                  alt={head.name}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    (e.target as HTMLImageElement).src = "/images/HomePageSvg/no-data.webp"; // Fallback image
                  }}
                  sx={{
                    objectFit: "Cover"
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2, textAlign: 'center' }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}
                  >
                    {head.name} ({head.role})
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontSize: "0.875rem", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {head.school}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Profile Matching: {head.profileMatching}
                  </Typography>
                  <Box sx={{ textAlign: 'left' }}>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                        <strong>obp score:</strong>{head.obpScore}
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        <strong>obp grade:</strong>{head.obpGrade}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                        <strong>obp rank:</strong>{head.obpRank}
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        <strong>progress:</strong>{head.progress}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                        <strong>(hod):</strong>{head.hodScore}
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        <strong>(self):</strong>{head.selfScore}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                        <strong>pms score:</strong>{head.pmsScore}
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        <strong>pms grade:</strong>{head.pmsGrade}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Team View */
        selectedHead && (
          <Box>
            <Typography variant="h4" sx={{ mb: 2, color: "#1976d2" }}>
              Team of {selectedHead.name}
            </Typography>
            <Grid container spacing={3}>
              {selectedHead.team.map((member, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
                  <Card
                    onClick={() => router.push(`/dashboard/staff/ObpPlanner/ObpDashboard/EmployeeDetails/MetricDetails?role=${encodeURIComponent(member.name)}`)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                      transition: "all 0.2s ease-in-out",
                      cursor: "pointer",
                      backgroundColor: "#ffffff",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        borderColor: "#1976d2",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={member.image}
                      alt={member.name}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src = "/images/HomePageSvg/no-data.webp"; // Fallback image
                      }}
                      sx={{
                        objectFit: "Cover"
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2, textAlign: 'center' }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}
                      >
                        {member.name} ({member.role})
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1, fontSize: "0.875rem", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {member.school}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Profile Matching: {member.profileMatching}
                      </Typography>
                      <Box sx={{ textAlign: 'left' }}>
                        <Box sx={{ display: "flex", mb: 1 }}>
                          <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                            <strong>obp score:</strong>{member.obpScore}
                          </Typography>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            <strong>obp grade:</strong>{member.obpGrade}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", mb: 1 }}>
                          <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                            <strong>obp rank:</strong>{member.obpRank}
                          </Typography>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            <strong>progress:</strong>{member.progress}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", mb: 1 }}>
                          <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                            <strong>(hod):</strong>{member.hodScore}
                          </Typography>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            <strong>(self):</strong>{member.selfScore}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex" }}>
                          <Typography variant="body2" sx={{ flex: 1, mr: 1 }}>
                            <strong>pms score:</strong>{member.pmsScore}
                          </Typography>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            <strong>pms grade:</strong>{member.pmsGrade}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      )}
    </Box>
  );
}
