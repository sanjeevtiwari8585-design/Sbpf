# SBPF Reward Zone — Approved Build Specification

Status: Draft / implementation and local testing required. Rewards remain disabled.

## Member entry and wallet
1. A verified eligible SBPF member opens Reward Zone.
2. If no wallet exists, show a Create Wallet modal.
3. On Create, collect a 4-digit PIN and Confirm PIN; both must match.
4. Call the existing authenticated wallet creation and PIN setup RPCs. Never store a raw PIN in the browser or database; only the server-side password hash is stored.
5. After successful setup, open the member Reward Zone dashboard.
6. Show wallet balance, transaction history, and member reward categories only to the authenticated eligible member.

## Ten reward categories
| Order | Category | Proposed reward |
|---:|---|---|
| 1 | Earn & Play | Long video 10 Coins; short video 2 Coins. Preserve existing server-verified Watch & Earn flow. |
| 2 | Spin Wheel | 10, 25, 50, 100, 200, 500, 750, 1,000, 2,000, 5,000, 10,000 Coins. Group probabilities: 50%, 47%, 2.99%, 0.01%; equal probability within each group. |
| 3 | Google Review | No Coins for public Google reviews. Separate private SBPF feedback: 25/50/100 Coins after review/approval. |
| 4 | Social Subscribe & Follow | Proposed 25 Coins per eligible action; keep disabled pending platform-policy review. |
| 5 | Post Share | Proposed 25 Coins each for eligible share/comment/like; keep disabled pending platform-policy review. |
| 6 | Daily Task | 100 Coins per eligible task after approval. |
| 7 | Daily Check-in | 25 Coins once per member per server day. |
| 8 | Referral & Invite | 100 Coins after a genuinely new referred member is verified. |
| 9 | Campaign Participation | Opinion 25 + eligible share 25 Coins; never reward a particular opinion or stance. |
| 10 | Volunteer Service | 100 Coins per distinct verified service task. |

## Wallet and administration
- Conversion display: 100 Coins = ₹1; payout remains manual and is not a promise of cash redemption.
- Verified members only.
- Admin review for proof-based rewards, audit trail, duplicate-claim prevention, and transaction history.
- Preserve the existing wallet ledger and Watch & Earn tables/functions until replacements are tested.
- Do not delete member, payment, KYC, family, campaign, or other SBPF data.

## Release gates
- All categories remain disabled until end-to-end testing and explicit launch approval.
- Global rewards_enabled remains false.
- Test with sandbox/test accounts; do not issue real Coins or payouts during testing.
- Test on local Docker first. Merge/deploy to GitHub Pages production only after the page, RPC calls, RLS, mobile layout, and smoke tests pass.
- The custom domain swarnimbharatclub.in must be confirmed on GitHub Pages with working DNS/TLS before claiming the custom domain is live.
