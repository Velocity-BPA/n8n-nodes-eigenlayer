# n8n-nodes-eigenlayer

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for direct smart contract integration with **EigenLayer**, Ethereum's leading restaking protocol. This package provides both read and write operations for all core EigenLayer contracts, enabling automation of restaking operations, delegation management, rewards claiming, and monitoring.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green)

## Features

- **9 Resource Categories** covering all EigenLayer core contracts
- **70+ Operations** for comprehensive protocol interaction
- **Read & Write Operations** with proper gas estimation and transaction handling
- **Multicall Batching** for efficient on-chain data retrieval
- **Event-Based Triggers** for real-time monitoring
- **Mainnet & Holesky Testnet** support
- **EIP-712 Signatures** for gasless meta-transactions
- **Complete Strategy Coverage** including stETH, rETH, cbETH, and 9 more LSTs

## Installation

### Community Nodes (Recommended)

1. Open n8n Settings → Community Nodes
2. Click "Install"
3. Enter: `n8n-nodes-eigenlayer`
4. Click "Install"

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-eigenlayer

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-eigenlayer.git
cd n8n-nodes-eigenlayer

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-eigenlayer

# Restart n8n
```

## Credentials Setup

### Ethereum RPC Credentials

| Field | Description |
|-------|-------------|
| Provider | Alchemy, Infura, QuickNode, or Custom |
| API Key | Your provider API key |
| Custom RPC URL | For custom provider selection |
| Network | Mainnet or Holesky Testnet |

### Ethereum Wallet Credentials (for write operations)

| Field | Description |
|-------|-------------|
| Private Key | Wallet private key (encrypted storage) |
| Mnemonic | Alternative: 12/24 word phrase |
| Derivation Path | Default: m/44'/60'/0'/0/0 |

## Resources & Operations

### Strategy Manager

Manage token deposits into EigenLayer strategies.

| Operation | Type | Description |
|-----------|------|-------------|
| Get Staker Deposits | Read | Get all strategy deposits for an address |
| Get Staker Strategy Shares | Read | Get shares in a specific strategy |
| Deposit Into Strategy | Write | Deposit tokens into a whitelisted strategy |

### Delegation Manager

Manage operator delegation and withdrawals.

| Operation | Type | Description |
|-----------|------|-------------|
| Get Delegated Operator | Read | Get operator address staker is delegated to |
| Is Delegated | Read | Check if staker is delegated |
| Is Operator | Read | Check if address is a registered operator |
| Get Operator Details | Read | Get operator configuration |
| Get Operator Shares | Read | Get total shares delegated to operator |
| Get Withdrawable Shares | Read | Get shares available for withdrawal |
| Register As Operator | Write | Register address as operator |
| Delegate To | Write | Delegate restaked assets to operator |
| Undelegate | Write | Remove delegation and queue withdrawal |
| Queue Withdrawals | Write | Initiate withdrawal escrow |
| Complete Queued Withdrawal | Write | Finalize withdrawal after delay |

### EigenPod Manager

Manage native ETH restaking through EigenPods.

| Operation | Type | Description |
|-----------|------|-------------|
| Get EigenPod | Read | Get staker's EigenPod address |
| Has Pod | Read | Check if staker has deployed EigenPod |
| Get Pod Owner Shares | Read | Get beacon chain ETH shares |
| Create Pod | Write | Deploy new EigenPod |
| Stake | Write | Stake 32 ETH through EigenPod |

### EigenPod

Individual EigenPod operations.

| Operation | Type | Description |
|-----------|------|-------------|
| Get Pod Owner | Read | Get owner of EigenPod |
| Get Validator Status | Read | Get validator state by pubkey |
| Activate Restaking | Write | Enable restaking for pod |

### AVS Directory

Manage AVS (Actively Validated Service) registrations.

| Operation | Type | Description |
|-----------|------|-------------|
| Get Operator AVS Status | Read | Check operator's AVS registration |
| Register Operator To AVS | Write | Register operator with AVS |
| Deregister Operator From AVS | Write | Remove operator from AVS |

### Rewards Coordinator

Claim and manage EigenLayer rewards.

| Operation | Type | Description |
|-----------|------|-------------|
| Get Cumulative Claimed | Read | Get total claimed rewards |
| Get Claimer For | Read | Get authorized claimer address |
| Process Claim | Write | Claim rewards with merkle proof |
| Set Claimer For | Write | Designate claimer address |

### Allocation Manager

Manage stake allocations and slashing.

| Operation | Type | Description |
|-----------|------|-------------|
| Get Encumbered Magnitude | Read | Get magnitude subject to slashing |
| Get Allocation | Read | Get stake allocation details |
| Modify Allocations | Write | Modify AVS allocations |

### Strategy

Individual strategy operations.

| Operation | Type | Description |
|-----------|------|-------------|
| Get Total Shares | Read | Get total shares in strategy |
| Get Underlying Token | Read | Get strategy's underlying asset |
| Shares To Underlying | Read | Convert shares to token amount |
| Underlying To Shares | Read | Convert token amount to shares |

### Multicall

Batch operations for efficiency.

| Operation | Type | Description |
|-----------|------|-------------|
| Batch Read | Read | Execute multiple read calls |
| Get Staker Portfolio | Read | Get complete staker positions |
| Get Operator Summary | Read | Get comprehensive operator data |

## Trigger Node

The EigenLayer Trigger node monitors blockchain events:

- **Deposit** - New deposits into strategies
- **Operator Registered** - New operator registrations
- **Staker Delegated** - Delegation events
- **Staker Undelegated** - Undelegation events
- **Withdrawal Queued** - Withdrawal initiations
- **Withdrawal Completed** - Finalized withdrawals
- **Pod Deployed** - New EigenPod deployments
- **Operator AVS Registration Status Updated** - AVS registration changes
- **Rewards Claimed** - Reward distribution claims

Configure polling interval and optional address filtering.

## Usage Examples

### Monitor Staker Portfolio

```javascript
// Get all positions for an address
{
  "resource": "multicall",
  "operation": "getStakerPortfolio",
  "stakerAddress": "0x..."
}
```

### Deposit into stETH Strategy

```javascript
// Deposit stETH into EigenLayer
{
  "resource": "strategyManager",
  "operation": "depositIntoStrategy",
  "strategyAddress": "0x93c4b944D05dfe6df7645A86cd2206016c51564D",
  "tokenAddress": "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
  "amount": "1.0"
}
```

### Delegate to Operator

```javascript
// Delegate restaked assets
{
  "resource": "delegationManager",
  "operation": "delegateTo",
  "operatorAddress": "0x..."
}
```

### Queue Withdrawal

```javascript
// Initiate withdrawal
{
  "resource": "delegationManager",
  "operation": "queueWithdrawals",
  "strategies": "0x93c4b944D05dfe6df7645A86cd2206016c51564D",
  "withdrawer": "0x..."
}
```

## EigenLayer Concepts

| Concept | Description |
|---------|-------------|
| **Restaking** | Using already-staked assets to secure additional services |
| **Strategy** | Smart contract managing deposits of a specific token type |
| **Shares** | Proportional ownership in a strategy's underlying tokens |
| **Delegation** | Assigning restaked assets to an operator |
| **Operator** | Entity running AVS infrastructure and receiving delegations |
| **AVS** | Actively Validated Service secured by restaked assets |
| **EigenPod** | Smart contract for native ETH restaking |
| **Slashing** | Penalty mechanism for operator misbehavior |
| **Withdrawal Delay** | 14-day escrow period (~100,800 blocks on mainnet) |
| **LST** | Liquid Staking Token (stETH, rETH, cbETH, etc.) |

## Networks

| Network | Chain ID | Support |
|---------|----------|---------|
| Ethereum Mainnet | 1 | ✅ Full |
| Holesky Testnet | 17000 | ✅ Full |

### Mainnet Strategy Addresses

| Token | Strategy Address |
|-------|------------------|
| stETH | 0x93c4b944D05dfe6df7645A86cd2206016c51564D |
| rETH | 0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2 |
| cbETH | 0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc |
| wBETH | 0x7CA911E83dabf90C90dD3De5411a10F1A6112184 |
| osETH | 0x57ba429517c3473B6d34CA9aCd56c0e735b94c02 |
| swETH | 0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6 |
| AnkrETH | 0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff |
| OETH | 0xa4C637e0F704745D182e4D38cAb7E7485321d059 |
| sfrxETH | 0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6 |
| lsETH | 0xAe60d8180437b5C34bB956822ac2710972584473 |
| mETH | 0x298aFB19A105D59E74658C4C334Ff360BadE6dd2 |
| EIGEN | 0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7 |

## Error Handling

The node provides detailed error messages for:

- Invalid Ethereum addresses
- Insufficient balance or allowance
- Contract reverts with decoded reason
- RPC connection failures
- Transaction confirmation timeouts
- Gas estimation failures

All operations support `continueOnFail` mode for batch processing resilience.

## Security Best Practices

1. **Never share private keys** - Use encrypted credential storage
2. **Use testnets first** - Validate workflows on Holesky before mainnet
3. **Set gas limits** - Configure appropriate gas limits for transactions
4. **Monitor transactions** - Use the trigger node to track transaction status
5. **Backup mnemonics** - Securely store wallet recovery phrases

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

Please ensure all code follows the existing style and includes appropriate tests.

## Support

- **Documentation**: [GitHub Wiki](https://github.com/Velocity-BPA/n8n-nodes-eigenlayer/wiki)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-eigenlayer/issues)
- **EigenLayer Docs**: [docs.eigenlayer.xyz](https://docs.eigenlayer.xyz)

## Acknowledgments

- [EigenLayer](https://eigenlayer.xyz) - The leading Ethereum restaking protocol
- [n8n](https://n8n.io) - Fair-code workflow automation platform
- [ethers.js](https://ethers.org) - Ethereum library for JavaScript
