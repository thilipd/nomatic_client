import { lazy, useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NProgress from 'nprogress'


const AppBar = lazy(() => import('../components/AppBar'));



function SuspenseLoader() {
    useEffect(() => {
        NProgress.start();

        return () => {
            NProgress.done();
        };
    }, []);

    return <></>;
}


const AppRoutes = () => {
    return (
        <Suspense fallback={<SuspenseLoader />} >

            <Routes>
                <Route path='/' element={<AppBar />} />
            </Routes>

        </Suspense>
    )
}

export default AppRoutes