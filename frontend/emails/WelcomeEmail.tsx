import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  username: string;
}

export const WelcomeEmail = ({
  username,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to DormParty!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to DormParty!</Heading>
          <Text style={text}>
            Hi {username},
          </Text>
          <Text style={text}>
            We're excited to have you join our community of college students. Get ready to connect with fellow students and make new friends!
          </Text>
          <Text style={text}>
            Best regards,<br />
            The DormParty Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#121212',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const text = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

export default WelcomeEmail; 