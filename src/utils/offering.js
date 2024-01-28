export const generateOffering = currentCourse => {
  const batch1 = {
    ageGroup: currentCourse.ageGroup,
    batchType: currentCourse.batchType,
    classCount: currentCourse.classCount,
    courseId: currentCourse.courseId,
    level: currentCourse.level,
  };
  if (currentCourse?.batchType?.toLowerCase() === 'subscription') {
    const batchesArr = [];
    const months = currentCourse.months;
    console.log('months :', months);
    batchesArr.push({...batch1, months: 1});
    if (months === 'quarterly') {
      for (let i = 1; i < 3; i++) {
        const batch = {...batch1, level: currentCourse.level + i, months: 3};
        batchesArr.push(batch);
      }
    } else if (months === 'halfyYearly') {
      for (let i = 1; i < 6; i++) {
        const batch = {...batch1, level: currentCourse.level + i, months: 1};
        batchesArr.push(batch);
      }
    }

    const offeringObj = {
      batchArr: batchesArr,
      offeringName: `${currentCourse.courseId} ${currentCourse.ageGroup} ${months} ${currentCourse.price}`,
      price: currentCourse.price,
      offeringType: 'subscription',
      monthlyClasses: currentCourse?.classCount,
    };
    return offeringObj;
  } else {
    let batch2;
    let batchArr;
    if (currentCourse.actualItems === 2) {
      batch2 = {...batch1, level: currentCourse.level + 1};
      batchArr = [batch1, batch2];
    } else {
      batchArr = [batch1];
    }

    let courseLevel =
      batchArr.length > 1 ? 'combo' : `level${currentCourse.level}`;

    const offeringName = `${currentCourse.courseId} ${currentCourse.ageGroup} ${courseLevel} ${currentCourse.price}`;
    const offeringObj = {
      batchArr,
      offeringName,
      price: currentCourse.price,
    };

    console.log('offeringObj', offeringObj);

    return offeringObj;
  }
};
