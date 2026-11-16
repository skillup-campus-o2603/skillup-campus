import { Route, Routes } from 'react-router';
import AppLayout from './components/layout/AppLayout.jsx';
//Auth and Identity
import Home from './pages/home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import LostPasword from './pages/lostPassword.jsx';
import Profile from './pages/profile.jsx';
import NotFound from './pages/notFound.jsx';
//Student
import Dashboard from './pages/dashboard.jsx';
import Courses from './pages/courses.jsx';
import DetailsCourse from './pages/detailsCourse.jsx';
import JobBoard from './pages/jobBoard.jsx';
import DetailsJob from './pages/detailsJob.jsx';
//Teacher
import Controlpanel from './pages/controlpanel.jsx';
//Global administration
import ControlPanelAdmin from './pages/controlPanelAdmin.jsx';
// Courses management
import CreateCourse from './pages/createCourse.jsx';
import EditCourse from './pages/editCourse.jsx';
// Teachers management
import Teachers from './pages/teachers.jsx';
import CreateTeacher from './pages/createTeacher.jsx';
import EditTeacher from './pages/editTeacher.jsx';
// Students management
import Students from './pages/students.jsx';
// Administrators management
import Admins from './pages/admins.jsx';
import CreateAdmin from './pages/createAdmin.jsx';
import EditAdmin from './pages/editAdmin.jsx';

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                //Auth and Identity
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="lostPassword" element={<LostPasword />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
                //Student
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="courses" element={<Courses />} />
                {/* <Route path="courses/:id" element={<Courses />} /> */}
                <Route path="detailsCourse" element={<DetailsCourse />} />
                <Route path="jobBoard" element={<JobBoard />} />
                <Route path="detailsJob" element={<DetailsJob />} />
                //Teacher
                <Route path="controlpanel" element={<Controlpanel />} />
                //Global administration
                <Route path="controlPanelAdmin" element={<ControlPanelAdmin />} />
                // Courses management
                <Route path="createCourse" element={<CreateCourse />} />
                <Route path="editCourse" element={<EditCourse />} />
                // Teachers management
                <Route path="teachers" element={<Teachers />} />
                <Route path="createTeacher" element={<CreateTeacher />} />
                <Route path="editTeacher" element={<EditTeacher />} />
                // Students management
                <Route path="students" element={<Students />} />
                // Administrators management
                <Route path="admins" element={<Admins />} />
                <Route path="createAdmin" element={<CreateAdmin />} />
                <Route path="editAdmin" element={<EditAdmin />} />
            </Route>
        </Routes>
    );
}
