import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Target, ExternalLink } from "lucide-react";
import RoadmapImage from "./RoadmapImage";

export default function DetailModal({ isOpen, onClose, data }) {
    if (!data) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl shadow-purple-500/5"
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800/60 bg-gray-950/95 backdrop-blur-sm rounded-t-2xl">
                                <div>
                                    {data.day && (
                                        <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{data.day}</p>
                                    )}
                                    {data.week && (
                                        <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{data.week}</p>
                                    )}
                                    <h3 className="text-lg font-bold text-white mt-0.5 leading-tight">
                                        {data.task || data.title || "Details"}
                                    </h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-5 space-y-5">
                                {/* Meta badges */}
                                {(data.focus || data.timeEstimate) && (
                                    <div className="flex flex-wrap gap-2">
                                        {data.focus && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                                                <Target className="w-3 h-3" />
                                                {data.focus}
                                            </span>
                                        )}
                                        {data.timeEstimate && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
                                                <Clock className="w-3 h-3" />
                                                {data.timeEstimate}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Details / Description */}
                                {data.details && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Detailed Breakdown</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{data.details}</p>
                                    </div>
                                )}

                                {/* Steps if available */}
                                {data.steps?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Steps</h4>
                                        <div className="space-y-2">
                                            {data.steps.map((step, i) => (
                                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-800/40">
                                                    <span className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-300 grid place-items-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-sm text-gray-300">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Image */}
                                {data.imageQuery && (
                                    <div>
                                        <RoadmapImage query={data.imageQuery} />
                                    </div>
                                )}

                                {/* Resources */}
                                {data.resources?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Resources</h4>
                                        <div className="space-y-2">
                                            {data.resources.map((res, i) => {
                                                const typeColors = {
                                                    video: "bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20",
                                                    article: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20",
                                                    course: "bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20",
                                                    documentation: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20",
                                                };
                                                const tc = typeColors[res.type] || "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50";
                                                return (
                                                    <a
                                                        key={i}
                                                        href={res.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition ${tc}`}
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                                                        <span>{res.title}</span>
                                                        {res.type && (
                                                            <span className="ml-auto text-[10px] uppercase opacity-60">{res.type}</span>
                                                        )}
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
