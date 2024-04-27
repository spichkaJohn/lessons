export type ModulesResponse = Array<Module>;

export type Module = {
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
  lessons: Array<{
    _type: string;
    title: string;
    description: string;
    topics: Array<{
      _type: string;
      title: string;
      resources: Array<{
        _type: string;
        title: string;
        document_page_start: number;
        document_page_end: number;
        document: number;
        text: string;
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
};

export type AttachmentResponse = {
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
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Array<any>;
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    filesize: number;
    sizes: {};
  };
  post: any;
  source_url: string;
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
    author: Array<{
      embeddable: boolean;
      href: string;
    }>;
    replies: Array<{
      embeddable: boolean;
      href: string;
    }>;
  };
};

export type ModuleLesson = ModulesResponse[number]["lessons"][number];
export type ModuleLessonTopic = ModuleLesson["topics"][number];
export type ModuleLessonTopicResource = ModuleLessonTopic["resources"][number];

export type Status = "idle" | "pending" | "success" | "error";
