"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import slugify from "slugify";
import TopicResource from "../../topic-resources/TopicResource";
import { Module, ModuleLesson } from "@/types";

const maxWidth = 600;

type Props = {
  lesson: ModuleLesson;
  module: Module;
  lessonIndex: number;
};

export default function Page({
  props: { lesson, module, lessonIndex },
}: {
  props: Props;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  /** + Container width */
  const [containerWidth, setContainerWidth] = useState<number>();
  useEffect(() => {
    const fn = () => {
      setContainerWidth(window.innerWidth);
    };

    fn();
    window.addEventListener("resize", fn);
    return () => {
      window.removeEventListener("resize", fn);
    };
  }, []);
  /** - Container width */

  const [activeTopicIdx, setActiveTopicIdx] = useState<number>(0);
  const [activeTopicResourceIdx, setActiveTopicResourceIdx] =
    useState<number>(0);

  const activeTopicMeta = useMemo(() => {
    return lesson?.topics[activeTopicIdx];
  }, [lesson, activeTopicIdx]);

  const activeTopicResourceMeta = useMemo(() => {
    return activeTopicMeta?.resources[activeTopicResourceIdx];
  }, [activeTopicMeta, activeTopicResourceIdx]);

  const scrollKey = useMemo(() => {
    return `${module.id}_${lessonIndex}_${activeTopicIdx}_${activeTopicResourceIdx}_scroll`;
  }, [activeTopicIdx, activeTopicResourceIdx]);

  useEffect(() => {
    const onScroll = () => {
      const { scrollY } = window;

      localStorage.setItem(scrollKey, String(scrollY));
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [scrollKey]);

  const onResourceLoadSuccess = useCallback(() => {
    const scrollValue = localStorage.getItem(scrollKey);

    if (scrollValue) {
      setTimeout(() => {
        window.scrollTo(0, Number(scrollValue));
      }, 1000);
    }
  }, [scrollKey]);

  return (
    <main>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="accordion sticky-top" id="accordion">
              {lesson?.topics.map((topic, topicIdx) => {
                const targetId = `target__${slugify(topic.title)}`;
                const toggleId = `toggle__${slugify(topic.title)}`;

                return (
                  <div key={topicIdx} className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        id={toggleId}
                        aria-expanded="true"
                        className={`accordion-button collapsed`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${targetId}`}
                        onClick={() => {
                          setActiveTopicIdx(topicIdx);
                          setActiveTopicResourceIdx(0);
                        }}
                      >
                        {topic.title}
                      </button>
                    </h2>
                    <div
                      id={targetId}
                      className={`accordion-collapse collapse ${activeTopicIdx === topicIdx ? "show" : ""}`}
                      data-bs-parent="#accordion"
                      aria-labelledby={toggleId}
                    >
                      <div className="accordion-body">
                        <ul className="nav flex-column nav-pills">
                          {topic.resources.map((resource, resouceIdx) => (
                            <li className="nav-item" key={resource.title}>
                              <a
                                className={`nav-link ${activeTopicResourceIdx === resouceIdx ? "active" : ""} `}
                                id={`${slugify(resource.title)}-tab`}
                                type="button"
                                role="tab"
                                onClick={() => {
                                  setActiveTopicResourceIdx(resouceIdx);
                                }}
                              >
                                {resource.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-md-8">
            <div ref={containerRef}>
              {activeTopicResourceMeta ? (
                <TopicResource
                  onLoadSuccess={onResourceLoadSuccess}
                  resource={activeTopicResourceMeta}
                  documentWidth={
                    containerWidth
                      ? Math.min(containerWidth, maxWidth)
                      : maxWidth
                  }
                />
              ) : (
                "Loading metadata"
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
