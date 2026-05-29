'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  IconButton,
  CircularProgress,
  Tooltip,
  Fade,
  Snackbar,
  Alert,
  Divider,
  useTheme,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  Container,
} from '@mui/material';
import {
  Send,
  ChatBubbleOutline,
  Architecture,
  ArrowDownward,
  Search,
  FolderOpen,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import Breadcrumb from '@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { getArchitectureDrawingFollowup } from '@/app/actions/StaffActions/ObpStatusAction/getArchitectureDrawingFollowupAction';
import { insertArchitectureDrawingFollowup } from '@/app/actions/StaffActions/ObpStatusAction/insertArchitectureDrawingFollowupAction';
import { getEstateProjects } from '@/app/actions/StaffActions/ObpStatusAction/getEstateProjectsAction';

const BCrumb = [
  { to: '/dashboard/staff', title: 'Dashboard' },
  { to: '/dashboard/staff/ObpStatusApproval', title: 'Project Status' },
  { to: '/dashboard/staff/ObpStatusApproval/ArchitectDrawingChat', title: 'Architect Drawing Chat' },
];

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isUser: boolean;
  supportingDocument?: string | null;
}

interface Project {
  projectId: number;
  projectName: string;
}

interface Props {
  projectId?: string;
}

const transformMessages = (apiMessages: any[], loginUID: string): ChatMessage[] => {
  if (!Array.isArray(apiMessages)) return [];
  return [...apiMessages]
    .sort((a, b) => new Date(a.entryDateTime).getTime() - new Date(b.entryDateTime).getTime())
    .map((msg, i) => ({
      id: String(msg.id ?? i),
      sender: msg.senderUID === loginUID ? 'You' : msg.senderUID || 'Unknown',
      message: msg.message || '',
      timestamp: msg.entryDateTime || '',
      isUser: msg.senderUID === loginUID,
      supportingDocument: msg.supportingDocument ?? null,
    }));
};

