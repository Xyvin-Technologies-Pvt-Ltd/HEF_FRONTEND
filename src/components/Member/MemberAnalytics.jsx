import { Grid } from '@mui/material'
import React from 'react'
import AnalyticCard from '../../ui/AnalyticCard'

const MemberAnalytics = () => {
  const eventsData = [
    { title: 'Total Groups', value: '23',color: '#34C759' },
    { title: 'Profile Shares', value: '10', color: '#686465' },
    { title: 'No of posts', value: '05',  color: '#686465' },
    
  ];
  return (
    <Grid container spacing={2}>
        {eventsData.map((data, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <AnalyticCard data={data} />
          </Grid>
        ))}
      </Grid>
  )
}

export default MemberAnalytics