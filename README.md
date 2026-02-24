# n8n-nodes-eigenlayer

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with EigenLayer's restaking protocol, enabling automation across 6 core resources including operators, delegations, EigenPods, AVS (Actively Validated Services), restaking operations, and rewards management for decentralized validation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![EigenLayer](https://img.shields.io/badge/EigenLayer-Protocol-purple)
![Restaking](https://img.shields.io/badge/Restaking-Enabled-green)
![AVS](https://img.shields.io/badge/AVS-Compatible-orange)

## Features

- **Operator Management** - Register, update, and monitor EigenLayer operators with comprehensive metadata handling
- **Delegation Control** - Automate stake delegation workflows and track delegator relationships
- **EigenPod Operations** - Manage native ETH restaking through EigenPod deployments and validations
- **AVS Integration** - Connect with Actively Validated Services for enhanced validation workflows
- **Restaking Automation** - Streamline liquid and native restaking operations across multiple strategies
- **Rewards Tracking** - Monitor and distribute rewards across operators and delegators
- **Multi-Network Support** - Compatible with Ethereum mainnet and supported testnets
- **Real-time Monitoring** - Track staking metrics, validator performance, and protocol events

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
| API Key | Your EigenLayer API authentication key | Yes |
| Network | Target network (mainnet, goerli, holesky) | Yes |
| Private Key | Wallet private key for transaction signing | Yes |
| RPC Endpoint | Custom RPC endpoint (optional) | No |

## Resources & Operations

### 1. Operators

| Operation | Description |
|-----------|-------------|
| Register | Register a new operator on EigenLayer |
| Update Metadata | Update operator metadata and configuration |
| Get Details | Retrieve operator information and statistics |
| List Operators | Get paginated list of operators with filters |
| Update Commission | Modify operator commission rates |
| Deregister | Remove operator from EigenLayer protocol |

### 2. Delegations

| Operation | Description |
|-----------|-------------|
| Delegate | Delegate stake to a specific operator |
| Undelegate | Remove delegation from an operator |
| Get Delegations | Retrieve delegation details for an address |
| List Delegators | Get all delegators for a specific operator |
| Calculate Shares | Compute delegation shares for given amounts |
| Get Withdrawal | Check withdrawal request status |

### 3. EigenPods

| Operation | Description |
|-----------|-------------|
| Deploy Pod | Deploy a new EigenPod for native ETH restaking |
| Stake ETH | Stake ETH through an EigenPod |
| Verify Withdrawal | Verify and process ETH withdrawals |
| Get Pod Status | Retrieve EigenPod status and balance |
| Update Proof | Submit validator proof updates |
| Withdraw Restaked ETH | Process restaked ETH withdrawals |

### 4. AVS (Actively Validated Services)

| Operation | Description |
|-----------|-------------|
| Register AVS | Register a new Actively Validated Service |
| Opt In | Opt operator into specific AVS |
| Opt Out | Remove operator from AVS participation |
| Get AVS List | Retrieve available AVS with metadata |
| Get Operator AVS | List AVS where operator is registered |
| Update AVS Metadata | Modify AVS configuration and details |

### 5. Restaking

| Operation | Description |
|-----------|-------------|
| Deposit Tokens | Deposit tokens into restaking strategies |
| Queue Withdrawal | Initiate withdrawal from restaking positions |
| Complete Withdrawal | Finalize queued withdrawal requests |
| Get Strategies | List available restaking strategies |
| Get User Stakes | Retrieve user's restaking positions |
| Calculate TVL | Compute total value locked in strategies |

### 6. Rewards

| Operation | Description |
|-----------|-------------|
| Get Operator Rewards | Retrieve rewards earned by operators |
| Get Delegator Rewards | Fetch rewards for delegators |
| Claim Rewards | Process reward claims for addresses |
| Get Reward History | Historical rewards data with filters |
| Calculate APY | Compute annualized percentage yield |
| Get Distribution | Retrieve reward distribution schedules |

## Usage Examples

```javascript
// Register a new EigenLayer operator
{
  "operator_address": "0x742d35Cc6634C0532925a3b8D4BA8ff95CF9b",
  "metadata_uri": "https://operator.example.com/metadata.json",
  "delegation_approver": "0x0000000000000000000000000000000000000000",
  "staker_opt_out_window_blocks": 50400
}
```

```javascript
// Delegate stake to an operator
{
  "operator": "0x742d35Cc6634C0532925a3b8D4BA8ff95CF9b",
  "strategy": "0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6",
  "shares": "1000000000000000000",
  "delegator": "0x8ba1f109551bD432803012645Hac136c22C177ec"
}
```

```javascript
// Deploy and configure EigenPod
{
  "owner": "0x8ba1f109551bD432803012645Hac136c22C177ec",
  "withdrawal_credentials": "0x010000000000000000000000742d35Cc6634C0532925a3b8D4BA8ff95CF9b",
  "deposit_amount": "32000000000000000000"
}
```

```javascript
// Opt operator into AVS
{
  "operator": "0x742d35Cc6634C0532925a3b8D4BA8ff95CF9b",
  "avs_registry": "0x1B30A3b5744e733d8d2f19F0812E3F79152a8777",
  "operator_signature": "0x1b4f0e8840ccb1058c21c2e6b4e57c7b...",
  "salt": "0x1234567890abcdef"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and active |
| Insufficient Balance | Not enough tokens for restaking operation | Check wallet balance and gas fees |
| Invalid Operator | Operator address not found or not registered | Verify operator address and registration status |
| Slashing Risk | Operation blocked due to slashing conditions | Review slashing parameters and wait for clearance |
| Network Congestion | Transaction failed due to high gas prices | Retry with higher gas limit or wait for lower fees |
| Invalid Signature | Transaction signature verification failed | Check private key and signing parameters |

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