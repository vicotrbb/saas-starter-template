# 🚀 Vercel Deployment Guide - Minimal Setup

This guide shows how to deploy the SaaS template on Vercel **without needing all environment variables** upfront. You can deploy basic functionality first and add features incrementally.

## 📊 Environment Variables Priority

### 🟥 **Critical (Required for Basic Deployment)**

These are essential - the app won't start without them:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 🟨 **Important (Core Features)**

Add these for full authentication and admin features:

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 🟦 **Optional (Feature-Specific)**

Add these only when you need specific features:

#### Payment Features (Stripe)

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Email Features (Resend)

```bash
RESEND_API_KEY=re_your_resend_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Your App Name
```

#### AI Features (OpenAI)

```bash
OPENAI_API_KEY=sk-your_openai_key
```

#### Scheduled Tasks

```bash
CRON_SECRET_TOKEN=your_random_secret_token
```

## 🚀 Deployment Steps

### 1. **Set Up Supabase (Required)**

1. Create a free Supabase project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** in your Supabase dashboard
3. Copy your:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Anon/Public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 2. **Deploy to Vercel**

#### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo)

#### Option B: Manual Deploy

1. Push your code to GitHub/GitLab
2. Connect to Vercel
3. Add environment variables in Vercel dashboard

### 3. **Configure Environment Variables in Vercel**

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add the **Critical** variables first:

    ```text
    NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
    NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
    ```

4. Deploy and test basic functionality

### 4. **Test Basic Deployment**

After deployment with minimal variables, you should be able to:

- ✅ View the landing page
- ✅ Navigate to auth pages
- ✅ Basic UI components work
- ❌ Authentication may fail (needs database setup)
- ❌ Payment features won't work
- ❌ Email features won't work

## 🗄️ Database Setup

### Apply Database Migrations

1. Install Supabase CLI:

    ```bash
    npm install -g supabase
    ```

2. Login and link your project:

    ```bash
    supabase login
    supabase link --project-ref your-project-ref
    ```

3. Apply migrations (if any exist):

    ```bash
    supabase db push
    ```

4. Generate TypeScript types:

    ```bash
    supabase gen types typescript --project-id your-project-ref --schema public > src/types/database.types.ts
    ```

## 🔄 Incremental Feature Activation

### Add Authentication

1. Set up your database schema
2. Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel
3. Redeploy

### Add Payments

1. Create Stripe account
2. Add Stripe environment variables
3. Configure webhooks pointing to `https://your-app.vercel.app/api/stripe/webhooks`
4. Redeploy

### Add Email

1. Set up Resend account
2. Add email environment variables
3. Redeploy

## 🚨 Common Issues & Solutions

### App Won't Start

- **Cause**: Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Solution**: Add these critical variables and redeploy

### Authentication Errors

- **Cause**: Database not set up or wrong service role key
- **Solution**: Run database migrations and verify service role key

### Build Failures

- **Cause**: TypeScript errors due to missing database types
- **Solution**: Generate types from Supabase or add placeholder types

### 500 Errors in Production

- **Cause**: Missing environment variables for features you're trying to use
- **Solution**: Check Vercel function logs and add required variables

## 📝 Environment Variables Reference

Create a `.env.local` file for local development:

```bash
# Copy this template and fill in your values

# === CRITICAL (Required) ===
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# === IMPORTANT (Core Features) ===
SUPABASE_SERVICE_ROLE_KEY=

# === OPTIONAL (Feature-Specific) ===

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_FROM_NAME=
RESEND_REPLY_TO=

# OpenAI
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-2024-05-13
OPENAI_MAX_TOKENS=4096
OPENAI_TEMPERATURE=0.7

# Cron
CRON_SECRET_TOKEN=
```

## 🎯 Pro Tips

1. **Start Small**: Deploy with just Supabase variables first
2. **Test Incrementally**: Add one feature at a time
3. **Use Preview Deployments**: Test changes before going to production
4. **Monitor Logs**: Check Vercel function logs for missing variable errors
5. **Environment Parity**: Keep local `.env.local` in sync with Vercel settings

## 📞 Need Help?

- Check the main [README.md](./README.md) for detailed setup instructions
- Review Vercel deployment logs for specific errors
- Ensure your Supabase project is properly configured
- Test locally with the same environment variables before deploying
