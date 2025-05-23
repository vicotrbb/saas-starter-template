import { ReactElement } from 'react';

export enum EmailTemplate {
  Welcome = 'welcome',
  EmailVerification = 'email-verification',
  PasswordReset = 'password-reset',
  SubscriptionConfirmation = 'subscription-confirmation',
  PaymentReceipt = 'payment-receipt',
  SubscriptionCancelled = 'subscription-cancelled',
  OrganizationInvite = 'organization-invite',
  Custom = 'custom',
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template: EmailTemplate;
  data?: Record<string, unknown>;
  react?: ReactElement;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  attachments?: EmailAttachment[];
  tags?: EmailTag[];
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface EmailTag {
  name: string;
  value: string;
}

export interface EmailResponse {
  id: string;
  from: string;
  to: string | string[];
  created_at: string;
}

export interface EmailError {
  message: string;
  name: string;
}

export interface SendEmailResult {
  data?: EmailResponse;
  error?: EmailError;
}

export interface EmailData {
  [key: string]: unknown;
}

export interface WelcomeEmailData extends EmailData {
  firstName: string;
  organizationName?: string;
  loginUrl?: string;
}

export interface VerificationEmailData extends EmailData {
  firstName: string;
  verificationUrl: string;
}

export interface PasswordResetEmailData extends EmailData {
  firstName: string;
  resetUrl: string;
}

export interface SubscriptionConfirmationData extends EmailData {
  firstName: string;
  planName: string;
  amount: string;
  interval: 'month' | 'year';
  nextBillingDate: string;
}

export interface PaymentReceiptData extends EmailData {
  firstName: string;
  amount: string;
  paymentDate: string;
  receiptUrl: string;
  last4?: string;
}

export interface OrganizationInviteData extends EmailData {
  inviterName: string;
  organizationName: string;
  inviteUrl: string;
}
