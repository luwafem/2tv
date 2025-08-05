# GitHub Setup Instructions

Since password authentication is no longer supported, you need to use a Personal Access Token (PAT) to push to GitHub.

## Method 1: Using Personal Access Token

### Step 1: Create a Personal Access Token
1. Go to GitHub.com and log in
2. Click your profile picture → Settings
3. Scroll down and click "Developer settings"
4. Click "Personal access tokens" → "Tokens (classic)"
5. Click "Generate new token" → "Generate new token (classic)"
6. Give it a name like "2tv-project"
7. Select expiration (recommend 90 days)
8. Check these scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
9. Click "Generate token"
10. **COPY THE TOKEN IMMEDIATELY** (you won't see it again)

### Step 2: Push to GitHub
```bash
# Remove the existing remote (if any)
git remote remove origin

# Add the remote with your token
git remote add origin https://YOUR_TOKEN@github.com/luwafem/2tv.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_TOKEN` with the token you copied.

## Method 2: Using GitHub CLI (Easier)

### Step 1: Install GitHub CLI
```bash
# On macOS
brew install gh

# On Windows (with Chocolatey)
choco install gh

# On Ubuntu/Debian
sudo apt install gh
```

### Step 2: Authenticate and Push
```bash
# Authenticate with GitHub
gh auth login

# Push to GitHub
git push -u origin main
```

## Method 3: Create Repository Manually

1. Go to GitHub.com
2. Click "New repository"
3. Name it "2tv"
4. Make it private
5. Don't initialize with README (we already have one)
6. Click "Create repository"
7. Follow the instructions for "push an existing repository"

Choose whichever method works best for you!
