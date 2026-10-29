# CI/CD Setup Guide for SoloMedia

This guide will help you set up automated deployments using GitHub Actions to your Oracle Cloud VMs.

## Overview

The CI/CD pipeline will automatically deploy your code to Oracle Cloud VMs whenever you push to the `master` branch:

- **Backend Repository**: Deploys to backend VM (84.12.90.85)
- **Frontend Repository**: Deploys to frontend VM (84.12.90.176)

## Prerequisites

- GitHub repositories for backend and frontend
- SSH access to both Oracle Cloud VMs
- Docker installed on both VMs
- Git installed on both VMs

## Step 1: Generate SSH Key for GitHub Actions

You need to create an SSH key pair that GitHub Actions will use to connect to your VMs.

### On Your Local Machine:

```bash
# Generate a new SSH key pair
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key

# This will create:
# - Private key: ~/.ssh/github_actions_key
# - Public key: ~/.ssh/github_actions_key.pub
```

**Note:** If you're on Windows, use Git Bash or PowerShell.

## Step 2: Add Public Key to Both VMs

### For Backend VM (84.12.90.85):

```bash
# Copy your public key content
cat ~/.ssh/github_actions_key.pub
```

SSH into the backend VM:
```bash
ssh ubuntu@84.12.90.85
```

Add the public key to authorized_keys:
```bash
mkdir -p ~/.ssh
echo "<YOUR_PUBLIC_KEY_CONTENT>" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### For Frontend VM (84.12.90.176):

```bash
ssh ubuntu@84.12.90.176
```

Add the same public key:
```bash
mkdir -p ~/.ssh
echo "<YOUR_PUBLIC_KEY_CONTENT>" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## Step 3: Add Secrets to GitHub Repositories

### Backend Repository Secrets

Go to: https://github.com/solomedia-account/solomedia-backend/settings/secrets/actions

Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `BACKEND_VM_HOST` | `84.12.90.85` | Backend VM public IP |
| `SSH_USER` | `ubuntu` | SSH username |
| `SSH_PORT` | `22` | SSH port (default 22) |
| `SSH_PRIVATE_KEY` | `<private key content>` | Content of `~/.ssh/github_actions_key` |

**To add SSH_PRIVATE_KEY:**
```bash
# On your local machine
cat ~/.ssh/github_actions_key
```
Copy the entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) and paste it as the secret value.

### Frontend Repository Secrets

Go to: https://github.com/solomedia-account/solomedia-frontend/settings/secrets/actions

Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `FRONTEND_VM_HOST` | `84.12.90.176` | Frontend VM public IP |
| `SSH_USER` | `ubuntu` | SSH username |
| `SSH_PORT` | `22` | SSH port (default 22) |
| `SSH_PRIVATE_KEY` | `<private key content>` | Same private key as backend |
| `NEXT_PUBLIC_API_URL` | `http://84.12.90.85:5000/api` | Backend API URL |

## Step 4: Push Workflow Files to GitHub

The workflow files have been created in:
- `backend/.github/workflows/deploy.yml`
- `frontend/.github/workflows/deploy.yml`

### Push Backend Workflow:

```bash
cd backend
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions CI/CD workflow for backend"
git push
```

### Push Frontend Workflow:

```bash
cd frontend
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions CI/CD workflow for frontend"
git push
```

## Step 5: Verify VMs Have Git and Docker

Both VMs should already have these installed, but verify:

### On Backend VM:
```bash
ssh ubuntu@84.12.90.85

# Check Docker
docker --version

# Check Git
git --version

# If git is not installed:
sudo apt update
sudo apt install -y git
```

### On Frontend VM:
```bash
ssh ubuntu@84.12.90.176

# Check Docker
docker --version

# Check Git
git --version

# If git is not installed:
sudo apt update
sudo apt install -y git
```

## Step 6: Test the Pipeline

### Test Backend Deployment:

1. Make a small change to the backend code (e.g., add a comment)
2. Commit and push to master:
   ```bash
   git add .
   git commit -m "Test CI/CD deployment"
   git push
   ```
3. Go to GitHub Actions tab: https://github.com/solomedia-account/solomedia-backend/actions
4. Watch the workflow run
5. Check if deployment succeeds

### Test Frontend Deployment:

1. Make a small change to the frontend code
2. Commit and push to master
3. Go to GitHub Actions tab: https://github.com/solomedia-account/solomedia-frontend/actions
4. Watch the workflow run
5. Check if deployment succeeds

## Step 7: Manual Deployment (Optional)

