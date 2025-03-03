import React, { useState } from "react";
import PreNav from "../components/Navbar/PreNav";
import {
  FlagAltSolid,
  TimeFive,
  BookContent,
  Bookmark,
  PurchaseTag,
  Play,
} from "../assets";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("difficult");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const renderedTabContent = () => {
    switch (activeTab) {
      case "difficult":
        return (
          <>
            <div className="tag-content">
              <div className="tag-icon-difficult">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">
                Advanced React Patterns difficult
              </div>
            </div>
            <div className="tag-content">
              <div className="tag-icon-difficult">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">
                Advanced React Patterns difficult
              </div>
            </div>
            <div className="tag-content">
              <div className="tag-icon-difficult">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">
                Advanced React Patterns difficult
              </div>
            </div>
            <div className="tag-content">
              <div className="tag-icon-difficult">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">
                Advanced React Patterns difficult
              </div>
            </div>
          </>
        );

      case "need review":
        return (
          <>
            <div className="tag-content">
              <div className="tag-icon-need-review">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">
                Introduction to Javascript
              </div>
            </div>
            <div className="tag-content">
              <div className="tag-icon-need-review">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">
                Introduction to Javascript
              </div>
            </div>
            <div className="tag-content">
              <div className="tag-icon-need-review">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">
                Introduction to Javascript
              </div>
            </div>
            <div className="tag-content">
              <div className="tag-icon-need-review">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">
                Introduction to Javascript
              </div>
            </div>
          </>
        );
      case "important":
        return (
          <>
            <div className="tag-content">
              <div className="tag-icon-important">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">Class based components</div>
            </div>
            <div className="tag-content">
              <div className="tag-icon-important">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">Class based components</div>
            </div>
            <div className="tag-content">
              <div className="tag-icon-important">
                <PurchaseTag />
              </div>
              <div className="tag-content-title">Class based components</div>
            </div>
          </>
        );
    }
  };
  return (
    <>
      <PreNav name={"Dashboard"} />
      <div className="inner-container">
        <div className="welcome-streak">
          <div className="welcome">
            <div className="welcome-heading">Welcome Back</div>
            <div className="student-name">Rakesh</div>
          </div>
          <div className="streak">
            <div className="hrs-this-week">
              <TimeFive /> 28.8 hrs this week
            </div>
            <div className="streak-days">
              <FlagAltSolid /> 7 days streak!
            </div>
          </div>
        </div>
        <div className="current-progress-quick-stats">
          <div className="current-progress">
            <div className="current-progress-name">Current Progress</div>
            <div className="current-progress-categories">
              <div className="current-progress-categories-wrap">
                <div className="current-progress-categories-name">
                  Web Developement
                </div>
                <div className="current-progress-categories-percentage">
                  75%
                </div>
              </div>
              <div className="current-progress-bar">
                <div
                  className="current-progress-bar-filled"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
            <div className="current-progress-categories">
              <div className="current-progress-categories-wrap">
                <div className="current-progress-categories-name">
                  Web Developement
                </div>
                <div className="current-progress-categories-percentage">
                  75%
                </div>
              </div>
              <div className="current-progress-bar">
                <div
                  className="current-progress-bar-filled"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
            <div className="current-progress-categories">
              <div className="current-progress-categories-wrap">
                <div className="current-progress-categories-name">
                  Web Developement
                </div>
                <div className="current-progress-categories-percentage">
                  75%
                </div>
              </div>
              <div className="current-progress-bar">
                <div
                  className="current-progress-bar-filled"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="quick-stats">
            <div className="quick-stats-name">Quick Stats</div>
            <div className="quick-stats-data-wrap">
              <div className="quick-stats-data">
                <BookContent />
                Completed Courses
              </div>
              2/8
            </div>
            <div className="quick-stats-data-wrap">
              <div className="quick-stats-data">
                <Play />
                Currently Watching
              </div>
              2 Courses
            </div>
            <div className="quick-stats-data-wrap">
              <div className="quick-stats-data">
                <Bookmark />
                Bookmark
              </div>
              8 Lectures
            </div>
          </div>
        </div>

        <div className="watch-time-analytics">
          <div className="watch-time-analytics-graph">
            <div className="watch-time-title">Watch Time Analytics</div>
            <div className="watch-time-details">
              Your learning activity this week
            </div>
            <div className="graph-div">
              <div className="graph-div-wrap">
                <div className="graph-hour">3.2hr</div>
                <div
                  className="graph-bar"
                  style={{
                    height: "60%",
                    backgroundColor: "#0a2463",
                    width: "2.5rem",
                  }}
                ></div>
                <div className="graph-day">Mon</div>
              </div>
              <div className="graph-div-wrap">
                <div className="graph-hour">3.2hr</div>
                <div
                  className="graph-bar"
                  style={{
                    height: "30%",
                    backgroundColor: "#0a2463",
                    width: "2.5rem",
                  }}
                ></div>
                <div className="graph-day">Tue</div>
              </div>
              <div className="graph-div-wrap">
                <div className="graph-hour">3.2hr</div>
                <div
                  className="graph-bar"
                  style={{
                    height: "30%",
                    backgroundColor: "#0a2463",
                    width: "2.5rem",
                  }}
                ></div>
                <div className="graph-day">Wed</div>
              </div>
              <div className="graph-div-wrap">
                <div className="graph-hour">3.2hr</div>
                <div
                  className="graph-bar"
                  style={{
                    height: "30%",
                    backgroundColor: "#0a2463",
                    width: "2.5rem",
                  }}
                ></div>
                <div className="graph-day">Thu</div>
              </div>
              <div className="graph-div-wrap">
                <div className="graph-hour">3.2hr</div>
                <div
                  className="graph-bar"
                  style={{
                    height: "30%",
                    backgroundColor: "#0a2463",
                    width: "2.5rem",
                  }}
                ></div>
                <div className="graph-day">Fri</div>
              </div>
              <div className="graph-div-wrap">
                <div className="graph-hour">3.2hr</div>
                <div
                  className="graph-bar"
                  style={{
                    height: "30%",
                    backgroundColor: "#0a2463",
                    width: "2.5rem",
                  }}
                ></div>
                <div className="graph-day">Sat</div>
              </div>
              <div className="graph-div-wrap">
                <div className="graph-hour">3.2hr</div>
                <div
                  className="graph-bar"
                  style={{
                    height: "30%",
                    backgroundColor: "#0a2463",
                    width: "2.5rem",
                  }}
                ></div>
                <div className="graph-day">Sun</div>
              </div>
            </div>
          </div>
          <div className="watch-time-analytics-categories">
            <div className="watch-time-category-details">
              Your watch time by categories
            </div>
            <div className="graph-div-categories">
              <div className="graph-name">Web</div>
              <div className="graph-div-wrap-categories">
                <div
                  className="graph-bar-categories"
                  style={{
                    width: "60%",
                    backgroundColor: "#0a2463",
                    height: "1rem",
                  }}
                ></div>
                <div className="graph-hour">6hr</div>
              </div>
              <div className="graph-name">Mobile</div>
              <div className="graph-div-wrap-categories">
                <div
                  className="graph-bar-categories"
                  style={{
                    width: "30%",
                    backgroundColor: "#0a2463",
                    height: "1rem",
                  }}
                ></div>
                <div className="graph-hour">2.4hr</div>
              </div>
              <div className="graph-name">Finance</div>
              <div className="graph-div-wrap-categories">
                <div
                  className="graph-bar-categories"
                  style={{
                    width: "30%",
                    backgroundColor: "#0a2463",
                    height: "1rem",
                  }}
                ></div>
                <div className="graph-hour">3hr</div>
              </div>
              <div className="graph-name">Health</div>
              <div className="graph-div-wrap-categories">
                <div
                  className="graph-bar-categories"
                  style={{
                    width: "30%",
                    backgroundColor: "#0a2463",
                    height: "1rem",
                  }}
                ></div>
                <div className="graph-hour">5hr</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bookmark-tags">
          <div className="bookmark">
            <div className="bookmark-name">Bookmark</div>
            <div className="bookmarks">
              <div className="bookmark-icon">
                <Bookmark />
              </div>
              <div className="bookmark-title">Advanced React Patterns</div>
            </div>
            <div className="bookmarks">
              <div className="bookmark-icon">
                <Bookmark />
              </div>
              <div className="bookmark-title">Advanced React Patterns</div>
            </div>
            <div className="bookmarks">
              <div className="bookmark-icon">
                <Bookmark />
              </div>
              <div className="bookmark-title">Advanced React Patterns</div>
            </div>
            <div className="bookmarks">
              <div className="bookmark-icon">
                <Bookmark />
              </div>
              <div className="bookmark-title">Advanced React Patterns</div>
            </div>
          </div>
          <div className="tags">
            <div className="tag-tab-group">
              <div className="tag-name">Tags</div>
              <div className="tag-tab">
                <div
                  className={
                    activeTab == "difficult"
                      ? "tag-difficult active-tag-tab"
                      : "tag-difficult"
                  }
                  onClick={() => handleTabChange("difficult")}
                >
                  difficult
                </div>
                <div
                  className={
                    activeTab == "need review"
                      ? "tag-need-review active-tag-tab"
                      : "tag-need-review"
                  }
                  onClick={() => handleTabChange("need review")}
                >
                  need review
                </div>
                <div
                  onClick={() => handleTabChange("important")}
                  className={
                    activeTab == "important"
                      ? "tag-important active-tag-tab"
                      : "tag-important"
                  }
                >
                  important
                </div>
              </div>
            </div>
            {renderedTabContent()}
          </div>
        </div>

        <div className="dashboard-notes">
          <div className="notes-name">Notes</div>
          <div className="dashboard-notes-wrap">
            <div className="notes-card">
              <div className="notes-title">React Hooks Deep Dive</div>
              <div className="notes-content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure,
                distinctio corporis molestias vero sed voluptatem?
              </div>
            </div>
            <div className="notes-card">
              <div className="notes-title">React Hooks Deep Dive</div>
              <div className="notes-content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure,
                distinctio corporis molestias vero sed voluptatem?
              </div>
            </div>
            <div className="notes-card">
              <div className="notes-title">React Hooks Deep Dive</div>
              <div className="notes-content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure,
                distinctio corporis molestias vero sed voluptatem?
              </div>
            </div>
            <div className="notes-card">
              <div className="notes-title">React Hooks Deep Dive</div>
              <div className="notes-content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure,
                distinctio corporis molestias vero sed voluptatem?
              </div>
            </div>
            <div className="notes-card">
              <div className="notes-title">React Hooks Deep Dive</div>
              <div className="notes-content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure,
                distinctio corporis molestias vero sed voluptatem?
              </div>
            </div>
            <div className="notes-card">
              <div className="notes-title">React Hooks Deep Dive</div>
              <div className="notes-content">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Expedita corrupti, sequi illum.
              </div>
            </div>
            <div className="notes-card">
              <div className="notes-title">React Hooks Deep Dive</div>
              <div className="notes-content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure,
                distinctio corporis molestias vero sed voluptatem?
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
