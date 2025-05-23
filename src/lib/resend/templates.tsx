import * as React from 'react';
import type {
  WelcomeEmailData,
  VerificationEmailData,
  PasswordResetEmailData,
  SubscriptionConfirmationData,
  PaymentReceiptData,
  OrganizationInviteData,
  EmailData,
} from './types';

const styles = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f9fafb',
    padding: '40px 20px',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '24px',
    marginTop: '0',
  },
  text: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4b5563',
    marginBottom: '16px',
  },
  button: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    marginTop: '16px',
    marginBottom: '16px',
  },
  footer: {
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#6b7280',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'underline',
  },
};

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailData>> = ({
  firstName,
  organizationName,
  loginUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}) => (
  <div style={styles.container}>
    <div style={styles.content}>
      <h1 style={styles.heading}>
        Welcome to {organizationName || 'Our Platform'}, {firstName}!
      </h1>
      <p style={styles.text}>
        We&apos;re excited to have you on board. Your account has been successfully created and
        you&apos;re ready to get started.
      </p>
      <p style={styles.text}>With your new account, you can:</p>
      <ul style={{ ...styles.text, paddingLeft: '20px' }}>
        <li>Access your personalized dashboard</li>
        <li>Manage your organization settings</li>
        <li>Invite team members</li>
        <li>Start using our premium features</li>
      </ul>
      <a href={loginUrl} style={styles.button}>
        Go to Dashboard
      </a>
      <div style={styles.footer}>
        <p>
          If you have any questions, feel free to reply to this email or visit our support center.
        </p>
        <p>
          Best regards,
          <br />
          The Team
        </p>
      </div>
    </div>
  </div>
);

export const VerificationEmail: React.FC<Readonly<VerificationEmailData>> = ({
  firstName,
  verificationUrl,
}) => (
  <div style={styles.container}>
    <div style={styles.content}>
      <h1 style={styles.heading}>Verify your email address</h1>
      <p style={styles.text}>Hi {firstName},</p>
      <p style={styles.text}>
        Thanks for signing up! Please verify your email address by clicking the button below:
      </p>
      <a href={verificationUrl} style={styles.button}>
        Verify Email Address
      </a>
      <p style={styles.text}>Or copy and paste this link into your browser:</p>
      <p style={{ ...styles.text, wordBreak: 'break-all', color: '#3b82f6' }}>{verificationUrl}</p>
      <div style={styles.footer}>
        <p>
          This link will expire in 24 hours. If you didn&apos;t create an account, you can safely
          ignore this email.
        </p>
      </div>
    </div>
  </div>
);

export const PasswordResetEmail: React.FC<Readonly<PasswordResetEmailData>> = ({
  firstName,
  resetUrl,
}) => (
  <div style={styles.container}>
    <div style={styles.content}>
      <h1 style={styles.heading}>Reset your password</h1>
      <p style={styles.text}>Hi {firstName},</p>
      <p style={styles.text}>
        We received a request to reset your password. Click the button below to create a new
        password:
      </p>
      <a href={resetUrl} style={styles.button}>
        Reset Password
      </a>
      <p style={styles.text}>Or copy and paste this link into your browser:</p>
      <p style={{ ...styles.text, wordBreak: 'break-all', color: '#3b82f6' }}>{resetUrl}</p>
      <div style={styles.footer}>
        <p>
          This link will expire in 1 hour. If you didn&apos;t request a password reset, you can
          safely ignore this email.
        </p>
        <p>
          For security reasons, we recommend changing your password if you didn&apos;t make this
          request.
        </p>
      </div>
    </div>
  </div>
);