const getDayLabel = (ts: string): string => {
  if (!ts) return '';
  const date = new Date(ts);
  if (isNaN(date.getTime())) return '';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (ts: string): string => {
  if (!ts) return '';
  const date = new Date(ts);
  if (isNaN(date.getTime())) return ts;
  const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${getDayLabel(ts)} · ${time.toUpperCase()}`;
};

const getInitials = (name: string) =>
  name.split(' ').map(n => n.charAt(0)).slice(0, 2).join('').toUpperCase();

const stringToColor = (str: string) => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981', '#3b82f6'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function ArchitectDrawingChatPage({ projectId: initialProjectId = '' }: Props) {
  const theme = useTheme();
  const { data: session } = useSession();

  const loginNameRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [loginName, setLoginName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [rawMessages, setRawMessages] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  // Sync session loginName to ref, then re-transform already-loaded messages
  useEffect(() => {
    if (session?.user?._id) {
      const uid = session.user._id.toString();
      loginNameRef.current = uid;
      setLoginName(uid);
    }
  }, [session]);

  // Re-transform whenever loginName or rawMessages change
  useEffect(() => {
    setMessages(transformMessages(rawMessages, loginNameRef.current));
  }, [rawMessages, loginName]);

  // Fetch project list once
  useEffect(() => {
    (async () => {
      setLoadingProjects(true);
      try {
        const res = await getEstateProjects();
        if (res.status === 'success') {
          const data = res.ApiData?.item1 ?? res.ApiData ?? [];
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch {
      } finally {
        setLoadingProjects(false);
      }
    })();
  }, []);

  // Fetch messages for selected project
  const fetchMessages = useCallback(async (pid: string) => {
    if (!pid) return;
    setLoadingMessages(true);
    try {
      console.log('[ArchitectChatPage] GET → projectId:', pid);
      const res = await getArchitectureDrawingFollowup(pid);
      console.log('[ArchitectChatPage] GET ← response:', res);
      if (res.status === 'success' && res.ApiData) {
        setRawMessages(res.ApiData.item1 ?? []);
      } else {
        setRawMessages([]);
      }
    } catch {
      setRawMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) fetchMessages(selectedProjectId);
    else setRawMessages([]);
  }, [selectedProjectId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedProjectId || sending) return;
    setSending(true);
    try {
      const payload = { ProjectId: selectedProjectId, Message: newMessage.trim() };
      console.log('[ArchitectChatPage] INSERT → payload:', payload);
      const res = await insertArchitectureDrawingFollowup(payload);
      console.log('[ArchitectChatPage] INSERT ← response:', res);
      if (res.status === 'success') {
        setNewMessage('');
        setSnackbar({ open: true, message: 'Message sent!', severity: 'success' });
        fetchMessages(selectedProjectId);
      } else {
        setSnackbar({ open: true, message: res.message || 'Failed to send.', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Error sending message.', severity: 'error' });
    } finally {
      setSending(false);
    }
  };

  const selectedProject = projects.find(p => p.projectId.toString() === selectedProjectId);
  const filteredProjects = projects.filter(p =>
    p.projectName?.toLowerCase().includes(search.toLowerCase()) ||
    p.projectId?.toString().includes(search)
  );

  return (
    <>
      <Breadcrumb title="Architect Drawing Follow Up Chat" items={BCrumb} />

      <Container maxWidth="xl" disableGutters sx={{ mt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            height: 'calc(100vh - 200px)',
            minHeight: 540,
          }}
        >
          {/* ── Sidebar ── */}
          <Box
            sx={{
              width: 300,
              flexShrink: 0,
              borderRight: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#f8fafc',
            }}
          >
            {/* Sidebar header */}
            <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Architecture sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
                <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                  Projects
                </Typography>
              </Box>
              <TextField
                size="small"
                fullWidth
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 18, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    fontSize: '0.82rem',
                  },
                }}
              />
            </Box>

            <Divider />

            {/* Project list */}
            <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: 2 } }}>
              {loadingProjects ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filteredProjects.length === 0 ? (
                <Box sx={{ textAlign: 'center', pt: 4, color: 'text.disabled' }}>
                  <FolderOpen sx={{ fontSize: 36, mb: 1 }} />
                  <Typography variant="caption">No projects found</Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {filteredProjects.map(p => {
                    const isSelected = p.projectId.toString() === selectedProjectId;
                    return (
                      <ListItemButton
                        key={p.projectId}
                        selected={isSelected}
                        onClick={() => setSelectedProjectId(p.projectId.toString())}
                        sx={{
                          px: 2,
                          py: 1.25,
                          borderLeft: isSelected ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                          '&.Mui-selected': {
                            backgroundColor: `${theme.palette.primary.main}12`,
                            '&:hover': { backgroundColor: `${theme.palette.primary.main}1a` },
                          },
                          '&:hover': { backgroundColor: '#f1f5f9' },
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 44 }}>
                          <Avatar
                            sx={{
                              width: 36, height: 36, fontSize: '0.72rem', fontWeight: 700,
                              backgroundColor: isSelected ? theme.palette.primary.main : stringToColor(p.projectName || ''),
                            }}
                          >
                            {getInitials(p.projectName || `P${p.projectId}`)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={isSelected ? 700 : 500} noWrap sx={{ fontSize: '0.82rem' }}>
                              {p.projectName || `Project ${p.projectId}`}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.disabled">
                              ID: {p.projectId}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              )}
            </Box>
          </Box>

          {/* ── Chat Panel ── */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'white' }}>
            {!selectedProjectId ? (
              /* Empty state */
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: 'text.disabled' }}>
                <Box sx={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChatBubbleOutline sx={{ fontSize: 34, color: theme.palette.primary.light }} />
                </Box>
                <Typography variant="body1" fontWeight={600} color="text.secondary">Select a project to start chatting</Typography>
                <Typography variant="caption">Choose a project from the left panel</Typography>
              </Box>
            ) : (
              <>
                {/* Chat header */}
                <Box
                  sx={{
                    px: 3, py: 1.75,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    backgroundColor: 'white',
                    flexShrink: 0,
                  }}
                >
                  <Avatar
                    sx={{ width: 38, height: 38, fontSize: '0.75rem', fontWeight: 700, backgroundColor: theme.palette.primary.main }}
                  >
                    {getInitials(selectedProject?.projectName || `P${selectedProjectId}`)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {selectedProject?.projectName || `Project ${selectedProjectId}`}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Architect Drawing Follow Up · Project ID: {selectedProjectId}
                    </Typography>
                  </Box>
                </Box>

                {/* Messages */}
                <Box
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    backgroundColor: '#f8fafc',
                    '&::-webkit-scrollbar': { width: 5 },
                    '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: 3 },
                  }}
                >
                  {loadingMessages ? (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                      <CircularProgress size={28} sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="caption" color="text.secondary">Loading messages...</Typography>
                    </Box>
                  ) : messages.length === 0 ? (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                      <ChatBubbleOutline sx={{ fontSize: 40, color: theme.palette.primary.light, opacity: 0.4 }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>No messages yet</Typography>
                      <Typography variant="caption" color="text.disabled">Send the first message below</Typography>
                    </Box>
                  ) : (
                    messages.map((msg, index) => {
                      const prev = index > 0 ? messages[index - 1] : null;
                      const thisDay = getDayLabel(msg.timestamp);
                      const prevDay = prev ? getDayLabel(prev.timestamp) : null;
                      const showDivider = !prevDay || thisDay !== prevDay;

                      return (
                        <React.Fragment key={msg.id}>
                          {showDivider && msg.timestamp && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1.5 }}>
                              <Divider sx={{ flex: 1 }} />
                              <Typography sx={{ color: 'text.disabled', fontSize: '0.65rem', fontWeight: 600, px: 1, whiteSpace: 'nowrap' }}>
                                {thisDay}
                              </Typography>
                              <Divider sx={{ flex: 1 }} />
                            </Box>
                          )}
                          <Fade in timeout={250}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: msg.isUser ? 'row-reverse' : 'row',
                                alignItems: 'flex-end',
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Tooltip title={msg.sender} placement={msg.isUser ? 'left' : 'right'}>
                                <Avatar
                                  sx={{
                                    width: 30, height: 30, fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                                    backgroundColor: msg.isUser ? theme.palette.primary.main : stringToColor(msg.sender),
                                  }}
                                >
                                  {getInitials(msg.sender)}
                                </Avatar>
                              </Tooltip>
                              <Box sx={{ maxWidth: '65%', display: 'flex', flexDirection: 'column', alignItems: msg.isUser ? 'flex-end' : 'flex-start', gap: 0.25 }}>
                                <Typography sx={{ fontSize: '0.65rem', color: 'text.disabled', fontWeight: 500, px: 0.5 }}>
                                  {msg.sender}
                                </Typography>
                                <Box
                                  sx={{
                                    px: 1.75, py: 1,
                                    borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    backgroundColor: msg.isUser ? theme.palette.primary.main : 'white',
                                    color: msg.isUser ? 'white' : 'text.primary',
                                    boxShadow: msg.isUser
                                      ? `0 2px 8px ${theme.palette.primary.main}40`
                                      : '0 1px 4px rgba(0,0,0,0.08)',
                                    border: msg.isUser ? 'none' : `1px solid ${theme.palette.divider}`,
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  <Typography sx={{ fontSize: '0.82rem', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                                    {msg.message}
                                  </Typography>
                                  {msg.supportingDocument && (
                                    <Typography
                                      component="a"
                                      href={`/webftp/Construction/ArchitectureChat/${msg.supportingDocument}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{ display: 'block', mt: 0.5, fontSize: '0.72rem', color: msg.isUser ? 'rgba(255,255,255,0.85)' : theme.palette.primary.main, textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                      📎 {msg.supportingDocument}
                                    </Typography>
                                  )}
                                </Box>
                                {msg.timestamp && (
                                  <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled', px: 0.5 }}>
                                    {formatTime(msg.timestamp)}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Fade>
                        </React.Fragment>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />

                  {showScrollDown && (
                    <IconButton
                      onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      size="small"
                      sx={{
                        position: 'sticky', bottom: 8, alignSelf: 'flex-end',
                        backgroundColor: theme.palette.primary.main, color: 'white',
                        boxShadow: 3, zIndex: 1,
                        '&:hover': { backgroundColor: theme.palette.primary.dark },
                      }}
                    >
                      <ArrowDownward fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                {/* Input */}
                <Box
                  sx={{
                    px: 3, py: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor: 'white',
                    display: 'flex', alignItems: 'flex-end', gap: 1.5, flexShrink: 0,
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    size="small"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        fontSize: '0.875rem',
                        backgroundColor: '#f8fafc',
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                      },
                    }}
                  />
                  <Tooltip title="Send (Enter)">
                    <span>
                      <IconButton
                        onClick={handleSend}
                        disabled={!newMessage.trim() || sending}
                        sx={{
                          width: 44, height: 44, borderRadius: 2,
                          backgroundColor: theme.palette.primary.main, color: 'white', flexShrink: 0,
                          '&:hover': { backgroundColor: theme.palette.primary.dark },
                          '&:disabled': { backgroundColor: '#e2e8f0', color: '#94a3b8' },
                        }}
                      >
                        {sending ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : <Send sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
