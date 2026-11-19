import { Route, Routes } from 'react-router';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

//Auth and Identity
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import LostPassword from './pages/lostPassword.jsx';
import Profile from './pages/profile.jsx';
import NotFound from './pages/notFound.jsx';

//Student
import Dashboard from './pages/dashboard.jsx';
import Courses from './pages/courses.jsx';
import DetailsCourse from './pages/detailsCourse.jsx';
import JobBoard from './pages/jobBoard.jsx';
import DetailsJob from './pages/detailsJob.jsx';

//Teacher
import ControlPanel from './pages/controlPanel.jsx';

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

const ADMIN = ['Administrator'];

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
				//Auth and Identity. El ProtectedRoute indica que si no hay una sesión activa, no se podrá acceder a esa vista y redirigirá al login
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="lostPassword" element={<LostPassword />} />
				<Route path="*" element={<NotFound />} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
				
				//Student and course catalog
                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<DetailsCourse />} />
				{/* <Route path="detailsCourse" element={<DetailsCourse />} /> */}
                <Route path="jobBoard" element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
                <Route path="detailsJob" element={<ProtectedRoute><DetailsJob /></ProtectedRoute>} />
				
				//Teacher
                <Route path="controlPanel" element={<ProtectedRoute><ControlPanel /></ProtectedRoute>} />
				
				//Global administration
                <Route path="controlPanelAdmin" element={<ProtectedRoute roles={ADMIN}><ControlPanelAdmin /></ProtectedRoute>} />
				
				// Courses management
                <Route path="createCourse" element={<ProtectedRoute roles={ADMIN}><CreateCourse /></ProtectedRoute>} />
                <Route path="editCourse/:id" element={<ProtectedRoute roles={ADMIN}><EditCourse /></ProtectedRoute>} />
				{/* <Route path="editCourse" element={<EditCourse />} /> */}
				
				// Teachers management
                <Route path="teachers" element={<ProtectedRoute roles={ADMIN}><Teachers /></ProtectedRoute>} />
                <Route path="createTeacher" element={<ProtectedRoute roles={ADMIN}><CreateTeacher /></ProtectedRoute>} />
                <Route path="editTeacher" element={<ProtectedRoute roles={ADMIN}><EditTeacher /></ProtectedRoute>} />
				
				// Students management
                <Route path="students" element={<ProtectedRoute roles={ADMIN}><Students /></ProtectedRoute>} />
				
				// Administrators management
				<Route path="admins" element={<ProtectedRoute roles={ADMIN}><Admins /></ProtectedRoute>} />
                <Route path="createAdmin" element={<ProtectedRoute roles={ADMIN}><CreateAdmin /></ProtectedRoute>} />
                <Route path="editAdmin" element={<ProtectedRoute roles={ADMIN}><EditAdmin /></ProtectedRoute>} />
            </Route>
        </Routes>
    );
}
