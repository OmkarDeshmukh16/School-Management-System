import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Button, Typography, Container, Paper } from '@mui/material';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CampaignIcon from '@mui/icons-material/Campaign';

const Homepage = () => {
    return (
        <FullPageWrapper>
            {/* --- HERO SECTION --- */}
            <HeroSection container>
                <Grid item xs={12} md={6}>
                    <BrandingPanel>
                        <LogoImage src={logo} alt="Nexus Institutional Seal" />
                        <BrandingDecor>
                            <YearText>EST. 2026</YearText>
                            <MottoText>"Precision in Administration, Excellence in Education"</MottoText>
                        </BrandingDecor>
                    </BrandingPanel>
                </Grid>
                <Grid item xs={12} md={6}>
                    <EntryPanel>
                        <ContentWrapper>
                            <Typography variant="overline" sx={{ color: '#7d6b5d', letterSpacing: 3, fontWeight: 'bold' }}>
                                OM SaaS Solution
                            </Typography>
                            <MainTitle> School Management</MainTitle>
                            <HorizontalDivider />
                            <AbstractText>
                                A comprehensive digital ecosystem designed for institutional transparency.
                                From real-time **Fee Ledgers** to automated **Grievance Management**,
                                Nexus empowers administrators with data-driven precision.
                            </AbstractText>
                            <ActionGroup>
                                <Primary3DButton variant="contained" component={Link} to="/choose">
                                    Launch System Dashboard
                                </Primary3DButton>
                                <SecondaryGhostButton variant="outlined" component={Link} to="/Adminregister">
                                    Initialize New Registry
                                </SecondaryGhostButton>
                            </ActionGroup>

                        </ContentWrapper>
                    </EntryPanel>
                </Grid>
            </HeroSection>

            {/* --- FEATURE SHOWCASE (The Sales Cards) --- */}
            <FeatureSection>
                <Container maxWidth="lg">
                    <SectionHeaderBox>
                        <SectionTitle>Institutional Infrastructure</SectionTitle>
                        <TypographySubtitle>Advanced modules designed for administrative excellence</TypographySubtitle>
                    </SectionHeaderBox>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={3}>
                            <FeatureCard>
                                <IconCircle><AdminPanelSettingsIcon /></IconCircle>
                                <CardTitle>System Admin</CardTitle>
                                <CardText>Full oversight of Faculty, Students, and Class registries from one unified "Institutional Overview".</CardText>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FeatureCard>
                                <IconCircle><ReceiptLongIcon /></IconCircle>
                                <CardTitle>Financial Ledger</CardTitle>
                                <CardText>Real-time monitoring of Fee collections and individual payment statuses.</CardText>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FeatureCard>
                                <IconCircle><AssessmentIcon /></IconCircle>
                                <CardTitle>Academic Suite</CardTitle>
                                <CardText>Bulk marks entry for faculty and automated "Student Report" generation for students.</CardText>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FeatureCard>
                                <IconCircle><CampaignIcon /></IconCircle>
                                <CardTitle>Notice Board</CardTitle>
                                <CardText>Broadcast official notices and holiday alerts instantly across the "Bulletin Board".</CardText>
                            </FeatureCard>
                        </Grid>
                    </Grid>
                </Container>
            </FeatureSection>

            {/* --- PRICING TIER SECTION --- */}
            <PricingSection id="pricing">
                <Container maxWidth="lg">
                    <SectionHeaderBox>
                        <SectionTitle>Institutional Investment</SectionTitle>
                        <TypographySubtitle>Select a plan tailored to your institution's scale</TypographySubtitle>
                        <HorizontalDivider />
                    </SectionHeaderBox>

                    <Grid container spacing={4} justifyContent="center">
                        {[
                            {
                                tier: "Foundation",
                                price: "₹4,999",
                                period: "per month",
                                features: ["Up to 200 Scholars", "Attendance Registry", "Basic Notice Board", "Email Support"],
                                buttonText: "Buy Now",
                                highlight: false
                            },
                            {
                                tier: "Professional",
                                price: "₹9,999",
                                period: "per month",
                                features: ["Up to 1000 Scholars", "Financial Ledger", "Grievance Record", "Priority Support"],
                                buttonText: "Buy Now",
                                highlight: true
                            },
                            {
                                tier: "Enterprise",
                                price: "coming soon",
                                period: "Annual Billing",
                                features: ["Unlimited Scholars", "AI Documents Generator", "Custom Domain", "Dedicated Manager"],
                                buttonText: "Buy Now",
                                highlight: false
                            }
                        ].map((plan, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <PriceCard isHighlighted={plan.highlight}>
                                    {plan.highlight && <Ribbon>Most Selected</Ribbon>}
                                    <TierName>{plan.tier}</TierName>
                                    <PriceDisplay>
                                        <Currency>{plan.price}</Currency>
                                        <Period> / {plan.period}</Period>
                                    </PriceDisplay>
                                    <FeatureList>
                                        {plan.features.map((f, i) => (
                                            <FeatureItem key={i}>— {f}</FeatureItem>
                                        ))}
                                    </FeatureList>
                                    <PricingButton
                                        variant={plan.highlight ? "contained" : "outlined"}
                                        fullWidth
                                        isHighlighted={plan.highlight}
                                    >
                                        {plan.buttonText}
                                    </PricingButton>
                                </PriceCard>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </PricingSection>

            {/* --- PROFESSIONAL FOOTER --- */}
            <FooterSection>
                <Container maxWidth="lg">
                    <Grid container spacing={8}>
                        <Grid item xs={12} md={4}>
                            <FooterBrandText>SMART SCHOOL MGT </FooterBrandText>
                            <FooterDescription>
                                Developed by Omkar Deshmukh.
                                A high-performance MERN solutions for educational digital transformation in India.
                            </FooterDescription>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FooterHeading>Portals</FooterHeading>
                            <FooterLink to="/choose">Administrative Home</FooterLink>
                            <FooterLink to="/choose">Faculty Examination Registry</FooterLink>
                            <FooterLink to="/choose">Scholar Identity Portal</FooterLink>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FooterHeading>Corporate</FooterHeading>
                            <FooterInfoText>Inquiries: officialporas@gmail.com</FooterInfoText>
                            <FooterInfoText>Pune, Maharashtra</FooterInfoText>
                        </Grid>
                    </Grid>
                    <DividerLine />
                    <CopyrightText>© 2026 OmTech Solutions. All Rights Reserved.</CopyrightText>
                </Container>
            </FooterSection>
        </FullPageWrapper>
    );
};

export default Homepage;

// --- REFINED STYLES FOR SCROLLING & SaaS AESTHETIC ---

const FullPageWrapper = styled.div`
    background-color: #ffffff;
    width: 100%;
`;

const HeroSection = styled(Grid)`
    min-height: 100vh;
    display: flex;
    /* This ensures both children (md=6 items) take up the full height of the parent */
    align-items: stretch; 
    overflow: hidden;
    border-bottom: 2px solid #1a1a1a;
`;

const BrandingPanel = styled.div`
    background-color: #ffffff;
    /* Height: 100% is crucial here to fill the Grid item's stretched height */
    height: 86%; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px;
    
`;

const EntryPanel = styled.div`
    background-color: #fdfcf8;
    /* Height: 100% ensures the white background reaches the same bottom line */
    height: 100%; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
`;

const FeatureSection = styled.section`
    padding: 120px 0;
    background-color: #ffffff;
    border-top: 1px solid #e0dcd0;
`;

const FeatureCard = styled(Paper)`
    && {
        padding: 40px 30px;
        text-align: center;
        border-radius: 0;
        border: 1px solid #e0dcd0;
        box-shadow: 6px 6px 0px #e0dcd0;
        height: 100%;
        transition: all 0.3s ease;
        &:hover {
            transform: translateY(-10px);
            box-shadow: 12px 12px 0px #7d6b5d;
            border-color: #1a1a1a;
        }
    }
`;

const FooterSection = styled.footer`
    background-color: #0d0d0d;
    color: white;
    padding: 80px 0 40px 0;
`;

/* Icons and Decorative Elements */
const IconCircle = styled(Box)`
    width: 70px;
    height: 70px;
    background-color: #1a1a1a;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 25px auto;
`;


const FooterLink = styled(Link)`
    color: #7d6b5d;
    display: block;
    margin-bottom: 12px;
    text-decoration: none;
    font-family: serif;
    &:hover { color: white; text-decoration: underline; }
`;

const FooterBrandText = styled.h2`
    font-family: 'Georgia', serif;
    letter-spacing: 3px;
    margin-bottom: 20px;
`;

const FooterDescription = styled.p`
    color: #888;
    font-size: 0.9rem;
    line-height: 1.6;
    font-family: serif;
`;

const DividerLine = styled.div`
    height: 1px;
    background-color: #333;
    margin: 60px 0 30px 0;
`;

const CopyrightText = styled.p`
    text-align: center;
    color: #555;
    font-size: 0.8rem;
    letter-spacing: 1px;
`;
const SectionHeaderBox = styled(Box)`
    text-align: center;
    margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
    font-family: 'Georgia', serif;
    font-size: 2.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
`;

const TypographySubtitle = styled.p`
    font-family: 'serif';
    font-style: italic;
    color: #7d6b5d;
    margin-top: 10px;
`;

const LogoImage = styled.img`
    max-width: 70%;
    height: auto;
    margin-bottom: 30px;
`;

const BrandingDecor = styled.div`
    border-top: 1px solid #333;
    padding-top: 20px;
    text-align: center;
`;

const YearText = styled.p`
    color: #7d6b5d;
    letter-spacing: 5px;
    font-size: 0.8rem;
    margin: 0;
`;

const MottoText = styled.p`
    color: #7d6b5d;
    font-family: 'Georgia', serif;
    font-style: italic;
    opacity: 0.7;
`;

const MainTitle = styled.h1`
    font-family: 'Georgia', serif;
    font-size: 3.5rem;
    color: #1a1a1a;
    text-transform: uppercase;
    line-height: 1;
`;

const HorizontalDivider = styled.div`
    width: 60px;
    height: 4px;
    background-color: #1a1a1a;
    margin: 20px 0 40px 0;
`;

const AbstractText = styled.p`
    font-family: 'serif';
    font-size: 1.1rem;
    color: #444;
    line-height: 1.8;
    margin-bottom: 40px;
`;

const ActionGroup = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Primary3DButton = styled(Button)`
    && {
        background-color: #1a1a1a;
        color: white;
        padding: 16px;
        border-radius: 0;
        font-family: 'Georgia', serif;
        text-transform: uppercase;
        letter-spacing: 2px;
        box-shadow: 6px 6px 0px #7d6b5d;
        &:hover {
            background-color: #333;
            transform: translate(-2px, -2px);
            box-shadow: 8px 8px 0px #7d6b5d;
        }
    }
`;

const SecondaryGhostButton = styled(Button)`
    && {
        color: #1a1a1a;
        border: 1px solid #1a1a1a;
        padding: 16px;
        border-radius: 0;
        font-family: 'Georgia', serif;
        text-transform: uppercase;
        letter-spacing: 2px;
        &:hover {
            background-color: #f5f5f5;
        }
    }
`;

const ContentWrapper = styled.div`
    max-width: 500px;
    padding: 40px;
`;

const FooterHeading = styled.h4`
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 25px;
`;

const FooterInfoText = styled.p`
    color: #7d6b5d;
    font-family: serif;
    margin-bottom: 10px;
`;

const CardTitle = styled.h3`
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    font-size: 1.1rem;
    letter-spacing: 1px;
    margin-bottom: 15px;
`;

const CardText = styled.p`
    font-family: serif;
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
`;

const PricingSection = styled.section`
    padding: 200px 0;
    background-color: #fdfcf8; /* Light paper color */
    border-top: 1px solid #e0dcd0;
`;

const PriceCard = styled(Paper)`
    && {
        padding: 50px 30px;
        border-radius: 0;
        border: 1px solid ${props => props.isHighlighted ? '#1a1a1a' : '#e0dcd0'};
        background-color: white;
        box-shadow: ${props => props.isHighlighted ? '12px 12px 0px #7d6b5d' : '6px 6px 0px #e0dcd0'};
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        transition: all 0.3s ease;
        &:hover {
            transform: scale(1.02);
        }
    }
`;

const TierName = styled.h3`
    font-family: 'Georgia', serif;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0 0 20px 0;
`;

const PriceDisplay = styled(Box)`
    margin-bottom: 30px;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
`;

const Currency = styled.span`
    font-family: 'Georgia', serif;
    font-size: 2.5rem;
    font-weight: bold;
    color: #1a1a1a;
`;

const Period = styled.span`
    font-family: serif;
    font-style: italic;
    color: #7d6b5d;
`;

const FeatureList = styled.div`
    flex-grow: 1;
    margin-bottom: 40px;
`;

const FeatureItem = styled.p`
    font-family: serif;
    font-size: 1rem;
    color: #444;
    margin: 10px 0;
`;

const PricingButton = styled(Button)`
    && {
        background-color: ${props => props.isHighlighted ? '#1a1a1a' : 'transparent'};
        color: ${props => props.isHighlighted ? 'white' : '#1a1a1a'};
        border: 1px solid #1a1a1a;
        padding: 15px;
        border-radius: 0;
        font-family: 'Georgia', serif;
        text-transform: uppercase;
        letter-spacing: 2px;
        &:hover {
            background-color: #333;
            color: white;
        }
    }
`;

const Ribbon = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    background-color: #7d6b5d;
    color: white;
    padding: 5px 15px;
    font-family: serif;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
`;