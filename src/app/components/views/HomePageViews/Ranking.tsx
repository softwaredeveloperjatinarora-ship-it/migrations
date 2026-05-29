


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import BlankCard from '../../shared/BlankCard';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { LinearProgress, Tooltip, Dialog, Card, Skeleton, Chip } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';
import { decryptDataforResponse } from '@/app/api/services/auth/Encrptdecrpt';
import RankDetailPopup from './Popup/RankDetailPopup/RankDetailPopup';
import { useTheme } from "@mui/material/styles";
import { getUserRankAction } from '@/app/actions/homeAction/leaderRank/getUserRankAction';

const Ranking = ({ onDataFetched }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState("");
  const isDataFetched = useRef(false);
  const { data: session } = useSession();
  const [rank, setRank] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (isDataFetched.current) return;
      setLoading(true);
      try {
        const response = await getUserRankAction();
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");

        if (response.status === "success") {
          const decryptedData = decryptDataforResponse(response.ApiData, splitValue[1]);
          const parsed = JSON.parse(decryptedData);
          // console.log("datarank",parsed )
          setRank(parsed);
          onDataFetched(parsed);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
        isDataFetched.current = true;
      }
    };

    fetchData();
  }, [onDataFetched, session]);

  const handleClick = (courseCode: string) => {
    setOpen(true);
    setCourse(courseCode);
  };

  const grapgcolor = (percent: number) => {
    if (percent > 80) return theme.palette.success.main;
    if (percent >= 50) return theme.palette.warning.main;
    return "#FF4D4D";
  };

  return (
    <>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Box sx={{ position: "relative", width: "100%", padding: 0 }}>
          <style>{`
            .swiper-button-next,
            .swiper-button-prev {
              width: 30px !important; 
              height: 30px !important; 
              z-index: 10;
            }
            .swiper-button-next:after,
            .swiper-button-prev:after {
              font-size: 24px !important; 
              margin-top: 0;
            }
          `}</style>

          <Swiper
            key={rank.length}
            modules={[Navigation]}
            spaceBetween={18}
            navigation
            slidesPerView={Math.min(rank.length, 3)}
            breakpoints={{
              320: { slidesPerView: 1 },
              600: { slidesPerView: 1 },
              900: { slidesPerView: Math.min(rank.length, 3) },
              1200: { slidesPerView: Math.min(rank.length, 3) },
            }}
          >
            {rank.map((card, index) => (
              <SwiperSlide key={index}>
                <Card onClick={() => handleClick(card.CourseCode)} sx={{ cursor: "pointer" }}>
                  <Box sx={{ margin: -2 }}>
                    <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ marginLeft: { lg: 2.5, xs: 3 } }}>
                        <Tooltip title="Rank in Class">
                          {card.StudentRank === 1 ? (
                            <Icon icon="fluent-emoji-flat:1st-place-medal" width="30" height="30" />
                          ) : card.StudentRank === 2 ? (
                            <Icon icon="fluent-emoji-flat:2nd-place-medal" width="30" height="30" />
                          ) : card.StudentRank === 3 ? (
                            <Icon icon="fluent-emoji-flat:3rd-place-medal" width="30" height="30" />
                          ) : (
                            <Chip
                              label={`${card.StudentRank}`}
                              sx={{
                                color: theme.palette.error.main,
                                bgcolor: theme.palette.error.light,
                                border: "1px solid",
                              }}
                              size="medium"
                            />
                          )}
                        </Tooltip>

                        <Stack spacing={0}>
                          <Typography variant="h6">{card.CourseCode}</Typography>
                        </Stack>
                      </Stack>

                      <Tooltip title="Attendance">
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          sx={{
                            marginRight: 3,
                            gap: 1,
                            minWidth: 100,
                          }}
                        >
                          <Typography
                            color="textPrimary"
                            variant="subtitle1"
                            component="span"
                            fontWeight={600}
                            fontSize="12px"
                          >
                            {card.Per}%
                          </Typography>
                          <LinearProgress
                            value={card.Per}
                            variant="determinate"
                            sx={{
                              width: "100%",
                              height: 5,
                              backgroundColor: "#e0e0e0",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: grapgcolor(card.Per),
                              },
                            }}
                          />
                        </Stack>
                      </Tooltip>
                    </Stack>

                    <Tooltip title={card.Name}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "12px",
                          width: "87%",
                          marginLeft: { xs: 3, lg: 3 },
                        }}
                      >
                        {card.Name}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <RankDetailPopup
              open={open}
              data={course}
              handleClose={() => setOpen(false)}
              title="Top 10 Rank in class performance"
            />
          </Dialog>
        </Box>
      )}
    </>
  );
};

const LoadingSkeleton = () => {
  return (
    <Box sx={{ position: "relative", width: "100%", padding: 0 }}>
      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          width: 30px !important; 
          height: 30px !important; 
          z-index: 10;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 24px !important; 
          margin-top: 0;
        }
      `}</style>

      <Swiper
        key={1}
        modules={[Navigation]}
        spaceBetween={18}
        navigation
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          600: { slidesPerView: 1 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 3 },
        }}
      >
        {[...Array(3)].map((_, index) => (
          <SwiperSlide key={index}>
            <BlankCard>
              <Box sx={{ margin: 1.5 }}>
                <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ marginLeft: { lg: 2.5, xs: 3 } }}>
                    <Skeleton variant="circular" width={30} height={30} />
                    <Stack spacing={0}>
                      <Skeleton variant="text" width={100} height={20} />
                    </Stack>
                  </Stack>

                  <Stack direction="row" alignItems="flex-start" sx={{ gap: 1, minWidth: 100 }}>
                    <Skeleton variant="text" width={30} height={30} />
                    <Skeleton variant="rectangular" width={80} height={5} />
                  </Stack>

                  <Box sx={{ marginRight: { xs: 2.5, lg: 2 } }}>
                    <Skeleton variant="rectangular" width={5} height={25} />
                  </Box>
                </Stack>

                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            </BlankCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Ranking;
