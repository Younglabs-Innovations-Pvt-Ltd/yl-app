export const redirectToCourse = ({navigate, courses, courseId}) => {
  let courseValues = Object.values(courses);

  const all = [];
  for (let i = 0; i < courseValues.length; i++) {
    all.push(...courseValues[i]);
  }

  const filteredCourse = all.filter(course => course.id === courseId)[0];

  return navigate('CourseDetailScreen', {
    courseData: filteredCourse,
  });
};
