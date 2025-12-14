# PowerShell Script: Setup New GitHub Repository (Option C)
# Run this after creating your GitHub repository

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

Write-Host "🚀 Setting up new repository..." -ForegroundColor Green
Write-Host ""

# Check if URL is valid
if (-not $RepoUrl -or -not $RepoUrl.StartsWith("https://github.com/")) {
    Write-Host "❌ Error: Invalid GitHub repository URL" -ForegroundColor Red
    Write-Host "Expected format: https://github.com/YOUR_USERNAME/REPO_NAME.git" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Current remote:" -ForegroundColor Cyan
git remote -v
Write-Host ""

Write-Host "🔄 Updating remote to: $RepoUrl" -ForegroundColor Yellow
git remote set-url origin $RepoUrl

Write-Host ""
Write-Host "✅ Remote updated!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 New remote:" -ForegroundColor Cyan
git remote -v
Write-Host ""

Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Switch to main branch: git checkout main" -ForegroundColor White
Write-Host "2. Add all changes: git add ." -ForegroundColor White
Write-Host "3. Commit: git commit -m 'Initial commit - Trove setup'" -ForegroundColor White
Write-Host "4. Push to new repo: git push -u origin main" -ForegroundColor White
Write-Host ""

Write-Host "✨ Ready to push!" -ForegroundColor Green

