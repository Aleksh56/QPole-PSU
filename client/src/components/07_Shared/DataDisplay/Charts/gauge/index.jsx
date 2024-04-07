import React from 'react';
import { Box, Typography } from '@mui/material';

const CustomGauge = ({ value }) => {
  const size = 200;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size}>
        <circle
          stroke="lightgray"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: 0 }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="tomato"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease 0s' }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <Typography variant="h6" sx={{ position: 'absolute' }}>
        {value}%
      </Typography>
    </Box>
  );
};

export default CustomGauge;
