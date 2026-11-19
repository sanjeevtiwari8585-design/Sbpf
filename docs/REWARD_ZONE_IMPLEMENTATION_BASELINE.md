# SBPF Reward Zone — Implementation Baseline

Status: requirements baseline and audit only. No production database changes or payouts are authorized by this document.

## Source of truth and deployment
- Keep the existing Supabase project as the only database: `dxowhzghrdghfzoggorx`.
- Keep the existing GitHub repository and GitHub Pages deployment.
- Work on branch `reward-zone-rules-180`; do not change `main` or production until review and explicit approval.
- Preserve all existing membership, campaign, and non-reward data.
- No live cash transfer, payment gateway charge, or production wallet adjustment during testing.

## Member access and wallet
- Only verified members can use member reward features.
- Admin creates the member record and unique member code. Verification checks the code, mobile number, and name against the Admin record. OTP is deferred to a later phase.
- One unique code can create only one wallet.
- Wallet creation asks for a 4-digit PIN twice. Store only a secure password hash; never store or log the PIN.
- Wallet login/transactions require the 4-digit PIN. Three incorrect PIN attempts temporarily lock the wallet; Admin can unlock.
- Wallet PIN reset is Admin-authorized only.
- Wallet shows total Coin and current INR equivalent. Members see only their own balance, ledger, transactions, and history.
- A member can transfer Coin to another member using recipient member code and their own PIN. Transfers must be atomic and uniquely identified.
- Admin may reduce/reclaim Coin only, with reason, confirmation, audit trail, and member notification. Admin must not manually credit Coin.
- Admin can block/re-enable a member. A blocked wallet is locked without destroying balance/history; record reason and timestamp and notify member.
- One active device/session per member; a new login ends the previous session and sends a security notice.

## Spin Wheel
- Twelve prize values: 10, 20, 30, 40, 50, 100, 200, 300, 500, 1,000, 2,000, 5,000 Coin.
- Group probabilities: 10–50 collectively 30%; 100–500 collectively 67%; 1,000–5,000 collectively 3%.
- One free spin every 3 hours. Missed opportunities do not accumulate.
- A spin is free and does not spend Coin or money.
- On completion, the winning prize is credited automatically to the member wallet and written to spin history and the Coin ledger as one atomic operation.
- Members see only their own spin history; Admin can inspect all histories.
- Admin can edit prize values and probabilities, and disable/enable an individual member's spin permission. No global wheel off switch.
- Probability input must be normalized to exactly 100%; retain an audit trail for changes.
- Admin may delete a spin-history record only with actor, timestamp, reason, and recoverable audit information. Ledger integrity must not be silently broken.

## Reward Zone experience
- Reward cards/features include Spin Wheel, Wallet, video watching, daily tasks, scratch card, and other SBPF features.
- Responsive app-like layout for mobile and laptop.
- Hindi, English, and other Indian-language choices; persist the member's language choice.
- Member profile is view-only; only Admin can change personal details.
- Member can request profile-photo change; Admin approves/rejects, records rejection reason, and notifies member.
- Logout clears session; members are not forced to remain logged in.

## Support and complaints
- Members can submit technical, Wallet/Coin, Account/Verification, Spin Wheel, and Other complaints.
- Complaint has unique ID, attachments (photo/video/PDF), status, and a private visibility scope: complainant, Admin, assigned Support Team only.
- After submission, extra details/attachments require Admin permission.
- Statuses: New, Under Review, In Progress, Resolved, Closed.
- Main Admin appoints/removes Support Team. Team can respond, update status, and escalate; all actions are audited and member is notified.
- Admin assigns complaints; reassignment is notified and logged.
- Closing requires a reason; notify member and log. Closed complaints cannot be reopened; member may file a new complaint.
- Unlimited complaints per day. Only Admin sets priority and deadline. Overdue cases notify Admin/Support and automatically escalate to main Admin at deadline.
- Main Admin can resolve/reassign/change priority or deadline with reason and notification. Admin remark and member reply are text-only; no seen indicator.
- After resolution/closure, member receives details and can rate once from 1–5 stars with comment within 30 days.
- Admin can view and export feedback (Excel/PDF) with date filters. Support dashboard reports handled/resolved/overdue and average rating; score combines resolved volume, ratings, and on-time resolution.

