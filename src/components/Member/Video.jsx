import { useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import YouTube from 'react-youtube';

const extractVideoId = (url) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^\?&"'>]+)/) ||
                url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=)([^"?&'<>]+)/);
  return match ? match[1] : null;
};

const Video = ({ url }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const videoId = extractVideoId(url);

  const opts = {
    height:isMobile? '200' : '150',
    width: isMobile? '100%' : '268',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    videoId ? (
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={event => event.target.pauseVideo()}
      />
    ) : (
      <p>Invalid video URL</p>
    )
  );
};

export default Video;
