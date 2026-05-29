"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
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
  AttachFile,
  ChatBubbleOutline,
  Schedule,
  Forum,
  ArrowDownward,
} from '@mui/icons-material';
import { insertOBPProjectFollowUpRemarks } from '@/app/actions/StaffActions/ObpStatusAction/insertOBPProjectFollowupRemarksAction';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isUser: boolean;
  attachment?: string;
}

interface StageChatModalProps {
  open: boolean;
  onClose: () => void;
  metricData: {
    metricId: string;
    metricDescription: string;
    drawingNumber: string;
    endDate: string;
  };
  stageData: {
    stageAllocationid?: string;
    stageId: string;
    stageDescription: string;
    startDate: string;
    endDate: string;
    actionStatus: string;
  };
  uid: string;
  loginName?: string;
  chatMessages?: any[];
  loadingChat?: boolean;
  onSendMessage?: () => void;
}

// Transform API response to chat messages format
const transformChatMessages = (apiMessages: any[], currentUserId?: string): ChatMessage[] => {
  if (!Array.isArray(apiMessages)) return [];

  return apiMessages.map((msg, index) => {
    const isUser = msg.messageType === 'R' ||
                   (currentUserId && msg.entryBy && msg.entryBy.includes(currentUserId));

    return {
      id: String(msg.allocationId || index) + '_' + index,
      sender: msg.employeeName || (isUser ? 'You' : 'Unknown'),
      message: msg.followUpRemarks || '',
      timestamp: msg.entryDateTime || '',
      isUser: isUser,
      attachment: msg.stageSupportingDocument || undefined,
    };
  }).sort((a, b) => {
    if (!a.timestamp && !b.timestamp) return 0;
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    
    // Parse timestamp to Date for proper sorting
    const parseTimestamp = (ts: string): Date => {
      const dateRegex = /(\d{1,2})\s+(\w{3})\s+(\d{2}:\d{2}\s*[AP]M)/i;
      const match = ts.match(dateRegex);
      if (!match) return new Date(0);
      
      const [, day, month, time] = match;
      const currentYear = new Date().getFullYear();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase());
      
      if (monthIndex === -1) return new Date(0);
      
      // Parse time (e.g., "11:52 AM")
      const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
      if (!timeMatch) return new Date(currentYear, monthIndex, parseInt(day));
      
      const [, hours, minutes, ampm] = timeMatch;
      let hours24 = parseInt(hours);
      if (ampm.toUpperCase() === 'PM' && hours24 < 12) hours24 += 12;
      if (ampm.toUpperCase() === 'AM' && hours24 === 12) hours24 = 0;
      
      return new Date(currentYear, monthIndex, parseInt(day), hours24, parseInt(minutes));
    };
    
    const dateA = parseTimestamp(a.timestamp);
    const dateB = parseTimestamp(b.timestamp);
    
    return dateB.getTime() - dateA.getTime();
  });
};

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// Generate a consistent color from a string
const stringToColor = (str: string) => {
  const colors = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#eab308', '#84cc16', '#22c55e', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Format date as Today, Yesterday, or actual date
const formatRelativeDate = (dateString: string): string => {
  if (!dateString) return 'Today';
  
  // Parse date format like "23 Dec 11:52 AM" or "09 Feb 04:26 PM"
  const dateRegex = /(\d{1,2})\s+(\w{3})\s+(\d{2}:\d{2}\s*[AP]M)/i;
  const match = dateString.match(dateRegex);
  
  if (!match) {
    // Fallback: try to extract just the date part
    const parts = dateString.split(' ');
    if (parts.length >= 2) {
      return parts[0] + ' ' + parts[1];
    }
    return dateString || 'Today';
  }
  
  const [, day, month, time] = match;
  const currentYear = new Date().getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase());
  
  if (monthIndex === -1) return dateString;
  
  const messageDate = new Date(currentYear, monthIndex, parseInt(day));
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDateOnly = new Date(messageDate);
  messageDateOnly.setHours(0, 0, 0, 0);
  
  if (messageDateOnly.getTime() === today.getTime()) {
    return 'Today';
  } else if (messageDateOnly.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return `${month} ${day}`;
  }
};

