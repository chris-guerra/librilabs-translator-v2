# Next Steps

## UX Expert Prompt

Create a front-end specification document for Librilabs Translator using the PRD at `docs/prd.md` as input. Focus on the core screens (Upload, Translation Progress, Side-by-Side Comparison/Edit, Download) and ensure the design addresses the high-complexity areas: synchronized scrolling with paragraph alignment, progress saving UI, and in-place editing. Use Untitled UI components exclusively and follow the brand guidelines specified in the PRD. Pay special attention to the paragraph alignment requirements where the original document structure dictates alignment, not the translation structure.

**Command:** `@ux-expert *create-front-end-spec`

## Architect Prompt

Create a full-stack architecture document for Librilabs Translator using the PRD at `docs/prd.md` as input. Prioritize investigation of the high-complexity areas flagged in the PRD: synchronized scrolling implementation, paragraph alignment algorithm, and progress saving data structure. Design the system to support future authentication integration (user_id fields nullable for MVP). Ensure the architecture supports the monolith FastAPI + Next.js structure with PostgreSQL, and addresses performance requirements for documents up to 100 pages.

**Command:** `@architect *create-full-stack-architecture`