## Coin ledger, receipts, and reporting
- Coin use includes SBPF product/service purchases, member transfers, Rewards/Offers, future features, and cash withdrawal.
- Member sees aggregate balance and INR equivalent; Admin sees source breakdown (Spin, video, daily tasks, scratch cards, other).
- Main Admin reports total issued, member wallet total, withdrawn/spent, transferred, and reclaimed; daily/monthly/yearly filters.
- Complete ledger records every credit/debit, source, destination, transfer, withdrawal, reclaim, and timestamp.
- Admin deletion of a ledger record requires reason and audit; restore retains original transaction ID and prior details.
- Generate long random unique transaction IDs; never reuse. Members see their own IDs.
- Member receipts: PDF, Hindi/English, SBPF logo only, no QR, name, unique member code, full mobile, bank account last four digits. Download protected by Wallet PIN; unlimited individual downloads.
- User requested full PAN on receipts. Treat this as sensitive identity data: do not expose it in the member UI or logs; before enabling PAN in a receipt, require a separate privacy/security review and consider masked PAN.
- ZIP export is only for withdrawal receipts, one folder, all dates together, filename based on member code, each PDF named by transaction ID, no pre-download count; notify member after ZIP generation.
- Digital signature may only be applied by an actually authorized SBPF signatory; never fabricate a signature.

## Cash withdrawal
- Only fixed choices: ₹500 (30% fee; ₹150 fee; ₹350 net), ₹1,000 (20%; ₹200; ₹800 net), ₹5,000 (10%; ₹500; ₹4,500 net), ₹10,000 (5%; ₹500; ₹9,500 net). No custom amount.
- Member sees gross, fee, and net and confirms before submitting.
- Fee goes to SBPF main Admin Account; Admin gets immediate notice after successful fee deposit.
- If fee payment fails, request remains Pending and can be retried up to three times. After three failures, Finance Team investigates manually; its decision and any Main Admin override must be audited.
- Payout only to member's own bank account. Capture/validate account number and IFSC; no penny-drop or bank-name matching was selected.
- Finance Team is appointed by Main Admin. For ordinary member requests, Finance reviews and Main Admin gives final approval. A Finance Team member cannot inspect/approve their own request or a family member's request. Finance Team members' own requests are checked only by Main Admin.
- Rejection requires reason and member notification. Pending shows only Pending. Paid shows status, bank transaction ID, and payment date.
- Only one pending request per member. Member cannot cancel. Admin cancellation requires reason, notification, and audit; return all reserved/deducted Coin with timestamp.
- The most recent approval rule must be applied consistently: final approval authority is controlled by Main Admin; delegated approvers, if any, must be explicitly authorized and audited.

## Important implementation safeguards
- Use database transactions/RPCs for spin award, wallet transfer, withdrawal reservation, cancellation/refund, and payout state transitions. Never trust browser-calculated balances, fees, odds, or member identity.
- Enforce row-level security and role checks server-side. The browser must not receive service-role credentials.
- Keep an append-only audit trail for security-sensitive actions.
- Never run real payout or payment collection in sandbox tests.
- Before enabling real-money withdrawal, obtain legal, tax, KYC/privacy, and payment-provider review for the Coin-to-INR model and fees.

## Initial technical audit findings (2026-11-19)
- Existing tables include `sbpf_rewards_config`, `sbpf_reward_tasks`, `sbpf_reward_wallet_ledger`, `sbpf_reward_redemptions`, `sbpf_reward_spins`, `sbpf_reward_wallets`, `sbpf_reward_wallet_transfers`, `sbpf_watch_sessions`, `sbpf_wallet_pin_reset_requests`, and `sbpf_reward_enforcement_actions`.
- Existing `sbpf_reward_spins.prize_coins` CHECK currently allows legacy values `11, 21, 51, 101, 251, 551, 1100, 2100, 5100, 11000, 21000, 51000`; it does not match the new 12-value prize list.
- Existing spin table has `wheel_number` 1–3; the current page's spin status logic uses a 24-hour window and an 8-spin count, which does not match the new 3-hour rule.
- Existing redemption table is a generic Coin redemption with statuses pending/approved/rejected/paid/cancelled and payout methods UPI/bank_transfer/other; it does not yet model the fixed cash tiers, fee collection, bank verification, Finance review, Main Admin approval, retry tracking, or receipt workflow.
- Existing rewards page includes a test-only member-ID gate and direct browser REST calls. Review/remove or isolate test access before production; never allow test-mode shortcuts to grant production access.
- Supabase Security Advisor findings include one SECURITY DEFINER view error, RLS-enabled tables without policies, and multiple SECURITY DEFINER function execution warnings. These must be triaged before launch; do not apply blanket grants/revokes without inspecting each function and its callers.

## Open implementation checks
- Confirm exact per-prize probabilities within each of the three probability groups if the Admin's initial values are not already specified in the existing rules history. Group totals alone do not determine a unique prize distribution.
- Reconcile the final withdrawal approver rule with the earlier Finance-review/Main-Admin-final-approval rule before enabling payouts.
