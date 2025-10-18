import { Grid } from '@mui/material'
import React from 'react'
import AnalyticCard from '../../ui/AnalyticCard'

const MemberAnalytics = ({ data }) => {
  const eventsData = [
    { title: 'Total Groups', value: data.totalGroups || 0, color: '#34C759' },
    { title: 'No of Requirements', value: data?.businessRequirements, color: '#686465' },
    { title: 'No of Business posts', value: data?.businessPosts, color: '#686465' },

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