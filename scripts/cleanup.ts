import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

const DB_QUESTION = process.env.NOTION_DB_QUESTIONS_ID || '';

const archivePage = async (id: string) => {
  return notion.pages.update({ page_id: id, archived: true });
};

const getAnsweredQuestionsWithPagination = async ({
  limit = 10,
  cursor,
}: {
  limit: number;
  cursor: string | undefined;
}) => {
  const filter = {
    and: [
      {
        property: 'status',
        status: {
          equals: 'Done',
        },
      },
    ],
  };

  const response = await notion.databases.query({
    database_id: DB_QUESTION,
    filter,
    sorts: [
      {
        property: 'Last edited time',
        direction: 'ascending',
      },
    ],
    page_size: limit,
    start_cursor: cursor,
  });

  return response;
};

const MAX_LOOP = 5;
const SIZE = 100;

const deleteAnsweredQuestions = async () => {
  const archivePagePromises = [];

  let hasMore = true;
  let loop = 1;
  let cursor: string | undefined;

  while (hasMore && loop <= MAX_LOOP) {
    try {
      const response = await getAnsweredQuestionsWithPagination({
        limit: SIZE,
        cursor,
      });

      console.log(`>>> Found ${response.results.length} answered questions`);

      for (const result of response.results) {
        archivePagePromises.push(archivePage(result.id));
      }

      hasMore = response.has_more;
      cursor = response.next_cursor as string;
      loop += 1;
    } catch (_error) {
      hasMore = false;
    }
  }

  console.log(`>>> We will try deleting ${archivePagePromises.length} answered questions...`);
  await Promise.allSettled(archivePagePromises);
};

(async () => {
  if (!process.env.NOTION_SECRET || !process.env.NOTION_DB_QUESTIONS_ID) {
    return;
  } else {
    await deleteAnsweredQuestions();
  }
})();
