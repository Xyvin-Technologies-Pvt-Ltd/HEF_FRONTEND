import { create } from "zustand";
import { addCourse } from "../api/courseapi";

const useCourseStore = create((set) => ({
  addCourses: async (data) => {
    await addCourse(data);
  },
}));

export { useCourseStore };
