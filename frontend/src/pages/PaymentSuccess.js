import React from 'react';

const PaymentSuccess = () => {
    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                {/* Checkmark */}
                <div style={styles.iconCircle}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ display: 'block' }}>
                        <circle cx="24" cy="24" r="24" fill="#2e7d32" />
                        <path d="M14 25L21 32L34 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h1 style={styles.title}>Payment Successful</h1>
                <p style={styles.subtitle}>
                    Thank you for your payment! Your school onboarding is now being processed.
                </p>

                <div style={styles.divider} />

                <p style={styles.info}>
                    Our team will set up your school account and send you the login credentials shortly.
                    If you have any questions, feel free to contact us.
                </p>

                <a href="/" style={styles.button}>
                    Back to Home
                </a>
            </div>

            {/* Footer */}
            <p style={styles.footer}>
                © {new Date().getFullYear()} OM SaaS Platform · School Management System
            </p>
        </div>
    );
};

export default PaymentSuccess;

const styles = {
    wrapper: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f3ee',
        fontFamily: "'Georgia', serif",
        padding: '40px 20px',
    },
    card: {
        background: '#ffffff',
        border: '1px solid #e0dcd0',
        boxShadow: '4px 4px 0px #e0dcd0',
        maxWidth: '500px',
        width: '100%',
        padding: '50px 40px',
        textAlign: 'center',
    },
    iconCircle: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    title: {
        fontSize: '1.6rem',
        color: '#1a1a1a',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: 400,
        margin: '0 0 12px 0',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#555',
        lineHeight: 1.6,
        margin: '0 0 24px 0',
    },
    divider: {
        width: '60px',
        height: '2px',
        background: '#1a1a1a',
        margin: '0 auto 24px auto',
    },
    info: {
        fontSize: '0.9rem',
        color: '#7d6b5d',
        fontStyle: 'italic',
        lineHeight: 1.6,
        margin: '0 0 30px 0',
    },
    button: {
        display: 'inline-block',
        background: '#1a1a1a',
        color: '#ffffff',
        padding: '12px 36px',
        textDecoration: 'none',
        fontSize: '0.85rem',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontFamily: "'Georgia', serif",
        transition: 'background 0.2s',
    },
    footer: {
        marginTop: '30px',
        fontSize: '0.75rem',
        color: '#999',
    },
};
