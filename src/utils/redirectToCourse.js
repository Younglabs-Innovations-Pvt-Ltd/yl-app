export const redirectToCourse = ({navigate, courses, courseId, subScreen}) => {
  let courseValues = Object.values(courses);

  const all = [];
  for (let i = 0; i < courseValues.length; i++) {
    all.push(...courseValues[i]);
  }

  const filteredCourse = all.filter(course => course.id === courseId)[0];

  const params = {
    courseData: filteredCourse,
  };

  if (subScreen) {
    params.subScreenToShow = subScreen;
  }

  return navigate('CourseDetailScreen', params);
};
