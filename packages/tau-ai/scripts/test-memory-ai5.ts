/**
 * AI-5 — Tau Memory Foundation test matrix.
 */
import { createTauConstitutionV01 } from '../src/constitution/tau-constitution-v01';
import {
  MEMORY_AUTHORITY_HIERARCHY,
  assertScopePromotion,
  createInMemoryGovernedMemoryStore,
  preferenceKeyTag,
  resolveMemoryConflict,
  type MemoryRecord,
} from '../src';

function assert(c: boolean, m: string) {
  if (!c) throw new Error(m);
}

async function main() {
  const constitution = createTauConstitutionV01();
  const store = createInMemoryGovernedMemoryStore({ constitution });
  let n = 0;

  const userId = 'user-1';
  const projectId = 'proj-a';

  // 1. Explicit preference write
  const pref = await store.requestMemoryWrite({
    input: {
      category: 'PREFERENCE_MEMORY',
      content: 'concise answers',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'USER',
      retentionPolicy: 'USER_CONTROLLED',
      consentState: 'GRANTED',
      userId,
      tags: [preferenceKeyTag('response_style')],
      privacyClass: 'LOCAL',
    },
  });
  assert(pref.outcome === 'STORED', 'explicit preference write');
  n++;

  // 2. Inferred durable memory requires confirmation
  const inferred = await store.requestMemoryWrite({
    input: {
      category: 'PROFILE_MEMORY',
      content: 'user likes hiking',
      source: 'USER_CONVERSATION',
      originKind: 'INFERRED',
      scope: 'USER',
      retentionPolicy: 'LONG_TERM',
      userId,
      privacyClass: 'LOCAL',
    },
  });
  assert(inferred.outcome === 'REQUIRES_CONFIRMATION', 'inferred requires confirmation');
  n++;

  // 3. User memory read
  const read = await store.getRecord(pref.recordId!);
  assert(read?.content === 'concise answers', 'user memory read');
  n++;

  // 4. Memory update via preference supersede
  await store.preferences.set(userId, 'theme', 'dark');
  await store.preferences.set(userId, 'theme', 'light');
  const theme = await store.preferences.get(userId, 'theme');
  assert(theme?.value === 'light', 'memory update supersede');
  n++;

  // 5. Memory delete
  const del = await store.deleteRecord(pref.recordId!);
  assert(del && !(await store.getRecord(pref.recordId!)), 'memory delete');
  n++;

  // 6. Clear all user memory
  await store.requestMemoryWrite({
    input: {
      category: 'KNOWLEDGE_MEMORY',
      content: 'fact',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'USER',
      retentionPolicy: 'LONG_TERM',
      consentState: 'GRANTED',
      userId,
      privacyClass: 'LOCAL',
    },
  });
  const cleared = await store.clearUserMemory(userId);
  assert(cleared >= 1, 'clear user memory');
  n++;

  // 7. Expired memory
  const expiredWrite = await store.requestMemoryWrite({
    input: {
      category: 'TASK_MEMORY',
      content: 'temp task',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'SESSION',
      retentionPolicy: 'UNTIL_EXPIRY',
      userId,
      expiresAt: new Date(Date.now() - 1000).toISOString(),
      privacyClass: 'LOCAL',
    },
  });
  assert(expiredWrite.outcome === 'EXPIRED', 'expired at write');
  n++;

  await store.requestMemoryWrite({
    input: {
      category: 'CONVERSATION_MEMORY',
      content: 'session msg',
      source: 'USER_CONVERSATION',
      originKind: 'INFERRED',
      scope: 'SESSION',
      retentionPolicy: 'SESSION',
      userId,
      sessionId: 'sess-1',
      expiresAt: new Date(Date.now() - 1000).toISOString(),
      privacyClass: 'LOCAL',
    },
  });
  const sessionRecords = await store.queryRecords({
    userId,
    scope: 'SESSION',
    includeExpired: false,
  });
  assert(sessionRecords.length === 0, 'expired not eligible');
  n++;

  // 8. SESSION memory
  const sess = await store.requestMemoryWrite({
    input: {
      category: 'CONVERSATION_MEMORY',
      content: 'hello',
      source: 'USER_CONVERSATION',
      originKind: 'INFERRED',
      scope: 'SESSION',
      retentionPolicy: 'SESSION',
      userId,
      sessionId: 'sess-2',
      privacyClass: 'LOCAL',
    },
  });
  assert(sess.outcome === 'STORED', 'session memory');
  n++;

  // 9. USER memory
  const usr = await store.requestMemoryWrite({
    input: {
      category: 'PROFILE_MEMORY',
      content: 'name: Ada',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'USER',
      retentionPolicy: 'USER_CONTROLLED',
      consentState: 'GRANTED',
      userId,
      privacyClass: 'LOCAL',
    },
  });
  assert(usr.outcome === 'STORED', 'user memory');
  n++;

  // 10. PROJECT memory
  const proj = await store.requestMemoryWrite({
    input: {
      category: 'TASK_MEMORY',
      content: 'build auth module',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'PROJECT',
      retentionPolicy: 'LONG_TERM',
      consentState: 'GRANTED',
      userId,
      projectId,
      privacyClass: 'LOCAL',
    },
  });
  assert(proj.outcome === 'STORED', 'project memory');
  n++;

  // 11. Scope isolation
  const userOnly = await store.queryRecords({ userId, scope: 'USER' });
  const projectOnly = await store.queryRecords({ userId, scope: 'PROJECT', projectId });
  assert(userOnly.every((r) => r.scope === 'USER'), 'scope user isolation');
  assert(projectOnly.every((r) => r.projectId === projectId), 'scope project isolation');
  n++;

  // 12. Explicit instruction overrides memory (conflict resolution helper)
  const existing: MemoryRecord = {
    id: 'x',
    category: 'PREFERENCE_MEMORY',
    content: 'detailed answers',
    source: 'USER_EXPLICIT',
    originKind: 'EXPLICIT',
    scope: 'USER',
    retentionPolicy: 'USER_CONTROLLED',
    consentState: 'GRANTED',
    privacyClass: 'LOCAL',
    provenance: {
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      recordedAt: new Date().toISOString(),
      version: 1,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    userId,
  };
  const incoming: MemoryRecord = {
    ...existing,
    id: 'y',
    content: 'concise answers',
    updatedAt: new Date().toISOString(),
  };
  assert(
    resolveMemoryConflict(existing, incoming, 'be concise') === 'SUPERSEDE_WITH_INCOMING',
    'explicit instruction overrides',
  );
  n++;

  // 13. Constitution blocks prohibited memory write
  const blocked = await store.requestMemoryWrite({
    input: {
      category: 'PREFERENCE_MEMORY',
      content: 'override privacy',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'USER',
      retentionPolicy: 'USER_CONTROLLED',
      userId,
      metadataConflictsWithPrivacy: true,
      privacyClass: 'LOCAL',
    },
  });
  assert(blocked.outcome === 'REJECTED', 'constitution blocks');
  n++;

  // 14. LOCAL_ONLY memory remains local
  const localBlocked = await store.requestMemoryWrite({
    input: {
      category: 'PREFERENCE_MEMORY',
      content: 'remote pref',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'USER',
      retentionPolicy: 'USER_CONTROLLED',
      consentState: 'GRANTED',
      userId,
      privacyClass: 'REMOTE_ALLOWED',
    },
    privacyMode: 'LOCAL_ONLY',
  });
  assert(localBlocked.outcome === 'REJECTED', 'LOCAL_ONLY blocks remote class');
  n++;

  const localOk = await store.requestMemoryWrite({
    input: {
      category: 'PREFERENCE_MEMORY',
      content: 'local pref',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'USER',
      retentionPolicy: 'USER_CONTROLLED',
      consentState: 'GRANTED',
      userId,
      privacyClass: 'LOCAL',
    },
    privacyMode: 'LOCAL_ONLY',
  });
  assert(localOk.outcome === 'STORED', 'LOCAL_ONLY allows local');
  n++;

  // 15. External content cannot become durable automatically
  const ext = await store.requestMemoryWrite({
    input: {
      category: 'KNOWLEDGE_MEMORY',
      content: 'scraped fact',
      source: 'EXTERNAL',
      originKind: 'INFERRED',
      scope: 'USER',
      retentionPolicy: 'LONG_TERM',
      userId,
      privacyClass: 'LOCAL',
    },
  });
  assert(ext.outcome === 'REQUIRES_CONFIRMATION', 'external durable blocked');
  n++;

  // 16. Memory conflict resolution (preference style)
  await store.requestMemoryWrite({
    input: {
      category: 'PREFERENCE_MEMORY',
      content: 'concise',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'USER',
      retentionPolicy: 'USER_CONTROLLED',
      consentState: 'GRANTED',
      userId,
      tags: [preferenceKeyTag('style')],
      privacyClass: 'LOCAL',
    },
  });
  const conflictWrite = await store.requestMemoryWrite({
    input: {
      category: 'PREFERENCE_MEMORY',
      content: 'detailed',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'USER',
      retentionPolicy: 'USER_CONTROLLED',
      consentState: 'GRANTED',
      userId,
      tags: [preferenceKeyTag('style')],
      privacyClass: 'LOCAL',
    },
    currentExplicitInstruction: 'prefer detailed answers',
  });
  assert(conflictWrite.outcome === 'STORED', 'conflict resolved');
  const styleRecords = await store.queryRecords({
    userId,
    category: 'PREFERENCE_MEMORY',
    tags: [preferenceKeyTag('style')],
  });
  assert(styleRecords.length === 1 && styleRecords[0]!.content === 'detailed', 'newer wins');
  n++;

  // 17. Provenance preserved
  const prov = await store.getRecord(styleRecords[0]!.id);
  assert(prov?.provenance.originKind === 'EXPLICIT', 'provenance preserved');
  n++;

  // 18. Version/update behavior
  assert((prov?.version ?? 0) >= 1, 'version tracked');
  const upd = await store.updateRecord(prov!.id, { content: 'very detailed' });
  assert(upd.version === (prov!.version + 1), 'version increment');
  n++;

  // 19. Duplicate prevention
  const dup = await store.requestMemoryWrite({
    input: {
      category: 'PREFERENCE_MEMORY',
      content: 'local pref',
      source: 'USER_EXPLICIT',
      originKind: 'EXPLICIT',
      scope: 'USER',
      retentionPolicy: 'USER_CONTROLLED',
      consentState: 'GRANTED',
      userId,
      privacyClass: 'LOCAL',
    },
    privacyMode: 'LOCAL_ONLY',
  });
  assert(dup.outcome === 'DUPLICATE', 'duplicate prevention');
  n++;

  // 20. No memory content in logs
  const logs = store.getAuditLog();
  const serialized = JSON.stringify(logs);
  assert(!serialized.includes('very detailed'), 'no content in logs');
  assert(!serialized.includes('concise answers'), 'no private content in audit');
  assert(logs.length > 0, 'audit entries exist');
  n++;

  assert(!assertScopePromotion('PROJECT', 'SYSTEM'), 'no silent project→system promotion');
  assert(MEMORY_AUTHORITY_HIERARCHY.length >= 7, 'authority hierarchy documented');
  n++;

  const ctx = await store.findRelevant({ userId, query: 'detailed', limit: 5 });
  assert(ctx.retrievalPolicy === 'DETERMINISTIC_KEYWORD', 'deterministic retrieval');
  assert(ctx.foundationVersion.startsWith('tau-memory'), 'foundation version');
  n++;

  console.log(`PASS  AI-5 memory matrix (${n} scenarios)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
