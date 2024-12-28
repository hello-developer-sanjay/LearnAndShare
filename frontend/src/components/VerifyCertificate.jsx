import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import styled, { keyframes } from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { ClipLoader } from 'react-spinners';
import { Helmet } from 'react-helmet';

// Keyframes for animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 20px;
  animation: ${fadeInUp} 1s ease-out;
`;

const Subtitle = styled.h2`
  text-align: center;
  color: #555;
  margin-top: 40px;
  font-size: 2rem;
  animation: ${fadeInUp} 1s ease-out;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  animation: ${fadeInUp} 1s ease-out;

  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
  transition: all 0.3s ease-in-out;

  &:focus {
    border-color: #007BFF;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  @media (min-width: 600px) {
    width: auto;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }
`;

const CertificateList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
  animation: ${fadeInUp} 1s ease-out;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CertificateItem = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  opacity: 0;
  transform: translateY(20px);

  &.visible {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.5s ease-out;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  animation: ${fadeInUp} 1s ease-out;
`;

const LoadingMessage = styled.p`
  text-align: center;
  animation: ${fadeInUp} 1s ease-out;
`;

const CertificateDetail = styled.div`
  text-align: center;
  margin: 20px 0;
  animation: ${fadeInUp} 1s ease-out;
`;

