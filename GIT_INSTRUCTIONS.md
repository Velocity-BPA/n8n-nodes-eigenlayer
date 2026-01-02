# Git Setup Instructions

## Initialize Repository

```bash
cd n8n-nodes-eigenlayer
git init
git branch -M main
```

## Configure Git (if needed)

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Initial Commit

```bash
git add .
git commit -m "feat: Initial release of n8n-nodes-eigenlayer v1.0.0

Complete EigenLayer restaking protocol integration for n8n workflow automation.

Features:
- 9 resource categories covering all EigenLayer core contracts
- 39 operations (19 read, 13 write, 3 multicall)
- Strategy Manager: deposits, staker shares queries
- Delegation Manager: operator registration, delegation, withdrawals
- EigenPod Manager: native ETH restaking with pod creation
- AVS Directory: operator AVS registration management
- Rewards Coordinator: claim processing and claimer management
- Allocation Manager: stake allocation and magnitude tracking
- Strategy: share/underlying conversions, total shares
- Multicall: batch reads, portfolio and operator summaries

Technical Stack:
- TypeScript 5.7.2 with strict mode
- ethers.js v6.13.4
- n8n-workflow v1.69.0
- Node.js >=18.0.0

Infrastructure:
- EIP-712 signatures for meta-transactions
- Multicall3 for batch operations
- Provider caching with retry logic (3 attempts, exponential backoff)
- Gas estimation with 20% buffer
- Support for Alchemy, Infura, QuickNode, custom RPC

Networks:
- Ethereum Mainnet (chain 1)
- Holesky Testnet (chain 17000)

Strategies (12):
stETH, rETH, cbETH, wBETH, osETH, swETH, AnkrETH, OETH, sfrxETH, lsETH, mETH, EIGEN

License: BUSL-1.1"
```

## Add Remote Repository

```bash
# GitHub
git remote add origin https://github.com/Velocity-BPA/n8n-nodes-eigenlayer.git

# Or GitLab
git remote add origin https://gitlab.com/velocity-bpa/n8n-nodes-eigenlayer.git
```

## Push to Remote

```bash
git push -u origin main
```

## Create Release Tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0 - Initial release"
git push origin v1.0.0
```

## Recommended Branch Structure

```
main           # Stable releases
├── develop    # Integration branch
│   ├── feature/operator-slashing    # New features
│   ├── feature/avs-rewards
│   └── fix/gas-estimation           # Bug fixes
└── release/v1.1.0                   # Release preparation
```

## Pre-commit Hooks (optional)

```bash
# Install husky for git hooks
npm install --save-dev husky

# Initialize husky
npx husky init

# Add pre-commit hook
echo "npm run lint && npm test" > .husky/pre-commit
chmod +x .husky/pre-commit
```

## .gitignore (already included)

```
node_modules/
dist/
*.log
.DS_Store
.env
*.local
coverage/
.idea/
.vscode/
*.tgz
```

## Publishing to npm

```bash
# Login to npm
npm login

# Build and publish
npm run build
npm publish

# For scoped packages
npm publish --access public
```

## Semantic Versioning

Follow semver for version updates:
- **MAJOR** (2.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backward compatible
- **PATCH** (1.0.1): Bug fixes, backward compatible

Example commits:
- `feat: Add operator slashing detection` → Minor bump
- `fix: Correct gas estimation for batch operations` → Patch bump
- `feat!: Change withdrawal API structure` → Major bump
