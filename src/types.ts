export type ModuleResponse = Array<{
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  template: string;
  aioseo_notices: Array<any>;
  lessons: Array<{
    _type: string;
    lessons_title: string;
    lessons_description: string;
    lesson_topics: Array<{
      _type: string;
      lesson_lessons_title: string;
      lesson_lessons_description: string;
      lesson_lessons_questions: string;
      lesson_topic_books: Array<{
        _type: string;
        lesson_lessons_topic_books_title: string;
        lesson_lessons_topic_books_description: string;
        lesson_lessons_topic_books_start: number;
        lesson_lessons_topic_books_end: number;
        lesson_lessons_topic_books_book: number;
      }>;
    }>;
  }>;
  _links: {
    self: Array<{
      href: string;
    }>;
    collection: Array<{
      href: string;
    }>;
    about: Array<{
      href: string;
    }>;
    "wp:attachment": Array<{
      href: string;
    }>;
    curies: Array<{
      name: string;
      href: string;
      templated: boolean;
    }>;
  };
}>;
