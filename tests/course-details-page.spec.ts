import { test, expect } from './fixtures';

test.describe('Course Details page', () => {
  test('has title and rating', {tag: '@aff2005d'}, async ({ courseDetailsPage }) => {
    await courseDetailsPage.toBeDisplayed();
    await expect(courseDetailsPage.page).toHaveTitle(
      'Quality Assurance (QA) Techniques | Free Online Course | Alison'
    );
  });

  test('search for courses on a specific topic', {tag: '@69dc556d'}, async ({ courseDetailsPage }) => {
    expect(courseDetailsPage.page.url()).toContain(`/course/quality-assurance-qa-techniques-and-methodologies`);
  });
});
