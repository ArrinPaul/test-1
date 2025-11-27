import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBlock, getLab } from '../lib/api';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
    const location = useLocation();
    const [crumbs, setCrumbs] = useState<{ label: string; path: string }[]>([]);

    useEffect(() => {
        const loadCrumbs = async () => {
            const path = location.pathname;
            const parts = path.split('/').filter(Boolean);
            const newCrumbs = [{ label: 'Home', path: '/' }];

            if (parts[0] === 'block' && parts[1]) {
                const block = await getBlock(parts[1]);
                if (block) {
                    newCrumbs.push({ label: block.label, path: `/block/${block.id}` });
                }
            } else if (parts[0] === 'lab' && parts[1]) {
                const lab = await getLab(parts[1]);
                if (lab) {
                    // Find block for this lab to add intermediate crumb
                    // This is inefficient but works for small manifests. 
                    // Ideally getLab returns parent block info or we pass it.
                    // For now, let's just show Home > Lab or Home > Block > Lab if we can find it.
                    // Since getLab doesn't return block, we might skip block level for lab view 
                    // OR we update getLab to return block info.
                    // Let's keep it simple: Home > Lab Name
                    newCrumbs.push({ label: lab.label, path: `/lab/${lab.id}` });
                }
            }

            setCrumbs(newCrumbs);
        };

        loadCrumbs();
    }, [location]);

    if (location.pathname === '/') return null;

    return (
        <nav className="flex items-center text-sm text-slate-500 mb-4">
            {crumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center">
                    {index > 0 && <ChevronRight size={14} className="mx-2" />}
                    <Link
                        to={crumb.path}
                        className={`hover:text-blue-600 transition-colors flex items-center ${index === crumbs.length - 1 ? 'font-semibold text-slate-800 pointer-events-none' : ''}`}
                    >
                        {index === 0 && <Home size={14} className="mr-1" />}
                        {crumb.label}
                    </Link>
                </div>
            ))}
        </nav>
    );
}
