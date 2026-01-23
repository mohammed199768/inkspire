# CHANGE PROTOCOL

**Last Updated**: 2026-01-23T16:50:00+03:00

**GOAL**: Maintain the integrity of the "Project Brain" and the application stability.

---

## 1. The "Closed Brain" Rule

**RULE**: Before writing code, READ the `PROJECT_BRAIN`.
- Never assume a system exists (e.g., API, Auth) without checking `01_PROJECT_INDEX.md`.
- Never start a new architectural pattern without checking `02_ARCHITECTURE_TRUTHS.md`.

---

## 2. Documentation Updates

**RULE**: Code changes MUST trigger Brain updates.
- **If you change a Hook**: Update `05_HOOKS_CATALOG.md`.
- **If you add a Route**: Update `04_ROUTES_AND_PAGES.md`.
- **If you change Data flow**: Update `07_DATA_SOURCES.md`.
- **If you optimize Perf**: Add to `08_PERFORMANCE_PLAYBOOK.md`.

**Constraint**: All Brain updates must cite **EVIDENCE** (File path). No theorizing.

---

## 3. Safe Code Editing

**RULE**: No "Blind" Editing.
1. **Context**: Read `FILE_CONTEXT` for the file if it exists.
2. **Analysis**: Check for "Cleanup" requirements (RAF, Listeners).
3. **Edit**: Apply change.
4. **Verification**: Run `npm run type-check` (or build).
5. **Commit**: Concise message explaining WHY.

---

## 4. Memory Budget

**RULE**: Keep Brain files concise (< 500 lines).
- If a file grows too large, summarize old/stable parts into an "Appendix" at the bottom.
- Move detailed per-file analysis to `FILE_CONTEXT/`.

---

## 5. Destruction Policy

**RULE**: Do not delete code unless confirmed unused.
- Check `grep` results.
- Verify no dynamic imports.
- Document removal in `11_DEAD_CODE_AUDIT.md`.

---

## 6. Hallucination Check

**RULE**: If you can't find it in the code, IT DOES NOT EXIST.
- Do not write docs for "Planned" features unless explicitly marked `[PLANNED]`.
- Do not document systems that "should" be there (e.g., tests) if they aren't.

---

**Summary**: The `PROJECT_BRAIN` is the single source of truth. If code diverges from it, update the Brain immediately with evidence.
