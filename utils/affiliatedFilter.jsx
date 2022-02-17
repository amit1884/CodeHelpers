import sortBy from "lodash/sortBy";
/**
 *
 * @param {*} data
 * @param {*} selectedItem
 */
export const extractSelectedFilter = (data, selectedItem) => {
  if (selectedItem) {
    let name = "";
    data.forEach((item) => {
      if (item.value === selectedItem) {
        name = item.name;
      }
    });

    return name;
  }
  if (data.length === 1) {
    return data[0].name;
  }

  return false;
};

/**
 *
 * @param {*} key
 * @param {*} value
 */
export const isActive = (key, value) => {
  if (key === value) {
    return "active";
  }

  return "";
};

/**
 *
 * @param {*} courses
 * @param {*} selectedCourse
 */
export const courseHandler = (courses, selectedCourse) => {
  if (selectedCourse) {
    courses = sortBy(courses, (course) =>
      course.value === selectedCourse ? 0 : 1
    );
  }

  const visibleCourses = courses.slice(0, 2);
  const hiddenCourses = courses.slice(2, courses.length);
  return {
    visibleCourses,
    hiddenCourses,
  };
};
/**
 *
 * @param {*} courses
 * @param {*} selectedCourse
 */
export const mobileCourseHandler = (courses, selectedCourse) => {
  if (selectedCourse) {
    courses = sortBy(courses, (course) =>
      course.value === selectedCourse ? 0 : 1
    );
  }

  return courses;
};
