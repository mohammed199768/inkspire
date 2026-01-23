# ENTRYPOINT INDEX

**Last Updated**: 2026-01-23T22:18:00+03:00

---

## 👋 HOW TO USE THIS BRAIN

**Context**: You are an AI agent or Developer working on **Inkspire Studio**.
**Constraint**: You cannot "remember" the project. You must read this folder.

### 🛑 START HERE
1. **`01_PROJECT_INDEX.md`**: What is this? (Static, Next.js, No Backend).
2. **`02_ARCHITECTURE_TRUTHS.md`**: The physics of this world (Client-only, GPU morphing, Static Data).

### 🔍 FIND ANSWERS

| Question | File to Read |
| :--- | :--- |
| **"How does the routing work?"** | `04_ROUTES_AND_PAGES.md` |
| **"What Hook should I use?"** | `05_HOOKS_CATALOG.md` |
| **"Where is this component?"** | `06_COMPONENTS_CATALOG.md` |
| **"How do I access data?"** | `07_DATA_SOURCES.md` |
| **"Why is performance slow?"** | `08_PERFORMANCE_PLAYBOOK.md` |
| **"Is this a known risk?"** | `09_RISK_REGISTER.md` |
| **"Can I delete this?"** | `11_DEAD_CODE_AUDIT.md` |
| **"How do I modify code safely?"** | `10_CHANGE_PROTOCOL.md` |
| **"How do I run tests?"** | `14_TESTING_SYSTEM.md` |

**→ Testing Coverage**: Critical-path E2E tests (all 4 routes + desktop/mobile modes) + deterministic unit tests. See `14_TESTING_SYSTEM.md:L151-L227` for full route coverage table.

### 📂 DEEP DIVES
For line-by-line understanding of critical files, check the **`FILE_CONTEXT/`** folder.
- `NineDimensionsBackground` details? → `FILE_CONTEXT/FILE__components__nine-dimensions__NineDimensionsBackground.tsx.md`

### 📚 WALKTHROUGHS
Recent significant changes with proof of work:
- `15_WALKTHROUGH_TESTING_EXPANSION.md` → Critical-path testing expansion (2026-01-23)

### ⚠️ GLOBAL RULE
**If a file is EMPTY**: It means "Not Documented Yet" or "Not Applicable".
**It does NOT mean "Unknown"**. Do not hallucinate content.
Check `01_PROJECT_INDEX.md` for "Known Non-Existent Systems".

---

**System Integrity**: 
- If you change code, YOU MUST UPDATE THESE FILES.
- Always cite EVIDENCE.
