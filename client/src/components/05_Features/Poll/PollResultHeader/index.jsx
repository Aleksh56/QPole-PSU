import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

import { DescriptionTagsWrapper, DescriptionWrapper, GraphWrapper, HeaderWrapper } from './styled';

import CustomGauge from '@/components/07_Shared/DataDisplay/Charts/gauge';
import { pollResTableFlds } from '@/data/fields';

const PollResultHeader = ({ res, data }) => {
  console.log(res);
  return (
    <HeaderWrapper>
      <GraphWrapper>
        <CustomGauge value={res.percentage} />
      </GraphWrapper>
      <DescriptionWrapper>
        <DescriptionTagsWrapper>
          <Typography sx={{ fontSize: '12px', color: '#aaa' }}>{data.poll_type}</Typography>
          <Box>
            <Typography sx={{ fontSize: '12px' }}>{data.result.voting_date}</Typography>
          </Box>
        </DescriptionTagsWrapper>

        <Grid
          container
          sx={{
            marginTop: '30px',
            border: '1px solid black',
            rowGap: '10px',
          }}
        >
          {pollResTableFlds.map((item) => (
            <>
              <Grid item xs={10} sx={{ padding: '2px' }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                  {item.caption}
                </Typography>
              </Grid>
              <Grid item xs={2} sx={{ padding: '2px' }}>
                <Typography sx={{ fontSize: '13px' }}>{res[item.field]}</Typography>
              </Grid>
            </>
          ))}
        </Grid>
      </DescriptionWrapper>
    </HeaderWrapper>
  );
};

export default PollResultHeader;
