import fs from 'fs';
import path from 'path';
import { createTestRun, addResult, closeTestRun } from '../utils/testrail-reporter';

interface Annotation {
  type: string;
  description?: string;
}

interface Test {
  title: string;
  annotations: Annotation[];
  outcome: 'passed' | 'failed' | 'skipped' | string;
  error?: { message?: string };
}

interface Spec {
  tests: Test[];
}

interface Suite {
  specs: Spec[];
}

interface TestResults {
  suites: Suite[];
}

(async () => {
  const resultsPath = path.resolve('../test-results/test-results.json');
  const rawData = fs.readFileSync(resultsPath, 'utf-8');
  const data: TestResults = JSON.parse(rawData);

  const runId = await createTestRun('Manual Report Run', []);

  for (const suite of data.suites) {
    for (const spec of suite.specs) {
      for (const test of spec.tests) {
        const title = test.title;
        const annotations = test.annotations || [];

        const caseIds = [
          ...(title.match(/@C(\d+)/gi) || []),
          ...annotations
            .map((a) => a.description)
            .filter((d): d is string => !!d && /^@C\d+/.test(d)),
        ].map((s) => Number(s.replace('@C', '')));

        const statusMap: Record<string, number> = { passed: 1, failed: 5, skipped: 2 };
        const status = statusMap[test.outcome] ?? 4;
        const message = test.error?.message || 'Test completed';

        for (const id of caseIds) {
          console.log(`➡️ Reporting case @C${id} with status ${status}`);
          await addResult(runId, id, status, message);
        }
      }
    }
  }

  await closeTestRun(runId);
})();