export const SubscriptionConfirmationEmail: React.FC<Readonly<SubscriptionConfirmationData>> = ({
  firstName,
  planName,
  amount,
  interval,
  nextBillingDate,
}) => (
  <div style={styles.container}>
    <div style={styles.content}>
      <h1 style={styles.heading}>Subscription Confirmed</h1>
      <p style={styles.text}>Hi {firstName},</p>
      <p style={styles.text}>
        Thank you for subscribing to our {planName} plan! Your subscription is now active.
      </p>
      <div
        style={{
          backgroundColor: '#f3f4f6',
          padding: '20px',
          borderRadius: '6px',
          marginTop: '24px',
          marginBottom: '24px',
        }}
      >
        <p style={{ ...styles.text, marginBottom: '8px' }}>
          <strong>Plan:</strong> {planName}
        </p>
        <p style={{ ...styles.text, marginBottom: '8px' }}>
          <strong>Amount:</strong> {amount}/{interval}
        </p>
        <p style={{ ...styles.text, marginBottom: '0' }}>
          <strong>Next billing date:</strong> {nextBillingDate}
        </p>
      </div>
      <p style={styles.text}>
        You can manage your subscription anytime from your account dashboard.
      </p>
      <a href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`} style={styles.button}>
        Manage Subscription
      </a>
      <div style={styles.footer}>
        <p>Thank you for choosing us!</p>
      </div>
    </div>
  </div>
);

export const PaymentReceiptEmail: React.FC<Readonly<PaymentReceiptData>> = ({
  firstName,
  amount,
  paymentDate,
  receiptUrl,
  last4,
}) => (
  <div style={styles.container}>
    <div style={styles.content}>
      <h1 style={styles.heading}>Payment Receipt</h1>
      <p style={styles.text}>Hi {firstName},</p>
      <p style={styles.text}>
        This email confirms that we&apos;ve received your payment. Thank you!
      </p>
      <div
        style={{
          backgroundColor: '#f3f4f6',
          padding: '20px',
          borderRadius: '6px',
          marginTop: '24px',
          marginBottom: '24px',
        }}
      >
        <p style={{ ...styles.text, marginBottom: '8px' }}>
          <strong>Amount paid:</strong> {amount}
        </p>
        <p style={{ ...styles.text, marginBottom: '8px' }}>
          <strong>Date:</strong> {paymentDate}
        </p>
        {last4 && (
          <p style={{ ...styles.text, marginBottom: '0' }}>
            <strong>Payment method:</strong> Card ending in {last4}
          </p>
        )}
      </div>
      <a href={receiptUrl} style={styles.button}>
        View Receipt
      </a>
      <div style={styles.footer}>
        <p>Keep this receipt for your records. A copy has also been saved to your account.</p>
      </div>
    </div>
  </div>
);

export const OrganizationInviteEmail: React.FC<Readonly<OrganizationInviteData>> = ({
  inviterName,
  organizationName,
  inviteUrl,
}) => (
  <div style={styles.container}>
    <div style={styles.content}>
      <h1 style={styles.heading}>You&apos;re invited to join {organizationName}</h1>
      <p style={styles.text}>
        {inviterName} has invited you to join their organization on our platform.
      </p>
      <p style={styles.text}>
        By accepting this invitation, you&apos;ll be able to collaborate with your team and access
        shared resources.
      </p>
      <a href={inviteUrl} style={styles.button}>
        Accept Invitation
      </a>
      <p style={styles.text}>Or copy and paste this link into your browser:</p>
      <p style={{ ...styles.text, wordBreak: 'break-all', color: '#3b82f6' }}>{inviteUrl}</p>
      <div style={styles.footer}>
        <p>
          This invitation will expire in 7 days. If you don&apos;t want to join this organization,
          you can safely ignore this email.
        </p>
      </div>
    </div>
  </div>
);

export function getEmailTemplate(template: string, data: EmailData) {
  switch (template) {
    case 'welcome':
      return <WelcomeEmail {...(data as WelcomeEmailData)} />;
    case 'email-verification':
      return <VerificationEmail {...(data as VerificationEmailData)} />;
    case 'password-reset':
      return <PasswordResetEmail {...(data as PasswordResetEmailData)} />;
    case 'subscription-confirmation':
      return <SubscriptionConfirmationEmail {...(data as SubscriptionConfirmationData)} />;
    case 'payment-receipt':
      return <PaymentReceiptEmail {...(data as PaymentReceiptData)} />;
    case 'organization-invite':
      return <OrganizationInviteEmail {...(data as OrganizationInviteData)} />;
    default:
      throw new Error(`Unknown email template: ${template}`);
  }
}
