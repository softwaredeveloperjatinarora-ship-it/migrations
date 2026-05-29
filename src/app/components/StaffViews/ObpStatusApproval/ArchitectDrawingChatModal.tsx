'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Avatar,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
  Fade,
  Slide,
} from '@mui/material';
import {
  Close,
  Send,
  ChatBubbleOutline,
  Schedule,
  ArrowDownward,
  Architecture,
} from '@mui/icons-material';
import { getArchitectureDrawingFollowup } from '@/app/actions/StaffActions/ObpStatusAction/getArchitectureDrawingFollowupAction';
import { insertArchitectureDrawingFollowup } from '@/app/actions/StaffActions/ObpStatusAction/insertArchitectureDrawingFollowupAction';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isUser: boolean;
  supportingDocument?: string | null;
}

export interface ArchitectDrawingChatModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  metricData: {
    metricId: string;
    metricDescription: string;
    drawingNumber: string;
    endDate: string;
  };
  loginName?: string;
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatMessageTime = (ts: string): string => {
  if (!ts) return '';
  const date = new Date(ts);
  if (isNaN(date.getTime())) return ts;
  const prefix = getDayLabel(ts);
  const time = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${prefix} at ${time.toUpperCase()}`;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(n => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

const stringToColor = (str: string) => {
  const colors = ['#ec4899', '#a855f7', '#8b5cf6', '#6366f1', '#14b8a6', '#0ea5e9', '#f43f5e'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function ArchitectDrawingChatModal({
  open,
  onClose,
  projectId,
  metricData,
  loginName = '',
}: ArchitectDrawingChatModalProps): React.ReactNode {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchMessages = useCallback(async () => {
    if (!projectId) return;
    setLoadingChat(true);
    try {
      debugger;
      console.log('[ArchitectChat] GET → projectId:', projectId);
      const res = await getArchitectureDrawingFollowup(projectId);
      console.log('[ArchitectChat] GET ← response:', res);
      if (res.status === 'success' && res.ApiData) {
        const raw: any[] = res.ApiData.item1 ?? [];
        setMessages(transformMessages(raw, loginName));
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('[ArchitectChat] GET error:', err);
      setMessages([]);
    } finally {
      setLoadingChat(false);
    }
  }, [projectId, loginName]);

  // Fetch on open, clear on close
  useEffect(() => {
    if (open && projectId) {
      fetchMessages();
    } else if (!open) {
      setMessages([]);
      setNewMessage('');
    }
  }, [open, projectId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !projectId || sending) return;
    setSending(true);
    try {
      const payload = { ProjectId: projectId, Message: newMessage.trim() };
      console.log('[ArchitectChat] INSERT → payload:', payload);
      const result = await insertArchitectureDrawingFollowup(payload);
      console.log('[ArchitectChat] INSERT ← response:', result);
      if (result.status === 'success') {
        setNewMessage('');
        setSnackbar({ open: true, message: 'Message sent successfully!', severity: 'success' });
        fetchMessages();
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to send message.',
          severity: 'error',
        });
      }
    } catch {
      setSnackbar({ open: true, message: 'An error occurred while sending.', severity: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' } as any}
        PaperProps={{
          sx: {
            height: '85vh',
            maxHeight: '700px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #ec4899 0%, #9d174d 100%)',
            color: 'white',
            px: 3,
            py: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            },
          }}
        >
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' },
              zIndex: 1,
            }}
          >
            <Close fontSize="small" />
          </IconButton>

          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, position: 'relative' }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Architecture sx={{ fontSize: 22 }} />
            </Box>
            <Box sx={{ flex: 1, pr: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, letterSpacing: '0.3px', lineHeight: 1.3 }}
              >
                Architect Drawing Follow Up Chat
              </Typography>
              <Typography
                variant="caption"
                sx={{ opacity: 0.85, display: 'block', fontSize: '0.75rem' }}
              >
                {metricData.metricDescription || `Metric ${metricData.metricId}`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', position: 'relative' }}>
            {metricData.drawingNumber && (
              <Chip
                size="small"
                label={`Drawing No. ${metricData.drawingNumber}`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 26,
                  backdropFilter: 'blur(4px)',
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            )}
            {metricData.endDate && (
              <Chip
                size="small"
                icon={<Schedule sx={{ fontSize: 13, color: 'white !important' }} />}
                label={`End: ${metricData.endDate}`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 26,
                  backdropFilter: 'blur(4px)',
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            )}
            {projectId && (
              <Chip
                size="small"
                label={`Project: ${projectId}`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 26,
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            )}
          </Box>
        </Box>

        <DialogContent
          sx={{ p: 0, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
        >
          {/* Messages area */}
          <Box
            ref={messagesContainerRef}
            onScroll={handleScroll}
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 2.5,
              py: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              background: 'linear-gradient(180deg, #fdf2f8 0%, #fce7f3 50%, #fdf2f8 100%)',
              position: 'relative',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(236, 72, 153, 0.3)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(236, 72, 153, 0.5)' },
            }}
          >
            {loadingChat ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ec4899 0%, #9d174d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(236,72,153,0.4)' },
                      '70%': { boxShadow: '0 0 0 15px rgba(236,72,153,0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(236,72,153,0)' },
                    },
                  }}
                >
                  <CircularProgress size={28} sx={{ color: 'white' }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#9d174d', fontWeight: 500 }}>
                  Loading conversation...
                </Typography>
              </Box>
            ) : messages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(157,23,77,0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChatBubbleOutline sx={{ fontSize: 32, color: '#ec4899' }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: '#9d174d', fontWeight: 600, textAlign: 'center' }}
                >
                  No messages yet
                </Typography>
                <Typography variant="caption" sx={{ color: '#f9a8d4', textAlign: 'center' }}>
                  Start the architect drawing follow-up conversation
                </Typography>
              </Box>
            ) : (
              messages.map((msg, index) => {
                const prevMsg = index > 0 ? messages[index - 1] : null;
                const thisDay = getDayLabel(msg.timestamp);
                const prevDay = prevMsg ? getDayLabel(prevMsg.timestamp) : null;
                const showDateDivider = !prevDay || thisDay !== prevDay;

                return (
                  <React.Fragment key={msg.id}>
                    {showDateDivider && msg.timestamp && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                        <Box
                          sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(236,72,153,0.2)' }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#ec4899',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            px: 1,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {thisDay}
                        </Typography>
                        <Box
                          sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(236,72,153,0.2)' }}
                        />
                      </Box>
                    )}
                    <Fade in timeout={300}>
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
                              width: 32,
                              height: 32,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              backgroundColor: msg.isUser ? '#ec4899' : stringToColor(msg.sender),
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(msg.sender)}
                          </Avatar>
                        </Tooltip>

                        <Box
                          sx={{
                            maxWidth: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.isUser ? 'flex-end' : 'flex-start',
                            gap: 0.25,
                          }}
                        >
                          <Typography
                            sx={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 500, px: 0.5 }}
                          >
                            {msg.sender}
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              px: 1.5,
                              py: 1,
                              borderRadius: msg.isUser
                                ? '18px 18px 4px 18px'
                                : '18px 18px 18px 4px',
                              background: msg.isUser
                                ? 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
                                : 'white',
                              color: msg.isUser ? 'white' : '#1f2937',
                              boxShadow: msg.isUser
                                ? '0 4px 15px rgba(236,72,153,0.3)'
                                : '0 2px 8px rgba(0,0,0,0.08)',
                              border: msg.isUser ? 'none' : '1px solid rgba(236,72,153,0.15)',
                              wordBreak: 'break-word',
                            }}
                          >
                            <Typography
                              sx={{ fontSize: '0.8rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}
                            >
                              {msg.message}
                            </Typography>
                            {msg.supportingDocument && (
                              <Typography
                                component="a"
                                href={`/webftp/Construction/ArchitectureChat/${msg.supportingDocument}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  display: 'block',
                                  mt: 0.5,
                                  fontSize: '0.72rem',
                                  color: msg.isUser ? 'rgba(255,255,255,0.85)' : '#ec4899',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                              >
                                📎 {msg.supportingDocument}
                              </Typography>
                            )}
                          </Paper>
                          {msg.timestamp && (
                            <Typography sx={{ fontSize: '0.6rem', color: '#d1d5db', px: 0.5 }}>
                              {formatMessageTime(msg.timestamp)}
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
                  position: 'sticky',
                  bottom: 8,
                  alignSelf: 'flex-end',
                  backgroundColor: '#ec4899',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(236,72,153,0.4)',
                  '&:hover': { backgroundColor: '#be185d' },
                  zIndex: 1,
                }}
              >
                <ArrowDownward fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* Input area */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderTop: '1px solid rgba(236,72,153,0.15)',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              size="small"
              placeholder="Type your architect drawing follow-up message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  fontSize: '0.875rem',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ec4899' },
                },
              }}
            />
            <Tooltip title={!projectId ? 'No project selected' : 'Send message (Enter)'}>
              <span>
                <IconButton
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending || !projectId}
                  sx={{
                    width: 44,
                    height: 44,
                    background: 'linear-gradient(135deg, #ec4899 0%, #9d174d 100%)',
                    color: 'white',
                    borderRadius: '14px',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #be185d 0%, #831843 100%)',
                      boxShadow: '0 6px 16px rgba(236,72,153,0.4)',
                    },
                    '&:disabled': { background: '#f3f4f6', color: '#9ca3af', boxShadow: 'none' },
                  }}
                >
                  {sending ? (
                    <CircularProgress size={18} sx={{ color: 'inherit' }} />
                  ) : (
                    <Send sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
