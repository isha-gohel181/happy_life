import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import configReducer from './slices/configSlice';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import forumReducer from './slices/forumSlice';
import newsReducer from './slices/newsSlice';
import personalityReducer from './slices/personalitySlice';
import supportReducer from './slices/supportSlice';
import jobReducer from './slices/jobSlice';
import assignmentReducer from './slices/assignmentSlice';
import dripReducer from './slices/dripSlice';
import chatReducer from './slices/chat';
import dashboardReducer from './slices/dashboardSlice';
import eventReducer from './slices/eventSlice';


export const store = configureStore({
  reducer: {
    courses: courseReducer,
    config: configReducer,
    auth: authReducer,
    profile: profileReducer,
    enrollment: enrollmentReducer,
    forum: forumReducer,
    news: newsReducer,
    personality: personalityReducer,
    support: supportReducer,
    jobs: jobReducer,
    assignments: assignmentReducer,
    drip: dripReducer,
    chat: chatReducer,
    dashboard: dashboardReducer,
    events: eventReducer,

  },
});

