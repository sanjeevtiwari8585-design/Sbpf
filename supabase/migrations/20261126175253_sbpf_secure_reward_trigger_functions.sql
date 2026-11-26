BEGIN;

REVOKE EXECUTE ON FUNCTION public.sbpf_guard_cash_redemption_status()
FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.sbpf_rewards_admin_audit_trigger()
FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.sbpf_rewards_on_redemption_paid()
FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.sbpf_rewards_on_submission_approved()
FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.sbpf_sync_team_member_snapshot()
FROM PUBLIC, anon, authenticated;

COMMIT;
