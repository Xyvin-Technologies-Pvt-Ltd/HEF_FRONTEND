import React from 'react';
import YouTube from 'react-youtube';

// Utility function to extract video ID from URL
const extractVideoId = (url) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^\?&"'>]+)/) ||
                url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=)([^"?&'<>]+)/);
  return match ? match[1] : null;
};

const VideoCard = ({ url }) => {
  const videoId = extractVideoId(url);

  const opts = {
    height: '202',
    width: '388',
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

export default VideoCard;
