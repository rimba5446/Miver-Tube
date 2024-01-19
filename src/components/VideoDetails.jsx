import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";
import fetchApi from "../utils/fetchApi";
import themeContext from "../utils/themeContext";
import { Loader, Videos } from "./";

export default function VideoDetails() {
  const [comments, setComments] = useState([]);
  const [canLoadComments, setCanLoadComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [video, Setvideo] = useState();
  const [videos, Setvideos] = useState([]);
  const [loadingvid, Setloadingvid] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [loadingvids, Setloadingvids] = useState(false);
  const { id } = useParams();
  const theme = useContext(themeContext);
  const { textColor } = theme.theme;

  const handleToggleDescription = () => {
    setShowDescription((prevValue) => !prevValue);
  };


  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetchApi(`commentThreads?part=snippet&videoId=${video?.id}&maxResults=50`);
      setComments(response.items.map(commentThread => commentThread.snippet.topLevelComment));
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    } finally {
      setLoadingComments(false);
    }
  };




  useEffect(() => {
    console.log('Video State:', video);

    setCanLoadComments(!!video?.id);
  }, [video]);

  useEffect(() => {
    console.log('Video State:', video);
  }, [video]);

  useEffect(() => {
    Setloadingvid(true);
    Setloadingvids(true);
    fetchApi(`videos?part=snippet&id=${id}`).then((data) => {
      Setvideo(data.items[0]);
      Setloadingvid(false);
    });

    fetchApi(`search?part=snippet&relatedToVideoId=${id}&type=video`).then(
      (data) => {
        Setvideos(data.items);
        Setloadingvids(false);
      }
    );

  }, [id]);

  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }}>
        <Box
          flex={2}
          sx={{
            height: "92vh",
            overflowY: "scroll",
          }}
        >
          {loadingvid ? (
            <Loader />
          ) : (
            <Box>
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${id}`}
                className="react-player"
                playing={true}
                top='12'
                position='realtive'
                onEnded={handleVideoEnd}
                controls
              />


              <Typography
                sx={{ color: `${textColor}` }}
                variant="h5"
                fontWeight="bold"
                p={2}
              >
                {video?.snippet?.title}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ color: `${textColor}` }}
                py={1}
                px={2}
              >
                <Link to={`/channel/${video?.snippet?.channelId}`}>
                  <Typography
                    variant={{ sm: "subtitle1", md: "h6" }}
                    sx={{ color: `${textColor}` }}
                  >
                    {video?.snippet?.channelTitle}
                    <CheckCircleIcon
                      sx={{ fontSize: "12px", color: "gray", ml: "5px" }}
                    />
                  </Typography>
                </Link>
                <Stack
                  px={2}
                  direction="row"
                  gap="20px"
                  alignItems="center"
                  flex={1}
                  sx={{ color: `${textColor}` }}
                >
                  <Typography sx={{ opacity: 0.7 }}>
                    {parseInt(video?.statistics?.viewCount).toLocaleString()}{" "}
                    views
                  </Typography>
                  <Typography sx={{ opacity: 0.7 }}>
                    {parseInt(video?.statistics?.likeCount).toLocaleString()}{" "}
                    likes
                  </Typography>
                </Stack>
              </Stack>
              <Stack px={2} pb={2}>
                {showDescription ? (
                  <Typography >
                    {video?.snippet?.description}
                  </Typography>
                ) : (
                  <Typography sx={{ maxHeight: "7em", overflow: "hidden" }}>
                    {video?.snippet?.description}
                  </Typography>
                )}
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  style={{
                    display: showDescription ? 'block' : 'inline-block',
                    right: 2,
                    width: 100,
                    height: 34,
                    borderRadius: 12,
                  }}
                >
                  {showDescription ? "Hide" : "Show"}
                </button>
                <button
                  onClick={async () => {
                    if (canLoadComments) {
                      await fetchComments();
                    }
                  }}
                  style={{
                    display: 'inline-block',
                    margin: '8px 0',
                    padding: '8px 12px',
                    borderRadius: 12,
                    pointerEvents: canLoadComments ? 'auto' : 'none',
                    opacity: canLoadComments ? 1 : 0.5,
                  }}
                >
                  Load Comments
                </button>
                {loadingComments ? (
                  <Loader />
                ) : (
                  <Stack>
                    {comments.map((comment) => (
                      <Box key={comment.id} mt={2} borderBottom="1px solid #ddd" pb={2}>
                        <img
                          src={comment.snippet.authorProfileImageUrl}
                          alt={comment.snippet.authorDisplayName}
                          style={{ borderRadius: '50%', marginRight: '10px', width: '40px', height: '40px' }}
                        />
                        <Stack>
                          <Typography fontWeight="bold">{comment.snippet.authorDisplayName}</Typography>
                          <Typography>{comment.snippet.textDisplay}</Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}

              </Stack>
            </Box>
          )}
        </Box>
        <Box
          px={2}
          py={1}
          justifyContent="center"
          alignItems="center"
          flex={1}
          sx={{ height: "92vh", overflowY: "scroll" }}
        >
          {loadingvids ? (
            <Loader />
          ) : (
            <Videos videos={videos} direction="column" />
          )}
        </Box>
      </Stack >
    </Box >
  );
}