// Format timestamp for message bubble (show relative date + time)
const formatMessageTime = (dateString: string): string => {
  if (!dateString) return '';
  
  // Parse date format like "23 Dec 11:52 AM" or "09 Feb 04:26 PM"
  const dateRegex = /(\d{1,2})\s+(\w{3})\s+(\d{2}:\d{2}\s*[AP]M)/i;
  const match = dateString.match(dateRegex);
  
  if (!match) return dateString;
  
  const [, day, month, time] = match;
  const currentYear = new Date().getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase());
  
  if (monthIndex === -1) return dateString;
  
  const messageDate = new Date(currentYear, monthIndex, parseInt(day));
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDateOnly = new Date(messageDate);
  messageDateOnly.setHours(0, 0, 0, 0);
  
  let datePrefix = '';
  if (messageDateOnly.getTime() === today.getTime()) {
    datePrefix = 'Today';
  } else if (messageDateOnly.getTime() === yesterday.getTime()) {
    datePrefix = 'Yesterday';
  } else {
    datePrefix = `${month} ${day}`;
  }
  
  return `${datePrefix} at ${time.toUpperCase()}`;
};

export default function StageChatModal({
  open,
  onClose,
  metricData,
  stageData,
  uid,
  loginName = '',
  chatMessages = [],
  loadingChat = false,
  onSendMessage,
}: StageChatModalProps): React.ReactNode {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [currentUserFullName, setCurrentUserFullName] = useState<string>('');

  useEffect(() => {
    // Find current user's full name from existing messages
    if (chatMessages && chatMessages.length > 0) {
      // Look for a message with the current user's ID that has the full name
      const userMessage = chatMessages.find(
        (msg) => msg.entryBy === uid && msg.employeeName && msg.employeeName.includes('::')
      );
      if (userMessage && userMessage.employeeName) {
        setCurrentUserFullName(userMessage.employeeName);
      }
    }
  }, [chatMessages, uid]);

  // Clear local messages when modal closes or when allocation changes
  useEffect(() => {
    if (!open) {
      setLocalMessages([]);
      setNewMessage('');
    }
  }, [open]);

  // Clear local messages when allocation changes (different stageAllocationid)
  useEffect(() => {
    // Use stageData.stageAllocationid as the key to detect allocation changes
    const currentAllocationId = stageData?.stageAllocationid;
    if (currentAllocationId) {
      // Clear local messages when switching to a different allocation
      setLocalMessages([]);
    }
  }, [stageData?.stageAllocationid]);

  useEffect(() => {
    // When chatMessages change (new data from API), replace local messages entirely
    // This handles the case when switching between different allocations
    const serverMessages = transformChatMessages(chatMessages, uid);
    setLocalMessages(serverMessages);
  }, [chatMessages, uid]);

  const displayMessages: ChatMessage[] = React.useMemo(() => {
    return localMessages;
  }, [localMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  // Track scroll position for scroll-down button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !stageData.stageAllocationid || !metricData.metricId) {
      setSnackbar({
        open: true,
        message: 'Unable to send message. Please try again.',
        severity: 'error',
      });
      return;
    }

    setSendingMessage(true);
    try {
      const payload = {
        StageAllocationId: Number(stageData.stageAllocationid),
        LoginName: loginName || uid,
        FollowupRemarks: newMessage.trim(),
        SupportingDocument: '',
        SupportingDocumentName: '',
      };

      const result = await insertOBPProjectFollowUpRemarks(payload);

      if (result.status === 'success') {
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: currentUserFullName || loginName || 'You',
          message: newMessage.trim(),
          timestamp: new Date().toLocaleString(),
          isUser: true,
        };
        setLocalMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        setSnackbar({
          open: true,
          message: 'Message sent successfully!',
          severity: 'success',
        });
        if (onSendMessage) {
          onSendMessage();
        }
      } else {
        const errorDetail = result.errorDetails?.data || result.message;
        setSnackbar({
          open: true,
          message: errorDetail || 'Failed to send message. Please try again.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while sending the message.',
        severity: 'error',
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentClick = (attachment: string) => {
    if (attachment) {
      window.open(attachment, '_blank');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        {/* Gradient Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            px: 3,
            py: 2,
            position: 'relative',
            overflow: 'hidden',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            },
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.25)',
              },
              zIndex: 1,
            }}
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>

          {/* Title area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, position: 'relative',  }}>
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
              <Forum sx={{ fontSize: 22 }} />
            </Box>
            <Box sx={{ flex: 1, pr: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '0.3px',
                  lineHeight: 1.3,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                Stage Discussion
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.85,
                  display: 'block',
                  fontSize: '0.75rem',
                }}
              >
                Metric {metricData?.metricId} — {metricData.metricDescription}
              </Typography>
            </Box>
          </Box>

          {/* Info chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', position: 'relative' }}>
            <Chip
              size="small"
              label={stageData.stageDescription}
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
          
          </Box>
        </Box>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {/* Messages Area */}
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
              background: 'linear-gradient(180deg, #f8f9ff 0%, #f0f2ff 50%, #f8f9ff 100%)',
              position: 'relative',
              // Custom scrollbar
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(102, 126, 234, 0.3)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(102, 126, 234, 0.5)',
              },
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(102, 126, 234, 0.4)' },
                      '70%': { boxShadow: '0 0 0 15px rgba(102, 126, 234, 0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(102, 126, 234, 0)' },
                    },
                  }}
                >
                  <CircularProgress size={28} sx={{ color: 'white' }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#8b8fa3', fontWeight: 500 }}>
                  Loading conversation...
                </Typography>
              </Box>
            ) : displayMessages.length > 0 ? (
              displayMessages.map((message, index) => {
                // Helper to extract date key for comparison
                const getDateKey = (ts: string): string => {
                  if (!ts) return '';
                  const dateRegex = /(\d{1,2})\s+(\w{3})/i;
                  const match = ts.match(dateRegex);
                  if (!match) return ts.split(' ')[0];
                  return match[1] + ' ' + match[2]; // e.g., "23 Dec"
                };
                
                // Check if we should show date separator
                const currentDateKey = getDateKey(message.timestamp);
                const prevDateKey = displayMessages[index - 1] ? getDateKey(displayMessages[index - 1].timestamp) : '';
                const showDateSep = index === 0 || currentDateKey !== prevDateKey;

                return (
                  <React.Fragment key={message.id}>
                    {showDateSep && message.timestamp && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
                        <Chip
                          size="small"
                          label={formatRelativeDate(message.timestamp)}
                          sx={{
                            backgroundColor: 'rgba(102, 126, 234, 0.08)',
                            color: '#8b8fa3',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            height: 24,
                          }}
                        />
                      </Box>
                    )}
                    <Fade in timeout={300}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: message.isUser ? 'flex-end' : 'flex-start',
                          mb: 0.5,
                        }}
                      >
                        {/* Sender name (shown for all messages) */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5, 
                          mb: 0.3,
                          ...(message.isUser ? { justifyContent: 'flex-end', mr: 5.5 } : { ml: 5.5 })
                        }}>
                          <Typography
                            variant="caption"
                            sx={{ color: stringToColor(message.sender), fontWeight: 600, fontSize: '0.7rem' }}
                          >
                            {message.sender}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: 1,
                            flexDirection: message.isUser ? 'row-reverse' : 'row',
                            maxWidth: '75%',
                          }}
                        >
                          {/* Avatar */}
                          {!message.isUser && (
                            <Tooltip title={message.sender} arrow placement="left">
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: stringToColor(message.sender),
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                  flexShrink: 0,
                                }}
                              >
                                {getInitials(message.sender)}
                              </Avatar>
                            </Tooltip>
                          )}

                          {/* Message bubble */}
                          <Paper
                            elevation={0}
                            sx={{
                              px: 2,
                              py: 1.2,
                              maxWidth: '100%',
                              background: message.isUser
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : '#ffffff',
                              color: message.isUser ? 'white' : '#2d3748',
                              borderRadius: message.isUser
                                ? '18px 18px 4px 18px'
                                : '18px 18px 18px 4px',
                              boxShadow: message.isUser
                                ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.06)',
                              border: message.isUser ? 'none' : '1px solid rgba(102, 126, 234, 0.08)',
                              position: 'relative',
                              wordBreak: 'break-word',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                lineHeight: 1.5,
                                fontSize: '0.875rem',
                              }}
                            >
                              {message.message}
                            </Typography>

                            {/* Attachment */}
                            {message.attachment && (
                              <Box
                                sx={{
                                  mt: 1,
                                  p: 0.8,
                                  backgroundColor: message.isUser
                                    ? 'rgba(255,255,255,0.15)'
                                    : 'rgba(102, 126, 234, 0.06)',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.8,
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: message.isUser
                                      ? 'rgba(255,255,255,0.25)'
                                      : 'rgba(102, 126, 234, 0.12)',
                                    transform: 'translateY(-1px)',
                                  },
                                }}
                                onClick={() => message.attachment && handleAttachmentClick(message.attachment)}
                              >
                                <AttachFile sx={{ fontSize: 15, transform: 'rotate(45deg)' }} />
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                  View Attachment
                                </Typography>
                              </Box>
                            )}

                            {/* Timestamp */}
                            <Typography
                              variant="caption"
                              sx={{
                                opacity: message.isUser ? 0.75 : 0.5,
                                display: 'block',
                                mt: 0.5,
                                fontSize: '0.65rem',
                                textAlign: message.isUser ? 'right' : 'left',
                              }}
                            >
                              {formatMessageTime(message.timestamp)}
                            </Typography>
                          </Paper>
                        </Box>
                      </Box>
                    </Fade>
                  </React.Fragment>
                );
              })
            ) : (
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
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChatBubbleOutline sx={{ fontSize: 36, color: '#b0b8d1' }} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ color: '#8b8fa3', fontWeight: 600, mb: 0.5 }}>
                    No messages yet
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b0b8d1' }}>
                    Start the conversation by typing a message below
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Scroll to bottom FAB */}
          {showScrollDown && (
            <Fade in>
              <IconButton
                onClick={scrollToBottom}
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 90,
                  right: 24,
                  backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 10,
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <ArrowDownward fontSize="small" sx={{ color: '#667eea' }} />
              </IconButton>
            </Fade>
          )}

          {/* Message Input Area */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid rgba(102, 126, 234, 0.1)',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1.5,
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              disabled={sendingMessage}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                  backgroundColor: '#f8f9ff',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.15)',
                    transition: 'all 0.2s ease',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                    borderWidth: '1.5px',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  px: 2,
                  py: 1.2,
                },
              }}
            />
            <Tooltip title={newMessage.trim() ? 'Send message' : 'Type a message first'} arrow>
              <span>
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  sx={{
                    width: 44,
                    height: 44,
                    background: (!newMessage.trim() || sendingMessage)
                      ? '#e8eaf6'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: (!newMessage.trim() || sendingMessage) ? '#b0b8d1' : 'white',
                    boxShadow: (!newMessage.trim() || sendingMessage)
                      ? 'none'
                      : '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4196 100%)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                    },
                    '&.Mui-disabled': {
                      background: '#e8eaf6',
                      color: '#b0b8d1',
                    },
                  }}
                >
                  {sendingMessage ? (
                    <CircularProgress size={22} sx={{ color: 'inherit' }} />
                  ) : (
                    <Send sx={{ fontSize: 20, transform: 'rotate(-35deg)', ml: 0.3, mt: -0.3 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
