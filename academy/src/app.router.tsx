import { createBrowserRouter, Navigate } from "react-router-dom"; 
import { ShopLayout } from "./shop/layouts/ShopLayout";
import { HomePage } from "./shop/pages/HomePage";
// import { LoginPage } from "./auth/pages/LoginPage";
// import { DashboardPage } from "./admin/pages/DashboardPage";
// import { lazy } from "react";
import { CoursesPage } from "./shop/pages/CoursesPage";
import { ContactPage } from "./shop/pages/ContactPage";
import {AdminLayout} from "./admin/layouts/AdminLayout";
import { DashboardPage } from "./admin/pages/DashboardPage";
import { CourseSupportPage } from "./admin/pages/CourseSupportPage";
import { LoginAdminPage } from "./admin/pages/LoginAdminPage";
import { ProtectedRoute } from "./common/components/ProtectedRoute";
import { TabPage } from "./admin/pages/TabPage";


// const AuthLayout = lazy(()=> import('./auth/layouts/AuthLayout'))
// const AdminLayout = lazy(()=> import('./admin/layouts/AdminLayout'))
export const appRouter = createBrowserRouter([
    //Shop Routes
    {
        path: '/',
        element: <ShopLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: 'courses',
                element: <CoursesPage />
            },
            {
                path: 'contact',
                element: <ContactPage />
            }
        ]
    },

    // //Auth Routes
    // {
    //     path: '/auth',
    //     element: <AuthLayout/>,
    //     children: [
    //         {
    //             index: true,
    //             element: <Navigate to="/auth/login" />
    //         },
    //         {
    //             path: 'login',
    //             element: <LoginPage />
    //         }
    //     ]     
    // },
    //Admin Routes
    {
        path: '/administracion-del-sistema',        
        children: [
            {
                index: true,
                element: <LoginAdminPage/>
            },
            {
                element: <ProtectedRoute/>,
                children:[
                    {
                        element: <AdminLayout/>,
                        children: [
                            {
                                path: 'consola',
                                element: <DashboardPage/>
                            },
                            {
                                path: 'soporte-cursos',
                                element: <CourseSupportPage />
                            },
                            {
                                path: 'editor-tabs',
                                element: <TabPage />
                            }
                        ]
                    }
                ]
            },          
            {
                // Catches anything under /administracion-del-sistema/* that doesn't match above
                path: '*', 
                element: <Navigate to="/administracion-del-sistema" replace />
            }          
        ]
    },
    //Other Routes
    {
        path: '*',
        element: <Navigate to="/" />
    }
])