You can also trigger deployments manually without pushing code:

1. Go to the Actions tab in GitHub
2. Select the "Deploy Backend" or "Deploy Frontend" workflow
3. Click "Run workflow"
4. Select the `master` branch
5. Click "Run workflow"

## How It Works

### Backend Workflow:
1. Triggers on push to `master` branch
2. SSHs into backend VM using the provided SSH key
3. Pulls latest code from GitHub
4. Stops and removes old container
5. Builds new Docker image
6. Runs new container with environment variables from `.env`
7. Performs health check
8. Reports success/failure

### Frontend Workflow:
1. Triggers on push to `master` branch
2. SSHs into frontend VM using the provided SSH key
3. Pulls latest code from GitHub
4. Stops and removes old container
5. Builds new Docker image with `NEXT_PUBLIC_API_URL` build argument
6. Runs new container
7. Performs health check
8. Reports success/failure

## Important Notes

### Environment Variables

**Backend:**
- The workflow uses the existing `.env` file on the VM
- Make sure `.env` is properly configured on the backend VM
- Never commit `.env` to GitHub

**Frontend:**
- The `NEXT_PUBLIC_API_URL` is passed as a GitHub Secret
- This ensures the API URL is correctly set during build

### Docker Space Management

The workflow includes commands to remove old images to free up disk space:
```bash
docker rmi solomedia-backend || true
docker rmi solomedia-frontend || true
```

Oracle Free Tier VMs have limited disk space, so this is important.

### Rollback

If a deployment fails:
1. Check the GitHub Actions logs for errors
2. SSH into the VM manually
3. Check Docker logs: `docker logs <container-name>`
4. Restart the previous container if needed:
   ```bash
   docker restart <container-name>
   ```

## Troubleshooting

### SSH Connection Failed

**Error:** `Permission denied (publickey)`

**Solution:**
1. Verify the SSH_PRIVATE_KEY secret is correct
2. Ensure the public key was added to `~/.ssh/authorized_keys` on the VM
3. Check the SSH permissions on the VM:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

### Docker Build Failed

**Error:** Build fails during `docker build`

**Solution:**
1. SSH into the VM
2. Check Docker is running: `sudo systemctl status docker`
3. Check available disk space: `df -h`
4. Manually run the build command to see detailed error logs

### Container Won't Start

**Error:** Container exits immediately

**Solution:**
1. Check container logs: `docker logs <container-name>`
2. Verify `.env` file exists and has correct values
3. Check if port is already in use: `sudo netstat -tulpn | grep :5000` or `:3000`

### Health Check Failed

**Error:** `curl -f http://localhost:5000/health` fails

**Solution:**
1. Check if backend is running: `docker ps`
2. Check if database is connected: `docker logs solomedia-backend`
3. Test manually: `curl http://localhost:5000/health`

### Workflow Not Triggering

**Error:** Push doesn't trigger workflow

**Solution:**
1. Verify workflow file is in `.github/workflows/` directory
2. Check the branch name is `master` (not `main`)
3. Ensure the workflow YAML syntax is correct
4. Check GitHub Actions settings are enabled for the repository

## Security Best Practices

1. **Rotate SSH Keys:** Regularly rotate your SSH keys (every 3-6 months)
2. **Use Separate Keys:** Use different SSH keys for different environments
3. **Limit Permissions:** GitHub Actions only needs deployment permissions
4. **Monitor Logs:** Regularly review GitHub Actions logs for suspicious activity
5. **Secrets Management:** Never commit secrets to the repository
6. **VM Security:** Keep VMs updated with security patches

## Advanced Configurations

### Deploy on Specific Branches

To deploy on different branches, modify the workflow:

```yaml
on:
  push:
    branches: [master, staging, production]
```

### Add Slack Notifications

Add a step to notify your team on deployment:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment to production completed'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Run Tests Before Deployment

Add a test job before deployment:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    # ... deployment steps
```

## Support

If you encounter issues:
1. Check GitHub Actions documentation: https://docs.github.com/en/actions
2. Review workflow logs in GitHub Actions tab
3. Check Docker and SSH logs on the VMs
4. Verify all secrets are correctly configured

## Summary

Your CI/CD pipeline is now set up to:
- ✅ Automatically deploy on push to master
- ✅ Support manual deployment triggers
- ✅ Build and deploy Docker containers
- ✅ Perform health checks
- ✅ Report deployment status

Any changes you push to the `master` branch will be automatically deployed to your Oracle Cloud VMs!
