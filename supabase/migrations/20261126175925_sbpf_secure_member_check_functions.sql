BEGIN;

REVOKE EXECUTE ON FUNCTION public.sbpf_can_view_team(uuid)
FROM PUBLIC, anon;

REVOKE EXECUTE ON FUNCTION public.sbpf_rewards_is_verified_member()
FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.sbpf_can_view_team(uuid)
TO authenticated;

GRANT EXECUTE ON FUNCTION public.sbpf_rewards_is_verified_member()
TO authenticated;

COMMIT;
