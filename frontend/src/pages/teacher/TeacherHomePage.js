import { Container, Grid, Paper, Box, Typography } from '@mui/material';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import styled from 'styled-components';
import Students from "../../assets/img1.png";
import Lessons from "../../assets/subjects.svg";
import Tests from "../../assets/assignment.svg";

import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const TeacherHomePage = () => {
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);

    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;
    const teachSubject = currentUser.teachSubject;

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    const numberOfStudents = sclassStudents ? sclassStudents.length : 0;
    const numberOfSessions = subjectDetails ? subjectDetails.sessions : 0;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <WelcomeHeader>
                <TypographyClassic variant="h4">Faculty Overview</TypographyClassic>
                <TypographySubtitle>Academic progress and class metrics for the current term</TypographySubtitle>
            </WelcomeHeader>

            <Grid container spacing={4}>
                {/* Metric Cards */}
                {[
                    { title: "Class Students", value: numberOfStudents, img: Students },
                    { title: "Total Lectures", value: numberOfSessions, img: Lessons },
                    { title: "Assigned Subject", value: teachSubject?.subName || "Not Assigned", img: Tests, isText: true },
                ].map((item, index) => (
                    <Grid item xs={12} md={3} key={index}>
                        <Classic3DCard>
                            <IconBox>
                                <img src={item.img} alt={item.title} style={{ width: '50px', height: '50px' }} />
                            </IconBox>
                            <ContentBox>
                                <MetricTitle>{item.title}</MetricTitle>
                                {item.isText ? (
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontFamily: 'Georgia',
                                            fontWeight: 'bold',
                                            color: '#1a1a1a',
                                            mt: 1
                                        }}
                                    >
                                        {item.value}
                                    </Typography>
                                ) : (
                                    <MetricData
                                        start={0}
                                        end={item.value}
                                        duration={2.5}
                                        suffix={item.suffix || ""}
                                    />
                                )}
                            </ContentBox>
                        </Classic3DCard>
                    </Grid>
                ))}

                {/* Notice Section */}
                <Grid item xs={12}>
                    <NoticePaper elevation={0}>
                        <SectionTitle>Departmental Notices</SectionTitle>
                        <SeeNotice />
                    </NoticePaper>
                </Grid>
            </Grid>
        </Container>
    );
};

// --- CLASSIC 3D STYLED COMPONENTS ---

const WelcomeHeader = styled(Box)`
    margin-bottom: 40px;
    border-left: 4px solid #1a1a1a;
    padding-left: 20px;
`;

const TypographyClassic = styled.h2`
    font-family: 'Georgia', serif;
    font-size: 2.2rem;
    color: #1a1a1a;
    margin: 0;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 1px;
`;

const TypographySubtitle = styled.p`
    font-family: 'serif';
    font-style: italic;
    color: #7d6b5d;
    margin: 5px 0 0 0;
`;

const Classic3DCard = styled(Paper)`
    && {
        padding: 24px;
        display: flex;
        flex-direction: column;
        height: 220px;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 0;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        position: relative;
        transition: all 0.3s ease;
        box-shadow: 6px 6px 0px #e0dcd0; /* Tactical Classic Shadow */

        &:hover {
            transform: translate(-3px, -3px);
            box-shadow: 10px 10px 0px #7d6b5d;
            border-color: #1a1a1a;
        }
    }
`;

const IconBox = styled(Box)`
    margin-bottom: 15px;
    filter: grayscale(1) opacity(0.7); /* Desaturated editorial look */
`;

const ContentBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const MetricTitle = styled.p`
    font-family: serif;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 0.8rem;
    color: #7d6b5d;
    font-weight: 700;
    margin: 0;
`;

const MetricData = styled(CountUp)`
    font-family: 'Georgia', serif;
    font-size: 2.5rem;
    font-weight: 400;
    color: #1a1a1a;
`;

const NoticePaper = styled(Paper)`
    && {
        padding: 40px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
        box-shadow: 6px 6px 0px #e0dcd0;
    }
`;

const SectionTitle = styled.h3`
    font-family: 'Georgia', serif;
    font-size: 1.5rem;
    margin-bottom: 25px;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
`;

export default TeacherHomePage;