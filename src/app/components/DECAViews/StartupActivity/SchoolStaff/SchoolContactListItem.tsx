import React from 'react';
import { useSelector } from '@/store/hooks';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IconStar, IconEdit } from '@tabler/icons-react';

type Props = {
  onContactClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onStarredClick?: React.MouseEventHandler<SVGElement>;
  onEditClick?: React.MouseEventHandler<SVGElement>;
  id: string | number;
  firstname: string;
  lastname: string;
  image: string;
  department: string;
  phone: string;
  starred: boolean;
  active: any;
  showrightSidebar?: () => void;

};

const ContactListItem = ({
  onContactClick,
  onStarredClick,
  onEditClick,
  id,
  firstname,
  lastname,
  image,
  department,
  phone,
  starred,
  active,
  showrightSidebar
}: Props) => {
  const customizer = useSelector((state) => state.customizer);
  const br = `${customizer.borderRadius}px`;

  const theme = useTheme();
  const warningColor = theme.palette.warning.main;

  return (
    <ListItemButton
      sx={{
        py: 1,
        px: 2,
        borderRadius: 1,
        transition: 'all 0.15s ease-in-out',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        },
        ...(active && {
          backgroundColor: theme.palette.primary.light + '!important',
          color: theme.palette.primary.main
        })
      }}
      selected={active}
    >
      <ListItemAvatar>
        <Avatar
          alt={firstname}
          src={image ? image : undefined}
          sx={{
            bgcolor: image ? 'transparent' : theme.palette.primary.main,
            width: 40,
            height: 40
          }}
        >
          {!image && firstname?.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText>
        <Stack direction="row" gap="10px" alignItems="center">
          <Box mr="auto" onClick={onContactClick} sx={{ cursor: 'pointer', flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ maxWidth: '150px' }}>
              {firstname} {lastname}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {phone}
            </Typography>
          </Box>
          {/* <IconStar
            onClick={onStarredClick}
            size="18"
            stroke={1.5}
            style={{ 
              fill: starred ? warningColor : '', 
              stroke: starred ? warningColor : '',
              cursor: 'pointer' 
            }}
          /> */}
          <IconEdit
            onClick={onEditClick}
            size="18"
            stroke={1.5}
            style={{
              color: theme.palette.primary.main,
              cursor: 'pointer'
            }}
          />
        </Stack>
      </ListItemText>
    </ListItemButton>
  );
};

export default ContactListItem;