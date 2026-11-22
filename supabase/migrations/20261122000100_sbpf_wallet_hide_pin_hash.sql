-- SBPF Reward Zone: prevent authenticated clients from reading wallet PIN hashes.
-- RLS controls which wallet rows a member can see; column grants control which
-- fields can be read. Keep the own-wallet/admin row policies in place.
-- Wallet PIN verification and wallet operations must continue through the
-- existing SECURITY DEFINER RPCs; never fetch pin_hash from the client.

begin;

revoke select on table public.sbpf_reward_wallets from authenticated;

grant select (
  member_profile_id,
  wallet_status,
  pin_set_at,
  failed_pin_attempts,
  pin_locked_until,
  created_at,
  updated_at
) on table public.sbpf_reward_wallets to authenticated;

commit;
