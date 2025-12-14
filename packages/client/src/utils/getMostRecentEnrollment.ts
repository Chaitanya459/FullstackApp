import { StudentEnrollmentDTO } from 'rsd';

export const getMostRecentEnrollment = (enrollments?: StudentEnrollmentDTO[]) => {
  if (!enrollments || enrollments.length === 0) {
    return null;
  }

  if (enrollments.length === 1) {
    return enrollments[0];
  }

  return enrollments.reduce((latest, current) => {
    const latestDate = new Date(latest.updatedAt || latest.createdAt || 0);
    const currentDate = new Date(current.updatedAt || current.createdAt || 0);
    return currentDate > latestDate ? current : latest;
  });
};
