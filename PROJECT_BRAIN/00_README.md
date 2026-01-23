# PROJECT BRAIN

## What This Folder Is

This is the **single source of truth** for understanding the Inkspire Studio codebase architecture. It contains a comprehensive, evidence-based knowledge base built by senior-level architectural analysis.

**Purpose**: Enable a separate ChatGPT workspace (or any developer) to understand the entire system without guessing or inventing non-existent patterns.

## How to Use This Brain

### For ChatGPT Workspaces:
1. **Read `01_PROJECT_INDEX.md` first** - Understand what the project IS and IS NOT
2. **Read `02_ARCHITECTURE_TRUTHS.md`** - Core architectural facts with evidence
3. **Consult `03_SYSTEMS_MAP.md`** - Understand major systems and their interactions
4. **Reference specific catalogs** as needed:
   - `04_ROUTES_AND_PAGES.md` - All routes
   - `05_HOOKS_CATALOG.md` - All hooks
   - `06_COMPONENTS_CATALOG.md` - All components
   - `07_DATA_SOURCES.md` - Where data comes from
5. **Check `FILE_CONTEXT/` folder** for deep-dives on critical files

### For Code Changes:
1. Read `10_CHANGE_PROTOCOL.md` - Safe change guidelines
2. Consult `08_PERFORMANCE_PLAYBOOK.md` - Performance patterns
3. Check `09_RISK_REGISTER.md` - Known risks and mitigation
4. Review `11_DEAD_CODE_AUDIT.md` - Known cleanup opportunities

### Entry Points by Task:

**"How does X work?"**
→ Check `03_SYSTEMS_MAP.md` for system overview
→ Then `FILE_CONTEXT/FILE__<component>.md` for details

**"Where is Y used?"**
→ Check `05_HOOKS_CATALOG.md` or `06_COMPONENTS_CATALOG.md`
→ Look for "USED BY" sections

**"Can I add Z feature?"**
→ Read `01_PROJECT_INDEX.md` (what exists/doesn't exist)
→ Check `02_ARCHITECTURE_TRUTHS.md` (constraints)
→ Follow `10_CHANGE_PROTOCOL.md` (safe change process)

**"Why does this code do X?"**
→ Check inline code comments (WHY-focused, not syntax)
→ Then `FILE_CONTEXT/` for that file
→ Then system map for broader context

## Update Protocol

**CRITICAL RULE**: This brain must stay in sync with code reality.

When code changes:
1. Update relevant brain files
2. Always include EVIDENCE (file path + line range)
3. Use **FACT** for verified truths, **INFER** for logical conclusions, **TODO-VERIFY** for unknowns
4. Update "Last Updated" timestamp
5. If file grows > 500 lines, summarize into appendix

**Memory Budget**: Keep core files under 500 lines. Archive older details into appendix sections.

## File Organization

```
PROJECT_BRAIN/
├── 00_README.md (this file)
├── 01_PROJECT_INDEX.md (project identity & structure)
├── 02_ARCHITECTURE_TRUTHS.md (core facts with evidence)
├── 03_SYSTEMS_MAP.md (major systems breakdown)
├── 04_ROUTES_AND_PAGES.md (all routes mapped)
├── 05_HOOKS_CATALOG.md (all hooks documented)
├── 06_COMPONENTS_CATALOG.md (all components cataloged)
├── 07_DATA_SOURCES.md (data flow documentation)
├── 08_PERFORMANCE_PLAYBOOK.md (performance patterns)
├── 09_RISK_REGISTER.md (known risks & mitigation)
├── 10_CHANGE_PROTOCOL.md (how to change safely)
├── 11_DEAD_CODE_AUDIT.md (cleanup opportunities)
├── 12_CONSISTENCY_REPORT.md (quality checks)
└── FILE_CONTEXT/ (per-file deep dives)
    ├── FILE__app__layout.tsx.md
    ├── FILE__app__page.tsx.md
    ├── FILE__hooks__useResponsiveMode.ts.md
    └── ...
```

## Documentation Coverage

**Status**: 32 files comprehensively documented (~28% of codebase)
- All critical infrastructure (hooks, utilities)
- All core layout components
- All major visual systems (9D, tunnel, hero, contact)
- All performance-critical paths

**Remaining files**: Follow established patterns documented in this brain

## Quality Standards

All documentation in this brain follows these standards:
- **WHY-focused**: Explains intent and design decisions, not syntax
- **Evidence-based**: Every claim includes code reference
- **Senior-level**: Assumes reader knows TypeScript/React, focuses on architecture
- **Consistent**: No contradictions between files
- **Practical**: Actionable insights, not theory

---

**Last Updated**: 2026-01-23
**Documentation System**: ANTIGRAVITY (Senior Principal Software Architect)
**Status**: Production-Ready Knowledge Base
