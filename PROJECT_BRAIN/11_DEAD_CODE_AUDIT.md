# DEAD CODE AUDIT

**Last Updated**: 2026-01-23T16:50:00+03:00

---

## COMPLETED REMOVALS (2026-01-23)

### 1. `hooks/useFloatingParticles.ts`
- **Status**: REMOVED ✅
- **Reason**: Stub implementation, zero imports found.
- **Savings**: ~1.8KB Code.

### 2. `hooks/useScrollScenes.ts`
- **Status**: REMOVED ✅
- **Reason**: Zero imports confirmed in codebase.
- **Savings**: ~1.2KB Code.

---

## PENDING VERIFICATION (TODO)

### 1. `@tsparticles/*` Dependencies
- **Status**: SUSPECTED UNUSED
- **Context**: `useFloatingParticles` was the only likely consumer.
- **Packages**:
  - `@tsparticles/react`
  - `@tsparticles/engine`
  - `@tsparticles/slim`
- **Action**: Verify if any other file imports these. If not, `npm uninstall`.
- **Potential Savings**: 50-100KB Bundle.

### 2. `components/ui/` Audit
- **Status**: UNVERIFIED
- **Action**: Check if all UI primitives are actually used in layouts/sections.
- **Risk**: Low (small files).

---

## RECOMMENDATION

**Next Cleanup Step**: Run a grep for `@tsparticles`. If explicit zero matches in `src/app` and `src/components`, uninstall the packages to reduce `node_modules` weight and build time.
