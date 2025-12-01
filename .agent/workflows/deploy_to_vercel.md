---
description: How to deploy the CRM application to Vercel
---

# Deploying to Vercel

Since the project is already set up with Vercel, you have two main ways to deploy your changes:

## Option 1: Using Vercel CLI (Recommended for manual updates)

If you have the Vercel CLI installed, this is the fastest way to deploy.

1.  Open your terminal in the project directory.
2.  Run the deployment command:
    ```bash
    vercel --prod
    ```
3.  Follow the prompts if asked (usually just press Enter).
4.  Wait for the build to complete. It will provide a URL to the live site.

## Option 2: Using Git (Automatic)

If your project is connected to a GitHub/GitLab/Bitbucket repository linked to Vercel:

1.  Stage your changes:
    ```bash
    git add .
    ```
2.  Commit your changes:
    ```bash
    git commit -m "Update inventory and opportunity features"
    ```
3.  Push to the main branch:
    ```bash
    git push origin main
    ```
4.  Vercel will automatically detect the push and start a new deployment. You can check the status in your Vercel dashboard.

## Important Note on Environment Variables

If you added new environment variables (like `VITE_GEMINI_API_KEY`), make sure they are also added to the **Vercel Project Settings**:

1.  Go to your Vercel Dashboard.
2.  Select the project.
3.  Go to **Settings** > **Environment Variables**.
4.  Add `VITE_GEMINI_API_KEY` with your new key value.
5.  **Redeploy** (using either method above) for the new variable to take effect.
