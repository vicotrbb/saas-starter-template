import { Resend } from 'resend';
import { EmailTemplate, type EmailOptions, type SendEmailResult } from './types';
import { getEmailTemplate } from './templates';
import logger from '@/lib/api/logger';

export const resend = (process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null)!;

const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@example.com';
const DEFAULT_FROM_NAME = process.env.RESEND_FROM_NAME || 'SaaS Platform';
const DEFAULT_REPLY_TO = process.env.RESEND_REPLY_TO || process.env.RESEND_FROM_EMAIL;

export type { EmailOptions, SendEmailResult, EmailTemplate } from './types';
export type {
  WelcomeEmailData,
  VerificationEmailData,
  PasswordResetEmailData,
  SubscriptionConfirmationData,
  PaymentReceiptData,
  OrganizationInviteData,
} from './types';

/**
 * Send an email using Resend
 *
 * @param options - Email options including recipient, subject, template, and data
 * @returns Promise with the result containing either data or error
 *
 * @example
 * ```typescript
 * // Send a welcome email
 * const result = await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome to our platform!',
 *   template: 'welcome',
 *   data: {
 *     firstName: 'John',
 *     organizationName: 'Acme Corp'
 *   }
 * });
 *
 * if (result.error) {
 *   console.error('Failed to send email:', result.error);
 * } else {
 *   console.log('Email sent successfully:', result.data?.id);
 * }
 * ```
 */
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  try {
    const {
      to,
      subject,
      template,
      data = {},
      cc,
      bcc,
      replyTo = DEFAULT_REPLY_TO,
      attachments,
      tags,
    } = options;
    let { react } = options;

    if (!to || !subject) {
      throw new Error('Email recipient (to) and subject are required');
    }

    if (template !== EmailTemplate.Custom) {
      react = getEmailTemplate(template, data);
    } else if (!react) {
      throw new Error('Custom emails must provide an email template');
    }

    const response = await resend.emails.send({
      from: `${DEFAULT_FROM_NAME} <${DEFAULT_FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      replyTo: replyTo ? (Array.isArray(replyTo) ? replyTo : [replyTo]) : undefined,
      attachments,
      tags,
      react,
    });

    if (response.error) {
      logger.error('Resend API error:', response.error);
      return {
        error: {
          name: 'ResendError',
          message: response.error.message || 'Failed to send email',
        },
      };
    }

    logger.info('Email sent successfully:', {
      id: response.data?.id,
      to,
      subject,
      template,
    });

    return {
      data: {
        id: response.data?.id || '',
        from: `${DEFAULT_FROM_NAME} <${DEFAULT_FROM_EMAIL}>`,
        to,
        created_at: new Date().toISOString(),
      },
    };
  } catch (error) {
    logger.error('Error sending email:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorName = error instanceof Error ? error.name : 'UnknownError';

    return {
      error: {
        name: errorName,
        message: errorMessage,
      },
    };
  }
}