const VerifyCertificate = () => {
  const { uniqueId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({
    userName: '',
    uniqueId: '',
    date: ''
  });

  useEffect(() => { 
    if (uniqueId) {
      setLoading(true);
      axios.get(`https://learnandshare-api-27dec.onrender.com/api/certificates/${uniqueId}`)
        .then(response => {
          setCertificate(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError('Certificate not found');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [uniqueId]);

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.get('https://learnandshare-api-27dec.onrender.com/api/certificates', { params: searchCriteria })
      .then(response => {
        setCertificates(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching certificates');
        setLoading(false);
      });
  };

  const handleDownload = (cert) => {
    console.log(`Requesting download for certificate with uniqueId: ${cert.uniqueId}`);
    axios.get(`https://learnandshare-api-27dec.onrender.com/api/certificates/${cert.uniqueId}/download`)
      .then(response => {
        console.log('Signed URL received:', response.data.url);
        const url = response.data.url;
        window.location.href = url;
      })
      .catch(error => {
        console.error('Error downloading certificate:', error);
      });
  };

  return (
    <Container>
          
    <Helmet>
    
    <title>Verify Your Certificates - LearnAndShare | Fast and Easy Certificate Verification and Download</title>
 <meta
   name="description"
   content="
The VerifyCertificate page offers users a seamless and user-friendly interface for verifying and downloading certificates. This page allows users to search for certificates using various criteria such as user name, unique ID, and date. It features real-time feedback with loading indicators and error messages, ensuring users are informed of the process status. The page is designed with accessibility in mind, including labeled form fields, high-contrast text for readability, and advanced styles for an enhanced user experience. Upon successful verification, users can view detailed certificate information and download certificates directly from the interface.

Functionality of the VerifyCertificate Page:

Certificate Verification:

Users can verify certificates by entering search criteria including user name, unique ID, and date.
If a specific unique ID is provided via the URL, the page automatically fetches and displays the corresponding certificate.
Real-time Feedback:

Loading indicators inform users that their request is being processed.
Clear error messages are displayed if a certificate is not found or if there is an issue fetching the data.
Detailed Certificate Display:

When a certificate is successfully found, the page displays detailed information such as the user's name, category of the certificate, and the date of issuance.
Download Feature:

Users can download the certificate in PDF format by clicking the 'Download Certificate' button.
The downloaded file is named based on the user's name, certificate category, and date for easy identification.
Search Functionality:

Users can perform a search using a combination of criteria.
The search results are displayed in a grid layout, adapting to different screen sizes for optimal viewing on various devices.
Accessibility Features:

Each form field has associated labels for better screen reader support.
Color contrast is optimized to ensure text is readable against the background.
Interactive elements like buttons have advanced styles and hover effects to enhance the user experience."
 />
 

 <meta property="og:title" content=" Verify Your Certificates - LearnAndShare | Fast and Easy Certificate Verification and Download" />
 <meta property="og:description" content="The VerifyCertificate page provides users with a seamless interface for verifying and downloading certificates. Users can search for certificates using criteria such as user name, unique ID, and date, with real-time feedback provided via loading indicators and error messages. Upon successful verification, detailed certificate information is displayed, including the user's name, certificate category, and issuance date. Users can conveniently download certificates in PDF format directly from the interface. The page ensures accessibility with labeled form fields and optimized color contrast, while advanced styles and responsive design enhance the user experience across different devices. Implemented with React's state management and Axios for data fetching, the page utilizes the file-saver library for downloading certificates. Styled-components and keyframe animations are employed for a modern design, with intersection observer handling animations and visibility. This comprehensive functionality overview underscores the VerifyCertificate page's utility, accessibility, and user-centric design"/> 
 <meta property="og:type" content="website" />
 <meta property="og:url" content="https://HogwartsEdX.vercel.app/certificate-verification" />
 <meta property="og:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/HogwartsEdX/hogwartscertify.png" />
 <meta property="og:image:alt" content="Sanjay Patidar" />
 <meta property="og:site_name" content=" Verify Your Certificates - LearnAndShare | Fast and Easy Certificate Verification and Download" />
  <link rel="canonical" href="https://HogwartsEdX.vercel.app/certificate-verification" />

 <meta name="twitter:card" content="summary_large_image" />
 <meta name="twitter:title" content="Verify Your Certificates - LearnAndShare | Fast and Easy Certificate Verification and Download" />
 <meta name="twitter:description" content="
The VerifyCertificate page offers users a seamless and user-friendly interface for verifying and downloading certificates. This page allows users to search for certificates using various criteria such as user name, unique ID, and date. It features real-time feedback with loading indicators and error messages, ensuring users are informed of the process status. The page is designed with accessibility in mind, including labeled form fields, high-contrast text for readability, and advanced styles for an enhanced user experience. Upon successful verification, users can view detailed certificate information and download certificates directly from the interface.

Functionality of the VerifyCertificate Page:

Certificate Verification:

Users can verify certificates by entering search criteria including user name, unique ID, and date.
If a specific unique ID is provided via the URL, the page automatically fetches and displays the corresponding certificate.
Real-time Feedback:

Loading indicators inform users that their request is being processed.
Clear error messages are displayed if a certificate is not found or if there is an issue fetching the data.
Detailed Certificate Display:

When a certificate is successfully found, the page displays detailed information such as the user's name, category of the certificate, and the date of issuance.
Download Feature:

Users can download the certificate in PDF format by clicking the 'Download Certificate' button.
The downloaded file is named based on the user's name, certificate category, and date for easy identification.
Search Functionality:

Users can perform a search using a combination of criteria.
The search results are displayed in a grid layout, adapting to different screen sizes for optimal viewing on various devices.
Accessibility Features:

Each form field has associated labels for better screen reader support.
Color contrast is optimized to ensure text is readable against the background.
Interactive elements like buttons have advanced styles and hover effects to enhance the user experience." />
 <meta name="twitter:image" content="https://sanjaybasket.s3.ap-south-1.amazonaws.com/HogwartsEdX/hogwartscertify.png" />
 <meta name="twitter:site" content="@sanjaypatidar" />
 <meta name="twitter:creator" content="@sanjaypatidar" />

 <meta name="keywords" content="portfolio,verification , certificate verify , certfication verification, signup , eduxcel ,founder: Sanjay patidar , tech, education, careers, opportunity, personal-portfolio,developer_sanju,sanjay, Sanjay, SANJAY, Sanjay Patidar, SANJAY PATIDAR, SANJAY WEB DEVELOPER, SANJAY DEVELOPER, Full Stack Web Developer, Mern Stack Web Developer, sanjay patidar, sanjay-patidar, professional, web developer portfolio, coder, web development, UI/UX design, Chandigarh University, EduXcel, Indore,contact, developer, programmer, engineer, AI, Artificial Intelligence ,tech enthusiastic, creativity ,creator, work , technology, coding, projects, experiences, resume, cv" />
 <meta name="author" content="Sanjay Patidar" />        <script type="application/ld+json">
       {JSON.stringify({
         '@context': 'http://schema.org',
         '@type': 'Person',
         "name": "Sanjay Patidar",
         "birthDate": "1998-07-01",
         "birthPlace": {
           "@type": "Place",
           "address": {
             "@type": "PostalAddress",
             "addressLocality": "Indore"
           }
         },
         "alumniOf": {
           "@type": "CollegeOrUniversity",
           "name": "Chandigarh University",
           "location": {
             "@type": "Place",
             "address": {
               "@type": "PostalAddress",
               "addressLocality": "Chandigarh",
               "addressRegion": "Punjab",
               "addressCountry": "India"
             }
           }
         },
         "address": [
           {
             "@type": "PostalAddress",
             "addressLocality": "Indore",
             "addressRegion": "Madhya Pradesh",
             "postalCode": "452001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Chandigarh",
             "addressRegion": "Punjab",
             "postalCode": "160001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Mumbai",
             "addressRegion": "Maharashtra",
             "postalCode": "400001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Bangalore",
             "addressRegion": "Karnataka",
             "postalCode": "560001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Delhi",
             "addressRegion": "Delhi",
             "postalCode": "110001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Kolkata",
             "addressRegion": "West Bengal",
             "postalCode": "700001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Chennai",
             "addressRegion": "Tamil Nadu",
             "postalCode": "600001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Hyderabad",
             "addressRegion": "Telangana",
             "postalCode": "500001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Pune",
             "addressRegion": "Maharashtra",
             "postalCode": "411001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Ahmedabad",
             "addressRegion": "Gujarat",
             "postalCode": "380001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Jaipur",
             "addressRegion": "Rajasthan",
             "postalCode": "302001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Lucknow",
             "addressRegion": "Uttar Pradesh",
             "postalCode": "226001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Bhopal",
             "addressRegion": "Madhya Pradesh",
             "postalCode": "462001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Nagpur",
             "addressRegion": "Maharashtra",
             "postalCode": "440001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Visakhapatnam",
             "addressRegion": "Andhra Pradesh",
             "postalCode": "530001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Kochi",
             "addressRegion": "Kerala",
             "postalCode": "682001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Guwahati",
             "addressRegion": "Assam",
             "postalCode": "781001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Bhubaneswar",
             "addressRegion": "Odisha",
             "postalCode": "751001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Dehradun",
             "addressRegion": "Uttarakhand",
             "postalCode": "248001",
             "addressCountry": "India"
           },
           {
             "@type": "PostalAddress",
             "addressLocality": "Raipur",
             "addressRegion": "Chhattisgarh",
             "postalCode": "492001",
             "addressCountry": "India"
           }
         ],
         "worksFor": {
           "@type": "Organization",
           "name": "LearnAndShare" 
         },
         "url": "https://learnandshare.vercel.app/",
         "sameAs": [
           "https://www.linkedin.com/in/sanjay-patidar-25b580292/",
           "https://github.com/hello-developer-sanjay",
           "https://www.instagram.com/sanjay_patidar_mcmxcviii/",
           "https://learnandshare.vercel.app/",
                      "https://learnandshare.vercel.app/certificate-verification",
           



         ]
   

       })}
     </script>


    </Helmet>	
      <Title>Certificate Verification</Title>
      {loading && (
        <LoadingMessage>
          <ClipLoader size={50} color={"#007BFF"} loading={loading} />
        </LoadingMessage>
      )}
      {!loading && uniqueId && certificate ? (
        <CertificateDetail>
          <p>Certificate for: {certificate.user.name}</p>
          <p>Category: {certificate.category}</p>
          <p>Date: {new Date(certificate.date).toLocaleDateString()}</p>
          <Button onClick={() => handleDownload(certificate)}>Download Certificate</Button>
        </CertificateDetail>
      ) : (
        !loading && <ErrorMessage>No certificate found for this unique ID</ErrorMessage>
      )}
      <Subtitle>Search Certificates</Subtitle>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="userName">User Name:</label>
        <Input type="text" id="userName" name="userName" placeholder="Enter User Name" value={searchCriteria.userName} onChange={handleChange} />

        <label htmlFor="uniqueId">Unique ID:</label>
        <Input type="text" id="uniqueId" name="uniqueId" placeholder="Enter Unique ID" value={searchCriteria.uniqueId} onChange={handleChange} />

        <label htmlFor="date">Date:</label>
        <Input type="date" id="date" name="date" value={searchCriteria.date} onChange={handleChange} />
        <Button type="submit">Search Certificates</Button>
      </Form>
      {loading && (
        <LoadingMessage>
          <ClipLoader size={50} color={"#007BFF"} loading={loading} />
        </LoadingMessage>
      )}
      {!loading && error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && certificates.length > 0 && (
        <CertificateList>
          {certificates.map(cert => (
            <CertificateItemWrapper key={cert._id}>
              {({ ref, inView }) => (
                <CertificateItem ref={ref} className={inView ? 'visible' : ''}>
                  <p>Certificate for: {cert.user.name}</p>
                  <p>Category: {cert.category}</p>
                  <p>Date: {new Date(cert.date).toLocaleDateString()}</p>
                  <Button onClick={() => handleDownload(cert)}>Download Certificate</Button>
                </CertificateItem>
              )}
            </CertificateItemWrapper>
          ))}
        </CertificateList>
      )}
      {!loading && certificates.length === 0 && !error && <ErrorMessage>No certificates found</ErrorMessage>}
    </Container>
  );
};

const CertificateItemWrapper = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return children({ ref, inView });
};

export default VerifyCertificate;
