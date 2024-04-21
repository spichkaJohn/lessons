"use client";

import { ModuleResponse } from "@/types";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useState, useEffect, useMemo, useRef } from "react";
import slugify from "slugify";
import TopicResource from "../../topic-resources/TopicResource";

const maxWidth = 600;

export default function Page({
  params: { moduleSlug, lessonSlug },
}: {
  params: Params;
}) {
  const [modules, setModules] = useState<ModuleResponse>();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_HOST}/wp-json/wp/v2/module`)
      .then((response) => response.json())
      .then(setModules);
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeModule = useMemo<ModuleResponse[number] | undefined>(() => {
    return modules?.find(
      (module) => moduleSlug === slugify(module.title.rendered)
    );
  }, [modules, moduleSlug]);

  const activeLesson = useMemo<
    ModuleResponse[number]["lessons"][number] | undefined
  >(() => {
    return activeModule?.lessons.find(
      (lesson) => lessonSlug === slugify(lesson.title)
    );
  }, [activeModule, lessonSlug]);

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
    return activeLesson?.topics[activeTopicIdx];
  }, [activeLesson, activeTopicIdx]);

  const activeTopicResourceMeta = useMemo(() => {
    return activeTopicMeta?.resources[activeTopicResourceIdx];
  }, [activeTopicMeta, activeTopicResourceIdx]);

  return (
    <main>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className="accordion sticky-top" id="accordion">
              {activeLesson?.topics.map((topic, topicIdx) => {
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
