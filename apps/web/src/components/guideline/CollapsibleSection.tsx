import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
    htmlContent: string;
    maxHeight?: number; // Maximum height in pixels before collapsing activates
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    htmlContent,
    maxHeight = 450
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCollapsible, setIsCollapsible] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if the content height exceeds the maxHeight threshold
        if (contentRef.current) {
            if (contentRef.current.scrollHeight > maxHeight) {
                setIsCollapsible(true);
            }
        }
    }, [htmlContent, maxHeight]);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    if (!htmlContent) return null;

    return (
        <div className="relative">
            <div
                ref={contentRef}
                className={`overflow-hidden transition-all duration-500 ease-in-out prose prose-slate prose-lg max-w-none
          prose-headings:text-navy-900 prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-slate-200
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-4
          prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-8 prose-h4:mb-3
          prose-p:text-slate-800 prose-p:leading-[1.8] prose-p:mb-5 empty:prose-p:hidden
          prose-strong:text-navy-900 prose-strong:font-bold
          prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:text-sm
          prose-th:bg-navy-50 prose-th:text-navy-900 prose-th:font-semibold prose-th:text-left prose-th:px-4 prose-th:py-3 prose-th:border prose-th:border-slate-300
          prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-slate-200 prose-td:text-slate-800 prose-tr:even:bg-slate-50
          prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-8 prose-img:max-h-[600px] prose-img:object-contain
          prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6
          prose-li:text-slate-800 prose-li:mb-2 prose-li:leading-[1.8]
          prose-a:text-navy-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-navy-800
        `}
                style={{
                    maxHeight: isCollapsible && !isExpanded ? `${maxHeight}px` : `${contentRef.current?.scrollHeight || 10000}px`
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Fade-out Gradient Overlay */}
            {isCollapsible && !isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}

            {/* Toggle Button */}
            {isCollapsible && (
                <div className="mt-1 flex justify-start pt-3 relative z-10 border-t border-slate-100">
                    <button
                        onClick={toggleExpand}
                        className="flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-800 transition-colors"
                    >
                        {isExpanded ? (
                            <>Show Less <ChevronUp className="w-4 h-4" /></>
                        ) : (
                            <>Read More <ChevronDown className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};
