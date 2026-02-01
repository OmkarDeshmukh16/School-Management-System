import { Container, Grid, Paper, Box } from '@mui/material';
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import axios from 'axios';
import { useState } from 'react';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector(state => state.user);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList ? studentsList.length : 0;
    const numberOfClasses = sclassesList ? sclassesList.length : 0;
    const numberOfTeachers = teachersList ? teachersList.length : 0;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <WelcomeHeader>
                <TypographyClassic variant="h4">Institutional Overview</TypographyClassic>
                <TypographySubtitle>Academic year summary and metrics</TypographySubtitle>
            </WelcomeHeader>

            <Grid container spacing={4}>
                {/* Metric Cards */}
                {[
                    { title: "Total Students", value: numberOfStudents, img: Students },
                    { title: "Total Classes", value: numberOfClasses, img: Classes },
                    { title: "Total Teachers", value: numberOfTeachers, img: Teachers },
                    
                ].map((item, index) => (
                    <Grid item xs={12} md={3} key={index}>
                        <Classic3DCard>
                            <IconBox>
                                <img src={item.img} alt={item.title} style={{ width: '50px' }} />
                            </IconBox>
                            <ContentBox>
                                <MetricTitle>{item.title}</MetricTitle>
                                <MetricData
                                    start={0}
                                    end={item.value}
                                    duration={2}
                                    prefix={item.prefix || ""}
                                />
                            </ContentBox>
                        </Classic3DCard>
                    </Grid>
                ))}

                {/* Notice Section */}
                <Grid item xs={12}>
                    <NoticePaper elevation={0}>
                        <SectionTitle>Institutional Notices</SectionTitle>
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
`;

const TypographySubtitle = styled.p`
    font-family: 'serif';
    font-style: italic;
    color: #666;
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
        box-shadow: 6px 6px 0px #e0dcd0; /* The "Classic 3D" shadow */

        &:hover {
            transform: translate(-3px, -3px);
            box-shadow: 10px 10px 0px #7d6b5d;
            border-color: #1a1a1a;
        }
    }
`;

const IconBox = styled(Box)`
    margin-bottom: 15px;
    filter: grayscale(1) opacity(0.8); /* Classic editorial look for icons */
`;

const ContentBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const MetricTitle = styled.p`
    font-family: 'serif';
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 0.85rem;
    color: #7d6b5d;
    font-weight: 700;
    margin: 0;
`;

const MetricData = styled(CountUp)`
    font-family: 'Charter', 'Georgia', serif;
    font-size: 2.5rem;
    font-weight: 400;
    color: #1a1a1a;
`;

const NoticePaper = styled(Paper)`
    && {
        padding: 30px;
        background-color: #ffffff;
        border: 1px solid #e0dcd0;
        border-radius: 0;
    }
`;

const SectionTitle = styled.h3`
    font-family: 'Georgia', serif;
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #1a1a1a;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
`;

export default AdminHomePage;