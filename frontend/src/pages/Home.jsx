import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Helmet } from 'react-helmet';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  padding: 20px;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://sanjaybasket.s3.ap-south-1.amazonaws.com/wallpaper.jpg');
    background-size: cover;
    background-position: center;
    filter: blur(6px) brightness(0.65);
    z-index: -1;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  gap: 20px;
  padding: 20px;
  animation: ${fadeIn} 1.5s ease-out;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const TextContainer = styled.div`
  flex: 1;
  text-align: center;
  animation: ${fadeIn} 2s ease-out;

  @media (min-width: 768px) {
    text-align: left;
    padding-right: 20px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #ffcc80, #ff6f00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8);
  letter-spacing: 1.5px;

  @media (min-width: 768px) {
    font-size: 4rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #ffcc80;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  letter-spacing: 0.5px;
  line-height: 1.6;

  @media (min-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const GifContainer = styled.div`
  flex: 1;
  max-width: 600px;
  width: 100%;

  img {
    width: 100%;
    border-radius: 10px;
  }
`;

const CallToAction = styled.button`
  background: linear-gradient(45deg, #ff6f00, #ffcc80);
  color: #1a1a1a;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  margin-top: 20px;

  &:hover {
    background: linear-gradient(to bottom right, #8a2be2, #4a90e2);
    color: #fff;
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/explore');
  };

  return (
    <HomeContainer>
      <Helmet>
    
    <title>Learn And Share | Collaborative Learning, Expert Tutorials, and User Blogs | Sanjay Patidar</title>
<meta
 name="description"
 content="
Learn And Share is an innovative educational platform merging engaging content with cutting-edge learning experiences. At LearnAndShare, users can create curated category modules and posts tailored to their interests and learning goals. With a focus on personalized learning, users can mark completed posts within specific categories, earning certificates that validate their mastery in various subjects. These certificates can be easily verified through the dedicated 'certificate-verification' page, ensuring credibility and recognition of user achievements.

Furthermore, Learn And Share offers a unique feature where users can choose to follow or unfollow specific categories, allowing for a customized learning journey. By following a category, users receive timely notifications via their registered email whenever new posts are added, empowering them to stay updated on the latest educational discoveries and content. With LearnAndShare, the possibilities for learning are endless, combining comprehensive educational resources with the transformative power of technology for an unparalleled learning experience."
/>

<link rel="icon" type="image/svg+xml" href="src/assets/learnandshare-logo.png" />

<meta property="og:title" content="Learn And Share | Collaborative Learning, Expert Tutorials, and User Blogs | Sanjay Patidar" />
<meta property="og:description" content="Learn And Share is an innovative educational platform merging engaging content with cutting-edge learning experiences. At LearnAndShare, users can create curated category modules and posts tailored to their interests and learning goals. With a focus on personalized learning, users can mark completed posts within specific categories, earning certificates that validate their mastery in various subjects. These certificates can be easily verified through the dedicated 'certificate-verification' page, ensuring credibility and recognition of user achievements.

Furthermore, Learn And Share offers a unique feature where users can choose to follow or unfollow specific categories, allowing for a customized learning journey. By following a category, users receive timely notifications via their registered email whenever new posts are added, empowering them to stay updated on the latest educational discoveries and content. With LearnAndShare, the possibilities for learning are endless, combining comprehensive educational resources with the transformative power of technology for an unparalleled learning experience."/> 
<meta property="og:type" content="website" />
<meta property="og:url" content="https://learnandshare.vercel.app/" />
<meta property="og:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/learnandshare-logo.png" />
<meta property="og:image:alt" content="LearningLog" />
<meta property="og:site_name" content="Learn And Share | Collaborative Learning, Expert Tutorials, and User Blogs | Sanjay Patidar" />
<link rel="canonical" href="https://learnandshare.vercel.app/" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Learn And Share | Collaborative Learning, Expert Tutorials, and User Blogs | Sanjay Patidar" />
<meta name="twitter:description" content="
Learn And Share is an innovative educational platform merging engaging content with cutting-edge learning experiences. At Learn And Share, users can create curated category modules and posts tailored to their interests and learning goals. With a focus on personalized learning, users can mark completed posts within specific categories, earning certificates that validate their mastery in various subjects. These certificates can be easily verified through the dedicated 'certificate-verification' page, ensuring credibility and recognition of user achievements.

Furthermore, Learn And Share offers a unique feature where users can choose to follow or unfollow specific categories, allowing for a customized learning journey. By following a category, users receive timely notifications via their registered email whenever new posts are added, empowering them to stay updated on the latest educational discoveries and content. With LearnAndShare, the possibilities for learning are endless, combining comprehensive educational resources with the transformative power of technology for an unparalleled learning experience." />
<meta name="twitter:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/learnandshare-logo.png" />


<meta name="twitter:site" content="@LearnAndShare" />
<meta name="twitter:creator" content="@LearnAndShare" />

<meta name="keywords" content="educational blogs, tutorials, informative articles, personalized learning, curated modules, certificate verification, category notifications, learning journey, educational content, expert-written articles, how-to guides, academic resources, user-generated content, learning platform, online education, study resources, learning insights, educational discoveries, engaging content, educational achievements" />
<meta name="author" content="Sanjay Patidar" />      


  </Helmet>	
      <ContentWrapper>
        <TextContainer>
          <Title>LearnAndShare</Title>
          <Subtitle>Empowering the Future Through Technology</Subtitle>
          <CallToAction onClick={handleGetStartedClick} aria-label="Get Started">
            Get Started
          </CallToAction>
        </TextContainer>
        <GifContainer>
          <img src="https://sanjaybasket.s3.ap-south-1.amazonaws.com/Student-home-header-1.gif" alt="Learning and Sharing" />
        </GifContainer>
      </ContentWrapper>
    </HomeContainer>
  );
};

export default Home;
