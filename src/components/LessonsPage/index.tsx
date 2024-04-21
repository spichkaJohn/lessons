"use client";

import { ModuleResponse } from "@/types";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useState, useEffect, useMemo, useCallback } from "react";
import { pdfjs, Page, Document } from "react-pdf";
import slugify from "slugify";

const maxWidth = 600;
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
export default function LessonsPage({
  params: { moduleSlug, lessonSlug },
}: {
  params: Params;
}) {
  const [modules, setModules] = useState<ModuleResponse>();
  const [containerWidth, setContainerWidth] = useState<number>();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_HOST}/wp-json/wp/v2/lesson`)
      .then((response) => response.json())
      .then((data) => {
        setModules(data);
      });
  }, [setModules]);

  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  const activeModule = useMemo<ModuleResponse[number] | undefined>(() => {
    return modules?.find(
      (module) => moduleSlug === slugify(module.title.rendered)
    );
  }, [modules, moduleSlug]);

  const lesson = useMemo<
    ModuleResponse[number]["lessons"][number] | undefined
  >(() => {
    return activeModule?.lessons.find(
      (lesson) => lessonSlug === slugify(lesson.lessons_title)
    );
  }, [activeModule, lessonSlug]);

  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [activeTopicBookIndex, setActiveTopicBookIndex] = useState<number>(0);
  const [activeTopicQuestionIndex, setActiveTopicQuestionIndex] =
    useState<number>();

  useEffect(() => {
    window.addEventListener("resize", () => {
      setContainerWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setContainerWidth(window.innerWidth);
      });
    };
  }, []);

  useEffect(() => {
    setContainerWidth(window.innerWidth);
  }, []);

  const [filesMap, setFilesMap] = useState<Record<number, string>>({});

  const fileUrl = useCallback(
    (fileId: number) => {
      if (filesMap[fileId]) {
        return filesMap[fileId];
      }

      fetch(`${process.env.NEXT_PUBLIC_HOST}/wp-json/wp/v2/media/${fileId}`)
        .then((response) => response.json())
        .then((data) => {
          setFilesMap({ ...filesMap, [fileId]: data.source_url });
        });
    },
    [filesMap]
  );
  return (
    <main>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="accordion sticky-top">
              {lesson?.lesson_topics.map((topic, topicIndex) => {
                return (
                  <div key={topicIndex} className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        onClick={() => setActiveTopicIndex(topicIndex)}
                        data-bs-target={`#topic_${slugify(topic.lesson_lessons_title)}`}
                        aria-expanded="true"
                        aria-controls={`topic_${slugify(topic.lesson_lessons_title)}`}
                      >
                        {topic.lesson_lessons_title}
                      </button>
                    </h2>
                    <div
                      id={`topic_${slugify(topic.lesson_lessons_title)}`}
                      className="accordion-collapse collapse"
                    >
                      <div className="accordion-body">
                        <ul className="nav flex-column nav-pills">
                          {lesson?.lesson_topics[
                            topicIndex
                          ].lesson_topic_books.map((book, index) => {
                            return (
                              <li className="nav-item" key={index}>
                                <a
                                  className={`nav-link ${activeTopicBookIndex === index && activeTopicIndex === topicIndex ? "active" : ""} `}
                                  id={`${slugify(book.lesson_lessons_topic_books_title)}-tab`}
                                  data-bs-toggle="tab"
                                  data-bs-target={`#${slugify(book.lesson_lessons_topic_books_title)}`}
                                  type="button"
                                  role="tab"
                                  onClick={() => {
                                    setActiveTopicQuestionIndex(undefined);
                                    setActiveTopicIndex(topicIndex);
                                    setActiveTopicBookIndex(index);
                                  }}
                                >
                                  {book.lesson_lessons_topic_books_title}
                                </a>
                              </li>
                            );
                          })}

                          <li
                            className="nav-item"
                            key={`${slugify(topic.lesson_lessons_title)}_questions-tab`}
                          >
                            <a
                              className={`nav-link  ${activeTopicQuestionIndex === topicIndex ? "active" : ""} `}
                              id={`${slugify(topic.lesson_lessons_title)}_questions-tab`}
                              data-bs-toggle="tab"
                              data-bs-target={`#${slugify(topic.lesson_lessons_title)}_questions`}
                              type="button"
                              role="tab"
                              onClick={() =>
                                setActiveTopicQuestionIndex(topicIndex)
                              }
                            >
                              Вопросы
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-md-8">
            <div className="tab-content" id="myTabContent">
              {lesson?.lesson_topics[activeTopicIndex].lesson_topic_books.map(
                (book, index) => {
                  return (
                    <div
                      className={`tab-pane fade ${index === activeTopicBookIndex ? "show active" : ""}`}
                      id={`${slugify(book.lesson_lessons_topic_books_title)}`}
                      key={`${slugify(book.lesson_lessons_topic_books_title)}`}
                      role="tabpanel"
                      aria-labelledby={`${slugify(book.lesson_lessons_topic_books_title)}-tab`}
                      ref={setContainerRef}
                    >
                      {book.lesson_lessons_topic_books_book && (
                        <Document
                          file={fileUrl(book.lesson_lessons_topic_books_book)}
                        >
                          {(() => {
                            const elements = [];
                            for (
                              let i = +book.lesson_lessons_topic_books_start;
                              i <= +book.lesson_lessons_topic_books_end;
                              i++
                            ) {
                              elements.push(
                                <div key={i}>
                                  <Page
                                    pageNumber={i}
                                    width={
                                      containerWidth
                                        ? Math.min(containerWidth, maxWidth)
                                        : maxWidth
                                    }
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                  />
                                </div>
                              );
                            }
                            return elements;
                          })()}
                        </Document>
                      )}
                    </div>
                  );
                }
              )}

              {lesson?.lesson_topics.map((topic, index) => {
                return (
                  <div
                    className={`tab-pane fade  ${index === activeTopicQuestionIndex ? "show active" : ""}`}
                    id={`${slugify(topic.lesson_lessons_title)}_questions`}
                    key={`${slugify(topic.lesson_lessons_title)}_questions`}
                    role="tabpanel"
                    aria-labelledby={`${slugify(topic.lesson_lessons_title)}_questions-tab`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: topic.lesson_lessons_questions,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
