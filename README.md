# n8n-nodes-eigenlayer

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with EigenLayer's restaking protocol, offering 6 core resources for managing decentralized validation infrastructure. Access restaking operations, delegation management, EigenPod controls, operator registration, AVS registration, and rewards tracking through automated workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![EigenLayer](https://img.shields.io/badge/EigenLayer-Protocol-purple)
![Ethereum](https://img.shields.io/badge/Ethereum-Restaking-blue)
![DeFi](https://img.shields.io/badge/DeFi-Automation-green)

## Features

- **Complete Restaking Management** - Stake, unstake, and manage ETH restaking positions across multiple strategies
- **Delegation Operations** - Automate delegation to operators and manage delegation relationships
- **EigenPod Controls** - Monitor and manage EigenPod lifecycle, validator proofs, and withdrawals
- **Operator Registration** - Register and update operator metadata, manage operator stakes and commissions
- **AVS Integration** - Register with Actively Validated Services and manage service-specific configurations
- **Rewards Tracking** - Monitor and claim rewards from restaking activities across all supported strategies
- **Real-time Monitoring** - Track staking positions, delegation status, and reward accumulation
- **Multi-Strategy Support** - Work with liquid staking tokens and native ETH restaking strategies

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-eigenlayer`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-eigenlayer
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-eigenlayer.git
cd n8n-nodes-eigenlayer
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-eigenlayer
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | EigenLayer API key for authentication | Yes |
| Environment | Target environment (mainnet/testnet) | Yes |
| Wallet Address | Ethereum wallet address for operations | Yes |

## Resources & Operations

### 1. Restaking

| Operation | Description |
|-----------|-------------|
| Stake | Deposit ETH or LSTs into EigenLayer restaking strategies |
| Unstake | Initiate unstaking process from restaking positions |
| Get Position | Retrieve current restaking position details and balances |
| List Strategies | Get available restaking strategies and their parameters |
| Queue Withdrawal | Queue assets for withdrawal with delay period |
| Complete Withdrawal | Complete queued withdrawals after delay period |

### 2. Delegation

| Operation | Description |
|-----------|-------------|
| Delegate | Delegate restaked assets to a specific operator |
| Undelegate | Remove delegation from an operator |
| Get Delegation | Retrieve current delegation status and operator details |
| List Operators | Get available operators with their metadata and performance |
| Update Delegation | Modify existing delegation parameters |
| Get Delegation History | Retrieve historical delegation changes |

### 3. EigenPods

| Operation | Description |
|-----------|-------------|
| Create Pod | Deploy a new EigenPod for native ETH restaking |
| Verify Credentials | Submit validator credentials for EigenPod verification |
| Prove Withdrawal | Submit withdrawal proofs for validator exits |
| Get Pod Status | Retrieve EigenPod status and associated validators |
| Update Pod | Update EigenPod configuration and settings |
| Withdraw from Pod | Process withdrawals from EigenPod balance |

### 4. OperatorRegistration

| Operation | Description |
|-----------|-------------|
| Register Operator | Register as an operator on EigenLayer |
| Update Metadata | Update operator metadata and configuration |
| Set Commission | Configure operator commission rates |
| Get Operator Info | Retrieve operator details and statistics |
| Deregister | Remove operator registration |
| Update Socket | Update operator communication endpoints |

### 5. AVSRegistration

| Operation | Description |
|-----------|-------------|
| Register with AVS | Register operator with Actively Validated Services |
| Deregister from AVS | Remove registration from specific AVS |
| Get AVS List | Retrieve available AVS and their requirements |
| Update AVS Config | Modify AVS-specific configuration |
| Get Registration Status | Check current AVS registration status |
| Submit AVS Proof | Submit required proofs for AVS participation |

### 6. Rewards

| Operation | Description |
|-----------|-------------|
| Get Rewards | Retrieve current reward balances across strategies |
| Claim Rewards | Claim accumulated rewards from restaking activities |
| Get Reward History | Retrieve historical reward distribution data |
| Calculate Projected | Estimate future rewards based on current positions |
| Get APY Data | Retrieve current and historical APY for strategies |
| Track Performance | Monitor reward performance across time periods |

## Usage Examples

```javascript
// Stake ETH in a restaking strategy
{
  "operation": "stake",
  "strategy": "stETH",
  "amount": "32",
  "recipient": "0x742d35Cc6634C0532925a3b8D62115CdEFE13891"
}
```

```javascript
// Delegate restaked assets to an operator
{
  "operation": "delegate",
  "operator": "0x1234567890abcdef1234567890abcdef12345678",
  "amount": "100",
  "strategy": "cbETH"
}
```

```javascript
// Create and configure an EigenPod
{
  "operation": "createPod",
  "withdrawalCredentials": "0x010000000000000000000000742d35Cc6634C0532925a3b8D62115CdEFE13891",
  "podOwner": "0x742d35Cc6634C0532925a3b8D62115CdEFE13891"
}
```

```javascript
// Claim accumulated rewards
{
  "operation": "claimRewards",
  "strategies": ["stETH", "rETH", "cbETH"],
  "recipient": "0x742d35Cc6634C0532925a3b8D62115CdEFE13891"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key and environment settings |
| Insufficient Balance | Not enough tokens for requested operation | Check wallet balance and allowances |
| Invalid Strategy | Specified restaking strategy not found | Use List Strategies operation to get valid options |
| Delegation Not Found | No active delegation found for operator | Verify operator address and delegation status |
| Pod Not Deployed | EigenPod not found for specified address | Create EigenPod before performing pod operations |
| Withdrawal Delay | Withdrawal still in queue period | Wait for delay period completion before claiming |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
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
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-eigenlayer/issues)
- **EigenLayer Documentation**: [docs.eigenlayer.xyz](https://docs.eigenlayer.xyz)
- **EigenLayer Community**: [Discord](https://discord.gg/eigenlayer)