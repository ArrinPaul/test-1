import { Outlet } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';

export default function AppShell() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
            <div className="absolute top-4 right-4 z-50">
                <GlobalSearch />
            </div>
            <Outlet />
        </div>
    );
}
