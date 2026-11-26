# SBPF Reward Zone — Confirmed Rules Addendum

Date: 2026-11-20  
Branch: `reward-zone-rules-180`  
PR: #30 (draft; not merged)

## Scope-wide rule

The owner has confirmed that the controls and operating arrangements selected in the Reward Zone's 180-question decision process are to apply across **all Reward Zone cards**, not only the Wallet or PDF Download card. Each card must use the same applicable member-verification, authorization, Main Admin oversight, lock/unlock, audit/history, and review controls as defined by the approved decisions. A card must not bypass the shared controls by using a separate frontend-only path.

This statement records the scope decision. The exact per-card rules must be taken from the original 180 answers; do not invent missing answers or infer unconfirmed permissions.

## Confirmed Spin Wheel rule (supersedes older baseline text)

- Prize values: 10, 40, 50, and 100 Coin only.
- Probability: 25% for each prize.
- One free spin per 24-hour period.
- Missed spins do not accumulate.
- Spin is free; it must not deduct Coin or money.

Any older document or code note referring to twelve prizes, grouped odds, a three-hour cooldown, or a daily cap is superseded for this approved Spin Wheel configuration and must be reconciled before release.

## Confirmed Wallet PIN / PDF Download rules

- Q179 — Option 4: after three incorrect Wallet PIN attempts, PDF Download is locked; only Main Admin may unlock it.
- Q180 — Option 1: unlocking PDF Download requires Main Admin approval.

These two answers are preserved exactly as available in the conversation record. Do not generalize their exact lock trigger to other features unless the original 180 answers specify that behavior.

## Evidence and release status

- This addendum records confirmed decisions only; it is not the complete 180-question transcript.
- Questions/answers Q1–Q178 must be imported from the original conversation or source export before a complete 180-Q&A specification can be claimed.
- This file is staged on the development branch only. It does not authorize production database writes, migration execution, PR merge, or deployment.
